class LearningSettings {
  const LearningSettings({
    this.tier = 'A',
    this.speed = 0.5,
    this.cues = true,
    this.sound = true,
    this.haptics = true,
    this.weeklyGoal = 3,
    this.themeMode = 'system',
  });

  static const themeModes = ['system', 'dark', 'light'];

  final String tier;
  final double speed;
  final bool cues;
  final bool sound;
  final bool haptics;
  final int weeklyGoal;

  /// Appearance: follow the device, or force dark / light.
  final String themeMode;

  LearningSettings copyWith({
    String? tier,
    double? speed,
    bool? cues,
    bool? sound,
    bool? haptics,
    int? weeklyGoal,
    String? themeMode,
  }) => LearningSettings(
    tier: tier ?? this.tier,
    speed: speed ?? this.speed,
    cues: cues ?? this.cues,
    sound: sound ?? this.sound,
    haptics: haptics ?? this.haptics,
    weeklyGoal: weeklyGoal ?? this.weeklyGoal,
    themeMode: themeMode ?? this.themeMode,
  );

  bool get valid =>
      ['A', 'B', 'C'].contains(tier) &&
      [0.25, 0.5, 1.0].contains(speed) &&
      weeklyGoal >= 1 &&
      weeklyGoal <= 7 &&
      themeModes.contains(themeMode);

  Map<String, dynamic> toJson() => {
    'tier': tier,
    'speed': speed,
    'cues': cues,
    'sound': sound,
    'haptics': haptics,
    'weeklyGoal': weeklyGoal,
    'themeMode': themeMode,
  };

  factory LearningSettings.fromJson(Map<String, dynamic> json) =>
      LearningSettings(
        tier: json['tier'] as String,
        speed: (json['speed'] as num).toDouble(),
        cues: json['cues'] as bool,
        sound: json['sound'] as bool,
        haptics: json['haptics'] as bool,
        weeklyGoal: json['weeklyGoal'] as int,
        // Older local states predate appearance and follow the device.
        themeMode: json['themeMode'] as String? ?? 'system',
      );
}
