import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

import 'motion.dart';

/// Whole-screen cross-dissolve when the appearance changes (dark, light or
/// the system flipping it), the way UIKit dissolves a window.
///
/// The colour tokens still switch in a single frame, so no frame ever mixes
/// the two palettes inside one widget. Instead, right before the first frame
/// in the new appearance is painted, the last frame in the old one is taken
/// from this widget's repaint boundary and laid over the new frame, then faded
/// out. Images that differ per theme (the training art) dissolve with
/// everything else.
///
/// The live 3D view is a platform view, which a Flutter snapshot cannot
/// capture. Where a [ThemeFadeWindow] marks it, the overlay leaves a window so
/// the athlete keeps playing in front, and the window paints the old
/// backdrop *beneath* the view instead, so the dissolve has no seam; the
/// scene's own chrome transitions in CSS over the same duration.
///
/// With reduced motion, or if a snapshot cannot be taken, the switch stays
/// instant.
class ThemeCrossFade extends StatefulWidget {
  const ThemeCrossFade({
    super.key,
    required this.brightness,
    required this.child,
  });

  final Brightness brightness;
  final Widget child;

  @override
  State<ThemeCrossFade> createState() => ThemeCrossFadeState();
}

class ThemeCrossFadeState extends State<ThemeCrossFade>
    with SingleTickerProviderStateMixin {
  final _boundary = GlobalKey();
  final _windows = <_ThemeFadeWindowState>{};
  late final AnimationController _fade;
  ui.Image? _image;
  double _ratio = 1;
  List<Rect> _holes = const [];

  @override
  void initState() {
    super.initState();
    // Even when no appearance animation runs (including reduced motion),
    // create the ticker while this element can still resolve TickerMode.
    _fade = AnimationController(vsync: this)
      ..addStatusListener((status) {
        if (status == AnimationStatus.completed) _clear();
      });
  }

  /// True while the old appearance is dissolving away (for tests).
  bool get fading => _image != null;

  /// Opacity of the old frame right now, 1 → 0.
  double get oldOpacity =>
      _image == null ? 0 : 1 - FlareMotion.dissolve.transform(_fade.value);

  @override
  void didUpdateWidget(ThemeCrossFade oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.brightness == widget.brightness) return;
    final duration = FlareMotion.of(context, FlareMotion.theme);
    if (duration == Duration.zero) {
      _clear();
      return;
    }
    // This runs while the new appearance is being built, before anything
    // below has repainted, so the boundary still holds the old frame. A
    // switch during a dissolve captures the screen as it looks mid-fade
    // (the overlay sits inside the boundary), so nothing jumps.
    final render = _boundary.currentContext?.findRenderObject();
    if (render is! _RenderSnapshotBoundary) return;
    final ratio = View.of(context).devicePixelRatio;
    final holes = <Rect>[for (final window in _windows) ?window.holeIn(render)];
    ui.Image? image;
    try {
      image = render.snapshot(ratio);
    } catch (_) {
      image = null;
    }
    if (image == null) return;
    _image?.dispose();
    _image = image;
    _ratio = ratio;
    _holes = holes;
    _fade
      ..duration = duration
      ..forward(from: 0);
  }

  void _clear() {
    if (_image == null) return;
    setState(() {
      _image?.dispose();
      _image = null;
      _holes = const [];
    });
    for (final window in _windows) {
      window.refresh();
    }
  }

  @override
  void dispose() {
    _fade.dispose();
    _image?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final image = _image;
    return _ThemeFadeScope(
      state: this,
      child: _SnapshotBoundary(
        key: _boundary,
        child: Stack(
          fit: StackFit.passthrough,
          children: [
            widget.child,
            if (image != null)
              Positioned.fill(
                child: IgnorePointer(
                  child: CustomPaint(
                    key: const ValueKey('theme-cross-fade'),
                    painter: _OldFramePainter(
                      image: image,
                      ratio: _ratio,
                      holes: _holes,
                      opacity: _fade,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _ThemeFadeScope extends InheritedWidget {
  const _ThemeFadeScope({required this.state, required super.child});
  final ThemeCrossFadeState state;
  @override
  bool updateShouldNotify(_ThemeFadeScope old) => state != old.state;
}

/// Marks the live 3D view. Place it directly *under* the platform view in
/// the same stack: during a dissolve the overlay above leaves this rectangle
/// open, and this widget paints the old frame's backdrop here underneath the
/// view instead. [enabled] is false when the view is not on screen.
class ThemeFadeWindow extends StatefulWidget {
  const ThemeFadeWindow({super.key, this.enabled = true});
  final bool enabled;
  @override
  State<ThemeFadeWindow> createState() => _ThemeFadeWindowState();
}

class _ThemeFadeWindowState extends State<ThemeFadeWindow> {
  ThemeCrossFadeState? _host;
  Rect? _hole;
  bool _routeCurrent = true;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final host = context
        .dependOnInheritedWidgetOfExactType<_ThemeFadeScope>()
        ?.state;
    if (host != _host) {
      _host?._windows.remove(this);
      _host = host?.._windows.add(this);
    }
  }

  /// This window's rectangle in [boundary] if it is really visible now: not
  /// disabled, not offstage, and not covered by a sheet or dialog.
  Rect? holeIn(RenderBox boundary) {
    _hole = null;
    if (!widget.enabled || !mounted) return null;
    if (!_routeCurrent) return null;
    final box = context.findRenderObject();
    if (box is! RenderBox || !box.attached || !box.hasSize) return null;
    for (RenderObject? node = box.parent; node != null; node = node.parent) {
      if (node is RenderOffstage && node.offstage) return null;
      if (node == boundary) break;
    }
    final origin = box.localToGlobal(Offset.zero, ancestor: boundary);
    _hole = origin & box.size;
    setState(() {});
    return _hole;
  }

  void refresh() {
    if (!mounted || _hole == null) return;
    setState(() => _hole = null);
  }

  @override
  void dispose() {
    _host?._windows.remove(this);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    _routeCurrent = ModalRoute.of(context)?.isCurrent ?? true;
    final host = _host;
    final hole = _hole;
    final image = host?._image;
    if (host == null || hole == null || image == null) {
      return const SizedBox.expand();
    }
    return IgnorePointer(
      child: CustomPaint(
        size: Size.infinite,
        painter: _OldFramePainter(
          image: image,
          ratio: host._ratio,
          window: hole,
          opacity: host._fade,
        ),
      ),
    );
  }
}

class _OldFramePainter extends CustomPainter {
  _OldFramePainter({
    required this.image,
    required this.ratio,
    required this.opacity,
    this.holes = const [],
    this.window,
  }) : super(repaint: opacity);

  final ui.Image image;
  final double ratio;
  final Animation<double> opacity;

  /// Rectangles left open (the live 3D view shows through).
  final List<Rect> holes;

  /// When set, paint only this part of the old frame, filling [size].
  final Rect? window;

  @override
  void paint(Canvas canvas, Size size) {
    final alpha = 1 - FlareMotion.dissolve.transform(opacity.value);
    if (alpha <= 0) return;
    final paint = Paint()
      ..filterQuality = FilterQuality.low
      ..color = Color.fromRGBO(0, 0, 0, alpha);
    final full = Rect.fromLTWH(
      0,
      0,
      image.width.toDouble(),
      image.height.toDouble(),
    );
    final window = this.window;
    if (window != null) {
      final source = Rect.fromLTWH(
        window.left * ratio,
        window.top * ratio,
        window.width * ratio,
        window.height * ratio,
      ).intersect(full);
      canvas.drawImageRect(image, source, Offset.zero & size, paint);
      return;
    }
    canvas.save();
    if (holes.isNotEmpty) {
      final path = Path()
        ..fillType = PathFillType.evenOdd
        ..addRect(Offset.zero & size);
      for (final hole in holes) {
        path.addRect(hole);
      }
      canvas.clipPath(path);
    }
    canvas.drawImageRect(image, full, Offset.zero & size, paint);
    canvas.restore();
  }

  @override
  bool shouldRepaint(_OldFramePainter old) =>
      old.image != image ||
      old.window != window ||
      old.holes != holes ||
      old.ratio != ratio;
}

class _SnapshotBoundary extends SingleChildRenderObjectWidget {
  const _SnapshotBoundary({super.key, super.child});
  @override
  RenderObject createRenderObject(BuildContext context) =>
      _RenderSnapshotBoundary();
}

class _RenderSnapshotBoundary extends RenderRepaintBoundary {
  /// The frame this boundary last painted, read from its retained layer
  /// (valid between frames and during build, before it repaints).
  ui.Image? snapshot(double ratio) {
    final retained = layer;
    if (retained is! OffsetLayer || !hasSize || size.isEmpty) return null;
    return retained.toImageSync(Offset.zero & size, pixelRatio: ratio);
  }
}
