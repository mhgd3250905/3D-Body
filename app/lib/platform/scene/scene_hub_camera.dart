import 'dart:math' as math;

/// The Hub's animation camera orbits one fixed target on a horizontal circle.
abstract final class SceneHubCamera {
  static const angleFov = 32.0;
  static const angleYaw = <int, double>{
    9: -.22,
    10: .34,
    11: .22,
    12: .48,
    13: -.14,
    14: -.34,
    15: -.24,
    16: -.48,
  };
  static final _minimumYaw = angleYaw.values.reduce(math.min);
  static final _maximumYaw = angleYaw.values.reduce(math.max);

  static Map<String, Object?>? angle(int phase) {
    final yaw = angleYaw[phase];
    return yaw == null
        ? null
        : {
            'yaw': yaw,
            'minimumYaw': _minimumYaw,
            'maximumYaw': _maximumYaw,
            'fov': angleFov,
          };
  }

  static const standingHeight = 1.155;
  static const standingDistance = 3.4;

  // Bilateral region bounds measured on the standing reference mesh. Each
  // preset includes a small tolerance for the shader feather and fitted edge.
  static const _muscles = <String, _MuscleFocus>{
    'deltoids': _MuscleFocus(1, 1.319, .274, .087, .095),
    'rotator-cuff': _MuscleFocus(-1, 1.296, .179, .071, .123),
    'triceps': _MuscleFocus(-1, 1.176, .339, .143, .091),
    'forearms': _MuscleFocus(1, .984, .410, .127, .103),
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
    };
  }
}

final class _MuscleFocus {
  const _MuscleFocus(
    this.side,
    this.centerY,
    this.halfWidth,
    this.halfHeight,
    this.depth,
  );

  final int side;
  final double centerY;
  final double halfWidth;
  final double halfHeight;
  final double depth;
}
