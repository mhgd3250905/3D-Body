import 'package:flare/l10n/languages.dart';
import 'package:flare/l10n/plan_equipment_strings.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as sdk;

void main() {
  test('supported locales name every catalog equipment item', () {
    final equipmentIds = {...sdk.poseHubEquipmentLabels.keys, 'clamp-pad'};
    for (final language in languageNames.keys) {
      final locale = localeForLanguage(language);
      expect(planEquipmentNeededLabel(locale), isNotEmpty);
      for (final id in equipmentIds) {
        expect(
          planEquipmentName(id, locale),
          isNotEmpty,
          reason: '$language equipment ID: $id',
        );
      }
    }
  });

  test('Chinese equipment names respect script and hide unknown IDs', () {
    const simplified = Locale('zh', 'CN');
    const traditional = Locale('zh', 'TW');
    expect(planEquipmentNeededLabel(simplified), '需要：');
    expect(planEquipmentName('band', simplified), '弹力带');
    expect(planEquipmentName('band', traditional), '彈力帶');
    expect(planEquipmentName('pullup-bar', simplified), '单杠');
    expect(planEquipmentName('pullup_bar', simplified), isNull);
    expect(planEquipmentName('unknown', simplified), isNull);
  });
}
