import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;
import 'package:ugk_coach_chat/ugk_coach_chat.dart';
import 'package:ugk_trainer_runtime/ugk_trainer_runtime.dart' as sdk;
import '../control/learning_store.dart';
import '../control/flare_membership.dart';
import '../data/catalog.dart';
import '../l10n/languages.dart';
import '../platform/scene/scene.dart';
import '../platform/scene/scene_variant.dart';
import '../data/flare_public_media.dart';
import '../data/flare_shared_library.dart';
import '../trainer/flare_plan_resume.dart';
import '../trainer/training_plan_adapter.dart';
import '../trainer/trainer_strings.dart';
import '../trainer/trainer_theme.dart';
import 'components.dart';
import 'page_kit.dart';
import 'actor_body_selector.dart';
import 'content_pages.dart';
import 'flare_silhouette.dart';
import 'motion_controls.dart';
import 'motion.dart';
import 'trainer_page.dart';
import 'sdk_plan_editor_page.dart';
import 'plans_page.dart';
import 'flare_training_hub_page.dart';
import 'scene_localization.dart';
import 'drill_media.dart';
import 'flare_coach_chat_page.dart';
import 'flare_membership_page.dart';
import '../coach/flare_coach_chat.dart';
import '../coach/usage_store.dart';
import 'startup_splash.dart';
import 'theme.dart';
import 'theme_fade.dart';
import 'app_glass.dart';

class FlareShell extends StatefulWidget {
  const FlareShell({
    super.key,
    required this.catalog,
    required this.store,
    this.sceneController,
    this.enableScene = true,
    this.sceneRevision = 0,
    this.startupCovered = false,
    this.coach,
    this.membership,
    this.trainingPageBuilder,
  });
  final Catalog catalog;

  /// Optional SDK chat host used by embedding and test flows.
  final FlareCoachChat? coach;
  final FlareMembership? membership;
  final Widget Function(uc.TrainingPlan plan)? trainingPageBuilder;
  final LearningStore store;
  final SceneController? sceneController;
  final bool enableScene;
  final int sceneRevision;
  final bool startupCovered;
  @override
  State<FlareShell> createState() => _FlareShellState();
}

class _FlareShellState extends State<FlareShell> with WidgetsBindingObserver {
  static const _trainingHubTab = 4;
  late final SceneController _scene;
  int _tab = 0;
  bool _configured = false;
  bool _configuring = false;
  bool _didPresentScene = false;
  GlobalKey _liveSceneKey = GlobalKey();
  DateTime? _lastAutoRestart;
  late bool _appActive;
  late bool _appVisible;
  bool? _recoveryWasPlaying;
  double? _recoveryTime;
  bool _settings = false;
  bool _about = false;
  bool _trainingOpen = false;
  Drill? _drill;
  TrainingRoutine? _routine;
  _RoutineEdit? _editing;
  final _flarePlanTrail = <_FlarePlanTarget>[];
  FlareCoachChat? _coach;
  FlareCoachChat get coach => _coach ??=
      widget.coach ??
      FlareCoachChat(store: store, membership: widget.membership);
  bool _membershipOpen = false;
  late final _usage = CoachUsageStore.device();
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
  final _homeSceneBounds = GlobalKey();
  final _hubSceneBounds = GlobalKey();
  final _trainingHubState = GlobalKey<FlareTrainingHubPageState>();
  int _trainingHubOrigin = 0;
  bool _trainingHubInitialMuscles = false;
  Timer? _trainingFlightDeadline;
  double _trainingEntryTime = 0;
  bool _trainingActorFlight = false;
  bool _trainingHubLiveEntry = false;
  bool _trainingFlightLanded = false;
  bool _returningToWatch = false;
  bool _returnFlightExposed = false;
  bool _returnFlightUsesHome = false;

  bool get _showHomeActor =>
      _trainingActorFlight &&
      (_returningToWatch ? _returnFlightExposed : !_trainingFlightLanded);

  bool get _hubOwnsScene =>
      _tab == _trainingHubTab &&
      (!_trainingActorFlight ||
          (_returningToWatch ? !_returnFlightUsesHome : _trainingFlightLanded));

  bool get _homeCoveredByPlan => _tab == 0 && _flarePlanTrail.isNotEmpty;

  /// One sheet at a time: a quick double tap must not stack two sheets.
  bool _sheetOpen = false;
  Catalog get catalog => widget.catalog;
  LearningStore get store => widget.store;

  @override
  void initState() {
    super.initState();
    // Async bootstrap may mount this shell after the app already entered
    // the background, before this observer could receive that transition.
    final lifecycle = WidgetsBinding.instance.lifecycleState;
    _appActive = lifecycle == null || lifecycle == AppLifecycleState.resumed;
    _appVisible =
        lifecycle == null ||
        lifecycle == AppLifecycleState.resumed ||
        lifecycle == AppLifecycleState.inactive;
    _scene = widget.sceneController ?? SceneController();
    _scene.addListener(_sceneChanged);
    store.addListener(_storeChanged);
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void didUpdateWidget(covariant FlareShell oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.sceneRevision != oldWidget.sceneRevision) {
      _liveSceneKey = GlobalKey();
    }
    if (!identical(widget.catalog, oldWidget.catalog)) {
      if (_drill != null) _drill = catalog.drillById(_drill!.id);
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

  void _restartScene() {
    _recoveryTime = _scene.time;
    _recoveryWasPlaying = _appActive && _scene.playing;
    _scene.pause();
    setState(() {
      _configured = false;
      _liveSceneKey = GlobalKey();
    });
  }

  void _sceneChanged() {
    if (!mounted || _configuring) return;
    if (_scene.errorCode == SceneController.processTerminated) {
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
    if (!_scene.ready) {
      // Recreated views and recovered WebGL contexts both need fresh settings.
      // Their provisional clock must not replace the user's saved position.
      _configured = false;
      _didPresentScene = false;
      _refreshView();
      return;
    }
    if (_scene.ready && !_configured) {
      final restoredTime = _recoveryTime ?? store.lastTime;
      _configuring = true;
      _configured = true;
      // A replacement WebView has no viewport state, even when its size is
      // unchanged. Install the inset before seek/play can frame the new view.
      _sentInset = _viewInsetFor(context);
      _insetSent = true;
      _scene.setViewInset(_sentInset, animate: false);
      _scene.setSpeed(store.settings.speed);
      _scene.setQuality(_quality);
      if (_sceneTheme != null) _scene.setTheme(_sceneTheme!);
      _sceneLanguage = null;
      _scene.setTime(restoredTime);
      if (_appActive &&
          (_recoveryWasPlaying ?? true) &&
          store.safetyAccepted &&
          _watchVisible) {
        _scene.play();
      }
      _recoveryWasPlaying = null;
      _recoveryTime = null;
      // A recovered WebGL context may still belong to a hidden, prewarmed
      // view. Let it produce its replacement frame before hiding it again.
      _scene.setVisible(_appVisible);
      if (widget.enableScene) _scene.requestPresentation();
      _configuring = false;
      _refreshView();
      return;
    }
    if (_scene.presented && !_didPresentScene) {
      _didPresentScene = true;
      // First-use welcome still requires explicit acknowledgement. Its model
      // is now prewarmed, so stop its idle loop until the action is shown.
      if (!_watchVisible && !_hubOwnsScene) _scene.setVisible(false);
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
            _openMusclePlan(group);
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
      !_inPlan &&
      !_settings &&
      !_trainingOpen;

  bool get _inPlan =>
      _routine != null || _editing != null || _flarePlanTrail.isNotEmpty;

  void _clearPlan() {
    _routine = null;
    _editing = null;
    _flarePlanTrail.clear();
  }

  bool get _preparingScene => widget.enableScene && !_scene.presented;

  void _syncSceneVisibility() {
    final hubVisible =
        _hubOwnsScene &&
        !_inPlan &&
        _drill == null &&
        !_settings &&
        !_trainingOpen;
    _scene.setVisible(
      _appVisible &&
          (_watchVisible ||
              _preparingScene ||
              _trainingActorFlight ||
              hubVisible),
    );
    if (!_watchVisible) {
      _scene.pause();
      if (store.safetyAccepted && (_scene.presented || !widget.enableScene)) {
        unawaited(store.setLastTime(_scene.time));
      }
    }
  }

  void _changeTab(int value) {
    if (_tab == _trainingHubTab && value != _trainingHubTab) {
      _scene.leaveTrainingHub();
    }
    setState(() {
      _tab = value;
      _drill = null;
      _clearPlan();
      _settings = false;
      _about = false;
      _libraryQuery = '';
    });
    _syncSceneVisibility();
  }

  void _enterTrainingHub({bool muscles = false}) {
    _trainingHubOrigin = _tab;
    _trainingHubInitialMuscles = muscles;
    _trainingEntryTime = _scene.time;
    _trainingActorFlight =
        _trainingHubOrigin == 0 &&
        widget.enableScene &&
        _scene.presented &&
        _scene.errorCode == null;
    _trainingHubLiveEntry = _trainingActorFlight;
    _trainingFlightLanded = false;
    _changeTab(_trainingHubTab);
    if (!_trainingActorFlight) return;
    _trainingFlightDeadline = Timer(const Duration(seconds: 3), () {
      if (mounted && !_returningToWatch && !_trainingFlightLanded) {
        // Keep the existing renderer and transfer it even if the flight
        // acknowledgement was delayed.
        _scene.finishTrainingFlight();
        setState(() => _trainingFlightLanded = true);
      }
    });
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      if (!mounted || !_trainingActorFlight) return;
      final geometry = _trainingStageGeometry();
      if (geometry == null) {
        _finishTrainingFlight();
        return;
      }
      final deadline = _trainingFlightDeadline;
      await _scene.flyTrainingActor(
        time: _trainingEntryTime,
        yaw: _trainingHubState.currentState?.angleYaw ?? 0,
        top: geometry.top,
        height: geometry.height,
        duration: FlareMotion.of(context, const Duration(milliseconds: 650)),
      );
      if (!mounted ||
          !_trainingActorFlight ||
          _trainingFlightLanded ||
          _trainingFlightDeadline != deadline) {
        return;
      }
      await _trainingHubState.currentState?.retainEntryFrame();
      if (!mounted ||
          !_trainingActorFlight ||
          _trainingFlightLanded ||
          _trainingFlightDeadline != deadline) {
        return;
      }
      // Move the same platform view to the hub after the landing frame.
      _scene.finishTrainingFlight();
      setState(() => _trainingFlightLanded = true);
    });
  }

  ({double top, double height, double homeHeight})? _trainingStageGeometry() {
    final home = _homeSceneBounds.currentContext?.findRenderObject();
    final hub = _hubSceneBounds.currentContext?.findRenderObject();
    if (home is! RenderBox ||
        hub is! RenderBox ||
        !home.hasSize ||
        !hub.hasSize ||
        hub.size.isEmpty) {
      return null;
    }
    return (
      top:
          hub.localToGlobal(Offset.zero).dy -
          home.localToGlobal(Offset.zero).dy,
      height: hub.size.height,
      homeHeight: home.size.height,
    );
  }

  Future<void> _returnFromTrainingHub() async {
    final hub = _trainingHubState.currentState;
    if (hub == null) {
      _changeTab(0);
      return;
    }
    setState(() {
      _trainingActorFlight = true;
      _returningToWatch = true;
      _returnFlightExposed = false;
      _returnFlightUsesHome = false;
    });
    final deadline = _trainingFlightDeadline = Timer(
      const Duration(seconds: 3),
      _finishTrainingFlight,
    );
    final shot = hub.beginReturn();
    if (shot == null) {
      _finishTrainingFlight();
      return;
    }
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      if (!mounted || _trainingFlightDeadline != deadline) return;
      final geometry = _trainingStageGeometry();
      if (geometry == null) {
        _finishTrainingFlight();
        return;
      }
      await _scene.flyTrainingActor(
        time: shot.time,
        yaw: shot.yaw,
        top: geometry.top,
        height: geometry.height,
        homeHeight: geometry.homeHeight,
        duration: FlareMotion.of(context, const Duration(milliseconds: 650)),
        returning: true,
        onPrepared: () {
          if (!mounted || _trainingFlightDeadline != deadline) return;
          setState(() {
            _returnFlightUsesHome = true;
            _returnFlightExposed = true;
          });
        },
      );
      if (mounted && _trainingFlightDeadline == deadline) {
        _finishTrainingFlight();
      }
    });
    WidgetsBinding.instance.ensureVisualUpdate();
  }

  Future<void> _reverseTrainingEntry() async {
    if (_trainingFlightLanded) {
      await _returnFromTrainingHub();
      return;
    }
    _trainingFlightDeadline?.cancel();
    final deadline = _trainingFlightDeadline = Timer(
      const Duration(seconds: 3),
      _finishTrainingFlight,
    );
    setState(() {
      _returningToWatch = true;
      _returnFlightExposed = true;
      _returnFlightUsesHome = true;
    });
    await _scene.reverseTrainingFlight();
    if (mounted && _trainingFlightDeadline == deadline) {
      _finishTrainingFlight();
    }
  }

  void _onTrainingHubPresented() {
    if (!_trainingActorFlight || _returningToWatch) return;
    final deadline = _trainingFlightDeadline;
    // Allow the transferred platform view to composite before unlocking
    // the destination controls.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted && _trainingFlightDeadline == deadline) {
          _finishTrainingFlight();
        }
      });
      WidgetsBinding.instance.ensureVisualUpdate();
    });
  }

  void _finishTrainingFlight() {
    if (!_trainingActorFlight || !mounted) return;
    _trainingFlightDeadline?.cancel();
    _trainingFlightDeadline = null;
    if (_returningToWatch) _scene.leaveTrainingHub();
    setState(() {
      _trainingActorFlight = false;
      if (_returningToWatch) {
        _tab = 0;
        _returningToWatch = false;
        _returnFlightExposed = false;
        _returnFlightUsesHome = false;
      }
    });
    // Keep the landing frame until the destination canvas has been unveiled.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted || _trainingActorFlight) return;
      _syncSceneVisibility();
      _scene.finishTrainingFlight();
    });
  }

  void _openDrill(Drill drill) {
    _scene.pause();
    setState(() => _drill = drill);
    _syncSceneVisibility();
  }

  void _openAnglePlan(Phase phase) {
    _openFlarePlan(_FlarePlanTarget.angle(phase.source));
  }

  void _openMusclePlan(MuscleGroup group) {
    _openFlarePlan(_FlarePlanTarget.muscle(group.id));
  }

  void _openFlarePlan(_FlarePlanTarget target) {
    setState(() => _flarePlanTrail.add(target));
    _syncSceneVisibility();
  }

  void _openFlarePlanDrill(String id) {
    if (catalog.drillById(id) case final drill?) {
      _openDrill(drill);
    } else {
      unawaited(
        FlareShared.openDetail(context, id, soundEnabled: store.settings.sound),
      );
    }
  }

  /// Content, dose and saving stay with Flare; the SDK launcher owns poster
  /// entry, on-demand public media and the no-flash handoff into the player.
  Future<sdk.SessionResult?> _launchTraining(
    BuildContext context,
    uc.TrainingPlan plan, {
    Future<bool> Function()? onStarting,
    VoidCallback Function()? holdTransition,
  }) {
    final policy =
        sdk.TrainingMediaPolicyScope.read(context) ?? FlarePublicMedia.current;
    final ids = plan.exerciseIds.toList();
    String? posterFor(String id) => policy?.actionFor(id) != null
        ? policy!.posterAssetFor(id)
        : policy?.posterAssetFor(id) ??
              '${FlarePublicMedia.posterRoot}$id.webp';
    return sdk.TrainerLauncher.open<sdk.SessionResult>(
      context,
      builder: (_) =>
          widget.trainingPageBuilder?.call(plan) ??
          FlareTrainingPage(plan: plan, catalog: catalog, store: store),
      firstPosterAsset: ids.isEmpty ? null : posterFor(ids.first),
      posterAssets: [for (final id in ids) ?posterFor(id)],
      mediaPolicy: policy,
      planActionIds: ids,
      theme: trainerTheme(context),
      onStarting: onStarting,
      holdTransition: holdTransition,
      settings: const RouteSettings(name: '/training'),
    );
  }

  Future<void> _startPlan(
    uc.TrainingPlan plan, {
    bool premiumRequired = true,
  }) async {
    if (_trainingOpen || plan.items.isEmpty) return;
    if (premiumRequired && !await _requirePremium()) return;
    if (!mounted || _trainingOpen) return;
    FlareHaptics.light();
    DrillPlaybackCoordinator.shared.pauseAll();
    setState(() => _trainingOpen = true);
    _syncSceneVisibility();
    try {
      await _launchTraining(context, plan);
    } finally {
      if (mounted) {
        setState(() => _trainingOpen = false);
        _syncSceneVisibility();
      }
    }
  }

  Future<void> _openMembership() async {
    final membership = widget.membership;
    if (membership == null || _membershipOpen || !mounted) return;
    _membershipOpen = true;
    try {
      await Navigator.of(context).push<bool>(
        MaterialPageRoute(
          settings: const RouteSettings(name: '/membership'),
          builder: (_) =>
              FlareMembershipPage(membership: membership, catalog: catalog),
        ),
      );
    } finally {
      _membershipOpen = false;
    }
  }

  Future<bool> _requirePremium() async {
    final membership = widget.membership;
    if (membership == null || membership.isPremium) return true;
    await _openMembership();
    return mounted && membership.isPremium;
  }

  Future<void> _editRoutine(_RoutineEdit edit) async {
    if (!await _requirePremium() || !mounted) return;
    setState(() => _editing = edit);
  }

  /// The SDK chat is its own route; Flare supplies navigation and access.
  // ignore: unused_element — kept for the disabled AI entry points.
  Future<void> _openCoach() async {
    if (!await _requirePremium() || !mounted) return;
    if (!coach.configured) {
      showMembershipMessage(context, context.strings.premiumUnavailable);
      return;
    }
    _scene.pause();
    final navigator = Navigator.of(context);
    void leaveChat(VoidCallback change) {
      navigator.popUntil((route) => route.isFirst);
      if (mounted) setState(change);
    }

    await navigator.push<void>(
      MaterialPageRoute(
        settings: const RouteSettings(name: '/coach'),
        builder: (_) => FlareCoachChatPage(
          coach: coach,
          onPremiumRequired: widget.membership == null ? null : _openMembership,
          actions: CoachChatHostActions(
            onStartTraining: (context, request) async {
              if (!await _requirePremium() || !context.mounted) return null;
              return _launchTraining(
                context,
                request.plan.plan,
                onStarting: request.onStarting,
                holdTransition: request.holdTransition,
              );
            },
            onOpenAction: (context, request) => FlareShared.openDetail(
              context,
              request.actionId,
              soundEnabled: store.settings.sound,
            ),
            onOpenLibrary: (context, request) => Navigator.of(context).push(
              MaterialPageRoute<void>(
                builder: (libraryContext) => Scaffold(
                  body: FlareSharedLibraryPage(
                    presentationCatalog: catalog,
                    soundEnabled: store.settings.sound,
                    onBack: () => Navigator.pop(libraryContext),
                    onOpenStraightLegFlare: (drill) {
                      navigator.popUntil((route) => route.isFirst);
                      if (mounted) _openDrill(drill);
                    },
                  ),
                ),
              ),
            ),
            onOpenSavedPlans: (_) async => leaveChat(() {
              _clearPlan();
              _drill = null;
              _settings = false;
              _about = false;
              _tab = 2;
            }),
            onOpenCustomPlan: (_) async {
              if (!await _requirePremium() || !mounted) return;
              leaveChat(() {
                _drill = null;
                _settings = false;
                _about = false;
                _tab = 2;
                _editing = const _RoutineEdit();
              });
            },
            onOpenSettings: (_) async => leaveChat(() {
              _clearPlan();
              _drill = null;
              _settings = true;
              _about = false;
            }),
          ),
        ),
      ),
    );
    if (mounted) _syncSceneVisibility();
  }

  uc.TrainingPlan _authoredTrainingPlan(
    FlarePlan plan,
    String title,
    String sceneTier,
    FlareShared shared,
  ) => shared.authoredPlan(
    plan,
    catalog,
    sceneTier,
    title: title,
    wristDirections: trainerWristDirections(context.strings),
  );

  Future<void> _startFlarePlan(
    String title,
    FlarePlan plan, {
    int? phaseSource,
  }) async {
    if (_trainingOpen) return;
    final sceneTier = store.settings.tier;
    try {
      final shared = FlareShared.current ?? await FlareShared.load();
      if (!mounted) return;
      await _startPlan(
        FlarePlanResume.recordAuthored(
          _authoredTrainingPlan(plan, title, sceneTier, shared),
          sceneTier: sceneTier,
          phaseSource: phaseSource,
        ),
      );
    } catch (_) {
      _showTrainingLoadFailure();
    }
  }

  Future<void> _continueTrainingPlan(FlarePlanResume resume) async {
    if (_trainingOpen || !resume.canContinue) return;
    try {
      final shared = FlareShared.current ?? await FlareShared.load();
      if (!mounted) return;
      final uc.TrainingPlan original;
      if (resume.authoredPlan case final authored?) {
        original = _authoredTrainingPlan(
          authored,
          resume.title,
          resume.sceneTier!,
          shared,
        );
      } else if (resume.routine case final routine?) {
        original =
            routine.sdkPlan?.copyWith(id: routine.id) ??
            trainingPlanFromDrills(
              title: routine.name,
              drills: routine.drills(catalog),
              id: routine.id,
              sourceCatalog: shared.catalog,
            );
      } else {
        return;
      }
      final remaining = resume.continueFrom(original, rhythms: shared.rhythms);
      if (remaining == null) {
        _showTrainingLoadFailure();
        return;
      }
      await _startPlan(remaining);
    } catch (_) {
      _showTrainingLoadFailure();
    }
  }

  void _showTrainingLoadFailure() {
    if (!mounted) return;
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(trainerLoadFailed(context.strings))));
  }

  Future<void> _startDrills(
    String title,
    List<Drill> drills, {
    String? id,
    bool premiumRequired = false,
  }) async {
    if (_trainingOpen || drills.isEmpty) return;
    try {
      final source = (FlareShared.current ?? await FlareShared.load()).catalog;
      if (!mounted) return;
      await _startPlan(
        trainingPlanFromDrills(
          title: title,
          drills: drills,
          id: id,
          sourceCatalog: source,
        ),
        premiumRequired: premiumRequired,
      );
    } catch (_) {
      _showTrainingLoadFailure();
    }
  }

  Future<void> _addToPlan(Drill drill) async {
    if (_sheetOpen) return;
    if (!await _requirePremium() || !mounted || _sheetOpen) return;
    _sheetOpen = true;
    final String? choice;
    try {
      choice = await showAddToPlanSheet(
        context,
        store: store,
        catalog: catalog,
        drill: drill,
      );
    } finally {
      _sheetOpen = false;
    }
    if (!mounted || choice == null) return;
    if (!await _requirePremium() || !mounted) return;
    if (choice == 'new') {
      setState(
        () => _editing = _RoutineEdit(seedIds: [drill.id], fromDrill: true),
      );
      return;
    }
    final name = store.routineById(choice)?.name ?? '';
    final success = await store.addToRoutine(
      choice,
      drill.id,
      sourceCatalog: FlareShared.current?.catalog,
    );
    if (!mounted) return;
    FlareHaptics.light();
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        SnackBar(
          content: Text(
            success
                ? context.strings.planAddedTo(name)
                : context.strings.saveFailed,
          ),
        ),
      );
  }

  Future<void> _copyRoutine(TrainingRoutine routine) async {
    if (!await _requirePremium() || !mounted) return;
    final plan = routine.sdkPlan;
    final copied = await store.createRoutine(
      routine.name,
      routine.drillIds,
      doses: routine.doses,
      source: routine.source,
      sdkPlan: plan?.copyWith(
        id: '${plan.id}-copy-${DateTime.now().microsecondsSinceEpoch}',
      ),
    );
    if (!mounted) return;
    if (copied != null) {
      setState(() => _routine = copied);
    } else {
      await _result(Future.value(false));
    }
  }

  void _deleteRoutine(TrainingRoutine routine) {
    final index = store.routines.indexWhere((row) => row.id == routine.id);
    setState(() {
      _editing = null;
      _routine = null;
    });
    final s = context.strings;
    unawaited(_result(store.deleteRoutine(routine.id)));
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        SnackBar(
          content: Text(s.planDeleted),
          duration: const Duration(seconds: 5),
          action: SnackBarAction(
            label: s.undo,
            onPressed: () => store.restoreRoutine(routine, index),
          ),
        ),
      );
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
    if (_trainingOpen) return;
    if (_returningToWatch) return;
    if (_trainingActorFlight) {
      unawaited(_reverseTrainingEntry());
      return;
    } else if (_tab == _trainingHubTab &&
        !_inPlan &&
        _drill == null &&
        !_settings) {
      if (_trainingHubOrigin != 0) {
        _changeTab(_trainingHubOrigin);
        return;
      }
      if (widget.enableScene && _scene.presented && _scene.errorCode == null) {
        unawaited(_returnFromTrainingHub());
        return;
      }
      _changeTab(0);
      return;
    }
    setState(() {
      if (_about) {
        _about = false;
      } else if (_editing != null) {
        _editing = null;
      } else if (_drill != null) {
        _drill = null;
      } else if (_flarePlanTrail.isNotEmpty) {
        _flarePlanTrail.removeLast();
      } else if (_routine != null) {
        _routine = null;
      } else if (_settings) {
        _settings = false;
        _about = false;
      } else {
        _tab = 0;
        _libraryQuery = '';
      }
    });
    _syncSceneVisibility();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    _appActive = state == AppLifecycleState.resumed;
    // Losing focus pauses playback but does not make an on-screen view hidden.
    _appVisible = _appActive || state == AppLifecycleState.inactive;
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
      unawaited(widget.membership?.refresh());
      _syncSceneVisibility();
    }
  }

  @override
  void dispose() {
    _trainingFlightDeadline?.cancel();
    if (_trainingActorFlight) _scene.finishTrainingFlight();
    _scene.removeListener(_sceneChanged);
    store.removeListener(_storeChanged);
    if (widget.coach == null) unawaited(_coach?.close());
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
      _scene.setLocalization(
        sceneLocalization(
          s,
          catalog.groups,
          rtl: Directionality.of(context) == TextDirection.rtl,
        ),
      );
    }
    final drill = _drill;
    final canBack = drill != null || _inPlan || _settings || _tab != 0;
    final route = _route(context);
    final edgeToEdgePlan = route.$4 is FlarePlanDetailPage;
    final hasHub = _tab == _trainingHubTab;
    final hubInFront = route.$1 == 'training-hub' && !_trainingOpen;
    if (route.$1 != _stageKey) {
      // Keep the live stage on screen while a page slides over or off it.
      if (_stageKey != null && (_stageKey == 'watch' || route.$1 == 'watch')) {
        _holdWatch = true;
      }
      _stageKey = route.$1;
    }
    final shell = PopScope(
      canPop: !canBack && !_trainingOpen,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop && !_trainingOpen) _back();
      },
      child: DecoratedBox(
        key: _stageBackdropKey,
        // The stage surface is the supplied graphite token, shared by the
        // floating header, transparent 3D view and compact transport.
        decoration: BoxDecoration(gradient: _stageGradient()),
        child: Scaffold(
          backgroundColor:
              _watchVisible || _holdWatch || _trainingActorFlight || hasHub
              ? Colors.transparent
              : FlareColors.background,
          // Page navigation and the live 3D surface each own their top inset.
          body: SafeArea(
            top: false,
            bottom: !edgeToEdgePlan && !hasHub,
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
                              setState(() {
                                _settings = true;
                                _about = false;
                              });
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
                              !_watchVisible &&
                              !_homeCoveredByPlan &&
                              !_holdWatch &&
                              !_preparingScene &&
                              !_trainingActorFlight,
                          child: SafeArea(
                            top: false,
                            left: false,
                            right: false,
                            // A full-bleed plan uses the safe area for its own
                            // controls. Keep the covered home viewport steady.
                            bottom: edgeToEdgePlan && !hasHub,
                            child: Padding(
                              padding: EdgeInsets.only(
                                bottom: _trainingActorFlight
                                    ? MediaQuery.viewPaddingOf(context).bottom
                                    : 0,
                              ),
                              child: IgnorePointer(
                                ignoring:
                                    _trainingActorFlight || _homeCoveredByPlan,
                                child: ExcludeSemantics(
                                  excluding: _homeCoveredByPlan,
                                  child: Builder(builder: _watchPage),
                                ),
                              ),
                            ),
                          ),
                        ),
                        FlareStage(
                          pageKey: route.$1,
                          depth: route.$2,
                          modal: route.$3,
                          cover: hubInFront && _trainingHubOrigin == 0,
                          anchorIncomingUnderlayHitTest:
                              hubInFront &&
                              _trainingActorFlight &&
                              !_returningToWatch,
                          transparentUnderlay: hasHub,
                          underlay: hasHub
                              ? ExcludeSemantics(
                                  excluding: !hubInFront || _returningToWatch,
                                  child: IgnorePointer(
                                    ignoring: !hubInFront || _returningToWatch,
                                    child: KeyedSubtree(
                                      key: const ValueKey('training-hub'),
                                      child: FlareTrainingHubPage(
                                        key: _trainingHubState,
                                        catalog: catalog,
                                        sceneTier: store.settings.tier,
                                        actorBody: flareTeachingScene,
                                        quality: _quality,
                                        enableScene: widget.enableScene,
                                        initialTime: _trainingEntryTime,
                                        initialMuscles:
                                            _trainingHubInitialMuscles,
                                        mountScene: _hubOwnsScene,
                                        sharedController: _scene,
                                        sharedSceneView: _hubOwnsScene
                                            ? _liveScene(interactive: false)
                                            : null,
                                        actorHandoff: _showHomeActor,
                                        liveEntry: _trainingHubLiveEntry,
                                        interactionLocked: _trainingActorFlight,
                                        leaving: _returnFlightExposed,
                                        sceneBoundsKey: _hubSceneBounds,
                                        onScenePresented:
                                            _onTrainingHubPresented,
                                        onAngleYawChanged: (yaw) {
                                          if (_trainingActorFlight &&
                                              !_returningToWatch &&
                                              !_trainingFlightLanded) {
                                            _scene.rotateTrainingFlight(yaw);
                                          }
                                        },
                                        visible:
                                            hubInFront &&
                                            !_returnFlightExposed &&
                                            _appVisible &&
                                            _appActive,
                                        onBack: _back,
                                        onAngle: _openAnglePlan,
                                        onMuscle: _openMusclePlan,
                                      ),
                                    ),
                                  ),
                                )
                              : null,
                          onSettled: () {
                            if (mounted && _holdWatch) {
                              setState(() => _holdWatch = false);
                            }
                          },
                          onSwipeBack:
                              canBack &&
                                  !_trainingOpen &&
                                  (route.$4 != null || hubInFront)
                              ? _back
                              : null,
                          backChip: route.$4 != null || hubInFront,
                          pinSwipeBack: route.$2 > 1,
                          backChipBuilder: (_) =>
                              const FlareBackChip(onPressed: _noop),
                          child: route.$4,
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
            onEnter: (_) async {
              final accepted = await store.acknowledgeSafety();
              if (!mounted || !accepted) return;
              _syncSceneVisibility();
              if (_scene.presented && _watchVisible) _scene.play();
            },
          ),
      ],
    );
  }

  static void _noop() {}

  int get _hubDepth => _trainingHubOrigin == 0 ? 1 : 2;

  int get _planDepth {
    final parent = _tab == _trainingHubTab ? _hubDepth : (_tab == 0 ? 0 : 1);
    return parent + _flarePlanTrail.length;
  }

  int get _drillDepth => _flarePlanTrail.isNotEmpty
      ? _planDepth + 1
      : _routine != null
      ? 3
      : _tab == 0
      ? 1
      : 2;

  /// The current surface key, depth, modal flag and page (null is the stage).
  (String, int, bool, Widget?) _route(BuildContext context) {
    final s = context.strings;
    final drill = _drill;
    if (_editing case final edit?) {
      final routine = edit.routineId == null
          ? null
          : store.routineById(edit.routineId!);
      if (routine?.sdkPlan case final plan?) {
        return (
          'edit:${routine!.id}',
          3,
          false,
          SdkPlanEditorPage(
            plan: plan,
            catalog: catalog,
            initialTier: store.settings.tier,
            onBack: _back,
            onSaved: (updated) async {
              if (!await _requirePremium() || !mounted) return false;
              final saved = await store.updateRoutine(
                routine.id,
                name: TrainingRoutine.truncateName(updated.title),
                sdkPlan: updated,
              );
              if (!mounted) return false;
              if (saved) {
                setState(() {
                  _editing = null;
                  _routine = store.routineById(routine.id);
                });
              }
              return saved;
            },
          ),
        );
      }
      return (
        'edit:${edit.routineId ?? 'new'}',
        drill != null ? _drillDepth + 1 : 3,
        false,
        RoutineEditorPage(
          key: ValueKey('editor:${edit.routineId ?? edit.seedIds.join(',')}'),
          catalog: catalog,
          store: store,
          routine: routine,
          seedDrillIds: edit.seedIds,
          onBack: _back,
          allowSave: _requirePremium,
          onSaved: (saved) {
            setState(() {
              _editing = null;
              if (!edit.fromDrill) {
                _routine = saved;
              }
            });
            if (edit.fromDrill) {
              ScaffoldMessenger.of(context)
                ..hideCurrentSnackBar()
                ..showSnackBar(
                  SnackBar(content: Text(s.planAddedTo(saved.name))),
                );
            }
          },
          onDeleted: routine == null ? null : () => _deleteRoutine(routine),
        ),
      );
    }
    if (drill != null) {
      return (
        'drill:${drill.id}',
        _drillDepth,
        false,
        DrillDetailPage(
          drill: drill,
          group: catalog.groupById(drill.groupId),
          demoSpeed: store.settings.speed,
          onBack: _back,
          onAddToPlan: () => _addToPlan(drill),
          onStart: () => _startDrills(drill.name, [drill]),
        ),
      );
    }
    if (_flarePlanTrail.lastOrNull case final target?) {
      final phaseSource = target.phaseSource;
      final phase = phaseSource == null
          ? null
          : catalog.phaseBySource(phaseSource);
      final group = target.groupId == null
          ? null
          : catalog.groupById(target.groupId!);
      final plans = phaseSource != null
          ? catalog.plansForAngle(phaseSource)
          : catalog.plansForMuscle(target.groupId!);
      final title = phase?.name ?? group!.shortLabel;
      return (
        'flare-plan:${phaseSource ?? target.groupId}',
        _planDepth,
        false,
        FlarePlanDetailPage(
          title: title,
          membership: widget.membership,
          phase: phase,
          emptyTargetGroup: group,
          plans: plans,
          selectedTier: target.selectedTier,
          catalog: catalog,
          store: store,
          onTierChanged: (value) => setState(() => target.selectedTier = value),
          onMuscle: _openMusclePlan,
          onDrill: _openFlarePlanDrill,
          onBack: _back,
          onStart: (plan) =>
              _startFlarePlan(title, plan, phaseSource: phaseSource),
        ),
      );
    }
    if (_routine case final viewed?) {
      final routine = store.routineById(viewed.id) ?? viewed;
      final drills = routine.drills(catalog);
      return (
        'routine:${routine.id}',
        2,
        false,
        PlanDetailPage(
          soundEnabled: store.settings.sound,
          title: routine.name,
          drills: drills,
          onBack: _back,
          onDrill: _openDrill,
          sdkPlan: routine.sdkPlan,
          catalog: catalog,
          onStart: () async {
            if (routine.sdkPlan case final plan?) {
              await _startPlan(plan.copyWith(id: routine.id));
            } else {
              await _startDrills(
                routine.name,
                drills,
                id: routine.id,
                premiumRequired: true,
              );
            }
          },
          onEdit: () => _editRoutine(_RoutineEdit(routineId: routine.id)),
          onCopy: widget.membership == null
              ? null
              : () => _copyRoutine(routine),
        ),
      );
    }
    if (_settings && _about) {
      return ('about', 2, false, _aboutPage(context));
    }
    if (_settings) return ('settings', 1, false, _settingsPage(context));
    return switch (_tab) {
      0 => ('watch', 0, false, null),
      _trainingHubTab => ('training-hub', _hubDepth, false, null),
      1 => (
        'tab1',
        1,
        false,
        FlareShared.current != null && FlarePublicMedia.current != null
            ? FlareSharedLibraryPage(
                onBack: _back,
                presentationCatalog: catalog,
                soundEnabled: store.settings.sound,
                onOpenStraightLegFlare: _openDrill,
              )
            : LibraryPage(
                catalog: catalog,
                store: store,
                initialQuery: _libraryQuery,
                onQueryChanged: (value) => _libraryQuery = value,
                onBack: _back,
                onDrill: _openDrill,
              ),
      ),
      2 => ('tab2', 1, false, _plansPage()),
      _ => (
        'tab$_tab',
        1,
        false,
        ProgressPage(
          catalog: catalog,
          store: store,
          onBack: _back,
          onDrill: _openDrill,
          onStart: () => _changeTab(1),
        ),
      ),
    };
  }

  Widget _plansPage() {
    final resume = FlarePlanResume.resolve(
      catalog: catalog,
      sessions: store.trainerSessions,
      routines: store.routines,
      legacySessions: store.sessions,
      preferredSceneTier: store.settings.tier,
    );
    return PlansPage(
      catalog: catalog,
      store: store,
      resume: resume,
      onBack: _back,
      onRoutine: (routine) => setState(() => _routine = routine),
      onNewRoutine: () => _editRoutine(const _RoutineEdit()),
      onOpenAngle: _openAnglePlan,
      onOpenMuscle: _openMusclePlan,
      onAllAngles: _enterTrainingHub,
      onAllMuscles: () => _enterTrainingHub(muscles: true),
      onContinue: () {
        if (resume != null) unawaited(_continueTrainingPlan(resume));
      },
    );
  }

  Widget _watchPage(BuildContext context) {
    final s = context.strings;
    return Stack(
      fit: StackFit.expand,
      children: [
        SafeArea(bottom: false, child: _watchContent(context)),
        PositionedDirectional(
          top: 0,
          start: 0,
          end: 0,
          child: Opacity(
            opacity: _trainingActorFlight ? 0 : 1,
            child: FlareNavBar(
              leading: FlareNavChip(
                key: const ValueKey('home-menu-chip'),
                label: s.more,
                icon: Icons.menu_rounded,
                onPressed: _showMore,
              ),
              center: IgnorePointer(
                child: FittedBox(
                  key: const ValueKey('home-wordmark'),
                  fit: BoxFit.scaleDown,
                  child: _HomeWordmark(label: s.motionBrand),
                ),
              ),
              topInset: FlareGeometry.navSafeTop(context),
              glass: true,
              blurBackdrop: false,
            ),
          ),
        ),
      ],
    );
  }

  Widget _watchContent(BuildContext context) {
    final s = context.strings;
    final phase = catalog.phaseBySource(_scene.phase) ?? catalog.phases.first;
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
            16,
            (54 - MediaQuery.viewPaddingOf(context).top).clamp(8, 54),
            16,
            10,
          ),
          child: SizedBox(key: const ValueKey('home'), height: headingHeight),
        ),
        Expanded(
          child: LayoutBuilder(
            builder: (context, box) {
              // The same home 3D view stays mounted under navigation.
              _stageArea = box.maxHeight;
              final inset = _viewInsetFor(context);
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
                  SizedBox.expand(
                    key: _homeSceneBounds,
                    child: !widget.enableScene
                        ? ColoredBox(color: FlareColors.background)
                        : _hubOwnsScene
                        ? const SizedBox.expand()
                        : _liveScene(interactive: !_trainingActorFlight),
                  ),
                  // The hub owns presentation while the live view is in
                  // transit, even while the home stage is still visible.
                  if (_tab != _trainingHubTab)
                    SceneRevealLayer(
                      enabled: widget.enableScene && !widget.startupCovered,
                      presented: _scene.presented,
                      bottomInset: inset,
                      backdrop: _StageBackdropCover(
                        ancestor: _stageBackdropKey,
                      ),
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
                              onRetry: _restartScene,
                            ),
                    ),
                  Opacity(
                    opacity: _trainingActorFlight ? 0 : 1,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Expanded(
                          child: Stack(
                            fit: StackFit.expand,
                            children: [
                              Positioned(
                                right: 20,
                                bottom: box.maxWidth < 380 ? 228 : 18,
                                child: ConstrainedBox(
                                  constraints: BoxConstraints(
                                    maxWidth: box.maxWidth < 380
                                        ? box.maxWidth * .46
                                        : box.maxWidth - 218,
                                  ),
                                  child: _homeTrainingButton(context),
                                ),
                              ),
                            ],
                          ),
                        ),
                        FadeSlideIn(
                          key: const ValueKey('transport'),
                          offset: 10,
                          child: _transport(context, phase),
                        ),
                      ],
                    ),
                  ),
                ],
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _liveScene({bool interactive = true}) => SceneView(
    key: _liveSceneKey,
    controller: _scene,
    body: flareTeachingScene,
    interactive: interactive,
  );

  /// Height of the transport chrome over the bottom of the home 3D view.
  double _viewInsetFor(BuildContext context) {
    if (_stageArea <= 0) return 0;
    return _transportHeightFor(context) +
        (30 - MediaQuery.viewPaddingOf(this.context).bottom)
            .clamp(8, 30)
            .toDouble();
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

  // ~72pt: 12pt padding around one 48pt row (phase line + compact timeline).
  // A locale whose longest phase name wraps at this width gets a second
  // line for every phase, so the bar (and the 3D inset) stays put while
  // playing.
  double _transportHeightFor(BuildContext context) {
    final scaler = MediaQuery.textScalerOf(context);
    final lines = _transportNameLines(context);
    return (scaler.scale(13) * 1.25 * lines + 32 + 24)
        .clamp(72, double.infinity)
        .toDouble();
  }

  String? _nameLinesKey;
  int _nameLines = 1;

  TextStyle _phaseTextStyle(BuildContext context) =>
      DefaultTextStyle.of(context).style.merge(
        const TextStyle(
          fontSize: 13,
          height: 1.25,
          fontWeight: FontWeight.w600,
        ),
      );

  int _transportNameLines(BuildContext context) {
    final scaler = MediaQuery.textScalerOf(context);
    final width = MediaQuery.sizeOf(context).width;
    final style = _phaseTextStyle(context);
    final phases = catalog.phases;
    final anglePlans = [
      for (final p in phases)
        if (catalog.plansForAngle(p.source).isNotEmpty) p.source,
    ];
    final key =
        '$width|${scaler.scale(13)}|${style.fontFamily}|${phases.map((p) => p.name).join('|')}|$anglePlans';
    if (key == _nameLinesKey) return _nameLines;
    final number = TextPainter(
      text: TextSpan(
        text: '00',
        style: style.copyWith(
          fontFeatures: const [FontFeature.tabularFigures()],
        ),
      ),
      textScaler: scaler,
      textDirection: TextDirection.ltr,
    )..layout();
    // 20 margins, 12 padding, 48 play, 16 gap, number, 6 gap.
    final available = width - 40 - 24 - 48 - 16 - number.width - 6;
    number.dispose();
    var lines = 1;
    for (final phase in phases) {
      final width = anglePlans.contains(phase.source)
          ? available - FlareGeometry.rowChevron - 4
          : available;
      final painter = TextPainter(
        text: TextSpan(text: phase.name, style: style),
        textScaler: scaler,
        textDirection: Directionality.of(context),
        maxLines: 2,
      )..layout(maxWidth: width.clamp(1, double.infinity).toDouble());
      if (painter.computeLineMetrics().length > 1) lines = 2;
      painter.dispose();
      if (lines == 2) break;
    }
    _nameLinesKey = key;
    return _nameLines = lines;
  }

  Widget _phaseTitle(Phase phase) {
    final canOpen =
        !_scene.playing && catalog.plansForAngle(phase.source).isNotEmpty;
    final row = Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          phase.source.toString().padLeft(2, '0'),
          style: TextStyle(
            color: FlareColors.accentInk,
            fontSize: 13,
            height: 1.25,
            fontWeight: FontWeight.w600,
            fontFeatures: const [FontFeature.tabularFigures()],
          ),
        ),
        const SizedBox(width: 6),
        Expanded(
          child: Text(
            phase.name,
            key: const ValueKey('home-phase-name'),
            maxLines: 2,
            style: const TextStyle(
              fontSize: 13,
              height: 1.25,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        if (canOpen) ...[
          const SizedBox(width: 4),
          Icon(
            Icons.chevron_right_rounded,
            size: FlareGeometry.rowChevron,
            color: FlareColors.faint,
          ),
        ],
      ],
    );
    final label = MotionPhaseLabel(phase: phase.source, child: row);
    if (!canOpen) return label;
    return FlarePressable(
      key: const ValueKey('home-plan-angle'),
      scale: .99,
      onTap: () {
        FlareHaptics.light();
        _openAnglePlan(phase);
      },
      child: label,
    );
  }

  Widget _transport(BuildContext context, Phase phase) {
    final s = context.strings;
    return Padding(
      padding: EdgeInsets.fromLTRB(
        20,
        0,
        20,
        (30 - MediaQuery.viewPaddingOf(this.context).bottom).clamp(8, 30),
      ),
      child: FlareGlassBar(
        padding: const EdgeInsets.all(12),
        child: SizedBox(
          height: _transportHeightFor(context) - 24,
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
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _phaseTitle(phase),
                    Expanded(
                      child: MotionTimeline(
                        catalog: catalog,
                        time: _scene.time,
                        playhead: _scene.playhead,
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

  Widget _homeTrainingButton(BuildContext context) {
    final label = context.strings.homeGoToTraining;
    return FlarePressable(
      key: const ValueKey('home-go-to-training'),
      scale: .95,
      semanticLabel: label,
      onTap: () {
        FlareHaptics.light();
        _enterTrainingHub();
      },
      child: ConstrainedBox(
        constraints: const BoxConstraints(minHeight: 48),
        child: Center(
          widthFactor: 1,
          child: FlareHipGlassSurface(
            radius: 12,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            child: ConstrainedBox(
              constraints: const BoxConstraints(minHeight: 28),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.arrow_forward_rounded,
                    size: 15,
                    color: FlareColors.secondary,
                  ),
                  const SizedBox(width: 6),
                  Flexible(
                    child: Text(
                      label,
                      style: TextStyle(
                        fontSize: 12,
                        height: 1.25,
                        fontWeight: FontWeight.w500,
                        color: FlareColors.secondary,
                      ),
                      maxLines: 2,
                      textAlign: TextAlign.center,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _showMore() async {
    if (_sheetOpen) return;
    _sheetOpen = true;
    try {
      await _presentMore();
    } finally {
      _sheetOpen = false;
    }
  }

  Future<void> _presentMore() async {
    final s = context.strings;
    final wasPlaying = _scene.playing;
    _scene.pause();
    final value = await showModalBottomSheet<String>(
      context: context,
      sheetAnimationStyle: FlareMotion.sheetStyle(context),
      isScrollControlled: true,
      showDragHandle: false,
      builder: (sheetContext) => StatefulBuilder(
        builder: (sheetContext, setSheet) => SafeArea(
          top: false,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Semantics(
                label: MaterialLocalizations.of(
                  sheetContext,
                ).modalBarrierDismissLabel,
                button: true,
                onTap: () => Navigator.of(sheetContext).pop(),
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  child: Container(
                    key: const ValueKey('more-drag-handle'),
                    width: 36,
                    height: 4,
                    decoration: BoxDecoration(
                      color: FlareColors.palette.dragHandle,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
              ),
              Flexible(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(
                    FlareGeometry.pageInset,
                    0,
                    FlareGeometry.pageInset,
                    FlareGeometry.rowSideInset,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      FlareListGroup(
                        children: [
                          for (final entry in [
                            (
                              'library',
                              s.library,
                              s.libraryHint,
                              Icons.fitness_center_outlined,
                            ),
                            (
                              'plans',
                              s.plans,
                              store.routines.isEmpty
                                  ? s.plansHint
                                  : '${s.plansMine} · ${store.routines.length}',
                              Icons.playlist_play_rounded,
                            ),
                            (
                              'progress',
                              s.progress,
                              store.weekTrainingDays == 0
                                  ? s.recordsEmptyAction
                                  : s.moreProgressHint(store.weekTrainingDays),
                              Icons.insights_outlined,
                            ),
                            (
                              'settings',
                              s.settings,
                              s.settingsHint,
                              Icons.tune_outlined,
                            ),
                          ])
                            FlareListRow(
                              key: ValueKey('more-${entry.$1}'),
                              leading: FlareRowIcon(entry.$4),
                              title: entry.$2,
                              subtitle: entry.$3,
                              onTap: () {
                                final navigator = Navigator.of(sheetContext);
                                if (entry.$1 == 'library') {
                                  // Remove the sheet and its barrier together before
                                  // the training page starts covering the home stage.
                                  final sheet = ModalRoute.of<String>(
                                    sheetContext,
                                  );
                                  if (sheet != null && sheet.isCurrent) {
                                    navigator.removeRoute(sheet, entry.$1);
                                  }
                                } else {
                                  navigator.pop(entry.$1);
                                }
                              },
                            ),
                        ],
                      ),
                      const SizedBox(height: FlareGeometry.groupGap),
                      FlareListGroup(
                        key: const ValueKey('more-playback-speed'),
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              FlareListRow(
                                leading: const FlareRowIcon(
                                  Icons.speed_rounded,
                                ),
                                title: s.playbackSpeed,
                              ),
                              Padding(
                                padding: const EdgeInsetsDirectional.only(
                                  start: FlareGeometry.rowSideInset,
                                  end: FlareGeometry.rowSideInset,
                                  bottom: FlareGeometry.rowControlBottom,
                                ),
                                child: FlareSegmented<double>(
                                  expand: true,
                                  height: FlareGeometry.settingsSegmentHeight,
                                  radius: FlareGeometry.settingsSegmentRadius,
                                  inset: FlareGeometry.settingsSegmentInset,
                                  ios: true,
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
                                    unawaited(
                                      store.updateSettings(speed: value),
                                    );
                                    setSheet(() {});
                                  },
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
    if (!mounted) return;
    if (value == null) {
      if (wasPlaying && _watchVisible) _scene.play();
      return;
    }
    switch (value) {
      case 'library':
        _enterTrainingHub();
      case 'plans':
        _changeTab(2);
      case 'progress':
        _changeTab(3);
      case 'settings':
        setState(() {
          _settings = true;
          _about = false;
        });
        _syncSceneVisibility();
    }
  }

  Widget _settingsPage(BuildContext context) {
    final s = context.strings;
    // HipLab settings choice: the title row (30 icon slot, 17/w400), then
    // the control on its own line on the 58 text column, right 16, bottom
    // 12, so long translations keep the full label and a readable control.
    Widget line(String label, IconData icon, Widget control) => Padding(
      padding: const EdgeInsetsDirectional.fromSTEB(16, 10, 16, 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          ConstrainedBox(
            constraints: const BoxConstraints(minHeight: 32),
            child: Row(
              children: [
                FlareRowIcon(icon),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    label,
                    style: FlareType.rowTitle.copyWith(
                      height: 1.25,
                      color: FlareColors.text,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          // On a narrow phone the control takes the full row width (no
          // text-column indent) so long labels stay at a readable size.
          LayoutBuilder(
            builder: (context, box) => Padding(
              padding: EdgeInsetsDirectional.only(
                start: box.maxWidth >= 300
                    ? FlareGeometry.rowTextStart - 16
                    : 0,
              ),
              child: control,
            ),
          ),
        ],
      ),
    );
    return FlareNavPage(
      title: s.settings,
      onBack: _back,
      blurBackdrop: false,
      body: ScrollEdge(
        child: ListView(
          key: const PageStorageKey('flare-settings-scroll'),
          padding: EdgeInsets.fromLTRB(20, flareNavInset(context), 20, 24),
          children: [
            // Groups sit 28 apart without repeated headings (HipLab).
            FlareListGroup(
              children: [
                Semantics(
                  container: true,
                  button: true,
                  label:
                      '${s.languageLabel} ${languageNames[store.settings.language] ?? s.languageSystem}',
                  onTap: () => _chooseLanguage(context),
                  excludeSemantics: true,
                  child: FlareListRow(
                    key: const ValueKey('language-setting'),
                    leading: const FlareRowIcon(Icons.translate_rounded),
                    title: s.languageLabel,
                    meta:
                        languageNames[store.settings.language] ??
                        s.languageSystem,
                    onTap: () => _chooseLanguage(context),
                  ),
                ),
                line(
                  s.appearanceLabel,
                  Icons.contrast_rounded,
                  FlareSegmented<String>(
                    expand: true,
                    height: 32,
                    radius: 9,
                    inset: 2,
                    ios: true,
                    segments: [
                      ('system', s.themeSystem),
                      ('dark', s.themeDark),
                      ('light', s.themeLight),
                    ],
                    selected: store.settings.themeMode,
                    onChanged: (value) =>
                        _result(store.updateSettings(themeMode: value)),
                  ),
                ),
                line(
                  s.actorBodyLabel,
                  Icons.accessibility_new_rounded,
                  const ActorBodySelector.fixedV5(),
                ),
              ],
            ),
            const SizedBox(height: FlareGeometry.groupGap),
            FlareListGroup(
              children: [
                line(
                  s.speedLabel,
                  Icons.speed_rounded,
                  FlareSegmented<double>(
                    expand: true,
                    height: 32,
                    radius: 9,
                    inset: 2,
                    ios: true,
                    segments: const [(.25, '0.25×'), (.5, '0.5×'), (1.0, '1×')],
                    selected: store.settings.speed,
                    onChanged: (value) {
                      _scene.setSpeed(value);
                      unawaited(store.updateSettings(speed: value));
                    },
                  ),
                ),
                line(
                  s.qualityLabel,
                  Icons.high_quality_outlined,
                  FlareSegmented<String>(
                    expand: true,
                    height: 32,
                    radius: 9,
                    inset: 2,
                    ios: true,
                    segments: [
                      ('battery', s.battery),
                      ('balanced', s.balanced),
                      ('high', s.high),
                    ],
                    selected: _quality,
                    onChanged: (value) {
                      setState(() => _quality = value);
                      _scene.setQuality(value);
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: FlareGeometry.groupGap),
            if (widget.membership case final membership?)
              _membershipSettings(membership),
            FlareListGroup(
              children: [
                FlareListRow(
                  leading: const FlareRowIcon(Icons.health_and_safety_outlined),
                  title: s.safety,
                  subtitle: s.safetyHint,
                  onTap: () => showSafetySheet(context),
                ),
                FlareListRow(
                  leading: const FlareRowIcon(Icons.info_outline_rounded),
                  title: s.aboutFlare,
                  subtitle: s.aboutHint,
                  onTap: () => setState(() => _about = true),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _membershipSettings(FlareMembership membership) => ListenableBuilder(
    listenable: membership,
    builder: (context, _) {
      final s = context.strings;
      return Padding(
        padding: const EdgeInsets.only(bottom: FlareGeometry.groupGap),
        child: FlareListGroup(
          children: [
            FlareListRow(
              key: const ValueKey('settings-membership'),
              leading: const FlareRowIcon(Icons.workspace_premium_outlined),
              title: s.premiumStatus,
              subtitle: membership.isPremium
                  ? s.premiumActive
                  : s.premiumInactive,
              onTap: membership.isPremium ? null : _openMembership,
            ),
            FlareListRow(
              key: const ValueKey('settings-restore-purchases'),
              leading: const FlareRowIcon(Icons.restore_rounded),
              title: s.premiumRestore,
              onTap: membership.busy
                  ? null
                  : () async {
                      final restored = await restoreFlareSubscription(
                        context,
                        membership,
                      );
                      if (restored && context.mounted) {
                        showMembershipMessage(context, s.premiumActive);
                      }
                    },
            ),
            FlareListRow(
              key: const ValueKey('settings-manage-subscription'),
              leading: const FlareRowIcon(Icons.receipt_long_outlined),
              title: s.premiumManage,
              onTap: () => manageFlareSubscription(context),
            ),
          ],
        ),
      );
    },
  );

  /// 设置 → AI 定制用量：本机累计模型调用次数与 token（来自本地 JSONL 记录）。
  // ignore: unused_element — kept for the disabled AI entry points.
  Widget _aiUsageRow() => FutureBuilder<void>(
    future: _usage.load(),
    builder: (context, snapshot) {
      final t = _usage.totals;
      return FlareListRow(
        key: const ValueKey('settings-ai-usage'),
        leading: const FlareRowIcon(Icons.auto_awesome_rounded),
        title: 'AI 定制',
        subtitle: t.calls == 0 ? '本机还没有用过' : '本机已生成 ${t.calls} 次',
      );
    },
  );

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
      return FlareNavPage(
        title: s.aboutFlare,
        onBack: _back,
        blurBackdrop: false,
        body: ScrollEdge(
          child: ListView(
            padding: EdgeInsets.fromLTRB(20, flareNavInset(context), 20, 24),
            children: [
              BodyText(s.aboutBody),
              SectionTitle(s.teachingTitle),
              BodyText(s.teachingNote, color: FlareColors.secondary),
              const SizedBox(height: 6),
              BodyText(s.contentDraftNote, color: FlareColors.secondary),
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
                      ScaffoldMessenger.of(
                        context,
                      ).showSnackBar(SnackBar(content: Text(s.backupCopied)));
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
    'routines': store.routines.map((routine) => routine.toJson()).toList(),
    'sessions': store.sessions.map((session) => session.toJson()).toList(),
    'trainerSessions': store.trainerSessionJson,
    'completedLessonIds': store.completedLessonIds.toList(),
    'gateReports': store.gateReports,
    'assessmentGrades': store.assessmentGrades,
  });
}

/// Plain two-line title: "Flare" 17 semibold over the subtitle in 12 grey
/// with a small teal dot. One accessible name.
class _HomeWordmark extends StatelessWidget {
  const _HomeWordmark({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    final parts = label.split(' · ');
    final teal = Theme.of(context).brightness == Brightness.dark
        ? const Color(0xff75dfd0)
        : const Color(0xff16776f);
    final subtitle = parts.skip(1).join(' · ');
    return Semantics(
      label: label,
      header: true,
      child: ExcludeSemantics(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              parts.first,
              maxLines: 1,
              softWrap: false,
              style: TextStyle(
                fontSize: 17,
                height: 1.25,
                fontWeight: FontWeight.w600,
                color: FlareColors.text,
              ),
            ),
            if (subtitle.isNotEmpty)
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 5,
                    height: 5,
                    decoration: BoxDecoration(
                      color: teal,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 5),
                  Text(
                    subtitle,
                    maxLines: 1,
                    softWrap: false,
                    style: TextStyle(
                      fontSize: 12,
                      height: 1.3,
                      fontWeight: FontWeight.w500,
                      color: FlareColors.secondary,
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
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
  late final AnimationController _reveal;

  @override
  void initState() {
    super.initState();
    _reveal = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 340),
      value: widget.presented && widget.error == null ? 1 : 0,
    );
  }

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

/// Placeholder while the 3D scene boots: the V5 action silhouette
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

/// An open set editor: an existing set, or a new one seeded with drills.
class _FlarePlanTarget {
  _FlarePlanTarget.angle(this.phaseSource) : groupId = null;
  _FlarePlanTarget.muscle(this.groupId) : phaseSource = null;

  final int? phaseSource;
  final String? groupId;
  int selectedTier = 1;
}

class _RoutineEdit {
  const _RoutineEdit({
    this.routineId,
    this.seedIds = const [],
    this.fromDrill = false,
  });
  final String? routineId;
  final List<String> seedIds;

  /// Started from a drill page: saving returns there instead of the set.
  final bool fromDrill;
}
