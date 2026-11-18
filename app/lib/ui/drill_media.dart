import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as trainer;

import '../data/flare_public_media.dart';
import '../data/flare_shared_library.dart';
import '../data/flare_v5_drill.dart';
import '../l10n/app_localizations.dart';
import 'drill_decoder_pool.dart';
import 'flare_action_artwork.dart';
import 'flare_v5_media.dart';
import 'motion.dart';

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
  bool _notificationPending = false;
  Object? get owner => _owner;

  /// The last card paused on its frame (decoder kept, not playing).
  Object? get held => _held;

  void play(Object owner) {
    if (identical(_owner, owner)) return;
    if (_owner != null) _held = _owner;
    if (identical(_held, owner)) _held = null;
    _owner = owner;
    _notify();
  }

  /// Pause [owner] where it is.
  void release(Object owner) {
    if (!identical(_owner, owner)) return;
    _owner = null;
    _held = owner;
    _notify();
  }

  /// [owner] is gone: free its slot entirely.
  void forget(Object owner) {
    final changed = identical(_owner, owner) || identical(_held, owner);
    if (identical(_owner, owner)) _owner = null;
    if (identical(_held, owner)) _held = null;
    if (changed) _notify();
  }

  void pauseAll() {
    if (_owner == null) return;
    _held = _owner;
    _owner = null;
    _notify();
  }

  void _notify() {
    // A leaving card releases its slot during dependency updates/unmount.
    // Other cards may be siblings in the same build, so notify after it ends.
    if (SchedulerBinding.instance.schedulerPhase ==
        SchedulerPhase.persistentCallbacks) {
      if (_notificationPending) return;
      _notificationPending = true;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _notificationPending = false;
        notifyListeners();
      });
    } else {
      notifyListeners();
    }
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
    this.thumbnail = false,
    this.sceneSpeed = .5,
  });
  final String drillId;
  final bool active;
  final bool mirrored;
  final bool autoPlay;
  final double sceneSpeed;

  /// Use only the catalog thumbnail, without starting a media decoder.
  final bool thumbnail;
  @override
  State<DrillMediaCard> createState() => _DrillMediaCardState();
}

class _DrillMediaCardState extends State<DrillMediaCard>
    with WidgetsBindingObserver {
  final _coordinator = DrillPlaybackCoordinator.shared;
  bool _pageActive = true;
  bool _foreground = true;
  bool _autoRequested = false;
  trainer.TrainingMediaPolicy? _sourcePolicy;
  trainer.TrainingMediaPolicy? _decoderPolicy;

  @override
  void initState() {
    super.initState();
    final lifecycle = WidgetsBinding.instance.lifecycleState;
    _foreground = lifecycle == null || lifecycle == AppLifecycleState.resumed;
    WidgetsBinding.instance.addObserver(this);
    _coordinator.addListener(_changed);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _pageActive =
        FlarePageActivity.of(context) &&
        TickerMode.valuesOf(context).enabled &&
        (ModalRoute.isCurrentOf(context) ?? true);
    _syncActivity();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _coordinator
      ..removeListener(_changed)
      ..forget(this);
    super.dispose();
  }

  void _changed() {
    if (mounted) setState(() {});
  }

  bool get _active => widget.active && _pageActive && _foreground;

  bool get _playing => _active && identical(_coordinator.owner, this);

  /// The decoder exists: playing, or paused on the frame it reached.
  bool get _started =>
      _playing || (_active && identical(_coordinator.held, this));

  @override
  void didUpdateWidget(DrillMediaCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.drillId != widget.drillId) {
      _coordinator.forget(this);
      _autoRequested = false;
    }
    if (!widget.autoPlay) _autoRequested = false;
    _syncActivity();
  }

  void _syncActivity() {
    if (!_active) {
      _autoRequested = false;
      _coordinator.forget(this);
    } else if (widget.autoPlay && !_autoRequested) {
      _autoRequested = true;
      // Auto-play uses the same two-slot pool and never bypasses its owner.
      _coordinator.play(this);
    }
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    final foreground = state == AppLifecycleState.resumed;
    if (foreground == _foreground) return;
    setState(() => _foreground = foreground);
    _syncActivity();
  }

  trainer.TrainingMediaPolicy _boundedPolicy(
    trainer.TrainingMediaPolicy source,
  ) {
    if (!identical(source, _sourcePolicy)) {
      _sourcePolicy = source;
      _decoderPolicy = trainer.TrainingMediaPolicy(
        repository: DrillDecoderRepository(source.repository),
        posterAssetRoot: source.posterAssetRoot,
        prefetchBeforeTraining: source.prefetchBeforeTraining,
      );
    }
    return _decoderPolicy!;
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
      policy: _boundedPolicy(policy),
      playing: _started,
      paused: !_playing,
      mirrored: widget.mirrored,
      radius: theme.radius,
      stage: theme.mediaStage,
    );
  }

  Widget _v5Art(BuildContext context) {
    final theme = FlareShared.theme(context);
    final poster = trainer.TrainerPoster(
      asset: flareV5PosterAsset,
      mirrored: widget.mirrored,
      radius: theme.radius,
      stageColor: theme.mediaStage,
    );
    if (!_started) return poster;
    return ClipRRect(
      borderRadius: BorderRadius.circular(theme.radius),
      child: FlareV5Media(
        speed: widget.sceneSpeed,
        playing: _playing,
        mirrored: widget.mirrored,
        fallback: poster,
        background: theme.mediaStage,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isV5 = widget.drillId == flareV5DrillId;
    if (widget.thumbnail) {
      return FlareActionArtwork(
        actionId: widget.drillId,
        thumbnail: true,
        fallback: Image.asset(
          FlarePublicMedia.thumbnailAssetFor(widget.drillId),
          fit: BoxFit.contain,
          excludeFromSemantics: true,
          errorBuilder: (_, _, _) => Image.asset(
            '${FlarePublicMedia.posterRoot}${widget.drillId}.webp',
            fit: BoxFit.contain,
            excludeFromSemantics: true,
            errorBuilder: (_, _, _) => const SizedBox.expand(),
          ),
        ),
      );
    }
    final s = AppLocalizations.of(context);
    final shared = FlareShared.current;
    final policy = FlarePublicMedia.of(context);
    final poster = '${FlarePublicMedia.posterRoot}${widget.drillId}.webp';
    final Widget art = isV5
        ? _v5Art(context)
        : shared != null && policy != null
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
          onTap: _active && !widget.autoPlay ? _toggle : null,
          child: art,
        ),
      ),
    );
  }
}
