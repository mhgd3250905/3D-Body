import 'dart:convert';
import 'dart:io';

import 'package:flare/trainer/trainer_voice.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_trainer/ugk_trainer.dart';

void main() {
  Future<String> read(String path) => File(path).readAsString();

  test(
    'offline source supplies shared counts, prompts and all five chimes',
    () async {
      final source = await loadTrainerVoiceSource(read: read);
      expect(source.languages, {'zh'});
      for (final call in [
        VoiceCall.go,
        VoiceCall.rest,
        VoiceCall.finish,
        VoiceCall.paused,
        VoiceCall.resume,
        VoiceCall.switchLeft,
      ]) {
        expect(source.has(source.call(call)!, lang: 'zh'), isTrue);
      }
      for (var n = 1; n <= 60; n++) {
        expect(source.has('n.$n', lang: 'zh'), isTrue);
      }
      for (final name in ['end', 'finish', 'silence', 'start', 'tick']) {
        expect(source.has('chime.$name', lang: 'en'), isTrue);
        expect(
          File(source.asset('chime.$name', lang: 'en')).existsSync(),
          isTrue,
        );
      }
      // The HipLab supplement preserves the app's legacy left-first flow.
      final right = source.call(VoiceCall.switchRight)!;
      expect(source.has(right, lang: 'zh'), isTrue);
      expect(source.line(right, lang: 'zh'), '换右边');
      expect(source.seconds(right, lang: 'zh'), .789);
      expect(File(source.asset(right, lang: 'zh')).existsSync(), isTrue);
      // The SDK treats right as the first side; FlareLab starts on the left.
      expect(source.call(VoiceCall.goRight), source.call(VoiceCall.go));
      expect(source.line(source.call(VoiceCall.goRight)!, lang: 'zh'), '开始');
      expect(source.has('abs-A/name', lang: 'zh'), isFalse);
    },
  );

  test(
    'unsupported speech languages retain chimes without Chinese fallback',
    () async {
      final source = await loadTrainerVoiceSource(read: read);
      for (final lang in [
        'en',
        'es',
        'pt',
        'fr',
        'de',
        'it',
        'ru',
        'ja',
        'ko',
        'ar',
        'hi',
        'id',
      ]) {
        expect(source.supports(lang), isFalse);
        expect(source.has('p.go', lang: lang), isFalse);
        expect(source.has('chime.start', lang: lang), isTrue);
      }
    },
  );

  test(
    'scheduler uses LC decoded durations and every recorded asset exists',
    () async {
      final source = await loadTrainerVoiceSource(read: read);
      final manifest =
          jsonDecode(await read('assets/trainer_voice/source-manifest.json'))
              as Map;
      var speech = 0;
      for (final entry in manifest['files'] as List) {
        final file = File(entry['asset'] as String);
        expect(file.existsSync(), isTrue, reason: file.path);
        expect(file.lengthSync(), entry['bytes'], reason: file.path);
        if (entry['line'] case final String key) {
          speech++;
          expect(source.asset(key, lang: 'zh'), entry['asset']);
          expect(
            source.seconds(key, lang: 'zh'),
            (entry['decodedMs'] as int) / 1000,
          );
        }
      }
      expect(speech, 85);
      // n.1 was 395 ms before re-encoding but the actual LC recording is 418 ms.
      expect(source.seconds('n.1', lang: 'zh'), .418);
    },
  );
}
