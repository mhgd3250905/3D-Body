// HipLab · 开胯训练助手 entry point.
//
//   flutter run -t lib/main_hip.dart
//   flutter build apk -t lib/main_hip.dart        # → com.ugk.hiplab
//
// Android picks the HipLab application id, label and icon automatically when
// the Flutter target is this file (see android/app/build.gradle.kts). The
// FlareLab entry (lib/main.dart) and its build commands are unchanged.
import 'package:flutter/material.dart';

import 'hip/ui/hip_app.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const HipApp());
}
