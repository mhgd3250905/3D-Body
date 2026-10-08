import 'dart:js_interop';

import 'package:flutter/widgets.dart';
import 'package:web/web.dart' as web;

import 'scene_controller.dart';

class ScenePlatformView extends StatefulWidget {
  const ScenePlatformView({super.key, required this.controller});

  final SceneController controller;

  @override
  State<ScenePlatformView> createState() => _ScenePlatformViewState();
}

class _ScenePlatformViewState extends State<ScenePlatformView> {
  web.HTMLIFrameElement? _frame;
  late final JSFunction _messageListener;
  late final SceneCommandSink _sink;
  Map<Object?, Object?>? _lastEvent;

  @override
  void initState() {
    super.initState();
    _sink = _send;
    widget.controller.attachCommandSink(_sink);
    _messageListener = _receive.toJS;
    web.window.addEventListener('message', _messageListener);
  }

  void _createElement(Object element) {
    if (!mounted) return;
    final frame = element as web.HTMLIFrameElement;
    _frame = frame;
    frame
      ..title = '托马斯全旋 3D 动作'
      ..src = Uri.base.resolve('assets/assets/scene/index.html').toString();
    frame.setAttribute('allow', 'fullscreen');
    frame.setAttribute('scrolling', 'no');
    frame.style
      ..border = '0'
      ..width = '100%'
      ..height = '100%'
      ..display = 'block'
      ..backgroundColor = 'transparent'
      ..touchAction = 'none'
      ..overscrollBehavior = 'none';
  }

  void _receive(web.Event event) {
    final frame = _frame;
    if (!mounted || frame == null || frame.contentWindow == null) return;
    final message = event as web.MessageEvent;
    if (message.origin != web.window.location.origin ||
        !message.source.strictEquals(frame.contentWindow).toDart) {
      return;
    }
    final value = message.data.dartify();
    if (value is! Map) return;
    if (widget.controller.receiveEvent(value)) _lastEvent = value;
  }

  void _send(Map<String, Object?> command) {
    final frame = _frame;
    if (!mounted || frame == null) return;
    frame.contentWindow?.postMessage(
      {'source': 'flare-host', 'command': command}.jsify(),
      web.window.location.origin.toJS,
    );
  }

  @override
  void didUpdateWidget(covariant ScenePlatformView oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller == widget.controller) return;
    final wasReady = oldWidget.controller.ready;
    oldWidget.controller.detachCommandSink(_sink);
    widget.controller.attachCommandSink(_sink);
    if (wasReady) {
      widget.controller.receiveEvent({
        ...?_lastEvent,
        'source': 'flare-scene',
        'type': 'ready',
        'period': oldWidget.controller.period,
        'time': oldWidget.controller.time,
        'playing': oldWidget.controller.playing,
        'speed': oldWidget.controller.speed,
        'phase': oldWidget.controller.phase,
        'selected': oldWidget.controller.selected,
        'detail': oldWidget.controller.detail,
      });
    }
  }

  @override
  Widget build(BuildContext context) => HtmlElementView.fromTagName(
    tagName: 'iframe',
    onElementCreated: _createElement,
  );

  @override
  void dispose() {
    web.window.removeEventListener('message', _messageListener);
    widget.controller.detachCommandSink(_sink);
    _frame?.src = 'about:blank';
    _frame = null;
    super.dispose();
  }
}
