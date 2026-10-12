import 'dart:convert';
import 'dart:io';
import 'package:flare/data/drill_media.dart';
import 'package:flutter_test/flutter_test.dart';
import '../domain/fixtures.dart';

void main() {
  Map<String, dynamic> manifest() =>
      jsonDecode(
            File('assets/data/drill-media-manifest.json').readAsStringSync(),
          )
          as Map<String, dynamic>;
  test(
    'all existing drill IDs map to offline videos without changing doses',
    () {
      final catalog = loadCatalogFixture();
      final entries = DrillMedia.parse(manifest());
      expect(entries.keys.toSet(), catalog.drills.map((d) => d.id).toSet());
      for (final media in entries.values) {
        expect(File(media.videoAsset).existsSync(), isTrue);
        expect(File(media.posterAsset).existsSync(), isTrue);
        expect(media.duration, inInclusiveRange(6, 16));
        expect(media.posterTime, inInclusiveRange(1, 2));
      }
      expect(catalog.drillById('forearms-B')!.dose.blockLabels, ['腕屈', '腕伸']);
      expect(catalog.drillById('scapular-A')!.dose.blockLabels, [
        'Y',
        'T',
        'W',
      ]);
      expect(catalog.drillById('deltoids-B')!.name, contains('半程'));
    },
  );
  test('rejects remote media, path escapes and invalid durations', () {
    for (final change in [
      {'video_asset': 'https://example.com/video.mp4'},
      {'poster_asset': 'assets/drill_media/../brand/icon.png'},
      {'duration_seconds': 0},
      {'duration_seconds': double.infinity},
      {'poster_time_seconds': -1},
      {'poster_time_seconds': 20},
      {'poster_time_seconds': double.infinity},
    ]) {
      final json = manifest();
      (json['actions']['abs-A'] as Map).addAll(change);
      expect(() => DrillMedia.parse(json), throwsFormatException);
    }
  });
}
