/// Camera presets for the Hub's standing anatomy reference.
abstract final class SceneHubCamera {
  static const standingHeight = 1.155;
  static const standingDistance = 3.4;

  // Bilateral region bounds measured on the standing reference mesh. Each
  // preset includes a small tolerance for the shader feather and fitted edge.
  static const _muscles = <String, _MuscleFocus>{
    'deltoids': _MuscleFocus(1, 1.319, .274, .087, .095),
    'rotator-cuff': _MuscleFocus(-1, 1.296, .179, .071, .123),
    'triceps': _MuscleFocus(-1, 1.176, .339, .143, .091),
    'forearms': _MuscleFocus(
      1,
      1.24,
      .410,
      .127,
      .103,
      widthFraction: .65,
      cutoff: .62,
    ),
    'serratus': _MuscleFocus(1, 1.185, .177, .067, .139),
    'scapular': _MuscleFocus(-1, 1.254, .103, .133, .120),
    'chest': _MuscleFocus(1, 1.279, .183, .109, .156),
    'lats': _MuscleFocus(-1, 1.111, .225, .156, .114),
    'abs': _MuscleFocus(1, 1.028, .095, .206, .156),
    'obliques': _MuscleFocus(1, 1.024, .168, .125, .132),
    'erectors': _MuscleFocus(-1, 1.008, .095, .129, .103),
    'hip-flexors': _MuscleFocus(1, .874, .174, .076, .116),
    'glute-max': _MuscleFocus(-1, .843, .165, .109, .112),
    'hip-abductors': _MuscleFocus(-1, .906, .163, .079, .075),
    'adductors': _MuscleFocus(1, .667, .091, .187, .086),
    'quadriceps': _MuscleFocus(1, .650, .203, .179, .121),
    'hamstrings': _MuscleFocus(-1, .606, .202, .202, .084),
  };

  static Map<String, Object?>? muscle(String id, {bool focused = false}) {
    final preset = _muscles[id];
    if (preset == null) return null;
    final targetHeight = focused ? preset.centerY : standingHeight;
    return {
      'position': <double>[0, targetHeight, standingDistance * preset.side],
      'target': <double>[0, targetHeight, 0],
      'fov': 26,
      'overviewHeight': standingHeight,
      if (focused)
        'region': <double>[preset.halfWidth, preset.halfHeight, preset.depth],
      if (focused && preset.widthFraction != null)
        'widthFraction': preset.widthFraction,
      if (focused && preset.cutoff != null) 'cutoff': preset.cutoff,
    };
  }
}

final class _MuscleFocus {
  const _MuscleFocus(
    this.side,
    this.centerY,
    this.halfWidth,
    this.halfHeight,
    this.depth, {
    this.widthFraction,
    this.cutoff,
  });

  final int side;
  final double centerY;
  final double halfWidth;
  final double halfHeight;
  final double depth;
  final double? widthFraction;
  final double? cutoff;
}
