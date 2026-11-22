import 'dart:async';
import 'dart:collection';

import 'package:flutter/foundation.dart';
import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as trainer;

/// Counts native decoders, including creates and disposals still in flight.
/// The SDK releases a video's pin only after its native disposal completes.
class DrillDecoderPool {
  DrillDecoderPool({this.limit = 2}) : assert(limit > 0);

  static final shared = DrillDecoderPool();
  final int limit;
  final _waiting = Queue<DrillDecoderLease>();
  int _active = 0;

  @visibleForTesting
  int get activeCount => _active;

  DrillDecoderLease acquire() {
    final lease = DrillDecoderLease._(this);
    _waiting.add(lease);
    _drain();
    return lease;
  }

  void _drain() {
    while (_active < limit && _waiting.isNotEmpty) {
      final lease = _waiting.removeFirst();
      if (lease._released) continue;
      _active++;
      lease._granted = true;
      lease._ready.complete(true);
    }
  }
}

class DrillDecoderLease {
  DrillDecoderLease._(this._pool);
  final DrillDecoderPool _pool;
  final _ready = Completer<bool>();
  bool _granted = false;
  bool _released = false;

  /// False means this request was cancelled before it acquired a decoder.
  Future<bool> get ready => _ready.future;

  void release() {
    if (_released) return;
    _released = true;
    if (_granted) {
      _pool._active--;
    } else {
      _pool._waiting.remove(this);
      _ready.complete(false);
    }
    _pool._drain();
  }
}

/// One card's view of the SDK repository. Downloading, verification and cache
/// ownership stay in the SDK; only admission to a new decoder is queued here.
/// A separate wrapper per card keeps simultaneous uses of one action distinct.
class DrillDecoderRepository implements trainer.CatalogMediaRepository {
  DrillDecoderRepository(this.delegate, {DrillDecoderPool? pool})
    : pool = pool ?? DrillDecoderPool.shared;

  final trainer.CatalogMediaRepository delegate;
  final DrillDecoderPool pool;
  DrillDecoderLease? _latest;

  @override
  VoidCallback retainVideo(String actionId) {
    final releaseFile = delegate.retainVideo(actionId);
    final lease = _latest = pool.acquire();
    var released = false;
    return () {
      if (released) return;
      released = true;
      try {
        releaseFile();
      } finally {
        lease.release();
      }
    };
  }

  @override
  Future<Uri> ensureFile(coach.PoseHubPackFile file) async {
    // TrainingActionMedia calls this immediately after retainVideo. Capture
    // that exact lease before awaiting; a later reload may already queue one.
    final lease = _latest;
    if (lease != null && !await lease.ready) {
      throw StateError('Demonstration retired before decoder admission');
    }
    return delegate.ensureFile(file);
  }

  @override
  coach.PoseHubAppTestCatalog get catalog => delegate.catalog;
  @override
  Uri get mediaBaseUri => delegate.mediaBaseUri;
  @override
  Future<Uri> ensureAction(String actionId) => delegate.ensureAction(actionId);
  @override
  ValueListenable<trainer.CatalogMediaDownloadState> watchFile(
    coach.PoseHubPackFile file,
  ) => delegate.watchFile(file);
  @override
  ValueListenable<trainer.CatalogMediaDownloadState> watchAction(
    String actionId,
  ) => delegate.watchAction(actionId);
  @override
  Future<Uri?> cachedVideo(String actionId) => delegate.cachedVideo(actionId);
  @override
  Future<int> videoCacheBytes() => delegate.videoCacheBytes();
  @override
  Future<void> clearVideoCache() => delegate.clearVideoCache();

  // This view owns neither the application repository nor its still-retiring
  // SDK pins. Their exact release callbacks must remain valid after unmount.
  @override
  void dispose() {}
}
