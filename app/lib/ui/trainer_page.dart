import 'dart:async';

import 'package:flutter/material.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_trainer_runtime/ugk_trainer.dart' as sdk;

import '../control/learning_store.dart';
import '../data/catalog.dart';
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
    this.voiceOutput,
    this.keepAlive = true,
  });

  final uc.TrainingPlan plan;
  final Catalog catalog;
  final LearningStore store;
  final bool startInPreview;
  final bool previewLocked;
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
  sdk.SessionPhase? _feedbackPhase;
  sdk.TrainerRestFeedbackChoice? _feedbackChoice;
  ModalRoute<dynamic>? _route;
  sdk.SessionResult? _result;
  bool _sdkExitStarted = false;
  bool _returningEmptyResult = false;
  double _previewSwipeDistance = 0;

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

  Future<_PlayerData> _load(String language) async {
    final wristDirections = trainerWristDirections(
      AppLocalizations.of(context),
    );
    final active = sdk.TrainingMediaPolicyScope.read(context)?.catalog;
    final current = FlareShared.current;
    final shared = current != null && (active == null || active == current.pack)
        ? current
        : await FlareShared.load(activeCatalog: active);
    bool known(String id) => shared.catalog[id] != null;
    validateTrainingPlan(widget.plan, widget.catalog, known: known);
    // Layer the active Pose-Hub catalog's recorded prompts and structured
    // voice guides behind Flare's shared prompts. The SDK prefetches and
    // verifies the needed clips and retains the bundled fallback.
    final voice = await sdk.withPoseHubCatalogVoice(
      await loadTrainerVoiceSource(
        language: language,
        // TrainerPlayer uses its default right-first side sequence.
        leftFirst: false,
      ),
      catalog: shared.pack,
    );
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
      setState(() {
        _feedbackPhase = feedback.completedPhase;
        _feedbackChoice = choice;
      });
    }

    final panel = sdk.TrainerRestFeedbackPanel(
      theme: theme,
      title: title,
      description: description,
      recordedTitle: recorded,
      selected: identical(_feedbackPhase, feedback.completedPhase)
          ? _feedbackChoice
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
        sdk.TrainerDrill? drillOf(String id) {
          final language = Localizations.localeOf(context).languageCode;
          final drill = widget.catalog.drillById(id);
          final public = data.shared.catalog[id];
          final name = drill?.name ?? data.shared.nameOf(id, language);
          if (name == null) return null;
          final isV5 = id == flareV5DrillId;
          final poster = isV5
              ? flareV5PosterAsset
              : FlarePublicMedia.of(context)?.posterAssetFor(id);
          final timedWrist = timedWristRocks && id == 'forearms-A';
          return sdk.TrainerDrill(
            id: id,
            name: name,
            cue: timedWrist
                ? trainerTimedWristCue(s)
                : drill == null || drill.cues.isEmpty
                ? null
                : drill.cues.first,
            cues: !timedWrist && drill == null
                ? public?.cues['zh'] ?? const []
                : const [],
            precautions: [...?public?.cautions, ...?public?.contraindications],
            media: poster == null
                ? null
                : sdk.DrillMedia(
                    id: id,
                    actionId: id,
                    videoAsset: '',
                    posterAsset: poster,
                    duration: 0,
                    videoAvailable: !isV5,
                  ),
          );
        }

        return TooltipVisibility(
          visible: _result == null,
          child: Visibility(
            visible: !_returningEmptyResult,
            maintainState: true,
            child: _previewControls(
              sdk.TrainerPlayer(
                plan: data.plan,
                rhythms: data.rhythms,
                drillOf: drillOf,
                strings: strings,
                theme: theme,
                prepSeconds: _initialCountdownSeconds,
                startGate: _previewStartGate?.future,
                voice: sdk.TrainerVoice(
                  source: data.source,
                  output: _output!,
                  settings: sdk.VoiceSettings(
                    language: data.language,
                    voice: widget.store.settings.sound,
                    chimes: widget.store.settings.sound,
                  ),
                ),
                onFinished: _saveResult,
                onExitStarted: _onExitStarted,
                onCompleted: (_) async {
                  // Replay runs in this route with fresh training controls.
                  if (!_sdkExitStarted && mounted) {
                    setState(() => _result = null);
                  }
                  _sdkExitStarted = false;
                },
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
              strings,
            ),
          ),
        );
      },
    );
  }
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
