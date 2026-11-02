import 'package:flutter/material.dart';
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as trainer;

import '../data/flare_public_media.dart';
import '../data/flare_shared_library.dart';
import '../l10n/app_localizations.dart';

/// Only one inline demonstration plays at a time across Flare's pages.
class DrillPlaybackCoordinator extends ChangeNotifier {
  static final shared = DrillPlaybackCoordinator();
  Object? _owner;
  Object? get owner => _owner;

  void play(Object owner) {
    if (identical(_owner, owner)) return;
    _owner = owner;
    notifyListeners();
  }

  void release(Object owner) {
    if (!identical(_owner, owner)) return;
    _owner = null;
    notifyListeners();
  }

  void pauseAll() {
    if (_owner == null) return;
    _owner = null;
    notifyListeners();
  }
}

/// Public SDK action art (verified poster, then on-demand public video). The
/// SDK owns download, decoding and the poster→video handoff; Flare only says
/// whether this card should play. Tap toggles playback unless [autoPlay].
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
      ..release(this);
    super.dispose();
  }

  void _changed() {
    if (mounted) setState(() {});
  }

  bool get _playing =>
      widget.active && (widget.autoPlay || identical(_coordinator.owner, this));

  void _toggle() => identical(_coordinator.owner, this)
      ? _coordinator.release(this)
      : _coordinator.play(this);

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context);
    final shared = FlareShared.current;
    final policy = FlarePublicMedia.current;
    final poster = 'assets/public_posters/${widget.drillId}.webp';
    final Widget art = shared != null && policy != null
        ? trainer.TrainingLibraryActionArt(
            actionId: widget.drillId,
            config: shared.library,
            mediaPolicy: policy,
            theme: FlareShared.theme(context),
            playing: _playing,
            mirrored: widget.mirrored,
          )
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
