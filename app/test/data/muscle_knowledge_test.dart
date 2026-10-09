import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:flare/data/muscle_knowledge.dart';

void main() {
  test('every muscle group has short background copy without figures', () {
    final data =
        jsonDecode(File('assets/data/phase-muscles.json').readAsStringSync())
            as Map<String, dynamic>;
    final ids = [
      for (final g in data['groups'] as List) (g as Map)['groupId'] as String,
    ];
    expect(muscleKnowledge.keys.toSet(), ids.toSet());
    for (final text in muscleKnowledge.values) {
      expect(text.length, inInclusiveRange(40, 120));
      expect(text.contains('%'), isFalse);
      expect(text.contains('肌电'), isFalse);
    }
  });
}
