import 'package:flutter/material.dart';
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as trainer;

import '../data/flare_public_media.dart';
import '../data/flare_shared_library.dart';
import '../l10n/app_localizations.dart';

/// Only one inline demonstration plays at a time across Flare's pages.
///
/// HipLab media rule: a demonstration stopped by the user, or by another
/// one starting, pauses on the frame it reached and keeps showing it; it
/// never jumps back to the poster or the first frame. The pool is bounded:
/// besides the one playing, only the most recently paused card keeps its
/// decoder ([held]); older ones fall back to their poster.
class DrillPlaybackCoordinator extends ChangeNotifier {
  static final shared = DrillPlaybackCoordinator();
  Object? _owner;
  Object? _held;
  Object? get owner => _owner;

  /// The last card paused on its frame (decoder kept, not playing).
  Object? get held => _held;

  void play(Object owner) {
    if (identical(_owner, owner)) return;
    if (_owner != null) _held = _owner;
    if (identical(_held, owner)) _held = null;
    _owner = owner;
    notifyListeners();
  }

  /// Pause [owner] where it is.
  void release(Object owner) {
    if (!identical(_owner, owner)) return;
    _owner = null;
    _held = owner;
    notifyListeners();
  }

  /// [owner] is gone: free its slot entirely.
  void forget(Object owner) {
    final changed = identical(_owner, owner) || identical(_held, owner);
    if (identical(_owner, owner)) _owner = null;
    if (identical(_held, owner)) _held = null;
    if (changed) notifyListeners();
  }

  void pauseAll() {
    if (_owner == null) return;
    _held = _owner;
    _owner = null;
    notifyListeners();
  }
}

/// Public SDK action art (verified poster, then on-demand public video). The
/// SDK owns download, decoding and the cold poster→first-frame handoff (the
/// poster stays until a real frame is on screen). Flare keeps one media
/// node per card and only says whether it runs: a pause holds the current
/// frame (`paused`) instead of tearing the decoder down. Tap toggles
/// playback unless [autoPlay].
class DrillMediaCard extends StatefulWidget {
  const DrillMediaCard({
    super.key,
    required this.drillId,
    this.active = true,
    this.mirrored = false,
    this.autoPlay = false,
  });
  final String drillId;
  final bool active;
  final bool mirrored;
  final bool autoPlay;
  @override
  State<DrillMediaCard> createState() => _DrillMediaCardState();
}

class _DrillMediaCardState extends State<DrillMediaCard> {
  final _coordinator = DrillPlaybackCoordinator.shared;

  @override
  void initState() {
    super.initState();
    _coordinator.addListener(_changed);
  }

  @override
  void dispose() {
    _coordinator
      ..removeListener(_changed)
      ..forget(this);
    super.dispose();
  }

  void _changed() {
    if (mounted) setState(() {});
  }

  bool get _playing =>
      widget.active && (widget.autoPlay || identical(_coordinator.owner, this));

  /// The decoder exists: playing, or paused on the frame it reached.
  bool get _started =>
      _playing || (widget.active && identical(_coordinator.held, this));

  @override
  void didUpdateWidget(DrillMediaCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    // A card that leaves the screen frees its slot; its next start begins
    // from the poster again.
    if (oldWidget.active && !widget.active) _coordinator.forget(this);
  }

  void _toggle() => identical(_coordinator.owner, this)
      ? _coordinator.release(this)
      : _coordinator.play(this);

  Widget _art(
    BuildContext context,
    FlareShared shared,
    trainer.TrainingMediaPolicy policy,
  ) {
    final theme = FlareShared.theme(context);
    if (!shared.library.allowedActionIds.contains(widget.drillId) ||
        policy.actionFor(widget.drillId) == null) {
      return Center(
        child: Text(shared.library.strings.unavailable, style: theme.label),
      );
    }
    // Same key and slot whether running or paused, so the paused frame is
    // the one that stays (no seek, no second player, no poster swap).
    return trainer.TrainingActionMedia(
      key: ValueKey('flare-action-media-${widget.drillId}'),
      actionId: widget.drillId,
      policy: policy,
      playing: _started,
      paused: !_playing,
      mirrored: widget.mirrored,
      radius: theme.radius,
      stage: theme.mediaStage,
    );
  }

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context);
    final shared = FlareShared.current;
    final policy = FlarePublicMedia.current;
    final poster = 'assets/public_posters/${widget.drillId}.webp';
    final Widget art = shared != null && policy != null
        ? _art(context, shared, policy)
        : Image.asset(
            poster,
            fit: BoxFit.contain,
            errorBuilder: (_, _, _) => const SizedBox.expand(),
          );
    return AspectRatio(
      aspectRatio: 1,
      child: Semantics(
        button: !widget.autoPlay,
        label: _playing ? s.pause : s.play,
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: widget.active && !widget.autoPlay ? _toggle : null,
          child: art,
        ),
      ),
    );
  }
}
