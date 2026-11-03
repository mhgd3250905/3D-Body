// Uses the pinned SDK media path; unsupported platforms must retain a real
// bundled poster. A poster-only result is never reported as video decoding.
import 'dart:convert';
import 'dart:io';

import 'package:flare/data/flare_public_media.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as sdk;

Future<void> _until(
  WidgetTester tester,
  Future<bool> Function() done,
  String what, {
  Duration timeout = const Duration(seconds: 30),
}) async {
  final end = DateTime.now().add(timeout);
  while (!await done()) {
    if (DateTime.now().isAfter(end)) fail('Timed out waiting for $what');
    await tester.pump(const Duration(milliseconds: 100));
  }
}

void main() {
  final binding = IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  testWidgets('shared media poster and native decoder capability', (
    tester,
  ) async {
    final cache = await Directory.systemTemp.createTemp('flare-ios-media-');
    final policy = await FlarePublicMedia.load(
      rootDirectory: cache.path,
      prefetchBeforeTraining: false,
    );
    final handle = sdk.DrillMediaPlaybackHandle();
    final paused = ValueNotifier(false);
    addTearDown(() async {
      await tester.pumpWidget(const SizedBox());
      handle.dispose();
      paused.dispose();
      await cache.delete(recursive: true);
    });
    const id = 'abs-A';
    expect(policy.actionFor(id), isNotNull);
    expect(policy.posterAssetFor(id), 'assets/public_posters/$id.webp');
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: ValueListenableBuilder<bool>(
            valueListenable: paused,
            builder: (_, value, _) => sdk.TrainingActionMedia(
              actionId: id,
              policy: policy,
              paused: value,
              playbackHandle: handle,
            ),
          ),
        ),
      ),
    );
    await _until(
      tester,
      () async => find
          .descendant(
            of: find.byKey(const ValueKey('public-action-poster')),
            matching: find.byWidgetPredicate(
              (widget) => widget is RawImage && widget.image != null,
            ),
          )
          .evaluate()
          .isNotEmpty,
      'bundled WebP poster decode',
    );
    final supported = sdk.UgkPackedAlphaVideo.isSupported;
    final report = <String, Object?>{
      'actionId': id,
      'bundledPosterDecoded': true,
      'nativeVideoBackendSupported': supported,
      'videoDecodeVerified': false,
    };
    if (supported) {
      await _until(
        tester,
        () async => (await handle.capture())?.ready == true,
        'downloaded shared video first frame',
        timeout: const Duration(seconds: 90),
      );
      final before = (await handle.capture())!.videoSeconds!;
      await tester.pump(const Duration(milliseconds: 600));
      final after = (await handle.capture())!.videoSeconds!;
      expect(after, greaterThan(before + .1));
      paused.value = true;
      await tester.pump(const Duration(milliseconds: 300));
      final stopped = (await handle.capture())!.videoSeconds!;
      await tester.pump(const Duration(milliseconds: 400));
      expect((await handle.capture())!.videoSeconds!, closeTo(stopped, .05));
      report['videoDecodeVerified'] = true;
      report['nativePauseVerified'] = true;
    } else {
      expect((await handle.capture())?.ready, false);
      expect(
        find.byKey(const ValueKey('public-action-progress')),
        findsNothing,
      );
      report['limitation'] = 'Pinned SDK has no iOS packed-alpha backend';
    }
    expect(tester.takeException(), isNull);
    binding.reportData = report;
    debugPrint('FLARE_IOS_SHARED_MEDIA_REPORT ${jsonEncode(report)}');
  });
}
