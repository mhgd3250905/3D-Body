import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:path_provider/path_provider.dart';
import 'package:ugk_coach/ugk_coach.dart' show sha256Hex;

Future<void> tracePlanVoice(String event, String asset) async {
  try {
    if (asset.startsWith('file:')) {
      final current = File.fromUri(Uri.parse(asset));
      final digest = await current.exists()
          ? sha256Hex(await current.readAsBytes())
          : 'missing';
      debugPrint('FlarePlanVoice $event file=$asset cacheSha=$digest');
      return;
    }
    final cache = (await getTemporaryDirectory()).path;
    // just_audio prefixes logical assets with its own cache and "assets".
    final root = '$cache/just_audio_cache/assets';
    final name = asset.split('/').last;
    final current = File('$root/$asset');
    final previous = File('$root/assets/trainer_voice/_common/voice/zh/$name');
    final digest = await current.exists()
        ? sha256Hex(await current.readAsBytes())
        : 'missing';
    final oldDigest = await previous.exists()
        ? sha256Hex(await previous.readAsBytes())
        : 'missing';
    debugPrint(
      'FlarePlanVoice $event asset=$asset cacheSha=$digest previousSha=$oldDigest',
    );
  } catch (_) {
    debugPrint('FlarePlanVoice $event asset=$asset cacheSha=unavailable');
  }
}
