import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'theme.dart';

/// App-owned list illustrations. Navigation and playback controls keep their
/// functional line icons; these objects belong only in a row's leading slot.
enum FlareRowSymbol {
  training,
  plans,
  records,
  settings,
  language,
  appearance,
  actor,
  speed,
  quality,
  safety,
  about,
  add,
  coach,
}

class FlareRowEmblem extends StatelessWidget {
  const FlareRowEmblem({
    super.key,
    required this.symbol,
    this.size = FlareGeometry.rowIconSlot,
  });

  final FlareRowSymbol symbol;
  final double size;

  @override
  Widget build(BuildContext context) => ExcludeSemantics(
    child: RepaintBoundary(
      child: SizedBox.square(
        dimension: size,
        child: CustomPaint(
          painter: FlareRowEmblemPainter(
            symbol: symbol,
            dark: Theme.of(context).brightness == Brightness.dark,
            highContrast: MediaQuery.maybeHighContrastOf(context) ?? false,
          ),
        ),
      ),
    ),
  );
}

enum _Finish { ember, porcelain, steel, graphite }

/// Original 64-unit artwork. All objects share a top-left light source and a
/// short lower-right sidewall. Material colours live in the Thomas theme;
/// coordinates below describe the artwork, not layout dimensions.
class FlareRowEmblemPainter extends CustomPainter {
  const FlareRowEmblemPainter({
    required this.symbol,
    required this.dark,
    this.highContrast = false,
  });

  final FlareRowSymbol symbol;
  final bool dark;
  final bool highContrast;

  List<Color> _colours(_Finish finish) => switch (finish) {
    _Finish.ember => FlareIconMaterials.ember(dark),
    _Finish.porcelain => FlareIconMaterials.porcelain(dark),
    _Finish.steel => FlareIconMaterials.steel(dark),
    _Finish.graphite => FlareIconMaterials.graphite(dark),
  };

  Path _round(double x, double y, double w, double h, double r) => Path()
    ..addRRect(
      RRect.fromRectAndRadius(Rect.fromLTWH(x, y, w, h), Radius.circular(r)),
    );

  Path _oval(double x, double y, double w, double h) =>
      Path()..addOval(Rect.fromLTWH(x, y, w, h));

  void _object(Canvas canvas, Path path, _Finish finish, {double depth = 2.2}) {
    final colours = _colours(finish);
    // This is the object's own sidewall, not an external cast shadow.
    if (depth > 0) {
      canvas.drawPath(
        path.shift(Offset(depth * .65, depth)),
        Paint()..color = colours.last,
      );
    }
    canvas.drawPath(
      path,
      Paint()
        ..shader = LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: colours,
          stops: const [0, .48, 1],
        ).createShader(path.getBounds()),
    );
    canvas.drawPath(
      path,
      Paint()
        ..color = FlareIconMaterials.edge(dark, highContrast)
        ..style = PaintingStyle.stroke
        ..strokeWidth = highContrast ? 1.5 : .65
        ..strokeJoin = StrokeJoin.round,
    );
    if (!highContrast) {
      canvas.save();
      canvas.clipPath(path);
      canvas.drawPath(
        path.shift(const Offset(.4, .6)),
        Paint()
          ..color = FlareIconMaterials.highlight(dark)
          ..style = PaintingStyle.stroke
          ..strokeWidth = .75,
      );
      canvas.restore();
    }
  }

  void _line(Canvas canvas, Path path, Color colour, double width) =>
      canvas.drawPath(
        path,
        Paint()
          ..color = colour
          ..style = PaintingStyle.stroke
          ..strokeWidth = width
          ..strokeCap = StrokeCap.round
          ..strokeJoin = StrokeJoin.round,
      );

  void _bar(
    Canvas canvas,
    double x,
    double y,
    double width,
    double height,
    _Finish finish, {
    double radius = 2,
    double depth = 1.2,
  }) => _object(
    canvas,
    _round(x, y, width, height, radius),
    finish,
    depth: depth,
  );

  @override
  void paint(Canvas canvas, Size size) {
    canvas.save();
    canvas.scale(size.width / 64, size.height / 64);
    switch (symbol) {
      case FlareRowSymbol.training:
        _training(canvas);
      case FlareRowSymbol.plans:
        _plans(canvas);
      case FlareRowSymbol.records:
        _records(canvas);
      case FlareRowSymbol.settings:
        _settings(canvas);
      case FlareRowSymbol.language:
        _language(canvas);
      case FlareRowSymbol.appearance:
        _appearance(canvas);
      case FlareRowSymbol.actor:
        _actor(canvas);
      case FlareRowSymbol.speed:
        _speed(canvas);
      case FlareRowSymbol.quality:
        _quality(canvas);
      case FlareRowSymbol.safety:
        _safety(canvas);
      case FlareRowSymbol.about:
        _about(canvas);
      case FlareRowSymbol.add:
        _add(canvas);
      case FlareRowSymbol.coach:
        _coach(canvas);
    }
    canvas.restore();
  }

  void _training(Canvas canvas) {
    canvas.save();
    canvas.translate(32, 30);
    canvas.rotate(-math.pi / 5);
    canvas.translate(-32, -32);
    _bar(canvas, 10, 28, 44, 9, _Finish.steel, radius: 3);
    _bar(canvas, 10, 19, 10, 27, _Finish.ember, radius: 3, depth: 2.8);
    _bar(canvas, 5, 24, 6, 17, _Finish.graphite, radius: 2);
    _bar(canvas, 44, 19, 10, 27, _Finish.ember, radius: 3, depth: 2.8);
    _bar(canvas, 54, 24, 5, 17, _Finish.graphite, radius: 2);
    _bar(canvas, 25, 30, 14, 4, _Finish.porcelain, radius: 1, depth: 0);
    canvas.restore();
  }

  void _plans(Canvas canvas) {
    canvas.save();
    canvas.translate(32, 32);
    canvas.rotate(-.15);
    canvas.translate(-32, -32);
    _bar(canvas, 11, 12, 35, 42, _Finish.steel, radius: 5, depth: 2);
    canvas.restore();
    _bar(canvas, 18, 7, 35, 45, _Finish.porcelain, radius: 5, depth: 2.8);
    _bar(canvas, 23, 15, 20, 5, _Finish.ember, radius: 2, depth: .7);
    for (var i = 0; i < 3; i++) {
      final y = 27.0 + i * 8;
      _bar(canvas, 24, y, 4, 4, _Finish.ember, radius: 1, depth: .5);
      _bar(canvas, 32, y + 1, 13, 2, _Finish.steel, radius: 1, depth: 0);
    }
  }

  void _records(Canvas canvas) {
    _bar(canvas, 9, 12, 44, 41, _Finish.porcelain, radius: 6, depth: 2.8);
    final cap = Path()
      ..moveTo(15, 12)
      ..lineTo(47, 12)
      ..quadraticBezierTo(53, 12, 53, 18)
      ..lineTo(53, 25)
      ..lineTo(9, 25)
      ..lineTo(9, 18)
      ..quadraticBezierTo(9, 12, 15, 12)
      ..close();
    _object(canvas, cap, _Finish.ember, depth: .8);
    _bar(canvas, 19, 7, 4, 12, _Finish.steel, radius: 2, depth: .8);
    _bar(canvas, 39, 7, 4, 12, _Finish.steel, radius: 2, depth: .8);
    _bar(canvas, 17, 38, 6, 9, _Finish.steel, radius: 1.5, depth: .7);
    _bar(canvas, 28, 32, 6, 15, _Finish.ember, radius: 1.5, depth: .7);
    _bar(canvas, 39, 28, 6, 19, _Finish.ember, radius: 1.5, depth: .7);
  }

  void _settings(Canvas canvas) {
    final gear = Path();
    // Eight broad teeth leave a recognisable silhouette at 30pt.
    for (var i = 0; i < 64; i++) {
      final t = i * math.pi / 32 - math.pi / 2;
      final radius = switch (i % 8) {
        1 || 2 || 3 || 4 => 24.0,
        _ => 19.0,
      };
      final x = 31 + math.cos(t) * radius;
      final y = 30 + math.sin(t) * radius;
      if (i == 0) {
        gear.moveTo(x, y);
      } else {
        gear.lineTo(x, y);
      }
    }
    gear.close();
    _object(canvas, gear, _Finish.steel, depth: 3);
    _object(canvas, _oval(18, 17, 26, 26), _Finish.ember, depth: 1.2);
    _object(canvas, _oval(24, 23, 14, 14), _Finish.graphite, depth: .3);
  }

  void _language(Canvas canvas) {
    final back = Path()
      ..moveTo(12, 8)
      ..lineTo(37, 8)
      ..quadraticBezierTo(43, 8, 43, 14)
      ..lineTo(43, 30)
      ..quadraticBezierTo(43, 36, 37, 36)
      ..lineTo(22, 36)
      ..lineTo(12, 43)
      ..lineTo(12, 36)
      ..quadraticBezierTo(6, 36, 6, 30)
      ..lineTo(6, 14)
      ..quadraticBezierTo(6, 8, 12, 8)
      ..close();
    _object(canvas, back, _Finish.ember, depth: 2.2);
    final front = Path()
      ..moveTo(28, 24)
      ..lineTo(50, 24)
      ..quadraticBezierTo(56, 24, 56, 30)
      ..lineTo(56, 44)
      ..quadraticBezierTo(56, 50, 50, 50)
      ..lineTo(50, 56)
      ..lineTo(42, 50)
      ..lineTo(28, 50)
      ..quadraticBezierTo(22, 50, 22, 44)
      ..lineTo(22, 30)
      ..quadraticBezierTo(22, 24, 28, 24)
      ..close();
    _object(canvas, front, _Finish.porcelain, depth: 1.7);
    final bright = FlareIconMaterials.highlight(dark);
    _line(
      canvas,
      Path()
        ..moveTo(15, 18)
        ..lineTo(33, 18),
      bright,
      2.5,
    );
    _line(
      canvas,
      Path()
        ..moveTo(19, 24)
        ..lineTo(28, 24),
      bright,
      2.5,
    );
    final detail = FlareIconMaterials.detail(dark);
    _line(
      canvas,
      Path()
        ..moveTo(30, 43)
        ..lineTo(36, 31)
        ..lineTo(42, 43),
      detail,
      2.4,
    );
    _line(
      canvas,
      Path()
        ..moveTo(33, 39)
        ..lineTo(39, 39),
      detail,
      2,
    );
  }

  void _appearance(Canvas canvas) {
    _object(canvas, _oval(8, 7, 46, 46), _Finish.porcelain, depth: 2.6);
    final shade = Path()
      ..moveTo(31, 7)
      ..cubicTo(44, 7, 54, 17, 54, 30)
      ..cubicTo(54, 43, 44, 53, 31, 53)
      ..cubicTo(40, 42, 40, 18, 31, 7)
      ..close();
    _object(canvas, shade, _Finish.graphite, depth: 0);
    _object(canvas, _oval(18, 16, 9, 9), _Finish.ember, depth: .7);
    _line(
      canvas,
      Path()
        ..moveTo(16, 39)
        ..quadraticBezierTo(20, 45, 26, 46),
      FlareIconMaterials.highlight(dark),
      1.3,
    );
  }

  void _actor(Canvas canvas) {
    _object(canvas, _oval(24, 5, 15, 16), _Finish.porcelain, depth: 1.5);
    final vest = Path()
      ..moveTo(20, 23)
      ..lineTo(26, 22)
      ..quadraticBezierTo(31, 29, 37, 22)
      ..lineTo(43, 23)
      ..lineTo(50, 37)
      ..lineTo(42, 41)
      ..lineTo(41, 55)
      ..lineTo(21, 55)
      ..lineTo(20, 41)
      ..lineTo(12, 37)
      ..close();
    _object(canvas, vest, _Finish.ember, depth: 2.6);
    _bar(canvas, 28, 36, 6, 15, _Finish.porcelain, radius: 2, depth: .5);
    _line(
      canvas,
      Path()
        ..moveTo(23, 51)
        ..lineTo(39, 51),
      FlareIconMaterials.detail(dark),
      1,
    );
  }

  void _speed(Canvas canvas) {
    _object(canvas, _oval(7, 7, 48, 48), _Finish.steel, depth: 2.6);
    _object(canvas, _oval(12, 12, 38, 38), _Finish.porcelain, depth: .3);
    for (var i = 0; i < 5; i++) {
      final t = math.pi + i * math.pi / 4;
      _line(
        canvas,
        Path()
          ..moveTo(31 + math.cos(t) * 12, 31 + math.sin(t) * 12)
          ..lineTo(31 + math.cos(t) * 15, 31 + math.sin(t) * 15),
        FlareIconMaterials.detail(dark),
        1.8,
      );
    }
    final needle = Path()
      ..moveTo(27, 32)
      ..lineTo(42, 18)
      ..lineTo(34, 35)
      ..close();
    _object(canvas, needle, _Finish.ember, depth: 1.1);
    _object(canvas, _oval(27, 28, 8, 8), _Finish.ember, depth: .6);
  }

  void _quality(Canvas canvas) {
    _bar(canvas, 6, 14, 43, 36, _Finish.steel, radius: 5, depth: 2);
    _bar(canvas, 14, 7, 43, 36, _Finish.porcelain, radius: 5, depth: 2.6);
    final scene = Path()
      ..moveTo(19, 36)
      ..lineTo(29, 22)
      ..lineTo(36, 29)
      ..lineTo(41, 23)
      ..lineTo(52, 36)
      ..close();
    _object(canvas, scene, _Finish.ember, depth: .5);
    _object(canvas, _oval(42, 13, 7, 7), _Finish.ember, depth: .4);
  }

  void _safety(Canvas canvas) {
    final shell = Path()
      ..moveTo(31, 6)
      ..quadraticBezierTo(41, 13, 53, 15)
      ..lineTo(51, 33)
      ..quadraticBezierTo(49, 47, 31, 57)
      ..quadraticBezierTo(13, 47, 11, 33)
      ..lineTo(9, 15)
      ..quadraticBezierTo(21, 13, 31, 6)
      ..close();
    _object(canvas, shell, _Finish.steel, depth: 2.2);
    final core = Path()
      ..moveTo(31, 12)
      ..quadraticBezierTo(39, 17, 47, 19)
      ..lineTo(45, 33)
      ..quadraticBezierTo(43, 43, 31, 51)
      ..quadraticBezierTo(19, 43, 17, 33)
      ..lineTo(15, 19)
      ..quadraticBezierTo(23, 17, 31, 12)
      ..close();
    _object(canvas, core, _Finish.ember, depth: .4);
    _line(
      canvas,
      Path()
        ..moveTo(23, 31)
        ..lineTo(29, 37)
        ..lineTo(40, 25),
      FlareIconMaterials.highlight(dark),
      4,
    );
  }

  void _about(Canvas canvas) {
    _object(canvas, _oval(7, 6, 48, 48), _Finish.ember, depth: 2.8);
    _object(canvas, _oval(13, 12, 36, 36), _Finish.porcelain, depth: .5);
    _object(canvas, _oval(28, 19, 6, 6), _Finish.ember, depth: .5);
    _bar(canvas, 28, 29, 6, 13, _Finish.ember, radius: 2, depth: .7);
  }

  void _add(Canvas canvas) {
    final cross = Path.combine(
      PathOperation.union,
      _round(24, 7, 14, 46, 4),
      _round(8, 23, 46, 14, 4),
    );
    _object(canvas, cross, _Finish.ember, depth: 3);
  }

  Path _star(double x, double y, double radius, double waist) => Path()
    ..moveTo(x, y - radius)
    ..quadraticBezierTo(x + waist, y - waist, x + radius, y)
    ..quadraticBezierTo(x + waist, y + waist, x, y + radius)
    ..quadraticBezierTo(x - waist, y + waist, x - radius, y)
    ..quadraticBezierTo(x - waist, y - waist, x, y - radius)
    ..close();

  void _coach(Canvas canvas) {
    final star = _star(28, 33, 23, 6);
    _object(canvas, star, _Finish.ember, depth: 2.5);
    canvas.save();
    canvas.clipPath(star);
    final facet = Path()
      ..moveTo(28, 10)
      ..lineTo(28, 33)
      ..lineTo(5, 33)
      ..close();
    canvas.drawPath(facet, Paint()..color = FlareIconMaterials.highlight(dark));
    canvas.restore();
    _object(canvas, _star(49, 13, 9, 2.4), _Finish.porcelain, depth: 1.2);
  }

  @override
  bool shouldRepaint(covariant FlareRowEmblemPainter oldDelegate) =>
      oldDelegate.symbol != symbol ||
      oldDelegate.dark != dark ||
      oldDelegate.highContrast != highContrast;
}
