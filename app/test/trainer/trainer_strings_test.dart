import 'package:flare/l10n/app_localizations.dart';
import 'package:flare/trainer/trainer_strings.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_trainer/ugk_trainer.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  test('SDK player labels resolve for all fourteen host locales', () async {
    expect(AppLocalizations.supportedLocales.length, 14);
    for (final locale in AppLocalizations.supportedLocales) {
      final app = await AppLocalizations.delegate.load(locale);
      final s = trainerStrings(app);
      for (final text in [
        s.prepFirst,
        s.roundOf(2, 3),
        s.setOf(1, 2),
        s.switchTo(Side.left),
        s.sideName(Side.right),
        s.discomfortBody,
        s.discomfortContinue,
        s.discomfortSkip,
        s.closeConfirm,
        s.completeSet,
        s.doneFull,
        s.saveFailed,
        s.mediaUnavailable,
        s.notificationText,
        s.dose(reps: true, amount: 12, perSide: true),
        trainerLoadFailed(app),
        trainerMoveUnavailable(app),
      ]) {
        expect(text.trim(), isNotEmpty, reason: locale.toString());
      }
      expect(s.notificationText, app.library);
      expect(s.sideName(Side.left), app.leftSide);
      expect(s.sideName(Side.right), app.rightSide);
    }
  });
}
