import 'dart:convert';

import 'package:flare/control/learning_store.dart';
import 'package:flare/data/catalog.dart';
import 'package:flare/data/content_translations.dart';
import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/l10n/languages.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';

import '../domain/fixtures.dart';
import '../ui/flow_regressions_test.dart' show MemoryStateStorage;

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  final source = loadCatalogFixture();

  test(
    'all 14 bundled content locales cover the exact Chinese source keys',
    () async {
      final translations = await ContentTranslations.load();
      final sourceMap = Map<String, String>.from(
        jsonDecode(await rootBundle.loadString('assets/l10n/content_zh.json'))
            as Map<String, dynamic>,
      );

      expect(languageNames, hasLength(14));
      expect(sourceMap, hasLength(591));
      for (final code in languageNames.keys) {
        final values = translations.forLanguage(code);
        expect(values.keys.toSet(), sourceMap.keys.toSet(), reason: code);
        expect(values, hasLength(sourceMap.length), reason: code);
        expect(
          values.values.every((value) => value.trim().isNotEmpty),
          isTrue,
          reason: '$code contains an empty translation',
        );
      }
    },
  );

  test('system locale resolution recognizes Traditional Chinese regions', () {
    final supported = AppLocalizations.supportedLocales;
    const traditional = Locale.fromSubtags(
      languageCode: 'zh',
      scriptCode: 'Hant',
    );

    expect(
      resolveAppLocale(const [Locale('zh', 'TW')], supported),
      traditional,
    );
    expect(
      resolveAppLocale(const [Locale('zh', 'HK')], supported),
      traditional,
    );
    expect(resolveAppLocale(const [traditional], supported), traditional);
    expect(
      resolveAppLocale(const [Locale('zh', 'CN')], supported),
      const Locale('zh'),
    );
    expect(
      resolveAppLocale(const [Locale('xx', 'XX')], supported),
      const Locale('en'),
    );
    expect(
      resolveAppLocale(const [Locale('xx'), Locale('fr')], supported),
      const Locale('fr'),
    );
  });

  test(
    'missing language migrates to system and later saves without losing progress',
    () async {
      final storage = MemoryStateStorage();
      final now = DateTime(2026, 10, 11, 12);
      final seed = LearningStore(
        catalog: source,
        storage: storage,
        now: () => now,
      );
      await seed.initialize();
      await seed.acknowledgeSafety();
      await seed.setLastTime(2.375);
      final drillId = source.drills.first.id;
      final lessonId = source.stages.first.lessons.first.id;
      await seed.addToToday(drillId);
      await seed.completeLesson(lessonId);
      seed.dispose();

      final oldSnapshot = jsonDecode(storage.value!) as Map<String, dynamic>;
      final oldSettings = Map<String, dynamic>.from(
        oldSnapshot['settings'] as Map,
      )..remove('language');
      oldSnapshot['settings'] = oldSettings;
      storage.value = jsonEncode(oldSnapshot);

      final migrated = LearningStore(
        catalog: source,
        storage: storage,
        now: () => now,
      );
      await migrated.initialize();
      expect(migrated.settings.language, 'system');
      expect(migrated.lastTime, 2.375);
      expect(migrated.todayIds, contains(drillId));
      expect(migrated.completedLessonIds, contains(lessonId));
      expect(await migrated.updateSettings(language: 'fr'), isTrue);
      migrated.dispose();

      final restored = LearningStore(
        catalog: source,
        storage: storage,
        now: () => now,
      );
      await restored.initialize();
      expect(restored.settings.language, 'fr');
      expect(restored.lastTime, 2.375);
      expect(restored.todayIds, contains(drillId));
      expect(restored.completedLessonIds, contains(lessonId));
      restored.dispose();
    },
  );

  test(
    'localizing all 51 drills preserves dose structure, IDs, and images',
    () async {
      final translations = await ContentTranslations.load();
      final english = source.localized(translations.forLanguage('en'));

      expect(english.drills, hasLength(51));
      expect(
        english.drills.map((drill) => drill.id).toSet(),
        source.drills.map((drill) => drill.id).toSet(),
      );
      for (final original in source.drills) {
        final localized = english.drillById(original.id)!;
        expect(localized.groupId, original.groupId, reason: original.id);
        expect(localized.tier, original.tier, reason: original.id);
        expect(localized.imageAsset, original.imageAsset, reason: original.id);
        expect(
          localized.thumbnailAsset,
          original.thumbnailAsset,
          reason: original.id,
        );
        expect(
          _doseFingerprint(localized),
          _doseFingerprint(original),
          reason: original.id,
        );
      }

      final localizedName = english.drills.firstWhere(
        (drill) => drill.name != source.drillById(drill.id)!.name,
      );
      expect(
        english
            .searchDrills(localizedName.name, tier: localizedName.tier)
            .map((drill) => drill.id),
        contains(localizedName.id),
      );
      final original = source.drillById(localizedName.id)!;
      expect(
        english
            .searchDrills(original.name, tier: localizedName.tier)
            .map((drill) => drill.id),
        contains(localizedName.id),
        reason: 'Localized search must still find the Chinese source name',
      );
      expect(
        english
            .searchDrills(original.nameEn, tier: localizedName.tier)
            .map((drill) => drill.id),
        contains(localizedName.id),
        reason: 'Localized search must still find the English reference name',
      );
    },
  );

  test(
    'search accepts actual localized names for every translated resource',
    () async {
      final translations = await ContentTranslations.load();
      var searchedLocalizedNames = 0;

      for (final code in languageNames.keys) {
        final localized = source.localized(translations.forLanguage(code));
        for (final drill in localized.drills) {
          if (drill.name == source.drillById(drill.id)!.name) continue;
          searchedLocalizedNames++;
          expect(
            localized
                .searchDrills(drill.name, tier: drill.tier)
                .any((match) => match.id == drill.id),
            isTrue,
            reason: '$code localized drill ${drill.id}',
          );
        }
      }

      // At least the completed English resource must exercise non-Chinese names;
      // unfinished locale values are allowed to be filled before the final run.
      expect(searchedLocalizedNames, greaterThan(0));
    },
  );
}

({
  int sets,
  int setsMax,
  bool perSide,
  DoseMode mode,
  int min,
  int max,
  int restSec,
  String raw,
  int blocks,
})
_doseFingerprint(Drill drill) {
  final dose = drill.dose;
  return (
    sets: dose.sets,
    setsMax: dose.setsMax,
    perSide: dose.perSide,
    mode: dose.mode,
    min: dose.min,
    max: dose.max,
    restSec: dose.restSec,
    raw: dose.raw,
    blocks: dose.blocksPerSet,
  );
}
