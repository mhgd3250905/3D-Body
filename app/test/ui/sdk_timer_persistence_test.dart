import 'dart:async';

import 'package:flare/control/learning_store.dart';
import 'package:flare/domain/dose.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/ui/theme.dart';
import 'package:flare/ui/timer_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';

class _MemoryStorage implements LocalStateStorage {
  @override
  Future<String?> read(String key) async => null;
  @override
  Future<void> write(String key, String value) async {}
}

class _SlowStore extends LearningStore {
  _SlowStore()
    : super(catalog: loadCatalogFixture(), storage: _MemoryStorage());
  final attempts = <TrainingSession>[];
  Completer<bool> save = Completer<bool>();
  @override
  Future<bool> logSession(TrainingSession session) {
    attempts.add(session);
    return save.future;
  }
}

void main() {
  testWidgets('closing during save waits; failed retry reuses exact record', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    final store = _SlowStore();
    await store.initialize();
    addTearDown(store.dispose);
    var now = 0;
    var closed = false;
    await tester.pumpWidget(
      MaterialApp(
        theme: flareTheme(),
        locale: const Locale('zh'),
        localizationsDelegates: AppLocalizations.localizationsDelegates,
        supportedLocales: AppLocalizations.supportedLocales,
        home: Scaffold(
          body: SafeArea(
            child: TrainingTimerPage(
              drill: store.catalog
                  .drillById('triceps-A')!
                  .withDose(parseDose('1 组 × 1 次')!),
              store: store,
              now: () => now,
              onClose: () => closed = true,
            ),
          ),
        ),
      ),
    );
    await tester.tap(find.byKey(const ValueKey('training-sound-toggle')));
    await tester.pump();
    expect(store.settings.sound, isFalse);
    await tester.tap(find.widgetWithText(FilledButton, '开始'));
    now = 3000;
    await tester.pump(const Duration(milliseconds: 150));
    await tester.tap(find.widgetWithText(FilledButton, '完成 1 次'));
    await tester.pump(const Duration(milliseconds: 150));
    expect(store.attempts, hasLength(1));
    expect(find.text('正在保存…'), findsOneWidget);
    await tester.tap(find.byTooltip('结束本次练习'));
    await tester.pump();
    expect(closed, isFalse);
    expect(store.attempts, hasLength(1));
    store.save.complete(false);
    await tester.pump();
    expect(closed, isFalse);
    expect(find.text('重试'), findsOneWidget);
    final first = store.attempts.single;
    now = 90000;
    store.save = Completer<bool>();
    await tester.tap(find.text('重试'));
    await tester.pump();
    expect(store.attempts, hasLength(2));
    expect(identical(store.attempts.last, first), isTrue);
    store.save.complete(true);
    await tester.pump();
    await tester.tap(find.byTooltip('结束本次练习'));
    await tester.pump();
    expect(closed, isTrue);
    expect(tester.takeException(), isNull);
    await tester.pumpWidget(const SizedBox());
    await tester.pump(const Duration(milliseconds: 200));
  });
}
