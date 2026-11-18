import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:path_provider/path_provider.dart';
import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart'
    show
        PoseHubActionLibrary,
        PoseHubCatalogChannel,
        PoseHubCatalogHttpClient,
        PoseHubCatalogStore,
        PoseHubCatalogUpdateConfig,
        PoseHubCatalogUpdateEvent,
        PoseHubCatalogUpdateOutcome,
        PoseHubCatalogUpdater,
        createPoseHubCatalogFileStore,
        poseHubPackVersionOf;

import 'flare_public_catalog.dart';

/// Action-library hot update (SDK `PoseHubCatalogUpdater`).
///
/// Checks the channel pointer once per launch and again on resume once a day
/// has passed. The SDK commits a new catalog only after all display assets
/// pass verification. Training video and action voice remain on demand.
///
/// The channel is fixed at build time: `--dart-define=POSEHUB_CATALOG_CHANNEL=
/// dev|beta|stable`, defaulting to `stable`.
class PoseHubCatalogUpdates with WidgetsBindingObserver {
  PoseHubCatalogUpdates._(
    this.updater,
    this.assetRootDirectory,
    this._onOutcome,
  );

  static const bundledPackVersion = 'r2-v18';
  static const bundledCatalogSha256 =
      '1de7303f94fe0441ed4d006d4a4aa7ceac0e160b1c2527ae0f875b112bb52203';

  static const channelName = String.fromEnvironment(
    'POSEHUB_CATALOG_CHANNEL',
    defaultValue: 'stable',
  );

  static PoseHubCatalogChannel get channel =>
      PoseHubCatalogChannel.values.firstWhere(
        (c) => c.name == channelName,
        orElse: () => PoseHubCatalogChannel.stable,
      );

  static PoseHubCatalogUpdateConfig get buildConfig =>
      PoseHubCatalogUpdateConfig(channel: channel);

  final PoseHubCatalogUpdater updater;
  final String? assetRootDirectory;
  final void Function(PoseHubCatalogUpdateOutcome outcome)? _onOutcome;
  Future<PoseHubCatalogUpdateOutcome>? _launchCheck;
  bool _disposed = false;

  /// The verified cache opened by [start]; null when updates are disabled.
  static PoseHubCatalogStore? activeStore;

  /// Opens the SDK's verified cache. Call [onAppReady] once the app and its
  /// dialog are listening. Web uses the bundled baseline unless injected.
  static Future<PoseHubCatalogUpdates?> start({
    void Function(PoseHubCatalogUpdateEvent event)? onEvent,
    void Function(PoseHubCatalogUpdateOutcome outcome)? onOutcome,
    PoseHubCatalogStore? store,
    PoseHubCatalogHttpClient? http,
    PoseHubCatalogUpdateConfig? config,
    String? assetRootDirectory,
    Future<coach.PoseHubAppTestCatalog> Function()? loadLocal,
  }) async {
    if (kIsWeb && store == null) return null;
    try {
      final resolved =
          store ??
          createPoseHubCatalogFileStore(
            // The legacy catalog cache did not verify or install the images.
            '${(await getApplicationSupportDirectory()).path}/posehub-display-catalog',
          );
      final updates = PoseHubCatalogUpdates._(
        PoseHubCatalogUpdater.withPersistentAssets(
          config: config ?? buildConfig,
          store: resolved,
          http: http,
          assetRootDirectory: assetRootDirectory,
          loadLocal: loadLocal ?? loadFlareBundledPublicCatalog,
          onEvent: onEvent,
        ),
        assetRootDirectory,
        onOutcome,
      );
      PoseHubActionLibrary.useVerifiedCache(resolved);
      activeStore = resolved;
      WidgetsBinding.instance.addObserver(updates);
      return updates;
    } on Object catch (error) {
      debugPrint('PoseHub catalogue updates disabled: $error');
      return null;
    }
  }

  Future<PoseHubCatalogUpdateOutcome>? onAppReady() {
    if (_disposed) return null;
    return _launchCheck ??= maybeCheck();
  }

  Future<PoseHubCatalogUpdateOutcome> maybeCheck() =>
      _reportOutcome(updater.maybeCheck());

  Future<PoseHubCatalogUpdateOutcome> checkNow() =>
      _reportOutcome(updater.checkNow());

  Future<PoseHubCatalogUpdateOutcome> _reportOutcome(
    Future<PoseHubCatalogUpdateOutcome> check,
  ) async {
    final outcome = await check;
    if (!_disposed) _onOutcome?.call(outcome);
    return outcome;
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (_launchCheck != null && state == AppLifecycleState.resumed) {
      unawaited(maybeCheck());
    }
  }

  void dispose() {
    _disposed = true;
    WidgetsBinding.instance.removeObserver(this);
    if (identical(activeStore, updater.store)) {
      activeStore = null;
      PoseHubActionLibrary.useVerifiedCache(null);
    }
  }
}

/// A 64-hex revision for the catalogue in use: the audited SHA for Flare's
/// bundled baseline, else a content digest of the verified cached catalogue.
String poseHubCatalogRevisionOf(coach.PoseHubAppTestCatalog catalog) {
  if (poseHubPackVersionOf(catalog) ==
      PoseHubCatalogUpdates.bundledPackVersion) {
    return PoseHubCatalogUpdates.bundledCatalogSha256;
  }
  return coach.sha256Hex(utf8.encode(jsonEncode(catalog.raw)));
}
