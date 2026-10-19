/// AI 训练助理的运行配置。开发版从 `--dart-define` 读取，key 绝不写进代码或仓库：
///
/// ```
/// flutter run --dart-define=UGK_COACH_API_KEY=sk-... \
///   [--dart-define=UGK_COACH_BASE_URL=https://opencsg.com/aigateway/v1] \
///   [--dart-define=UGK_COACH_MODEL=deepseek-v4.1-flash-1017] \
///   [--dart-define=UGK_COACH_CATALOG_URL=https://…/manifest.json]
/// ```
///
/// 上线改走中转 Worker：`UGK_COACH_BASE_URL` 指向 Worker，App 只带可吊销的
/// App 令牌（`UGK_COACH_RELAY_TOKEN`），真正的 key 只在 Worker 上（见 app/docs/ai-coach.md）。
class CoachConfig {
  const CoachConfig({
    this.apiKey = '',
    this.relayToken = '',
    this.baseUrl = defaultBaseUrl,
    this.model = defaultModel,
    this.catalogManifestUrl = '',
  });

  static const defaultBaseUrl = 'https://opencsg.com/aigateway/v1';
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

  bool get usesRelay => relayToken.isNotEmpty;

  /// 有 key 或中转令牌才会调模型；否则入口显示「未配置」，一律走预设方案。
  bool get configured => apiKey.isNotEmpty || usesRelay;
}
