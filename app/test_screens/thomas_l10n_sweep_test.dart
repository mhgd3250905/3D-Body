// UI polish r1 (T7) layout sweep, not part of CI. Pumps the changed Thomas
// pages in long or RTL languages, narrow widths and large text, records any
// RenderFlex overflow per page, and writes a 1x screenshot of each page.
// Runs only when THOMAS_SWEEP=<dir> is set:
//
//   THOMAS_SWEEP=/tmp/sweep THOMAS_SWEEP_CONFIGS=de:320:1.5,ar:393:1.5 \
//     flutter test --no-pub test_screens/thomas_l10n_sweep_test.dart
//
// Output: <dir>/<lang>-<width>-x<scale>/<page>.png and <dir>/overflows.txt.
import 'dart:io';
import 'dart:ui' as ui;

import 'package:flare/control/learning_store.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/l10n/languages.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/content_pages.dart';
import 'package:flare/ui/plans_page.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import '../test/domain/fixtures.dart';

class _Memory implements LocalStateStorage {
  final values = <String, String>{};
  @override
  Future<String?> read(String key) async => values[key];
  @override
  Future<void> write(String key, String value) async => values[key] = value;
}

final _out = Platform.environment['THOMAS_SWEEP'];
final _boundary = GlobalKey();

void main() {
  if (_out == null || _out!.isEmpty) {
    test('THOMAS_SWEEP not set; sweep skipped', () {});
    return;
  }
  final configs =
      (Platform.environment['THOMAS_SWEEP_CONFIGS'] ??
              'de:320:1.5,de:393:1.5,ru:320:1.5,ru:393:1.5,'
                  'ar:320:1.5,ar:393:1.5,ja:320:1.5,ja:393:1.5')
          .split(',')
          .map((c) => c.split(':'))
          .toList();
  final catalog = loadCatalogFixture();
  final log = File('$_out/overflows.txt')..createSync(recursive: true);
  log.writeAsStringSync('');

  setUpAll(() async {
    for (final name in [
      'FlareSans',
      'NotoSansKR',
      'NotoSansArabic',
      'NotoSansDevanagari',
    ]) {
      await (FontLoader(
        name,
      )..addFont(rootBundle.load('assets/fonts/$name.ttf'))).load();
    }
    final root =
        Platform.environment['FLUTTER_ROOT'] ??
        '/workspace/work/flutter-sdk/sdk/flutter';
    final icons = File(
      '$root/bin/cache/artifacts/material_fonts/MaterialIcons-Regular.otf',
    ).readAsBytesSync();
    await (FontLoader(
      'MaterialIcons',
    )..addFont(Future.value(ByteData.view(icons.buffer)))).load();
  });

  for (final c in configs) {
    final lang = c[0];
    final width = double.parse(c[1]);
    final scale = double.parse(c[2]);
    final dir = '$lang-${width.toInt()}-x$scale';
    final locale = localeForLanguage(lang);

    testWidgets('sweep $dir', (tester) async {
      final s = lookupAppLocalizations(locale);
      var current = 'setup';
      final hits = <String>{};
      final previous = FlutterError.onError;
      FlutterError.onError = (details) {
        final text = details.exceptionAsString();
        if (text.contains('overflowed')) {
          hits.add('$dir/$current: ${text.split('\n').first}');
        } else {
          hits.add('$dir/$current: OTHER ${text.split('\n').first}');
        }
      };
      try {
        tester.view.physicalSize = Size(width * 2, 852 * 2);
        tester.view.devicePixelRatio = 2;
        tester.view.padding = const FakeViewPadding(top: 118, bottom: 68);
        tester.view.viewPadding = const FakeViewPadding(top: 118, bottom: 68);
        tester.platformDispatcher.textScaleFactorTestValue = scale;
        addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
        addTearDown(tester.view.reset);
        FlareColors.use(Brightness.dark);

        Future<LearningStore> store({bool history = true}) async {
          final st = LearningStore(catalog: catalog, storage: _Memory());
          await st.initialize();
          await st.acknowledgeSafety();
          await st.updateSettings(themeMode: 'dark', language: lang);
          if (history) {
            final now = DateTime.now();
            for (final o in [0, 1, 2, 3, 5, 8, 9, 15]) {
              final id = ['obliques-A', 'forearms-A', 'triceps-A'][o % 3];
              final start = DateTime(
                now.year,
                now.month,
                now.day - o,
                o == 0 ? (now.hour > 0 ? now.hour - 1 : 0) : 19,
              ).toUtc();
              final planned = catalog.drillById(id)!.dose.sets;
              await st.logSession(
                TrainingSession(
                  id: 'w$o',
                  drillId: id,
                  startedAt: start,
                  endedAt: start.add(const Duration(minutes: 9)),
                  plannedSets: planned,
                  completedSets: o == 2 ? planned - 1 : planned,
                  activeSeconds: 320,
                  completed: o != 2 && o != 5,
                  pain: o == 5,
                ),
              );
            }
            await st.createRoutine('Warm-up', [
              'forearms-A',
              'scapular-A',
              'deltoids-A',
            ]);
          }
          addTearDown(st.dispose);
          return st;
        }

        Widget app(Widget home) => RepaintBoundary(
          key: _boundary,
          child: MaterialApp(
            debugShowCheckedModeBanner: false,
            theme: flareTheme(Brightness.dark),
            themeAnimationDuration: Duration.zero,
            builder: (context, child) {
              FlareColors.use(Theme.of(context).brightness);
              return child!;
            },
            locale: locale,
            localizationsDelegates: AppLocalizations.localizationsDelegates,
            supportedLocales: AppLocalizations.supportedLocales,
            home: home,
          ),
        );
        Widget page(Widget child) => Scaffold(body: SafeArea(child: child));

        Future<void> settle() async {
          for (var i = 0; i < 16; i++) {
            await tester.pump(const Duration(milliseconds: 100));
          }
        }

        Future<void> shot(String name) async {
          current = name;
          await settle();
          await tester.runAsync(() async {
            final b =
                _boundary.currentContext!.findRenderObject()!
                    as RenderRepaintBoundary;
            final image = await b.toImage(pixelRatio: 1);
            final data = await image.toByteData(format: ui.ImageByteFormat.png);
            File('$_out/$dir/$name.png')
              ..createSync(recursive: true)
              ..writeAsBytesSync(data!.buffer.asUint8List());
          });
        }

        Future<void> shell(LearningStore st) async {
          final scene = SceneController(commandSink: (_) {});
          addTearDown(scene.dispose);
          await tester.pumpWidget(
            app(
              FlareShell(
                catalog: catalog,
                store: st,
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
          await settle();
        }

        final st = await store();
        current = 'more';
        await shell(st);
        await tester.tap(find.bySemanticsLabel(RegExp('^${s.more}')).first);
        await shot('04-more-sheet');
        for (final (key, name) in [
          ('library', '08-library'),
          ('plans', '10-plans'),
          ('settings', '17-settings'),
        ]) {
          current = name;
          await tester.pumpWidget(const SizedBox());
          await shell(st);
          await tester.tap(find.bySemanticsLabel(RegExp('^${s.more}')).first);
          await settle();
          await tester.tap(find.byKey(ValueKey('more-$key')));
          await shot(name);
          if (key == 'library') {
            final open = find.byKey(const ValueKey('drill-filter-open'));
            if (open.evaluate().isNotEmpty) {
              await tester.tap(open);
              await shot('08c-filter-sheet');
            }
          }
          if (key == 'settings' || key == 'plans') {
            await tester.drag(
              find.byType(Scrollable).first,
              const Offset(0, -900),
            );
            await shot('${name}b-scrolled');
          }
        }

        current = '09-drill-detail';
        await tester.pumpWidget(
          app(
            page(
              DrillDetailPage(
                drill: catalog.drillById('obliques-A')!,
                group: catalog.groupById('obliques'),
                onBack: () {},
                onStart: () {},
                onAddToPlan: () {},
              ),
            ),
          ),
        );
        await shot('09-drill-detail');
        await tester.drag(find.byType(Scrollable).first, const Offset(0, -700));
        await shot('09b-drill-detail-scrolled');

        current = '11-preset-detail';
        await tester.pumpWidget(
          app(
            page(
              PlanDetailPage(
                title: s.plans,
                line: s.plansHint,
                drills: PresetPlan.all.last.drills(catalog, 'A'),
                store: st,
                onBack: () {},
                onStart: () {},
                onDrill: (_) {},
                onSaveAsMine: () {},
              ),
            ),
          ),
        );
        await shot('11-preset-detail');

        final routine = st.routines.first;
        current = '13-routine-editor';
        await tester.pumpWidget(
          app(
            page(
              RoutineEditorPage(
                catalog: catalog,
                store: st,
                routine: routine,
                onBack: () {},
                onSaved: (_) {},
                onDeleted: () {},
              ),
            ),
          ),
        );
        await shot('13-routine-editor');
        await tester.drag(find.byType(Scrollable).first, const Offset(0, -900));
        await shot('13b-routine-editor-scrolled');
        await tester.tap(find.byIcon(Icons.add_rounded).last);
        await settle();
        current = '14-picker';
        await shot('14-picker-empty');
        var picked = 0;
        for (final drill in catalog.drills.where((x) => x.tier == 'A')) {
          if (picked == 2) break;
          if (routine.drillIds.contains(drill.id)) continue;
          final tile = find.byKey(ValueKey('pick-${drill.id}'));
          if (tile.hitTestable().evaluate().isEmpty) continue;
          await tester.tap(tile);
          await settle();
          picked++;
        }
        await shot('14-picker');

        current = '15-records';
        await tester.pumpWidget(const SizedBox());
        await tester.pumpWidget(
          app(
            page(
              ProgressPage(
                catalog: catalog,
                store: st,
                onBack: () {},
                onDrill: (_) {},
              ),
            ),
          ),
        );
        await shot('15-records');
        await tester.drag(find.byType(Scrollable).first, const Offset(0, -600));
        await shot('15b-records-scrolled');
        final empty = await store(history: false);
        current = '16-records-empty';
        await tester.pumpWidget(
          app(
            page(
              ProgressPage(
                catalog: catalog,
                store: empty,
                onBack: () {},
                onDrill: (_) {},
                onStart: () {},
              ),
            ),
          ),
        );
        await shot('16-records-empty');
      } finally {
        FlutterError.onError = previous;
        log.writeAsStringSync(
          hits.isEmpty ? '$dir: clean\n' : '${hits.join('\n')}\n',
          mode: FileMode.append,
        );
      }
    });
  }
}
