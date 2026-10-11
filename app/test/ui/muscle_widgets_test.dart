import 'dart:convert';

import 'package:flare/domain/catalog_models.dart';
import 'package:flare/ui/muscle_widgets.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

final _group = MuscleGroup(
  groupId: 'deltoids',
  section: 'support',
  colour: '#4cc9f0',
  label: '三角肌',
  view: 'front',
  role: '控制承重肩。',
  deep: false,
  panels: ['deltFront', 'deltSide', 'deltRear'],
);

final _longGroup = MuscleGroup(
  groupId: 'scapular',
  section: 'support',
  colour: '#86efc4',
  label: '斜方肌中下部 · 菱形肌',
  view: 'back',
  role: '维持肩带与地面之间的支撑空间。',
  deep: false,
  panels: ['scapular'],
);

class _MuscleArtBundle extends CachingAssetBundle {
  final _pixel = base64Decode(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==',
  );

  @override
  Future<ByteData> load(String key) {
    if (key.startsWith('assets/muscles/')) {
      return Future.value(ByteData.sublistView(_pixel));
    }
    return rootBundle.load(key);
  }
}

Widget _page(
  Widget child, {
  Brightness brightness = Brightness.light,
  double scale = 1,
}) => DefaultAssetBundle(
  bundle: _MuscleArtBundle(),
  child: MaterialApp(
    theme: flareTheme(brightness),
    builder: (context, child) {
      FlareColors.use(brightness);
      return MediaQuery(
        data: MediaQuery.of(
          context,
        ).copyWith(textScaler: TextScaler.linear(scale)),
        child: child!,
      );
    },
    home: Scaffold(body: child),
  ),
);

void main() {
  tearDown(() => FlareColors.use(Brightness.dark));

  testWidgets('image entries retain their muscle-specific tap actions', (
    tester,
  ) async {
    final selected = <String>[];
    await tester.pumpWidget(
      _page(
        Column(
          children: [
            MuscleItemTile(
              group: _group,
              subtitle: '支撑肩控制上身。',
              onTap: () => selected.add('tile:${_group.id}'),
            ),
            MuscleItemChip(
              group: _longGroup,
              onTap: () => selected.add('chip:${_longGroup.id}'),
            ),
          ],
        ),
      ),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.text(_group.label));
    await tester.tap(find.text(_longGroup.label));
    expect(selected, ['tile:deltoids', 'chip:scapular']);
    expect(
      tester.getSize(find.byType(MuscleItemChip)).height,
      greaterThanOrEqualTo(48),
    );
    expect(tester.takeException(), isNull);
  });

  testWidgets('long names fit a 320px page with larger system text', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(320, 800);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    await tester.pumpWidget(
      _page(
        SingleChildScrollView(
          child: Column(
            children: [
              MuscleItemTile(
                group: _longGroup,
                subtitle: '肩带随着躯干移动，维持肩胛与胸廓之间的协调。',
                onTap: () {},
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    MuscleItemChip(group: _longGroup, onTap: () {}),
                    MuscleItemChip(group: _group, onTap: () {}),
                  ],
                ),
              ),
            ],
          ),
        ),
        scale: 2,
      ),
    );
    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);
    for (final element in find.byType(MuscleItemChip).evaluate()) {
      final bounds = tester.getRect(find.byWidget(element.widget));
      expect(bounds.left, greaterThanOrEqualTo(0));
      expect(bounds.right, lessThanOrEqualTo(320));
    }
  });

  testWidgets('themes share artwork and expose one spoken muscle name', (
    tester,
  ) async {
    final semantics = tester.ensureSemantics();
    final backgrounds = <Color>[];
    for (final brightness in [Brightness.light, Brightness.dark]) {
      await tester.pumpWidget(
        _page(
          MuscleItemTile(group: _group, onTap: () {}),
          brightness: brightness,
        ),
      );
      await tester.pumpAndSettle();
      final image = tester.widget<Image>(find.byType(Image));
      expect(
        (image.image as AssetImage).assetName,
        'assets/muscles/deltoids.webp',
      );
      expect(image.excludeFromSemantics, isTrue);
      expect(find.bySemanticsLabel(_group.label), findsOneWidget);
      final thumbnail = find.byType(MuscleThumbnail);
      final decoration = tester.widget<DecoratedBox>(
        find
            .descendant(of: thumbnail, matching: find.byType(DecoratedBox))
            .first,
      );
      backgrounds.add((decoration.decoration as BoxDecoration).color!);
      expect(tester.takeException(), isNull);
    }
    expect(backgrounds.first, isNot(backgrounds.last));
    semantics.dispose();
  });
}
