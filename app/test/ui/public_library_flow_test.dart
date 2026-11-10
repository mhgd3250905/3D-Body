import 'dart:convert';
import 'dart:io';

import 'package:flare/coach/flare_coach_profile.dart';
import 'package:flare/control/learning_store.dart';
import 'package:flare/data/flare_action_scope.dart';
import 'package:flare/data/flare_public_catalog.dart';
import 'package:flare/data/flare_public_media.dart';
import 'package:flare/data/flare_shared_library.dart';
import 'package:flare/data/posehub_catalog_updates.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/drill_media.dart';
import 'package:flare/ui/public_library_filter.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as sdk;

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart' show MemoryStateStorage, phoneSize, testApp;

// The explicit newly authorised set protects against retaining the old
// 211-action scope while a newer catalogue happens to be available.
const _newR2V1Actions = <String>{
  'h-band-biceps-curl',
  'h-bear-plank',
  'h-biceps-self',
  'h-bilateral-farmer-hold-native',
  'h-bridge-overhead',
  'h-chair-elbow-triceps-stretch',
  'h-crossbody',
  'h-db-overhead-shrug',
  'h-db-reverse-curl',
  'h-db-shrug',
  'h-db-zottman-curl',
  'h-floor-nordic-hand-reset',
  'h-half-kneeling-quad-stretch',
  'h-inner-thigh',
  'h-kb-swing',
  'h-kneeling-thread-needle',
  'h-mountain-climber',
  'h-open-book',
  'h-pike-pushup',
  'h-pike-scapular-elevation',
  'h-reverse-lunge',
  'h-standing-arm-extension-stretch',
  'h-supine-cactus-chest',
  'h-towel-behind',
  'h-towel-isometric-curl',
  'h-towel-pass',
  'h-towel-pulldown',
  'h-wall-palm-lift',
  'h-wall-pec',
  'o-supported-ankle-eversion',
  't-flare-side-hold',
  't-lsit-open-close',
  't-lsit-tuck',
  't-lsit-vsit-circles',
  't-lsit-wide',
  't-seated-straddle-ext',
  't-seated-straddle-lifts',
  't-straddle-hold',
  't-tuck-planche',
  't-vsit',
};

Finder _key(String value) => find.byKey(ValueKey(value));

Future<void> _settleLocalAssets(WidgetTester tester) async {
  // Decode bundled posters on the real asset IO queue, never by substituting
  // the legacy 51-action fixture or by starting a media download.
  await tester.pumpAndSettle();
  await tester.runAsync(
    () => Future<void>.delayed(const Duration(milliseconds: 1)),
  );
  await tester.pumpAndSettle();
}

PublicLibraryFilter _filter(WidgetTester tester) =>
    tester.widget<PublicLibraryFilter>(find.byType(PublicLibraryFilter));

String _posterId(sdk.TrainerPoster poster) =>
    (poster.key! as ValueKey<String>).value.substring('library-poster-'.length);

void _expectCount(WidgetTester tester, int expected) {
  final text = tester.widget<Text>(_key('actions-count')).data!;
  expect(text, matches(RegExp('(^|\\D)$expected(\\D|\$)')));
}

Future<void> _openFilter(WidgetTester tester) async {
  await tester.tap(_key('public-library-filter'));
  await tester.pumpAndSettle();
  expect(_key('public-library-filter-sheet'), findsOneWidget);
}

Future<void> _chooseDraft(WidgetTester tester, String key) async {
  // Quick chips and sheet choices intentionally share facet IDs. Scope the
  // finder to the sheet so the test exercises the visible draft control.
  final choice = find.descendant(
    of: _key('public-library-filter-sheet'),
    matching: _key(key),
  );
  await tester.ensureVisible(choice);
  await tester.pumpAndSettle();
  await tester.tap(choice);
  await tester.pumpAndSettle();
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  late FlareShared shared;
  late sdk.TrainingMediaPolicy policy;
  late Directory temporaryCache;
  final sharedBefore = FlareShared.current;
  final mediaBefore = FlarePublicMedia.current;
  final updateStoreBefore = PoseHubCatalogUpdates.activeStore;

  setUpAll(() async {
    // This suite tests the shipped baseline, not a machine's hot-update cache.
    PoseHubCatalogUpdates.activeStore = null;
    shared = await FlareShared.load();
    final parent = Directory('../output/public-library-flow-tests').absolute;
    await parent.create(recursive: true);
    temporaryCache = await parent.createTemp('media-');
    policy = await FlarePublicMedia.load(
      rootDirectory: temporaryCache.path,
      prefetchBeforeTraining: false,
    );
  });

  setUp(() {
    FlareShared.current = shared;
    FlarePublicMedia.current = policy;
  });

  tearDown(() {
    FlareShared.current = sharedBefore;
    FlarePublicMedia.current = mediaBefore;
  });

  tearDownAll(() async {
    policy.repository.dispose();
    PoseHubCatalogUpdates.activeStore = updateStoreBefore;
    // createTemp above owns this unique directory; never remove its parent.
    await temporaryCache.delete(recursive: true);
  });

  int matching(sdk.TrainingLibraryFilter filter) => shared.library
      .actions(policy.catalog)
      .where((action) => sdk.PoseHubActionFacets.matchesFilter(action, filter))
      .length;

  Future<void> mountLibrary(
    WidgetTester tester, {
    String? initialMuscle,
  }) async {
    await phoneSize(tester);
    await tester.pumpWidget(
      testApp(
        Scaffold(
          body: FlareSharedLibraryPage(
            initialMuscle: initialMuscle,
            // Used only for translated presentation labels, never actions.
            presentationCatalog: loadCatalogFixture(),
          ),
        ),
      ),
    );
    await _settleLocalAssets(tester);
    addTearDown(() => tester.pumpWidget(const SizedBox()));
  }

  Future<SceneController> mountShell(WidgetTester tester) async {
    await phoneSize(tester);
    final store = LearningStore(
      catalog: loadCatalogFixture(),
      storage: MemoryStateStorage(),
    );
    await store.initialize();
    await store.acknowledgeSafety();
    final scene = SceneController(commandSink: (_) {});
    await tester.pumpWidget(
      testApp(
        FlareShell(
          catalog: loadCatalogFixture(),
          store: store,
          sceneController: scene,
          enableScene: false,
        ),
      ),
    );
    scene.receiveEvent({
      'source': 'flare-scene',
      'type': 'ready',
      'period': 9,
      'time': 2.375,
      'phase': {'source': 11},
    });
    scene.pause();
    await tester.pumpAndSettle();
    addTearDown(() async {
      await tester.pumpWidget(const SizedBox());
      scene.dispose();
      store.dispose();
    });
    return scene;
  }

  test('the intact r2-v11 pack exposes 248 actions to library and AI', () {
    final packIds = shared.pack.toAiCatalog().drills.map((d) => d.id).toSet();
    final scopedIds = {...packIds}..remove('n-thomas-test');
    final aiIds = shared.catalog.drills.map((d) => d.id).toSet();
    final libraryIds = shared.library
        .actions(policy.catalog)
        .map((a) => a.id)
        .toSet();
    final profile = flareCoachAppProfile(
      shared: shared,
      executionTiming: shared.sessionBuilder().executionTiming,
    );
    expect(packIds, hasLength(249));
    expect(packIds, contains('n-thomas-test'));
    expect(scopedIds, hasLength(248));
    expect(aiIds, unorderedEquals(packIds));
    expect(libraryIds, unorderedEquals(scopedIds));
    expect(shared.allowedActionIds, unorderedEquals(scopedIds));
    expect(profile.scopeManifest.allowedActionIds, unorderedEquals(libraryIds));
    expect(flareAuthorizedActionIds, unorderedEquals(scopedIds));
    expect(_newR2V1Actions, hasLength(40));
    expect(packIds, containsAll(_newR2V1Actions));
    expect(shared.scope.allowedActionIds, containsAll(_newR2V1Actions));
  });

  test(
    'every scoped action has both verified WebP files in the asset bundle',
    () async {
      expect(shared.allowedActionIds, hasLength(248));
      for (final id in shared.allowedActionIds) {
        final action = policy.actionFor(id)!;
        final assets = {
          policy.posterAssetFor(id)!: action.cover,
          '${FlarePublicMedia.thumbnailRoot}$id.webp': action.thumbnail,
        };
        for (final entry in assets.entries) {
          final data = await rootBundle.load(entry.key);
          final bytes = data.buffer.asUint8List(
            data.offsetInBytes,
            data.lengthInBytes,
          );
          expect(bytes.length, entry.value.bytes, reason: entry.key);
          expect(coach.sha256Hex(bytes), entry.value.sha256, reason: entry.key);
        }
      }
    },
  );

  test(
    'an older verified cache cannot shadow the bundled r2-v11 pack',
    () async {
      const olderPack = 'r2-v10';
      final store = sdk.MemoryPoseHubCatalogStore();
      final olderBytes = utf8.encode(
        jsonEncode({...shared.pack.raw, 'pack': olderPack}),
      );
      final semanticBytes = File(flarePublicSemanticsAsset).readAsBytesSync();
      await store.writeAtomic('packs/$olderPack/catalog.json', olderBytes);
      await store.writeAtomic('packs/$olderPack/semantic.json', semanticBytes);
      await store.writeAtomic(
        'current.json',
        utf8.encode(
          jsonEncode({
            'pack': olderPack,
            'catalog_bytes': olderBytes.length,
            'catalog_sha256': coach.sha256Hex(olderBytes),
          }),
        ),
      );
      final cached = await sdk.readVerifiedPoseHubCatalog(store);
      expect(sdk.poseHubPackVersionOf(cached!), olderPack);
      final pack = await loadFlarePublicCatalog(verifiedCache: store);
      expect(sdk.poseHubPackVersionOf(pack), 'r2-v11');
      expect(
        poseHubCatalogRevisionOf(pack),
        PoseHubCatalogUpdates.bundledCatalogSha256,
      );
    },
  );

  testWidgets('home menu opens all 248 actions with SDK poster artwork', (
    tester,
  ) async {
    final scene = await mountShell(tester);
    await tester.tap(_key('home-menu-chip'));
    await tester.pumpAndSettle();
    await tester.tap(_key('more-library'));
    await _settleLocalAssets(tester);
    expect(find.byType(FlareSharedLibraryPage), findsOneWidget);
    expect(_filter(tester).filter, const sdk.TrainingLibraryFilter());
    _expectCount(tester, 248);
    final artwork = tester
        .widgetList<sdk.TrainerPoster>(find.byType(sdk.TrainerPoster))
        .toList();
    expect(artwork, isNotEmpty);
    for (final art in artwork) {
      final id = _posterId(art);
      expect(shared.allowedActionIds, contains(id));
      expect(art.asset, policy.posterAssetFor(id));
      expect(art.asset, '${FlarePublicMedia.coverRoot}$id.webp');
      final poster = _key('library-poster-$id');
      final context = tester.element(poster);
      expect(
        art.decodeWidth,
        (tester.getSize(poster).width * MediaQuery.devicePixelRatioOf(context))
            .ceil(),
        reason: 'Decode only the physical tile width, not a full-screen poster',
      );
    }
    expect(find.byType(sdk.TrainingActionMedia), findsNothing);
    expect(find.byType(sdk.TrainingLibraryActionArt), findsNothing);
    expect(find.byType(DrillMediaCard), findsNothing);
    expect(scene.playing, isFalse);
    expect(tester.takeException(), isNull);
  });

  testWidgets('a public action card opens the real SDK detail poster first', (
    tester,
  ) async {
    await mountLibrary(tester);
    final poster = tester.widget<sdk.TrainerPoster>(
      find.byType(sdk.TrainerPoster).first,
    );
    final id = _posterId(poster);
    final card = _key('public-action-$id');
    await tester.ensureVisible(card);
    await tester.tap(card);
    // SDK prepares the actual bundled WebP before pushing its detail sheet.
    for (
      var attempt = 0;
      attempt < 30 && find.byType(sdk.TrainingLibraryDetail).evaluate().isEmpty;
      attempt++
    ) {
      await tester.runAsync(
        () => Future<void>.delayed(const Duration(milliseconds: 10)),
      );
      await tester.pump(const Duration(milliseconds: 100));
    }
    await _settleLocalAssets(tester);
    final detail = tester.widget<sdk.TrainingLibraryDetail>(
      find.byType(sdk.TrainingLibraryDetail),
    );
    expect(detail.action.id, id);
    expect(detail.mediaPolicy, same(policy));
    final detailArt = tester.widget<sdk.TrainingLibraryActionArt>(
      find.descendant(
        of: find.byType(sdk.TrainingLibraryDetail),
        matching: find.byType(sdk.TrainingLibraryActionArt),
      ),
    );
    expect(detailArt.actionId, id);
    expect(detailArt.playing, isFalse);
    expect(policy.posterAssetFor(detailArt.actionId), poster.asset);
    expect(_key('library-detail-$id'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('muscle entry uses SDK facets and returns to the paused frame', (
    tester,
  ) async {
    final scene = await mountShell(tester);
    scene.receiveEvent({
      'source': 'flare-scene',
      'type': 'select',
      'groupId': 'deltoids',
      'time': 2.375,
      'playing': false,
      'phase': {'source': 11},
    });
    await tester.pumpAndSettle();
    expect(_key('train-group'), findsOneWidget);
    await tester.tap(_key('detail-card'));
    await tester.pumpAndSettle();
    expect(scene.detailModel, 'muscles');
    final frame = scene.time;
    final selected = scene.selected;
    await tester.tap(_key('train-group'));
    await _settleLocalAssets(tester);
    final expected = matching(
      const sdk.TrainingLibraryFilter(muscle: 'deltoids'),
    );
    expect(expected, greaterThan(0));
    expect(expected, lessThan(248));
    expect(_filter(tester).filter.muscle, 'deltoids');
    expect(_filter(tester).controller.text, isEmpty);
    _expectCount(tester, expected);
    final visibleIds = tester
        .widgetList<sdk.TrainerPoster>(find.byType(sdk.TrainerPoster))
        .map(_posterId);
    for (final id in visibleIds) {
      expect(
        sdk.PoseHubActionFacets.muscles(policy.actionFor(id)!),
        contains('deltoids'),
      );
    }
    await tester.binding.handlePopRoute();
    await tester.pumpAndSettle();
    expect(find.byType(FlareSharedLibraryPage), findsNothing);
    expect(_key('train-group'), findsOneWidget);
    expect(scene.detail, 'deltoids');
    expect(scene.selected, selected);
    expect(scene.time, frame);
    expect(scene.detailModel, 'muscles');
    expect(scene.playing, isFalse);
    expect(tester.takeException(), isNull);
  });

  testWidgets('search clear keeps the incoming muscle restriction', (
    tester,
  ) async {
    await mountLibrary(tester, initialMuscle: 'deltoids');
    await tester.enterText(_key('posehub-search'), 'a');
    await _settleLocalAssets(tester);
    expect(_filter(tester).filter.query, 'a');
    expect(_filter(tester).filter.muscle, 'deltoids');
    _expectCount(tester, matching(_filter(tester).filter));
    await tester.tap(_key('posehub-search-clear'));
    await _settleLocalAssets(tester);
    expect(_filter(tester).controller.text, isEmpty);
    expect(_filter(tester).filter.query, isEmpty);
    expect(_filter(tester).filter.muscle, 'deltoids');
    _expectCount(
      tester,
      matching(const sdk.TrainingLibraryFilter(muscle: 'deltoids')),
    );
    expect(tester.takeException(), isNull);
  });

  testWidgets(
    'filter draft cancels without submission and applies explicitly',
    (tester) async {
      await mountLibrary(tester);
      await _openFilter(tester);
      await _chooseDraft(tester, 'public-library-body-肩');
      expect(_filter(tester).filter.bodyPart, sdk.TrainingLibraryFilter.all);
      await tester.binding.handlePopRoute();
      await _settleLocalAssets(tester);
      expect(_filter(tester).filter, const sdk.TrainingLibraryFilter());
      _expectCount(tester, 248);
      await _openFilter(tester);
      await _chooseDraft(tester, 'public-library-body-肩');
      await tester.tap(_key('public-library-filter-apply'));
      await _settleLocalAssets(tester);
      expect(_key('public-library-filter-sheet'), findsNothing);
      expect(_filter(tester).filter.bodyPart, '肩');
      _expectCount(
        tester,
        matching(const sdk.TrainingLibraryFilter(bodyPart: '肩')),
      );
      expect(tester.takeException(), isNull);
    },
  );

  testWidgets(
    'filter reset clears facets only and preserves search until apply',
    (tester) async {
      await mountLibrary(tester, initialMuscle: 'deltoids');
      await tester.enterText(_key('posehub-search'), 'a');
      await _settleLocalAssets(tester);
      await _openFilter(tester);
      await _chooseDraft(tester, 'public-library-type-力量');
      await tester.tap(_key('public-library-filter-reset'));
      await tester.pumpAndSettle();
      // Reset is still a draft: the active list keeps its original muscle.
      expect(_filter(tester).filter.muscle, 'deltoids');
      expect(_filter(tester).filter.query, 'a');
      final reset = tester.widget<TextButton>(
        _key('public-library-filter-reset'),
      );
      expect(reset.onPressed, isNull);
      await tester.tap(_key('public-library-filter-apply'));
      await _settleLocalAssets(tester);
      expect(_filter(tester).filter.activeCount, 0);
      expect(_filter(tester).filter.query, 'a');
      expect(_filter(tester).controller.text, 'a');
      _expectCount(
        tester,
        matching(const sdk.TrainingLibraryFilter(query: 'a')),
      );
      expect(tester.takeException(), isNull);
    },
  );
}
