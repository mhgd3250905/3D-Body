import 'package:flare/control/learning_store.dart';
import 'package:flare/data/catalog.dart';
import 'package:flare/data/content_translations.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/l10n/languages.dart';
import 'package:flare/platform/scene/scene_controller.dart';
import 'package:flare/ui/app_shell.dart';
import 'package:flare/ui/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';
import 'flow_regressions_test.dart' show MemoryStateStorage;

const _fontAssets = <String, String>{
  'FlareSans': 'assets/fonts/FlareSans.ttf',
  'NotoSansKR': 'assets/fonts/NotoSansKR.ttf',
  'NotoSansArabic': 'assets/fonts/NotoSansArabic.ttf',
  'NotoSansDevanagari': 'assets/fonts/NotoSansDevanagari.ttf',
};

const _buttonLabelStyle = TextStyle(
  fontFamily: 'FlareSans',
  fontFamilyFallback: ['NotoSansKR', 'NotoSansArabic', 'NotoSansDevanagari'],
  fontSize: 16,
  fontWeight: FontWeight.w700,
  letterSpacing: .5,
);

const _sceneLabelStyle = TextStyle(
  fontFamily: 'FlareSans',
  fontFamilyFallback: ['NotoSansKR', 'NotoSansArabic', 'NotoSansDevanagari'],
  fontSize: 13,
  fontWeight: FontWeight.w700,
);

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  final source = loadCatalogFixture();

  tearDown(() => FlareColors.use(Brightness.dark));

  testWidgets(
    'compact muscle labels, home hint, and detail actions fit across locales and phone sizes',
    (tester) async {
      await _precacheFonts(tester);
      final translations = (await tester.runAsync(
        () => ContentTranslations.load(),
      ))!;
      const sizes = [Size(320, 700), Size(390, 844)];
      final failures = <String>[];
      expect(languageNames.length, 14);
      expect(source.groups, hasLength(17));

      for (final language in languageNames.keys) {
        final locale = localeForLanguage(language);
        final shortLabels = translations.shortLabelsFor(language);
        final expectedGroupIds = source.groups.map((group) => group.id).toSet();
        _recordFailure(
          failures,
          shortLabels.keys.toSet().containsAll(expectedGroupIds) &&
              shortLabels.length == expectedGroupIds.length,
          '$language short labels must cover the 17 stable group IDs',
        );
        final catalog = source.localized(
          translations.forLanguage(language),
          shortLabels: shortLabels,
        );

        for (final size in sizes) {
          _setSize(tester, size);
          final store = LearningStore(
            catalog: catalog,
            storage: MemoryStateStorage(),
          );
          await store.initialize();
          await store.acknowledgeSafety();
          await store.setLastTime(2.375);
          final commands = <Map<String, Object?>>[];
          final scene = SceneController(
            commandSink: (command) => commands.add(command),
          );
          addTearDown(store.dispose);
          addTearDown(scene.dispose);

          await tester.pumpWidget(
            _app(
              locale: locale,
              home: FlareShell(
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
            'time': 2.375,
            'period': 9.0,
            'phase': {'source': 11},
          });
          await _pumpTransitions(tester);

          final shellContext = tester.element(find.byType(FlareShell));
          final strings = AppLocalizations.of(shellContext);
          final direction = Directionality.of(shellContext);
          final homeHint = find.byKey(const ValueKey('home-muscle-hint'));
          expect(homeHint, findsOneWidget, reason: '$language at $size');
          final hintRect = tester.getRect(homeHint);
          _recordFailure(
            failures,
            hintRect.left >= 0 &&
                hintRect.right <= size.width &&
                hintRect.width <= size.width * .46 + 1,
            '$language home hint must stay within 46% of $size width; got '
            '${hintRect.width}px at $size',
          );
          final hintText = find.descendant(
            of: homeHint,
            matching: find.byType(Text),
          );
          expect(hintText, findsOneWidget);
          final hintWidget = tester.widget<Text>(hintText);
          final hintParagraph = tester.renderObject<RenderParagraph>(hintText);
          final hintFits =
              hintWidget.maxLines != null &&
              hintWidget.maxLines! <= 2 &&
              !hintParagraph.didExceedMaxLines;
          if (!hintFits) {
            failures.add(
              '$language home hint at $size exceeds two lines: '
              '"${hintWidget.data}", size=${hintParagraph.size}, '
              'constraints=${hintParagraph.constraints}',
            );
          }

          final localizations = commands
              .where((command) => command['type'] == 'localization')
              .toList();
          _recordFailure(
            failures,
            localizations.isNotEmpty,
            '$language scene localization should be sent',
          );
          final localization = localizations.isEmpty
              ? const <String, Object?>{}
              : localizations.last;
          _recordFailure(
            failures,
            _mapsEqual(localization['shortGroups'], {
              for (final group in catalog.groups) group.id: group.shortLabel,
            }),
            '$language scene should receive all translated short names',
          );

          for (final phase in catalog.phases) {
            scene.receiveEvent({
              'source': 'flare-scene',
              'type': 'state',
              'phase': {'source': phase.source},
            });
            await _pumpTransitions(tester);
            final phaseName = find.byKey(const ValueKey('home-phase-name'));
            final paragraph = tester.renderObject<RenderParagraph>(phaseName);
            _recordFailure(
              failures,
              !paragraph.didExceedMaxLines,
              '$language phase ${phase.source} must fit two lines at $size',
            );
          }

          MuscleGroup? widestActionGroup;
          var widestAction = 0.0;
          for (final group in catalog.groups) {
            final painter = _textPainter(
              strings.trainGroup(group.shortLabel),
              style: _buttonLabelStyle,
              locale: locale,
              direction: direction,
            )..layout();
            if (painter.width > widestAction) {
              widestAction = painter.width;
              widestActionGroup = group;
            }
            painter.dispose();

            _recordTextFit(
              failures,
              group.shortLabel,
              style: _sceneLabelStyle,
              locale: locale,
              direction: direction,
              maxWidth: 150,
              reason: '$language ${group.id} scene label at $size',
            );
          }
          final detailGroup = widestActionGroup!;

          scene.receiveEvent({
            'source': 'flare-scene',
            'type': 'select',
            'time': 2.375,
            'groupId': detailGroup.id,
          });
          await _pumpTransitions(tester);

          final title = find.byKey(const ValueKey('muscle-panel-title'));
          expect(title, findsOneWidget, reason: '$language detail at $size');
          final titleParagraph = find.descendant(
            of: title,
            matching: find.byType(RichText),
          );
          expect(titleParagraph, findsOneWidget);
          _recordFailure(
            failures,
            !tester
                .renderObject<RenderParagraph>(titleParagraph)
                .didExceedMaxLines,
            '$language detail title must not be ellipsized at $size',
          );
          final knowledge = find.byKey(const ValueKey('muscle-knowledge'));
          expect(knowledge, findsOneWidget);
          final knowledgePosition = Scrollable.of(
            tester.element(knowledge),
          ).position;
          _recordFailure(
            failures,
            knowledgePosition.viewportDimension >= 40,
            '$language detail needs a 40px knowledge viewport at $size; got '
            '${knowledgePosition.viewportDimension}px',
          );

          final action = find.byKey(const ValueKey('train-group'));
          expect(action, findsOneWidget);
          final actionRect = tester.getRect(action);
          final preview = find.byKey(const ValueKey('muscle-knowledge-toggle'));
          final previewTap = tester.widget<GestureDetector>(preview).onTap;
          if (previewTap != null) {
            await tester.pumpAndSettle();
            await tester.tap(preview);
            await tester.pumpAndSettle();
            final reader = find.byKey(
              const ValueKey('muscle-knowledge-expanded'),
            );
            expect(
              reader,
              findsOneWidget,
              reason: '$language expanded at $size',
            );
            final readerCard = tester.getRect(
              find.byKey(const ValueKey('muscle-knowledge-expanded-card')),
            );
            _recordFailure(
              failures,
              readerCard.left >= 0 &&
                  readerCard.right <= size.width &&
                  readerCard.top >= 0,
              '$language expanded reader must stay in the screen at $size',
            );
            expect(tester.getRect(action), actionRect);
            expect(
              find.ancestor(of: reader, matching: find.byType(Scrollbar)),
              findsNothing,
            );
            await tester.tap(
              find.byKey(const ValueKey('muscle-knowledge-reader-toggle')),
            );
            await tester.pumpAndSettle();
            expect(reader, findsNothing);
          }

          final actionText = find.descendant(
            of: action,
            matching: find.byType(Text),
          );
          expect(actionText, findsOneWidget);
          final renderedAction = tester.widget<Text>(actionText);
          _recordFailure(
            failures,
            renderedAction.data == strings.trainGroup(detailGroup.shortLabel),
            '$language train action should display the short label at $size',
          );
          _recordFailure(
            failures,
            renderedAction.semanticsLabel ==
                strings.trainGroup(detailGroup.label),
            '$language train action should retain its full accessible name',
          );
          _recordFailure(
            failures,
            renderedAction.maxLines == 1 && renderedAction.overflow == null,
            '$language train action must scale without ellipsis at $size',
          );
          final actionParagraph = find.descendant(
            of: actionText,
            matching: find.byType(RichText),
          );
          _recordFailure(
            failures,
            !tester
                .renderObject<RenderParagraph>(actionParagraph)
                .didExceedMaxLines,
            '$language compact training action must not be truncated at $size',
          );
          _recordFailure(
            failures,
            find
                    .ancestor(of: actionText, matching: find.byType(FittedBox))
                    .evaluate()
                    .length ==
                1,
            'Long button labels must scale down instead of clipping.',
          );
          expect(action.hitTestable(), findsOneWidget);
          final flutterError = tester.takeException();
          if (flutterError != null) {
            failures.add('$language at $size raised $flutterError');
          }

          await tester.pumpWidget(const SizedBox());
        }
      }
      expect(
        failures,
        isEmpty,
        reason: 'Compact localization regressions:\n${failures.join('\n')}',
      );
    },
  );
}

Future<void> _precacheFonts(WidgetTester tester) async {
  await tester.runAsync(() async {
    for (final entry in _fontAssets.entries) {
      final loader = FontLoader(entry.key)
        ..addFont(rootBundle.load(entry.value));
      await loader.load();
    }
  });
}

Widget _app({required Widget home, required Locale locale}) => MaterialApp(
  theme: flareTheme(),
  locale: locale,
  localizationsDelegates: AppLocalizations.localizationsDelegates,
  supportedLocales: AppLocalizations.supportedLocales,
  builder: (context, child) {
    FlareColors.use(Theme.of(context).brightness);
    return child!;
  },
  home: home,
);

void _setSize(WidgetTester tester, Size size) {
  tester.view.physicalSize = size;
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.resetPhysicalSize);
  addTearDown(tester.view.resetDevicePixelRatio);
}

Future<void> _pumpTransitions(WidgetTester tester) async {
  await tester.pump();
  await tester.pump(const Duration(milliseconds: 500));
  await tester.pump();
}

TextPainter _textPainter(
  String text, {
  required TextStyle style,
  required Locale locale,
  required TextDirection direction,
}) => TextPainter(
  text: TextSpan(text: text, style: style),
  textDirection: direction,
  locale: locale,
  maxLines: 1,
  ellipsis: '\u2026',
);

void _recordTextFit(
  List<String> failures,
  String text, {
  required TextStyle style,
  required Locale locale,
  required TextDirection direction,
  required double maxWidth,
  required String reason,
}) {
  final painter = _textPainter(
    text,
    style: style,
    locale: locale,
    direction: direction,
  )..layout(maxWidth: maxWidth);
  final didExceed = painter.didExceedMaxLines;
  final measuredWidth = painter.maxIntrinsicWidth;
  painter.dispose();
  if (didExceed) {
    failures.add(
      '$reason: "$text" needs $measuredWidth px, limit is $maxWidth px',
    );
  }
}

void _recordFailure(List<String> failures, bool condition, String reason) {
  if (!condition) failures.add(reason);
}

bool _mapsEqual(Object? actual, Map<String, String> expected) {
  if (actual is! Map || actual.length != expected.length) return false;
  return expected.entries.every((entry) => actual[entry.key] == entry.value);
}
