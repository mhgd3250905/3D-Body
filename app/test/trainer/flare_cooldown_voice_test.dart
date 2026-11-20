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
        final postures = plan.stretchPosturesForScene('A');
        final builder = FlareCooldownSessionBuilder(
          strengtheningRestSeconds: plan.strengtheningRestSeconds,
          stretchPostures: postures,
          rhythms: shared.rhythms,
          known: known,
          prepSeconds: 10,
          switchSecondsFor: script.switchSecondsFor,
          voiceGuideFor: source.voiceGuide,
          guideSideSwitchSecondsFor: source.sideSwitchSecondsFor,
        );
        final (fullDuration, stretchDuration) = const {
          1: (1503, 845),
          2: (2440, 1155),
          3: (2232, 1340),
        }[plan.tier]!;
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
          expect(seconds, skip ? stretchDuration : fullDuration);
          for (final item in skip ? plan.items : plan.allItems) {
            final key = item.voiceKey!;
            final played = clips.contains(key) ? key : '$key.short';
            expect(clips, contains(played), reason: '${plan.id} ${item.drill}');
            expect(source.line(key, lang: 'zh'), item.voiceCue);
            final bytes = await rootBundle.load(
              source.asset(played, lang: 'zh'),
            );
            expect(bytes.lengthInBytes, greaterThan(0));
          }
          final prep = phases.first;
          expect(prep.kind, sdk.PhaseKind.prep);
          expect(prep.seconds, 10);
          expect(
            script.cues(prep, planSeconds: seconds).expand((c) => c.voiceClips),
            [source.drill(prep.exerciseId!, sdk.DrillLine.cue1)],
          );
          for (final phase in phases.where((p) => p.nextExerciseId != null)) {
            final round = phase.kind == sdk.PhaseKind.roundRest;
            final previous = postures[phase.doneExerciseId];
            final samePosture =
                previous != null && previous == postures[phase.nextExerciseId];
            expect(
              phase.seconds,
              round
                  ? (plan.tier == 1 ? 30 : 45)
                  : samePosture
                  ? 5
                  : 10,
            );
            final nextKey = source.drill(
              phase.exerciseId!,
              sdk.DrillLine.cue1,
            )!;
            final guideKey = samePosture ? '$nextKey.short' : nextKey;
            final transition = script.cues(phase, planSeconds: seconds);
            final guide = transition.singleWhere(
              (c) => c.voiceClips.contains(guideKey),
            );
            expect(
              guide.at + source.total(guide.voiceClips, lang: 'zh'),
              lessThan(phase.seconds),
            );
            if (!round) {
              expect(transition.expand((c) => c.voiceClips), [guideKey]);
            }
          }
          for (final phase in phases.where(
            (p) => p.kind == sdk.PhaseKind.switchSide,
          )) {
            expect(phase.seconds, 5);
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
