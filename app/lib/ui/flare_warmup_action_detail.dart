import 'dart:async';

import 'package:flutter/material.dart';
import 'package:ugk_coach/ugk_coach.dart' as coach;
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as sdk;

import '../l10n/app_localizations.dart';
import '../trainer/trainer_strings.dart';
import '../trainer/trainer_theme.dart';

/// The pinned SDK's library detail always waits for a tap. Warm-up details
/// start immediately, using the same SDK media, poster, loading and retry UI.
class FlareWarmupActionDetail extends StatefulWidget {
  const FlareWarmupActionDetail({
    super.key,
    required this.action,
    required this.config,
    required this.mediaPolicy,
    required this.theme,
  });

  final coach.PoseHubPackAction action;
  final sdk.TrainingLibraryConfig config;
  final sdk.TrainingMediaPolicy mediaPolicy;
  final sdk.TrainerTheme theme;

  @override
  State<FlareWarmupActionDetail> createState() =>
      _FlareWarmupActionDetailState();
}

class _FlareWarmupActionDetailState extends State<FlareWarmupActionDetail> {
  final _playback = sdk.DrillMediaPlaybackHandle();
  bool _playing = true;

  @override
  void dispose() {
    _playback.dispose();
    super.dispose();
  }

  void _retry(coach.PoseHubPackFile video) {
    if (_playback.isBound && _playback.mediaId == widget.action.id) {
      _playback.retry();
    } else {
      unawaited(
        widget.mediaPolicy.repository
            .ensureFileWithPriority(video)
            .then<void>((_) {}, onError: (Object _, StackTrace _) {}),
      );
    }
  }

  Widget _preview(BuildContext context, String name) {
    final action = widget.action;
    final theme = widget.theme;
    final strings = widget.config.strings;
    final mediaTheme = Theme.of(context).brightness == Brightness.dark
        ? coach.PoseHubMediaTheme.dark
        : coach.PoseHubMediaTheme.light;
    final video = action.mediaFor(mediaTheme).video;
    return Stack(
      clipBehavior: Clip.none,
      children: [
        GestureDetector(
          key: const ValueKey('library-detail-play'),
          behavior: HitTestBehavior.opaque,
          onTap: () => setState(() => _playing = !_playing),
          child: Semantics(
            button: true,
            label: '${_playing ? strings.pause : strings.play} $name',
            child: sdk.TrainingActionMedia(
              key: ValueKey('library-public-art-${action.id}'),
              actionId: action.id,
              policy: widget.mediaPolicy,
              playing: _playing,
              radius: theme.radius,
              stage: theme.mediaStage,
              playbackHandle: _playback,
              showInlineStatus: false,
            ),
          ),
        ),
        if (_playing && sdk.UgkPackedAlphaVideo.isSupported)
          Positioned(
            right: sdk.TrainerSpace.x3,
            top:
                sdk.TrainerSpace.x2 -
                sdk.TrainerMediaDownloadIndicator.visualInset,
            child: sdk.TrainerMediaDownloadIndicator(
              key: ValueKey('media-download-${action.id}/${video.sha256}'),
              state: widget.mediaPolicy.repository.watchFile(video),
              actionId: action.id,
              theme: trainerTheme(context),
              strings: trainerStrings(AppLocalizations.of(context)),
              playbackHandle: _playback,
              onRetry: () => _retry(video),
            ),
          ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final action = widget.action;
    final raw = action.raw;
    final theme = widget.theme;
    final strings = widget.config.strings;
    final display = widget.config.displayText?.call(action.id);
    final name = display?.name ?? action.nameZh;
    final equipment = sdk.PoseHubActionFacets.equipment(action);
    final cues = display?.cues ?? _textRows((raw['cues'] as Map?)?['zh']);
    final cautions =
        display?.cautions ??
        [..._textRows(raw['cautions']), ..._textRows(raw['contraindications'])];
    final muscles =
        display?.muscles ??
        raw['muscleGroupsZh'] as String? ??
        _textRows(
          raw['muscleGroups'],
        ).map((id) => sdk.poseHubMuscleLabels[id] ?? id).join('、');
    final metadata =
        display?.metadata ??
        [
          switch (raw['category']) {
            'strength' => '力量',
            'core' => '核心',
            'cardio' => '有氧',
            'stretch' => '拉伸',
            _ => '灵活',
          },
          switch (raw['level']) {
            1 => '入门',
            2 => '基础',
            _ => '进阶',
          },
          equipment.isEmpty
              ? '徒手'
              : equipment
                    .map((id) => sdk.poseHubEquipmentLabels[id] ?? '其他器械')
                    .join('/'),
          if (raw['unilateral'] == true) '左右各做',
        ].join(' · ');
    final labelWidth = display == null ? 36.0 : 60.0;
    return SafeArea(
      child: SingleChildScrollView(
        key: ValueKey('library-detail-${action.id}'),
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _preview(context, name),
            const SizedBox(height: 16),
            Text(
              name,
              style: theme.title.copyWith(
                fontSize: 22,
                fontWeight: FontWeight.w800,
                letterSpacing: -.1,
              ),
            ),
            const SizedBox(height: 4),
            Text(metadata, style: theme.label),
            const SizedBox(height: 16),
            _line(
              Icons.accessibility_new_rounded,
              strings.muscles,
              muscles,
              labelWidth,
            ),
            const SizedBox(height: 12),
            _line(
              Icons.subtitles_outlined,
              strings.cues,
              sdk.formatTrainingLibraryDetailCues(cues),
              labelWidth,
            ),
            if (cautions.isNotEmpty) ...[
              const SizedBox(height: 12),
              _line(
                Icons.healing_outlined,
                strings.cautions,
                display?.cautions == null
                    ? '${cautions.join('、')}${strings.cautionSuffix}'
                    : [
                        ...cautions,
                        strings.cautionSuffix.replaceFirst(
                          RegExp(r'^[.。]\s*'),
                          '',
                        ),
                      ].join('\n'),
                labelWidth,
                color: theme.caution,
              ),
            ],
          ],
        ),
      ),
    );
  }

  List<String> _textRows(Object? value) =>
      value is List ? value.whereType<String>().toList() : const [];

  Widget _line(
    IconData icon,
    String label,
    String text,
    double labelWidth, {
    Color? color,
  }) {
    final theme = widget.theme;
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(top: 2),
          child: Icon(icon, size: 18, color: color ?? theme.faint),
        ),
        const SizedBox(width: 8),
        SizedBox(
          width: labelWidth,
          child: Text(
            label,
            style: theme.label.copyWith(
              color: color ?? theme.muted,
              height: 1.6,
            ),
          ),
        ),
        Expanded(
          child: Text(
            text,
            style: theme.body.copyWith(
              fontSize: 15,
              height: 1.55,
              color: color,
            ),
          ),
        ),
      ],
    );
  }
}
