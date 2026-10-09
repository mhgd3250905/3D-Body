import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/gestures.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:webview_flutter_wkwebview/webview_flutter_wkwebview.dart';

import 'scene_asset_server.dart';
import 'scene_controller.dart';

class ScenePlatformView extends StatefulWidget {
  const ScenePlatformView({super.key, required this.controller});

  final SceneController controller;

  @override
  State<ScenePlatformView> createState() => _ScenePlatformViewState();
}

class _ScenePlatformViewState extends State<ScenePlatformView> {
  SceneAssetServer? _server;
  WebViewController? _webView;
  late final SceneCommandSink _sink;
  int _generation = 0;

  @override
  void initState() {
    super.initState();
    _sink = _send;
    if (!Platform.isAndroid && !Platform.isIOS) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) widget.controller.reportError('unsupported');
      });
      return;
    }
    widget.controller.attachCommandSink(_sink);
    unawaited(_initialize(++_generation));
  }

  bool _active(int generation) => mounted && generation == _generation;

  Future<void> _initialize(int generation) async {
    SceneAssetServer? server;
    try {
      server = await SceneAssetServer.start();
      if (!_active(generation)) {
        await server.close();
        return;
      }
      _server = server;
      final webView = WebViewController.fromPlatformCreationParams(
        Platform.isIOS
            // WebGL needs no media; inline playback keeps any future clip
            // from taking over the screen.
            ? WebKitWebViewControllerCreationParams(
                allowsInlineMediaPlayback: true,
              )
            : const PlatformWebViewControllerCreationParams(),
        onPermissionRequest: (request) => unawaited(request.deny()),
      );
      await webView.setJavaScriptMode(JavaScriptMode.unrestricted);
      if (!_active(generation)) return;
      await webView.setBackgroundColor(const Color(0x00000000));
      if (!_active(generation)) return;
      await webView.enableZoom(false);
      if (!_active(generation)) return;
      if (webView.platform case final WebKitWebViewController wk) {
        await configureWebKitStage(wk);
        if (!_active(generation)) return;
      }
      await webView.addJavaScriptChannel(
        'FlareHost',
        onMessageReceived: (message) {
          if (_active(generation)) {
            widget.controller.receiveMessage(message.message);
          }
        },
      );
      if (!_active(generation)) return;
      await webView.setNavigationDelegate(
        NavigationDelegate(
          onNavigationRequest: (request) {
            final uri = Uri.tryParse(request.url);
            return _active(generation) &&
                    uri != null &&
                    server!.permitsNavigation(uri)
                ? NavigationDecision.navigate
                : NavigationDecision.prevent;
          },
          onWebResourceError: (error) {
            if (!_active(generation) || error.isForMainFrame != true) return;
            // iOS reclaims a WebContent process under memory pressure (often
            // while the app is in the background). The page is gone, not
            // broken: the host restarts the scene once on its own.
            widget.controller.reportError(
              error.errorType ==
                      WebResourceErrorType.webContentProcessTerminated
                  ? SceneController.processTerminated
                  : 'scene-load-failed',
            );
          },
        ),
      );
      if (!_active(generation)) return;
      setState(() => _webView = webView);
      await webView.loadRequest(server.sceneUri);
    } catch (_) {
      if (_active(generation)) {
        widget.controller.reportError('scene-start-failed');
      }
      if (server != null) await server.close();
    }
  }

  Future<void> _send(Map<String, Object?> command) async {
    final webView = _webView;
    if (!mounted || webView == null) return;
    final json = jsonEncode(
      command,
    ).replaceAll('\u2028', r'\u2028').replaceAll('\u2029', r'\u2029');
    await webView.runJavaScript('window.flareBridge.command($json);');
  }

  @override
  void didUpdateWidget(covariant ScenePlatformView oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller == widget.controller) return;
    final wasReady = oldWidget.controller.ready;
    final snapshot = {
      'source': 'flare-scene',
      'type': 'ready',
      'period': oldWidget.controller.period,
      'time': oldWidget.controller.time,
      'playing': oldWidget.controller.playing,
      'speed': oldWidget.controller.speed,
      'phase': oldWidget.controller.phase,
      'selected': oldWidget.controller.selected,
      'detail': oldWidget.controller.detail,
    };
    oldWidget.controller.detachCommandSink(_sink);
    widget.controller.attachCommandSink(_sink);
    if (wasReady) widget.controller.receiveEvent(snapshot);
  }

  @override
  Widget build(BuildContext context) {
    final webView = _webView;
    if (webView == null) {
      return const ColoredBox(
        color: Color(0xff08080a),
        child: SizedBox.expand(),
      );
    }
    return WebViewWidget(
      controller: webView,
      gestureRecognizers: {
        Factory<OneSequenceGestureRecognizer>(() => EagerGestureRecognizer()),
      },
    );
  }

  @override
  void dispose() {
    _generation++;
    widget.controller.detachCommandSink(_sink);
    final webView = _webView;
    if (webView != null) {
      unawaited(
        webView.removeJavaScriptChannel('FlareHost').catchError((_) {}),
      );
    }
    final server = _server;
    if (server != null) unawaited(server.close());
    super.dispose();
  }
}

/// iOS stage behaviour that CSS cannot reach: a full-bleed WebGL canvas must
/// not rubber-band, show scroll bars, open link previews on a long press, or
/// navigate on an edge swipe (the app owns its left-edge back gesture).
@visibleForTesting
Future<void> configureWebKitStage(WebKitWebViewController wk) async {
  await wk.setOverScrollMode(WebViewOverScrollMode.never);
  await wk.setVerticalScrollBarEnabled(false);
  await wk.setHorizontalScrollBarEnabled(false);
  await wk.setAllowsLinkPreview(false);
  await wk.setAllowsBackForwardNavigationGestures(false);
  // Safari Web Inspector for debug/profile builds only (iOS 16.4+).
  await wk.setInspectable(!kReleaseMode);
}
