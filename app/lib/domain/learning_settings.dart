class LearningSettings {
  const LearningSettings({
    this.tier = 'A',
    this.speed = 0.5,
    this.cues = true,
    this.sound = true,
    this.haptics = true,
    this.weeklyGoal = 3,
    this.themeMode = 'system',
    this.language = 'system',
    this.actorBody = 'original',
  });

  static const themeModes = ['system', 'dark', 'light'];
  static const actorBodies = ['original', 'training'];
  static const languages = [
    'system',
    'zh',
    'zh_Hant',
    'en',
    'es',
    'pt',
    'fr',
    'de',
    'it',
    'ru',
    'ja',
    'ko',
    'ar',
    'hi',
    'id',
  ];

  final String tier;
  final double speed;
  final bool cues;
  final bool sound;
  final bool haptics;
  final int weeklyGoal;

  /// Appearance: follow the device, or force dark / light.
  final String themeMode;

  /// Explicit preference, or the device language; older states follow system.
  final String language;

  /// The Thomas athlete; independent from the reference mannequin and videos.
  final String actorBody;

  LearningSettings copyWith({
    String? tier,
    double? speed,
    bool? cues,
    bool? sound,
    bool? haptics,
    int? weeklyGoal,
    String? themeMode,
    String? language,
    String? actorBody,
  }) => LearningSettings(
    tier: tier ?? this.tier,
    speed: speed ?? this.speed,
    cues: cues ?? this.cues,
    sound: sound ?? this.sound,
    haptics: haptics ?? this.haptics,
    weeklyGoal: weeklyGoal ?? this.weeklyGoal,
    themeMode: themeMode ?? this.themeMode,
    language: language ?? this.language,
    actorBody: actorBody ?? this.actorBody,
  );

  bool get valid =>
      ['A', 'B', 'C'].contains(tier) &&
      [0.25, 0.5, 1.0].contains(speed) &&
      weeklyGoal >= 1 &&
      weeklyGoal <= 7 &&
      themeModes.contains(themeMode) &&
      languages.contains(language) &&
      actorBodies.contains(actorBody);

  Map<String, dynamic> toJson() => {
    'tier': tier,
    'speed': speed,
    'cues': cues,
    'sound': sound,
    'haptics': haptics,
    'weeklyGoal': weeklyGoal,
    'themeMode': themeMode,
    'language': language,
    'actorBody': actorBody,
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
        language: languages.contains(json['language'])
            ? json['language'] as String
            : 'system',
        actorBody: actorBodies.contains(json['actorBody'])
            ? json['actorBody'] as String
            : 'original',
      );
}
