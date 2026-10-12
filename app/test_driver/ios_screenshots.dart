import 'dart:convert';
import 'dart:io';

import 'package:integration_test/integration_test_driver_extended.dart';

Future<void> main() async {
  final path = Platform.environment['FLARE_IOS_EVIDENCE_DIR'];
  if (path == null || path.isEmpty) {
    throw StateError(
      'Set FLARE_IOS_EVIDENCE_DIR to a local screenshot directory.',
    );
  }
  final directory = Directory(path);
  await directory.create(recursive: true);
  await integrationDriver(
    responseDataCallback: (data) async {
      final report = Map<String, dynamic>.from(data ?? {});
      report.remove('screenshots');
      await File(
        '${directory.path}/workflow-report.json',
      ).writeAsString('${jsonEncode(report)}\n', flush: true);
    },
    onScreenshot: (name, bytes, [arguments]) async {
      if (!RegExp(r'^\d{2}-[a-z-]+$').hasMatch(name) || bytes.isEmpty) {
        return false;
      }
      await File(
        '${directory.path}/$name.png',
      ).writeAsBytes(bytes, flush: true);
      return true;
    },
  );
}
