// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Chinese (`zh`).
class AppLocalizationsZh extends AppLocalizations {
  AppLocalizationsZh([String locale = 'zh']) : super(locale);

  @override
  String get appName => 'Flare 托马斯';

  @override
  String get tagline => '看懂动作，练好每一步';

  @override
  String get watch => '动作';

  @override
  String get library => '训练';

  @override
  String get path => '路径';

  @override
  String get progress => '记录';

  @override
  String get settings => '设置';

  @override
  String get motionBrand => 'Flare · 托马斯助手';

  @override
  String get more => '更多';

  @override
  String get timeline => '动作时间轴';

  @override
  String get phaseLabel => '动作阶段';

  @override
  String get viewLabel => '镜头';

  @override
  String get switchToMuscles => '切换到直立肌群人体';

  @override
  String get switchToMotion => '切换到托马斯动作';

  @override
  String get fullLoop => '完整循环 · 8 个阶段';

  @override
  String get practiceLoop => '循环当前阶段';

  @override
  String get restoreLoop => '恢复整圈';

  @override
  String get play => '播放';

  @override
  String get pause => '暂停';

  @override
  String get resume => '继续';

  @override
  String get resetView => '复位镜头';

  @override
  String get front => '正面';

  @override
  String get back => '背面';

  @override
  String get goBack => '返回';

  @override
  String get side => '侧面';

  @override
  String get pausedHint => '点选肌群';

  @override
  String get playingHint => '暂停后查看';

  @override
  String get loadingScene => '正在准备 3D 动作…';

  @override
  String get sceneFailed => '3D 暂时无法显示，请重新打开动作页';

  @override
  String get retry => '重试';

  @override
  String get muscles => '本阶段肌群';

  @override
  String get primary => '主要作用';

  @override
  String get secondary => '协同作用';

  @override
  String get teachingNote => '色区是教学位置示意，不代表肌电、肌力或真实肌肉边界。';

  @override
  String get deepNote => '深层肌群用斜线表示所在部位。';

  @override
  String get deepMotionNote => '深层肌群高亮表示所在部位。';

  @override
  String get bothSides => '双侧';

  @override
  String get leftSide => '左侧';

  @override
  String get rightSide => '右侧';

  @override
  String get whyHere => '在这一阶段做什么';

  @override
  String get relatedDrills => '针对性训练';

  @override
  String get sourceNote => '模型与教学位置说明';

  @override
  String get returnToMotion => '返回同一帧';

  @override
  String get addToday => '加入今日训练';

  @override
  String get addedToday => '已加入今日训练';

  @override
  String get tierA => 'A 徒手';

  @override
  String get tierB => 'B 家用器械';

  @override
  String get tierC => 'C 健身房';

  @override
  String get all => '全部';

  @override
  String get supportSection => '肩臂支撑';

  @override
  String get coreSection => '核心协调';

  @override
  String get legsSection => '髋腿摆动';

  @override
  String get searchDrills => '搜索训练或肌群';

  @override
  String get libraryCount => '51 个训练 · 17 个肌群';

  @override
  String get noResults => '没有匹配的训练，试试其他关键词';

  @override
  String get illustration => '动作示意图';

  @override
  String get dose => '组次与时间';

  @override
  String get equipment => '器械';

  @override
  String get cues => '动作要点';

  @override
  String get mistake => '常见错误';

  @override
  String get drillWhy => '为什么练它';

  @override
  String get safety => '安全提示';

  @override
  String get startTimer => '开始训练';

  @override
  String get today => '今日训练';

  @override
  String get todayEmpty => '从肌群详解或训练库加入，组成今天的练习';

  @override
  String get remove => '移出今日训练';

  @override
  String get clearMuscleFilter => '清除肌群筛选';

  @override
  String get timerReady => '准备开始';

  @override
  String get countdown => '准备';

  @override
  String get work => '练习中';

  @override
  String get rest => '组间休息';

  @override
  String get switchSide => '换另一侧';

  @override
  String get finished => '本次训练完成';

  @override
  String get abandoned => '本次已结束';

  @override
  String get paused => '已暂停';

  @override
  String get start => '开始';

  @override
  String get completeRep => '完成 1 次';

  @override
  String get completeSet => '本组完成';

  @override
  String get skipRest => '结束休息';

  @override
  String get addRest => '+15 秒休息';

  @override
  String get painStop => '不适，停止练习';

  @override
  String get painMessage => '已记录不适。停止当前练习，休息后再决定是否继续。';

  @override
  String get saved => '已保存在本机';

  @override
  String get saving => '正在保存…';

  @override
  String get saveFailed => '保存未完成，记录仍在本次会话中，请重试';

  @override
  String get storageReadFailed => '本地记录暂时无法读取，原数据已保留';

  @override
  String get done => '完成';

  @override
  String get exitTimer => '结束本次练习';

  @override
  String get manualMode => '按原训练说明完成，再手动确认本组';

  @override
  String get backgroundPause => '切到后台时练习会暂停；回来后点继续';

  @override
  String setsLabel(int current, int total) {
    return '第 $current / $total 组';
  }

  @override
  String countLabel(int count) {
    return '$count 次';
  }

  @override
  String secondsLabel(int seconds) {
    return '$seconds 秒';
  }

  @override
  String stageLabel(int stage) {
    return '阶段 $stage';
  }

  @override
  String get courseDraft => '学习路径草案 · 18 课。课程与自评门槛尚待教练审核，不自动判断你已掌握动作。';

  @override
  String get locked => '完成前一阶段课程与自评后开启';

  @override
  String get current => '当前阶段';

  @override
  String get passed => '已完成';

  @override
  String get lessons => '课程';

  @override
  String get gate => '阶段自评';

  @override
  String get selfReport => '自行确认，不是 AI 测评';

  @override
  String get confirmGate => '我已在无痛情况下完成';

  @override
  String get markLesson => '标记本课已练习';

  @override
  String get lessonCompleted => '本课已记录';

  @override
  String get watchPhases => '观看相关动作';

  @override
  String get suggestedDrills => '本课练习';

  @override
  String get assessment => '入门自评';

  @override
  String get assessmentNote => '按最近一次实际表现选择，只用于安排起点。手腕不适从阶段 1 开始；结果不是能力或医疗评估。';

  @override
  String get wristTest => '手腕伸展';

  @override
  String get compressionTest => '直腿抬腿';

  @override
  String get supportTest => 'L-sit';

  @override
  String get dipsTest => '受控臂屈伸次数';

  @override
  String get hipTest => '跨坐开胯';

  @override
  String get dipsGrade1 => '0–3 次 · 入门';

  @override
  String get dipsGrade2 => '4–7 次 · 基础';

  @override
  String get dipsGrade3 => '8–12 次 · 良好';

  @override
  String get dipsGrade4 => '13 次以上 · 优秀';

  @override
  String get grade1 => '尚未完成 / 有不适';

  @override
  String get grade2 => '可以完成基础练习';

  @override
  String get grade3 => '稳定完成，仍需巩固';

  @override
  String get grade4 => '轻松完成，准备进阶';

  @override
  String get gradeShort1 => '未完成';

  @override
  String get gradeShort2 => '能完成';

  @override
  String get gradeShort3 => '较稳定';

  @override
  String get gradeShort4 => '很轻松';

  @override
  String get dipsShort1 => '0–3';

  @override
  String get dipsShort2 => '4–7';

  @override
  String get dipsShort3 => '8–12';

  @override
  String get dipsShort4 => '13+';

  @override
  String get saveAssessment => '保存自评起点';

  @override
  String get skipAssessment => '从基础开始';

  @override
  String get assessmentSaved => '自评已保存在本机';

  @override
  String get welcomeTitle => '把一整圈，拆成看得懂的每一步';

  @override
  String get welcomeBody => '旋转真实 3D，暂停选肌群，再进入对应练习。所有动作、图示与记录都在本机，离线也能使用。';

  @override
  String get welcomeStep1 => '看 · 慢放与八阶段';

  @override
  String get welcomeStep2 => '懂 · 同一姿态的肌群作用';

  @override
  String get welcomeStep3 => '练 · 组次计时与本地记录';

  @override
  String get safetyBody =>
      '先热身手腕和肩部。按自己的能力练习，出现疼痛或头晕时停止。初次尝试全旋时，请在适合的场地由有经验的人陪同。内容用于动作学习，不作诊断。';

  @override
  String get ackSafety => '我已了解安全提示';

  @override
  String get enterApp => '进入 3D 动作';

  @override
  String get history => '记录';

  @override
  String get historyEmpty => '完成一次计时训练，记录会留在这里';

  @override
  String get sessionCount => '训练次数';

  @override
  String get activeMinutes => '练习分钟';

  @override
  String get lessonCount => '已练课程';

  @override
  String get incomplete => '未完成';

  @override
  String get painFlag => '记录了不适';

  @override
  String get aboutTitle => '关于 Flare';

  @override
  String get aboutBody => '观看托马斯全旋，了解各阶段的肌群作用，选择适合自己的训练并记录练习。动作、素材和训练记录都可离线使用。';

  @override
  String get privacyTitle => '本地数据与隐私';

  @override
  String get privacyBody =>
      '设置、今日训练、自评与训练记录只保存在当前设备。模型与素材来自 App 安装包；不向服务器上传。浏览器预览的数据属于当前浏览器，迁移或重装前请导出备份。';

  @override
  String get creditsTitle => '模型与素材来源';

  @override
  String get creditsBody =>
      'Snow Rig © Blender Foundation · CC BY 4.0，服饰、材质与动画已修改。Human Base Meshes · Blender Studio 与社区贡献者 · CC0。Three.js · MIT。人台色区是教学面板，不能冒充缺失的 BodyParts3D 解剖网格。训练图与品牌图由应用发行者提供。';

  @override
  String get speedLabel => '默认速度';

  @override
  String get qualityLabel => '画面质量';

  @override
  String get balanced => '均衡';

  @override
  String get battery => '省电';

  @override
  String get high => '高清';

  @override
  String get exportBackup => '复制本地备份';

  @override
  String get backupCopied => '备份已复制，请保存到自己的文件';

  @override
  String get contentDraftNote => '训练为教学建议，图示不替代逐条动作说明。';

  @override
  String get close => '关闭';

  @override
  String pausedAt(String time) {
    return '暂停于 $time 秒';
  }

  @override
  String phaseHeading(String source, String name) {
    return '$source · $name';
  }

  @override
  String get primaryShort => '主力';

  @override
  String get secondaryShort => '协同';

  @override
  String get together => '一起发力';

  @override
  String get assistMuscles => '协助发力';

  @override
  String get sceneNone => '无器械';

  @override
  String get sceneHome => '居家';

  @override
  String get sceneGym => '健身房';

  @override
  String get sceneNoneHint => '徒手，随时随地';

  @override
  String get sceneHomeHint => '弹力带、哑铃等家用器械';

  @override
  String get sceneGymHint => '器械和自由重量';

  @override
  String get chooseScene => '选一个训练场景';

  @override
  String trainGroup(String name) {
    return '练$name';
  }

  @override
  String moreCount(int count) {
    return '+$count';
  }

  @override
  String get deepMotionHint => '深层肌群 · 颜色示意所在部位';

  @override
  String get deepMusclesHint => '深层肌群 · 斜线示意所在部位';

  @override
  String get noDrillForTier => '这个肌群暂无该器械档的训练';

  @override
  String get brandEyebrow => 'FLARE';

  @override
  String get welcomeHeadline => '托马斯全旋';

  @override
  String get welcomeLine => '跟着动作，看懂每一刻哪里在发力。';

  @override
  String get startApp => '开始';

  @override
  String get welcomeFootPrefix => '继续即表示已阅读';

  @override
  String get safetySheetEyebrow => '练之前';

  @override
  String get safetySheetTitle => '三件事';

  @override
  String get safetyRule1 => '每次先热身手腕';

  @override
  String get safetyRule1Note => '约 6 分钟，学习路径第一课就是它';

  @override
  String get safetyRule2 => '刺痛、麻木、头晕就停';

  @override
  String get safetyRule2Note => '酸可以，痛不行';

  @override
  String get safetyRule3 => '这是动作教学';

  @override
  String get safetyRule3Note => '不能替代教练、医生或康复治疗；初次全旋请有人陪同';

  @override
  String get gotIt => '我知道了';

  @override
  String get startWithAssessment => '先做入门自评';

  @override
  String get libraryHint => '按肌群找动作';

  @override
  String moreProgressHint(int count) {
    return '本周 $count 天';
  }

  @override
  String get playbackSpeed => '播放速度';

  @override
  String phaseMoment(String source) {
    return '$source · 这一刻的主力';
  }

  @override
  String othersInvolved(String names) {
    return '其他参与 · $names';
  }

  @override
  String groupCount(int count) {
    return '等 $count 组';
  }

  @override
  String get allSections => '全部部位';

  @override
  String get search => '搜索';

  @override
  String get closeSearch => '关闭搜索';

  @override
  String get clearSearch => '清空搜索';

  @override
  String get spec => '剂量';

  @override
  String get moreCuesAndSafety => '更多要点、常见错误与安全';

  @override
  String get addTodayShort => '加入今日';

  @override
  String setOfTotal(int current, int total) {
    return '第 $current 组 / 共 $total 组';
  }

  @override
  String ofReps(int count) {
    return '/ $count 次';
  }

  @override
  String get secondsUnit => '秒';

  @override
  String get painStopShort => '不适，停止练习';

  @override
  String get pathTitle => '学习路径';

  @override
  String continueLesson(String title) {
    return '继续 · $title';
  }

  @override
  String get allDone => '全部完成';

  @override
  String get confirmStageGates => '待确认 · 本阶段过关条件';

  @override
  String get stageGates => '阶段自评 · 自行确认';

  @override
  String get weekDays => '本周练习天数';

  @override
  String get streak => '连续天数';

  @override
  String get recent => '最近';

  @override
  String get weekdayLabels => '一,二,三,四,五,六,日';

  @override
  String get todayLabel => '今天';

  @override
  String get completed => '完成';

  @override
  String get playbackGroup => '播放';

  @override
  String get otherGroup => '其他';

  @override
  String get aboutFlare => '关于 Flare';

  @override
  String get aboutHint => '版本、来源与许可、本地数据';

  @override
  String get safetyHint => '练之前的三件事';

  @override
  String get teachingTitle => '教学说明';

  @override
  String get licenses => '开源许可';

  @override
  String minutesShort(int count) {
    return '$count 分钟';
  }

  @override
  String get lessonPhases => '相关动作阶段';

  @override
  String phasesShort(String list) {
    return '阶段 $list';
  }

  @override
  String get countUnit => '次';

  @override
  String get appearanceGroup => '外观';

  @override
  String get appearanceLabel => '主题';

  @override
  String get themeSystem => '跟随系统';

  @override
  String get themeDark => '深色';

  @override
  String get themeLight => '浅色';

  @override
  String get sceneLoading => '正在载入 3D 动作';

  @override
  String get endSessionTitle => '结束这次练习？';

  @override
  String get endSessionBody => '已完成的部分会存为一条未完成记录。';

  @override
  String get endSessionConfirm => '结束并保存';

  @override
  String get keepTraining => '继续练';

  @override
  String get removedFromToday => '已移出今日训练';

  @override
  String get undo => '撤销';

  @override
  String get addedTodayToast => '已加入今日训练';

  @override
  String trainedOn(String day) {
    return '$day，已训练';
  }

  @override
  String notTrainedOn(String day) {
    return '$day，未训练';
  }

  @override
  String get drillDemo => '观看动作示范';

  @override
  String get hideDrillDemo => '收起示范';

  @override
  String get demoReplay => '重播';

  @override
  String get demoSeek => '播放进度';

  @override
  String get demoSpeed => '示范速度';

  @override
  String get demoFailed => '视频暂时无法播放，请重试';

  @override
  String get demoPaused => '训练已暂停，示范也已暂停';

  @override
  String finishedLine(int sets) {
    return '$sets 组全部完成';
  }

  @override
  String get languageLabel => '语言';

  @override
  String get languageSystem => '跟随系统';

  @override
  String get languageTitle => 'App 语言';

  @override
  String get sceneAccessibleTitle => 'Flare 托马斯全旋 3D 动作';

  @override
  String weekDayLabel(String day) {
    return '星期$day';
  }

  @override
  String get syncEffort => '肌群图';

  @override
  String get muscleMap => '肌群图';

  @override
  String get phaseMapAccessibility => '随动作阶段同步的肌群正面和背面定位图';

  @override
  String viewGroup(String group) {
    return '查看$group';
  }

  @override
  String get reviewFirstPhases => '自行回顾 09–11：后撑、移重与侧撑是否连贯';

  @override
  String get reviewFullLoop => '自行回顾整圈：换手、开腿与节奏是否连贯';

  @override
  String get wristFlexion => '腕屈';

  @override
  String get wristExtension => '腕伸';
}

/// The translations for Chinese, using the Han script (`zh_Hant`).
class AppLocalizationsZhHant extends AppLocalizationsZh {
  AppLocalizationsZhHant() : super('zh_Hant');

  @override
  String get appName => 'Flare 托馬斯';

  @override
  String get tagline => '看懂動作，練好每一步';

  @override
  String get watch => '動作';

  @override
  String get library => '訓練';

  @override
  String get path => '路徑';

  @override
  String get progress => '記錄';

  @override
  String get settings => '設置';

  @override
  String get motionBrand => 'Flare · 托馬斯助理';

  @override
  String get more => '更多';

  @override
  String get timeline => '動作時間軸';

  @override
  String get phaseLabel => '動作階段';

  @override
  String get viewLabel => '鏡頭';

  @override
  String get switchToMuscles => '切換到直立肌群人體';

  @override
  String get switchToMotion => '切換到托馬斯動作';

  @override
  String get fullLoop => '完整循環 · 8 個階段';

  @override
  String get practiceLoop => '循環當前階段';

  @override
  String get restoreLoop => '恢復整圈';

  @override
  String get play => '播放';

  @override
  String get pause => '暫停';

  @override
  String get resume => '繼續';

  @override
  String get resetView => '復位鏡頭';

  @override
  String get front => '正面';

  @override
  String get back => '背面';

  @override
  String get goBack => '返回';

  @override
  String get side => '側面';

  @override
  String get pausedHint => '點選肌群';

  @override
  String get playingHint => '暫停後查看';

  @override
  String get loadingScene => '正在準備 3D 動作…';

  @override
  String get sceneFailed => '3D 暫時無法顯示，請重新打開動作頁';

  @override
  String get retry => '重試';

  @override
  String get muscles => '本階段肌群';

  @override
  String get primary => '主要作用';

  @override
  String get secondary => '協同作用';

  @override
  String get teachingNote => '色區是教學位置示意，不代表肌電、肌力或真實肌肉邊界。';

  @override
  String get deepNote => '深層肌群用斜線表示所在部位。';

  @override
  String get deepMotionNote => '深層肌群高亮表示所在部位。';

  @override
  String get bothSides => '雙側';

  @override
  String get leftSide => '左側';

  @override
  String get rightSide => '右側';

  @override
  String get whyHere => '在這一階段做什么';

  @override
  String get relatedDrills => '針對性訓練';

  @override
  String get sourceNote => '模型與教學位置說明';

  @override
  String get returnToMotion => '返回同一幀';

  @override
  String get addToday => '加入今日訓練';

  @override
  String get addedToday => '已加入今日訓練';

  @override
  String get tierA => 'A 徒手';

  @override
  String get tierB => 'B 居家器材';

  @override
  String get tierC => 'C 健身房';

  @override
  String get all => '全部';

  @override
  String get supportSection => '肩臂支撐';

  @override
  String get coreSection => '核心協調';

  @override
  String get legsSection => '髖腿擺動';

  @override
  String get searchDrills => '搜尋訓練或肌群';

  @override
  String get libraryCount => '51 個訓練 · 17 個肌群';

  @override
  String get noResults => '沒有匹配的訓練，試試其他關鍵詞';

  @override
  String get illustration => '動作示意圖';

  @override
  String get dose => '組次與時間';

  @override
  String get equipment => '器械';

  @override
  String get cues => '動作要點';

  @override
  String get mistake => '常見錯誤';

  @override
  String get drillWhy => '為什么練它';

  @override
  String get safety => '安全提示';

  @override
  String get startTimer => '開始訓練';

  @override
  String get today => '今日訓練';

  @override
  String get todayEmpty => '從肌群詳解或訓練庫加入，組成今天的練習';

  @override
  String get remove => '移出今日訓練';

  @override
  String get clearMuscleFilter => '清除肌群篩選';

  @override
  String get timerReady => '準備開始';

  @override
  String get countdown => '準備';

  @override
  String get work => '練習中';

  @override
  String get rest => '組間休息';

  @override
  String get switchSide => '換另一側';

  @override
  String get finished => '本次訓練完成';

  @override
  String get abandoned => '本次已結束';

  @override
  String get paused => '已暫停';

  @override
  String get start => '開始';

  @override
  String get completeRep => '完成 1 次';

  @override
  String get completeSet => '本組完成';

  @override
  String get skipRest => '結束休息';

  @override
  String get addRest => '+15 秒休息';

  @override
  String get painStop => '不適，停止練習';

  @override
  String get painMessage => '已記錄不適。停止當前練習，休息后再決定是否繼續。';

  @override
  String get saved => '已保存在本機';

  @override
  String get saving => '正在保存…';

  @override
  String get saveFailed => '保存未完成，記錄仍在本次會話中，請重試';

  @override
  String get storageReadFailed => '本地記錄暫時無法讀取，原數據已保留';

  @override
  String get done => '完成';

  @override
  String get exitTimer => '結束本次練習';

  @override
  String get manualMode => '按原訓練說明完成，再手動確認本組';

  @override
  String get backgroundPause => '切到后臺時練習會暫停；回來后點繼續';

  @override
  String setsLabel(int current, int total) {
    return '第 $current / $total 組';
  }

  @override
  String countLabel(int count) {
    return '$count 次';
  }

  @override
  String secondsLabel(int seconds) {
    return '$seconds 秒';
  }

  @override
  String stageLabel(int stage) {
    return '階段 $stage';
  }

  @override
  String get courseDraft => '學習路徑草案 · 18 課。課程與自評門檻尚待教練審核，不自動判斷你已掌握動作。';

  @override
  String get locked => '完成前一階段課程與自評后開啟';

  @override
  String get current => '當前階段';

  @override
  String get passed => '已完成';

  @override
  String get lessons => '課程';

  @override
  String get gate => '階段自評';

  @override
  String get selfReport => '自行確認，不是 AI 測評';

  @override
  String get confirmGate => '我已在無痛情況下完成';

  @override
  String get markLesson => '標記本課已練習';

  @override
  String get lessonCompleted => '本課已記錄';

  @override
  String get watchPhases => '觀看相關動作';

  @override
  String get suggestedDrills => '本課練習';

  @override
  String get assessment => '入門自評';

  @override
  String get assessmentNote => '按最近一次實際表現選擇，只用于安排起點。手腕不適從階段 1 開始；結果不是能力或醫療評估。';

  @override
  String get wristTest => '手腕伸展';

  @override
  String get compressionTest => '直腿抬腿';

  @override
  String get supportTest => 'L-sit';

  @override
  String get dipsTest => '受控臂屈伸次數';

  @override
  String get hipTest => '跨坐開胯';

  @override
  String get dipsGrade1 => '0–3 次 · 入門';

  @override
  String get dipsGrade2 => '4–7 次 · 基礎';

  @override
  String get dipsGrade3 => '8–12 次 · 良好';

  @override
  String get dipsGrade4 => '13 次以上 · 優秀';

  @override
  String get grade1 => '尚未完成 / 有不適';

  @override
  String get grade2 => '可以完成基礎練習';

  @override
  String get grade3 => '穩定完成，仍需鞏固';

  @override
  String get grade4 => '輕松完成，準備進階';

  @override
  String get gradeShort1 => '未完成';

  @override
  String get gradeShort2 => '能完成';

  @override
  String get gradeShort3 => '較穩定';

  @override
  String get gradeShort4 => '很輕松';

  @override
  String get dipsShort1 => '0–3';

  @override
  String get dipsShort2 => '4–7';

  @override
  String get dipsShort3 => '8–12';

  @override
  String get dipsShort4 => '13+';

  @override
  String get saveAssessment => '保存自評起點';

  @override
  String get skipAssessment => '從基礎開始';

  @override
  String get assessmentSaved => '自評已保存在本機';

  @override
  String get welcomeTitle => '把一整圈，拆成看得懂的每一步';

  @override
  String get welcomeBody => '旋轉真實 3D，暫停選肌群，再進入對應練習。所有動作、圖示與紀錄都在本機，離線也能使用。';

  @override
  String get welcomeStep1 => '看 · 慢放與八階段';

  @override
  String get welcomeStep2 => '懂 · 同一姿態的肌群作用';

  @override
  String get welcomeStep3 => '練 · 組次計時與本地記錄';

  @override
  String get safetyBody =>
      '先熱身手腕和肩部。按自己的能力練習，出現疼痛或頭暈時停止。初次嘗試全旋時，請在適合的場地由有經驗的人陪同。內容用于動作學習，不作診斷。';

  @override
  String get ackSafety => '我已了解安全提醒';

  @override
  String get enterApp => '進入 3D 動作';

  @override
  String get history => '記錄';

  @override
  String get historyEmpty => '完成一次計時訓練，記錄會留在這里';

  @override
  String get sessionCount => '訓練次數';

  @override
  String get activeMinutes => '練習分鐘';

  @override
  String get lessonCount => '已練課程';

  @override
  String get incomplete => '未完成';

  @override
  String get painFlag => '記錄了不適';

  @override
  String get aboutTitle => '關于 Flare';

  @override
  String get aboutBody =>
      '本地開發版 1.0.0。觀看托馬斯全旋，了解各階段的肌群作用，選擇適合自己的訓練并記錄練習。動作、素材和訓練記錄都可離線使用。';

  @override
  String get privacyTitle => '本地數據與隱私';

  @override
  String get privacyBody =>
      '設置、今日訓練、自評與訓練記錄只保存在當前設備。模型與素材來自 App 安裝包；不向服務器上傳。瀏覽器預覽的數據屬于當前瀏覽器，遷移或重裝前請導出備份。';

  @override
  String get creditsTitle => '模型與素材來源';

  @override
  String get creditsBody =>
      'Snow Rig © Blender Foundation · CC BY 4.0，服飾、材質與動畫已修改。Human Base Meshes · Blender Studio 與社區貢獻者 · CC0。Three.js · MIT。人臺色區是教學面板，不能冒充缺失的 BodyParts3D 解剖網格。訓練圖與品牌圖由用戶提供的素材包提供，發布前需補齊授權核對。';

  @override
  String get speedLabel => '預設速度';

  @override
  String get qualityLabel => '畫面質量';

  @override
  String get balanced => '均衡';

  @override
  String get battery => '省電';

  @override
  String get high => '高清';

  @override
  String get exportBackup => '復制本地備份';

  @override
  String get backupCopied => '備份已復制，請保存到自己的文件';

  @override
  String get contentDraftNote => '訓練為教學建議，圖示不替代逐條動作說明。';

  @override
  String get close => '關閉';

  @override
  String pausedAt(String time) {
    return '暫停于 $time 秒';
  }

  @override
  String phaseHeading(String source, String name) {
    return '$source · $name';
  }

  @override
  String get primaryShort => '主力';

  @override
  String get secondaryShort => '協同';

  @override
  String get together => '一起發力';

  @override
  String get assistMuscles => '協助發力';

  @override
  String get sceneNone => '徒手';

  @override
  String get sceneHome => '居家';

  @override
  String get sceneGym => '健身房';

  @override
  String get sceneNoneHint => '徒手，隨時隨地';

  @override
  String get sceneHomeHint => '彈力帶、啞鈴等居家器材';

  @override
  String get sceneGymHint => '器械和自由重量';

  @override
  String get chooseScene => '選一個訓練場景';

  @override
  String trainGroup(String name) {
    return '練$name';
  }

  @override
  String moreCount(int count) {
    return '+$count';
  }

  @override
  String get deepMotionHint => '深層肌群 · 顏色示意所在部位';

  @override
  String get deepMusclesHint => '深層肌群 · 斜線示意所在部位';

  @override
  String get noDrillForTier => '這個肌群暫無該器械檔的訓練';

  @override
  String get brandEyebrow => 'FLARE';

  @override
  String get welcomeHeadline => '托馬斯全旋';

  @override
  String get welcomeLine => '跟著動作，看懂每一刻哪里在發力。';

  @override
  String get startApp => '開始';

  @override
  String get welcomeFootPrefix => '繼續即表示已閱讀';

  @override
  String get safetySheetEyebrow => '練之前';

  @override
  String get safetySheetTitle => '三件事';

  @override
  String get safetyRule1 => '每次先熱身手腕';

  @override
  String get safetyRule1Note => '約 6 分鐘，學習路徑第一課就是它';

  @override
  String get safetyRule2 => '刺痛、麻木、頭暈就停';

  @override
  String get safetyRule2Note => '酸可以，痛不行';

  @override
  String get safetyRule3 => '這是動作教學';

  @override
  String get safetyRule3Note => '不能替代教練、醫生或康復治療；初次全旋請有人陪同';

  @override
  String get gotIt => '我知道了';

  @override
  String get startWithAssessment => '先做入門自評';

  @override
  String get libraryHint => '按肌群找動作';

  @override
  String moreProgressHint(int count) {
    return '本周 $count 天';
  }

  @override
  String get playbackSpeed => '播放速度';

  @override
  String phaseMoment(String source) {
    return '$source · 這一刻的主力';
  }

  @override
  String othersInvolved(String names) {
    return '其他參與 · $names';
  }

  @override
  String groupCount(int count) {
    return '等 $count 組';
  }

  @override
  String get allSections => '全部部位';

  @override
  String get search => '搜索';

  @override
  String get closeSearch => '關閉搜索';

  @override
  String get clearSearch => '清空搜索';

  @override
  String get spec => '劑量';

  @override
  String get moreCuesAndSafety => '更多要點、常見錯誤與安全';

  @override
  String get addTodayShort => '加入今日';

  @override
  String setOfTotal(int current, int total) {
    return '第 $current 組 / 共 $total 組';
  }

  @override
  String ofReps(int count) {
    return '/ $count 次';
  }

  @override
  String get secondsUnit => '秒';

  @override
  String get painStopShort => '不適，停止練習';

  @override
  String get pathTitle => '學習路徑';

  @override
  String continueLesson(String title) {
    return '繼續 · $title';
  }

  @override
  String get allDone => '全部完成';

  @override
  String get confirmStageGates => '待確認 · 本階段過關條件';

  @override
  String get stageGates => '階段自評 · 自行確認';

  @override
  String get weekDays => '本周練習天數';

  @override
  String get streak => '連續天數';

  @override
  String get recent => '最近';

  @override
  String get weekdayLabels => '一,二,三,四,五,六,日';

  @override
  String get todayLabel => '今天';

  @override
  String get completed => '完成';

  @override
  String get playbackGroup => '播放';

  @override
  String get otherGroup => '其他';

  @override
  String get aboutFlare => '關于 Flare';

  @override
  String get aboutHint => '版本、來源與許可、本地數據';

  @override
  String get safetyHint => '練之前的三件事';

  @override
  String get teachingTitle => '教學說明';

  @override
  String get licenses => '開源許可';

  @override
  String minutesShort(int count) {
    return '$count 分鐘';
  }

  @override
  String get lessonPhases => '相關動作階段';

  @override
  String phasesShort(String list) {
    return '階段 $list';
  }

  @override
  String get countUnit => '次';

  @override
  String get appearanceGroup => '外觀';

  @override
  String get appearanceLabel => '主題';

  @override
  String get themeSystem => '跟隨系統';

  @override
  String get themeDark => '深色';

  @override
  String get themeLight => '淺色';

  @override
  String get sceneLoading => '正在載入 3D 動作';

  @override
  String get endSessionTitle => '結束這次練習？';

  @override
  String get endSessionBody => '已完成的部分會存為一條未完成記錄。';

  @override
  String get endSessionConfirm => '結束並儲存';

  @override
  String get keepTraining => '繼續練';

  @override
  String get removedFromToday => '已移出今日訓練';

  @override
  String get undo => '撤銷';

  @override
  String get addedTodayToast => '已加入今日訓練';

  @override
  String trainedOn(String day) {
    return '$day，已訓練';
  }

  @override
  String notTrainedOn(String day) {
    return '$day，未訓練';
  }

  @override
  String get drillDemo => '觀看動作示範';

  @override
  String get hideDrillDemo => '收起示范';

  @override
  String get demoReplay => '重播';

  @override
  String get demoSeek => '播放進度';

  @override
  String get demoSpeed => '示范速度';

  @override
  String get demoFailed => '視頻暫時無法播放，請重試';

  @override
  String get demoPaused => '訓練已暫停，示范也已暫停';

  @override
  String finishedLine(int sets) {
    return '$sets 組全部完成';
  }

  @override
  String get languageLabel => '語言';

  @override
  String get languageSystem => '跟隨系統';

  @override
  String get languageTitle => 'App 語言';

  @override
  String get sceneAccessibleTitle => 'Flare 托馬斯全旋 3D 動作';

  @override
  String weekDayLabel(String day) {
    return '星期$day';
  }

  @override
  String get syncEffort => '肌群圖';

  @override
  String get muscleMap => '肌群圖';

  @override
  String get phaseMapAccessibility => '隨動作階段同步的肌群正面和背面定位圖';

  @override
  String viewGroup(String group) {
    return '查看$group';
  }

  @override
  String get reviewFirstPhases => '自行回顧 09–11：後撐、移重與側撐是否連貫';

  @override
  String get reviewFullLoop => '自行回顧整圈：換手、開腿與節奏是否連貫';

  @override
  String get wristFlexion => '腕屈';

  @override
  String get wristExtension => '腕伸';
}
