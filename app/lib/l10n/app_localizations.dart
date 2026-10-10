import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_zh.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[Locale('zh')];

  /// No description provided for @appName.
  ///
  /// In zh, this message translates to:
  /// **'Flare 托马斯'**
  String get appName;

  /// No description provided for @tagline.
  ///
  /// In zh, this message translates to:
  /// **'看懂动作，练好每一步'**
  String get tagline;

  /// No description provided for @watch.
  ///
  /// In zh, this message translates to:
  /// **'动作'**
  String get watch;

  /// No description provided for @library.
  ///
  /// In zh, this message translates to:
  /// **'训练'**
  String get library;

  /// No description provided for @path.
  ///
  /// In zh, this message translates to:
  /// **'路径'**
  String get path;

  /// No description provided for @progress.
  ///
  /// In zh, this message translates to:
  /// **'记录'**
  String get progress;

  /// No description provided for @settings.
  ///
  /// In zh, this message translates to:
  /// **'设置'**
  String get settings;

  /// No description provided for @motionBrand.
  ///
  /// In zh, this message translates to:
  /// **'FLARE · 托马斯全旋'**
  String get motionBrand;

  /// No description provided for @more.
  ///
  /// In zh, this message translates to:
  /// **'更多'**
  String get more;

  /// No description provided for @timeline.
  ///
  /// In zh, this message translates to:
  /// **'动作时间轴'**
  String get timeline;

  /// No description provided for @phaseLabel.
  ///
  /// In zh, this message translates to:
  /// **'动作阶段'**
  String get phaseLabel;

  /// No description provided for @viewLabel.
  ///
  /// In zh, this message translates to:
  /// **'镜头'**
  String get viewLabel;

  /// No description provided for @switchToMuscles.
  ///
  /// In zh, this message translates to:
  /// **'切换到直立肌群人体'**
  String get switchToMuscles;

  /// No description provided for @switchToMotion.
  ///
  /// In zh, this message translates to:
  /// **'切换到托马斯动作'**
  String get switchToMotion;

  /// No description provided for @fullLoop.
  ///
  /// In zh, this message translates to:
  /// **'完整循环 · 8 个阶段'**
  String get fullLoop;

  /// No description provided for @practiceLoop.
  ///
  /// In zh, this message translates to:
  /// **'循环当前阶段'**
  String get practiceLoop;

  /// No description provided for @restoreLoop.
  ///
  /// In zh, this message translates to:
  /// **'恢复整圈'**
  String get restoreLoop;

  /// No description provided for @play.
  ///
  /// In zh, this message translates to:
  /// **'播放'**
  String get play;

  /// No description provided for @pause.
  ///
  /// In zh, this message translates to:
  /// **'暂停'**
  String get pause;

  /// No description provided for @resume.
  ///
  /// In zh, this message translates to:
  /// **'继续'**
  String get resume;

  /// No description provided for @resetView.
  ///
  /// In zh, this message translates to:
  /// **'复位镜头'**
  String get resetView;

  /// No description provided for @front.
  ///
  /// In zh, this message translates to:
  /// **'正面'**
  String get front;

  /// No description provided for @back.
  ///
  /// In zh, this message translates to:
  /// **'背面'**
  String get back;

  /// No description provided for @goBack.
  ///
  /// In zh, this message translates to:
  /// **'返回'**
  String get goBack;

  /// No description provided for @side.
  ///
  /// In zh, this message translates to:
  /// **'侧面'**
  String get side;

  /// No description provided for @pausedHint.
  ///
  /// In zh, this message translates to:
  /// **'点选肌群查看详解'**
  String get pausedHint;

  /// No description provided for @playingHint.
  ///
  /// In zh, this message translates to:
  /// **'暂停后可点选肌群'**
  String get playingHint;

  /// No description provided for @loadingScene.
  ///
  /// In zh, this message translates to:
  /// **'正在准备 3D 动作…'**
  String get loadingScene;

  /// No description provided for @sceneFailed.
  ///
  /// In zh, this message translates to:
  /// **'3D 暂时无法显示，请重新打开动作页'**
  String get sceneFailed;

  /// No description provided for @retry.
  ///
  /// In zh, this message translates to:
  /// **'重试'**
  String get retry;

  /// No description provided for @muscles.
  ///
  /// In zh, this message translates to:
  /// **'本阶段肌群'**
  String get muscles;

  /// No description provided for @primary.
  ///
  /// In zh, this message translates to:
  /// **'主要作用'**
  String get primary;

  /// No description provided for @secondary.
  ///
  /// In zh, this message translates to:
  /// **'协同作用'**
  String get secondary;

  /// No description provided for @teachingNote.
  ///
  /// In zh, this message translates to:
  /// **'色区是教学位置示意，不代表肌电、肌力或真实肌肉边界。'**
  String get teachingNote;

  /// No description provided for @deepNote.
  ///
  /// In zh, this message translates to:
  /// **'深层肌群用斜线表示所在部位。'**
  String get deepNote;

  /// No description provided for @deepMotionNote.
  ///
  /// In zh, this message translates to:
  /// **'深层肌群高亮表示所在部位。'**
  String get deepMotionNote;

  /// No description provided for @bothSides.
  ///
  /// In zh, this message translates to:
  /// **'双侧'**
  String get bothSides;

  /// No description provided for @leftSide.
  ///
  /// In zh, this message translates to:
  /// **'左侧'**
  String get leftSide;

  /// No description provided for @rightSide.
  ///
  /// In zh, this message translates to:
  /// **'右侧'**
  String get rightSide;

  /// No description provided for @whyHere.
  ///
  /// In zh, this message translates to:
  /// **'在这一阶段做什么'**
  String get whyHere;

  /// No description provided for @relatedDrills.
  ///
  /// In zh, this message translates to:
  /// **'针对性训练'**
  String get relatedDrills;

  /// No description provided for @sourceNote.
  ///
  /// In zh, this message translates to:
  /// **'模型与教学位置说明'**
  String get sourceNote;

  /// No description provided for @returnToMotion.
  ///
  /// In zh, this message translates to:
  /// **'返回同一帧'**
  String get returnToMotion;

  /// No description provided for @addToday.
  ///
  /// In zh, this message translates to:
  /// **'加入今日训练'**
  String get addToday;

  /// No description provided for @addedToday.
  ///
  /// In zh, this message translates to:
  /// **'已加入今日训练'**
  String get addedToday;

  /// No description provided for @tierA.
  ///
  /// In zh, this message translates to:
  /// **'A 徒手'**
  String get tierA;

  /// No description provided for @tierB.
  ///
  /// In zh, this message translates to:
  /// **'B 家用器械'**
  String get tierB;

  /// No description provided for @tierC.
  ///
  /// In zh, this message translates to:
  /// **'C 健身房'**
  String get tierC;

  /// No description provided for @all.
  ///
  /// In zh, this message translates to:
  /// **'全部'**
  String get all;

  /// No description provided for @supportSection.
  ///
  /// In zh, this message translates to:
  /// **'肩臂支撑'**
  String get supportSection;

  /// No description provided for @coreSection.
  ///
  /// In zh, this message translates to:
  /// **'核心协调'**
  String get coreSection;

  /// No description provided for @legsSection.
  ///
  /// In zh, this message translates to:
  /// **'髋腿摆动'**
  String get legsSection;

  /// No description provided for @searchDrills.
  ///
  /// In zh, this message translates to:
  /// **'搜索训练或英文名称'**
  String get searchDrills;

  /// No description provided for @libraryCount.
  ///
  /// In zh, this message translates to:
  /// **'51 个训练 · 17 个肌群'**
  String get libraryCount;

  /// No description provided for @noResults.
  ///
  /// In zh, this message translates to:
  /// **'没有匹配的训练，试试其他关键词'**
  String get noResults;

  /// No description provided for @illustration.
  ///
  /// In zh, this message translates to:
  /// **'动作示意图'**
  String get illustration;

  /// No description provided for @dose.
  ///
  /// In zh, this message translates to:
  /// **'组次与时间'**
  String get dose;

  /// No description provided for @equipment.
  ///
  /// In zh, this message translates to:
  /// **'器械'**
  String get equipment;

  /// No description provided for @cues.
  ///
  /// In zh, this message translates to:
  /// **'动作要点'**
  String get cues;

  /// No description provided for @mistake.
  ///
  /// In zh, this message translates to:
  /// **'常见错误'**
  String get mistake;

  /// No description provided for @drillWhy.
  ///
  /// In zh, this message translates to:
  /// **'为什么练它'**
  String get drillWhy;

  /// No description provided for @safety.
  ///
  /// In zh, this message translates to:
  /// **'安全提示'**
  String get safety;

  /// No description provided for @startTimer.
  ///
  /// In zh, this message translates to:
  /// **'开始训练'**
  String get startTimer;

  /// No description provided for @today.
  ///
  /// In zh, this message translates to:
  /// **'今日训练'**
  String get today;

  /// No description provided for @todayEmpty.
  ///
  /// In zh, this message translates to:
  /// **'从肌群详解或训练库加入，组成今天的练习'**
  String get todayEmpty;

  /// No description provided for @remove.
  ///
  /// In zh, this message translates to:
  /// **'移出今日训练'**
  String get remove;

  /// No description provided for @timerReady.
  ///
  /// In zh, this message translates to:
  /// **'准备开始'**
  String get timerReady;

  /// No description provided for @countdown.
  ///
  /// In zh, this message translates to:
  /// **'准备'**
  String get countdown;

  /// No description provided for @work.
  ///
  /// In zh, this message translates to:
  /// **'练习中'**
  String get work;

  /// No description provided for @rest.
  ///
  /// In zh, this message translates to:
  /// **'组间休息'**
  String get rest;

  /// No description provided for @switchSide.
  ///
  /// In zh, this message translates to:
  /// **'换另一侧'**
  String get switchSide;

  /// No description provided for @finished.
  ///
  /// In zh, this message translates to:
  /// **'本次训练完成'**
  String get finished;

  /// No description provided for @abandoned.
  ///
  /// In zh, this message translates to:
  /// **'本次已结束'**
  String get abandoned;

  /// No description provided for @paused.
  ///
  /// In zh, this message translates to:
  /// **'已暂停'**
  String get paused;

  /// No description provided for @start.
  ///
  /// In zh, this message translates to:
  /// **'开始'**
  String get start;

  /// No description provided for @completeRep.
  ///
  /// In zh, this message translates to:
  /// **'完成 1 次'**
  String get completeRep;

  /// No description provided for @completeSet.
  ///
  /// In zh, this message translates to:
  /// **'本组完成'**
  String get completeSet;

  /// No description provided for @skipRest.
  ///
  /// In zh, this message translates to:
  /// **'结束休息'**
  String get skipRest;

  /// No description provided for @addRest.
  ///
  /// In zh, this message translates to:
  /// **'+15 秒休息'**
  String get addRest;

  /// No description provided for @painStop.
  ///
  /// In zh, this message translates to:
  /// **'不适，停止练习'**
  String get painStop;

  /// No description provided for @painMessage.
  ///
  /// In zh, this message translates to:
  /// **'已记录不适。停止当前练习，休息后再决定是否继续。'**
  String get painMessage;

  /// No description provided for @saved.
  ///
  /// In zh, this message translates to:
  /// **'已保存在本机'**
  String get saved;

  /// No description provided for @saving.
  ///
  /// In zh, this message translates to:
  /// **'正在保存…'**
  String get saving;

  /// No description provided for @saveFailed.
  ///
  /// In zh, this message translates to:
  /// **'保存未完成，记录仍在本次会话中，请重试'**
  String get saveFailed;

  /// No description provided for @storageReadFailed.
  ///
  /// In zh, this message translates to:
  /// **'本地记录暂时无法读取，原数据已保留'**
  String get storageReadFailed;

  /// No description provided for @done.
  ///
  /// In zh, this message translates to:
  /// **'完成'**
  String get done;

  /// No description provided for @exitTimer.
  ///
  /// In zh, this message translates to:
  /// **'结束本次练习'**
  String get exitTimer;

  /// No description provided for @manualMode.
  ///
  /// In zh, this message translates to:
  /// **'按原训练说明完成，再手动确认本组'**
  String get manualMode;

  /// No description provided for @backgroundPause.
  ///
  /// In zh, this message translates to:
  /// **'切到后台时练习会暂停；回来后点继续'**
  String get backgroundPause;

  /// No description provided for @setsLabel.
  ///
  /// In zh, this message translates to:
  /// **'第 {current} / {total} 组'**
  String setsLabel(int current, int total);

  /// No description provided for @countLabel.
  ///
  /// In zh, this message translates to:
  /// **'{count} 次'**
  String countLabel(int count);

  /// No description provided for @secondsLabel.
  ///
  /// In zh, this message translates to:
  /// **'{seconds} 秒'**
  String secondsLabel(int seconds);

  /// No description provided for @stageLabel.
  ///
  /// In zh, this message translates to:
  /// **'阶段 {stage}'**
  String stageLabel(int stage);

  /// No description provided for @courseDraft.
  ///
  /// In zh, this message translates to:
  /// **'学习路径草案 · 18 课。课程与自评门槛尚待教练审核，不自动判断你已掌握动作。'**
  String get courseDraft;

  /// No description provided for @locked.
  ///
  /// In zh, this message translates to:
  /// **'完成前一阶段课程与自评后开启'**
  String get locked;

  /// No description provided for @current.
  ///
  /// In zh, this message translates to:
  /// **'当前阶段'**
  String get current;

  /// No description provided for @passed.
  ///
  /// In zh, this message translates to:
  /// **'已完成'**
  String get passed;

  /// No description provided for @lessons.
  ///
  /// In zh, this message translates to:
  /// **'课程'**
  String get lessons;

  /// No description provided for @gate.
  ///
  /// In zh, this message translates to:
  /// **'阶段自评'**
  String get gate;

  /// No description provided for @selfReport.
  ///
  /// In zh, this message translates to:
  /// **'自行确认，不是 AI 测评'**
  String get selfReport;

  /// No description provided for @confirmGate.
  ///
  /// In zh, this message translates to:
  /// **'我已在无痛情况下完成'**
  String get confirmGate;

  /// No description provided for @markLesson.
  ///
  /// In zh, this message translates to:
  /// **'标记本课已练习'**
  String get markLesson;

  /// No description provided for @lessonCompleted.
  ///
  /// In zh, this message translates to:
  /// **'本课已记录'**
  String get lessonCompleted;

  /// No description provided for @watchPhases.
  ///
  /// In zh, this message translates to:
  /// **'观看相关动作'**
  String get watchPhases;

  /// No description provided for @suggestedDrills.
  ///
  /// In zh, this message translates to:
  /// **'本课练习'**
  String get suggestedDrills;

  /// No description provided for @assessment.
  ///
  /// In zh, this message translates to:
  /// **'入门自评'**
  String get assessment;

  /// No description provided for @assessmentNote.
  ///
  /// In zh, this message translates to:
  /// **'按最近一次实际表现选择，只用于安排起点。手腕不适从阶段 1 开始；结果不是能力或医疗评估。'**
  String get assessmentNote;

  /// No description provided for @wristTest.
  ///
  /// In zh, this message translates to:
  /// **'手腕伸展'**
  String get wristTest;

  /// No description provided for @compressionTest.
  ///
  /// In zh, this message translates to:
  /// **'直腿抬腿'**
  String get compressionTest;

  /// No description provided for @supportTest.
  ///
  /// In zh, this message translates to:
  /// **'L-sit'**
  String get supportTest;

  /// No description provided for @dipsTest.
  ///
  /// In zh, this message translates to:
  /// **'受控臂屈伸次数'**
  String get dipsTest;

  /// No description provided for @hipTest.
  ///
  /// In zh, this message translates to:
  /// **'跨坐开胯'**
  String get hipTest;

  /// No description provided for @dipsGrade1.
  ///
  /// In zh, this message translates to:
  /// **'0–3 次 · 入门'**
  String get dipsGrade1;

  /// No description provided for @dipsGrade2.
  ///
  /// In zh, this message translates to:
  /// **'4–7 次 · 基础'**
  String get dipsGrade2;

  /// No description provided for @dipsGrade3.
  ///
  /// In zh, this message translates to:
  /// **'8–12 次 · 良好'**
  String get dipsGrade3;

  /// No description provided for @dipsGrade4.
  ///
  /// In zh, this message translates to:
  /// **'13 次以上 · 优秀'**
  String get dipsGrade4;

  /// No description provided for @grade1.
  ///
  /// In zh, this message translates to:
  /// **'尚未完成 / 有不适'**
  String get grade1;

  /// No description provided for @grade2.
  ///
  /// In zh, this message translates to:
  /// **'可以完成基础练习'**
  String get grade2;

  /// No description provided for @grade3.
  ///
  /// In zh, this message translates to:
  /// **'稳定完成，仍需巩固'**
  String get grade3;

  /// No description provided for @grade4.
  ///
  /// In zh, this message translates to:
  /// **'轻松完成，准备进阶'**
  String get grade4;

  /// No description provided for @gradeShort1.
  ///
  /// In zh, this message translates to:
  /// **'未完成'**
  String get gradeShort1;

  /// No description provided for @gradeShort2.
  ///
  /// In zh, this message translates to:
  /// **'能完成'**
  String get gradeShort2;

  /// No description provided for @gradeShort3.
  ///
  /// In zh, this message translates to:
  /// **'较稳定'**
  String get gradeShort3;

  /// No description provided for @gradeShort4.
  ///
  /// In zh, this message translates to:
  /// **'很轻松'**
  String get gradeShort4;

  /// No description provided for @dipsShort1.
  ///
  /// In zh, this message translates to:
  /// **'0–3'**
  String get dipsShort1;

  /// No description provided for @dipsShort2.
  ///
  /// In zh, this message translates to:
  /// **'4–7'**
  String get dipsShort2;

  /// No description provided for @dipsShort3.
  ///
  /// In zh, this message translates to:
  /// **'8–12'**
  String get dipsShort3;

  /// No description provided for @dipsShort4.
  ///
  /// In zh, this message translates to:
  /// **'13+'**
  String get dipsShort4;

  /// No description provided for @saveAssessment.
  ///
  /// In zh, this message translates to:
  /// **'保存自评起点'**
  String get saveAssessment;

  /// No description provided for @skipAssessment.
  ///
  /// In zh, this message translates to:
  /// **'从基础开始'**
  String get skipAssessment;

  /// No description provided for @assessmentSaved.
  ///
  /// In zh, this message translates to:
  /// **'自评已保存在本机'**
  String get assessmentSaved;

  /// No description provided for @welcomeTitle.
  ///
  /// In zh, this message translates to:
  /// **'把一整圈，拆成看得懂的每一步'**
  String get welcomeTitle;

  /// No description provided for @welcomeBody.
  ///
  /// In zh, this message translates to:
  /// **'旋转真实 3D，暂停选肌群，再进入对应练习。所有动作、图示与记录都在本机，离线也能使用。'**
  String get welcomeBody;

  /// No description provided for @welcomeStep1.
  ///
  /// In zh, this message translates to:
  /// **'看 · 慢放与八阶段'**
  String get welcomeStep1;

  /// No description provided for @welcomeStep2.
  ///
  /// In zh, this message translates to:
  /// **'懂 · 同一姿态的肌群作用'**
  String get welcomeStep2;

  /// No description provided for @welcomeStep3.
  ///
  /// In zh, this message translates to:
  /// **'练 · 组次计时与本地记录'**
  String get welcomeStep3;

  /// No description provided for @safetyBody.
  ///
  /// In zh, this message translates to:
  /// **'先热身手腕和肩部。按自己的能力练习，出现疼痛或头晕时停止。初次尝试全旋时，请在适合的场地由有经验的人陪同。内容用于动作学习，不作诊断。'**
  String get safetyBody;

  /// No description provided for @ackSafety.
  ///
  /// In zh, this message translates to:
  /// **'我已了解安全提示'**
  String get ackSafety;

  /// No description provided for @enterApp.
  ///
  /// In zh, this message translates to:
  /// **'进入 3D 动作'**
  String get enterApp;

  /// No description provided for @history.
  ///
  /// In zh, this message translates to:
  /// **'记录'**
  String get history;

  /// No description provided for @historyEmpty.
  ///
  /// In zh, this message translates to:
  /// **'完成一次计时训练，记录会留在这里'**
  String get historyEmpty;

  /// No description provided for @sessionCount.
  ///
  /// In zh, this message translates to:
  /// **'训练次数'**
  String get sessionCount;

  /// No description provided for @activeMinutes.
  ///
  /// In zh, this message translates to:
  /// **'练习分钟'**
  String get activeMinutes;

  /// No description provided for @lessonCount.
  ///
  /// In zh, this message translates to:
  /// **'已练课程'**
  String get lessonCount;

  /// No description provided for @incomplete.
  ///
  /// In zh, this message translates to:
  /// **'未完成'**
  String get incomplete;

  /// No description provided for @painFlag.
  ///
  /// In zh, this message translates to:
  /// **'记录了不适'**
  String get painFlag;

  /// No description provided for @aboutTitle.
  ///
  /// In zh, this message translates to:
  /// **'关于 Flare'**
  String get aboutTitle;

  /// No description provided for @aboutBody.
  ///
  /// In zh, this message translates to:
  /// **'观看托马斯全旋，了解各阶段的肌群作用，选择适合自己的训练并记录练习。动作、素材和训练记录都可离线使用。'**
  String get aboutBody;

  /// No description provided for @privacyTitle.
  ///
  /// In zh, this message translates to:
  /// **'本地数据与隐私'**
  String get privacyTitle;

  /// No description provided for @privacyBody.
  ///
  /// In zh, this message translates to:
  /// **'设置、今日训练、自评与训练记录只保存在当前设备。模型与素材来自 App 安装包；不向服务器上传。浏览器预览的数据属于当前浏览器，迁移或重装前请导出备份。'**
  String get privacyBody;

  /// No description provided for @creditsTitle.
  ///
  /// In zh, this message translates to:
  /// **'模型与素材来源'**
  String get creditsTitle;

  /// No description provided for @creditsBody.
  ///
  /// In zh, this message translates to:
  /// **'Snow Rig © Blender Foundation · CC BY 4.0，服饰、材质与动画已修改。Human Base Meshes · Blender Studio 与社区贡献者 · CC0。Three.js · MIT。人台色区是教学面板，不能冒充缺失的 BodyParts3D 解剖网格。训练图与品牌图由用户提供的素材包提供，发布前需补齐授权核对。'**
  String get creditsBody;

  /// No description provided for @speedLabel.
  ///
  /// In zh, this message translates to:
  /// **'默认播放速度'**
  String get speedLabel;

  /// No description provided for @qualityLabel.
  ///
  /// In zh, this message translates to:
  /// **'画面质量'**
  String get qualityLabel;

  /// No description provided for @balanced.
  ///
  /// In zh, this message translates to:
  /// **'均衡'**
  String get balanced;

  /// No description provided for @battery.
  ///
  /// In zh, this message translates to:
  /// **'省电'**
  String get battery;

  /// No description provided for @high.
  ///
  /// In zh, this message translates to:
  /// **'高清'**
  String get high;

  /// No description provided for @exportBackup.
  ///
  /// In zh, this message translates to:
  /// **'复制本地备份'**
  String get exportBackup;

  /// No description provided for @backupCopied.
  ///
  /// In zh, this message translates to:
  /// **'备份已复制，请保存到自己的文件'**
  String get backupCopied;

  /// No description provided for @contentDraftNote.
  ///
  /// In zh, this message translates to:
  /// **'训练为教学建议，图示不替代逐条动作说明。'**
  String get contentDraftNote;

  /// No description provided for @close.
  ///
  /// In zh, this message translates to:
  /// **'关闭'**
  String get close;

  /// No description provided for @pausedAt.
  ///
  /// In zh, this message translates to:
  /// **'暂停于 {time} 秒'**
  String pausedAt(String time);

  /// No description provided for @phaseHeading.
  ///
  /// In zh, this message translates to:
  /// **'{source} · {name}'**
  String phaseHeading(String source, String name);

  /// No description provided for @primaryShort.
  ///
  /// In zh, this message translates to:
  /// **'主力'**
  String get primaryShort;

  /// No description provided for @secondaryShort.
  ///
  /// In zh, this message translates to:
  /// **'协同'**
  String get secondaryShort;

  /// No description provided for @together.
  ///
  /// In zh, this message translates to:
  /// **'一起发力'**
  String get together;

  /// No description provided for @sceneNone.
  ///
  /// In zh, this message translates to:
  /// **'无器械'**
  String get sceneNone;

  /// No description provided for @sceneHome.
  ///
  /// In zh, this message translates to:
  /// **'居家'**
  String get sceneHome;

  /// No description provided for @sceneGym.
  ///
  /// In zh, this message translates to:
  /// **'健身房'**
  String get sceneGym;

  /// No description provided for @sceneNoneHint.
  ///
  /// In zh, this message translates to:
  /// **'徒手，随时随地'**
  String get sceneNoneHint;

  /// No description provided for @sceneHomeHint.
  ///
  /// In zh, this message translates to:
  /// **'弹力带、哑铃等家用器械'**
  String get sceneHomeHint;

  /// No description provided for @sceneGymHint.
  ///
  /// In zh, this message translates to:
  /// **'器械和自由重量'**
  String get sceneGymHint;

  /// No description provided for @chooseScene.
  ///
  /// In zh, this message translates to:
  /// **'选一个训练场景'**
  String get chooseScene;

  /// No description provided for @trainGroup.
  ///
  /// In zh, this message translates to:
  /// **'练{name}'**
  String trainGroup(String name);

  /// No description provided for @moreCount.
  ///
  /// In zh, this message translates to:
  /// **'+{count}'**
  String moreCount(int count);

  /// No description provided for @deepMotionHint.
  ///
  /// In zh, this message translates to:
  /// **'深层肌群 · 颜色示意所在部位'**
  String get deepMotionHint;

  /// No description provided for @deepMusclesHint.
  ///
  /// In zh, this message translates to:
  /// **'深层肌群 · 斜线示意所在部位'**
  String get deepMusclesHint;

  /// No description provided for @noDrillForTier.
  ///
  /// In zh, this message translates to:
  /// **'这个肌群暂无该器械档的训练'**
  String get noDrillForTier;

  /// No description provided for @brandEyebrow.
  ///
  /// In zh, this message translates to:
  /// **'FLARE'**
  String get brandEyebrow;

  /// No description provided for @welcomeHeadline.
  ///
  /// In zh, this message translates to:
  /// **'托马斯全旋'**
  String get welcomeHeadline;

  /// No description provided for @welcomeLine.
  ///
  /// In zh, this message translates to:
  /// **'跟着动作，看懂每一刻哪里在发力。'**
  String get welcomeLine;

  /// No description provided for @startApp.
  ///
  /// In zh, this message translates to:
  /// **'开始'**
  String get startApp;

  /// No description provided for @welcomeFootPrefix.
  ///
  /// In zh, this message translates to:
  /// **'继续即表示已阅读'**
  String get welcomeFootPrefix;

  /// No description provided for @safetySheetEyebrow.
  ///
  /// In zh, this message translates to:
  /// **'练之前'**
  String get safetySheetEyebrow;

  /// No description provided for @safetySheetTitle.
  ///
  /// In zh, this message translates to:
  /// **'三件事'**
  String get safetySheetTitle;

  /// No description provided for @safetyRule1.
  ///
  /// In zh, this message translates to:
  /// **'每次先热身手腕'**
  String get safetyRule1;

  /// No description provided for @safetyRule1Note.
  ///
  /// In zh, this message translates to:
  /// **'约 6 分钟，学习路径第一课就是它'**
  String get safetyRule1Note;

  /// No description provided for @safetyRule2.
  ///
  /// In zh, this message translates to:
  /// **'刺痛、麻木、头晕就停'**
  String get safetyRule2;

  /// No description provided for @safetyRule2Note.
  ///
  /// In zh, this message translates to:
  /// **'酸可以，痛不行'**
  String get safetyRule2Note;

  /// No description provided for @safetyRule3.
  ///
  /// In zh, this message translates to:
  /// **'这是动作教学'**
  String get safetyRule3;

  /// No description provided for @safetyRule3Note.
  ///
  /// In zh, this message translates to:
  /// **'不能替代教练、医生或康复治疗；初次全旋请有人陪同'**
  String get safetyRule3Note;

  /// No description provided for @gotIt.
  ///
  /// In zh, this message translates to:
  /// **'我知道了'**
  String get gotIt;

  /// No description provided for @startWithAssessment.
  ///
  /// In zh, this message translates to:
  /// **'先做入门自评'**
  String get startWithAssessment;

  /// No description provided for @libraryHint.
  ///
  /// In zh, this message translates to:
  /// **'按肌群找动作'**
  String get libraryHint;

  /// No description provided for @moreProgressHint.
  ///
  /// In zh, this message translates to:
  /// **'本周 {count} 天'**
  String moreProgressHint(int count);

  /// No description provided for @playbackSpeed.
  ///
  /// In zh, this message translates to:
  /// **'播放速度'**
  String get playbackSpeed;

  /// No description provided for @phaseMoment.
  ///
  /// In zh, this message translates to:
  /// **'{source} · 这一刻的主力'**
  String phaseMoment(String source);

  /// No description provided for @othersInvolved.
  ///
  /// In zh, this message translates to:
  /// **'其他参与 · {names}'**
  String othersInvolved(String names);

  /// No description provided for @groupCount.
  ///
  /// In zh, this message translates to:
  /// **'等 {count} 组'**
  String groupCount(int count);

  /// No description provided for @allSections.
  ///
  /// In zh, this message translates to:
  /// **'全部部位'**
  String get allSections;

  /// No description provided for @search.
  ///
  /// In zh, this message translates to:
  /// **'搜索'**
  String get search;

  /// No description provided for @closeSearch.
  ///
  /// In zh, this message translates to:
  /// **'关闭搜索'**
  String get closeSearch;

  /// No description provided for @spec.
  ///
  /// In zh, this message translates to:
  /// **'剂量'**
  String get spec;

  /// No description provided for @moreCuesAndSafety.
  ///
  /// In zh, this message translates to:
  /// **'更多要点、常见错误与安全'**
  String get moreCuesAndSafety;

  /// No description provided for @addTodayShort.
  ///
  /// In zh, this message translates to:
  /// **'加入今日'**
  String get addTodayShort;

  /// No description provided for @setOfTotal.
  ///
  /// In zh, this message translates to:
  /// **'第 {current} 组 / 共 {total} 组'**
  String setOfTotal(int current, int total);

  /// No description provided for @ofReps.
  ///
  /// In zh, this message translates to:
  /// **'/ {count} 次'**
  String ofReps(int count);

  /// No description provided for @secondsUnit.
  ///
  /// In zh, this message translates to:
  /// **'秒'**
  String get secondsUnit;

  /// No description provided for @painStopShort.
  ///
  /// In zh, this message translates to:
  /// **'不适，停止练习'**
  String get painStopShort;

  /// No description provided for @pathTitle.
  ///
  /// In zh, this message translates to:
  /// **'学习路径'**
  String get pathTitle;

  /// No description provided for @continueLesson.
  ///
  /// In zh, this message translates to:
  /// **'继续 · {title}'**
  String continueLesson(String title);

  /// No description provided for @allDone.
  ///
  /// In zh, this message translates to:
  /// **'全部完成'**
  String get allDone;

  /// No description provided for @confirmStageGates.
  ///
  /// In zh, this message translates to:
  /// **'待确认 · 本阶段过关条件'**
  String get confirmStageGates;

  /// No description provided for @stageGates.
  ///
  /// In zh, this message translates to:
  /// **'阶段自评 · 自行确认'**
  String get stageGates;

  /// No description provided for @weekDays.
  ///
  /// In zh, this message translates to:
  /// **'本周练习天数'**
  String get weekDays;

  /// No description provided for @streak.
  ///
  /// In zh, this message translates to:
  /// **'连续天数'**
  String get streak;

  /// No description provided for @recent.
  ///
  /// In zh, this message translates to:
  /// **'最近'**
  String get recent;

  /// No description provided for @weekdayLabels.
  ///
  /// In zh, this message translates to:
  /// **'一,二,三,四,五,六,日'**
  String get weekdayLabels;

  /// No description provided for @todayLabel.
  ///
  /// In zh, this message translates to:
  /// **'今天'**
  String get todayLabel;

  /// No description provided for @completed.
  ///
  /// In zh, this message translates to:
  /// **'完成'**
  String get completed;

  /// No description provided for @playbackGroup.
  ///
  /// In zh, this message translates to:
  /// **'播放'**
  String get playbackGroup;

  /// No description provided for @otherGroup.
  ///
  /// In zh, this message translates to:
  /// **'其他'**
  String get otherGroup;

  /// No description provided for @aboutFlare.
  ///
  /// In zh, this message translates to:
  /// **'关于 Flare'**
  String get aboutFlare;

  /// No description provided for @aboutHint.
  ///
  /// In zh, this message translates to:
  /// **'版本、来源与许可、本地数据'**
  String get aboutHint;

  /// No description provided for @safetyHint.
  ///
  /// In zh, this message translates to:
  /// **'练之前的三件事'**
  String get safetyHint;

  /// No description provided for @teachingTitle.
  ///
  /// In zh, this message translates to:
  /// **'教学说明'**
  String get teachingTitle;

  /// No description provided for @licenses.
  ///
  /// In zh, this message translates to:
  /// **'开源许可'**
  String get licenses;

  /// No description provided for @minutesShort.
  ///
  /// In zh, this message translates to:
  /// **'{count} 分钟'**
  String minutesShort(int count);

  /// No description provided for @lessonPhases.
  ///
  /// In zh, this message translates to:
  /// **'相关动作阶段'**
  String get lessonPhases;

  /// No description provided for @phasesShort.
  ///
  /// In zh, this message translates to:
  /// **'阶段 {list}'**
  String phasesShort(String list);

  /// No description provided for @countUnit.
  ///
  /// In zh, this message translates to:
  /// **'次'**
  String get countUnit;

  /// No description provided for @appearanceGroup.
  ///
  /// In zh, this message translates to:
  /// **'外观'**
  String get appearanceGroup;

  /// No description provided for @appearanceLabel.
  ///
  /// In zh, this message translates to:
  /// **'主题'**
  String get appearanceLabel;

  /// No description provided for @themeSystem.
  ///
  /// In zh, this message translates to:
  /// **'跟随系统'**
  String get themeSystem;

  /// No description provided for @themeDark.
  ///
  /// In zh, this message translates to:
  /// **'深色'**
  String get themeDark;

  /// No description provided for @themeLight.
  ///
  /// In zh, this message translates to:
  /// **'浅色'**
  String get themeLight;

  /// No description provided for @sceneLoading.
  ///
  /// In zh, this message translates to:
  /// **'正在载入 3D 动作'**
  String get sceneLoading;

  /// No description provided for @endSessionTitle.
  ///
  /// In zh, this message translates to:
  /// **'结束这次练习？'**
  String get endSessionTitle;

  /// No description provided for @endSessionBody.
  ///
  /// In zh, this message translates to:
  /// **'已完成的部分会存为一条未完成记录。'**
  String get endSessionBody;

  /// No description provided for @endSessionConfirm.
  ///
  /// In zh, this message translates to:
  /// **'结束并保存'**
  String get endSessionConfirm;

  /// No description provided for @keepTraining.
  ///
  /// In zh, this message translates to:
  /// **'继续练'**
  String get keepTraining;

  /// No description provided for @removedFromToday.
  ///
  /// In zh, this message translates to:
  /// **'已移出今日训练'**
  String get removedFromToday;

  /// No description provided for @undo.
  ///
  /// In zh, this message translates to:
  /// **'撤销'**
  String get undo;

  /// No description provided for @addedTodayToast.
  ///
  /// In zh, this message translates to:
  /// **'已加入今日训练'**
  String get addedTodayToast;

  /// No description provided for @trainedOn.
  ///
  /// In zh, this message translates to:
  /// **'{day}，已训练'**
  String trainedOn(String day);

  /// No description provided for @notTrainedOn.
  ///
  /// In zh, this message translates to:
  /// **'{day}，未训练'**
  String notTrainedOn(String day);

  /// No description provided for @finishedLine.
  ///
  /// In zh, this message translates to:
  /// **'{sets} 组全部完成'**
  String finishedLine(int sets);
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['zh'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'zh':
      return AppLocalizationsZh();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
