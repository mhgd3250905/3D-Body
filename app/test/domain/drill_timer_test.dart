import 'package:flare/domain/dose.dart';
import 'package:flare/domain/drill_timer.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test(
    'per-side timed sets only count after both sides; rest separates full sets',
    () {
      var now = 0;
      final timer = DrillTimer(
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
    final timer = DrillTimer(parseDose('1 组 × 每个字母 2 次')!, now: () => now);
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
      final timer = DrillTimer(parseDose('1 组 × 20 秒')!, now: () => now);
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
      final timer = DrillTimer(parseDose('3 组 × 20 秒')!, now: () => now);
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
      final timer = DrillTimer(
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
      final timer = DrillTimer(Dose.manual('3 组 × 每侧 20–30 米'), now: () => now);
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
      final timer = DrillTimer(parseDose('1 组 × 1 次')!, now: () => now);
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
