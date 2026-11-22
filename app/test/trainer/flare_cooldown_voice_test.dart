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
    'cooldown announcements follow the actual tier, phase, and side',
    () async {
      final catalog = await Catalog.load();
      final shared = await FlareShared.load();
      final base = await sdk.withPoseHubCatalogVoice(
        await loadTrainerVoiceSource(language: 'zh', leftFirst: false),
        catalog: shared.pack,
      );
      for (final plan in catalog.flareCooldownPlans) {
        final source = await withSupplementalTrainerVoice(
          base,
          plan,
          language: 'zh',
        );
        expect(hasFlarePlanAnnouncements(source), isTrue);
        final byId = {
          for (final item in plan.allItems)
            item.trainingDrillForScene('A'): item,
        };
        final mediaIds = {
          for (final item in plan.allItems)
            ...item.trainingMediaIdsForScene('A'),
        };
        bool known(String id) => shared.catalog[mediaIds[id] ?? id] != null;
        for (final skip in [false, true]) {
          final session = expandSegmentedTrainingPlan(
            shared.authoredPlan(plan, catalog, 'A', skipStrengthening: skip),
            catalog,
            known: known,
          );
          final phases = FlareCooldownSessionBuilder(
            strengtheningRestSeconds: plan.strengtheningRestSeconds,
            stretchPostures: plan.stretchPosturesForScene('A'),
            rhythms: shared.rhythms,
            known: known,
            prepSeconds: skip ? 5 : 10,
          ).phases(session);
          final script = buildSupplementalTrainerScript(
            source,
            'zh',
            plan: plan,
            phases: phases,
          );
          final seconds = phases.fold(0.0, (sum, p) => sum + p.seconds);
          List<sdk.VoiceCue> cues(sdk.SessionPhase p) =>
              script.cues(p, planSeconds: seconds);
          final works = phases.where((p) => p.isWork);
          String keyOf(sdk.SessionPhase p) =>
              byId[p.item!.exerciseId]!.voiceKey!;
          final starts = [
            for (final p in phases)
              if (p.kind == sdk.PhaseKind.prep || p.nextExerciseId != null) p,
          ];
          expect(phases.first.seconds, skip ? 5 : 10);
          for (final phase in starts) {
            final technique = keyOf(phase);
            final intro = technique.contains('.stretch.')
                ? '$technique.intro.${plan.tier}'
                : '$technique.intro';
            final spoken = cues(phase).expand((cue) => cue.voiceClips).toList();
            expect(spoken, [
              if (!skip && phase.kind == sdk.PhaseKind.prep)
                'supplemental.cooldown.kickoff.${plan.strengtheningRounds}',
              if (phase.kind == sdk.PhaseKind.roundRest)
                'supplemental.cooldown.round.${phase.round}',
              intro,
            ], reason: '${plan.id}: $intro');
            for (final cue in cues(
              phase,
            ).where((cue) => cue.voiceClips.isNotEmpty)) {
              expect(
                cue.at + source.total(cue.voiceClips, lang: 'zh'),
                lessThan(phase.seconds),
              );
            }
          }
          for (final itemIndex in works.map((p) => p.itemIndex).toSet()) {
            final occurrence = works.where((p) => p.itemIndex == itemIndex);
            final key = keyOf(occurrence.first);
            final all = occurrence
                .expand(cues)
                .expand((cue) => cue.clips)
                .toList();
            expect(all.where((clip) => clip == key), [
              key,
            ], reason: '${plan.id}: $key');
            expect(
              source.line(key, lang: 'zh'),
              byId[occurrence.first.item!.exerciseId]!.voiceCue,
            );
            expect(
              (await rootBundle.load(
                source.asset(key, lang: 'zh'),
              )).lengthInBytes,
              greaterThan(0),
            );
          }
          for (final phase in works.where(
            (p) => p.side != null && p.segmentId != 'pnf-press',
          )) {
            expect(
              cues(phase).first.clips,
              contains('chime.supplemental.side.${phase.side!.name}'),
            );
          }
          for (final phase in works.where(
            (p) => p.rhythm?.alternatePair == true,
          )) {
            final beats = cues(phase)
                .expand((cue) => cue.chimes)
                .where((clip) => clip.startsWith('chime.supplemental.side.'));
            final first = phase.rhythm!.pairFirstSide!;
            final second = first == 'left' ? 'right' : 'left';
            expect(beats, [
              for (var rep = 0; rep < phase.reps!; rep++) ...[
                'chime.supplemental.side.$first',
                'chime.supplemental.side.$second',
              ],
            ]);
          }
          final allWork = works.expand(cues).expand((cue) => cue.clips).toSet();
          expect(
            allWork,
            contains(
              'chime.supplemental.cooldown.stretch.5.segment.wrist-extended',
            ),
          );
          expect(allWork, contains('supplemental.cooldown.stretch.13.breath'));
          final pnf = works.where((p) => p.segmentId == 'pnf-press');
          expect(pnf.length, plan.tier == 3 ? 4 : 0);
          for (final phase in pnf) {
            final cue = cues(phase).single;
            expect(cue.voiceClips, ['supplemental.cooldown.pnf']);
            expect(cue.at, 0);
            expect(cue.subtitle, flareCooldownPnfCue);
            expect(phase.seconds, 5);
          }
        }
      }
    },
  );

  test(
    'supplemental announcements do not replace the English source',
    () async {
      final catalog = await Catalog.load();
      final base = await loadTrainerVoiceSource(
        language: 'en',
        leftFirst: false,
      );
      final source = await withSupplementalTrainerVoice(
        base,
        catalog.flareCooldownPlan,
        language: 'en',
      );
      expect(source, same(base));
      expect(hasFlarePlanAnnouncements(source), isFalse);
    },
  );
}
