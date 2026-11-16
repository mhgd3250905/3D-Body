/// Training Hub camera coordinates in the existing Three.js model space.
/// Angle presets frame the R17 anchors. Standing presets use the authored
/// side and keep each muscle group above the stage's lower fade.
final class SceneHubCamera {
  const SceneHubCamera(this.position, this.target, this.fov);

  final List<double> position;
  final List<double> target;
  final double fov;

  Map<String, Object?> toJson() => {
    'position': position,
    'target': target,
    'fov': fov,
  };

  static const angles = <int, SceneHubCamera>{
    9: SceneHubCamera([.398, 1.405, 2.259], [-.040, .481, -.173], 32),
    10: SceneHubCamera([.790, 1.707, 2.869], [.261, .591, -.067], 32),
    11: SceneHubCamera([.719, 1.853, 3.323], [.179, .713, .322], 32),
    12: SceneHubCamera([.482, 1.748, 3.134], [-.025, .677, .317], 32),
    13: SceneHubCamera([.682, 1.880, 4.025], [.013, .468, .311], 32),
    14: SceneHubCamera([.604, 1.785, 3.161], [.079, .678, .247], 32),
    15: SceneHubCamera([.374, 1.878, 3.290], [-.178, .712, .221], 32),
    16: SceneHubCamera([.228, 1.630, 2.589], [-.270, .579, -.178], 32),
  };

  // Fit each bilateral atlas region to about 45% of the stage's shorter edge.
  // The initial deltoid view also retains the head-to-mid-thigh overview.
  static const muscles = <String, SceneHubCamera>{
    'deltoids': SceneHubCamera([0, 1.164, 2.520], [0, 1.164, 0], 26),
    'rotator-cuff': SceneHubCamera([0, 1.205, -1.708], [0, 1.205, 0], 26),
    'triceps': SceneHubCamera([0, 1.000, -3.175], [0, 1.000, 0], 26),
    'forearms': SceneHubCamera([0, .769, 3.878], [0, .769, 0], 26),
    'serratus': SceneHubCamera([0, 1.096, 1.658], [0, 1.096, 0], 26),
    'scapular': SceneHubCamera([0, 1.179, -1.249], [0, 1.179, 0], 26),
    'chest': SceneHubCamera([0, 1.185, 1.726], [0, 1.185, 0], 26),
    'lats': SceneHubCamera([0, .999, -2.083], [0, .999, 0], 26),
    'abs': SceneHubCamera([0, .910, 1.986], [0, .910, 0], 26),
    'obliques': SceneHubCamera([0, .947, 1.508], [0, .947, 0], 26),
    'erectors': SceneHubCamera([0, .935, -1.203], [0, .935, 0], 26),
    'hip-flexors': SceneHubCamera([0, .790, 1.586], [0, .790, 0], 26),
    'glute-max': SceneHubCamera([0, .763, -1.483], [0, .763, 0], 26),
    'hip-abductors': SceneHubCamera([0, .826, -1.443], [0, .826, 0], 26),
    'adductors': SceneHubCamera([0, .570, 1.675], [0, .570, 0], 26),
    'quadriceps': SceneHubCamera([0, .551, 1.860], [0, .551, 0], 26),
    'hamstrings': SceneHubCamera([0, .488, -1.842], [0, .488, 0], 26),
  };
}
