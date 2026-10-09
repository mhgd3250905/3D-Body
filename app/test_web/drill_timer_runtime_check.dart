import 'dart:async';

import 'package:flare/domain/dose.dart';
import 'package:flare/domain/drill_timer.dart';

// Run the same production domain code through dart2js, where wide bitwise
// shifts behave differently from the Dart VM used by flutter test.
// dart compile js test_web/drill_timer_runtime_check.dart -o build/timer-web.js
// node -e "globalThis.self = globalThis; require('./build/timer-web.js')"
void check(bool condition, String message) {
  if (!condition) throw StateError(message);
}

Future<void> main() async {
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
  advance(1000);
  check(timer.snapshot.remainingMs == 2000, 'countdown must advance');
  timer.pause();
  advance(10000);
  check(timer.snapshot.remainingMs == 2000, 'pause must freeze countdown');
  timer.resume();
  advance(2000);
  check(timer.snapshot.phase == TimerPhase.work, 'countdown enters work');
  advance(2000);
  check(timer.snapshot.phase == TimerPhase.nextSide, 'left side completes');
  check(timer.snapshot.completedSets == 0, 'one side is not a full set');
  timer.start();
  advance(3000);
  advance(2000);
  check(timer.snapshot.phase == TimerPhase.rest, 'both sides enter rest');
  check(timer.snapshot.activeWorkMs == 4000, 'observed work is credited');
  advance(1000);
  check(timer.snapshot.set == 2, 'rest enters next set');
  advance(3000);
  advance(2000);
  timer.start();
  advance(3000);
  advance(2000);
  check(timer.snapshot.phase == TimerPhase.finished, 'all sets complete');
  check(timer.snapshot.activeWorkMs == 8000, 'all active work is recorded');

  now = 4294967296;
  final offset = DrillTimer(parseDose('1 组 × 2 秒')!, now: () => now);
  offset.start();
  now += 3000;
  offset.tick();
  check(
    offset.snapshot.phase == TimerPhase.work,
    'large clock offset preserves countdown',
  );
  now += 1000;
  offset.tick();
  offset.abandon();
  check(
    offset.snapshot.activeWorkMs == 1000,
    'abandon retains observed work at large offset',
  );

  // Also use the production monotonic clock rather than an injected clock.
  final live = DrillTimer(parseDose('1 组 × 2 秒')!);
  live.start();
  final deadline = Stopwatch()..start();
  while (live.snapshot.phase == TimerPhase.countdown &&
      deadline.elapsedMilliseconds < 5000) {
    await Future<void>.delayed(const Duration(milliseconds: 100));
    live.tick();
  }
  check(
    live.snapshot.phase == TimerPhase.work,
    'real Web clock exits 3s countdown',
  );
  await Future<void>.delayed(const Duration(milliseconds: 250));
  live.tick();
  check(live.snapshot.remainingMs < 2000, 'real Web work clock advances');
  live.pause();
  final paused = live.snapshot.remainingMs;
  await Future<void>.delayed(const Duration(milliseconds: 200));
  live.tick();
  check(live.snapshot.remainingMs == paused, 'real Web pause freezes work');
  // This is an executable check; stdout is its completion signal.
  // ignore: avoid_print
  print(
    'Web timer passed: countdown, pause, work, sides, rest, completion, large clock offset, and real monotonic clock.',
  );
}
