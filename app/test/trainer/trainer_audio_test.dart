import 'dart:async';

import 'package:flare/trainer/trainer_audio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_trainer/ugk_trainer.dart';

class _DelayedAudio extends MutedVoiceOutput {
  final events = <String>[];
  Completer<void>? ending;
  @override
  Future<void> begin() async => events.add('begin');
  @override
  Future<void> end() async {
    events.add('end-start');
    await ending?.future;
    events.add('end-finish');
  }

  @override
  Future<void> speak(List<String> assets) async => events.add(assets.join(','));
  @override
  Future<void> stopSpeech() async => events.add('stop');
}

void main() {
  test(
    'a new ready page cleans up even when queued old end loses ownership',
    () async {
      final output = _DelayedAudio();
      final pool = TrainerAudioPool(create: () => output);
      final old = pool.acquire();
      await old.begin();
      await old.speak(['old-line']);
      // Do not yield: old end is queued but has not reached the OS yet.
      final queuedEnd = old.end();
      pool.acquire(); // The user remains on ready and never calls begin.
      await queuedEnd;
      await old.end(); // Wait behind the new owner's cleanup barrier.
      await old.stopSpeech();
      expect(output.events, ['begin', 'old-line', 'end-start', 'end-finish']);
    },
  );

  test(
    'new session waits for old OS shutdown and ignores stale owner',
    () async {
      final output = _DelayedAudio();
      var creates = 0;
      final pool = TrainerAudioPool(
        create: () {
          creates++;
          return output;
        },
      );
      final old = pool.acquire();
      await old.begin();
      output.ending = Completer<void>();
      final release = old.end();
      await Future<void>.delayed(Duration.zero);
      final current = pool.acquire();
      final start = current.begin();
      await Future<void>.delayed(Duration.zero);
      expect(output.events, ['begin', 'end-start']);
      output.ending!.complete();
      await release;
      await start;
      expect(output.events, [
        'begin',
        'end-start',
        'end-finish',
        'end-start',
        'end-finish',
        'begin',
      ]);
      await old.end();
      await old.stopSpeech();
      await old.speak(['stale']);
      await current.speak(['current']);
      expect(output.events.last, 'current');
      expect(output.events.where((e) => e == 'end-start'), hasLength(2));
      expect(output.events, isNot(contains('stale')));
      expect(output.events, isNot(contains('stop')));
      expect(creates, 1);
      await current.end();
    },
  );
}
