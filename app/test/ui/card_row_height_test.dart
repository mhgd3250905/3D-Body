import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/ui/components.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';

void main() {
  final drill = loadCatalogFixture().drills.first;
  setUpAll(() async {
    await (FontLoader(
      'FlareSans',
    )..addFont(rootBundle.load('assets/fonts/FlareSans.ttf'))).load();
  });
  tearDown(() => FlareColors.use(Brightness.dark));

  for (final language in ['en', 'de']) {
    for (final brightness in Brightness.values) {
      for (final scale in [1.0, 1.5, 2.0]) {
        testWidgets(
          'card rows align while copy wraps $language/$brightness/$scale',
          (tester) async {
            tester.view.physicalSize = const Size(390, 844);
            tester.view.devicePixelRatio = 1;
            addTearDown(tester.view.resetPhysicalSize);
            addTearDown(tester.view.resetDevicePixelRatio);
            final longDose = language == 'en'
                ? '3 sets × 6 reps · each side'
                : '3 Sätze × 6 Wiederholungen · je Seite';
            final shortDose = language == 'en'
                ? '3 sets × 8 reps'
                : '3 Sätze × 8';
            await tester.pumpWidget(
              MaterialApp(
                locale: Locale(language),
                localizationsDelegates: AppLocalizations.localizationsDelegates,
                supportedLocales: AppLocalizations.supportedLocales,
                theme: flareTheme(brightness),
                builder: (context, child) {
                  FlareColors.use(Theme.of(context).brightness);
                  return MediaQuery(
                    data: MediaQuery.of(context).copyWith(
                      textScaler: TextScaler.linear(scale),
                      boldText: scale == 2,
                    ),
                    child: child!,
                  );
                },
                home: Scaffold(
                  body: CustomScrollView(
                    slivers: [
                      SliverPadding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        sliver: SliverCardRows(
                          itemCount: 3,
                          itemHeightBuilder: (context, width, index) =>
                              DrillCard.measureLibraryHeight(
                                context,
                                width: width,
                                title: index == 0
                                    ? 'Push-Up to Side Plank Rotation'
                                    : 'Deep Parallette Push-Up',
                                subtitle: index == 0 ? longDose : shortDose,
                              ),
                          itemBuilder: (_, index) => _NaturalLayoutOnly(
                            child: DrillCard(
                              key: ValueKey('card-$index'),
                              drill: drill,
                              groupLabel: 'Core',
                              color: FlarePalette.light.accent,
                              onTap: () {},
                              libraryPresentation: true,
                              title: index == 0
                                  ? 'Push-Up to Side Plank Rotation'
                                  : 'Deep Parallette Push-Up',
                              subtitle: index == 0 ? longDose : shortDose,
                              artwork: const SizedBox.expand(),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
            await tester.pumpAndSettle();
            final first = tester.getRect(find.byKey(const ValueKey('card-0')));
            final second = tester.getRect(find.byKey(const ValueKey('card-1')));
            expect(tester.takeException(), isNull);
            if (scale == 1) {
              expect(first.top, second.top);
              expect(first.bottom, closeTo(second.bottom, .01));
              final longText = find.text(longDose);
              final shortText = find.text(shortDose).first;
              expect(
                tester.getSize(longText).height,
                greaterThan(tester.getSize(shortText).height),
              );
              final third = tester.getRect(
                find.byKey(const ValueKey('card-2')),
              );
              expect(third.top, greaterThan(first.bottom));
              expect(
                third.height,
                lessThan(first.height),
                reason: 'Only peers in the same row share height',
              );
            } else {
              expect(first.left, second.left);
              expect(
                second.top,
                greaterThan(first.bottom),
                reason: 'Large text retains the existing single-column layout',
              );
            }
          },
        );
      }
    }
  }
}

// The visible-row layout must not recursively query card intrinsic sizes.
// This catches reintroducing IntrinsicHeight even when pixels still align.
class _NaturalLayoutOnly extends SingleChildRenderObjectWidget {
  const _NaturalLayoutOnly({required super.child});
  @override
  RenderObject createRenderObject(BuildContext context) => _NaturalLayoutBox();
}

class _NaturalLayoutBox extends RenderProxyBox {
  @override
  double computeMinIntrinsicWidth(double height) =>
      throw StateError('Intrinsic width queried');
  @override
  double computeMaxIntrinsicWidth(double height) =>
      throw StateError('Intrinsic width queried');
  @override
  double computeMinIntrinsicHeight(double width) =>
      throw StateError('Intrinsic height queried');
  @override
  double computeMaxIntrinsicHeight(double width) =>
      throw StateError('Intrinsic height queried');
}
