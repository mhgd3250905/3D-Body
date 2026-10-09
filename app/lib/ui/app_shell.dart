import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import '../control/learning_store.dart';
import '../data/catalog.dart';
import '../data/muscle_knowledge.dart';
import '../platform/scene/scene.dart';
import 'components.dart';
import 'content_pages.dart';
import 'loader_mark.dart';
import 'motion_controls.dart';
import 'motion.dart';
import 'timer_page.dart';
import 'theme.dart';
import 'theme_fade.dart';

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
  DateTime? _lastAutoRestart;
  bool _settings = false;
  bool _assessment = false;
  bool _timing = false;
  Drill? _drill;
  Lesson? _lesson;
  MuscleGroup? _detail;
  int _handledSelection = 0;
  double _lastSavedTime = -1;
  String _quality = 'balanced';
  String? _sceneTheme;
  String? _stageKey;
  double _stageArea = 0, _sentInset = -1;
  bool _insetSent = false;
  bool _holdWatch = false;

  /// One sheet at a time: a quick double tap must not stack two sheets.
  bool _sheetOpen = false;
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

  /// A fresh WebView; [_sceneChanged] restores time, inset and detail once it
  /// reports ready.
  void _restartScene() {
    _scene.pause();
    setState(() {
      _configured = false;
      _sceneGeneration++;
    });
  }

  void _sceneChanged() {
    if (!mounted || _configuring) return;
    if (_scene.errorCode == SceneController.processTerminated) {
      // iOS dropped the WebContent process. Restart quietly, but only once a
      // minute so a scene that keeps crashing still surfaces its error card.
      final now = DateTime.now();
      final last = _lastAutoRestart;
      if (last == null || now.difference(last) > const Duration(minutes: 1)) {
        _lastAutoRestart = now;
        scheduleMicrotask(() {
          if (mounted &&
              _scene.errorCode == SceneController.processTerminated) {
            _restartScene();
          }
        });
        return;
      }
    }
    if (_scene.ready && !_configured) {
      final restoredTime = store.lastTime;
      final restoredModel = _scene.detailModel;
      _configuring = true;
      _configured = true;
      // A replacement WebView has no viewport state, even when its size is
      // unchanged. Install the inset before seek/play can frame the new view.
      _sentInset = _viewInsetFor(context, _detail != null);
      _insetSent = true;
      _scene.setViewInset(_sentInset, animate: false);
      _scene.setSpeed(store.settings.speed);
      if (_sceneTheme != null) _scene.setTheme(_sceneTheme!);
      _scene.setTime(restoredTime);
      if (_detail case final group?) {
        _scene.setDetail(group.id);
        _scene.setDetailModel(restoredModel);
      } else if (store.safetyAccepted && _watchVisible) {
        _scene.play();
      }
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
    // Inset first, so the scene frames the athlete above the panel in the
    // same glide that opens the detail.
    _sentInset = _viewInsetFor(context, true);
    _scene.setViewInset(_sentInset);
    _scene.setDetail(group.id);
    _syncSceneVisibility();
  }

  void _returnToMotion() {
    setState(() {
      _detail = null;
    });
    _sentInset = _viewInsetFor(context, false);
    _scene.setViewInset(_sentInset);
    _scene.setDetail(null);
    _syncSceneVisibility();
  }

  void _swapDetailCard() {
    if (_detail == null || !_watchVisible) return;
    FlareHaptics.light();
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

  /// Training opens on a scene choice: no equipment, at home, or at the gym,
  /// each one this group's drill for that tier. The tier used last (from
  /// settings) is marked so the usual pick is one tap.
  Future<void> _chooseDrillScene(MuscleGroup group) async {
    if (_sheetOpen) return;
    _sheetOpen = true;
    try {
      final s = context.strings;
      final usual = store.settings.tier;
      final options =
          [
                ('A', s.sceneNone, s.sceneNoneHint),
                ('B', s.sceneHome, s.sceneHomeHint),
                ('C', s.sceneGym, s.sceneGymHint),
              ]
              .map(
                (o) => (o, catalog.drillsFor(group.id, tier: o.$1).firstOrNull),
              )
              .where((e) => e.$2 != null)
              .toList();
      if (options.isEmpty) return;
      final picked = await showModalBottomSheet<Drill>(
        context: context,
        sheetAnimationStyle: FlareMotion.sheetStyle(context),
        isScrollControlled: true,
        builder: (sheetContext) => SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(8, 0, 8, 14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Eyebrow(s.chooseScene),
                      const SizedBox(height: 4),
                      Semantics(
                        header: true,
                        child: Text(
                          s.trainGroup(group.label),
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                for (final (i, entry) in options.indexed)
                  FadeSlideIn(
                    delay: Duration(milliseconds: 40 * i),
                    offset: 8,
                    child: _SceneOption(
                      key: ValueKey('scene-${entry.$1.$1}'),
                      label: entry.$1.$2,
                      hint: entry.$1.$3,
                      drill: entry.$2!,
                      usual: entry.$1.$1 == usual,
                      onTap: () {
                        FlareHaptics.selection();
                        Navigator.pop(sheetContext, entry.$2);
                      },
                    ),
                  ),
              ],
            ),
          ),
        ),
      );
      if (picked != null && mounted) _openDrill(picked);
    } finally {
      _sheetOpen = false;
    }
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
    });
    _sentInset = _viewInsetFor(context, false);
    _scene.setViewInset(_sentInset);
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
    if (_drill == null &&
        _lesson == null &&
        !_settings &&
        !_assessment &&
        _detail != null) {
      _returnToMotion();
      return;
    }
    setState(() {
      if (_drill != null) {
        _drill = null;
      } else if (_lesson != null) {
        _lesson = null;
      } else if (_settings) {
        _settings = false;
      } else if (_assessment) {
        _assessment = false;
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
    // Depend on the theme so an appearance switch repaints every page.
    final theme = Theme.of(context).brightness == Brightness.light
        ? 'light'
        : 'dark';
    if (theme != _sceneTheme) {
      // The first appearance is applied as is; later switches fade in step
      // with the app's whole-screen dissolve.
      final duration = _sceneTheme == null
          ? Duration.zero
          : FlareMotion.of(context, FlareMotion.theme);
      _sceneTheme = theme;
      _scene.setTheme(theme, duration: duration);
    }
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
    final route = _route(context);
    if (route.$1 != _stageKey) {
      // Keep the live stage on screen while a page slides over or off it.
      if (_stageKey == 'watch' || route.$1 == 'watch') _holdWatch = true;
      _stageKey = route.$1;
    }
    return PopScope(
      canPop: !canBack && !_timing,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop && !_timing) _back();
      },
      child: DecoratedBox(
        // The stage surface is the supplied graphite token, shared by the
        // floating header, transparent 3D view and compact transport.
        decoration: BoxDecoration(
          gradient: RadialGradient(
            center: Alignment(0, -.2),
            radius: 1.05,
            colors: FlareColors.stage,
            stops: [0, .52, 1],
          ),
        ),
        child: Scaffold(
          backgroundColor: _watchVisible || _holdWatch
              ? Colors.transparent
              : FlareColors.background,
          // Pages own their top inset: most sit below the status bar, the
          // drill page lets its picture run underneath it.
          body: SafeArea(
            top: false,
            child: Column(
              children: [
                if (store.storageError != null)
                  SafeArea(
                    bottom: false,
                    child: _StorageNotice(
                      message: store.corruptState
                          ? s.storageReadFailed
                          : s.saveFailed,
                      action: store.corruptState ? s.settings : s.retry,
                      onAction: store.corruptState
                          ? () {
                              setState(() => _settings = true);
                              _syncSceneVisibility();
                            }
                          : () => _result(store.retrySave()),
                    ),
                  ),
                Expanded(
                  child: MediaQuery.removePadding(
                    context: context,
                    removeTop: store.storageError != null,
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        Offstage(
                          offstage: !_watchVisible && !_holdWatch,
                          child: SafeArea(
                            bottom: false,
                            child: _watchPage(context),
                          ),
                        ),
                        FlareStage(
                          pageKey: route.$1,
                          depth: route.$2,
                          modal: route.$3,
                          onSettled: () {
                            if (mounted && _holdWatch) {
                              setState(() => _holdWatch = false);
                            }
                          },
                          onSwipeBack: canBack && !_timing && route.$4 != null
                              ? _back
                              : null,
                          child:
                              route.$4 == null || route.$1.startsWith('drill:')
                              ? route.$4
                              : SafeArea(bottom: false, child: route.$4!),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  /// The page the shell shows now: its key, depth, whether it is modal, and
  /// the page itself (null is the 3D stage underneath).
  (String, int, bool, Widget?) _route(BuildContext context) {
    final s = context.strings;
    final drill = _drill;
    final lesson = _lesson;
    if (_timing && drill != null) {
      return (
        'timer:${drill.id}',
        9,
        true,
        TrainingTimerPage(
          drill: drill,
          store: store,
          onClose: () {
            setState(() => _timing = false);
            _syncSceneVisibility();
          },
        ),
      );
    }
    if (drill != null) {
      return (
        'drill:${drill.id}',
        lesson != null ? 3 : 2,
        false,
        DrillDetailPage(
          drill: drill,
          group: catalog.groupById(drill.groupId),
          onBack: _back,
          added: store.todayIds.contains(drill.id),
          onAdd: () => _result(store.addToToday(drill.id)),
          onStart: () {
            setState(() => _timing = true);
            _syncSceneVisibility();
          },
        ),
      );
    }
    if (lesson != null) {
      return (
        'lesson:${lesson.id}',
        2,
        false,
        LessonPage(
          catalog: catalog,
          lesson: lesson,
          store: store,
          onBack: _back,
          onDrill: _openDrill,
          onWatch: () => _showLessonMotion(lesson),
          onComplete: () =>
              _result(store.completeLesson(lesson.id), s.lessonCompleted),
        ),
      );
    }
    if (_settings) return ('settings', 1, false, _settingsPage(context));
    if (_assessment) {
      return (
        'assessment',
        2,
        false,
        AssessmentPage(
          initialGrades: store.assessmentGrades,
          onBack: _back,
          onSave: (grades) async {
            final success = await store.recordAssessment(grades);
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
      );
    }
    return switch (_tab) {
      0 => ('watch', 0, false, null),
      1 => (
        'tab1',
        1,
        false,
        LibraryPage(
          catalog: catalog,
          store: store,
          onBack: _back,
          onDrill: _openDrill,
          onRemove: (id) => _result(store.removeFromToday(id)),
        ),
      ),
      2 => (
        'tab2',
        1,
        false,
        PathPage(
          catalog: catalog,
          store: store,
          onBack: _back,
          onLesson: _openLesson,
          onGate: (id, passed) => _result(store.reportGate(id, passed)),
          onAssessment: () => setState(() => _assessment = true),
        ),
      ),
      _ => (
        'tab$_tab',
        1,
        false,
        ProgressPage(
          catalog: catalog,
          store: store,
          onBack: _back,
          onDrill: _openDrill,
        ),
      ),
    };
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
                icon: detail == null
                    ? Icons.route_outlined
                    : Icons.arrow_back_ios_new_rounded,
                onTap: detail == null ? () => _changeTab(2) : _returnToMotion,
              ),
              Expanded(
                child: AnimatedSwitcher(
                  duration: FlareMotion.of(context, FlareMotion.fade),
                  switchInCurve: FlareMotion.settle,
                  child: Column(
                    key: ValueKey(detail?.id ?? 'home'),
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        detail == null
                            ? s.motionBrand
                            : s.phaseHeading(
                                phase.source.toString().padLeft(2, '0'),
                                phase.name,
                              ),
                        style: TextStyle(
                          color: FlareColors.dim,
                          fontSize: 11,
                          height: 1.25,
                          letterSpacing: .4,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Text(
                        detail == null
                            ? s.fullLoop
                            : s.pausedAt(_scene.time.toStringAsFixed(1)),
                        style: const TextStyle(
                          fontSize: 15,
                          height: 1.35,
                          fontWeight: FontWeight.w600,
                          fontFeatures: [FontFeature.tabularFigures()],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              if (detail == null)
                _roundControl(
                  label: s.more,
                  icon: Icons.more_horiz_rounded,
                  onTap: _showMore,
                )
              else
                const SizedBox(width: 44),
            ],
          ),
        ),
        Expanded(
          child: LayoutBuilder(
            builder: (context, box) {
              // The 3D view always fills this whole area, behind the
              // transport or the detail panel; only the part above them is
              // drawn. Entering or leaving detail moves the camera and this
              // inset together, so the WebView itself never resizes.
              _stageArea = box.maxHeight;
              final inset = _viewInsetFor(context, detail != null);
              _sendViewInset(inset);
              return Stack(
                fit: StackFit.expand,
                children: [
                  // Under the live view: during an appearance dissolve the
                  // old frame's backdrop fades out here, behind the athlete.
                  Positioned(
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: inset,
                    child: ThemeFadeWindow(
                      enabled: widget.enableScene && _watchVisible,
                    ),
                  ),
                  widget.enableScene
                      ? SceneView(
                          key: ValueKey(_sceneGeneration),
                          controller: _scene,
                        )
                      : ColoredBox(color: FlareColors.background),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Expanded(
                        flex: detail == null ? 5 : 11,
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                            // The figure fades up out of a quiet placeholder instead of
                            // popping in; a failure gets one calm message and a retry.
                            IgnorePointer(
                              ignoring: _scene.errorCode == null,
                              child: AnimatedSwitcher(
                                duration: FlareMotion.of(
                                  context,
                                  FlareMotion.push,
                                ),
                                switchInCurve: FlareMotion.settle,
                                switchOutCurve: FlareMotion.exit,
                                child: _scene.errorCode != null
                                    ? _SceneError(
                                        key: const ValueKey('scene-error'),
                                        message: s.sceneFailed,
                                        retry: s.retry,
                                        onRetry: _restartScene,
                                      )
                                    : widget.enableScene && !_scene.ready
                                    ? SceneLoading(
                                        key: const ValueKey('scene-loading'),
                                        label: s.sceneLoading,
                                      )
                                    : const SizedBox.shrink(
                                        key: ValueKey('scene-ready'),
                                      ),
                              ),
                            ),
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
                                        backgroundColor: FlareColors.background
                                            .withValues(alpha: .004),
                                        overlayColor: FlareColors.text
                                            .withValues(alpha: .13),
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(
                                            10,
                                          ),
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
                                  onPressed: _scene.playing
                                      ? _scene.pause
                                      : _showMuscles,
                                  style: TextButton.styleFrom(
                                    foregroundColor: FlareColors.secondary,
                                    backgroundColor: FlareColors.control,
                                    side: BorderSide(
                                      color: FlareColors.controlBorder,
                                      width: .5,
                                    ),
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                    ),
                                    minimumSize: const Size(0, 44),
                                    shape: const StadiumBorder(),
                                  ),
                                  icon: Icon(
                                    _scene.playing
                                        ? Icons.pause_rounded
                                        : Icons.touch_app_outlined,
                                    size: 12,
                                  ),
                                  label: Text(
                                    _scene.playing
                                        ? s.playingHint
                                        : s.pausedHint,
                                    style: const TextStyle(fontSize: 11),
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                      if (detail == null) ...[
                        FadeSlideIn(
                          key: const ValueKey('transport'),
                          offset: 10,
                          child: _transport(context, phase),
                        ),
                      ] else
                        _detailPanel(context, phase, detail),
                    ],
                  ),
                ],
              );
            },
          ),
        ),
      ],
    );
  }

  /// Height of the chrome over the bottom of the 3D view: the transport on
  /// the watch screen, the detail panel (7 of 18 parts) in detail.
  double _viewInsetFor(BuildContext context, bool detail) {
    if (_stageArea <= 0) return 0;
    if (detail) return _stageArea * 7 / 18;
    return 56 +
        (30 - MediaQuery.viewPaddingOf(context).bottom).clamp(8, 30).toDouble();
  }

  void _sendViewInset(double inset) {
    if ((inset - _sentInset).abs() < .5) return;
    _sentInset = inset;
    // The first value lands at once; later ones ease with the camera.
    final first = !_insetSent;
    _insetSent = true;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted && (_sentInset - inset).abs() < .5) {
        _scene.setViewInset(inset, animate: !first);
      }
    });
  }

  Widget _detailPanel(BuildContext context, Phase phase, MuscleGroup detail) {
    final s = context.strings;
    final muscle = phase.muscle(detail.id);
    final primary = phase.primary.any((item) => item.id == detail.id);
    final section = catalog.sections
        .where((item) => item.id == detail.section)
        .firstOrNull;
    final together = catalog.synergists(phase, detail.id, limit: 99);
    final shown = together.take(2).toList();
    final hasDrills = catalog.drillsFor(detail.id).isNotEmpty;
    final color = Color(detail.colorValue);
    return Expanded(
      flex: 7,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(24, 6, 24, 8),
              // Each muscle's story eases up as the camera settles on it.
              child: FadeSlideIn(
                key: ValueKey('detail-${detail.id}'),
                delay: FadeSlideIn.stagger(2, step: 40),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 7,
                          height: 7,
                          decoration: BoxDecoration(
                            color: color,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: color.withValues(alpha: .6),
                                blurRadius: 6,
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        Eyebrow(
                          [
                            if (section != null) section.short,
                            primary ? s.primaryShort : s.secondaryShort,
                            switch (muscle?.resolvedSide(
                              catalog.supportFor(phase.source),
                            )) {
                              'left' => s.leftSide,
                              'right' => s.rightSide,
                              _ => s.bothSides,
                            },
                          ].join(' · '),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      detail.label,
                      style: const TextStyle(
                        fontSize: 32,
                        height: 1.2,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      muscle?.why ?? detail.role,
                      style: TextStyle(
                        fontSize: 16,
                        height: 1.55,
                        color: FlareColors.secondary,
                      ),
                    ),
                    if (detail.deep) ...[
                      const SizedBox(height: 6),
                      Eyebrow(
                        _scene.detailModel == 'muscles'
                            ? s.deepMusclesHint
                            : s.deepMotionHint,
                      ),
                    ],
                    if (together.isNotEmpty) ...[
                      const SizedBox(height: 16),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        crossAxisAlignment: WrapCrossAlignment.center,
                        children: [
                          Padding(
                            padding: const EdgeInsets.only(right: 2),
                            child: Eyebrow(s.together),
                          ),
                          for (final group in shown)
                            DotTag(
                              label: group.label,
                              color: Color(group.colorValue),
                              onTap: () => _openGroup(group),
                            ),
                          if (together.length > shown.length)
                            DotTag(
                              label: s.moreCount(
                                together.length - shown.length,
                              ),
                              onTap: _showMuscles,
                            ),
                        ],
                      ),
                    ],
                    if (muscleKnowledge[detail.id] case final about?) ...[
                      const SizedBox(height: 18),
                      Text(
                        about,
                        key: const ValueKey('muscle-knowledge'),
                        style: TextStyle(
                          fontSize: 13,
                          height: 1.65,
                          color: FlareColors.dim,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),
          Padding(
            padding: EdgeInsets.fromLTRB(
              20,
              4,
              20,
              (18 - MediaQuery.viewPaddingOf(context).bottom).clamp(8, 18),
            ),
            child: PrimaryAction(
              key: const ValueKey('train-group'),
              label: s.trainGroup(detail.label),
              arrow: true,
              onPressed: hasDrills ? () => _chooseDrillScene(detail) : null,
            ),
          ),
        ],
      ),
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
              onTap: () {
                FlareHaptics.light();
                _scene.playing ? _scene.pause() : _scene.play();
              },
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
                          style: TextStyle(
                            color: FlareColors.accentInk,
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
                        Flexible(
                          child: Text(
                            '${_scene.time.toStringAsFixed(1)} / ${catalog.period.toStringAsFixed(1)} s',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 11,
                              color: FlareColors.dim,
                              fontFeatures: const [
                                FontFeature.tabularFigures(),
                              ],
                            ),
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
      child: Pressable(
        scale: .9,
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: onTap,
          child: ExcludeSemantics(
            child: Center(
              child: Container(
                width: diameter,
                height: diameter,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: solid ? FlareColors.solid : FlareColors.control,
                  border: Border.all(
                    color: FlareColors.controlBorder,
                    width: .5,
                  ),
                ),
                child: Icon(
                  icon,
                  size: diameter == 48 ? 23 : 18,
                  color: solid ? FlareColors.onSolid : FlareColors.controlIcon,
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );

  Future<void> _showMore() async {
    if (_sheetOpen) return;
    _sheetOpen = true;
    try {
      await _presentMore();
    } finally {
      _sheetOpen = false;
    }
  }

  Future<void> _showMuscles() async {
    if (_sheetOpen) return;
    _sheetOpen = true;
    try {
      await _presentMuscles();
    } finally {
      _sheetOpen = false;
    }
  }

  Future<void> _presentMore() async {
    final s = context.strings;
    final wasPlaying = _scene.playing;
    _scene.pause();
    final stage = catalog.stageByNumber(store.currentStage);
    final value = await showModalBottomSheet<String>(
      context: context,
      sheetAnimationStyle: FlareMotion.sheetStyle(context),
      isScrollControlled: true,
      builder: (sheetContext) => StatefulBuilder(
        builder: (sheetContext, setSheet) => SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                for (final entry in [
                  (
                    'library',
                    s.library,
                    s.libraryHint,
                    Icons.fitness_center_outlined,
                  ),
                  (
                    'path',
                    s.pathTitle,
                    stage == null
                        ? null
                        : '${s.stageLabel(stage.n)} · ${stage.title}',
                    Icons.route_outlined,
                  ),
                  (
                    'progress',
                    s.progress,
                    s.moreProgressHint(store.weekTrainingDays),
                    Icons.insights_outlined,
                  ),
                  ('settings', s.settings, null, Icons.tune_outlined),
                ])
                  ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 4),
                    minTileHeight: 64,
                    leading: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: FlareColors.raised,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(entry.$4, size: 19),
                    ),
                    title: Text(
                      entry.$2,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    subtitle: entry.$3 == null
                        ? null
                        : Text(
                            entry.$3!,
                            style: TextStyle(
                              fontSize: 12,
                              color: FlareColors.dim,
                            ),
                          ),
                    trailing: Icon(
                      Icons.chevron_right_rounded,
                      size: 20,
                      color: FlareColors.dim,
                    ),
                    onTap: () => Navigator.pop(sheetContext, entry.$1),
                  ),
                const Divider(height: 24),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  child: Row(
                    children: [
                      Text(
                        s.playbackSpeed,
                        style: TextStyle(
                          fontSize: 14,
                          color: FlareColors.secondary,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: FlareSegmented<double>(
                          expand: true,
                          segments: const [
                            (.25, '0.25×'),
                            (.5, '0.5×'),
                            (1.0, '1×'),
                          ],
                          selected: _scene.speed,
                          // Speed applies in place; the sheet stays so the
                          // new choice is visible, and play resumes on close.
                          onChanged: (value) {
                            _scene.setSpeed(value);
                            unawaited(store.updateSettings(speed: value));
                            setSheet(() {});
                          },
                        ),
                      ),
                    ],
                  ),
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
      case 'path':
        _changeTab(2);
      case 'progress':
        _changeTab(3);
      case 'settings':
        setState(() => _settings = true);
        _syncSceneVisibility();
    }
  }

  Future<void> _presentMuscles() async {
    _scene.pause();
    final s = context.strings;
    final phase = catalog.phaseBySource(_scene.phase) ?? catalog.phases.first;
    final primary = [
      for (final item in phase.primary)
        if (catalog.groupById(item.id) case final MuscleGroup group)
          (group, item.why ?? group.role),
    ];
    final ids = primary.map((item) => item.$1.id).toSet();
    final others = [
      for (final item in phase.secondary)
        if (!ids.contains(item.id))
          if (catalog.groupById(item.id) case final MuscleGroup group) group,
    ];
    Widget row(BuildContext sheet, MuscleGroup group, String? why) => InkWell(
      onTap: () => Navigator.pop(sheet, group),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        child: Row(
          children: [
            Container(
              width: 3,
              height: why == null ? 22 : 40,
              decoration: BoxDecoration(
                color: Color(group.colorValue),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    group.label,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  if (why != null) ...[
                    const SizedBox(height: 3),
                    Text(
                      why,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(fontSize: 13, color: FlareColors.dim),
                    ),
                  ],
                ],
              ),
            ),
            Icon(Icons.chevron_right_rounded, size: 20, color: FlareColors.dim),
          ],
        ),
      ),
    );
    final group = await showModalBottomSheet<MuscleGroup>(
      context: context,
      sheetAnimationStyle: FlareMotion.sheetStyle(context),
      isScrollControlled: true,
      builder: (sheetContext) {
        var expanded = false;
        return StatefulBuilder(
          builder: (sheetContext, setSheet) => SafeArea(
            child: ConstrainedBox(
              constraints: BoxConstraints(
                maxHeight: MediaQuery.sizeOf(context).height * .78,
              ),
              child: SingleChildScrollView(
                padding: const EdgeInsets.only(bottom: 12),
                // The sheet grows smoothly when the rest of the group opens.
                child: AnimatedSize(
                  duration: FlareMotion.of(context, FlareMotion.expand),
                  curve: FlareMotion.settle,
                  alignment: Alignment.topCenter,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Padding(
                        padding: const EdgeInsets.fromLTRB(24, 0, 24, 8),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Eyebrow(
                              s.phaseMoment(
                                phase.source.toString().padLeft(2, '0'),
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              phase.name,
                              style: const TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ),
                      for (final item in primary)
                        row(sheetContext, item.$1, item.$2),
                      if (others.isNotEmpty && !expanded)
                        InkWell(
                          onTap: () => setSheet(() => expanded = true),
                          child: Padding(
                            padding: const EdgeInsets.fromLTRB(24, 14, 24, 10),
                            child: Row(
                              children: [
                                for (final other in others.take(6))
                                  Container(
                                    width: 6,
                                    height: 6,
                                    margin: const EdgeInsets.only(right: 4),
                                    decoration: BoxDecoration(
                                      color: Color(other.colorValue),
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    s.othersInvolved(
                                      others
                                              .take(2)
                                              .map((g) => g.label)
                                              .join('、') +
                                          (others.length > 2
                                              ? s.groupCount(others.length)
                                              : ''),
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                      fontSize: 13,
                                      color: FlareColors.secondary,
                                    ),
                                  ),
                                ),
                                Icon(
                                  Icons.expand_more_rounded,
                                  size: 20,
                                  color: FlareColors.dim,
                                ),
                              ],
                            ),
                          ),
                        ),
                      if (expanded) ...[
                        const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 24),
                          child: Divider(height: 20),
                        ),
                        for (final (index, other) in others.indexed)
                          FadeSlideIn(
                            delay: FadeSlideIn.stagger(index, step: 26),
                            offset: 8,
                            child: row(sheetContext, other, null),
                          ),
                      ],
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
    if (mounted && group != null) _openGroup(group);
  }

  Widget _settingsPage(BuildContext context) {
    final s = context.strings;
    Widget segmented<T>(
      List<(T, String)> items,
      T selected,
      ValueChanged<T> on,
    ) => FlareSegmented<T>(segments: items, selected: selected, onChanged: on);
    Widget line(String label, Widget control) => Padding(
      padding: const EdgeInsets.fromLTRB(16, 10, 12, 10),
      child: Row(
        children: [
          Expanded(child: Text(label, style: const TextStyle(fontSize: 15))),
          control,
        ],
      ),
    );
    return Column(
      children: [
        PageHeader(title: s.settings, onBack: _back),
        Expanded(
          child: ScrollEdge(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
              children: [
                SectionTitle(s.appearanceGroup),
                RowGroup(
                  children: [
                    line(
                      s.appearanceLabel,
                      segmented<String>(
                        [
                          ('system', s.themeSystem),
                          ('dark', s.themeDark),
                          ('light', s.themeLight),
                        ],
                        store.settings.themeMode,
                        (value) =>
                            _result(store.updateSettings(themeMode: value)),
                      ),
                    ),
                  ],
                ),
                SectionTitle(s.playbackGroup),
                RowGroup(
                  children: [
                    line(
                      s.speedLabel,
                      segmented<double>(
                        const [(.25, '0.25×'), (.5, '0.5×'), (1.0, '1×')],
                        store.settings.speed,
                        (value) {
                          _scene.setSpeed(value);
                          unawaited(store.updateSettings(speed: value));
                        },
                      ),
                    ),
                    line(
                      s.qualityLabel,
                      segmented<String>(
                        [
                          ('battery', s.battery),
                          ('balanced', s.balanced),
                          ('high', s.high),
                        ],
                        _quality,
                        (value) {
                          setState(() => _quality = value);
                          _scene.setQuality(value);
                        },
                      ),
                    ),
                  ],
                ),
                SectionTitle(s.otherGroup),
                RowGroup(
                  children: [
                    FlareRow(
                      title: s.safety,
                      subtitle: s.safetyHint,
                      onTap: () => showSafetySheet(context),
                    ),
                    FlareRow(
                      title: s.aboutFlare,
                      subtitle: s.aboutHint,
                      onTap: () => Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => Scaffold(
                            body: SafeArea(child: _aboutPage(context)),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _aboutPage(BuildContext outer) => Builder(
    builder: (context) {
      final s = context.strings;
      Theme.of(context);
      return ColoredBox(
        color: FlareColors.background,
        child: Column(
          children: [
            PageHeader(
              title: s.aboutFlare,
              onBack: () => Navigator.of(context).pop(),
            ),
            Expanded(
              child: ScrollEdge(
                child: ListView(
                  padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
                  children: [
                    BodyText(s.aboutBody),
                    SectionTitle(s.teachingTitle),
                    BodyText(s.teachingNote, color: FlareColors.secondary),
                    const SizedBox(height: 6),
                    BodyText(s.contentDraftNote, color: FlareColors.secondary),
                    const SizedBox(height: 6),
                    BodyText(s.courseDraft, color: FlareColors.secondary),
                    SectionTitle(s.privacyTitle),
                    BodyText(s.privacyBody, color: FlareColors.secondary),
                    SectionTitle(s.creditsTitle),
                    BodyText(s.creditsBody, color: FlareColors.secondary),
                    const SizedBox(height: 22),
                    RowGroup(
                      children: [
                        FlareRow(
                          title: s.exportBackup,
                          leading: const Icon(Icons.copy_outlined, size: 18),
                          onTap: () async {
                            await Clipboard.setData(
                              ClipboardData(text: _backupJson()),
                            );
                            if (!context.mounted) return;
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text(s.backupCopied)),
                            );
                          },
                        ),
                        FlareRow(
                          title: s.licenses,
                          leading: const Icon(Icons.article_outlined, size: 18),
                          onTap: () => showLicensePage(context: context),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      );
    },
  );

  String _backupJson() => jsonEncode({
    'format': 'flare.local.backup.v1',
    'exportedAt': DateTime.now().toUtc().toIso8601String(),
    'safetyAccepted': store.safetyAccepted,
    'settings': store.settings.toJson(),
    'lastTime': store.lastTime,
    'todayIds': store.todayIds,
    'sessions': store.sessions.map((session) => session.toJson()).toList(),
    'completedLessonIds': store.completedLessonIds.toList(),
    'gateReports': store.gateReports,
    'assessmentGrades': store.assessmentGrades,
  });
}

/// Placeholder while the 3D scene boots: the vector loading mark (the
/// icon's athlete in a flare inside a turning orbit) with one quiet line.
/// The scene's own canvas loader draws the same mark in the same place, so
/// the hand-over to the WebView and then to the real figure is a dissolve.
class SceneLoading extends StatelessWidget {
  const SceneLoading({super.key, required this.label});
  final String label;

  @override
  Widget build(BuildContext context) => Semantics(
    label: label,
    liveRegion: true,
    child: Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const ExcludeSemantics(child: FlareLoaderMark()),
          const SizedBox(height: 10),
          ExcludeSemantics(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 12,
                height: 1.5,
                letterSpacing: .6,
                color: FlareColors.dim,
              ),
            ),
          ),
        ],
      ),
    ),
  );
}

/// Quiet inline notice for a storage problem: one line and one action,
/// instead of a Material banner.
class _StorageNotice extends StatelessWidget {
  const _StorageNotice({
    required this.message,
    required this.action,
    required this.onAction,
  });
  final String message;
  final String action;
  final VoidCallback onAction;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(12, 6, 12, 6),
    child: Semantics(
      liveRegion: true,
      container: true,
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: FlareColors.palette.raised,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: FlareColors.hairline),
        ),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(14, 4, 4, 4),
          child: Row(
            children: [
              Icon(
                Icons.error_outline_rounded,
                size: 18,
                color: FlareColors.warning,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  message,
                  style: TextStyle(
                    fontSize: 13,
                    height: 1.35,
                    color: FlareColors.secondary,
                  ),
                ),
              ),
              TextButton(onPressed: onAction, child: Text(action)),
            ],
          ),
        ),
      ),
    ),
  );
}

class _SceneError extends StatelessWidget {
  const _SceneError({
    super.key,
    required this.message,
    required this.retry,
    required this.onRetry,
  });
  final String message;
  final String retry;
  final VoidCallback onRetry;
  @override
  Widget build(BuildContext context) => Center(
    child: Padding(
      padding: const EdgeInsets.symmetric(horizontal: 40),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.view_in_ar_outlined, size: 28, color: FlareColors.dim),
          const SizedBox(height: 12),
          Text(
            message,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 14,
              height: 1.5,
              color: FlareColors.secondary,
            ),
          ),
          const SizedBox(height: 14),
          Pressable(
            child: OutlinedButton(
              onPressed: () {
                FlareHaptics.light();
                onRetry();
              },
              child: Text(retry),
            ),
          ),
        ],
      ),
    ),
  );
}

/// One scene in the training choice: the drill's picture, the scene in a
/// word, what it needs, and the drill it opens.
class _SceneOption extends StatelessWidget {
  const _SceneOption({
    super.key,
    required this.label,
    required this.hint,
    required this.drill,
    required this.usual,
    required this.onTap,
  });
  final String label;
  final String hint;
  final Drill drill;
  final bool usual;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 10),
    child: Semantics(
      button: true,
      label: '$label，${drill.name}，${drill.prescription}',
      onTap: onTap,
      excludeSemantics: true,
      child: Pressable(
        scale: .98,
        child: Material(
          color: FlareColors.surface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
            side: BorderSide(
              color: usual
                  ? FlareColors.accent.withValues(alpha: .55)
                  : Colors.transparent,
              width: 1.2,
            ),
          ),
          clipBehavior: Clip.antiAlias,
          child: InkWell(
            onTap: onTap,
            child: Padding(
              padding: const EdgeInsets.all(10),
              child: Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(14),
                    child: ColoredBox(
                      color: FlareColors.raised,
                      child: Image.asset(
                        drillArt(drill.thumbnailAsset),
                        width: 72,
                        height: 72,
                        fit: BoxFit.cover,
                        frameBuilder: (context, child, frame, sync) =>
                            fadeInFrame(context, child, frame, sync),
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          label,
                          style: const TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          hint,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 12,
                            color: FlareColors.dim,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          '${drill.name} · ${drill.prescription}',
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 13,
                            color: FlareColors.secondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Icon(Icons.chevron_right_rounded, color: FlareColors.dim),
                ],
              ),
            ),
          ),
        ),
      ),
    ),
  );
}
