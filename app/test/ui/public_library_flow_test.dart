import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:ui' as ui;

import 'package:flare/coach/flare_coach_profile.dart';
import 'package:flare/control/learning_store.dart';
import 'package:flare/data/catalog.dart';
import 'package:flare/data/flare_action_scope.dart';
import 'package:flare/data/flare_public_catalog.dart';
import 'package:flare/data/flare_public_media.dart';
import 'package:flare/data/flare_shared_library.dart';
import 'package:flare/data/posehub_catalog_updates.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/drill_decoder_pool.dart';
import 'package:flare/ui/drill_media.dart';
import 'package:flare/ui/flare_v5_media.dart';
import 'package:flare/ui/public_library_filter.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/foundation.dart' show ValueListenable;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
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

class _CaptureCoverBundle extends CachingAssetBundle {
  _CaptureCoverBundle(this.key, File cover)
    : _cover = ByteData.sublistView(cover.readAsBytesSync());

  final String key;
  final ByteData _cover;

  @override
  Future<ByteData> load(String key) =>
      key == this.key ? Future.value(_cover) : rootBundle.load(key);
}

class _ControlledVideo extends DrillDecoderRepository {
  _ControlledVideo(super.delegate, this.video, {this.artwork = const {}});

  final coach.PoseHubPackFile video;
  final Map<coach.PoseHubPackFile, Uri> artwork;
  final status = ValueNotifier(
    const sdk.CatalogMediaDownloadState(
      phase: sdk.CatalogMediaDownloadPhase.idle,
    ),
  );
  final uri = Uri.file('/verified/warmup.mp4');
  late Completer<Uri> _download;
  int requests = 0;

  @override
  ValueListenable<sdk.CatalogMediaDownloadState> watchFile(
    coach.PoseHubPackFile file,
  ) => file == video ? status : super.watchFile(file);

  @override
  Future<Uri> ensureFile(coach.PoseHubPackFile file) {
    if (artwork[file] case final local?) return Future.value(local);
    if (file != video) return super.ensureFile(file);
    if (status.value.phase == sdk.CatalogMediaDownloadPhase.ready) {
      return Future.value(uri);
    }
    requests++;
    update(sdk.CatalogMediaDownloadPhase.downloading);
    return (_download = Completer<Uri>()).future;
  }

  void update(sdk.CatalogMediaDownloadPhase phase) {
    status.value = sdk.CatalogMediaDownloadState(
      phase: phase,
      receivedBytes: switch (phase) {
        sdk.CatalogMediaDownloadPhase.downloading => video.bytes * 45 ~/ 100,
        sdk.CatalogMediaDownloadPhase.ready => video.bytes,
        _ => 0,
      },
      totalBytes: video.bytes,
    );
  }

  void fail() {
    update(sdk.CatalogMediaDownloadPhase.failed);
    _download.completeError(StateError('simulated media failure'));
  }

  void finish() {
    update(sdk.CatalogMediaDownloadPhase.ready);
    _download.complete(uri);
  }

  @override
  void dispose() => status.dispose();
}

class _DetailDecoder
    implements sdk.PackedAlphaPlatform, sdk.PackedAlphaUriPlatform {
  final _events = StreamController<Map<Object?, Object?>>.broadcast(sync: true);
  int _id = 0;

  @override
  bool get isSupported => true;

  @override
  Stream<Map<Object?, Object?>> get events => _events.stream;

  @override
  Future<({int playerId, int textureId})> create(String asset) =>
      throw StateError('Expected a verified video file');

  @override
  Future<({int playerId, int textureId})> createUri(Uri uri) async {
    final id = ++_id;
    return (playerId: id, textureId: id);
  }

  void firstFrame() {
    _events.add({'playerId': _id, 'type': 'ready'});
    _events.add({'playerId': _id, 'type': 'first-frame'});
  }

  @override
  Future<Object?> command(int playerId, String type, [Object? value]) async =>
      null;

  Future<void> close() => _events.close();
}

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
    Locale? locale,
  }) async {
    await phoneSize(tester);
    final page = Scaffold(
      body: FlareSharedLibraryPage(
        initialMuscle: initialMuscle,
        // Used only for translated presentation labels, never actions.
        presentationCatalog: loadCatalogFixture(),
      ),
    );
    await tester.pumpWidget(
      testApp(
        locale == null
            ? page
            : Builder(
                builder: (context) => Localizations.override(
                  context: context,
                  locale: locale,
                  child: page,
                ),
              ),
      ),
    );
    await _settleLocalAssets(tester);
    addTearDown(() => tester.pumpWidget(const SizedBox()));
  }

  Future<SceneController> mountShell(
    WidgetTester tester, {
    Catalog? catalog,
    GlobalKey? screenshotBoundary,
    AssetBundle? screenshotBundle,
  }) async {
    await phoneSize(tester);
    final presentation = catalog ?? loadCatalogFixture();
    final store = LearningStore(
      catalog: presentation,
      storage: MemoryStateStorage(),
    );
    await store.initialize();
    await store.acknowledgeSafety();
    final scene = SceneController(commandSink: (_) {});
    final shell = FlareShell(
      catalog: presentation,
      store: store,
      sceneController: scene,
      enableScene: false,
    );
    await tester.pumpWidget(
      screenshotBoundary == null
          ? testApp(shell)
          : RepaintBoundary(
              key: screenshotBoundary,
              child: MaterialApp(
                debugShowCheckedModeBanner: false,
                theme: flareTheme(Brightness.light),
                locale: const Locale('zh'),
                localizationsDelegates: AppLocalizations.localizationsDelegates,
                supportedLocales: AppLocalizations.supportedLocales,
                home: screenshotBundle == null
                    ? shell
                    : DefaultAssetBundle(
                        bundle: screenshotBundle,
                        child: shell,
                      ),
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

  test(
    'the official r2-v29 catalog preserves the library and AI scope',
    () async {
      final bundled = await loadFlareBundledPublicCatalog();
      final packIds = bundled.toAiCatalog().drills.map((d) => d.id).toSet();
      final scopedIds = packIds.intersection(flareAuthorizedActionIds);
      final aiIds = shared.catalog.drills.map((d) => d.id).toSet();
      final libraryIds = shared.library
          .actions(policy.catalog)
          .map((a) => a.id)
          .toSet();
      final profile = flareCoachAppProfile(
        shared: shared,
        executionTiming: shared.sessionBuilder().executionTiming,
      );
      expect(packIds, hasLength(295));
      expect(packIds, contains('n-thomas-test'));
      expect(scopedIds, hasLength(258));
      expect(aiIds, unorderedEquals(packIds));
      expect(scopedIds, isNot(contains(flareWarmupPushupId)));
      expect(scopedIds.intersection(flareSupplementalActionIds), isEmpty);
      expect(
        policy.actionFor(flareWarmupPushupId)?.availableForTraining,
        isTrue,
      );
      expect(libraryIds, unorderedEquals(scopedIds));
      expect(shared.allowedActionIds, unorderedEquals(scopedIds));
      expect(
        profile.scopeManifest.allowedActionIds,
        unorderedEquals(libraryIds),
      );
      expect(flareAuthorizedActionIds.difference(scopedIds), isEmpty);
      expect(
        scopedIds,
        containsAll([
          't-quadruped-straight-leg-raise',
          't-standing-straddle-hands-floor',
          't-reverse-plank-hold',
          't-reverse-plank-hold-fingers-out',
          'h-tabletop-fingers-out',
        ]),
      );
      expect(_newR2V1Actions, hasLength(40));
      expect(packIds, containsAll(_newR2V1Actions));
      expect(shared.scope.allowedActionIds, containsAll(_newR2V1Actions));
    },
  );

  test(
    'every scoped action has both verified WebP files in the asset bundle',
    () async {
      expect(shared.allowedActionIds, hasLength(258));
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
    'an older verified cache cannot shadow the bundled r2-v29 pack',
    () async {
      const olderPack = 'r2-v11';
      final store = sdk.MemoryPoseHubCatalogStore();
      final bundled = await loadFlareBundledPublicCatalog();
      final olderBytes = utf8.encode(
        jsonEncode({...bundled.raw, 'pack': olderPack}),
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
      expect(sdk.poseHubPackVersionOf(pack), 'r2-v29');
      expect(
        poseHubCatalogRevisionOf(pack),
        PoseHubCatalogUpdates.bundledCatalogSha256,
      );
    },
  );

  testWidgets('empty logs open 258 public actions and the local V5 drill', (
    tester,
  ) async {
    final scene = await mountShell(tester);
    await tester.tap(_key('home-menu-chip'));
    await tester.pumpAndSettle();
    await tester.tap(_key('more-progress'));
    await tester.pumpAndSettle();
    await tester.tap(_key('records-start'));
    await _settleLocalAssets(tester);
    expect(find.byType(FlareSharedLibraryPage), findsOneWidget);
    expect(_filter(tester).filter, const sdk.TrainingLibraryFilter());
    _expectCount(tester, 259);
    expect(_key('public-action-flare-v5'), findsOneWidget);
    final v5Poster = tester.widget<sdk.TrainerPoster>(
      _key('library-poster-flare-v5'),
    );
    expect(v5Poster.asset, 'assets/public_posters/flare-v5.webp');
    final artwork = tester
        .widgetList<sdk.TrainerPoster>(find.byType(sdk.TrainerPoster))
        .where((item) => !identical(item, v5Poster))
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

    await tester.tap(_key('public-action-flare-v5'));
    await _settleLocalAssets(tester);
    final demo = _key('demo:flare-v5');
    expect(demo, findsOneWidget);
    expect(tester.widget<DrillMediaCard>(demo).stageColor, Colors.transparent);
    expect(find.byType(FlareV5Media), findsNothing);
    await tester.tap(demo);
    await _settleLocalAssets(tester);
    expect(find.byType(FlareV5Media), findsOneWidget);
    expect(
      tester.widget<FlareV5Media>(find.byType(FlareV5Media)).playing,
      isTrue,
    );
    expect(
      tester.widget<FlareV5Media>(find.byType(FlareV5Media)).background,
      Colors.transparent,
    );
    await tester.tap(demo);
    await _settleLocalAssets(tester);
    expect(
      tester.widget<FlareV5Media>(find.byType(FlareV5Media)).playing,
      isFalse,
    );
    expect(tester.takeException(), isNull);
  });

  Future<sdk.TrainingLibraryDetail> openLibraryDetail(
    WidgetTester tester,
    String id,
  ) async {
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
    return tester.widget<sdk.TrainingLibraryDetail>(
      find.byType(sdk.TrainingLibraryDetail),
    );
  }

  testWidgets('a public action opens its transparent SDK detail poster first', (
    tester,
  ) async {
    await mountLibrary(tester);
    const id = 'forearms-A';
    await tester.enterText(_key('posehub-search'), '跪姿多方向腕部摇摆');
    await _settleLocalAssets(tester);
    await tester.testTextInput.receiveAction(TextInputAction.search);
    await _settleLocalAssets(tester);
    final poster = tester.widget<sdk.TrainerPoster>(_key('library-poster-$id'));
    final detail = await openLibraryDetail(tester, id);
    expect(detail.action.id, id);
    expect(detail.mediaPolicy, same(policy));
    expect(detail.config.displayText, isNull);
    final detailArt = tester.widget<sdk.TrainingLibraryActionArt>(
      find.descendant(
        of: find.byType(sdk.TrainingLibraryDetail),
        matching: find.byType(sdk.TrainingLibraryActionArt),
      ),
    );
    expect(detailArt.actionId, id);
    expect(detailArt.playing, isFalse);
    expect(policy.posterAssetFor(detailArt.actionId), poster.asset);
    final stage = _key('library-public-art-$id');
    final media = tester.widget<sdk.TrainingActionMedia>(stage);
    final size = tester.getSize(stage);
    expect(size.width, size.height);
    expect(size.width, 390 - 32);
    expect(media.stage, Colors.transparent);
    expect(media.mirrored, isFalse);
    expect(_key('library-detail-$id'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('warm-up details autoplay and use the SDK download indicator', (
    tester,
  ) async {
    const screenshot = String.fromEnvironment('FLARE_WARMUP_HUD_SCREENSHOT');
    const catalogArchive = String.fromEnvironment('FLARE_WARMUP_HUD_CATALOG');
    const posterPath = String.fromEnvironment('FLARE_WARMUP_HUD_POSTER');
    final captureR3 = screenshot.isNotEmpty && catalogArchive.isNotEmpty;
    final id = captureR3
        ? 't-quadruped-backhand-press'
        : 't-step-jack-arm-circles';
    final sourcePolicy = captureR3
        ? (await tester.runAsync(() async {
            final pack = coach.PoseHubAppTestCatalog.fromBytes(
              File('$catalogArchive/r2-v26-catalog.json').readAsBytesSync(),
              semanticCatalogBytes: File(
                '$catalogArchive/r2-v26-semantics.json',
              ).readAsBytesSync(),
            );
            FlareShared.current = await FlareShared.load(activeCatalog: pack);
            return FlarePublicMedia.load(
              activeCatalog: pack,
              rootDirectory: temporaryCache.path,
            );
          }))!
        : policy;
    if (captureR3) addTearDown(sourcePolicy.repository.dispose);

    final action = sourcePolicy.actionFor(id)!;
    final cover = captureR3 ? File(posterPath) : null;
    if (cover != null) {
      expect(coach.sha256Hex(cover.readAsBytesSync()), action.cover.sha256);
    }
    final video = _ControlledVideo(
      sourcePolicy.repository,
      action.video,
      artwork: {if (cover != null) action.cover: cover.uri},
    );
    final detailPolicy = sdk.TrainingMediaPolicy(
      repository: video,
      posterAssetRoot: sourcePolicy.posterAssetRoot,
    );
    FlarePublicMedia.current = detailPolicy;
    final decoder = _DetailDecoder();
    final previousPlatform = sdk.UgkPackedAlphaVideo.debugPlatform;
    final previousFilter = sdk.UgkPackedAlphaVideo.debugFilterBuilder;
    sdk.UgkPackedAlphaVideo.debugPlatform = decoder;
    sdk.UgkPackedAlphaVideo.debugFilterBuilder = (child) => child;
    addTearDown(() async {
      await tester.pumpWidget(const SizedBox());
      sdk.UgkPackedAlphaVideo.debugPlatform = previousPlatform;
      sdk.UgkPackedAlphaVideo.debugFilterBuilder = previousFilter;
      video.dispose();
      await decoder.close();
    });

    final snapshot = await tester.runAsync(
      () => loadFlareBundledPlanSnapshot(warmupR3: captureR3),
    );
    final catalog = loadCatalogFixture(
      includeFlarePlans: true,
    ).withPlanSnapshot(snapshot);
    final boundary = screenshot.isEmpty ? null : GlobalKey();
    final screenshotBundle = cover == null
        ? null
        : _CaptureCoverBundle(detailPolicy.posterAssetFor(id)!, cover);
    if (boundary != null) {
      await tester.runAsync(() async {
        const fonts = {
          'FlareSans': 'assets/fonts/FlareSans.ttf',
          'MaterialIcons': 'fonts/MaterialIcons-Regular.otf',
          'packages/cupertino_icons/CupertinoIcons':
              'packages/cupertino_icons/assets/CupertinoIcons.ttf',
        };
        for (final entry in fonts.entries) {
          await (FontLoader(
            entry.key,
          )..addFont(rootBundle.load(entry.value))).load();
        }
        await video.ensureFile(action.cover);
      });
    }
    await mountShell(
      tester,
      catalog: catalog,
      screenshotBoundary: boundary,
      screenshotBundle: screenshotBundle,
    );
    await tester.tap(_key('home-menu-chip'));
    await tester.pumpAndSettle();
    await tester.tap(_key('more-plans'));
    await tester.pumpAndSettle();
    await tester.tap(_key('plan-general-warmup'));
    await _settleLocalAssets(tester);
    expect(find.byType(sdk.TrainingActionMedia), findsNothing);
    expect(video.requests, 0);

    final index = catalog.flareWarmupPlan!.items.indexWhere(
      (item) => item.drill == id,
    );
    final row = _key('flare-plan-item-$index-$id');
    await tester.ensureVisible(row);
    await tester.pumpAndSettle();
    await tester.tap(row);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 450));
    await tester.pump(const Duration(milliseconds: 250));
    final media = find.byType(sdk.TrainingActionMedia);
    expect(media, findsOneWidget);
    final active = tester.widget<sdk.TrainingActionMedia>(media);
    expect(active.actionId, id);
    expect(active.policy, same(detailPolicy));
    expect(active.playing, isTrue);
    expect(active.showInlineStatus, isFalse);
    expect(video.requests, 1);

    final play = _key('library-detail-play');
    final hud = find.byType(sdk.TrainerMediaDownloadIndicator);
    final indicator = tester.widget<sdk.TrainerMediaDownloadIndicator>(hud);
    expect(indicator.state, same(video.status));
    expect(indicator.playbackHandle, same(active.playbackHandle));
    expect(tester.getCenter(hud).dx, greaterThan(tester.getCenter(play).dx));
    expect(
      tester.getTopLeft(hud).dy,
      closeTo(tester.getTopLeft(play).dy + 4, 1),
    );
    expect(_key('media-download-arrow'), findsOneWidget);
    expect(_key('public-action-progress'), findsNothing);
    final sourceCues = ((action.raw['cues'] as Map)['zh'] as List)
        .cast<String>();
    final displayedCues = find.descendant(
      of: _key('library-detail-$id'),
      matching: find.text(sourceCues.join('\n')),
    );
    expect(displayedCues, findsOneWidget);

    if (boundary != null) {
      await tester.runAsync(() async {
        await precacheImage(
          AssetImage(
            detailPolicy.posterAssetFor(id)!,
            bundle: screenshotBundle,
          ),
          tester.element(play),
        );
      });
      await tester.pump();
      await tester.ensureVisible(displayedCues);
      await tester.pump();
      await tester.runAsync(() async {
        final render =
            boundary.currentContext!.findRenderObject()!
                as RenderRepaintBoundary;
        final image = await render.toImage(pixelRatio: 2);
        try {
          final data = (await image.toByteData(
            format: ui.ImageByteFormat.png,
          ))!;
          await File(screenshot).writeAsBytes(data.buffer.asUint8List());
        } finally {
          image.dispose();
        }
      });
      await tester.ensureVisible(play);
      await tester.pump();
    }

    video.fail();
    await tester.pump();
    final retry = _key('media-download-retry');
    expect(retry, findsOneWidget);
    await tester.tap(retry);
    await tester.pump();
    expect(video.requests, 2);
    expect(tester.widget<sdk.TrainingActionMedia>(media).playing, isTrue);

    video.update(sdk.CatalogMediaDownloadPhase.verifying);
    await tester.pump();
    expect(_key('media-download-verifying'), findsOneWidget);
    video.finish();
    await tester.pump();
    await tester.pump();
    expect(_key('media-download-ready'), findsNothing);
    decoder.firstFrame();
    await tester.pump();
    await tester.pump();
    expect(_key('media-download-ready'), findsOneWidget);
    await tester.pump(const Duration(milliseconds: 450));
    await tester.pump(const Duration(milliseconds: 220));
    expect(_key('media-download-indicator'), findsNothing);

    await tester.tap(play);
    await tester.pump();
    expect(tester.widget<sdk.TrainingActionMedia>(media).playing, isFalse);
    await tester.tap(play);
    await tester.pump();
    expect(tester.widget<sdk.TrainingActionMedia>(media).playing, isTrue);

    await tester.binding.handlePopRoute();
    await tester.pumpAndSettle();
    expect(media, findsNothing);
    expect(tester.takeException(), isNull);
  });

  testWidgets('English SDK detail copy covers all 258 actions', (tester) async {
    await mountLibrary(tester, locale: const Locale('en', 'US'));
    final id = _posterId(
      tester.widget<sdk.TrainerPoster>(find.byType(sdk.TrainerPoster).first),
    );
    final detail = await openLibraryDetail(tester, id);
    final displayText = detail.config.displayText!;
    final han = RegExp(r'[\u4e00-\u9fff]');
    final excluded = RegExp(
      r'\b(?:rehab|rehabilitation|therapy|treatment|medical)\b',
      caseSensitive: false,
    );
    var names = 0;
    var cues = 0;
    var cautions = 0;
    var hanMatches = 0;
    var excludedMatches = 0;
    for (final action in detail.config.actions(policy.catalog)) {
      final copy = displayText(action.id)!;
      final sourceCautions = (action.raw['cautionsEn'] as List).cast<String>();
      final contraindications = action.raw['contraindications'] as List;
      expect(copy.name, action.raw['nameEn'], reason: action.id);
      expect(copy.cues, action.raw['cuesEn'], reason: action.id);
      expect(
        copy.cautions,
        hasLength(sourceCautions.length + contraindications.length),
      );
      expect(copy.cautions!.take(sourceCautions.length), sourceCautions);
      names++;
      cues += copy.cues!.length;
      cautions += copy.cautions!.length;
      for (final text in [copy.name!, ...copy.cues!, ...copy.cautions!]) {
        hanMatches += han.allMatches(text).length;
        excludedMatches += excluded.allMatches(text).length;
      }
    }
    expect((names, cues, cautions), (258, 860, 628));
    expect(hanMatches, 0);
    expect(excludedMatches, 0);
    final displayed = displayText(id)!;
    final sheet = find.byType(sdk.TrainingLibraryDetail);
    for (final text in [
      displayed.name!,
      displayed.cues!.join('\n'),
      [
        ...displayed.cautions!,
        detail.config.strings.cautionSuffix.substring(2),
      ].join('\n'),
    ]) {
      expect(
        find.descendant(of: sheet, matching: find.text(text)),
        findsOneWidget,
      );
    }
    debugPrint(
      'English SDK details: $names names, $cues cues, $cautions cautions; '
      'Chinese characters: $hanMatches; excluded terms: $excludedMatches.',
    );
    expect(tester.takeException(), isNull);
  });

  testWidgets('muscle preset filters SDK actions by the incoming facet', (
    tester,
  ) async {
    await mountLibrary(tester, initialMuscle: 'deltoids');
    final expected = matching(
      const sdk.TrainingLibraryFilter(muscle: 'deltoids'),
    );
    expect(expected, greaterThan(0));
    expect(expected, lessThan(258));
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
      _expectCount(tester, 258);
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
