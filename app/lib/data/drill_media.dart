import 'dart:convert';
import 'package:flutter/services.dart';

class DrillMedia {
  const DrillMedia({
    required this.id,
    required this.videoAsset,
    required this.posterAsset,
    required this.duration,
    this.posterTime = 0,
  });
  final String id;
  final String videoAsset;
  final String posterAsset;
  final double duration;
  final double posterTime;

  static Map<String, DrillMedia> parse(Map<String, dynamic> json) {
    if (json['schema_version'] != 1 || json['actions'] is! Map) {
      throw const FormatException('Invalid drill media manifest');
    }
    final entries = Map<String, dynamic>.from(json['actions'] as Map);
    return Map.unmodifiable(
      entries.map((id, value) {
        final entry = Map<String, dynamic>.from(value as Map);
        final seconds = (entry['duration_seconds'] as num).toDouble();
        final posterTime = (entry['poster_time_seconds'] as num? ?? 0)
            .toDouble();
        if (!RegExp(r'^[a-z]+(?:-[a-z]+)*-[ABC]$').hasMatch(id) ||
            entry['video_asset'] != 'assets/drill_media/$id.mp4' ||
            entry['poster_asset'] != 'assets/drill_media/$id.jpg' ||
            !seconds.isFinite ||
            seconds <= 0 ||
            !posterTime.isFinite ||
            posterTime < 0 ||
            posterTime >= seconds) {
          throw const FormatException('Invalid drill media entry');
        }
        return MapEntry(
          id,
          DrillMedia(
            id: id,
            videoAsset: entry['video_asset'] as String,
            posterAsset: entry['poster_asset'] as String,
            duration: seconds,
            posterTime: posterTime,
          ),
        );
      }),
    );
  }

  static Future<Map<String, DrillMedia>>? _loading;
  static Future<Map<String, DrillMedia>> load() => _loading ??= rootBundle
      .loadString('assets/data/drill-media-manifest.json')
      .then((text) => parse(jsonDecode(text) as Map<String, dynamic>));
}
