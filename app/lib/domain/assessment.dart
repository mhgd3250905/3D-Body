/// Draft entry placement from the supplied expert package, confirmed by the
/// learner. These boundaries are teaching suggestions, not medical thresholds.
int assessmentGradeForDips(int repetitions) {
  if (repetitions < 0) throw ArgumentError.value(repetitions, 'repetitions');
  if (repetitions <= 3) return 1;
  if (repetitions <= 7) return 2;
  if (repetitions <= 12) return 3;
  return 4;
}
