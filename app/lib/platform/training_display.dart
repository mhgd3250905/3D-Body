import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

/// The iOS host owns the idle timer; other platforms retain their behavior.
abstract final class TrainingDisplay {
  static const channel = MethodChannel('dev.mhgd.flare/training_display');

  static Future<void> setKeepAwake(bool enabled) async {
    if (kIsWeb || defaultTargetPlatform != TargetPlatform.iOS) return;
    try {
      await channel.invokeMethod<void>('setKeepAwake', enabled);
    } on MissingPluginException {
      // Older native hosts and widget tests can still run the timer.
    } on PlatformException catch (error) {
      debugPrint('Training display unavailable: ${error.code}');
    }
  }
}
