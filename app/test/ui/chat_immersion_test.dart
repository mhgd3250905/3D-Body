import 'dart:io';
import 'dart:ui' as ui;

import 'package:flare/coach/coach_config.dart';
import 'package:flare/coach/coach_service.dart';
import 'package:flare/coach/usage_store.dart';
import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/main.dart' show configureFlareSystemUi;
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/ai_coach_page.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_coach_ui/ugk_coach_ui.dart' as cui;

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart' show MemoryStateStorage, labeledControl;

void main() {
  testWidgets(
    'Android explicitly enables edge-to-edge before mounting App routes',
    (tester) async {
      final calls = <MethodCall>[];
      tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(
        SystemChannels.platform,
        (call) async {
          calls.add(call);
          return null;
        },
      );
      addTearDown(
        () => tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(
          SystemChannels.platform,
          null,
        ),
      );
      await configureFlareSystemUi();
      final mode = calls.singleWhere(
        (call) => call.method == 'SystemChrome.setEnabledSystemUIMode',
      );
      expect(mode.arguments, SystemUiMode.edgeToEdge.toString());
    },
    variant: TargetPlatformVariant.only(TargetPlatform.android),
  );

  for (final brightness in Brightness.values) {
    testWidgets(
      'real ${brightness.name} chat bubbles paint into the status area with safe controls',
      (tester) async {
        tester.view.physicalSize = const Size(390, 844);
        tester.view.devicePixelRatio = 1;
        tester.view.padding = const FakeViewPadding(top: 32, bottom: 24);
        tester.view.viewPadding = const FakeViewPadding(top: 32, bottom: 24);
        addTearDown(tester.view.reset);
        addTearDown(() => FlareColors.use(Brightness.dark));
        final catalog = loadCatalogFixture();
        final store = LearningStore(
          catalog: catalog,
          storage: MemoryStateStorage(),
        );
        await store.initialize();
        await store.acknowledgeSafety();
        final service = CoachService(
          config: const CoachConfig(apiKey: 'test'),
          client: uc.FakeLlmClient(const []),
          appCatalog: catalog,
          usage: CoachUsageStore(),
          storage: MemoryStateStorage(),
          readAsset: (path) async => File(path).readAsStringSync(),
        );
        await service.load();
        await service.acceptDisclaimer();
        final at = DateTime.utc(2026, 10, 25, 8);
        String text(int i) => '普通消息 $i，用来确认旧对话滚动时仍可进入状态栏区域。';
        service.restoreHistory([
          for (var i = 0; i < 24; i++)
            uc.CoachConversationMessage(
              id: 'status-row-$i',
              at: at,
              isUser: i.isEven,
              text: text(i),
            ),
        ]);
        final scene = SceneController(commandSink: (_) {});
        addTearDown(store.dispose);
        addTearDown(scene.dispose);
        // The mounted Shell owns its session/service. Awaiting service.dispose
        // again from outer teardown can wait on the first fake-zone stream
        // close; the body unmounts the real owner after checking its pixels.
        final frame = GlobalKey();
        await tester.pumpWidget(
          RepaintBoundary(
            key: frame,
            child: MaterialApp(
              theme: flareTheme(brightness),
              locale: const Locale('zh'),
              localizationsDelegates: AppLocalizations.localizationsDelegates,
              supportedLocales: AppLocalizations.supportedLocales,
              builder: (context, child) {
                FlareColors.use(brightness);
                return child!;
              },
              home: FlareShell(
                catalog: catalog,
                store: store,
                coach: service,
                sceneController: scene,
                enableScene: false,
              ),
            ),
          ),
        );
        await tester.pumpAndSettle();
        scene.receiveEvent({
          'source': 'flare-scene',
          'type': 'ready',
          'time': 0.0,
          'period': 9.0,
          'phase': {'source': 9},
        });
        await tester.pumpAndSettle();
        await tester.tap(labeledControl('计划'));
        await tester.pumpAndSettle();
        await tester.tap(find.byKey(const ValueKey('plan-ai-coach')));
        await tester.pumpAndSettle();
        expect(find.byType(AiCoachPage), findsOneWidget);

        final chat = find.byType(cui.CoachChatList);
        final list = tester.widget<cui.CoachChatList>(chat);
        expect(list.fadeTop, isFalse);
        final header = tester.getRect(
          find.byKey(const ValueKey('coach-header')),
        );
        expect(header.top, 32);
        expect(list.topInset, header.bottom);
        final viewport = find.descendant(
          of: chat,
          matching: find.byType(Viewport),
        );
        expect(tester.getRect(viewport).top, 0);
        expect(
          tester.getRect(find.byKey(const ValueKey('coach-input'))).bottom,
          lessThanOrEqualTo(844 - 24),
        );

        final controller = list.controller;
        controller.jumpTo(controller.position.maxScrollExtent);
        await tester.pumpAndSettle();
        expect(
          tester.getTopLeft(find.text(text(0))).dy,
          greaterThan(header.bottom),
        );
        controller.jumpTo(controller.position.maxScrollExtent / 2);
        await tester.pumpAndSettle();
        final bubbleColor = brightness == Brightness.dark
            ? FlarePalette.dark.raised
            : FlarePalette.light.raised;
        final face = find.descendant(
          of: find.byKey(const ValueKey('status-row-12')),
          matching: find.byWidgetPredicate(
            (widget) =>
                widget is DecoratedBox &&
                widget.decoration is BoxDecoration &&
                (widget.decoration as BoxDecoration).color == bubbleColor,
          ),
        );
        expect(face, findsOneWidget);
        final offset = controller.offset + 8 - tester.getRect(face).top;
        expect(
          offset,
          inExclusiveRange(0, controller.position.maxScrollExtent),
        );
        controller.jumpTo(offset);
        await tester.pumpAndSettle();
        final rect = tester.getRect(face);
        expect(rect.top, closeTo(8, .01));
        expect(rect.bottom, greaterThan(32));
        final boundary = tester.renderObject<RenderRepaintBoundary>(
          find.byKey(frame),
        );
        // Paint before capture, and bound asynchronous pixel readback so a
        // raster failure reports clearly rather than stalling the whole suite.
        await tester.pump();
        expect(boundary.debugNeedsPaint, isFalse);
        final image = boundary.toImageSync(pixelRatio: 1);
        try {
          final bytes = await tester.runAsync(
            () => image
                .toByteData(format: ui.ImageByteFormat.rawRgba)
                .timeout(const Duration(seconds: 15)),
          );
          expect(bytes, isNotNull);
          final expected = [
            (bubbleColor.r * 255).round(),
            (bubbleColor.g * 255).round(),
            (bubbleColor.b * 255).round(),
            255,
          ];
          // Sample solid pixels above the fixed header and before the bubble's
          // text inset. Geometry alone would miss an outer SafeArea/paint clip.
          final x = rect.center.dx.floor();
          for (var y = 14; y <= 16; y++) {
            for (var dx = -2; dx <= 2; dx++) {
              final pixel = (y * image.width + x + dx) * 4;
              expect(
                [
                  for (var channel = 0; channel < 4; channel++)
                    bytes!.getUint8(pixel + channel),
                ],
                expected,
                reason: 'The actual bubble must paint inside the status area',
              );
            }
          }
        } finally {
          image.dispose();
        }
        expect(tester.takeException(), isNull);
        await tester.pumpWidget(const SizedBox());
      },
    );
  }
}
