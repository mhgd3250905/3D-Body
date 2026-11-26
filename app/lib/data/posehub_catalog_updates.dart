import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
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
        PoseHubPlanSnapshot,
        createPoseHubCatalogFileStore,
        poseHubPackVersionOf,
        poseHubCatalogSdkVersion;

import 'catalog.dart';
import 'flare_public_catalog.dart';

const flareChannelTrace = bool.fromEnvironment('FLARE_CHANNEL_TRACE');
const _planApp = 'flare';
const _bundledPlans = 'assets/data/flare-plans.json';
const _bundledWarmupR3 = 'assets/data/flare-plans-r3.json';
const _enableWarmupR3 = bool.fromEnvironment('FLARE_BUNDLED_WARMUP_R3');
const _bundledVoiceManifest = 'assets/data/flare-plan-voice-manifest.json';

Future<PoseHubPlanSnapshot?> loadFlareBundledPlanSnapshot({
  AssetBundle? bundle,
  bool warmupR3 = false,
}) async {
  final assets = bundle ?? rootBundle;
  try {
    final plan = await assets.load(warmupR3 ? _bundledWarmupR3 : _bundledPlans);
    final voice = await assets.load(_bundledVoiceManifest);
    final snapshot = PoseHubPlanSnapshot.fromBytes(
      _planBytes(plan),
      _planBytes(voice),
      minSdk: poseHubCatalogSdkVersion,
    );
    Catalog.readSupplementalPlans(snapshot);
    return snapshot;
  } on Object catch (error) {
    if (flareChannelTrace) {
      debugPrint('FlareChannel bundled plans unavailable: $error');
    }
    return null;
  }
}

Uint8List _planBytes(ByteData data) =>
    data.buffer.asUint8List(data.offsetInBytes, data.lengthInBytes);

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
    this._previewWarmupR3,
  );

  final bool _previewWarmupR3;

  static const bundledPackVersion = 'r2-v24';
  static const bundledCatalogSha256 =
      '71d0ba0ce429ee90dcbdc329758da3bf1345b012637b84f2f3bc07adbf4a8f4f';

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
    bool previewWarmupR3 = _enableWarmupR3,
  }) async {
    if (kIsWeb && store == null) return null;
    try {
      final resolved =
          store ??
          createPoseHubCatalogFileStore(
            // The legacy catalog cache did not verify or install the images.
            '${(await getApplicationSupportDirectory()).path}/posehub-display-catalog',
          );
      final updateConfig = config ?? buildConfig;
      final updates = PoseHubCatalogUpdates._(
        PoseHubCatalogUpdater.withPersistentAssets(
          config: updateConfig,
          store: resolved,
          http: http,
          assetRootDirectory: assetRootDirectory,
          loadLocal: loadLocal ?? loadFlareBundledPublicCatalog,
          onEvent: (event) {
            if (flareChannelTrace) debugPrint('FlareChannel $event');
            onEvent?.call(event);
          },
        ),
        assetRootDirectory,
        onOutcome,
        previewWarmupR3 && updateConfig.channel == PoseHubCatalogChannel.dev,
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

  Future<PoseHubPlanSnapshot?> planSnapshotFor(String catalogPack) async {
    var source = 'verified-cache';
    try {
      var snapshot = await updater.planSnapshotFor(
        _planApp,
        catalogPack: catalogPack,
        loadBundled: () {
          source = 'bundle';
          return loadFlareBundledPlanSnapshot();
        },
      );
      if (_previewWarmupR3 &&
          (snapshot == null || snapshot.version == 'flare-plans-r2')) {
        final preview = await loadFlareBundledPlanSnapshot(warmupR3: true);
        if (preview != null &&
            preview.isCompatible(
              catalogPack: catalogPack,
              sdkVersion: updater.config.sdkVersion,
            )) {
          snapshot = preview;
          source = 'bundle';
        }
      }
      if (snapshot == null) return null;
      Catalog.readSupplementalPlans(snapshot);
      if (flareChannelTrace) {
        debugPrint(
          'FlareChannel plan=${snapshot.version} sha=${snapshot.id} source=$source',
        );
      }
      return snapshot;
    } on Object catch (error) {
      if (flareChannelTrace) {
        debugPrint('FlareChannel plan selection failed: $error');
      }
      final bundled = await loadFlareBundledPlanSnapshot();
      return bundled?.isCompatible(
                catalogPack: catalogPack,
                sdkVersion: updater.config.sdkVersion,
              ) ==
              true
          ? bundled
          : null;
    }
  }

  Future<PoseHubPlanSnapshot?> restorePlanSnapshot(String id) async {
    final stored = await updater.restorePlanSnapshot(_planApp, id);
    if (stored != null || !_previewWarmupR3) return stored;
    final preview = await loadFlareBundledPlanSnapshot(warmupR3: true);
    return preview?.id == id ? preview : null;
  }

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
