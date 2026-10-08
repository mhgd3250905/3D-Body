// Visual acceptance harness (not part of `flutter test`): renders each
// redesigned page at phone size with the real fonts and writes PNGs plus the
// 3D stage rectangle, so a scene render can be composited into the frame.
//
//   flutter test --no-pub test_screens/shots_test.dart
//
// Output: build/shots/*.png and build/shots/stage.json
import 'dart:convert';
import 'dart:io';
import 'dart:ui' as ui;

import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/content_pages.dart';
import 'package:flare/ui/theme.dart';
import 'package:flare/ui/timer_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import '../test/domain/fixtures.dart';

class MemoryStateStorage implements LocalStateStorage {
  String? value;
  @override
  Future<String?> read(String key) async => value;
  @override
  Future<void> write(String key, String value) async => this.value = value;
}

final _boundary = GlobalKey();
final stages = <String, List<double>>{};

Widget app(Widget home) => RepaintBoundary(
  key: _boundary,
  child: MaterialApp(
    debugShowCheckedModeBanner: false,
    theme: flareTheme(),
    locale: const Locale('zh'),
    localizationsDelegates: AppLocalizations.localizationsDelegates,
    supportedLocales: AppLocalizations.supportedLocales,
    home: home,
  ),
);

Future<void> loadFonts() async {
  Future<void> load(String family, String path) async {
    final bytes = File(path).readAsBytesSync();
    final loader = FontLoader(family)
      ..addFont(Future.value(ByteData.view(bytes.buffer)));
    await loader.load();
  }

  await load('FlareSans', 'assets/fonts/FlareSans.ttf');
  final flutterRoot =
      Platform.environment['FLUTTER_ROOT'] ?? '/workspace/tools/flutter';
  await load(
    'MaterialIcons',
    '$flutterRoot/bin/cache/artifacts/material_fonts/MaterialIcons-Regular.otf',
  );
}

Future<void> shot(WidgetTester tester, String name) async {
  await tester.pump(const Duration(milliseconds: 400));
  await tester.runAsync(() async {
    for (final element in find.byType(Image).evaluate()) {
      final image = element.widget as Image;
      await precacheImage(image.image, element);
    }
  });
  await tester.pump();
  await tester.pump(const Duration(milliseconds: 400));
  final stage = find.byWidgetPredicate(
    (widget) =>
        widget is ColoredBox &&
        widget.color == FlareColors.background &&
        widget.child == null,
  );
  if (stage.evaluate().isNotEmpty) {
    final rect = tester.getRect(stage.first);
    stages[name] = [rect.left, rect.top, rect.width, rect.height];
  }
  await tester.runAsync(() async {
    final boundary =
        _boundary.currentContext!.findRenderObject()! as RenderRepaintBoundary;
    final image = await boundary.toImage(pixelRatio: 3);
    final data = await image.toByteData(format: ui.ImageByteFormat.png);
    File('build/shots/$name.png')
      ..createSync(recursive: true)
      ..writeAsBytesSync(data!.buffer.asUint8List());
  });
}

void main() {
  final catalog = loadCatalogFixture();
  setUpAll(loadFonts);
  tearDownAll(
    () => File('build/shots/stage.json')
      ..createSync(recursive: true)
      ..writeAsStringSync(jsonEncode(stages)),
  );

  Future<(LearningStore, SceneController)> setup(
    WidgetTester tester, {
    bool accepted = true,
    bool history = false,
  }) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    final store = LearningStore(
      catalog: catalog,
      storage: MemoryStateStorage(),
    );
    await store.initialize();
    if (accepted) await store.acknowledgeSafety();
    if (history) {
      final now = DateTime.now().toUtc();
      for (final (offset, id, sets, pain) in [
        (0, 'obliques-A', 3, false),
        (1, 'forearms-A', 1, false),
        (2, 'deltoids-A', 2, true),
      ]) {
        final start = now.subtract(Duration(days: offset, minutes: 12));
        final planned = catalog.drillById(id)!.dose.sets;
        final done = sets.clamp(0, planned);
        await store.logSession(
          TrainingSession(
            id: 's$offset',
            drillId: id,
            startedAt: start,
            endedAt: start.add(const Duration(minutes: 8)),
            plannedSets: planned,
            completedSets: done,
            activeSeconds: 240,
            completed: done == planned && !pain,
            pain: pain,
          ),
        );
      }
      await store.completeLesson(catalog.stages.first.lessons.first.id);
    }
    final scene = SceneController();
    addTearDown(store.dispose);
    addTearDown(scene.dispose);
    return (store, scene);
  }

  Future<SceneController> shell(
    WidgetTester tester,
    LearningStore store,
    SceneController scene,
  ) async {
    await tester.pumpWidget(
      app(
        FlareShell(
          catalog: catalog,
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
      'time': 2.0,
      'phase': {'source': 11},
    });
    scene.receiveEvent({
      'source': 'flare-scene',
      'type': 'state',
      'time': 2.0,
      'playing': false,
      'phase': {'source': 11},
    });
    await tester.pumpAndSettle();
    return scene;
  }

  testWidgets('01 welcome + 02 safety', (tester) async {
    final (store, scene) = await setup(tester, accepted: false);
    await tester.pumpWidget(
      app(
        FlareShell(
          catalog: catalog,
          store: store,
          sceneController: scene,
          enableScene: false,
        ),
      ),
    );
    await tester.pumpAndSettle();
    await shot(tester, '01-welcome');
    await tester.tap(find.widgetWithText(FilledButton, '开始'));
    await tester.pumpAndSettle();
    await shot(tester, '02-safety');
  });

  testWidgets('03 home, 04 more, 05 muscles', (tester) async {
    final (store, scene) = await setup(tester);
    await shell(tester, store, scene);
    await shot(tester, '03-home');
    await tester.tap(find.bySemanticsLabel('更多').first);
    await tester.pumpAndSettle();
    await shot(tester, '04-more');
    await tester.tapAt(const Offset(195, 40));
    await tester.pumpAndSettle();
    await tester.tap(find.bySemanticsLabel(RegExp('^点选肌群')).first);
    await tester.pumpAndSettle();
    await shot(tester, '05-muscles');
  });

  testWidgets('06 detail motion, 07 detail muscles', (tester) async {
    final (store, scene) = await setup(tester);
    await shell(tester, store, scene);
    scene.receiveEvent({
      'source': 'flare-scene',
      'type': 'select',
      'time': 2.0,
      'groupId': 'obliques',
    });
    await tester.pumpAndSettle();
    await shot(tester, '06-detail-motion');
    scene.receiveEvent({
      'source': 'flare-scene',
      'type': 'state',
      'time': 2.0,
      'playing': false,
      'selected': 'obliques',
      'detail': true,
      'detailModel': 'muscles',
    });
    await tester.pumpAndSettle();
    await shot(tester, '07-detail-muscles');
    await tester.tap(find.byKey(const ValueKey('train-group')));
    await tester.pumpAndSettle();
    await shot(tester, '09-drill-detail');
    await tester.tap(find.text('更多要点、常见错误与安全'));
    await tester.pumpAndSettle();
    await tester.drag(find.byType(ListView).first, const Offset(0, -500));
    await tester.pumpAndSettle();
    await shot(tester, '10-drill-detail-open');
  });

  testWidgets('08 library', (tester) async {
    final (store, scene) = await setup(tester);
    await store.addToToday('obliques-A');
    await tester.pumpWidget(
      app(
        Scaffold(
          body: SafeArea(
            child: LibraryPage(
              catalog: catalog,
              store: store,
              onDrill: (_) {},
              onRemove: (_) {},
              onBack: () {},
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    await shot(tester, '08-library');
  });

  testWidgets('11 timer', (tester) async {
    final (store, _) = await setup(tester);
    await tester.pumpWidget(
      app(
        Scaffold(
          body: SafeArea(
            child: TrainingTimerPage(
              drill: catalog.drillById('obliques-A')!,
              store: store,
              onClose: () {},
            ),
          ),
        ),
      ),
    );
    await tester.pump();
    await shot(tester, '11-timer-ready');
    await tester.tap(find.widgetWithText(FilledButton, '开始'));
    await tester.runAsync(
      () => Future<void>.delayed(const Duration(milliseconds: 3200)),
    );
    await tester.pump(const Duration(milliseconds: 160));
    await tester.tap(find.widgetWithText(FilledButton, '完成 1 次'));
    await tester.tap(find.widgetWithText(FilledButton, '完成 1 次'));
    await tester.pump(const Duration(milliseconds: 160));
    await shot(tester, '12-timer-work');
    await tester.pumpWidget(const SizedBox());
  });

  testWidgets('13 path, 14 lesson, 15 progress, 16 settings, 17 about', (
    tester,
  ) async {
    final (store, scene) = await setup(tester, history: true);
    await tester.pumpWidget(
      app(
        Scaffold(
          body: SafeArea(
            child: PathPage(
              catalog: catalog,
              store: store,
              onLesson: (_) {},
              onGate: (_, _) {},
              onAssessment: () {},
              onBack: () {},
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    await shot(tester, '13-path');
    await tester.pumpWidget(
      app(
        Scaffold(
          body: SafeArea(
            child: LessonPage(
              catalog: catalog,
              lesson: catalog.stages[1].lessons.first,
              store: store,
              onBack: () {},
              onWatch: () {},
              onComplete: () {},
              onDrill: (_) {},
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    await shot(tester, '14-lesson');
    await tester.pumpWidget(
      app(
        Scaffold(
          body: SafeArea(
            child: ProgressPage(
              catalog: catalog,
              store: store,
              onDrill: (_) {},
              onBack: () {},
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    await shot(tester, '15-progress');
    await shell(tester, store, scene);
    await tester.tap(find.bySemanticsLabel('更多').first);
    await tester.pumpAndSettle();
    await tester.tap(find.widgetWithText(ListTile, '设置'));
    await tester.pumpAndSettle();
    await shot(tester, '16-settings');
    await tester.tap(find.text('关于 Flare'));
    await tester.pumpAndSettle();
    await shot(tester, '17-about');
  });

  testWidgets('18 assessment', (tester) async {
    final (_, _) = await setup(tester);
    await tester.pumpWidget(
      app(
        Scaffold(
          body: SafeArea(
            child: AssessmentPage(
              initialGrades: const {},
              onSave: (_) async {},
              onSkip: () async {},
              onBack: () {},
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    await shot(tester, '18-assessment');
  });
}
