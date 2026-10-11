// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appName => 'Flare';

  @override
  String get tagline => 'Understand the move. Train every step.';

  @override
  String get watch => 'Motion';

  @override
  String get library => 'Training';

  @override
  String get path => 'Path';

  @override
  String get progress => 'Log';

  @override
  String get settings => 'Settings';

  @override
  String get motionBrand => 'Flare · Coach';

  @override
  String get more => 'More';

  @override
  String get timeline => 'Motion timeline';

  @override
  String get phaseLabel => 'Motion phase';

  @override
  String get viewLabel => 'View';

  @override
  String get switchToMuscles => 'Switch to the standing muscle model';

  @override
  String get switchToMotion => 'Switch to the flare motion';

  @override
  String get fullLoop => 'Full loop · 8 phases';

  @override
  String get practiceLoop => 'Loop this phase';

  @override
  String get restoreLoop => 'Restore full loop';

  @override
  String get play => 'Play';

  @override
  String get pause => 'Pause';

  @override
  String get resume => 'Resume';

  @override
  String get resetView => 'Reset view';

  @override
  String get front => 'Front';

  @override
  String get back => 'Back';

  @override
  String get goBack => 'Back';

  @override
  String get side => 'Side';

  @override
  String get pausedHint => 'Select a muscle to learn more';

  @override
  String get playingHint => 'Pause to select a muscle';

  @override
  String get loadingScene => 'Preparing 3D motion…';

  @override
  String get sceneFailed =>
      '3D view is temporarily unavailable. Reopen the motion page.';

  @override
  String get retry => 'Retry';

  @override
  String get muscles => 'Muscles in this phase';

  @override
  String get primary => 'Primary role';

  @override
  String get secondary => 'Supporting role';

  @override
  String get teachingNote =>
      'Colored areas show teaching locations. They do not represent EMG activity, muscle force, or exact muscle boundaries.';

  @override
  String get deepNote => 'Hatching marks the location of deeper muscles.';

  @override
  String get deepMotionNote =>
      'A highlight marks the location of a deeper muscle.';

  @override
  String get bothSides => 'Both sides';

  @override
  String get leftSide => 'Left side';

  @override
  String get rightSide => 'Right side';

  @override
  String get whyHere => 'Role in this phase';

  @override
  String get relatedDrills => 'Targeted exercises';

  @override
  String get sourceNote => 'Model and teaching-location notes';

  @override
  String get returnToMotion => 'Return to the same frame';

  @override
  String get addToday => 'Add to today’s training';

  @override
  String get addedToday => 'Added to today’s training';

  @override
  String get tierA => 'A Bodyweight';

  @override
  String get tierB => 'B Home equipment';

  @override
  String get tierC => 'C Gym';

  @override
  String get all => 'All';

  @override
  String get supportSection => 'Shoulder and arm support';

  @override
  String get coreSection => 'Core coordination';

  @override
  String get legsSection => 'Hip and leg swing';

  @override
  String get searchDrills => 'Search exercises, muscles, or English names';

  @override
  String get libraryCount => '51 exercises · 17 muscle groups';

  @override
  String get noResults => 'No matching exercises. Try another search.';

  @override
  String get illustration => 'Exercise demonstration';

  @override
  String get dose => 'Sets and time';

  @override
  String get equipment => 'Equipment';

  @override
  String get cues => 'Form cues';

  @override
  String get mistake => 'Common mistakes';

  @override
  String get drillWhy => 'Why this exercise';

  @override
  String get safety => 'Safety';

  @override
  String get startTimer => 'Start training';

  @override
  String get today => 'Today’s training';

  @override
  String get todayEmpty =>
      'Add exercises from muscle details or the library to build today’s session';

  @override
  String get remove => 'Remove from today’s training';

  @override
  String get clearMuscleFilter => 'Clear muscle filter';

  @override
  String get timerReady => 'Ready';

  @override
  String get countdown => 'Get ready';

  @override
  String get work => 'Training';

  @override
  String get rest => 'Rest between sets';

  @override
  String get switchSide => 'Switch sides';

  @override
  String get finished => 'Training complete';

  @override
  String get abandoned => 'Session ended';

  @override
  String get paused => 'Paused';

  @override
  String get start => 'Start';

  @override
  String get completeRep => 'Complete 1 rep';

  @override
  String get completeSet => 'Complete set';

  @override
  String get skipRest => 'End rest';

  @override
  String get addRest => '+15 sec rest';

  @override
  String get painStop => 'Stop if you feel discomfort';

  @override
  String get painMessage =>
      'Discomfort recorded. Stop this exercise, rest, then decide whether to continue.';

  @override
  String get saved => 'Saved on this device';

  @override
  String get saving => 'Saving…';

  @override
  String get saveFailed =>
      'Could not finish saving. This session is still available; try again.';

  @override
  String get storageReadFailed =>
      'Local records are temporarily unavailable. Your original data has been kept.';

  @override
  String get done => 'Done';

  @override
  String get exitTimer => 'End this session';

  @override
  String get manualMode =>
      'Follow the exercise instructions, then confirm each set manually';

  @override
  String get backgroundPause =>
      'Training pauses when the app goes to the background. Tap Resume when you return.';

  @override
  String setsLabel(int current, int total) {
    return 'Set $current of $total';
  }

  @override
  String countLabel(int count) {
    return '$count reps';
  }

  @override
  String secondsLabel(int seconds) {
    return '$seconds sec';
  }

  @override
  String stageLabel(int stage) {
    return 'Stage $stage';
  }

  @override
  String get courseDraft =>
      'Learning path draft · 18 lessons. Lesson content and self-assessment thresholds still need coach review; completion does not automatically mean you have mastered the move.';

  @override
  String get locked =>
      'Unlock after completing the previous stage’s lessons and self-assessment';

  @override
  String get current => 'Current stage';

  @override
  String get passed => 'Complete';

  @override
  String get lessons => 'Lessons';

  @override
  String get gate => 'Stage self-assessment';

  @override
  String get selfReport => 'Self-reported; not an AI assessment';

  @override
  String get confirmGate => 'I completed this without pain';

  @override
  String get markLesson => 'Mark lesson as practiced';

  @override
  String get lessonCompleted => 'Practice recorded';

  @override
  String get watchPhases => 'Watch related motion';

  @override
  String get suggestedDrills => 'Exercises for this lesson';

  @override
  String get assessment => 'Starting self-assessment';

  @override
  String get assessmentNote =>
      'Choose based on your most recent actual performance. This only helps choose a starting point. If your wrist is uncomfortable, start at Stage 1. This is not an ability or medical assessment.';

  @override
  String get wristTest => 'Wrist extension';

  @override
  String get compressionTest => 'Straight-leg raise';

  @override
  String get supportTest => 'L-sit';

  @override
  String get dipsTest => 'Controlled dips';

  @override
  String get hipTest => 'Straddle hip opening';

  @override
  String get dipsGrade1 => '0–3 reps · Beginner';

  @override
  String get dipsGrade2 => '4–7 reps · Basic';

  @override
  String get dipsGrade3 => '8–12 reps · Good';

  @override
  String get dipsGrade4 => '13+ reps · Excellent';

  @override
  String get grade1 => 'Not completed / discomfort';

  @override
  String get grade2 => 'Can complete basic exercises';

  @override
  String get grade3 => 'Steady completion; more practice needed';

  @override
  String get grade4 => 'Comfortable completion; ready to progress';

  @override
  String get gradeShort1 => 'Not yet';

  @override
  String get gradeShort2 => 'Can do it';

  @override
  String get gradeShort3 => 'Steady';

  @override
  String get gradeShort4 => 'Easy';

  @override
  String get dipsShort1 => '0–3';

  @override
  String get dipsShort2 => '4–7';

  @override
  String get dipsShort3 => '8–12';

  @override
  String get dipsShort4 => '13+';

  @override
  String get saveAssessment => 'Save self-assessed starting point';

  @override
  String get skipAssessment => 'Start with the basics';

  @override
  String get assessmentSaved => 'Self-assessment saved on this device';

  @override
  String get welcomeTitle => 'Break one full circle into clear steps';

  @override
  String get welcomeBody =>
      'Rotate a real 3D model, pause to select muscles, then open a matching exercise. Motion, illustrations, and records stay on this device and work offline.';

  @override
  String get welcomeStep1 => 'Watch · Slow motion and eight phases';

  @override
  String get welcomeStep2 => 'Understand · Muscle roles in each pose';

  @override
  String get welcomeStep3 => 'Train · Sets, timers, and local records';

  @override
  String get safetyBody =>
      'Warm up your wrists and shoulders first. Train within your ability, and stop if you feel pain or dizziness. For your first full circle, choose a suitable space and have an experienced person nearby. This content teaches movement; it does not provide a diagnosis.';

  @override
  String get ackSafety => 'I understand the safety guidance';

  @override
  String get enterApp => 'Open 3D motion';

  @override
  String get history => 'Records';

  @override
  String get historyEmpty => 'Complete a timed session to see it here';

  @override
  String get sessionCount => 'Sessions';

  @override
  String get activeMinutes => 'Training minutes';

  @override
  String get lessonCount => 'Lessons practiced';

  @override
  String get incomplete => 'Incomplete';

  @override
  String get painFlag => 'Discomfort recorded';

  @override
  String get aboutTitle => 'About Flare';

  @override
  String get aboutBody =>
      'Local development build 1.0.0. Watch a flare, learn the muscle roles in each phase, choose suitable exercises, and record your practice. Motion, media, and training records work offline.';

  @override
  String get privacyTitle => 'Local data and privacy';

  @override
  String get privacyBody =>
      'Settings, today’s training, self-assessments, and training records are stored only on this device. Models and media come with the app; nothing is uploaded to a server. Browser preview data belongs to that browser. Export a backup before moving or reinstalling.';

  @override
  String get creditsTitle => 'Model and media sources';

  @override
  String get creditsBody =>
      'Snow Rig © Blender Foundation · CC BY 4.0; clothing, materials, and animation modified. Human Base Meshes · Blender Studio and community contributors · CC0. Three.js · MIT. Colored mannequin areas are teaching panels and do not stand in for missing BodyParts3D anatomy meshes. Exercise and brand images were supplied by the user; license checks still need to be completed before release.';

  @override
  String get speedLabel => 'Default playback speed';

  @override
  String get qualityLabel => 'Image quality';

  @override
  String get balanced => 'Balanced';

  @override
  String get battery => 'Battery saver';

  @override
  String get high => 'High';

  @override
  String get exportBackup => 'Copy local backup';

  @override
  String get backupCopied => 'Backup copied. Save it to a file of your choice.';

  @override
  String get contentDraftNote =>
      'Exercises are teaching suggestions. Illustrations do not replace the instructions for each exercise.';

  @override
  String get close => 'Close';

  @override
  String pausedAt(String time) {
    return 'Paused at $time sec';
  }

  @override
  String phaseHeading(String source, String name) {
    return '$source · $name';
  }

  @override
  String get primaryShort => 'Primary';

  @override
  String get secondaryShort => 'Supporting';

  @override
  String get together => 'Work together';

  @override
  String get assistMuscles => 'Supporting muscles';

  @override
  String get sceneNone => 'No equipment';

  @override
  String get sceneHome => 'At home';

  @override
  String get sceneGym => 'Gym';

  @override
  String get sceneNoneHint => 'Bodyweight, anywhere';

  @override
  String get sceneHomeHint =>
      'Resistance bands, dumbbells, and other home equipment';

  @override
  String get sceneGymHint => 'Machines and free weights';

  @override
  String get chooseScene => 'Choose a training setting';

  @override
  String trainGroup(String name) {
    return 'Train $name';
  }

  @override
  String moreCount(int count) {
    return '+$count';
  }

  @override
  String get deepMotionHint => 'Deeper muscle · color marks its location';

  @override
  String get deepMusclesHint => 'Deeper muscle · hatching marks its location';

  @override
  String get noDrillForTier =>
      'No exercises for this muscle are available at this equipment level';

  @override
  String get brandEyebrow => 'FLARE';

  @override
  String get welcomeHeadline => 'Flare';

  @override
  String get welcomeLine =>
      'Follow the motion and see which muscles work at each moment.';

  @override
  String get startApp => 'Get started';

  @override
  String get welcomeFootPrefix => 'By continuing, you confirm you have read';

  @override
  String get safetySheetEyebrow => 'Before training';

  @override
  String get safetySheetTitle => 'Three things to know';

  @override
  String get safetyRule1 => 'Warm up your wrists first';

  @override
  String get safetyRule1Note =>
      'About 6 minutes; it is the first lesson in the learning path';

  @override
  String get safetyRule2 => 'Stop for sharp pain, numbness, or dizziness';

  @override
  String get safetyRule2Note => 'Muscle effort is okay; pain is not';

  @override
  String get safetyRule3 => 'This teaches movement';

  @override
  String get safetyRule3Note =>
      'It does not replace a coach, doctor, or rehabilitation care. Have someone nearby for your first full circle.';

  @override
  String get gotIt => 'Got it';

  @override
  String get startWithAssessment => 'Start with a self-assessment';

  @override
  String get libraryHint => 'Find exercises by muscle group';

  @override
  String moreProgressHint(int count) {
    return '$count days this week';
  }

  @override
  String get playbackSpeed => 'Playback speed';

  @override
  String phaseMoment(String source) {
    return '$source · primary muscles at this moment';
  }

  @override
  String othersInvolved(String names) {
    return 'Also involved · $names';
  }

  @override
  String groupCount(int count) {
    return 'and $count groups';
  }

  @override
  String get allSections => 'All body areas';

  @override
  String get search => 'Search';

  @override
  String get closeSearch => 'Close search';

  @override
  String get clearSearch => 'Clear search';

  @override
  String get spec => 'Dose';

  @override
  String get moreCuesAndSafety => 'More cues, common mistakes, and safety';

  @override
  String get addTodayShort => 'Add today';

  @override
  String setOfTotal(int current, int total) {
    return 'Set $current of $total';
  }

  @override
  String ofReps(int count) {
    return '/ $count reps';
  }

  @override
  String get secondsUnit => 'sec';

  @override
  String get painStopShort => 'Stop if you feel discomfort';

  @override
  String get pathTitle => 'Learning path';

  @override
  String continueLesson(String title) {
    return 'Continue · $title';
  }

  @override
  String get allDone => 'All done';

  @override
  String get confirmStageGates => 'To confirm · stage requirements';

  @override
  String get stageGates => 'Stage self-assessment · self-reported';

  @override
  String get weekDays => 'Training days this week';

  @override
  String get streak => 'Day streak';

  @override
  String get recent => 'Recent';

  @override
  String get weekdayLabels => 'Mon,Tue,Wed,Thu,Fri,Sat,Sun';

  @override
  String get todayLabel => 'Today';

  @override
  String get completed => 'Complete';

  @override
  String get playbackGroup => 'Playback';

  @override
  String get otherGroup => 'Other';

  @override
  String get aboutFlare => 'About Flare';

  @override
  String get aboutHint => 'Version, sources and licenses, local data';

  @override
  String get safetyHint => 'Three things before training';

  @override
  String get teachingTitle => 'Teaching notes';

  @override
  String get licenses => 'Open-source licenses';

  @override
  String minutesShort(int count) {
    return '$count min';
  }

  @override
  String get lessonPhases => 'Related motion phases';

  @override
  String phasesShort(String list) {
    return 'Phases $list';
  }

  @override
  String get countUnit => 'reps';

  @override
  String get appearanceGroup => 'Appearance';

  @override
  String get appearanceLabel => 'Theme';

  @override
  String get themeSystem => 'Follow system';

  @override
  String get themeDark => 'Dark';

  @override
  String get themeLight => 'Light';

  @override
  String get sceneLoading => 'Loading 3D motion';

  @override
  String get endSessionTitle => 'End this session?';

  @override
  String get endSessionBody =>
      'The completed portion will be saved as an incomplete record.';

  @override
  String get endSessionConfirm => 'End and save';

  @override
  String get keepTraining => 'Keep training';

  @override
  String get removedFromToday => 'Removed from today’s training';

  @override
  String get undo => 'Undo';

  @override
  String get addedTodayToast => 'Added to today’s training';

  @override
  String trainedOn(String day) {
    return 'Trained · $day';
  }

  @override
  String notTrainedOn(String day) {
    return 'Not trained · $day';
  }

  @override
  String get drillDemo => 'Watch exercise demo';

  @override
  String get hideDrillDemo => 'Hide demo';

  @override
  String get demoReplay => 'Replay';

  @override
  String get demoSeek => 'Playback position';

  @override
  String get demoSpeed => 'Demo speed';

  @override
  String get demoFailed => 'Video is temporarily unavailable. Try again.';

  @override
  String get demoPaused => 'Training paused; demo paused too';

  @override
  String finishedLine(int sets) {
    return 'All $sets sets complete';
  }

  @override
  String get languageLabel => 'Language';

  @override
  String get languageSystem => 'Follow system';

  @override
  String get languageTitle => 'App language';

  @override
  String get sceneAccessibleTitle => 'Flare 3D motion';

  @override
  String weekDayLabel(String day) {
    return '$day';
  }

  @override
  String get syncEffort => 'Coordinated effort';

  @override
  String get muscleMap => 'Muscle map';

  @override
  String get phaseMapAccessibility =>
      'Front and back muscle maps synchronized with the motion phase';

  @override
  String viewGroup(String group) {
    return 'View $group';
  }

  @override
  String get reviewFirstPhases =>
      'Self-review phases 09–11: did rear support, weight shifts, and side support flow smoothly?';

  @override
  String get reviewFullLoop =>
      'Self-review the full loop: did hand changes, leg openings, and rhythm flow smoothly?';

  @override
  String get wristFlexion => 'Wrist flexion';

  @override
  String get wristExtension => 'Wrist extension';
}
