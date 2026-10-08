import 'dart:convert';
import 'dart:io';

import 'package:flare/data/catalog.dart';

Catalog loadCatalogFixture() {
  Map<String, dynamic> file(String name) =>
      jsonDecode(File('assets/data/$name').readAsStringSync())
          as Map<String, dynamic>;
  return Catalog.fromJson(
    phaseMuscles: file('phase-muscles.json'),
    drillLibrary: file('drills.json'),
    curriculum: file('course-stages.json'),
    manifest: file('source-manifest.json'),
  );
}
