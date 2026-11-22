import 'dart:convert';

import 'package:flutter/services.dart';

/// Pose-Hub AI drafts, kept verbatim and separate from reviewed catalogue data.
/// Missing action IDs intentionally use the SDK's catalogue fallback.
Future<Map<String, Map<String, Object?>>> loadAppAiTags({
  AssetBundle? bundle,
}) async {
  final raw =
      jsonDecode(
            await (bundle ?? rootBundle).loadString(
              'assets/ai_tags/actions.json',
            ),
          )
          as Map<String, dynamic>;
  return {
    for (final entry in raw.entries)
      entry.key: Map<String, Object?>.from(entry.value as Map),
  };
}
