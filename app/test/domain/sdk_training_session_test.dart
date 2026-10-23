import 'dart:io';

import 'package:flare/domain/dose.dart';
import 'package:flare/domain/drill_timer.dart';
import 'package:flare/trainer/drill_training_session.dart';
import 'package:flare/trainer/trainer_voice.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_trainer/engine.dart' as sdk;

DrillTrainingSession session(Dose dose, {required int Function() now}) =>
    DrillTrainingSession(dose, drillId: 'test-drill', title: 'Test', now: now);

void main() {
  test('fractional SDK phase boundaries cannot freeze the next countdown', () {
    var now = 0;
    final timer = session(parseDose('2 组 × 1 次')!, now: () => now);
    timer.start();
    now = 3000;
    timer.tick();
    now = 3001;
    timer.rep();
    timer.skipRest();
    expect(timer.snapshot.phase, TimerPhase.countdown);
    now = 6101;
    timer.tick();
    expect(timer.snapshot.phase, TimerPhase.work);
    expect(timer.snapshot.elapsedMs, 0);
    timer.rep();
    expect(timer.snapshot.phase, TimerPhase.finished);
  });

  test(
    'SDK voice announces upcoming set and respects left-first segments',
    () async {
      final voice = await loadTrainerVoiceSource(
        read: (path) => File(path).readAsString(),
      );
      var now = 0;
      final timer = session(parseDose('3 组 × 1 次')!, now: () => now);
      final cues = <List<String>>[];
      timer.configureVoice(voice, 'zh');
      timer.onCues = (fired, _) => cues.addAll(fired.map((f) => f.cue.clips));
      timer.start();
      now = 3000;
      timer.tick();
      cues.clear();
      timer.rep();
      expect(timer.engine.phase.set, 2);
      expect(timer.snapshot.set, 1);
      for (var i = 0; i < 10; i++) {
        now += 1000;
        timer.tick();
      }
      expect(cues, contains(equals(voice.ordinalSet(2))));
      expect(cues, isNot(contains(equals(voice.ordinalSet(1)))));

      now = 0;
      final bilateral = session(parseDose('1 组 × 每个字母 1 次')!, now: () => now);
      bilateral.configureVoice(voice, 'zh');
      bilateral.onCues = (fired, _) =>
          cues.addAll(fired.map((f) => f.cue.clips));
      bilateral.start();
      now = 3000;
      bilateral.tick();
      cues.clear();
      bilateral.rep();
      expect(cues, [
        ['chime.end'],
      ]);

      now = 0;
      final sides = session(parseDose('1 组 × 每侧 1 次')!, now: () => now);
      sides.configureVoice(voice, 'zh');
      sides.onCues = (fired, _) => cues.addAll(fired.map((f) => f.cue.clips));
      sides.start();
      now = 3000;
      sides.tick();
      cues.clear();
      sides.rep();
      expect(
        cues.expand((c) => c),
        contains(voice.call(sdk.VoiceCall.switchRight)),
      );
      expect(
        cues.expand((c) => c),
        isNot(contains(voice.call(sdk.VoiceCall.switchLeft))),
      );
      sides.start();
      now = 6000;
      cues.clear();
      sides.tick();
      expect(cues.expand((c) => c), isNot(contains('p.go_right')));
    },
  );

  test(
    'SDK timed early completion retains real work and both-side identity',
    () {
      var now = 0;
      final timer = session(parseDose('1 组 × 每侧 20 秒')!, now: () => now);
      timer.start();
      now = 3000;
      timer.tick();
      now = 5000;
      timer.completeSet();
      expect(timer.snapshot.completedSets, 0);
      expect(timer.snapshot.activeWorkMs, 2000);
      expect(timer.snapshot.phase, TimerPhase.nextSide);
      timer.start();
      now = 8000;
      timer.tick();
      now = 9000;
      timer.completeSet();
      expect(timer.snapshot.completedSets, 1);
      expect(timer.snapshot.activeWorkMs, 3000);
      expect(timer.engine.fullyCompletedExercises, 1);
      expect(timer.snapshot.phase, TimerPhase.finished);
    },
  );

  test('SDK segment completion cannot credit unfinished Y T W segments', () {
    var now = 0;
    final timer = session(parseDose('1 组 × 每个字母 1 次')!, now: () => now);
    timer.start();
    now = 3000;
    timer.tick();
    timer.rep();
    expect(timer.engine.fullyCompletedExercises, 1);
    expect(timer.engine.initialWorkPhases.map((p) => p.itemIndex).toSet(), {
      0,
      1,
      2,
    });
    expect(timer.snapshot.completedSets, 0);
    timer.abandon();
    expect(timer.snapshot.completedSets, 0);
  });

  test('extended and skipped rest do not invent active work or lose prep', () {
    var now = 0;
    final timer = session(
      parseDose('2 组 × 1 次')!.copyWith(restSec: 60),
      now: () => now,
    );
    timer.start();
    now = 3000;
    timer.tick();
    now = 4000;
    timer.rep();
    now = 34000;
    timer.tick();
    timer.addRest();
    expect(timer.snapshot.durationMs, 75000);
    expect(timer.snapshot.elapsedMs, 30000);
    expect(timer.snapshot.remainingMs, 45000);
    timer.pause();
    now = 100000;
    timer.tick();
    expect(timer.snapshot.remainingMs, 45000);
    timer.resume();
    timer.addRest();
    expect(timer.snapshot.durationMs, 90000);
    expect(timer.snapshot.remainingMs, 60000);
    final active = timer.activeSeconds;
    timer.skipRest();
    expect(timer.activeSeconds, active);
    expect(timer.snapshot.phase, TimerPhase.countdown);
    expect(timer.snapshot.remainingMs, 3000);
    expect(timer.snapshot.activeWorkMs, 1000);
    expect(timer.snapshot.completedSets, 1);
  });

  test(
    'per-side timed sets only count after both sides; rest separates full sets',
    () {
      var now = 0;
      final timer = session(
        parseDose('2 组 × 每侧 2 秒')!.copyWith(restSec: 1),
        now: () => now,
      );
      void advance(int ms) {
        for (var spent = 0; spent < ms; spent += 100) {
          now += 100;
          timer.tick();
        }
      }

      timer.start();
      advance(3000);
      expect(timer.snapshot.phase, TimerPhase.work);
      advance(2000);
      expect(timer.snapshot.phase, TimerPhase.nextSide);
      expect(timer.snapshot.side, 'right');
      expect(timer.snapshot.completedSets, 0);
      advance(10000);
      expect(timer.snapshot.phase, TimerPhase.nextSide);
      timer.start();
      advance(3000);
      advance(2000);
      expect(timer.snapshot.phase, TimerPhase.rest);
      expect(timer.snapshot.completedSets, 1);
      advance(1000);
      expect(timer.snapshot.set, 2);
      expect(timer.snapshot.side, 'left');
      advance(3000);
      advance(2000);
      timer.start();
      advance(3000);
      advance(2000);
      expect(timer.snapshot.phase, TimerPhase.finished);
      expect(timer.snapshot.completedSets, 2);
      expect(timer.snapshot.activeWorkMs, 8000);
      advance(100000);
      expect(timer.snapshot.activeWorkMs, 8000);
      timer.completeSet();
      timer.abandon();
      expect(timer.snapshot.phase, TimerPhase.finished);
    },
  );

  test('named rep blocks Y, T, W cannot count as one movement', () {
    var now = 0;
    final timer = session(parseDose('1 组 × 每个字母 2 次')!, now: () => now);
    for (final block in ['Y', 'T', 'W']) {
      expect(timer.snapshot.blockLabel, block);
      timer.start();
      now += 3000;
      timer.tick();
      timer.rep();
      expect(timer.snapshot.completedSets, 0);
      timer.rep();
    }
    expect(timer.snapshot.phase, TimerPhase.finished);
    expect(timer.snapshot.completedSets, 1);
  });

  test(
    'pause and app suspension freeze active work and never grant background sets',
    () {
      var now = 0;
      final timer = session(parseDose('1 组 × 20 秒')!, now: () => now);
      timer.start();
      now = 3000;
      timer.tick();
      now = 5000;
      timer.tick();
      timer.suspendForBackground();
      final frozen = timer.snapshot;
      now = 605000;
      timer.tick();
      expect(timer.snapshot.remainingMs, frozen.remainingMs);
      expect(timer.snapshot.activeWorkMs, 2000);
      expect(timer.snapshot.completedSets, 0);
      timer.resume();
      now += 1000;
      timer.tick();
      expect(timer.snapshot.remainingMs, frozen.remainingMs - 1000);
    },
  );

  test(
    'polling stall cannot credit an unattended work block or chain through sets',
    () {
      var now = 0;
      final timer = session(parseDose('3 组 × 20 秒')!, now: () => now);
      timer.start();
      now = 3000;
      timer.tick();
      now = 4000;
      timer.tick();
      now = 600000;
      timer.tick();
      expect(timer.snapshot.phase, TimerPhase.paused);
      expect(timer.snapshot.activeWorkMs, 1000);
      expect(timer.snapshot.completedSets, 0);
      expect(timer.snapshot.set, 1);
    },
  );

  test(
    'one tick crossing expired rest creates a fresh countdown without overshoot',
    () {
      var now = 0;
      final timer = session(
        parseDose('2 组 × 1 次')!.copyWith(restSec: 1),
        now: () => now,
      );
      timer.start();
      now = 3000;
      timer.tick();
      timer.rep();
      now = 90000;
      timer.tick();
      expect(timer.snapshot.phase, TimerPhase.countdown);
      expect(timer.snapshot.remainingMs, 3000);
      expect(timer.snapshot.completedSets, 1);
    },
  );

  test(
    'manual distance dose needs both sides and abandonment retains only observed work',
    () {
      var now = 0;
      final timer = session(Dose.manual('3 组 × 每侧 20–30 米'), now: () => now);
      timer.start();
      now = 3000;
      timer.tick();
      now = 4000;
      timer.tick();
      timer.completeSet();
      expect(timer.snapshot.phase, TimerPhase.nextSide);
      expect(timer.snapshot.completedSets, 0);
      timer.start();
      now = 7000;
      timer.tick();
      now = 8000;
      timer.tick();
      timer.abandon();
      expect(timer.snapshot.phase, TimerPhase.abandoned);
      expect(timer.snapshot.activeWorkMs, 2000);
      expect(timer.snapshot.completedSets, 0);
    },
  );

  test(
    'a clock moving backward and duplicate commands do not corrupt state',
    () {
      var now = 0;
      final timer = session(parseDose('1 组 × 1 次')!, now: () => now);
      timer.start();
      timer.start();
      now = 3000;
      timer.tick();
      now = 2000;
      timer.tick();
      expect(timer.snapshot.elapsedMs, 0);
      timer.rep();
      timer.rep();
      timer.completeSet();
      expect(timer.snapshot.completedSets, 1);
      expect(timer.snapshot.phase, TimerPhase.finished);
    },
  );
}
