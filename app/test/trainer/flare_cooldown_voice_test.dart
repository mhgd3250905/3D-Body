import 'package:flare/data/catalog.dart';
import 'package:flare/data/flare_shared_library.dart';
import 'package:flare/trainer/trainer_voice.dart';
import 'package:flare/trainer/training_plan_adapter.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_trainer_runtime/ugk_trainer.dart' as sdk;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test(
    'the cooldown player schedules each authored guide and timed PNF',
    () async {
      final catalog = await Catalog.load();
      final shared = await FlareShared.load();
      final voiceBase = await sdk.withPoseHubCatalogVoice(
        await loadTrainerVoiceSource(language: 'zh', leftFirst: false),
        catalog: shared.pack,
      );
      for (final plan in catalog.flareCooldownPlans) {
        final source = await withSupplementalTrainerVoice(
          voiceBase,
          plan,
          language: 'zh',
        );
        final script = buildCooldownTrainerScript(source, 'zh');
        final mediaIds = {
          for (final item in plan.allItems)
            ...item.trainingMediaIdsForScene('A'),
        };
        bool known(String id) => shared.catalog[mediaIds[id] ?? id] != null;
        final builder = FlareCooldownSessionBuilder(
          strengtheningRestSeconds: plan.strengtheningRestSeconds,
          rhythms: shared.rhythms,
          known: known,
          prepSeconds: 10,
          switchSecondsFor: script.switchSecondsFor,
          prepSecondsFor: script.prepSecondsFor,
          voiceGuideFor: source.voiceGuide,
          guideSideSwitchSecondsFor: source.sideSwitchSecondsFor,
        );
        double? fullDuration;
        for (final skip in [false, true]) {
          final session = expandSegmentedTrainingPlan(
            shared.authoredPlan(plan, catalog, 'A', skipStrengthening: skip),
            catalog,
            known: known,
          );
          final phases = builder.phases(session);
          final seconds = phases.fold(0.0, (sum, p) => sum + p.seconds);
          final clips = phases
              .expand((p) => script.cues(p, planSeconds: seconds))
              .expand((v) => v.voiceClips)
              .toSet();
          if (skip) {
            expect(seconds, lessThan(fullDuration!));
          } else {
            fullDuration = seconds;
          }
          for (final item in skip ? plan.items : plan.allItems) {
            final key = item.voiceKey!;
            expect(clips, contains(key), reason: '${plan.id} ${item.drill}');
            expect(source.line(key, lang: 'zh'), item.voiceCue);
            final bytes = await rootBundle.load(source.asset(key, lang: 'zh'));
            expect(bytes.lengthInBytes, greaterThan(0));
          }
          final pnf = phases.where(
            (phase) => phase.isWork && phase.segmentId == 'pnf-press',
          );
          if (plan.tier == 3) {
            expect(pnf, hasLength(4));
            for (final phase in pnf) {
              expect(phase.seconds, 5);
              final cue = script.cues(phase, planSeconds: seconds).single;
              expect(cue.at, 0);
              expect(cue.subtitle, flareCooldownPnfCue);
              expect(source.total(cue.voiceClips, lang: 'zh'), lessThan(5));
            }
          } else {
            expect(pnf, isEmpty);
          }
        }
      }
    },
  );
}
