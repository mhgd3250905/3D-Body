import 'package:flutter/services.dart';

/// Read-only native diagnostics. The shared SDK owns screen-awake behavior.
abstract final class TrainingDisplay {
  static const channel = MethodChannel('dev.mhgd.flare/training_display');
}
