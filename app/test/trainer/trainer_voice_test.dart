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
      expect(source.languages, {'zh', 'en'});
      for (final call in [
        VoiceCall.go,
        VoiceCall.rest,
        VoiceCall.finish,
        VoiceCall.paused,
        VoiceCall.resume,
        VoiceCall.switchLeft,
      ]) {
        expect(source.has(source.call(call)!, lang: 'zh'), isTrue);
        expect(source.has(source.call(call)!, lang: 'en'), isTrue);
      }
      for (var n = 1; n <= 60; n++) {
        expect(source.has('n.$n', lang: 'zh'), isTrue);
        expect(source.has('n.$n', lang: 'en'), isTrue);
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
    'scheduler uses decoded durations and every recorded asset exists',
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
          final lang = entry['lang'] as String;
          expect(source.asset(key, lang: lang), entry['asset']);
          expect(
            source.seconds(key, lang: lang),
            (entry['decodedMs'] as int) / 1000,
          );
        }
      }
      expect(speech, 176);
      // n.1 was 395 ms before re-encoding but the actual LC recording is 418 ms.
      expect(source.seconds('n.1', lang: 'zh'), .418);
    },
  );

  test('English phrases use English order and singular units', () async {
    final en = await loadTrainerVoiceSource(language: 'en', read: read);
    final zh = await loadTrainerVoiceSource(read: read);
    expect(en.ordinalSet(3), ['p.set_number', 'n.3']);
    expect(en.ordinalRound(2), ['p.round_number', 'n.2']);
    expect(en.secondsPhrase(1), ['n.1', 'u.sec_one']);
    expect(en.minutesPhrase(1), ['n.1', 'u.min_one']);
    expect(en.setsPhrase(1), ['n.1', 'u.sets_one']);
    expect(en.repsPhrase(1), ['n.1', 'u.reps_one']);
    expect(en.secondsPhrase(2), ['n.2', 'u.sec']);
    expect(en.ordinalSet(0), isEmpty);
    expect(zh.ordinalSet(3), ['p.di', 'n.3', 'u.sets']);
    expect(zh.secondsPhrase(1), ['n.1', 'u.sec']);
    for (final keys in [
      en.ordinalSet(3),
      en.ordinalRound(2),
      en.secondsPhrase(1),
      en.minutesPhrase(1),
      en.setsPhrase(1),
      en.repsPhrase(1),
    ]) {
      for (final key in keys) {
        expect(en.has(key, lang: 'en'), isTrue, reason: key);
        expect(en.seconds(key, lang: 'en'), greaterThan(0));
      }
    }
    expect(en.line(en.call(VoiceCall.goRight)!, lang: 'en'), 'Start.');
    expect(
      en.line(en.call(VoiceCall.switchRight)!, lang: 'en'),
      'Switch right.',
    );
    // Countdown speech must fit its one-second cadence with the SDK tail gap.
    for (var n = 1; n <= 3; n++) {
      expect(en.seconds('n.$n', lang: 'en'), lessThan(.9));
    }
  });

  test(
    'SDK player retains its right-first voice policy in both languages',
    () async {
      for (final language in ['zh', 'en']) {
        final source = await loadTrainerVoiceSource(
          language: language,
          leftFirst: false,
          read: read,
        );
        expect(source.call(VoiceCall.goRight), 'p.go_right');
        expect(
          source.has(source.call(VoiceCall.goRight)!, lang: language),
          isTrue,
        );
        expect(
          source.has(source.call(VoiceCall.switchLeft)!, lang: language),
          isTrue,
        );
      }
    },
  );
}
