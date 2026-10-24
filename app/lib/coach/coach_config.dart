/// AI 训练助理的运行配置。开发版从 `--dart-define` 读取，key 绝不写进代码或仓库：
///
/// ```
/// flutter run --dart-define=UGK_COACH_API_KEY=<UGK 中转站为本 App 发的令牌> \
///   [--dart-define=UGK_COACH_BASE_URL=https://ai.uuugk.win/v1] \
///   [--dart-define=UGK_COACH_MODEL=deepseek-v4.1-flash-1017] \
///   [--dart-define=UGK_COACH_CATALOG_URL=https://…/manifest.json]
/// ```
///
/// 默认走自建 UGK AI 中转站（New API，https://ai.uuugk.win/v1）：上游各家模型 key 只在中转站，
/// App 只带中转站为它单独发的、可设额度和吊销的令牌（见 app/docs/ai-coach.md）。
class CoachConfig {
  const CoachConfig({
    this.apiKey = '',
    this.relayToken = '',
    this.baseUrl = defaultBaseUrl,
    this.model = defaultModel,
    this.catalogManifestUrl = '',
  });

  static const defaultBaseUrl = 'https://ai.uuugk.win/v1';
  static const defaultModel = 'deepseek-v4.1-flash-1017';

  /// 开发 / 内测直连用的 key。
  final String apiKey;

  /// 上线经中转 Worker 时的 App 令牌（Worker 校验后代为附上 key）。
  final String relayToken;
  final String baseUrl;
  final String model;

  /// 目录远端更新清单（manifest.json）地址；空 = 只用随包目录。
  final String catalogManifestUrl;

  static const fromEnvironment = CoachConfig(
    apiKey: String.fromEnvironment('UGK_COACH_API_KEY'),
    relayToken: String.fromEnvironment('UGK_COACH_RELAY_TOKEN'),
    baseUrl: String.fromEnvironment(
      'UGK_COACH_BASE_URL',
      defaultValue: defaultBaseUrl,
    ),
    model: String.fromEnvironment(
      'UGK_COACH_MODEL',
      defaultValue: defaultModel,
    ),
    catalogManifestUrl: String.fromEnvironment('UGK_COACH_CATALOG_URL'),
  );

  bool get usesRelay => relayToken.trim().isNotEmpty;

  /// A Key/token enables AI. Empty builds expose no AI entry points.
  bool get configured => apiKey.trim().isNotEmpty || usesRelay;
}
