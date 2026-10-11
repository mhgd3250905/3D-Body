// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Japanese (`ja`).
class AppLocalizationsJa extends AppLocalizations {
  AppLocalizationsJa([String locale = 'ja']) : super(locale);

  @override
  String get appName => 'Flare トーマス';

  @override
  String get tagline => '動きを理解し、一歩ずつ練習';

  @override
  String get watch => '動作';

  @override
  String get library => 'トレーニング';

  @override
  String get path => '学習コース';

  @override
  String get progress => '記録';

  @override
  String get settings => '設定';

  @override
  String get motionBrand => 'Flare · トーマスアシスタント';

  @override
  String get more => 'その他';

  @override
  String get timeline => '動作タイムライン';

  @override
  String get phaseLabel => '動作フェーズ';

  @override
  String get viewLabel => '視点';

  @override
  String get switchToMuscles => '立位の筋肉モデルに切り替え';

  @override
  String get switchToMotion => 'トーマスの動作に切り替え';

  @override
  String get fullLoop => '全体の動作 · 8フェーズ';

  @override
  String get practiceLoop => 'このフェーズを繰り返す';

  @override
  String get restoreLoop => '全体の動作に戻す';

  @override
  String get play => '再生';

  @override
  String get pause => '一時停止';

  @override
  String get resume => '再開';

  @override
  String get resetView => '視点をリセット';

  @override
  String get front => '正面';

  @override
  String get back => '背面';

  @override
  String get goBack => '戻る';

  @override
  String get side => '側面';

  @override
  String get pausedHint => '筋肉を見る';

  @override
  String get playingHint => '一時停止して選ぶ';

  @override
  String get loadingScene => '3D動作を準備中…';

  @override
  String get sceneFailed => '3D表示を一時的に利用できません。動作ページを開き直してください。';

  @override
  String get retry => '再試行';

  @override
  String get muscles => 'このフェーズで使う筋肉';

  @override
  String get primary => '主な役割';

  @override
  String get secondary => '補助する役割';

  @override
  String get teachingNote => '色の領域は学習用の位置表示です。筋電図の活動、筋力、正確な筋肉の境界を示すものではありません。';

  @override
  String get deepNote => '斜線は深層筋のおおよその位置を示します。';

  @override
  String get deepMotionNote => 'ハイライトは深層筋のおおよその位置を示します。';

  @override
  String get bothSides => '左右両側';

  @override
  String get leftSide => '左側';

  @override
  String get rightSide => '右側';

  @override
  String get whyHere => 'このフェーズでの役割';

  @override
  String get relatedDrills => '関連トレーニング';

  @override
  String get sourceNote => 'モデルと学習用の位置表示について';

  @override
  String get returnToMotion => '同じフレームに戻る';

  @override
  String get addToday => '今日のトレーニングに追加';

  @override
  String get addedToday => '今日のトレーニングに追加しました';

  @override
  String get tierA => 'A 自重';

  @override
  String get tierB => 'B 自宅の器具';

  @override
  String get tierC => 'C ジム';

  @override
  String get all => 'すべて';

  @override
  String get supportSection => '肩と腕の支持';

  @override
  String get coreSection => '体幹の連動';

  @override
  String get legsSection => '股関節と脚の振り';

  @override
  String get searchDrills => '種目・筋肉を検索';

  @override
  String get libraryCount => '51種目 · 17筋群';

  @override
  String get noResults => '一致する種目がありません。別のキーワードを試してください。';

  @override
  String get illustration => '動作の見本';

  @override
  String get dose => 'セット数と時間';

  @override
  String get equipment => '器具';

  @override
  String get cues => '動作のポイント';

  @override
  String get mistake => 'よくある間違い';

  @override
  String get drillWhy => 'この種目を行う理由';

  @override
  String get safety => '安全上の注意';

  @override
  String get startTimer => 'トレーニング開始';

  @override
  String get today => '今日のトレーニング';

  @override
  String get todayEmpty => '筋肉の詳細または種目一覧から追加して、今日のメニューを作成できます';

  @override
  String get remove => '今日のトレーニングから削除';

  @override
  String get clearMuscleFilter => '筋肉の絞り込みを解除';

  @override
  String get timerReady => '準備完了';

  @override
  String get countdown => '準備してください';

  @override
  String get work => 'トレーニング中';

  @override
  String get rest => 'セット間の休憩';

  @override
  String get switchSide => '反対側に切り替え';

  @override
  String get finished => 'トレーニング完了';

  @override
  String get abandoned => 'セッション終了';

  @override
  String get paused => '一時停止中';

  @override
  String get start => '開始';

  @override
  String get completeRep => '1回完了';

  @override
  String get completeSet => 'セット完了';

  @override
  String get skipRest => '休憩を終了';

  @override
  String get addRest => '+15秒休憩';

  @override
  String get painStop => '違和感があれば中止';

  @override
  String get painMessage => '違和感を記録しました。この種目を中止して休み、続けるかどうかを判断してください。';

  @override
  String get saved => 'この端末に保存しました';

  @override
  String get saving => '保存中…';

  @override
  String get saveFailed => '保存を完了できませんでした。このセッションは残っています。もう一度お試しください。';

  @override
  String get storageReadFailed => 'ローカルの記録を一時的に読み込めません。元のデータは保持されています。';

  @override
  String get done => '完了';

  @override
  String get exitTimer => 'このセッションを終了';

  @override
  String get manualMode => '種目の説明に沿って行い、各セットを手動で完了にしてください';

  @override
  String get backgroundPause =>
      'アプリをバックグラウンドにするとトレーニングは一時停止します。戻ったら「再開」をタップしてください。';

  @override
  String setsLabel(int current, int total) {
    return '$current / $total セット';
  }

  @override
  String countLabel(int count) {
    return '$count回';
  }

  @override
  String secondsLabel(int seconds) {
    return '$seconds秒';
  }

  @override
  String stageLabel(int stage) {
    return 'ステージ $stage';
  }

  @override
  String get courseDraft =>
      '学習コース案 · 全18レッスン。レッスン内容と自己評価の基準はコーチによる確認前です。完了しても動作を習得したと自動判定されることはありません。';

  @override
  String get locked => '前のステージのレッスンと自己評価を終えると利用できます';

  @override
  String get current => '現在のステージ';

  @override
  String get passed => '完了';

  @override
  String get lessons => 'レッスン';

  @override
  String get gate => 'ステージの自己評価';

  @override
  String get selfReport => '自己申告です。AI評価ではありません';

  @override
  String get confirmGate => '痛みなく完了しました';

  @override
  String get markLesson => 'レッスンを練習済みにする';

  @override
  String get lessonCompleted => '練習を記録しました';

  @override
  String get watchPhases => '関連する動作を見る';

  @override
  String get suggestedDrills => 'このレッスンの種目';

  @override
  String get assessment => '開始時の自己評価';

  @override
  String get assessmentNote =>
      '直近の実際の結果をもとに選んでください。開始地点を決めるためだけに使用します。手首に違和感がある場合はステージ1から始めてください。能力や健康状態を評価するものではありません。';

  @override
  String get wristTest => '手首の伸展';

  @override
  String get compressionTest => '脚を伸ばしたままのレッグレイズ';

  @override
  String get supportTest => 'Lシット';

  @override
  String get dipsTest => 'コントロールしたディップス';

  @override
  String get hipTest => '開脚での股関節の開き';

  @override
  String get dipsGrade1 => '0～3回 · 初級';

  @override
  String get dipsGrade2 => '4～7回 · 基礎';

  @override
  String get dipsGrade3 => '8～12回 · 良好';

  @override
  String get dipsGrade4 => '13回以上 · 優秀';

  @override
  String get grade1 => '未完了 / 違和感あり';

  @override
  String get grade2 => '基本の種目を実施できる';

  @override
  String get grade3 => '安定してできるが、さらに練習が必要';

  @override
  String get grade4 => '楽にでき、次の段階に進める';

  @override
  String get gradeShort1 => 'まだ';

  @override
  String get gradeShort2 => 'できる';

  @override
  String get gradeShort3 => '安定';

  @override
  String get gradeShort4 => '楽にできる';

  @override
  String get dipsShort1 => '0～3';

  @override
  String get dipsShort2 => '4～7';

  @override
  String get dipsShort3 => '8～12';

  @override
  String get dipsShort4 => '13+';

  @override
  String get saveAssessment => '自己評価した開始地点を保存';

  @override
  String get skipAssessment => '基礎から始める';

  @override
  String get assessmentSaved => '自己評価をこの端末に保存しました';

  @override
  String get welcomeTitle => '一周の動きを、わかりやすいステップに分けて学ぶ';

  @override
  String get welcomeBody =>
      '実物に基づく3Dモデルを回転し、一時停止して筋肉を選び、関連する種目を表示します。動作、図、記録はこの端末に保存され、オフラインでも利用できます。';

  @override
  String get welcomeStep1 => '見る · スロー再生と8つのフェーズ';

  @override
  String get welcomeStep2 => '知る · 各姿勢での筋肉の役割';

  @override
  String get welcomeStep3 => '練習する · セット、タイマー、端末内の記録';

  @override
  String get safetyBody =>
      '最初に手首と肩をウォームアップしてください。自分の能力に合わせて練習し、痛みやめまいがあれば中止してください。初めて一周する際は、適切な場所を選び、経験者にそばで見てもらってください。このコンテンツは動作を学ぶためのもので、診断は行いません。';

  @override
  String get ackSafety => '安全上の注意を確認しました';

  @override
  String get enterApp => '3D動作を開く';

  @override
  String get history => '記録';

  @override
  String get historyEmpty => 'タイマーを使ったセッションを完了すると、ここに表示されます';

  @override
  String get sessionCount => 'セッション数';

  @override
  String get activeMinutes => '練習時間（分）';

  @override
  String get lessonCount => '練習したレッスン';

  @override
  String get incomplete => '未完了';

  @override
  String get painFlag => '違和感を記録';

  @override
  String get aboutTitle => 'Flareについて';

  @override
  String get aboutBody =>
      'ローカル開発版 1.0.0。トーマスフレアを見て、各フェーズでの筋肉の役割を学び、自分に合う種目を選んで練習を記録できます。動作、メディア、記録はオフラインで利用できます。';

  @override
  String get privacyTitle => '端末内データとプライバシー';

  @override
  String get privacyBody =>
      '設定、今日のトレーニング、自己評価、練習記録はこの端末だけに保存されます。モデルとメディアはアプリに含まれ、サーバーにはアップロードされません。ブラウザーのプレビューのデータはそのブラウザーに保存されます。端末の移行や再インストールの前にバックアップをエクスポートしてください。';

  @override
  String get creditsTitle => 'モデルとメディアの出典';

  @override
  String get creditsBody =>
      'Snow Rig © Blender Foundation · CC BY 4.0。衣装、マテリアル、アニメーションを改変。Human Base Meshes · Blender Studio およびコミュニティの貢献者 · CC0。Three.js · MIT。人体モデルの色付き領域は学習用パネルであり、欠けている BodyParts3D の解剖メッシュの代わりではありません。種目とブランドの画像はユーザー提供です。公開前にライセンス確認が必要です。';

  @override
  String get speedLabel => '既定の速度';

  @override
  String get qualityLabel => '画質';

  @override
  String get balanced => 'バランス';

  @override
  String get battery => '省電力';

  @override
  String get high => '高画質';

  @override
  String get exportBackup => '端末内のバックアップをコピー';

  @override
  String get backupCopied => 'バックアップをコピーしました。任意のファイルに保存してください。';

  @override
  String get contentDraftNote => '種目は学習用の提案です。図は各種目の説明に代わるものではありません。';

  @override
  String get close => '閉じる';

  @override
  String pausedAt(String time) {
    return '$time秒で一時停止';
  }

  @override
  String phaseHeading(String source, String name) {
    return '$source · $name';
  }

  @override
  String get primaryShort => '主に使う筋肉';

  @override
  String get secondaryShort => '補助する筋肉';

  @override
  String get together => '連動';

  @override
  String get assistMuscles => '補助する筋肉';

  @override
  String get sceneNone => '器具なし';

  @override
  String get sceneHome => '自宅';

  @override
  String get sceneGym => 'ジム';

  @override
  String get sceneNoneHint => '自重で、どこでも';

  @override
  String get sceneHomeHint => 'トレーニングバンド、ダンベルなどの自宅用器具';

  @override
  String get sceneGymHint => 'マシンとフリーウェイト';

  @override
  String get chooseScene => 'トレーニング環境を選択';

  @override
  String trainGroup(String name) {
    return '$nameを鍛える';
  }

  @override
  String moreCount(int count) {
    return '+$count';
  }

  @override
  String get deepMotionHint => '深層筋 · 色は位置の目安';

  @override
  String get deepMusclesHint => '深層筋 · 斜線は位置の目安';

  @override
  String get noDrillForTier => 'この器具レベルでは、この筋肉の種目はありません';

  @override
  String get brandEyebrow => 'FLARE';

  @override
  String get welcomeHeadline => 'トーマスフレア';

  @override
  String get welcomeLine => '動きを見ながら、その瞬間に働く筋肉を確認できます。';

  @override
  String get startApp => '始める';

  @override
  String get welcomeFootPrefix => '続行すると、次の内容を読んだことになります';

  @override
  String get safetySheetEyebrow => '練習の前に';

  @override
  String get safetySheetTitle => '大切な3つのこと';

  @override
  String get safetyRule1 => 'まず手首を温める';

  @override
  String get safetyRule1Note => '約6分。学習コースの最初のレッスンです';

  @override
  String get safetyRule2 => '鋭い痛み、しびれ、めまいがあれば中止する';

  @override
  String get safetyRule2Note => '筋肉の疲労はあっても、痛みは我慢しない';

  @override
  String get safetyRule3 => 'これは動作の学習コンテンツです';

  @override
  String get safetyRule3Note =>
      'コーチ、医師、リハビリ治療の代わりにはなりません。初めて一周する際は、そばに人がいる状態で行ってください。';

  @override
  String get gotIt => '確認しました';

  @override
  String get startWithAssessment => '自己評価から始める';

  @override
  String get libraryHint => '筋群から種目を探す';

  @override
  String moreProgressHint(int count) {
    return '今週 $count 日';
  }

  @override
  String get playbackSpeed => '再生速度';

  @override
  String phaseMoment(String source) {
    return '$source · この瞬間に主に使う筋肉';
  }

  @override
  String othersInvolved(String names) {
    return 'ほかに使う筋肉 · $names';
  }

  @override
  String groupCount(int count) {
    return 'ほか $count グループ';
  }

  @override
  String get allSections => 'すべての部位';

  @override
  String get search => '検索';

  @override
  String get closeSearch => '検索を閉じる';

  @override
  String get clearSearch => '検索をクリア';

  @override
  String get spec => '負荷の目安';

  @override
  String get moreCuesAndSafety => 'ポイント、よくある間違い、安全上の注意';

  @override
  String get addTodayShort => '今日に追加';

  @override
  String setOfTotal(int current, int total) {
    return '$current / $total セット';
  }

  @override
  String ofReps(int count) {
    return '/ $count回';
  }

  @override
  String get secondsUnit => '秒';

  @override
  String get painStopShort => '違和感があれば中止';

  @override
  String get pathTitle => '学習コース';

  @override
  String continueLesson(String title) {
    return '続ける · $title';
  }

  @override
  String get allDone => 'すべて完了';

  @override
  String get confirmStageGates => '確認待ち · ステージの条件';

  @override
  String get stageGates => 'ステージの自己評価 · 自己申告';

  @override
  String get weekDays => '今週の練習日数';

  @override
  String get streak => '連続日数';

  @override
  String get recent => '最近';

  @override
  String get weekdayLabels => '月,火,水,木,金,土,日';

  @override
  String get todayLabel => '今日';

  @override
  String get completed => '完了';

  @override
  String get playbackGroup => '再生';

  @override
  String get otherGroup => 'その他';

  @override
  String get aboutFlare => 'Flareについて';

  @override
  String get aboutHint => 'バージョン、出典とライセンス、端末内データ';

  @override
  String get safetyHint => '練習前に確認する3つのこと';

  @override
  String get teachingTitle => '学習上の説明';

  @override
  String get licenses => 'オープンソースライセンス';

  @override
  String minutesShort(int count) {
    return '$count分';
  }

  @override
  String get lessonPhases => '関連する動作フェーズ';

  @override
  String phasesShort(String list) {
    return 'フェーズ $list';
  }

  @override
  String get countUnit => '回';

  @override
  String get appearanceGroup => '表示';

  @override
  String get appearanceLabel => 'テーマ';

  @override
  String get themeSystem => 'システム設定に合わせる';

  @override
  String get themeDark => 'ダーク';

  @override
  String get themeLight => 'ライト';

  @override
  String get sceneLoading => '3D動作を読み込み中';

  @override
  String get endSessionTitle => 'このセッションを終了しますか？';

  @override
  String get endSessionBody => '完了した分は未完了の記録として保存されます。';

  @override
  String get endSessionConfirm => '終了して保存';

  @override
  String get keepTraining => 'トレーニングを続ける';

  @override
  String get removedFromToday => '今日のトレーニングから削除しました';

  @override
  String get undo => '元に戻す';

  @override
  String get addedTodayToast => '今日のトレーニングに追加しました';

  @override
  String trainedOn(String day) {
    return '練習済み · $day';
  }

  @override
  String notTrainedOn(String day) {
    return '未練習 · $day';
  }

  @override
  String get drillDemo => '種目の見本を見る';

  @override
  String get hideDrillDemo => '見本を閉じる';

  @override
  String get demoReplay => 'もう一度見る';

  @override
  String get demoSeek => '再生位置';

  @override
  String get demoSpeed => '見本の再生速度';

  @override
  String get demoFailed => '動画を一時的に再生できません。もう一度お試しください。';

  @override
  String get demoPaused => 'トレーニングと見本を一時停止しました';

  @override
  String finishedLine(int sets) {
    return '全$setsセット完了';
  }

  @override
  String get languageLabel => '言語';

  @override
  String get languageSystem => 'システム設定に合わせる';

  @override
  String get languageTitle => 'アプリの言語';

  @override
  String get sceneAccessibleTitle => 'Flare トーマスフレアの3D動作';

  @override
  String weekDayLabel(String day) {
    return '$day曜日';
  }

  @override
  String get syncEffort => '筋肉マップ';

  @override
  String get muscleMap => '筋群マップ';

  @override
  String get phaseMapAccessibility => '動作フェーズに同期する筋群の正面・背面位置図';

  @override
  String viewGroup(String group) {
    return '$groupを見る';
  }

  @override
  String get reviewFirstPhases =>
      'フェーズ09～11を自分で振り返る：後方支持、重心移動、側方支持は滑らかにつながっていますか？';

  @override
  String get reviewFullLoop => '一周の動作を自分で振り返る：手の切り替え、開脚、リズムは滑らかにつながっていますか？';

  @override
  String get wristFlexion => '手首の屈曲';

  @override
  String get wristExtension => '手首の伸展';
}
