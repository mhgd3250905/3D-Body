import 'dart:convert';

import 'package:characters/characters.dart';
import 'package:flare/domain/training_plan.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('training routine visible name limit', () {
    for (final character in ['a', '练', '💪', 'e\u0301', '👨‍👩‍👧‍👦']) {
      test('keeps 24 complete $character characters and rejects 25', () {
        final atLimit = List.filled(TrainingRoutine.maxName, character).join();
        final tooLong = '$atLimit$character';
        final routine = TrainingRoutine(
          id: 'routine',
          name: atLimit,
          drillIds: ['abs-A'],
        );

        expect(routine.valid, isTrue);
        expect(routine.copyWith(name: tooLong).valid, isFalse);
        expect(TrainingRoutine.truncateName(atLimit), atLimit);
        expect(TrainingRoutine.truncateName(tooLong), atLimit);
        expect(
          TrainingRoutine.fromJson(
            jsonDecode(jsonEncode(routine.toJson())) as Map<String, dynamic>,
          ).name,
          atLimit,
        );
      });
    }

    test('keeps an emoji at the boundary after 23 ASCII characters', () {
      final prefix = List.filled(23, 'a').join();
      final name = '$prefix💪';
      expect(TrainingRoutine.truncateName(name), name);
      expect(TrainingRoutine.truncateName('$name!'), name);
      expect(TrainingRoutine.truncateName('$name!').characters.length, 24);
    });
  });
}
