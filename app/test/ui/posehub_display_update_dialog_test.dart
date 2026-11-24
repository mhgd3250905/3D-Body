import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

import 'package:flare/data/flare_public_catalog.dart';
import 'package:flare/data/flare_public_media.dart';
import 'package:flare/data/flare_shared_library.dart';
import 'package:flare/data/posehub_catalog_updates.dart';
import 'package:flare/main.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_coach_ui/ugk_coach_ui.dart' show PoseHubDisplayUpdateDialog;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as sdk;

import '../data/posehub_catalog_updates_test.dart' show CatalogTestHttp;

Future<void> _until(WidgetTester tester, bool Function() done) async {
  for (var i = 0; i < 250 && !done(); i++) {
    await tester.runAsync(
      () => Future<void>.delayed(const Duration(milliseconds: 20)),
    );
    await tester.pump(const Duration(milliseconds: 50));
  }
  expect(done(), isTrue);
}

void main() {
  testWidgets(
    'display failure keeps the mounted Flare catalog; Retry swaps it',
    (tester) async {
      SharedPreferences.setMockInitialValues({});
      tester.binding.platformDispatcher.localeTestValue = const Locale('zh');
      addTearDown(tester.binding.platformDispatcher.clearLocaleTestValue);
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      final root = Directory('.dart_tool').createTempSync('flare-display-ui-');
      addTearDown(() => root.deleteSync(recursive: true));
      final semanticBytes = File(flarePublicSemanticsAsset).readAsBytesSync();
      final baseline = coach.PoseHubAppTestCatalog.fromBytes(
        File(flarePublicCatalogAsset).readAsBytesSync(),
        semanticCatalogBytes: semanticBytes,
      );
      // Use a real production action and checksums in a small release fixture.
      // The SDK updater's injected local fixture has the same single action.
      final action = baseline.tryGet('chest-A')!;
      final files = action.files.values;
      final oneAction = <String, Object?>{
        ...baseline.raw,
        'totalCount': 1,
        'readyCount': 1,
        'pendingCount': 0,
        'actions': [action.raw],
        'displayAssets': <String, Object?>{},
        'trainingSemantics': {
          ...baseline.raw['trainingSemantics'] as Map<String, Object?>,
          'definitionCompleteCount': 1,
          'definitionCompleteIds': [action.id],
          'incompleteActionIds': <String>[],
        },
        'mediaDistribution': {
          ...baseline.raw['mediaDistribution'] as Map<String, Object?>,
          'mediaFiles': files.length,
          'mediaBytes': files.fold<int>(0, (total, file) => total + file.bytes),
          'themeFiles': 0,
          'themeBytes': 0,
        },
      };
      final local = coach.PoseHubAppTestCatalog.fromBytes(
        utf8.encode(jsonEncode(oneAction)),
        semanticCatalogBytes: semanticBytes,
      );
      const version = 'r2-v25';
      final catalogBytes = utf8.encode(
        jsonEncode({...oneAction, 'pack': version}),
      );
      final catalog = coach.PoseHubAppTestCatalog.fromBytes(
        catalogBytes,
        semanticCatalogBytes: semanticBytes,
      );
      final pointer = PoseHubCatalogUpdates.buildConfig.pointerUri;
      final http = CatalogTestHttp(pointer)
        ..publish(version, catalogBytes, catalog, semanticBytes);
      final catalogUri = pointer.resolve('../$version/catalog.json');
      final downloaded = Completer<List<int>>();
      http.files[catalogUri] = () => downloaded.future;
      final media = sdk.PoseHubActionLibrary.mediaBaseUriFor(catalog);
      final cover = action.cover.resolve(media);
      final thumbnail = action.thumbnail.resolve(media);
      final coverBytes = File(
        '${FlarePublicMedia.coverRoot}${action.id}.webp',
      ).readAsBytesSync();
      final thumbnailBytes = File(
        '${FlarePublicMedia.thumbnailRoot}${action.id}.webp',
      ).readAsBytesSync();
      http.files[cover] = () async => Uint8List(coverBytes.length);
      http.files[thumbnail] = () async => thumbnailBytes;
      final store = sdk.MemoryPoseHubCatalogStore();
      final updates = (await PoseHubCatalogUpdates.start(
        store: store,
        http: http,
        assetRootDirectory: root.absolute.path,
        loadLocal: () async => local,
      ))!;
      expect(http.requests, isEmpty);

      await tester.pumpWidget(FlareBootstrap(catalogUpdates: updates));
      final dialog = find.byType(PoseHubDisplayUpdateDialog);
      await _until(
        tester,
        () => dialog.evaluate().isNotEmpty && FlarePublicMedia.current != null,
      );
      expect(find.text(version), findsOneWidget);
      expect(
        find.descendant(
          of: dialog,
          matching: find.byType(LinearProgressIndicator),
        ),
        findsOneWidget,
      );
      final original = FlareShared.current;
      final oldPolicy = FlarePublicMedia.current;
      expect(
        sdk.poseHubPackVersionOf(original!.pack),
        PoseHubCatalogUpdates.bundledPackVersion,
      );
      final shell = find.byType(FlareShell, skipOffstage: false);
      final originalShell = tester.element(shell);

      downloaded.complete(catalogBytes);
      final retry = find.descendant(
        of: dialog,
        matching: find.byType(FilledButton),
      );
      await _until(tester, () => retry.evaluate().isNotEmpty);
      expect(FlareShared.current, same(original));
      expect(FlarePublicMedia.current, same(oldPolicy));
      expect(await sdk.readVerifiedPoseHubCatalog(store), isNull);

      http.files[cover] = () async => coverBytes;
      await tester.tap(retry);
      await _until(
        tester,
        () => FlareShared.current != original && dialog.evaluate().isEmpty,
      );
      expect(sdk.poseHubPackVersionOf(FlareShared.current!.pack), version);
      expect(
        FlarePublicMedia.current!.catalog,
        same(FlareShared.current!.pack),
      );
      expect(tester.element(shell), same(originalShell));
      expect(http.requests, isNot(contains(action.video.resolve(media))));
      expect(tester.takeException(), isNull);
      await tester.pumpWidget(const SizedBox.shrink());
    },
  );
}
