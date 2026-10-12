import 'dart:convert';
import 'dart:js_interop';
import 'package:flutter/widgets.dart';
import 'package:web/web.dart' as web;
import '../../data/drill_media.dart';
import 'media_controller.dart';

class DrillMediaPlatformView extends StatefulWidget {
  const DrillMediaPlatformView({
    super.key,
    required this.media,
    required this.controller,
    required this.labels,
  });
  final DrillMedia media;
  final DrillMediaController controller;
  final Map<String, String> labels;
  @override
  State<DrillMediaPlatformView> createState() => _MediaWebState();
}

class _MediaWebState extends State<DrillMediaPlatformView> {
  web.HTMLIFrameElement? _frame;
  late final JSFunction _listener;
  late final MediaCommandSink _sink;
  @override
  void initState() {
    super.initState();
    _sink = _send;
    widget.controller.attach(_sink);
    _listener = _receive.toJS;
    web.window.addEventListener('message', _listener);
  }

  void _create(Object element) {
    if (!mounted) return;
    final frame = element as web.HTMLIFrameElement;
    _frame = frame;
    frame
      ..title = widget.labels['title']!
      ..src = Uri.base
          .resolve('assets/assets/drill_media/player.html')
          .replace(
            queryParameters: {
              'id': widget.media.id,
              'posterTime': widget.media.posterTime.toString(),
              'labels': jsonEncode(widget.labels),
              'active': widget.controller.active.toString(),
            },
          )
          .toString();
    frame.setAttribute('scrolling', 'no');
    frame.style
      ..border = '0'
      ..width = '100%'
      ..height = '100%'
      ..display = 'block'
      ..backgroundColor = '#101013';
  }

  void _receive(web.Event event) {
    final frame = _frame;
    if (!mounted || frame?.contentWindow == null) return;
    final message = event as web.MessageEvent;
    if (message.origin != web.window.location.origin ||
        !message.source.strictEquals(frame!.contentWindow).toDart) {
      return;
    }
    final value = message.data.dartify();
    if (value is Map) widget.controller.receive(value);
  }

  void _send(Map<String, Object?> command) {
    _frame?.contentWindow?.postMessage(
      {'source': 'drill-media-host', 'command': command}.jsify(),
      web.window.location.origin.toJS,
    );
  }

  @override
  Widget build(BuildContext context) =>
      HtmlElementView.fromTagName(tagName: 'iframe', onElementCreated: _create);
  @override
  void dispose() {
    _send({'type': 'dispose'});
    widget.controller.detach(_sink);
    web.window.removeEventListener('message', _listener);
    _frame?.src = 'about:blank';
    _frame = null;
    super.dispose();
  }
}
