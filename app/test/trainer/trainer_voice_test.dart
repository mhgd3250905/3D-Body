import 'dart:convert';
import 'dart:io';

import 'package:flare/data/catalog.dart';
import 'package:flare/data/flare_public_catalog.dart';
import 'package:flare/data/flare_shared_library.dart';
import 'package:flare/data/posehub_catalog_updates.dart';
import 'package:flare/trainer/training_plan_adapter.dart';
import 'package:flare/trainer/trainer_voice.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' show sha256Hex;
import 'package:ugk_trainer_runtime/ugk_trainer.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

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

  test(
    'plan voices and chime aliases resolve only to the versioned bundle',
    () async {
      const versionedRoot = 'assets/trainer_voice/flare-plan-voice-r1-6c5d81a9';
      const legacyRoot = 'assets/trainer_voice/_common/voice/zh';
      final base = await loadTrainerVoiceSource(read: read);
      final catalog = await Catalog.load();
      final source = await withSupplementalTrainerVoice(
        base,
        catalog.flareWarmupPlan,
        language: 'zh',
      );
      final expected = <String>{};
      for (final file in [
        'flare-supplemental-voice.json',
        'flare-plan-announcements.json',
      ]) {
        final manifest =
            jsonDecode(
                  await rootBundle.loadString('assets/trainer_voice/$file'),
                )
                as Map<String, dynamic>;
        expected.addAll(
          (manifest['clips'] as Map<String, dynamic>).keys.map(
            (key) => '$versionedRoot/$key.m4a',
          ),
        );
      }
      expect(expected, hasLength(172));
      final manifest = await AssetManifest.loadFromAssetBundle(rootBundle);
      final assets = manifest.listAssets();
      expect(
        assets.where((asset) => asset.startsWith('$versionedRoot/')),
        unorderedEquals(expected),
      );
      expect(
        assets.where((asset) => asset.startsWith('$legacyRoot/supplemental.')),
        isEmpty,
      );

      const technique = 'supplemental.general-warmup.1';
      const segment = '$technique.segment.step-jack-side-raise';
      for (final key in [
        technique,
        '$technique.intro',
        segment,
        'chime.$segment',
      ]) {
        expect(source.has(key, lang: 'zh'), isTrue);
        final asset = source.asset(key, lang: 'zh');
        expect(asset, '$versionedRoot/${key.replaceFirst('chime.', '')}.m4a');
        expect((await rootBundle.load(asset)).lengthInBytes, greaterThan(0));
      }
      for (final key in ['n.1', 'chime.start']) {
        expect(source.asset(key, lang: 'zh'), base.asset(key, lang: 'zh'));
      }
    },
  );

  test(
    'pinned voice paths and timing come from verified snapshot clips',
    () async {
      const technique = 'supplemental.general-warmup.1';
      const segment = '$technique.segment.step-jack-side-raise';
      final guideBytes = File(
        '$flarePlanVoiceAssetRoot/$technique.m4a',
      ).readAsBytesSync();
      final segmentBytes = File(
        '$flarePlanVoiceAssetRoot/$segment.m4a',
      ).readAsBytesSync();
      final earlier = Uint8List.fromList([
        ...guideBytes,
        // A valid ISO BMFF free box changes the digest, without changing timing.
        0, 0, 0, 8, 102, 114, 101, 101,
      ]);
      final snapshot = _voiceSnapshot(
        {technique: earlier, segment: segmentBytes},
        paths: [technique, segment],
      );
      final http = _VoiceHttp({technique: earlier, segment: segmentBytes});
      final directory = await Directory.systemTemp.createTemp(
        'flare-voice-test-',
      );
      addTearDown(() => directory.delete(recursive: true));
      final cache = PoseHubPlanVoiceCache.files(directory.path, http: http);
      final base = await loadTrainerVoiceSource(read: read);
      final plan = (await Catalog.load()).flareWarmupPlan!;
      final source = await withSupplementalTrainerVoice(
        base,
        plan,
        language: 'zh',
        planSnapshot: snapshot,
        voiceCache: cache,
      );
      expect(http.requested, unorderedEquals([technique, segment]));
      final uri = Uri.parse(source.asset(technique, lang: 'zh'));
      expect(uri.scheme, 'file');
      expect(uri.pathSegments.last, '${sha256Hex(earlier)}.m4a');
      expect(source.seconds(technique, lang: 'zh'), closeTo(5.27, .05));
      expect(source.line(technique, lang: 'zh'), plan.items.first.voiceCue);
      expect(
        source.asset('chime.$segment', lang: 'zh'),
        source.asset(segment, lang: 'zh'),
      );
      expect(source.asset('n.1', lang: 'zh'), base.asset('n.1', lang: 'zh'));
    },
  );

  test(
    'offline snapshot falls back only to the exact matching shipped clip',
    () async {
      const guide = 'supplemental.general-warmup.1';
      const intro = '$guide.intro';
      final guideBytes = File(
        '$flarePlanVoiceAssetRoot/$guide.m4a',
      ).readAsBytesSync();
      final snapshot = _voiceSnapshot(
        {
          guide: guideBytes,
          intro: Uint8List.fromList([1, 2, 3]),
        },
        paths: [guide, intro],
      );
      final base = await loadTrainerVoiceSource(read: read);
      final source = await withSupplementalTrainerVoice(
        base,
        (await Catalog.load()).flareWarmupPlan,
        language: 'zh',
        planSnapshot: snapshot,
        voiceCache: PoseHubPlanVoiceCache(
          store: MemoryPoseHubCatalogStore(),
          uriOf: (name) => Uri.file('/test/$name'),
          http: _VoiceHttp({}),
        ),
      );
      expect(
        source.asset(guide, lang: 'zh'),
        '$flarePlanVoiceAssetRoot/$guide.m4a',
      );
      expect(source.has(intro, lang: 'zh'), isFalse);
    },
  );

  test(
    'the standing straddle keeps all twelve timed Mandarin guide lines',
    () async {
      const id = 't-standing-straddle-hands-floor';
      final shared = await FlareShared.load(
        activeCatalog: await loadFlareBundledPublicCatalog(),
      );
      final snapshot = (await loadFlareBundledPlanSnapshot(warmupR3: true))!;
      final catalog = (await Catalog.load()).withPlanSnapshot(snapshot);
      final authored = catalog.flareWarmupPlan!;
      final plan = shared.authoredPlan(authored, catalog, 'A');
      final builder = FlareWarmupSessionBuilder(rhythms: shared.rhythms);
      final phases = builder.phases(plan);
      final work = phases.singleWhere(
        (phase) => phase.isWork && phase.exerciseId == id,
      );
      expect(work.seconds, 120);

      final base = LayeredVoiceSource(
        primary: await loadTrainerVoiceSource(read: read),
        catalog: CatalogVoiceIndex.fromCatalogJson(shared.pack.raw),
        cache: _ReadyCatalogVoiceCache(),
      );
      final source = await withSupplementalTrainerVoice(
        base,
        authored,
        language: 'zh',
      );
      final script = buildSupplementalTrainerScript(
        source,
        'zh',
        plan: authored,
        phases: phases,
      );
      final expected = [
        for (var ordinal = 1; ordinal <= 12; ordinal++)
          LayeredVoiceSource.keyOf(id, 'g.set.$ordinal'),
      ];
      final scheduled = script
          .cues(work, planSeconds: builder.planSeconds(plan))
          .where((cue) => cue.clips.any(expected.contains))
          .toList();
      expect(
        scheduled.expand((cue) => cue.clips.where(expected.contains)),
        expected,
      );
      expect(scheduled.map((cue) => cue.at), [
        4,
        12,
        20,
        30,
        40,
        50,
        60,
        70,
        80,
        90,
        100,
        108,
      ]);
      expect(
        scheduled.every((cue) => cue.subtitle?.isNotEmpty == true),
        isTrue,
      );
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

PoseHubPlanSnapshot _voiceSnapshot(
  Map<String, Uint8List> files, {
  required List<String> paths,
}) {
  String path(String key) => 'zh/$key.m4a';
  final voice = utf8.encode(
    jsonEncode({
      'schema': 1,
      'files': [
        for (final MapEntry(key: key, value: bytes) in files.entries)
          {
            'path': path(key),
            'bytes': bytes.length,
            'sha256': sha256Hex(bytes),
          },
      ],
      'plans': {'general-warmup': paths.map(path).toList()},
    }),
  );
  return PoseHubPlanSnapshot.fromBytes(
    utf8.encode(
      jsonEncode({
        'schema': 1,
        'app': 'flare',
        'version': 'fixture',
        'min_catalog_pack': 'r2-v22',
        'voice_manifest': {
          'url': 'https://example.com/manifest.json',
          'bytes': voice.length,
          'sha256': sha256Hex(voice),
        },
        'plans': <Object?>[],
      }),
    ),
    voice,
    minSdk: '1.0.2',
  );
}

class _VoiceHttp implements PoseHubCatalogHttpClient {
  _VoiceHttp(this.files);

  final Map<String, Uint8List> files;
  final requested = <String>[];

  @override
  Future<PoseHubCatalogHttpResponse> get(
    Uri uri, {
    Map<String, String> headers = const {},
    int maxBytes = 64 * 1024 * 1024,
  }) async {
    final key = uri.pathSegments.last.replaceFirst(RegExp(r'\.m4a$'), '');
    requested.add(key);
    final bytes = files[key];
    return bytes == null
        ? PoseHubCatalogHttpResponse(503, Uint8List(0))
        : PoseHubCatalogHttpResponse(200, bytes);
  }
}

class _ReadyCatalogVoiceCache extends CatalogVoiceCache {
  _ReadyCatalogVoiceCache()
    : super(store: MemoryPoseHubCatalogStore(), pathOf: (name) => name);

  @override
  bool isReady(CatalogVoiceClip clip) => true;
}
