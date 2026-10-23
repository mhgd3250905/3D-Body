import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_trainer/ugk_trainer.dart' as sdk;

import '../control/learning_store.dart';
import '../data/catalog.dart';
import '../l10n/app_localizations.dart';
import '../trainer/trainer_audio.dart';
import '../trainer/trainer_strings.dart';
import '../trainer/trainer_theme.dart';
import '../trainer/trainer_voice.dart';
import '../trainer/training_plan_adapter.dart';
import 'drill_media.dart';

/// Push on its own Navigator route: TrainerPlayer owns back/finish and returns
/// one immutable SDK SessionResult. This host supplies data and public slots.
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
    validateTrainingPlan(widget.plan, widget.catalog);
    final sourceCatalog = uc.Catalog.fromJson(
      jsonDecode(await rootBundle.loadString('assets/coach/catalog.json')),
    );
    final missing = widget.plan.exerciseIds
        .where((id) => sourceCatalog[id] == null)
        .toList();
    if (missing.isNotEmpty) throw UnknownTrainingDrills(missing);
    final voice = await loadTrainerVoiceSource(
      language: language,
      // TrainerPlayer uses its default right-first side sequence.
      leftFirst: false,
    );
    return _PlayerData(
      plan: expandSegmentedTrainingPlan(
        widget.plan,
        widget.catalog,
        wristDirections: wristDirections,
      ),
      rhythms: sdk.rhythmsFromCatalog(sourceCatalog),
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
            final drill = widget.catalog.drillById(id);
            return drill == null
                ? null
                : sdk.TrainerDrill(
                    id: drill.id,
                    name: drill.name,
                    cue: drill.cues.isEmpty ? null : drill.cues.first,
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
          mediaBuilder: (context, request) => DrillMediaCard(
            key: ValueKey(request.drill.id),
            drillId: request.drill.id,
            active: !request.paused,
            mirrored: request.mirrored,
            autoPlay: true,
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
  });
  final uc.TrainingPlan plan;
  final Map<String, sdk.Rhythm> rhythms;
  final sdk.VoiceSource source;
  final String language;
}
