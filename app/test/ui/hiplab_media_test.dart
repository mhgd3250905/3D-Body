import 'dart:async';
import 'dart:io';

import 'package:flare/data/flare_public_media.dart';
import 'package:flare/data/flare_shared_library.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/ui/drill_decoder_pool.dart';
import 'package:flare/ui/drill_media.dart';
import 'package:flare/ui/motion.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as sdk;

class _FileBundle extends CachingAssetBundle {
  @override
  Future<ByteData> load(String key) async =>
      ByteData.sublistView(File(key).readAsBytesSync());
}

class _Repository implements sdk.CatalogMediaRepository {
  _Repository(this.catalog);
  @override
  final coach.PoseHubAppTestCatalog catalog;
  final state = ValueNotifier(
    const sdk.CatalogMediaDownloadState(
      phase: sdk.CatalogMediaDownloadPhase.ready,
    ),
  );
  int retained = 0;
  @override
  Uri get mediaBaseUri => Uri.parse('https://example.invalid/');
  @override
  Future<Uri> ensureFile(coach.PoseHubPackFile file) async =>
      Uri.file('/verified/${file.path}');
  @override
  Future<Uri> ensureAction(String actionId) =>
      ensureFile(catalog.tryGet(actionId)!.video);
  @override
  ValueListenable<sdk.CatalogMediaDownloadState> watchFile(
    coach.PoseHubPackFile file,
  ) => state;
  @override
  ValueListenable<sdk.CatalogMediaDownloadState> watchAction(String actionId) =>
      state;
  @override
  Future<Uri?> cachedVideo(String actionId) => ensureAction(actionId);
  @override
  VoidCallback retainVideo(String actionId) {
    retained++;
    var released = false;
    return () {
      if (released) return;
      released = true;
      retained--;
    };
  }

  @override
  Future<int> videoCacheBytes() async => 0;
  @override
  Future<void> clearVideoCache() async {}
  @override
  void dispose() => state.dispose();
}

class _Native implements sdk.PackedAlphaPlatform, sdk.PackedAlphaUriPlatform {
  final _events = StreamController<Map<Object?, Object?>>.broadcast(sync: true);
  final alive = <int>{};
  final retiring = <int, Completer<Object?>>{};
  final creating = <int, Completer<void>>{};
  final commands = <(int, String)>[];
  int creates = 0;
  int peak = 0;
  bool delayDisposal = false;
  bool delayCreation = false;
  @override
  bool get isSupported => true;
  @override
  Stream<Map<Object?, Object?>> get events => _events.stream;
  void _emit(int id, String type, [Map<String, Object?> fields = const {}]) {
    scheduleMicrotask(() {
      if (!_events.isClosed) {
        _events.add({'playerId': id, 'type': type, ...fields});
      }
    });
  }

  @override
  Future<({int playerId, int textureId})> create(String asset) =>
      throw StateError('Expected the verified public URI');
  @override
  Future<({int playerId, int textureId})> createUri(Uri sourceUri) async {
    final id = ++creates;
    alive.add(id);
    if (alive.length > peak) peak = alive.length;
    if (delayCreation) {
      await (creating[id] = Completer<void>()).future;
    }
    _emit(id, 'ready');
    _emit(id, 'first-frame');
    return (playerId: id, textureId: id);
  }

  @override
  Future<Object?> command(int playerId, String type, [Object? value]) async {
    commands.add((playerId, type));
    if (type == 'dispose') {
      if (delayDisposal) {
        await (retiring[playerId] ??= Completer<Object?>()).future;
      }
      alive.remove(playerId);
    } else if (type == 'play' || type == 'pause') {
      _emit(playerId, 'state', {'playing': type == 'play'});
    }
    return null;
  }

  void finishDisposals() {
    delayDisposal = false;
    for (final completion in retiring.values) {
      if (!completion.isCompleted) completion.complete();
    }
    retiring.clear();
  }

  void finishCreations() {
    delayCreation = false;
    for (final completion in creating.values) {
      if (!completion.isCompleted) completion.complete();
    }
    creating.clear();
  }

  Future<void> close() => _events.close();
}

Widget _app(Widget child) => MaterialApp(
  locale: const Locale('en'),
  supportedLocales: AppLocalizations.supportedLocales,
  localizationsDelegates: AppLocalizations.localizationsDelegates,
  theme: flareTheme(Brightness.light),
  home: Scaffold(body: child),
);

Future<void> _settleMedia(WidgetTester tester) async {
  for (var i = 0; i < 5; i++) {
    await tester.pump(const Duration(milliseconds: 40));
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  late FlareShared shared;
  late List<String> ids;
  setUpAll(() async {
    shared = await FlareShared.load(bundle: _FileBundle());
    ids = shared.allowedActionIds.take(3).toList();
  });

  test(
    'decoder queue cancels waiting requests and releases idempotently',
    () async {
      final pool = DrillDecoderPool();
      final first = pool.acquire();
      final second = pool.acquire();
      final cancelled = pool.acquire();
      final next = pool.acquire();
      expect(await first.ready, isTrue);
      expect(await second.ready, isTrue);
      cancelled.release();
      expect(await cancelled.ready, isFalse);
      expect(pool.activeCount, 2);
      first.release();
      first.release();
      expect(await next.ready, isTrue);
      expect(pool.activeCount, 2);
      second.release();
      next.release();
      expect(pool.activeCount, 0);
    },
  );

  Future<_Native> install(WidgetTester tester) async {
    final oldShared = FlareShared.current;
    final oldPolicy = FlarePublicMedia.current;
    final oldPlatform = sdk.UgkPackedAlphaVideo.debugPlatform;
    final oldFilter = sdk.UgkPackedAlphaVideo.debugFilterBuilder;
    final repository = _Repository(shared.pack);
    final native = _Native();
    FlareShared.current = shared;
    FlarePublicMedia.current = sdk.TrainingMediaPolicy(repository: repository);
    sdk.UgkPackedAlphaVideo.debugPlatform = native;
    sdk.UgkPackedAlphaVideo.debugFilterBuilder = (child) => child;
    addTearDown(() async {
      native.finishCreations();
      native.finishDisposals();
      await tester.pumpWidget(const SizedBox.shrink());
      await _settleMedia(tester);
      expect(repository.retained, 0);
      expect(native.alive, isEmpty);
      FlareShared.current = oldShared;
      FlarePublicMedia.current = oldPolicy;
      sdk.UgkPackedAlphaVideo.debugPlatform = oldPlatform;
      sdk.UgkPackedAlphaVideo.debugFilterBuilder = oldFilter;
      repository.dispose();
      await native.close();
      FlareColors.use(Brightness.dark);
    });
    return native;
  }

  testWidgets('pause and resume retain the same native surface and frame', (
    tester,
  ) async {
    final native = await install(tester);
    const key = ValueKey('media');
    await tester.pumpWidget(
      _app(
        SizedBox.square(
          dimension: 160,
          child: DrillMediaCard(key: key, drillId: ids[0]),
        ),
      ),
    );
    await tester.tap(find.byKey(key));
    await _settleMedia(tester);
    expect(native.creates, 1);
    final element = tester.element(find.byType(sdk.TrainingActionMedia));
    await tester.tap(find.byKey(key));
    await _settleMedia(tester);
    final paused = tester.widget<sdk.TrainingActionMedia>(
      find.byType(sdk.TrainingActionMedia),
    );
    expect(paused.playing, isTrue);
    expect(paused.paused, isTrue);
    expect(tester.element(find.byType(sdk.TrainingActionMedia)), same(element));
    expect(native.creates, 1);
    expect(native.commands.where((c) => c.$2 == 'dispose'), isEmpty);
    await tester.tap(find.byKey(key));
    await _settleMedia(tester);
    expect(
      tester
          .widget<sdk.TrainingActionMedia>(find.byType(sdk.TrainingActionMedia))
          .paused,
      isFalse,
    );
    expect(native.creates, 1);
    expect(native.commands.where((c) => c.$2 == 'seek'), isEmpty);
  });

  testWidgets('third decoder waits for actual asynchronous native disposal', (
    tester,
  ) async {
    final native = await install(tester);
    await tester.pumpWidget(
      _app(
        Column(
          children: [
            for (var i = 0; i < 3; i++)
              SizedBox.square(
                dimension: 120,
                child: DrillMediaCard(key: ValueKey(i), drillId: ids[i]),
              ),
          ],
        ),
      ),
    );
    await tester.tap(find.byKey(const ValueKey(0)));
    await _settleMedia(tester);
    await tester.tap(find.byKey(const ValueKey(1)));
    await _settleMedia(tester);
    expect(native.creates, 2);
    native.delayDisposal = true;
    await tester.tap(find.byKey(const ValueKey(2)));
    await _settleMedia(tester);
    expect(native.retiring, isNotEmpty);
    expect(native.creates, 2);
    expect(native.alive.length, 2);
    native.finishDisposals();
    await _settleMedia(tester);
    expect(native.creates, 3);
    expect(native.peak, 2);
    expect(native.alive.length, 2);
  });

  testWidgets('retired in-flight native creates keep their decoder admission', (
    tester,
  ) async {
    final native = await install(tester);
    native.delayCreation = true;
    await tester.pumpWidget(
      _app(
        Column(
          children: [
            for (var i = 0; i < 3; i++)
              SizedBox.square(
                dimension: 120,
                child: DrillMediaCard(key: ValueKey(i), drillId: ids[i]),
              ),
          ],
        ),
      ),
    );
    await tester.tap(find.byKey(const ValueKey(0)));
    await _settleMedia(tester);
    await tester.tap(find.byKey(const ValueKey(1)));
    await _settleMedia(tester);
    expect(native.creates, 2);
    await tester.tap(find.byKey(const ValueKey(2)));
    await _settleMedia(tester);
    expect(native.creates, 2);
    native.finishCreations();
    await _settleMedia(tester);
    expect(native.creates, 3);
    expect(native.peak, 2);
  });

  testWidgets('leaving a stage page releases its frame without build errors', (
    tester,
  ) async {
    final native = await install(tester);
    var active = true;
    late StateSetter update;
    await tester.pumpWidget(
      _app(
        StatefulBuilder(
          builder: (context, setState) {
            update = setState;
            return FlarePageActivity(
              active: active,
              child: SizedBox.square(
                dimension: 160,
                child: DrillMediaCard(drillId: ids[0]),
              ),
            );
          },
        ),
      ),
    );
    await tester.tap(find.byType(DrillMediaCard));
    await _settleMedia(tester);
    update(() => active = false);
    await _settleMedia(tester);
    expect(native.alive, isEmpty);
    expect(tester.takeException(), isNull);
  });

  testWidgets('multiple autoplay cards share the single playback owner', (
    tester,
  ) async {
    await install(tester);
    await tester.pumpWidget(
      _app(
        Column(
          children: [
            for (var i = 0; i < 3; i++)
              SizedBox.square(
                dimension: 120,
                child: DrillMediaCard(drillId: ids[i], autoPlay: true),
              ),
          ],
        ),
      ),
    );
    await _settleMedia(tester);
    final art = tester.widgetList<sdk.TrainingActionMedia>(
      find.byType(sdk.TrainingActionMedia),
    );
    expect(art.where((w) => w.playing && !w.paused).length, 1);
    expect(art.where((w) => w.playing).length, 2);
    expect(tester.takeException(), isNull);
  });
}
