import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import '../control/learning_store.dart';
import '../data/catalog.dart';
import '../platform/scene/scene.dart';
import 'components.dart';
import 'content_pages.dart';
import 'motion_controls.dart';
import 'timer_page.dart';
import 'theme.dart';

class FlareShell extends StatefulWidget {
  const FlareShell({
    super.key,
    required this.catalog,
    required this.store,
    this.sceneController,
    this.enableScene = true,
  });
  final Catalog catalog;
  final LearningStore store;
  final SceneController? sceneController;
  final bool enableScene;
  @override
  State<FlareShell> createState() => _FlareShellState();
}

class _FlareShellState extends State<FlareShell> with WidgetsBindingObserver {
  late final SceneController _scene;
  int _tab = 0;
  bool _configured = false;
  bool _configuring = false;
  int _sceneGeneration = 0;
  bool _settings = false;
  bool _assessment = false;
  bool _timing = false;
  Drill? _drill;
  Lesson? _lesson;
  MuscleGroup? _detail;
  int _handledSelection = 0;
  int? _loopSource;
  double _lastSavedTime = -1;
  Catalog get catalog => widget.catalog;
  LearningStore get store => widget.store;

  @override
  void initState() {
    super.initState();
    _scene = widget.sceneController ?? SceneController();
    _scene.addListener(_sceneChanged);
    store.addListener(_storeChanged);
    WidgetsBinding.instance.addObserver(this);
  }

  void _storeChanged() {
    _refreshView();
  }

  void _refreshView() {
    if (!mounted) return;
    if (SchedulerBinding.instance.schedulerPhase ==
        SchedulerPhase.persistentCallbacks) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) setState(() {});
      });
    } else {
      setState(() {});
    }
  }

  void _sceneChanged() {
    if (!mounted || _configuring) return;
    if (_scene.ready && !_configured) {
      final restoredTime = store.lastTime;
      _configuring = true;
      _configured = true;
      _scene.setSpeed(store.settings.speed);
      _scene.setTime(restoredTime);
      if (store.safetyAccepted && _watchVisible) _scene.play();
      _configuring = false;
      _refreshView();
      return;
    }
    if (!_scene.playing && (_scene.time - _lastSavedTime).abs() > .001) {
      _lastSavedTime = _scene.time;
      unawaited(store.setLastTime(_scene.time));
    }
    if (_scene.selectionGeneration != _handledSelection) {
      _handledSelection = _scene.selectionGeneration;
      if (_scene.selected == null) {
        _refreshView();
        return;
      }
      final group = catalog.groupById(_scene.selected!);
      if (group != null) {
        scheduleMicrotask(() {
          if (mounted && _watchVisible && _scene.selected == group.id) {
            _openGroup(group);
          }
        });
      }
    }
    _refreshView();
  }

  bool get _watchVisible =>
      _tab == 0 &&
      _drill == null &&
      _lesson == null &&
      !_settings &&
      !_assessment &&
      !_timing;

  void _syncSceneVisibility() {
    _scene.setVisible(_watchVisible);
    if (!_watchVisible) {
      _scene.pause();
      unawaited(store.setLastTime(_scene.time));
    }
  }

  void _changeTab(int value) {
    setState(() {
      _tab = value;
      _drill = null;
      _lesson = null;
      _settings = false;
      _assessment = false;
    });
    _syncSceneVisibility();
  }

  void _openGroup(MuscleGroup group) {
    _scene.pause();
    setState(() {
      _detail = group;
    });
    _scene.select(group.id);
    _scene.setDetail(group.id);
    _syncSceneVisibility();
  }

  void _returnToMotion() {
    setState(() {
      _detail = null;
    });
    _scene.setDetail(null);
    _syncSceneVisibility();
  }

  void _swapDetailCard() {
    if (_detail == null || !_watchVisible) return;
    _syncSceneVisibility();
    _scene.setDetailModel(
      _scene.detailModel == 'motion' ? 'muscles' : 'motion',
    );
  }

  void _openDrill(Drill drill) {
    _scene.pause();
    setState(() => _drill = drill);
    _syncSceneVisibility();
  }

  void _openLesson(Lesson lesson) {
    setState(() => _lesson = lesson);
    _syncSceneVisibility();
  }

  void _showLessonMotion(Lesson lesson) {
    if (lesson.phases.isEmpty) return;
    final source = lesson.phases.first;
    setState(() {
      _tab = 0;
      _lesson = null;
      _drill = null;
      _detail = null;
      _loopSource = source;
    });
    _scene.setDetail(null);
    _scene.select(null);
    _scene.setTime(catalog.phaseTime(source));
    final next = source == 16 ? catalog.period : catalog.phaseTime(source + 1);
    _scene.setLoop(catalog.phaseTime(source), next);
    _syncSceneVisibility();
    _scene.play();
  }

  Future<void> _result(Future<bool> operation, [String? message]) async {
    final success = await operation;
    if (!mounted) return;
    if (message != null || !success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(success ? message! : context.strings.saveFailed),
        ),
      );
    }
  }

  void _back() {
    if (_timing) return;
    setState(() {
      if (_drill != null) {
        _drill = null;
      } else if (_lesson != null) {
        _lesson = null;
      } else if (_settings) {
        _settings = false;
      } else if (_assessment) {
        _assessment = false;
      } else if (_detail != null) {
        _detail = null;
        _scene.setDetail(null);
      } else {
        _tab = 0;
      }
    });
    _syncSceneVisibility();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state != AppLifecycleState.resumed) {
      _scene.pause();
      // An embedded Web scene owns document visibility. Host focus/lifecycle
      // changes can otherwise stop a canvas that is still on screen.
      // Navigation still uses _syncSceneVisibility to hide an offstage scene.
      if (!kIsWeb && state != AppLifecycleState.inactive) {
        _scene.setVisible(false);
      }
      unawaited(store.setLastTime(_scene.time));
    } else {
      store.refreshDate();
      _syncSceneVisibility();
    }
  }

  @override
  void dispose() {
    _scene.removeListener(_sceneChanged);
    store.removeListener(_storeChanged);
    WidgetsBinding.instance.removeObserver(this);
    if (widget.sceneController == null) _scene.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final s = context.strings;
    if (!store.safetyAccepted) {
      return WelcomePage(
        onEnter: (assessment) async {
          final accepted = await store.acknowledgeSafety();
          if (!mounted || !accepted) return;
          setState(() => _assessment = assessment);
        },
      );
    }
    final drill = _drill;
    final lesson = _lesson;
    final canBack =
        drill != null ||
        lesson != null ||
        _settings ||
        _assessment ||
        _detail != null ||
        _tab != 0;
    return PopScope(
      canPop: !canBack && !_timing,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop && !_timing) _back();
      },
      child: DecoratedBox(
        // The stage surface is the supplied graphite token, shared by the
        // floating header, transparent 3D view and compact transport.
        decoration: const BoxDecoration(
          gradient: RadialGradient(
            center: Alignment(0, -.2),
            radius: 1.05,
            colors: [Color(0xff2b2b31), Color(0xff151518), Color(0xff08080a)],
            stops: [0, .52, 1],
          ),
        ),
        child: Scaffold(
          backgroundColor: _watchVisible
              ? Colors.transparent
              : FlareColors.background,
          body: SafeArea(
            child: Column(
              children: [
                if (store.storageError != null)
                  MaterialBanner(
                    content: Text(
                      store.corruptState ? s.storageReadFailed : s.saveFailed,
                    ),
                    actions: [
                      if (!store.corruptState)
                        TextButton(
                          onPressed: () => _result(store.retrySave()),
                          child: Text(s.retry),
                        ),
                      if (store.corruptState)
                        TextButton(
                          onPressed: () {
                            setState(() => _settings = true);
                            _syncSceneVisibility();
                          },
                          child: Text(s.settings),
                        ),
                    ],
                  ),
                Expanded(
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      Offstage(
                        offstage: !_watchVisible,
                        child: _watchPage(context),
                      ),
                      if (!_watchVisible && !_timing && drill != null)
                        DrillDetailPage(
                          drill: drill,
                          onBack: _back,
                          added: store.todayIds.contains(drill.id),
                          onAdd: () => _result(store.addToToday(drill.id)),
                          onStart: () {
                            setState(() => _timing = true);
                            _syncSceneVisibility();
                          },
                        ),
                      if (_timing && drill != null)
                        TrainingTimerPage(
                          drill: drill,
                          store: store,
                          onClose: () {
                            setState(() => _timing = false);
                            _syncSceneVisibility();
                          },
                        ),
                      if (!_watchVisible &&
                          !_timing &&
                          drill == null &&
                          lesson != null)
                        LessonPage(
                          catalog: catalog,
                          lesson: lesson,
                          store: store,
                          onBack: _back,
                          onDrill: _openDrill,
                          onWatch: () => _showLessonMotion(lesson),
                          onComplete: () => _result(
                            store.completeLesson(lesson.id),
                            s.lessonCompleted,
                          ),
                        ),
                      if (_settings && !_timing && drill == null)
                        _settingsPage(context),
                      if (_assessment && !_timing && drill == null)
                        AssessmentPage(
                          initialGrades: store.assessmentGrades,
                          onBack: _back,
                          onSave: (grades) async {
                            final success = await store.recordAssessment(
                              grades,
                            );
                            if (!mounted || !success) return;
                            setState(() {
                              _assessment = false;
                              _tab = 2;
                            });
                            _syncSceneVisibility();
                          },
                          onSkip: () async {
                            final success = await store.skipAssessment();
                            if (!mounted || !success) return;
                            setState(() => _assessment = false);
                            _syncSceneVisibility();
                          },
                        ),
                      if (!_watchVisible &&
                          !_settings &&
                          !_assessment &&
                          !_timing &&
                          drill == null &&
                          lesson == null)
                        switch (_tab) {
                          1 => LibraryPage(
                            catalog: catalog,
                            store: store,
                            onBack: _back,
                            onDrill: _openDrill,
                            onRemove: (id) =>
                                _result(store.removeFromToday(id)),
                          ),
                          2 => PathPage(
                            catalog: catalog,
                            store: store,
                            onBack: _back,
                            onLesson: _openLesson,
                            onGate: (id, passed) =>
                                _result(store.reportGate(id, passed)),
                            onAssessment: () =>
                                setState(() => _assessment = true),
                          ),
                          _ => ProgressPage(
                            catalog: catalog,
                            store: store,
                            onBack: _back,
                            onDrill: _openDrill,
                          ),
                        },
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _watchPage(BuildContext context) {
    final s = context.strings;
    final phase = catalog.phaseBySource(_scene.phase) ?? catalog.phases.first;
    final detail = _detail;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: EdgeInsets.fromLTRB(
            12,
            (54 - MediaQuery.viewPaddingOf(context).top).clamp(8, 54),
            12,
            10,
          ),
          child: Row(
            children: [
              _roundControl(
                label: detail == null ? s.path : s.returnToMotion,
                icon: detail == null ? Icons.route_outlined : Icons.arrow_back,
                onTap: detail == null ? () => _changeTab(2) : _returnToMotion,
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Text(
                      s.motionBrand,
                      style: const TextStyle(
                        color: Color(0xff73737b),
                        fontSize: 11,
                        height: 1.25,
                        letterSpacing: .4,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      detail?.label ?? s.fullLoop,
                      style: const TextStyle(
                        fontSize: 15,
                        height: 1.35,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              _roundControl(
                label: s.more,
                icon: Icons.more_horiz,
                onTap: _showMore,
              ),
            ],
          ),
        ),
        Expanded(
          flex: detail == null ? 5 : 3,
          child: Stack(
            fit: StackFit.expand,
            children: [
              widget.enableScene
                  ? SceneView(
                      key: ValueKey(_sceneGeneration),
                      controller: _scene,
                    )
                  : const ColoredBox(color: FlareColors.background),
              if (detail != null)
                Positioned(
                  left: 12,
                  bottom: 31,
                  width: 86,
                  height: 108,
                  child: Semantics(
                    label: _scene.detailModel == 'motion'
                        ? s.switchToMuscles
                        : s.switchToMotion,
                    button: true,
                    onTap: _swapDetailCard,
                    child: ExcludeSemantics(
                      child: TextButton(
                        key: const ValueKey('detail-card'),
                        onPressed: _swapDetailCard,
                        style: TextButton.styleFrom(
                          padding: EdgeInsets.zero,
                          minimumSize: const Size(86, 108),
                          backgroundColor: const Color(0x01171922),
                          overlayColor: const Color(0x22ffffff),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        child: const SizedBox.expand(),
                      ),
                    ),
                  ),
                ),
              if (detail == null)
                Positioned(
                  right: 16,
                  bottom: 18,
                  child: TextButton.icon(
                    onPressed: _scene.playing ? _scene.pause : _showMuscles,
                    style: TextButton.styleFrom(
                      foregroundColor: const Color(0xffa4a4ae),
                      backgroundColor: const Color(0xff18181c),
                      side: const BorderSide(
                        color: Color(0xff38383e),
                        width: .5,
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      minimumSize: const Size(0, 44),
                      shape: const StadiumBorder(),
                    ),
                    icon: Icon(
                      _scene.playing ? Icons.pause : Icons.touch_app_outlined,
                      size: 12,
                    ),
                    label: Text(
                      _scene.playing ? s.playingHint : s.pausedHint,
                      style: const TextStyle(fontSize: 11),
                    ),
                  ),
                ),
            ],
          ),
        ),
        if (_scene.errorCode != null)
          Padding(
            padding: const EdgeInsets.all(8),
            child: Row(
              children: [
                Expanded(child: Text(s.sceneFailed)),
                TextButton(
                  onPressed: () {
                    _scene.pause();
                    setState(() {
                      _configured = false;
                      _sceneGeneration++;
                    });
                  },
                  child: Text(s.retry),
                ),
              ],
            ),
          ),
        if (detail == null) ...[
          _transport(context, phase),
        ] else ...[
          SizedBox(
            height: 48,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                TextButton(
                  onPressed: () => _scene.setCamera('front'),
                  child: Text(s.front),
                ),
                TextButton(
                  onPressed: () => _scene.setCamera('back'),
                  child: Text(s.back),
                ),
                IconButton(
                  onPressed: _scene.reset,
                  tooltip: s.resetView,
                  icon: const Icon(Icons.center_focus_strong),
                ),
              ],
            ),
          ),
          Expanded(
            flex: 4,
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    detail.label,
                    style: TextStyle(
                      fontSize: 25,
                      fontWeight: FontWeight.w700,
                      color: Color(detail.colorValue),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    switch (phase
                        .muscle(detail.id)
                        ?.resolvedSide(catalog.supportFor(phase.source))) {
                      'left' => s.leftSide,
                      'right' => s.rightSide,
                      _ => s.bothSides,
                    },
                    style: const TextStyle(
                      color: FlareColors.muted,
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(height: 8),
                  SurfaceCard(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          s.whyHere,
                          style: const TextStyle(
                            color: FlareColors.muted,
                            fontSize: 12,
                          ),
                        ),
                        const SizedBox(height: 8),
                        BodyText(phase.muscle(detail.id)?.why ?? detail.role),
                        const SizedBox(height: 8),
                        BodyText(phase.caption, color: FlareColors.muted),
                      ],
                    ),
                  ),
                  SectionTitle(s.secondary),
                  Wrap(
                    spacing: 8,
                    runSpacing: 6,
                    children: [
                      for (final item in catalog.synergists(phase, detail.id))
                        if (catalog.groupById(item.id)
                            case final MuscleGroup group)
                          ActionChip(
                            label: Text(group.label),
                            onPressed: () => _openGroup(group),
                          ),
                    ],
                  ),
                  SectionTitle(s.relatedDrills),
                  TierSelector(
                    value: store.settings.tier,
                    onChanged: (tier) =>
                        _result(store.updateSettings(tier: tier)),
                  ),
                  const SizedBox(height: 12),
                  for (final drill in catalog.drillsFor(
                    detail.id,
                    tier: store.settings.tier,
                  ))
                    DrillTile(drill: drill, onTap: () => _openDrill(drill)),
                  BodyText(s.teachingNote, color: FlareColors.muted),
                  if (detail.deep)
                    BodyText(
                      _scene.detailModel == 'muscles'
                          ? s.deepNote
                          : s.deepMotionNote,
                      color: FlareColors.muted,
                    ),
                  if (detail.note != null) ...[
                    SectionTitle(s.sourceNote),
                    BodyText(detail.note!),
                  ],
                  const SizedBox(height: 16),
                  OutlinedButton.icon(
                    onPressed: _returnToMotion,
                    icon: const Icon(Icons.arrow_back),
                    label: Text(s.returnToMotion),
                  ),
                ],
              ),
            ),
          ),
        ],
      ],
    );
  }

  Widget _transport(BuildContext context, Phase phase) {
    final s = context.strings;
    return Padding(
      padding: EdgeInsets.fromLTRB(
        16,
        0,
        16,
        (30 - MediaQuery.viewPaddingOf(context).bottom).clamp(8, 30),
      ),
      child: SizedBox(
        height: 56,
        child: Row(
          children: [
            _roundControl(
              label: _scene.playing ? s.pause : s.play,
              icon: _scene.playing
                  ? Icons.pause_rounded
                  : Icons.play_arrow_rounded,
              diameter: 48,
              solid: !_scene.playing,
              onTap: () => _scene.playing ? _scene.pause() : _scene.play(),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(top: 2),
                    child: Row(
                      children: [
                        Text(
                          phase.source.toString().padLeft(2, '0'),
                          style: const TextStyle(
                            color: FlareColors.accent,
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(width: 5),
                        Expanded(
                          child: Text(
                            phase.name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        Text(
                          '${_scene.time.toStringAsFixed(1)} / ${catalog.period.toStringAsFixed(1)} s',
                          style: const TextStyle(
                            fontSize: 11,
                            color: Color(0xff73737b),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Expanded(
                    child: MotionTimeline(
                      catalog: catalog,
                      time: _scene.time,
                      phase: phase.source,
                      onSeek: _seek,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _seek(double time) {
    setState(() => _loopSource = null);
    _scene.setLoop(null, null);
    _scene.setTime(time);
  }

  Widget _roundControl({
    required String label,
    required IconData icon,
    required VoidCallback onTap,
    double diameter = 36,
    bool solid = false,
  }) => Semantics(
    label: label,
    button: true,
    child: SizedBox(
      width: diameter < 44 ? 44 : diameter,
      height: diameter < 44 ? 44 : diameter,
      child: Material(
        type: MaterialType.transparency,
        child: InkResponse(
          onTap: onTap,
          radius: diameter / 2 + 6,
          child: ExcludeSemantics(
            child: Center(
              child: Container(
                width: diameter,
                height: diameter,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: solid ? Colors.white : const Color(0xff18181c),
                  border: Border.all(color: const Color(0xff3b3b42), width: .5),
                ),
                child: Icon(
                  icon,
                  size: diameter == 48 ? 23 : 18,
                  color: solid
                      ? const Color(0xff111113)
                      : const Color(0xffebebef),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );

  Future<void> _showMore() async {
    final s = context.strings;
    final wasPlaying = _scene.playing;
    _scene.pause();
    final phase = catalog.phaseBySource(_scene.phase) ?? catalog.phases.first;
    final value = await showModalBottomSheet<String>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      backgroundColor: FlareColors.surface,
      builder: (sheetContext) => SafeArea(
        child: ConstrainedBox(
          constraints: BoxConstraints(
            maxHeight: MediaQuery.sizeOf(context).height * .82,
          ),
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  s.more,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 12),
                for (final entry in [
                  ('library', s.library, Icons.fitness_center_outlined),
                  ('progress', s.progress, Icons.bar_chart_rounded),
                  ('settings', s.settings, Icons.tune_rounded),
                ])
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: Icon(entry.$3, size: 20),
                    title: Text(entry.$2),
                    trailing: const Icon(Icons.chevron_right, size: 18),
                    onTap: () => Navigator.pop(sheetContext, entry.$1),
                  ),
                const Divider(height: 24),
                SectionTitle(s.speedLabel),
                Wrap(
                  spacing: 8,
                  children: [
                    for (final speed in [.25, .5, 1.0])
                      ChoiceChip(
                        label: Text('${speed == 1 ? '1' : speed}×'),
                        selected: _scene.speed == speed,
                        onSelected: (_) =>
                            Navigator.pop(sheetContext, 'speed:$speed'),
                      ),
                  ],
                ),
                SectionTitle(s.phaseLabel),
                Wrap(
                  spacing: 8,
                  runSpacing: 6,
                  children: [
                    for (final item in catalog.phases)
                      Semantics(
                        label: '${item.source} ${item.name}',
                        child: ActionChip(
                          label: Text(item.source.toString().padLeft(2, '0')),
                          onPressed: () => Navigator.pop(
                            sheetContext,
                            'phase:${item.source}',
                          ),
                        ),
                      ),
                  ],
                ),
                TextButton.icon(
                  icon: const Icon(Icons.repeat_rounded, size: 18),
                  label: Text(
                    _loopSource == null ? s.practiceLoop : s.restoreLoop,
                  ),
                  onPressed: () => Navigator.pop(sheetContext, 'loop'),
                ),
                SectionTitle(s.viewLabel),
                Wrap(
                  spacing: 8,
                  children: [
                    for (final item in [
                      ('front', s.front),
                      ('back', s.back),
                      ('side', s.side),
                    ])
                      OutlinedButton(
                        onPressed: () =>
                            Navigator.pop(sheetContext, 'camera:${item.$1}'),
                        child: Text(item.$2),
                      ),
                    OutlinedButton(
                      onPressed: () => Navigator.pop(sheetContext, 'reset'),
                      child: Text(s.resetView),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                TextButton(
                  onPressed: () => Navigator.pop(sheetContext, 'muscles'),
                  child: Text(s.muscles),
                ),
              ],
            ),
          ),
        ),
      ),
    );
    if (!mounted) return;
    if (value == null) {
      if (wasPlaying && _watchVisible && _detail == null) _scene.play();
      return;
    }
    switch (value) {
      case 'library':
        _changeTab(1);
      case 'progress':
        _changeTab(3);
      case 'settings':
        setState(() => _settings = true);
        _syncSceneVisibility();
      case 'loop':
        _toggleLoop(phase.source);
      case 'reset':
        _scene.reset();
        if (wasPlaying && _detail == null) _scene.play();
      case 'muscles':
        await _showMuscles();
      default:
        if (value.startsWith('speed:')) {
          final speed = double.parse(value.substring(6));
          _scene.setSpeed(speed);
          unawaited(store.updateSettings(speed: speed));
        } else if (value.startsWith('phase:')) {
          _seek(catalog.phaseTime(int.parse(value.substring(6))));
        } else if (value.startsWith('camera:')) {
          _scene.setCamera(value.substring(7));
        }
        if (wasPlaying &&
            _detail == null &&
            (value.startsWith('speed:') || value.startsWith('camera:'))) {
          _scene.play();
        }
    }
  }

  void _toggleLoop(int source) {
    if (_loopSource != null) {
      setState(() => _loopSource = null);
      _scene.setLoop(null, null);
      return;
    }
    setState(() => _loopSource = source);
    final start = catalog.phaseTime(source);
    final end = source == 16 ? catalog.period : catalog.phaseTime(source + 1);
    _scene.setTime(start);
    _scene.setLoop(start, end);
    _scene.play();
  }

  Future<void> _showMuscles() async {
    _scene.pause();
    final s = context.strings;
    final phase = catalog.phaseBySource(_scene.phase) ?? catalog.phases.first;
    final primary = phase.primary.map((item) => item.id).toSet();
    final groups = [
      ...catalog.groups.where((item) => primary.contains(item.id)),
      ...catalog.groups.where((item) => !primary.contains(item.id)),
    ];
    final group = await showModalBottomSheet<MuscleGroup>(
      context: context,
      showDragHandle: true,
      isScrollControlled: true,
      backgroundColor: FlareColors.surface,
      builder: (sheetContext) => SafeArea(
        child: SizedBox(
          height: MediaQuery.sizeOf(context).height * .72,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Text(
                  s.muscles,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(height: 10),
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  children: [
                    for (final item in groups)
                      ListTile(
                        leading: CircleAvatar(
                          radius: 5,
                          backgroundColor: Color(item.colorValue),
                        ),
                        title: Text(item.label),
                        subtitle: primary.contains(item.id)
                            ? Text(s.primary)
                            : null,
                        trailing: const Icon(Icons.chevron_right, size: 18),
                        onTap: () => Navigator.pop(sheetContext, item),
                      ),
                    Padding(
                      padding: const EdgeInsets.all(8),
                      child: BodyText(s.teachingNote, color: FlareColors.muted),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
    if (mounted && group != null) _openGroup(group);
  }

  Widget _settingsPage(BuildContext context) {
    final s = context.strings;
    return Column(
      children: [
        PageHeader(title: s.settings, onBack: _back),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
            children: [
              SectionTitle(s.speedLabel),
              SegmentedButton<double>(
                segments: const [
                  ButtonSegment(value: .25, label: Text('0.25×')),
                  ButtonSegment(value: .5, label: Text('0.5×')),
                  ButtonSegment(value: 1.0, label: Text('1×')),
                ],
                selected: {store.settings.speed},
                onSelectionChanged: (values) {
                  _scene.setSpeed(values.first);
                  unawaited(store.updateSettings(speed: values.first));
                },
              ),
              SectionTitle(s.qualityLabel),
              Wrap(
                spacing: 8,
                children: [
                  for (final item in [
                    ('battery', s.battery),
                    ('balanced', s.balanced),
                    ('high', s.high),
                  ])
                    OutlinedButton(
                      onPressed: () => _scene.setQuality(item.$1),
                      child: Text(item.$2),
                    ),
                ],
              ),
              SectionTitle(s.aboutTitle),
              BodyText(s.aboutBody),
              SectionTitle(s.privacyTitle),
              BodyText(s.privacyBody),
              SectionTitle(s.creditsTitle),
              BodyText(s.creditsBody),
              const SizedBox(height: 20),
              OutlinedButton.icon(
                onPressed: () async {
                  final backup = jsonEncode({
                    'format': 'flare.local.backup.v1',
                    'exportedAt': DateTime.now().toUtc().toIso8601String(),
                    'safetyAccepted': store.safetyAccepted,
                    'settings': store.settings.toJson(),
                    'lastTime': store.lastTime,
                    'todayIds': store.todayIds,
                    'sessions': store.sessions
                        .map((session) => session.toJson())
                        .toList(),
                    'completedLessonIds': store.completedLessonIds.toList(),
                    'gateReports': store.gateReports,
                    'assessmentGrades': store.assessmentGrades,
                  });
                  await Clipboard.setData(ClipboardData(text: backup));
                  if (!context.mounted) return;
                  ScaffoldMessenger.of(
                    context,
                  ).showSnackBar(SnackBar(content: Text(s.backupCopied)));
                },
                icon: const Icon(Icons.copy),
                label: Text(s.exportBackup),
              ),
              const SizedBox(height: 14),
              OutlinedButton(
                onPressed: () => showLicensePage(context: context),
                child: Text(s.creditsTitle),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
