import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/gestures.dart' show PointerDeviceKind;
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import '../control/learning_store.dart';
import '../data/catalog.dart';
import '../data/muscle_knowledge.dart';
import '../l10n/languages.dart';
import '../platform/scene/scene.dart';
import 'components.dart';
import 'content_pages.dart';
import 'flare_silhouette.dart';
import 'motion_controls.dart';
import 'muscle_widgets.dart';
import 'motion.dart';
import 'timer_page.dart';
import 'startup_splash.dart';
import 'theme.dart';
import 'theme_fade.dart';

class FlareShell extends StatefulWidget {
  const FlareShell({
    super.key,
    required this.catalog,
    required this.store,
    this.sceneController,
    this.enableScene = true,
    this.sceneRevision = 0,
    this.startupCovered = false,
  });
  final Catalog catalog;
  final LearningStore store;
  final SceneController? sceneController;
  final bool enableScene;
  final int sceneRevision;
  final bool startupCovered;
  @override
  State<FlareShell> createState() => _FlareShellState();
}

class _FlareShellState extends State<FlareShell> with WidgetsBindingObserver {
  late final SceneController _scene;
  int _tab = 0;
  bool _configured = false;
  bool _configuring = false;
  bool _didPresentScene = false;
  int _sceneGeneration = 0;
  bool _settings = false;
  bool _assessment = false;
  bool _timing = false;
  Drill? _drill;
  Lesson? _lesson;
  MuscleGroup? _detail;
  MuscleGroup? _libraryGroup;
  String _libraryQuery = '';
  int _handledSelection = 0;
  double _lastSavedTime = -1;
  String _quality = 'balanced';
  String? _sceneTheme;
  String? _sceneLanguage;
  String? _stageKey;
  double _stageArea = 0, _sentInset = -1;
  bool _insetSent = false;
  bool _holdWatch = false;
  final _stageBackdropKey = GlobalKey();

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

  @override
  void didUpdateWidget(covariant FlareShell oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!identical(widget.catalog, oldWidget.catalog)) {
      if (_detail != null) _detail = catalog.groupById(_detail!.id);
      if (_drill != null) _drill = catalog.drillById(_drill!.id);
      if (_lesson != null) _lesson = catalog.lessonById(_lesson!.id);
      if (_libraryGroup != null) {
        _libraryGroup = catalog.groupById(_libraryGroup!.id);
      }
    }
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
    if (!_scene.ready) {
      // Recreated views and recovered WebGL contexts both need fresh settings.
      // Their provisional clock must not replace the user's saved position.
      _configured = false;
      _didPresentScene = false;
      _refreshView();
      return;
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
      _sceneLanguage = null;
      _scene.setTime(restoredTime);
      if (_detail case final group?) {
        _scene.setDetail(group.id);
        _scene.setDetailModel(restoredModel);
      } else if (store.safetyAccepted && _watchVisible) {
        _scene.play();
      }
      // A recovered WebGL context may still belong to a hidden, prewarmed
      // view. Let it produce its replacement frame before hiding it again.
      _scene.setVisible(true);
      if (widget.enableScene) _scene.requestPresentation();
      _configuring = false;
      _refreshView();
      return;
    }
    if (_scene.presented && !_didPresentScene) {
      _didPresentScene = true;
      // First-use welcome still requires explicit acknowledgement. Its model
      // is now prewarmed, so stop its idle loop until the action is shown.
      if (!_watchVisible) _scene.setVisible(false);
    }
    if (store.safetyAccepted &&
        (_scene.presented || !widget.enableScene) &&
        !_scene.playing &&
        (_scene.time - _lastSavedTime).abs() > .001) {
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
      store.safetyAccepted &&
      _tab == 0 &&
      _drill == null &&
      _lesson == null &&
      !_settings &&
      !_assessment &&
      !_timing;

  bool get _preparingScene => widget.enableScene && !_scene.presented;

  void _syncSceneVisibility() {
    _scene.setVisible(_watchVisible || _preparingScene);
    if (!_watchVisible) {
      _scene.pause();
      if (store.safetyAccepted && (_scene.presented || !widget.enableScene)) {
        unawaited(store.setLastTime(_scene.time));
      }
    }
  }

  void _changeTab(int value) {
    setState(() {
      _tab = value;
      _drill = null;
      _lesson = null;
      _settings = false;
      _assessment = false;
      _libraryGroup = null;
      _libraryQuery = '';
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

  void _openGroupTraining(MuscleGroup group) {
    _scene.pause();
    setState(() {
      _tab = 1;
      _libraryGroup = group;
      _libraryQuery = group.shortLabel;
      _drill = null;
      _lesson = null;
      _settings = false;
      _assessment = false;
    });
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
    if (_tab == 0 &&
        _drill == null &&
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
        _libraryGroup = null;
        _libraryQuery = '';
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
      if (store.safetyAccepted && (_scene.presented || !widget.enableScene)) {
        unawaited(store.setLastTime(_scene.time));
      }
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
      final duration =
          _sceneTheme == null || (widget.enableScene && !_scene.presented)
          ? Duration.zero
          : FlareMotion.of(context, FlareMotion.theme);
      _sceneTheme = theme;
      _scene.setTheme(theme, duration: duration);
    }
    final s = context.strings;
    if (_sceneLanguage != s.localeName) {
      _sceneLanguage = s.localeName;
      _scene.setLocalization({
        'locale': s.localeName,
        'rtl': Directionality.of(context) == TextDirection.rtl,
        'groups': {for (final group in catalog.groups) group.id: group.label},
        'shortGroups': {
          for (final group in catalog.groups) group.id: group.shortLabel,
        },
        'viewLabels': {
          for (final group in catalog.groups)
            group.id: s.viewGroup(group.label),
        },
        'syncEffort': s.syncEffort,
        'muscleMap': s.muscleMap,
        'motion': s.watch,
        'mapAccessibility': s.phaseMapAccessibility,
        'sceneAccessibility': s.sceneAccessibleTitle,
        'switchToMuscles': s.switchToMuscles,
        'switchToMotion': s.switchToMotion,
        'sceneFailed': s.sceneFailed,
        'retry': s.retry,
      });
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
      if (_stageKey != null && (_stageKey == 'watch' || route.$1 == 'watch')) {
        _holdWatch = true;
      }
      _stageKey = route.$1;
    }
    final shell = PopScope(
      canPop: !canBack && !_timing,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop && !_timing) _back();
      },
      child: DecoratedBox(
        key: _stageBackdropKey,
        // The stage surface is the supplied graphite token, shared by the
        // floating header, transparent 3D view and compact transport.
        decoration: BoxDecoration(gradient: _stageGradient()),
        child: Scaffold(
          backgroundColor: _watchVisible || _holdWatch
              ? Colors.transparent
              : FlareColors.background,
          // Titled pages sit below the status bar; the shared 3D stage owns
          // its own inset.
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
                          offstage:
                              !_watchVisible && !_holdWatch && !_preparingScene,
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
                          child: route.$4 == null
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
    // Mount the real scene even on first use. The welcome page stays fully
    // opaque and blocks interaction; acknowledgement never reloads the model.
    return Stack(
      fit: StackFit.expand,
      children: [
        ExcludeSemantics(
          excluding: !store.safetyAccepted,
          child: IgnorePointer(ignoring: !store.safetyAccepted, child: shell),
        ),
        if (!store.safetyAccepted)
          WelcomePage(
            onEnter: (assessment) async {
              final accepted = await store.acknowledgeSafety();
              if (!mounted || !accepted) return;
              setState(() => _assessment = assessment);
              _syncSceneVisibility();
              if (_scene.presented && _watchVisible) _scene.play();
            },
          ),
      ],
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
          initialGroup: _libraryGroup,
          initialQuery: _libraryQuery,
          onQueryChanged: (value) => _libraryQuery = value,
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
    // Retain the previous header height so simplifying its text does not
    // resize the shared 3D stage or shift the athlete's framing.
    final textScaler = MediaQuery.textScalerOf(context);
    final headingHeight =
        (textScaler.scale(11) * 1.25 + textScaler.scale(15) * 1.35).clamp(
          44.0,
          double.infinity,
        );
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
                  child: detail == null
                      ? SizedBox(
                          key: const ValueKey('home'),
                          height: headingHeight,
                          child: Center(
                            child: FittedBox(
                              fit: BoxFit.scaleDown,
                              child: _HomeWordmark(label: s.motionBrand),
                            ),
                          ),
                        )
                      : SizedBox(
                          key: ValueKey(detail.id),
                          height: headingHeight,
                          child: LayoutBuilder(
                            builder: (context, box) => FittedBox(
                              fit: BoxFit.scaleDown,
                              child: SizedBox(
                                width: box.maxWidth,
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      detail.shortLabel,
                                      semanticsLabel: detail.label,
                                      key: const ValueKey(
                                        'muscle-detail-title',
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      textAlign: TextAlign.center,
                                      style: const TextStyle(
                                        fontSize: 15,
                                        height: 1.35,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
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
                          key: ValueKey((
                            _sceneGeneration,
                            widget.sceneRevision,
                          )),
                          controller: _scene,
                        )
                      : ColoredBox(color: FlareColors.background),
                  SceneRevealLayer(
                    enabled: widget.enableScene && !widget.startupCovered,
                    presented: _scene.presented,
                    bottomInset: inset,
                    backdrop: _StageBackdropCover(ancestor: _stageBackdropKey),
                    loading: SceneLoading(
                      key: const ValueKey('scene-loading'),
                      label: s.sceneLoading,
                    ),
                    error: widget.startupCovered || _scene.errorCode == null
                        ? null
                        : _SceneError(
                            key: const ValueKey('scene-error'),
                            message: s.sceneFailed,
                            retry: s.retry,
                            onRetry: () {
                              _scene.pause();
                              setState(() {
                                _configured = false;
                                _sceneGeneration++;
                              });
                            },
                          ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Expanded(
                        flex: detail == null
                            ? 5
                            : MediaQuery.sizeOf(context).height < 760
                            ? 9
                            : 11,
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                            if (detail != null)
                              Positioned(
                                left: 12,
                                bottom: 31,
                                width: 86,
                                height: 136,
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
                                        minimumSize: const Size(86, 136),
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
                                bottom: box.maxWidth < 380 ? 228 : 18,
                                child: ConstrainedBox(
                                  constraints: BoxConstraints(
                                    maxWidth: box.maxWidth < 380
                                        ? box.maxWidth * .46
                                        : box.maxWidth - 218,
                                  ),
                                  child: TextButton.icon(
                                    key: const ValueKey('home-muscle-hint'),
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
                                      maxLines: 2,
                                      textAlign: TextAlign.center,
                                    ),
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
  /// the watch screen, or the detail panel (7/18, 8/17 on short screens).
  double _viewInsetFor(BuildContext context, bool detail) {
    if (_stageArea <= 0) return 0;
    if (detail) {
      return _stageArea *
          (MediaQuery.sizeOf(context).height < 760 ? 8 / 17 : 7 / 18);
    }
    return 72 +
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
    final together = catalog.synergists(phase, detail.id, limit: 99);
    final hasDrills = catalog.drillsFor(detail.id).isNotEmpty;
    final color = Color(detail.colorValue);
    return Expanded(
      flex: MediaQuery.sizeOf(context).height < 760 ? 8 : 7,
      child: LayoutBuilder(
        builder: (context, constraints) {
          // Translated role sentences often take two lines. Reserve room for
          // the independent knowledge viewport on phone-height panels.
          final rolePainter =
              TextPainter(
                text: TextSpan(
                  text: muscle?.why ?? detail.role,
                  style: DefaultTextStyle.of(context).style.merge(
                    const TextStyle(
                      fontSize: 14.5,
                      height: 1.35,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                textDirection: Directionality.of(context),
                textScaler: MediaQuery.textScalerOf(context),
                maxLines: 2,
              )..layout(
                maxWidth: (constraints.maxWidth - 48).clamp(0, double.infinity),
              );
          final roleWraps = rolePainter.computeLineMetrics().length > 1;
          rolePainter.dispose();
          final compact =
              constraints.maxHeight < 270 ||
              (constraints.maxHeight < 330 &&
                  (s.localeName != 'zh' || roleWraps));
          return Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded(
                child: Padding(
                  padding: EdgeInsets.fromLTRB(24, compact ? 6 : 10, 24, 0),
                  child: FadeSlideIn(
                    key: ValueKey('detail-${detail.id}'),
                    delay: FadeSlideIn.stagger(2, step: 40),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Semantics(
                          header: true,
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                width: 4,
                                height: compact ? 24 : 30,
                                margin: const EdgeInsetsDirectional.only(
                                  top: 3,
                                  end: 12,
                                ),
                                decoration: BoxDecoration(
                                  color: color,
                                  borderRadius: BorderRadius.circular(2),
                                ),
                              ),
                              Expanded(
                                child: SizedBox(
                                  height: compact ? 26 : 36,
                                  child: FittedBox(
                                    fit: BoxFit.scaleDown,
                                    alignment: AlignmentDirectional.centerStart,
                                    child: Text(
                                      detail.shortLabel,
                                      semanticsLabel: detail.label,
                                      key: const ValueKey('muscle-panel-title'),
                                      style: TextStyle(
                                        fontSize: 30,
                                        height: 1.2,
                                        letterSpacing: -.6,
                                        fontWeight: FontWeight.w800,
                                        color: FlareColors.text,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        SizedBox(height: compact ? 4 : 6),
                        Text(
                          muscle?.why ?? detail.role,
                          key: const ValueKey('muscle-role'),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: compact ? 12.5 : 14.5,
                            height: 1.35,
                            fontWeight: FontWeight.w600,
                            color: FlareColors.text.withValues(alpha: .88),
                          ),
                        ),
                        SizedBox(height: compact ? 4 : 8),
                        Expanded(
                          child: _MuscleKnowledgeBlock(
                            key: ValueKey('knowledge-${detail.id}'),
                            text: catalog
                                .translate(
                                  muscleKnowledge[detail.id] ?? detail.role,
                                )
                                .replaceFirstMapped(
                                  RegExp(r'[。.!؟।]'),
                                  (m) => '${m[0]}\n\n',
                                ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              if (together.isNotEmpty)
                Padding(
                  padding: EdgeInsets.fromLTRB(
                    24,
                    compact ? 6 : 8,
                    24,
                    compact ? 6 : 8,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      SingleChildScrollView(
                        key: const ValueKey('muscle-assist-cards'),
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: [
                            for (final group in together) ...[
                              MuscleAssistCard(
                                group: group,
                                compact: compact,
                                onTap: () => _openGroup(group),
                              ),
                              const SizedBox(width: 10),
                            ],
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              DecoratedBox(
                decoration: BoxDecoration(
                  color: FlareColors.background,
                  border: Border(
                    top: BorderSide(color: FlareColors.hairline, width: .5),
                  ),
                ),
                child: Padding(
                  padding: EdgeInsets.fromLTRB(
                    20,
                    8,
                    20,
                    (12 - MediaQuery.viewPaddingOf(context).bottom).clamp(
                      8,
                      12,
                    ),
                  ),
                  child: PrimaryAction(
                    key: const ValueKey('train-group'),
                    height: compact ? 48 : 56,
                    label: s.trainGroup(detail.shortLabel),
                    semanticsLabel: s.trainGroup(detail.label),
                    arrow: true,
                    onPressed: hasDrills
                        ? () => _openGroupTraining(detail)
                        : null,
                  ),
                ),
              ),
            ],
          );
        },
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
        height: 72,
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
                            key: const ValueKey('home-phase-name'),
                            maxLines: 2,
                            style: const TextStyle(
                              fontSize: 13,
                              height: 1.15,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        Text(
                          '${_scene.time.toStringAsFixed(1)} / ${catalog.period.toStringAsFixed(1)} s',
                          style: TextStyle(
                            fontSize: 11,
                            color: FlareColors.dim,
                            fontFeatures: const [FontFeature.tabularFigures()],
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
    Widget row(BuildContext sheet, MuscleGroup group, String? why) =>
        MuscleItemTile(
          group: group,
          subtitle: why,
          onTap: () => Navigator.pop(sheet, group),
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
                                MuscleThumbnailStack(
                                  groups: others.take(3).toList(),
                                ),
                                const SizedBox(width: 12),
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
      child: LayoutBuilder(
        builder: (context, constraints) => constraints.maxWidth < 440
            ? Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label, style: const TextStyle(fontSize: 15)),
                  const SizedBox(height: 8),
                  SizedBox(width: constraints.maxWidth, child: control),
                ],
              )
            : Row(
                children: [
                  Expanded(
                    child: Text(label, style: const TextStyle(fontSize: 15)),
                  ),
                  control,
                ],
              ),
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
                    Semantics(
                      container: true,
                      button: true,
                      label:
                          '${s.languageLabel} ${languageNames[store.settings.language] ?? s.languageSystem}',
                      onTap: () => _chooseLanguage(context),
                      excludeSemantics: true,
                      child: FlareRow(
                        key: const ValueKey('language-setting'),
                        title: s.languageLabel,
                        subtitle:
                            languageNames[store.settings.language] ??
                            s.languageSystem,
                        onTap: () => _chooseLanguage(context),
                      ),
                    ),
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

  Future<void> _chooseLanguage(BuildContext context) async {
    final s = context.strings;
    final selected = await showModalBottomSheet<String>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      builder: (context) => SizedBox(
        height: MediaQuery.sizeOf(context).height * .75,
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(20),
              child: Text(
                s.languageTitle,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            Expanded(
              child: ListView(
                children: [
                  for (final entry in {
                    'system': s.languageSystem,
                    ...languageNames,
                  }.entries)
                    ListTile(
                      key: ValueKey('language-${entry.key}'),
                      title: Text(entry.value),
                      trailing: store.settings.language == entry.key
                          ? const Icon(Icons.check_rounded)
                          : null,
                      selected: store.settings.language == entry.key,
                      onTap: () => Navigator.of(context).pop(entry.key),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
    if (selected != null && mounted) {
      _result(store.updateSettings(language: selected));
    }
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

class _MuscleKnowledgeBlock extends StatefulWidget {
  const _MuscleKnowledgeBlock({super.key, required this.text});

  final String text;

  @override
  State<_MuscleKnowledgeBlock> createState() => _MuscleKnowledgeBlockState();
}

class _MuscleKnowledgeBlockState extends State<_MuscleKnowledgeBlock> {
  static const _padding = EdgeInsets.symmetric(horizontal: 10, vertical: 4);
  final _scroll = ScrollController();
  ScrollController? _readerScroll;
  final _portal = OverlayPortalController();
  final _anchorKey = GlobalKey();
  Rect? _previewRect, _readerRect;
  TextStyle? _flightStyle;
  bool _expanded = false;

  TextStyle _style(BuildContext context) =>
      DefaultTextStyle.of(context).style.merge(
        TextStyle(fontSize: 14, height: 1.55, color: FlareColors.secondary),
      );

  double _textHeight(BuildContext context, double width) {
    final painter = TextPainter(
      text: TextSpan(text: widget.text, style: _style(context)),
      textDirection: Directionality.of(context),
      textScaler: MediaQuery.textScalerOf(context),
    )..layout(maxWidth: width.clamp(1, double.infinity));
    final height = painter.height;
    painter.dispose();
    return height;
  }

  void _open() {
    if (_portal.isShowing) return;
    final anchor = _anchorKey.currentContext?.findRenderObject();
    final overlay = Overlay.of(context).context.findRenderObject();
    if (anchor is! RenderBox || overlay is! RenderBox) return;
    final origin = overlay.localToGlobal(Offset.zero);
    final rect = (anchor.localToGlobal(Offset.zero) - origin) & anchor.size;
    final topLimit = MediaQuery.viewPaddingOf(context).top + 108;
    final available = (rect.bottom - topLimit).clamp(
      rect.height,
      double.infinity,
    );
    // Both cards share the exact text width, font, border and inner padding.
    // A small rounding allowance prevents a complete paragraph losing 1px.
    final height = (_textHeight(context, rect.width - 21).ceilToDouble() + 10)
        .clamp(rect.height, available);
    _readerScroll?.dispose();
    _readerScroll = ScrollController(
      initialScrollOffset: _scroll.hasClients ? _scroll.offset : 0,
      keepScrollOffset: false,
    );
    setState(() {
      _flightStyle = _style(context);
      _previewRect = rect;
      _readerRect = Rect.fromLTRB(
        rect.left,
        rect.bottom - height,
        rect.right,
        rect.bottom,
      );
      _expanded = true;
    });
    _portal.show();
    FlareHaptics.selection();
  }

  void _close() {
    if (!_portal.isShowing || !_expanded) return;
    setState(() => _expanded = false);
  }

  void _finishClose() {
    if (!mounted || _expanded || !_portal.isShowing) return;
    // Hand back the visible text position before revealing the original card.
    // Finish on the actual last animation frame rather than a separate timer.
    if (_scroll.hasClients && (_readerScroll?.hasClients ?? false)) {
      _scroll.jumpTo(
        _readerScroll!.offset.clamp(0, _scroll.position.maxScrollExtent),
      );
    }
    _portal.hide();
    setState(() {});
  }

  ScrollBehavior _scrollBehavior(BuildContext context) =>
      ScrollConfiguration.of(context).copyWith(
        scrollbars: false,
        dragDevices: {
          PointerDeviceKind.touch,
          PointerDeviceKind.mouse,
          PointerDeviceKind.stylus,
          PointerDeviceKind.invertedStylus,
          PointerDeviceKind.trackpad,
        },
      );

  @override
  void dispose() {
    _scroll.dispose();
    _readerScroll?.dispose();
    super.dispose();
  }

  Widget _card(
    BuildContext context, {
    required bool reader,
    double lift = 0,
    bool canOpen = true,
  }) => GestureDetector(
    key: ValueKey(
      reader ? 'muscle-knowledge-reader-toggle' : 'muscle-knowledge-toggle',
    ),
    behavior: HitTestBehavior.opaque,
    onTap: reader ? _close : (canOpen ? _open : null),
    child: Container(
      key: reader
          ? const ValueKey('muscle-knowledge-expanded-card')
          : _anchorKey,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: FlareColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: FlareColors.hairline, width: .5),
        boxShadow: lift <= 0
            ? null
            : [
                BoxShadow(
                  color: const Color(0x26000000).withValues(alpha: .15 * lift),
                  blurRadius: 24 * lift,
                  offset: Offset(0, 6 * lift),
                ),
              ],
      ),
      padding: _padding,
      child: ScrollConfiguration(
        behavior: _scrollBehavior(context),
        child: SingleChildScrollView(
          key: ValueKey(
            reader ? 'muscle-knowledge-reader' : 'muscle-detail-content',
          ),
          controller: reader ? _readerScroll : _scroll,
          primary: false,
          child: Text(
            widget.text,
            key: ValueKey(
              reader ? 'muscle-knowledge-expanded' : 'muscle-knowledge',
            ),
            style: reader ? _flightStyle! : _style(context),
          ),
        ),
      ),
    ),
  );

  Widget _reader(BuildContext context) => Stack(
    children: [
      Positioned(
        left: 0,
        right: 0,
        top: 0,
        height: _previewRect!.bottom,
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: _close,
          child: const ColoredBox(color: Colors.transparent),
        ),
      ),
      TweenAnimationBuilder<Rect?>(
        tween: RectTween(
          begin: _previewRect,
          end: _expanded ? _readerRect : _previewRect,
        ),
        duration: FlareMotion.of(
          context,
          _expanded ? FlareMotion.expand : FlareMotion.collapse,
        ),
        curve: FlareMotion.settle,
        onEnd: _finishClose,
        builder: (context, rect, _) {
          final growth = _readerRect!.height - _previewRect!.height;
          final lift = growth <= 0
              ? 0.0
              : ((rect!.height - _previewRect!.height) / growth).clamp(
                  0.0,
                  1.0,
                );
          return Positioned.fromRect(
            rect: rect!,
            child: Material(
              type: MaterialType.transparency,
              child: Semantics(
                button: true,
                hint: context.strings.close,
                child: _card(context, reader: true, lift: lift),
              ),
            ),
          );
        },
      ),
    ],
  );

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, constraints) {
      final overflow =
          _textHeight(context, constraints.maxWidth - 21) >
          constraints.maxHeight - 9;
      return OverlayPortal(
        controller: _portal,
        overlayChildBuilder: _reader,
        child: ExcludeSemantics(
          excluding: _portal.isShowing,
          child: Opacity(
            opacity: _portal.isShowing ? 0 : 1,
            child: Semantics(
              button: overflow,
              hint: overflow ? context.strings.more : null,
              child: IgnorePointer(
                ignoring: !overflow,
                child: _card(context, reader: false, canOpen: overflow),
              ),
            ),
          ),
        ),
      );
    },
  );
}

/// A compact wordmark with one accessible name and a teal brand accent.
class _HomeWordmark extends StatelessWidget {
  const _HomeWordmark({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    final parts = label.split(' · ');
    final teal = Theme.of(context).brightness == Brightness.dark
        ? const Color(0xff75dfd0)
        : const Color(0xff16776f);
    return Text.rich(
      TextSpan(
        children: [
          TextSpan(
            text: parts.first,
            style: TextStyle(
              fontSize: 23,
              fontWeight: FontWeight.w800,
              fontStyle: FontStyle.italic,
              letterSpacing: .3,
              color: FlareColors.text,
              decoration: TextDecoration.underline,
              decorationColor: teal.withValues(alpha: .65),
              decorationThickness: 2,
            ),
          ),
          if (parts.length > 1) ...[
            TextSpan(
              text: ' · ',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: teal,
              ),
            ),
            TextSpan(
              text: parts.skip(1).join(' · '),
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                letterSpacing: 1,
                color: FlareColors.secondary,
              ),
            ),
          ],
        ],
      ),
      semanticsLabel: label,
      maxLines: 1,
      softWrap: false,
      textAlign: TextAlign.center,
    );
  }
}

RadialGradient _stageGradient() => flareStageGradient();

/// The loading cover paints the exact full-page backdrop, cropped to the stage.
/// Recreating a gradient in this smaller rectangle would shift its centre and
/// produce a colour flash beneath the transport when the cover disappears.
class _StageBackdropCover extends StatelessWidget {
  const _StageBackdropCover({required this.ancestor});
  final GlobalKey ancestor;

  @override
  Widget build(BuildContext context) => CustomPaint(
    painter: _StageBackdropPainter(
      ancestor: ancestor,
      context: context,
      gradient: _stageGradient(),
    ),
  );
}

class _StageBackdropPainter extends CustomPainter {
  _StageBackdropPainter({
    required this.ancestor,
    required this.context,
    required this.gradient,
  });
  final GlobalKey ancestor;
  final BuildContext context;
  final RadialGradient gradient;

  @override
  void paint(Canvas canvas, Size size) {
    final page = ancestor.currentContext?.findRenderObject();
    final cover = context.findRenderObject();
    var source = Offset.zero & size;
    if (page is RenderBox && cover is RenderBox && page.hasSize) {
      final offset = cover.localToGlobal(Offset.zero, ancestor: page);
      source = (Offset.zero & page.size).shift(-offset);
    }
    canvas.drawRect(
      Offset.zero & size,
      Paint()..shader = gradient.createShader(source),
    );
  }

  @override
  bool shouldRepaint(_StageBackdropPainter oldDelegate) => true;
}

/// The mark leaves while the backdrop is still opaque; only then can the
/// fully drawn scene dissolve in. Bridge readiness alone never starts it.
class SceneRevealLayer extends StatefulWidget {
  const SceneRevealLayer({
    super.key,
    required this.enabled,
    required this.presented,
    required this.bottomInset,
    required this.backdrop,
    required this.loading,
    this.error,
  });

  final bool enabled;
  final bool presented;
  final double bottomInset;
  final Widget backdrop;
  final Widget loading;
  final Widget? error;

  @override
  State<SceneRevealLayer> createState() => _SceneRevealLayerState();
}

class _SceneRevealLayerState extends State<SceneRevealLayer>
    with SingleTickerProviderStateMixin {
  static const _markEnd = 120 / 340;
  late final AnimationController _reveal = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 340),
    value: widget.presented && widget.error == null ? 1 : 0,
  );

  @override
  void didUpdateWidget(SceneRevealLayer oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!widget.presented || widget.error != null) {
      _reveal.stop();
      _reveal.value = 0;
    } else if (!widget.enabled) {
      // The app splash owns the initial reveal. Once it leaves, this cover
      // must already be gone, independent of the two animations' frame order.
      _reveal.stop();
      _reveal.value = 1;
    } else if (!oldWidget.presented || oldWidget.error != null) {
      if (FlareMotion.reduced(context)) {
        _reveal.value = 1;
      } else {
        _reveal.forward(from: 0);
      }
    }
  }

  @override
  void dispose() {
    _reveal.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!widget.enabled && widget.error == null) {
      return const SizedBox.shrink();
    }
    return AnimatedBuilder(
      animation: _reveal,
      builder: (context, _) {
        if (_reveal.isCompleted && widget.error == null) {
          return const SizedBox.shrink(key: ValueKey('scene-ready'));
        }
        final progress = _reveal.value;
        final markOpacity = progress >= _markEnd - .000001
            ? 0.0
            : 1 -
                  Curves.easeOut.transform(
                    (progress / _markEnd).clamp(0.0, 1.0),
                  );
        final coverOpacity =
            1 -
            FlareMotion.dissolve.transform(
              ((progress - _markEnd) / (1 - _markEnd)).clamp(0.0, 1.0),
            );
        return IgnorePointer(
          ignoring: widget.error == null,
          child: Stack(
            fit: StackFit.expand,
            children: [
              if (widget.enabled)
                Opacity(
                  key: const ValueKey('scene-cover-opacity'),
                  opacity: coverOpacity,
                  child: widget.backdrop,
                ),
              Positioned(
                left: 0,
                right: 0,
                top: 0,
                bottom: widget.bottomInset,
                child:
                    widget.error ??
                    (markOpacity <= 0
                        ? const SizedBox.shrink()
                        : Opacity(
                            key: const ValueKey('scene-mark-opacity'),
                            opacity: markOpacity,
                            child: widget.loading,
                          )),
              ),
            ],
          ),
        );
      },
    );
  }
}

/// Placeholder while the 3D scene boots: the baked v41 action silhouette
/// with one quiet line. The lightweight asset needs no live model to play.
/// Flutter owns the hosted scene's loading UI. The scene only draws its own
/// loader when opened on its own, avoiding two marks during initialization.
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
          const ExcludeSemantics(child: FlareLoadingSilhouette()),
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
