import 'dart:convert';

import 'package:flare/data/drill_media.dart';
import 'package:flare/platform/drill_media/media_controller.dart';
import 'package:flare/platform/drill_media/media_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:webview_flutter/webview_flutter.dart';

Future<void> _until(
  WidgetTester tester,
  bool Function() done,
  String what,
) async {
  final end = DateTime.now().add(const Duration(seconds: 30));
  while (!done()) {
    if (DateTime.now().isAfter(end)) fail('Timed out waiting for $what');
    await tester.pump(const Duration(milliseconds: 100));
  }
}

void main() {
  final binding = IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  testWidgets('offline video decodes, advances and stops in WKWebView', (
    tester,
  ) async {
    final media = (await DrillMedia.load()).values.first;
    final controller = DrillMediaController();
    addTearDown(controller.dispose);
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: Center(
            child: AspectRatio(
              aspectRatio: 1,
              child: DrillMediaPlatformView(
                media: media,
                controller: controller,
                labels: const {},
              ),
            ),
          ),
        ),
      ),
    );
    await _until(
      tester,
      () => controller.ready || controller.failed,
      'metadata',
    );
    expect(controller.failed, isFalse);
    final web = tester.widget<WebViewWidget>(find.byType(WebViewWidget));
    Future<Map<String, dynamic>> snapshot() async {
      final result = await web.platform.params.controller
          .runJavaScriptReturningResult('''JSON.stringify((() => {
          const v = document.querySelector('video');
          return {time:v.currentTime, paused:v.paused, width:v.videoWidth,
            readyState:v.readyState, error:v.error?.code ?? null,
            host:location.hostname};
        })())''');
      var value = jsonDecode(result.toString());
      if (value is String) value = jsonDecode(value);
      return Map<String, dynamic>.from(value as Map);
    }

    final before = await snapshot();
    expect(before['host'], '127.0.0.1');
    controller.toggle();
    await _until(
      tester,
      () => (controller.playing && controller.hasFrame) || controller.failed,
      'decoded first frame',
    );
    expect(controller.failed, isFalse);
    await tester.pump(const Duration(milliseconds: 600));
    final playing = await snapshot();
    expect(playing['width'], greaterThan(0));
    expect(playing['readyState'], greaterThanOrEqualTo(2));
    expect(playing['error'], isNull);
    expect((playing['time'] as num) - (before['time'] as num), greaterThan(.1));
    controller.pause();
    await _until(tester, () => !controller.playing, 'pause acknowledgement');
    final paused = await snapshot();
    await tester.pump(const Duration(milliseconds: 350));
    expect((await snapshot())['time'], paused['time']);
    controller.toggle();
    await _until(tester, () => controller.playing, 'resume acknowledgement');
    controller.setActive(false);
    await _until(tester, () => !controller.playing, 'inactive pause');
    expect((await snapshot())['paused'], isTrue);
    binding.reportData = {'mediaId': media.id, 'video': playing};
    await tester.pumpWidget(const SizedBox());
  });
}
