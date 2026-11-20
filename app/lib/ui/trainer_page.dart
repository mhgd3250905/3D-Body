import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_trainer_runtime/ugk_trainer.dart' as sdk;

import '../control/learning_store.dart';
import '../data/catalog.dart';
import '../data/flare_offline_media.dart';
import '../data/flare_public_media.dart';
import '../data/flare_shared_library.dart';
import '../data/flare_v5_drill.dart';
import '../l10n/app_localizations.dart';
import '../trainer/trainer_audio.dart';
import '../trainer/trainer_strings.dart';
import '../trainer/trainer_theme.dart';
import '../trainer/trainer_voice.dart';
import '../trainer/training_plan_adapter.dart';
import 'flare_v5_media.dart';
import 'page_kit.dart';
import 'theme.dart';

/// Opened through the SDK TrainerLauncher: TrainerPlayer owns back/finish,
/// poster entry and on-demand public media, and returns one immutable SDK
/// SessionResult. This host supplies Flare dose, strings, voice and saving.
class FlareTrainingPage extends StatefulWidget {
  const FlareTrainingPage({
    super.key,
    required this.plan,
    required this.catalog,
    required this.store,
    this.startInPreview = false,
    this.previewLocked = false,
    this.supplementalPlan,
    this.onContinueCooldown,
    this.voiceOutput,
    this.keepAlive = true,
  });

  final uc.TrainingPlan plan;
  final Catalog catalog;
  final LearningStore store;
  final bool startInPreview;
  final bool previewLocked;
  final FlarePlan? supplementalPlan;

  /// Records the user's next destination once the SDK accepts the saved result.
  /// The opener can then navigate after the SDK route finishes closing.
  final VoidCallback? onContinueCooldown;
  @visibleForTesting
  final sdk.VoiceOutput? voiceOutput;
  @visibleForTesting
  final bool keepAlive;

  @override
  State<FlareTrainingPage> createState() => _FlareTrainingPageState();
}

class _FlareTrainingPageState extends State<FlareTrainingPage> {
  static const _initialCountdownSeconds = 10;
  Future<_PlayerData>? _loading;
  sdk.VoiceOutput? _output;
  final _restSelection =
      ValueNotifier<
        ({sdk.SessionPhase phase, sdk.TrainerRestFeedbackChoice choice})?
      >(null);
  ModalRoute<dynamic>? _route;
  sdk.SessionResult? _result;
  bool _sdkExitStarted = false;
  bool _returningEmptyResult = false;
  double _previewSwipeDistance = 0;
  VoidCallback? _completionReplay;
  bool _continueAfterFinish = false;

  // Keep the same V1 player mounted across unlock and Start. Its gate idles
  // the session clock, voice and history, without selecting the legacy stage.
  late final _previewStartGate = widget.startInPreview || widget.previewLocked
      ? Completer<void>()
      : null;

  bool get _awaitingPreviewStart => _previewStartGate?.isCompleted == false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _route = ModalRoute.of(context);
    _loading ??= _load(Localizations.localeOf(context).languageCode);
  }

  @override
  void dispose() {
    _restSelection.dispose();
    super.dispose();
  }

  bool get _isCurrentRoute => mounted && _route?.isCurrent == true;

  void _onExitStarted() {
    _sdkExitStarted = true;
    sdk.TrainerExperienceScope.read(context)?.control.beginExit();
  }

  Future<void> _saveResult(sdk.SessionResult result) async {
    if (widget.previewLocked) return;
    final returnEmpty = result.completedExercises == 0 && !_sdkExitStarted;
    if (_isCurrentRoute) {
      // The SDK's training controls can have a tooltip in the route overlay
      // when the completion view replaces the player stage.
      Tooltip.dismissAllToolTips();
      setState(() {
        _result = result;
        _returningEmptyResult = returnEmpty;
      });
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (_isCurrentRoute && _result?.sessionId == result.sessionId) {
          Tooltip.dismissAllToolTips();
        }
      });
    }
    try {
      await widget.store.saveTrainerSession(result);
    } catch (_) {
      // Re-expose the SDK's save retry if the direct return must wait.
      if (mounted && _returningEmptyResult) {
        setState(() => _returningEmptyResult = false);
      }
      rethrow;
    }
    if (!returnEmpty ||
        _sdkExitStarted ||
        !mounted ||
        _route?.isCurrent != true) {
      return;
    }
    final experience = sdk.TrainerExperienceScope.read(context);
    await experience?.control.beforeExitPop();
    if (_isCurrentRoute && !_sdkExitStarted) _route?.navigator?.pop(result);
  }

  late final _authoredItems = {
    for (final item
        in widget.supplementalPlan?.allItems ?? const <FlarePlanItem>[])
      for (final alias in item.trainingMediaIdsForScene('A').entries)
        alias.key: (item: item, media: alias.value),
  };

  String _mediaId(String exerciseId) =>
      _authoredItems[exerciseId]?.media ?? exerciseId;

  Future<_PlayerData> _load(String language) async {
    final wristDirections = trainerWristDirections(
      AppLocalizations.of(context),
    );
    final active = sdk.TrainingMediaPolicyScope.read(context)?.catalog;
    final current = FlareShared.current;
    final shared = current != null && (active == null || active == current.pack)
        ? current
        : await FlareShared.load(activeCatalog: active);
    bool known(String id) => shared.catalog[_mediaId(id)] != null;
    validateTrainingPlan(widget.plan, widget.catalog, known: known);
    // Layer the active Pose-Hub catalog's recorded prompts and structured
    // voice guides behind Flare's shared prompts. The SDK prefetches and
    // verifies the needed clips and retains the bundled fallback.
    var voice = await FlareOfflineMedia.withCatalogVoice(
      await loadTrainerVoiceSource(
        language: language,
        // TrainerPlayer uses its default right-first side sequence.
        leftFirst: false,
      ),
      catalog: shared.pack,
    );
    if (widget.supplementalPlan case final supplemental?) {
      voice = await withSupplementalTrainerVoice(
        voice,
        supplemental,
        language: language,
      );
    }
    return _PlayerData(
      plan: expandSegmentedTrainingPlan(
        widget.plan,
        widget.catalog,
        wristDirections: wristDirections,
        known: known,
      ),
      rhythms: shared.rhythms,
      shared: shared,
      source: voice,
      language: language,
    );
  }

  String? _doseLabel(sdk.SessionPhase phase) {
    final s = AppLocalizations.of(context);
    // The SDK V1 header retains the just-finished move during a transition.
    // Show the rest length there; the dock pairs the next move with its dose.
    if (phase.nextItem != null &&
        (phase.kind == sdk.PhaseKind.rest ||
            phase.kind == sdk.PhaseKind.roundRest)) {
      return s.secondsLabel(phase.seconds.ceil());
    }
    final item = phase.item;
    if (item == null) return null;
    // Let SDK 0.2 display the current segment's own dose/label and resolve its
    // exerciseId. A parent amount can differ from the current segment amount.
    if (item.segments.isNotEmpty) return null;
    if (item.exerciseId != 'forearms-C' || item.mode != uc.DoseMode.time) {
      return null;
    }
    return '${s.secondsLabel(item.workSeconds!)} · ${item.note ?? widget.catalog.drillById(item.exerciseId)!.prescription}';
  }

  Widget _restFeedback(
    BuildContext context,
    sdk.TrainerRestFeedback feedback,
    sdk.TrainerTheme theme,
    sdk.TrainerStrings strings,
    sdk.TrainerDrill? Function(String) drillOf,
  ) {
    final s = AppLocalizations.of(context);
    final (title, description, recorded, comfortable, tight, pain) =
        trainerRestFeedbackLabels(s);
    void select(sdk.TrainerRestFeedbackChoice choice) {
      _restSelection.value = (phase: feedback.completedPhase, choice: choice);
    }

    final panel = ValueListenableBuilder(
      valueListenable: _restSelection,
      builder: (context, selection, _) => sdk.TrainerRestFeedbackPanel(
        theme: theme,
        title: title,
        description: description,
        recordedTitle: recorded,
        selected: identical(selection?.phase, feedback.completedPhase)
            ? selection?.choice
            : null,
        comfortableLabel: comfortable,
        onComfortable: () => select(sdk.TrainerRestFeedbackChoice.comfortable),
        tightLabel: tight,
        onTight: () => select(sdk.TrainerRestFeedbackChoice.tight),
        painLabel: pain,
        onPain: () async {
          select(sdk.TrainerRestFeedbackChoice.pain);
          await feedback.reportDiscomfort();
        },
      ),
    );
    final next = feedback.phase.nextItem;
    if (next == null) return panel;
    final move = drillOf(next.exerciseId);
    if (move == null) return panel;
    final reps = next.mode == uc.DoseMode.reps;
    final dose = strings.dose(
      reps: reps,
      amount: reps ? (next.reps ?? 10) : (next.workSeconds ?? 30),
      perSide: next.perSide,
    );
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        sdk.TrainerSurface(
          key: const ValueKey('flare-rest-next'),
          theme: theme,
          level: sdk.TrainerSurfaceLevel.control,
          radius: 14,
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          child: Text.rich(
            TextSpan(
              text: '${s.planNext} · ',
              children: [
                TextSpan(
                  text: move.name,
                  style: theme.callout.copyWith(
                    fontWeight: FontWeight.w700,
                    color: theme.text,
                  ),
                ),
                TextSpan(text: ' · $dose'),
              ],
            ),
            style: theme.callout.copyWith(color: theme.sub),
          ),
        ),
        const SizedBox(height: 10),
        panel,
      ],
    );
  }

  Widget _loadPage(BuildContext context, Widget child) => Scaffold(
    body: FlareNavPage(
      title: widget.plan.title,
      blurBackdrop: false,
      onBack: () => Navigator.maybePop(context),
      body: SafeArea(
        top: false,
        child: Padding(
          padding: EdgeInsets.only(top: flareNavInset(context)),
          child: Center(child: child),
        ),
      ),
    ),
  );

  void _closePreview() {
    if (_isCurrentRoute) Navigator.maybePop(context);
  }

  void _startPreview() {
    if (widget.previewLocked || !_awaitingPreviewStart) return;
    setState(() => _previewStartGate!.complete());
  }

  Widget _previewControls(Widget player, sdk.TrainerStrings strings) {
    if (_previewStartGate == null) return player;
    return Stack(
      fit: StackFit.expand,
      children: [
        ExcludeFocus(excluding: widget.previewLocked, child: player),
        if (_awaitingPreviewStart)
          Positioned(
            left: 0,
            top: 0,
            bottom: 0,
            width: 24,
            child: GestureDetector(
              behavior: HitTestBehavior.translucent,
              excludeFromSemantics: true,
              onHorizontalDragStart: (_) => _previewSwipeDistance = 0,
              onHorizontalDragUpdate: (details) {
                _previewSwipeDistance += details.delta.dx;
              },
              onHorizontalDragEnd: (details) {
                final fast = (details.primaryVelocity ?? 0) >= 700;
                if (_previewSwipeDistance >= 64 ||
                    (_previewSwipeDistance >= 12 && fast)) {
                  _closePreview();
                }
              },
            ),
          ),
        if (_awaitingPreviewStart && !widget.previewLocked)
          Positioned(
            left: 20,
            right: 20,
            bottom: MediaQuery.paddingOf(context).bottom + 20,
            child: FlareBottomButton(
              key: const ValueKey('start-training'),
              label: strings.startTraining,
              icon: Icons.play_arrow_rounded,
              height: 56,
              onPressed: _startPreview,
            ),
          ),
      ],
    );
  }

  bool get _offersCooldown =>
      widget.onContinueCooldown != null && widget.supplementalPlan == null;

  Widget _bindCompletionReplay(
    BuildContext context,
    sdk.SessionResult result,
    VoidCallback replay,
  ) {
    // The SDK only invokes this builder after its automatic save succeeds.
    // Publish the action after build without re-entering the SDK's subtree.
    if (_completionReplay != replay) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (_isCurrentRoute &&
            _result?.sessionId == result.sessionId &&
            result.completedExercises > 0 &&
            _completionReplay != replay) {
          setState(() => _completionReplay = replay);
        }
      });
    }
    return const SizedBox.shrink();
  }

  Future<void> _finishWithCooldown() async {
    if (!_isCurrentRoute || _sdkExitStarted || _continueAfterFinish) return;
    setState(() => _continueAfterFinish = true);
    // TrainerPlayer's PopScope owns the saved result, the completion receipt
    // and the audio/media exit animation. Going through it is the Finish path.
    final handled = await Navigator.maybePop(context);
    if (!handled && _isCurrentRoute) {
      setState(() => _continueAfterFinish = false);
    }
  }

  Future<void> _completeResult(sdk.SessionResult _) async {
    if (_sdkExitStarted) {
      if (_continueAfterFinish && _isCurrentRoute) {
        widget.onContinueCooldown?.call();
      }
    } else if (mounted) {
      // Replay runs in this route with a fresh session and completion receipt.
      setState(() {
        _result = null;
        _completionReplay = null;
        _continueAfterFinish = false;
      });
    }
    _sdkExitStarted = false;
  }

  Widget _completionFooter(
    Widget player,
    sdk.TrainerTheme theme,
    sdk.TrainerStrings strings,
    String label,
  ) {
    if (!_offersCooldown) return player;
    final replay = _completionReplay;
    final open = replay != null && !widget.previewLocked;
    final safe = MediaQuery.paddingOf(context);
    final palette = theme.isDark ? FlarePalette.dark : FlarePalette.light;
    final style = TextStyle(
      fontFamily: theme.fontFamily,
      fontSize: 14,
      fontWeight: FontWeight.w400,
      height: 1.35,
    );
    final material = Theme.of(context);
    final scaledLabel = MediaQuery.textScalerOf(context).scale(14) * 1.35;
    final minTouchHeight =
        material.materialTapTargetSize == MaterialTapTargetSize.padded
        ? kMinInteractiveDimension
        : 40.0;
    final replayHeight = math.max(
      minTouchHeight + material.visualDensity.baseSizeAdjustment.dy,
      scaledLabel.ceilToDouble(),
    );
    const buttonHeight = 48.0;
    const buttonGap = 10.0;
    const extra = buttonHeight + buttonGap;

    // v1 has one fixed replay row under Finish and no footer slot. Keep the
    // SDK page, including Finish, in place and host that replay action below
    // Flare's new action. Clip only the original replay row to avoid duplicate
    // touch targets. This also reserves scroll space for the larger footer.
    return ColoredBox(
      color: open ? theme.background : Colors.transparent,
      child: Stack(
        fit: StackFit.expand,
        children: [
          Positioned.fill(
            bottom: open ? extra : 0,
            child: ClipRect(
              clipBehavior: open ? Clip.hardEdge : Clip.none,
              clipper: open
                  ? _TrainerReplayRowClip(safe.bottom + replayHeight)
                  : null,
              child: player,
            ),
          ),
          if (open)
            Positioned(
              left: math.max(20, safe.left),
              right: math.max(20, safe.right),
              bottom: safe.bottom,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: buttonGap),
                  SizedBox(
                    height: buttonHeight,
                    child: OutlinedButton(
                      key: const ValueKey('continue-cooldown'),
                      onPressed: _continueAfterFinish
                          ? null
                          : _finishWithCooldown,
                      style: OutlinedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        foregroundColor: theme.text,
                        side: BorderSide(color: palette.hairline),
                        shape: const RoundedRectangleBorder(
                          borderRadius: BorderRadius.all(Radius.circular(24)),
                        ),
                        textStyle: style.copyWith(fontSize: 15),
                      ),
                      child: FittedBox(
                        fit: BoxFit.scaleDown,
                        child: Text(label),
                      ),
                    ),
                  ),
                  SizedBox(
                    height: replayHeight,
                    child: Center(
                      child: TextButton(
                        key: const ValueKey('flare-completion-replay'),
                        onPressed: _continueAfterFinish ? null : replay,
                        style: TextButton.styleFrom(
                          foregroundColor: theme.sub,
                          disabledForegroundColor: theme.sub,
                          textStyle: style,
                        ),
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Text(strings.replay),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _media(BuildContext context, sdk.TrainerMediaRequest request) {
    final drill = request.drill;
    final experience = sdk.TrainerExperienceScope.maybeOf(context);
    final stage = request.theme.mediaStage;
    final media = drill.media;
    final id = media?.actionId ?? drill.id;
    Widget poster(String asset) => sdk.TrainerPoster(
      asset: asset,
      bundle: experience?.bundle,
      decodeWidth: experience?.decodeWidth,
      mirrored: request.mirrored,
      radius: 0,
      stageColor: stage,
    );

    final canPlay = request.canPlay && !_awaitingPreviewStart;

    if (drill.id == flareV5DrillId) {
      return canPlay
          ? FlareV5Media(
              key: const ValueKey('flare-v5-training-media'),
              speed: widget.store.settings.speed,
              playing: !request.paused,
              mirrored: request.mirrored,
              fallback: poster(flareV5PosterAsset),
              background: stage,
            )
          : poster(flareV5PosterAsset);
    }

    // For other exercises in the same plan, preserve the SDK's public media
    // path, including its cache queue and shared download/decoder indicator.
    final policy = sdk.TrainingMediaPolicyScope.maybeOf(context);
    if (policy != null) {
      if (media?.videoAvailable == false) {
        final asset = policy.posterAssetFor(id);
        return asset == null ? ColoredBox(color: stage) : poster(asset);
      }
      return sdk.TrainingActionMedia(
        key: const ValueKey('player-public-media'),
        showInlineStatus: false,
        actionId: id,
        policy: policy,
        prefetchWhenIdle: !_awaitingPreviewStart,
        playing: canPlay,
        paused: request.paused,
        mirrored: request.mirrored,
        radius: 0,
        stage: stage,
        playbackHandle: request.playbackHandle,
      );
    }
    if (_awaitingPreviewStart || experience != null && !canPlay) {
      final asset =
          media?.posterFor(light: !request.theme.isDark) ??
          experience?.firstPosterAsset ??
          (_awaitingPreviewStart ? FlarePublicMedia.coverAssetFor(id) : null);
      return switch (asset) {
        final String path when path.isNotEmpty => poster(path),
        _ => ColoredBox(color: stage),
      };
    }
    if (media == null) return ColoredBox(color: stage);
    return sdk.DrillMediaView(
      key: const ValueKey('player-media'),
      media: media,
      paused: request.paused,
      mirrored: request.mirrored,
      radius: 0,
      stage: stage,
      errorLabel: request.strings.mediaUnavailable,
      errorColor: request.theme.muted,
      playbackHandle: request.playbackHandle,
    );
  }

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context);
    return FutureBuilder<_PlayerData>(
      future: _loading,
      builder: (context, snapshot) {
        if (snapshot.hasError) {
          final error = snapshot.error;
          return _loadPage(
            context,
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(trainerLoadFailed(s)),
                  if (error is UnknownTrainingDrills)
                    Text(
                      '${trainerMoveUnavailable(s)}: ${error.ids.join(', ')}',
                    ),
                  const SizedBox(height: 16),
                  FilledButton(
                    onPressed: () => setState(() {
                      _loading = _load(
                        Localizations.localeOf(context).languageCode,
                      );
                    }),
                    child: Text(s.retry),
                  ),
                ],
              ),
            ),
          );
        }
        final data = snapshot.data;
        if (data == null) {
          return _loadPage(context, const CircularProgressIndicator());
        }
        _output ??= widget.voiceOutput ?? trainerAudio.acquire();
        final theme = trainerTheme(context);
        final first = data.plan.items.first;
        final strings = trainerStrings(
          s,
          result: _result,
          prepFirst: _awaitingPreviewStart
              ? '${s.setsLabel(1, first.sets)} · ${s.countdown} ${s.secondsLabel(_initialCountdownSeconds)}'
              : null,
        );
        final timedWristRocks = data.plan.items.any(
          (item) =>
              item.exerciseId == 'forearms-A' &&
              item.mode == uc.DoseMode.time &&
              item.segments.length == 4 &&
              item.segments.every((segment) => segment.workSeconds == 15),
        );
        final language = Localizations.localeOf(context).languageCode;
        final policy = FlarePublicMedia.of(context);
        // The player's clock and media priority callbacks request the same
        // action repeatedly. Refresh the descriptors when the host rebuilds.
        final drills = <String, sdk.TrainerDrill?>{};
        sdk.TrainerDrill? drillOf(String id) => drills.putIfAbsent(id, () {
          final mediaId = _mediaId(id);
          final drill = widget.catalog.drillById(mediaId);
          final public = data.shared.catalog[mediaId];
          final authored = _authoredItems[id]?.item;
          final pnf = authored?.pnfTrainingIdForScene('A') == id;
          final placeholder = authored?.usesPlaceholderDemo == true;
          final displayName = language == 'zh'
              ? authored?.displayName
              : authored?.displayNameEn;
          final name =
              displayName ??
              drill?.name ??
              data.shared.nameOf(mediaId, language);
          if (name == null) return null;
          final isV5 = id == flareV5DrillId;
          final poster = isV5
              ? flareV5PosterAsset
              : policy?.posterAssetFor(mediaId);
          final timedWrist = timedWristRocks && id == 'forearms-A';
          final authoredCue = language != 'zh'
              ? null
              : pnf
              ? flareCooldownPnfCue
              : authored?.voiceCue;
          final cue = switch ((placeholder, authoredCue)) {
            (true, final String text) => '${s.temporaryPlanDemo} · $text',
            (true, null) => s.temporaryPlanDemo,
            (_, final String text) => text,
            _ when timedWrist => trainerTimedWristCue(s),
            _ => drill?.cues.firstOrNull,
          };
          return sdk.TrainerDrill(
            id: id,
            name: name,
            cue: cue,
            cues:
                authoredCue == null &&
                    !placeholder &&
                    !timedWrist &&
                    drill == null
                ? public?.cues['zh'] ?? const []
                : const [],
            precautions: [
              if (language == 'zh') ?authored?.safetyNote,
              if (!(placeholder && authored?.safetyNote != null)) ...[
                ...?public?.cautions,
                ...?public?.contraindications,
              ],
            ],
            media: poster == null
                ? null
                : sdk.DrillMedia(
                    id: id,
                    actionId: mediaId,
                    videoAsset: '',
                    posterAsset: poster,
                    duration: 0,
                    videoAvailable: !isV5,
                  ),
          );
        });

        final authored = widget.supplementalPlan;
        final cooldown = authored?.kind == FlarePlanKind.cooldown
            ? authored
            : null;
        final sound = widget.store.settings.sound;
        final cooldownScript = cooldown == null
            ? null
            : buildCooldownTrainerScript(data.source, data.language);
        final sessionBuilder = cooldown == null || cooldownScript == null
            ? null
            : FlareCooldownSessionBuilder(
                strengtheningRestSeconds: cooldown.strengtheningRestSeconds,
                rhythms: data.rhythms,
                known: (id) => drillOf(id) != null,
                prepSeconds: _initialCountdownSeconds,
                switchSecondsFor: cooldownScript.switchSecondsFor,
                prepSecondsFor: sound ? cooldownScript.prepSecondsFor : null,
                voiceGuideFor: data.source.voiceGuide,
                guideSideSwitchSecondsFor: data.source.sideSwitchSecondsFor,
              );
        return TooltipVisibility(
          visible: _result == null,
          child: Visibility(
            visible: !_returningEmptyResult,
            maintainState: true,
            child: _previewControls(
              _completionFooter(
                sdk.TrainerPlayer(
                  plan: data.plan,
                  rhythms: data.rhythms,
                  drillOf: drillOf,
                  strings: strings,
                  theme: theme,
                  prepSeconds: _initialCountdownSeconds,
                  sessionBuilder: sessionBuilder,
                  transitionSeconds:
                      widget.supplementalPlan?.kind == FlarePlanKind.warmup
                      ? flareWarmupTransitionSeconds
                      : 15,
                  startGate: _previewStartGate?.future,
                  voice: sdk.TrainerVoice(
                    source: data.source,
                    output: _output!,
                    scriptBuilder: cooldown == null
                        ? null
                        : buildCooldownTrainerScript,
                    settings: sdk.VoiceSettings(
                      language: data.language,
                      voice: sound,
                      chimes: sound,
                    ),
                  ),
                  onFinished: _saveResult,
                  onExitStarted: _onExitStarted,
                  onCompleted: _completeResult,
                  replayBuilder: _offersCooldown ? _bindCompletionReplay : null,
                  restFeedbackBuilder: (context, feedback) =>
                      _restFeedback(context, feedback, theme, strings, drillOf),
                  keepAlive: widget.keepAlive,
                  showExtendRest: true,
                  showCompleteTimedPhase: true,
                  showSoundToggle: true,
                  notificationIcon: 'mipmap/ic_launcher',
                  doseLabel: _doseLabel,
                  mediaBuilder:
                      _previewStartGate != null ||
                          data.plan.exerciseIds.contains(flareV5DrillId)
                      ? _media
                      : null,
                ),
                theme,
                strings,
                s.continuePostWorkoutStretch,
              ),
              strings,
            ),
          ),
        );
      },
    );
  }
}

class _TrainerReplayRowClip extends CustomClipper<Rect> {
  const _TrainerReplayRowClip(this.height);

  final double height;

  @override
  Rect getClip(Size size) =>
      Rect.fromLTWH(0, 0, size.width, math.max(0, size.height - height));

  @override
  bool shouldReclip(_TrainerReplayRowClip oldClipper) =>
      oldClipper.height != height;
}

class _PlayerData {
  const _PlayerData({
    required this.plan,
    required this.rhythms,
    required this.source,
    required this.language,
    required this.shared,
  });
  final uc.TrainingPlan plan;
  final Map<String, sdk.Rhythm> rhythms;
  final sdk.VoiceSource source;
  final String language;
  final FlareShared shared;
}
