import 'package:flutter/material.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_trainer_runtime/ugk_trainer.dart' as sdk;

import '../control/learning_store.dart';
import '../data/catalog.dart';
import '../data/flare_public_media.dart';
import '../data/flare_shared_library.dart';
import '../l10n/app_localizations.dart';
import '../trainer/trainer_audio.dart';
import '../trainer/trainer_strings.dart';
import '../trainer/trainer_theme.dart';
import '../trainer/trainer_voice.dart';
import '../trainer/training_plan_adapter.dart';

/// Opened through the SDK TrainerLauncher: TrainerPlayer owns back/finish,
/// poster entry and on-demand public media, and returns one immutable SDK
/// SessionResult. This host supplies Flare dose, strings, voice and saving.
class FlareTrainingPage extends StatefulWidget {
  const FlareTrainingPage({
    super.key,
    required this.plan,
    required this.catalog,
    required this.store,
    this.voiceOutput,
    this.keepAlive = true,
  });

  final uc.TrainingPlan plan;
  final Catalog catalog;
  final LearningStore store;
  @visibleForTesting
  final sdk.VoiceOutput? voiceOutput;
  @visibleForTesting
  final bool keepAlive;

  @override
  State<FlareTrainingPage> createState() => _FlareTrainingPageState();
}

class _FlareTrainingPageState extends State<FlareTrainingPage> {
  Future<_PlayerData>? _loading;
  sdk.VoiceOutput? _output;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _loading ??= _load(Localizations.localeOf(context).languageCode);
  }

  Future<_PlayerData> _load(String language) async {
    final wristDirections = trainerWristDirections(
      AppLocalizations.of(context),
    );
    final shared = FlareShared.current ?? await FlareShared.load();
    bool known(String id) => shared.catalog[id] != null;
    validateTrainingPlan(widget.plan, widget.catalog, known: known);
    // SDK: the active Pose-Hub catalogue's recorded name / key point behind
    // Flare's shared prompts (downloaded + verified on demand); the player
    // prefetches the plan's lines and sizes the prep phase to the intro.
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
    final item = phase.item;
    if (item == null) return null;
    // Let SDK 0.2 display the current segment's own dose/label and resolve its
    // exerciseId. A parent amount can differ from the current segment amount.
    if (item.segments.isNotEmpty) return null;
    if (item.exerciseId != 'forearms-C' || item.mode != uc.DoseMode.time) {
      return null;
    }
    final s = AppLocalizations.of(context);
    return '${s.secondsLabel(item.workSeconds!)} · ${item.note ?? widget.catalog.drillById(item.exerciseId)!.prescription}';
  }

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context);
    return FutureBuilder<_PlayerData>(
      future: _loading,
      builder: (context, snapshot) {
        if (snapshot.hasError) {
          final error = snapshot.error;
          return Scaffold(
            appBar: AppBar(title: Text(widget.plan.title)),
            body: Center(
              child: Padding(
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
            ),
          );
        }
        final data = snapshot.data;
        if (data == null) {
          return Scaffold(
            appBar: AppBar(title: Text(widget.plan.title)),
            body: const Center(child: CircularProgressIndicator()),
          );
        }
        _output ??= widget.voiceOutput ?? trainerAudio.acquire();
        return sdk.TrainerPlayer(
          plan: data.plan,
          rhythms: data.rhythms,
          drillOf: (id) {
            final language = Localizations.localeOf(context).languageCode;
            final drill = widget.catalog.drillById(id);
            final public = data.shared.catalog[id];
            final name = drill?.name ?? data.shared.nameOf(id, language);
            if (name == null) return null;
            final poster = FlarePublicMedia.current?.posterAssetFor(id);
            return sdk.TrainerDrill(
              id: id,
              name: name,
              cue: drill == null || drill.cues.isEmpty
                  ? null
                  : drill.cues.first,
              cues: drill == null ? public?.cues['zh'] ?? const [] : const [],
              precautions: [
                ...?public?.cautions,
                ...?public?.contraindications,
              ],
              media: poster == null
                  ? null
                  : sdk.DrillMedia(
                      id: id,
                      actionId: id,
                      videoAsset: '',
                      posterAsset: poster,
                      duration: 0,
                    ),
            );
          },
          strings: trainerStrings(s),
          theme: trainerTheme(context),
          voice: sdk.TrainerVoice(
            source: data.source,
            output: _output!,
            settings: sdk.VoiceSettings(
              language: data.language,
              voice: widget.store.settings.sound,
              chimes: widget.store.settings.sound,
            ),
          ),
          onFinished: widget.store.saveTrainerSession,
          keepAlive: widget.keepAlive,
          showExtendRest: true,
          showCompleteTimedPhase: true,
          showSoundToggle: true,
          notificationIcon: 'mipmap/ic_launcher',
          doseLabel: _doseLabel,
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
