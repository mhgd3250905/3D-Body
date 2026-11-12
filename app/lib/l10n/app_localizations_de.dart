// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for German (`de`).
class AppLocalizationsDe extends AppLocalizations {
  AppLocalizationsDe([String locale = 'de']) : super(locale);

  @override
  String get premiumTitle => 'Flare Premium freischalten';

  @override
  String get premiumSubtitle => 'Gestalte dein eigenes Training';

  @override
  String get premiumAiCoach => 'KI-Coach auf Abruf';

  @override
  String get premiumAiPlans => 'Trainingspläne von der KI';

  @override
  String get premiumCustomWorkouts => 'Unbegrenzt eigene Workouts';

  @override
  String get premiumMonthly => 'Monatlich';

  @override
  String get premiumYearly => 'Jährlich';

  @override
  String premiumMonthlyEstimate(String price) {
    return 'Ca. $price/Monat';
  }

  @override
  String premiumSavings(int percent) {
    return '$percent % sparen';
  }

  @override
  String premiumTrial(int days) {
    return '$days Tage kostenlos testen';
  }

  @override
  String get premiumSubscribe => 'Abonnieren';

  @override
  String get premiumPurchaseInProgress => 'Kauf wird bestätigt…';

  @override
  String get premiumDisclosure =>
      'Das Abo verlängert sich automatisch. Du kannst es jederzeit in Google Play kündigen. Kündigst du vor Ende der Testphase, entstehen keine Kosten.';

  @override
  String get premiumRestore => 'Käufe wiederherstellen';

  @override
  String get premiumTerms => 'Nutzungsbedingungen';

  @override
  String get premiumPrivacy => 'Datenschutzerklärung';

  @override
  String get premiumStatus => 'Flare Premium';

  @override
  String get premiumActive => 'Mitgliedschaft aktiv';

  @override
  String get premiumInactive => 'Keine aktive Mitgliedschaft';

  @override
  String get premiumManage => 'Abo verwalten';

  @override
  String get premiumUnavailable =>
      'Der Store ist nicht erreichbar. Versuche es erneut.';

  @override
  String get premiumRestoreEmpty => 'Kein aktives Abo gefunden.';

  @override
  String premiumQuota(int limit) {
    return 'Du hast heute alle $limit KI-Anfragen verbraucht. Versuche es morgen erneut.';
  }

  @override
  String get premiumRateLimit =>
      'Zu viele Anfragen. Versuche es gleich noch einmal.';

  @override
  String get premiumAiDisclaimer =>
      'KI-Vorschläge dienen nur zur Orientierung und sind kein ärztlicher Rat.';

  @override
  String get actorBodyLabel => 'Thomas-Figur';

  @override
  String get actorBodyOriginal => 'Comic-Trainer';

  @override
  String get actorBodyTraining => 'Trainingsfigur';

  @override
  String get actorBodyShadow => 'Schatten';

  @override
  String get actorBodyChrome => 'Silberflügel';

  @override
  String get actorBodyStreet => 'Street';

  @override
  String get actorBodyRobot => 'Mecha';

  @override
  String get actorBodyCyber => 'Cyber-Silber';

  @override
  String get appName => 'Flare Thomas';

  @override
  String get tagline => 'Verstehe die Bewegung. Trainiere jeden Schritt.';

  @override
  String get watch => 'Bewegung';

  @override
  String get library => 'Training';

  @override
  String get path => 'Lernpfad';

  @override
  String get progress => 'Verlauf';

  @override
  String get settings => 'Einstellungen';

  @override
  String get motionBrand => 'Flare · Thomas-Assistent';

  @override
  String get more => 'Mehr';

  @override
  String get timeline => 'Bewegungsablauf';

  @override
  String get phaseLabel => 'Bewegungsphase';

  @override
  String get viewLabel => 'Ansicht';

  @override
  String get switchToMuscles => 'Stehendes Muskelmodell anzeigen';

  @override
  String get switchToMotion => 'Thomas in Bewegung anzeigen';

  @override
  String get fullLoop => 'Vollständiger Ablauf · 8 Phasen';

  @override
  String get practiceLoop => 'Diese Phase wiederholen';

  @override
  String get restoreLoop => 'Vollständigen Ablauf wiederherstellen';

  @override
  String get play => 'Abspielen';

  @override
  String get pause => 'Pausieren';

  @override
  String get resume => 'Fortsetzen';

  @override
  String get resetView => 'Ansicht zurücksetzen';

  @override
  String get front => 'Vorne';

  @override
  String get back => 'Hinten';

  @override
  String get goBack => 'Zurück';

  @override
  String get side => 'Seite';

  @override
  String get pausedHint => 'Muskeln ansehen';

  @override
  String get playingHint => 'Erst pausieren';

  @override
  String get loadingScene => '3D-Bewegung wird vorbereitet…';

  @override
  String get sceneFailed =>
      'Die 3D-Ansicht ist vorübergehend nicht verfügbar. Öffne die Bewegungsseite erneut.';

  @override
  String get retry => 'Erneut versuchen';

  @override
  String get muscles => 'Muskeln in dieser Phase';

  @override
  String get primary => 'Hauptfunktion';

  @override
  String get secondary => 'Unterstützende Funktion';

  @override
  String get teachingNote =>
      'Farbige Bereiche zeigen didaktische Positionen. Sie stellen weder EMG-Aktivität noch Muskelkraft oder exakte Muskelgrenzen dar.';

  @override
  String get deepNote => 'Schraffuren markieren die Position tiefer Muskeln.';

  @override
  String get deepMotionNote =>
      'Die Hervorhebung markiert die Position eines tiefer liegenden Muskels.';

  @override
  String get bothSides => 'Beide Seiten';

  @override
  String get leftSide => 'Linke Seite';

  @override
  String get rightSide => 'Rechte Seite';

  @override
  String get whyHere => 'Funktion in dieser Phase';

  @override
  String get relatedDrills => 'Gezielte Übungen';

  @override
  String get sourceNote => 'Hinweise zu Modell und didaktischen Positionen';

  @override
  String get returnToMotion => 'Zum selben Zeitpunkt zurückkehren';

  @override
  String get addToday => 'Zum heutigen Training hinzufügen';

  @override
  String get addedToday => 'Zum heutigen Training hinzugefügt';

  @override
  String get tierA => 'A Eigengewicht';

  @override
  String get tierB => 'B Heimtrainingsgeräte';

  @override
  String get tierC => 'C Fitnessstudio';

  @override
  String get all => 'Alle';

  @override
  String get supportSection => 'Schulter- und Armstütz';

  @override
  String get coreSection => 'Rumpfkoordination';

  @override
  String get legsSection => 'Hüft- und Beinschwung';

  @override
  String get searchDrills => 'Übungen oder Muskeln suchen';

  @override
  String get libraryCount => '51 Übungen · 17 Muskelgruppen';

  @override
  String get noResults =>
      'Keine passenden Übungen gefunden. Suche nach etwas anderem.';

  @override
  String get illustration => 'Übungsdemonstration';

  @override
  String get dose => 'Sätze und Zeit';

  @override
  String get equipment => 'Ausrüstung';

  @override
  String get cues => 'Technikhinweise';

  @override
  String get mistake => 'Häufige Fehler';

  @override
  String get drillWhy => 'Warum diese Übung?';

  @override
  String get safety => 'Sicherheit';

  @override
  String get startTimer => 'Training starten';

  @override
  String get today => 'Heutiges Training';

  @override
  String get todayEmpty =>
      'Füge über die Muskeldetails oder die Bibliothek Übungen für das heutige Training hinzu';

  @override
  String get remove => 'Aus dem heutigen Training entfernen';

  @override
  String get clearMuscleFilter => 'Muskelfilter löschen';

  @override
  String get countdown => 'Mach dich bereit';

  @override
  String get work => 'Training';

  @override
  String get rest => 'Pause zwischen den Sätzen';

  @override
  String get switchSide => 'Seite wechseln';

  @override
  String get finished => 'Training abgeschlossen';

  @override
  String get abandoned => 'Training beendet';

  @override
  String get paused => 'Pausiert';

  @override
  String get start => 'Starten';

  @override
  String get completeSet => 'Satz abschließen';

  @override
  String get skipRest => 'Pause beenden';

  @override
  String get addRest => '+15 Sek. Pause';

  @override
  String get saved => 'Auf diesem Gerät gespeichert';

  @override
  String get saving => 'Wird gespeichert…';

  @override
  String get saveFailed =>
      'Speichern nicht abgeschlossen. Diese Einheit ist noch verfügbar. Versuche es erneut.';

  @override
  String get storageReadFailed =>
      'Lokale Einträge sind vorübergehend nicht verfügbar. Deine ursprünglichen Daten bleiben erhalten.';

  @override
  String get done => 'Fertig';

  @override
  String get manualMode =>
      'Folge der Übungsanleitung und bestätige jeden Satz manuell';

  @override
  String get backgroundPause =>
      'Das Training pausiert, wenn die App im Hintergrund ist. Tippe nach deiner Rückkehr auf Fortsetzen.';

  @override
  String setsLabel(int current, int total) {
    return 'Satz $current von $total';
  }

  @override
  String countLabel(int count) {
    return '$count Wiederholungen';
  }

  @override
  String secondsLabel(int seconds) {
    return '$seconds Sek.';
  }

  @override
  String stageLabel(int stage) {
    return 'Stufe $stage';
  }

  @override
  String get courseDraft =>
      'Entwurf des Lernpfads · 18 Lektionen. Lektionen und Selbsteinschätzungskriterien müssen noch von einem Trainer geprüft werden. Der Abschluss bedeutet nicht automatisch, dass du die Bewegung beherrschst.';

  @override
  String get locked =>
      'Wird nach den Lektionen und der Selbsteinschätzung der vorherigen Stufe freigeschaltet';

  @override
  String get current => 'Aktuelle Stufe';

  @override
  String get passed => 'Abgeschlossen';

  @override
  String get lessons => 'Lektionen';

  @override
  String get gate => 'Selbsteinschätzung der Stufe';

  @override
  String get selfReport => 'Selbstauskunft; keine KI-Bewertung';

  @override
  String get confirmGate => 'Ich habe die Übung schmerzfrei abgeschlossen';

  @override
  String get markLesson => 'Lektion als geübt markieren';

  @override
  String get lessonCompleted => 'Übung erfasst';

  @override
  String get watchPhases => 'Zugehörige Bewegung ansehen';

  @override
  String get suggestedDrills => 'Übungen zu dieser Lektion';

  @override
  String get assessment => 'Einstiegs-Selbsteinschätzung';

  @override
  String get assessmentNote =>
      'Wähle anhand deiner letzten tatsächlichen Leistung. Das dient nur zur Wahl eines Startpunkts. Bei Beschwerden am Handgelenk beginne mit Stufe 1. Dies ist keine Leistungs- oder medizinische Beurteilung.';

  @override
  String get wristTest => 'Handgelenkstreckung';

  @override
  String get compressionTest => 'Gestrecktes Beinheben';

  @override
  String get supportTest => 'L-Sitz';

  @override
  String get dipsTest => 'Kontrollierte Dips';

  @override
  String get hipTest => 'Hüftöffnung im Grätschsitz';

  @override
  String get dipsGrade1 => '0–3 Wiederholungen · Einstieg';

  @override
  String get dipsGrade2 => '4–7 Wiederholungen · Grundstufe';

  @override
  String get dipsGrade3 => '8–12 Wiederholungen · Gut';

  @override
  String get dipsGrade4 => '13 oder mehr · Sehr gut';

  @override
  String get grade1 => 'Nicht abgeschlossen / Beschwerden';

  @override
  String get grade2 => 'Grundübungen sind möglich';

  @override
  String get grade3 => 'Stabile Ausführung; weiter üben';

  @override
  String get grade4 => 'Leicht ausgeführt; bereit für den nächsten Schritt';

  @override
  String get gradeShort1 => 'Noch nicht';

  @override
  String get gradeShort2 => 'Möglich';

  @override
  String get gradeShort3 => 'Stabil';

  @override
  String get gradeShort4 => 'Leicht';

  @override
  String get dipsShort1 => '0–3';

  @override
  String get dipsShort2 => '4–7';

  @override
  String get dipsShort3 => '8–12';

  @override
  String get dipsShort4 => '13+';

  @override
  String get saveAssessment => 'Selbsteingeschätzten Startpunkt speichern';

  @override
  String get skipAssessment => 'Mit den Grundlagen beginnen';

  @override
  String get assessmentSaved =>
      'Selbsteinschätzung auf diesem Gerät gespeichert';

  @override
  String get welcomeTitle => 'Teile eine ganze Drehung in klare Schritte';

  @override
  String get welcomeBody =>
      'Drehe ein echtes 3D-Modell, pausiere zur Auswahl von Muskeln und öffne eine passende Übung. Bewegungen, Abbildungen und Einträge bleiben auf diesem Gerät und funktionieren offline.';

  @override
  String get welcomeStep1 => 'Ansehen · Zeitlupe und acht Phasen';

  @override
  String get welcomeStep2 => 'Verstehen · Muskelrollen in jeder Haltung';

  @override
  String get welcomeStep3 => 'Trainieren · Sätze, Timer und lokale Einträge';

  @override
  String get safetyBody =>
      'Wärme zuerst Handgelenke und Schultern auf. Trainiere innerhalb deiner Fähigkeiten und pausiere bei Schmerzen oder Schwindel. Wähle für deine erste vollständige Drehung einen geeigneten Ort und bitte eine erfahrene Person, dich zu begleiten. Diese Inhalte erklären Bewegungen und stellen keine Diagnose.';

  @override
  String get ackSafety => 'Ich habe die Sicherheitshinweise verstanden';

  @override
  String get enterApp => '3D-Bewegung öffnen';

  @override
  String get history => 'Verlauf';

  @override
  String get historyEmpty =>
      'Schließe eine zeitgesteuerte Trainingseinheit ab, damit sie hier erscheint';

  @override
  String get sessionCount => 'Trainingseinheiten';

  @override
  String get activeMinutes => 'Trainingsminuten';

  @override
  String get lessonCount => 'Geübte Lektionen';

  @override
  String get incomplete => 'Unvollständig';

  @override
  String get painFlag => 'Beschwerden erfasst';

  @override
  String get aboutTitle => 'Über Flare';

  @override
  String get aboutBody =>
      'Lokale Entwicklungsversion 1.0.0. Sieh dir einen Thomas-Flare an, lerne die Muskelrollen in den einzelnen Phasen kennen, wähle passende Übungen und erfasse dein Training. Bewegung, Medien und Trainingseinträge sind offline verfügbar.';

  @override
  String get privacyTitle => 'Lokale Daten und Datenschutz';

  @override
  String get privacyBody =>
      'Einstellungen, deine Pläne, Selbsteinschätzungen und Trainingseinträge werden nur auf diesem Gerät gespeichert. Daten in der Browser-Vorschau gehören zu diesem Browser. Exportiere vor einem Gerätewechsel oder einer Neuinstallation eine Sicherung.';

  @override
  String get aiConsentTitle => '使用 AI 前请确认';

  @override
  String get aiConsentIntroduction =>
      '为了生成回答，Flare 会把以下内容发送给第三方大语言模型服务商（当前使用 DeepSeek 模型）处理：';

  @override
  String get aiConsentConversation => '你输入的文字和本次对话内容';

  @override
  String get aiConsentTrainingContext => '你提到的练习目标、器材、身体限制或不适';

  @override
  String get aiConsentLocalData => '不会发送：本机训练记录、自测结果。';

  @override
  String get aiConsentPrivacyLink => '查看隐私政策';

  @override
  String get aiConsentAgree => '同意并继续';

  @override
  String get aiConsentDecline => '暂不使用';

  @override
  String get aiConsentPrivacyTitle => 'AI 定制与设备标识';

  @override
  String get aiConsentPrivacyGateway =>
      'Cloudflare 网关使用 RevenueCat 匿名应用用户 ID 校验会员资格，并记录请求次数以执行额度和防滥用限制。网关不会向模型服务商转发该标识。';

  @override
  String get aiConsentWithdraw => '撤回 AI 数据共享同意';

  @override
  String get aiConsentWithdrawn => '已撤回，下次使用 AI 时会再次询问';

  @override
  String get aiConsentSaveFailed => '无法保存你的 AI 数据共享选择，请重试。';

  @override
  String get creditsTitle => 'Quellen für Modelle und Medien';

  @override
  String get creditsBody =>
      'Snow Rig © Blender Foundation · CC BY 4.0; Kleidung, Materialien und Animation geändert. Human Base Meshes · Blender Studio und Community-Beitragende · CC0. Three.js · MIT. Farbige Bereiche am Modell sind didaktische Felder und ersetzen keine fehlenden BodyParts3D-Anatomiemeshes. Übungs- und Markenbilder stammen vom Nutzer; die Lizenzen müssen vor einer Veröffentlichung noch geprüft werden.';

  @override
  String get speedLabel => 'Standardtempo';

  @override
  String get qualityLabel => 'Bildqualität';

  @override
  String get balanced => 'Ausgewogen';

  @override
  String get battery => 'Energiesparen';

  @override
  String get high => 'Hoch';

  @override
  String get exportBackup => 'Lokale Sicherung kopieren';

  @override
  String get backupCopied =>
      'Sicherung kopiert. Speichere sie in einer Datei deiner Wahl.';

  @override
  String get contentDraftNote =>
      'Übungen sind didaktische Vorschläge. Abbildungen ersetzen nicht die jeweilige Übungsanleitung.';

  @override
  String get close => 'Schließen';

  @override
  String pausedAt(String time) {
    return 'Pausiert bei $time Sek.';
  }

  @override
  String phaseHeading(String source, String name) {
    return '$source · $name';
  }

  @override
  String get primaryShort => 'Hauptmuskel';

  @override
  String get secondaryShort => 'Unterstützend';

  @override
  String get together => 'Gemeinsam aktiv';

  @override
  String get assistMuscles => 'Unterstützende Muskeln';

  @override
  String get sceneNone => 'Ohne Geräte';

  @override
  String get sceneHome => 'Zu Hause';

  @override
  String get sceneGym => 'Fitnessstudio';

  @override
  String get sceneNoneHint => 'Eigengewicht, überall';

  @override
  String get sceneHomeHint =>
      'Widerstandsbänder, Kurzhanteln und weitere Heimtrainingsgeräte';

  @override
  String get sceneGymHint => 'Maschinen und freie Gewichte';

  @override
  String get chooseScene => 'Wähle eine Trainingsumgebung';

  @override
  String trainGroup(String name) {
    return 'Trainiere $name';
  }

  @override
  String moreCount(int count) {
    return '+$count';
  }

  @override
  String get deepMotionHint => 'Tiefer Muskel · Farbe markiert seine Position';

  @override
  String get deepMusclesHint =>
      'Tiefer Muskel · Schraffur markiert seine Position';

  @override
  String get noDrillForTier =>
      'Für diesen Muskel sind auf dieser Ausstattungsstufe keine Übungen verfügbar';

  @override
  String get brandEyebrow => 'FLARE';

  @override
  String get welcomeHeadline => 'Thomas-Flare';

  @override
  String get welcomeLine =>
      'Verfolge die Bewegung und sieh, welche Muskeln in jedem Moment arbeiten.';

  @override
  String get startApp => 'Los geht’s';

  @override
  String get welcomeFootPrefix =>
      'Wenn du fortfährst, bestätigst du, dass du Folgendes gelesen hast:';

  @override
  String get safetySheetEyebrow => 'Vor dem Training';

  @override
  String get safetySheetTitle => 'Drei wichtige Hinweise';

  @override
  String get safetyRule1 => 'Wärme zuerst deine Handgelenke auf';

  @override
  String get safetyRule1Note => 'Der Plan „Aufwärmen“ führt dich durch';

  @override
  String get safetyRule2 =>
      'Bei stechendem Schmerz, Taubheit oder Schwindel aufhören';

  @override
  String get safetyRule2Note =>
      'Muskelanstrengung ist in Ordnung; Schmerzen nicht';

  @override
  String get safetyRule3 => 'Hier werden Bewegungen vermittelt';

  @override
  String get safetyRule3Note =>
      'Dies ersetzt weder Trainer noch Arzt oder Rehabilitation. Lass dich bei deiner ersten vollständigen Drehung begleiten.';

  @override
  String get gotIt => 'Verstanden';

  @override
  String get startWithAssessment => 'Mit einer Selbsteinschätzung beginnen';

  @override
  String get libraryHint => 'Übungen nach Muskelgruppe finden';

  @override
  String moreProgressHint(int count) {
    return '$count Tage diese Woche';
  }

  @override
  String get playbackSpeed => 'Wiedergabegeschwindigkeit';

  @override
  String phaseMoment(String source) {
    return '$source · Hauptmuskeln in diesem Moment';
  }

  @override
  String othersInvolved(String names) {
    return 'Ebenfalls beteiligt · $names';
  }

  @override
  String groupCount(int count) {
    return 'und $count Gruppen';
  }

  @override
  String get allSections => 'Alle Bereiche';

  @override
  String get search => 'Suchen';

  @override
  String get closeSearch => 'Suche schließen';

  @override
  String get clearSearch => 'Suche löschen';

  @override
  String get spec => 'Dosierung';

  @override
  String get moreCuesAndSafety =>
      'Weitere Hinweise, häufige Fehler und Sicherheit';

  @override
  String get addTodayShort => 'Heute hinzufügen';

  @override
  String get secondsUnit => 'Sek.';

  @override
  String get painStopShort => 'Bei Beschwerden Training beenden';

  @override
  String get pathTitle => 'Lernpfad';

  @override
  String continueLesson(String title) {
    return 'Weiter · $title';
  }

  @override
  String get allDone => 'Alles abgeschlossen';

  @override
  String get confirmStageGates => 'Noch zu bestätigen · Stufenanforderungen';

  @override
  String get stageGates => 'Selbsteinschätzung der Stufe · Selbstauskunft';

  @override
  String get weekDays => 'Trainingstage diese Woche';

  @override
  String get streak => 'Tage in Folge';

  @override
  String get recent => 'Zuletzt';

  @override
  String get weekdayLabels => 'Mo,Di,Mi,Do,Fr,Sa,So';

  @override
  String get todayLabel => 'Heute';

  @override
  String get completed => 'Abgeschlossen';

  @override
  String get playbackGroup => 'Wiedergabe';

  @override
  String get otherGroup => 'Sonstiges';

  @override
  String get aboutFlare => 'Über Flare';

  @override
  String get aboutHint => 'Version, Quellen und Lizenzen, lokale Daten';

  @override
  String get safetyHint => 'Drei Hinweise vor dem Training';

  @override
  String get teachingTitle => 'Didaktische Hinweise';

  @override
  String get licenses => 'Open-Source-Lizenzen';

  @override
  String minutesShort(int count) {
    return '$count Min.';
  }

  @override
  String get lessonPhases => 'Zugehörige Bewegungsphasen';

  @override
  String phasesShort(String list) {
    return 'Phasen $list';
  }

  @override
  String get appearanceGroup => 'Darstellung';

  @override
  String get appearanceLabel => 'Design';

  @override
  String get themeSystem => 'System';

  @override
  String get themeDark => 'Dunkel';

  @override
  String get themeLight => 'Hell';

  @override
  String get sceneLoading => '3D-Bewegung wird geladen';

  @override
  String get endSessionTitle => 'Diese Einheit beenden?';

  @override
  String get endSessionBody =>
      'Der abgeschlossene Teil wird als unvollständiger Eintrag gespeichert.';

  @override
  String get endSessionConfirm => 'Beenden und speichern';

  @override
  String get keepTraining => 'Weiter trainieren';

  @override
  String get removedFromToday => 'Aus dem heutigen Training entfernt';

  @override
  String get undo => 'Rückgängig';

  @override
  String get addedTodayToast => 'Zum heutigen Training hinzugefügt';

  @override
  String trainedOn(String day) {
    return 'Trainiert · $day';
  }

  @override
  String notTrainedOn(String day) {
    return 'Nicht trainiert · $day';
  }

  @override
  String get drillDemo => 'Übungsdemo ansehen';

  @override
  String get demoReplay => 'Erneut abspielen';

  @override
  String get demoSeek => 'Wiedergabeposition';

  @override
  String get demoSpeed => 'Demogeschwindigkeit';

  @override
  String get demoFailed =>
      'Das Video ist vorübergehend nicht verfügbar. Versuche es erneut.';

  @override
  String get demoPaused => 'Training pausiert; Demo ebenfalls pausiert';

  @override
  String get languageLabel => 'Sprache';

  @override
  String get languageSystem => 'Systemeinstellung';

  @override
  String get languageTitle => 'App-Sprache';

  @override
  String get sceneAccessibleTitle => '3D-Bewegung: Thomas-Flare von Flare';

  @override
  String weekDayLabel(String day) {
    return 'Wochentag $day';
  }

  @override
  String get syncEffort => 'Muskelkarte';

  @override
  String get muscleMap => 'Muskelkarte';

  @override
  String get phaseMapAccessibility =>
      'Mit der Bewegungsphase synchronisierte Muskelkarten von vorn und hinten';

  @override
  String viewGroup(String group) {
    return '$group ansehen';
  }

  @override
  String get reviewFirstPhases =>
      'Phasen 09–11 selbst durchgehen: Sind hinterer Stütz, Gewichtsverlagerung und Seitstütz flüssig?';

  @override
  String get reviewFullLoop =>
      'Den ganzen Ablauf selbst durchgehen: Sind Handwechsel, Beinöffnung und Rhythmus flüssig?';

  @override
  String get wristFlexion => 'Handgelenkbeugung';

  @override
  String get wristExtension => 'Handgelenkstreckung';

  @override
  String get plans => 'Pläne';

  @override
  String get plansHint => 'Fertige Einheiten und deine eigenen';

  @override
  String get plansReady => 'Fertige Einheiten';

  @override
  String get plansMine => 'Meine Pläne';

  @override
  String get planNew => 'Neuer Plan';

  @override
  String get planNewHint =>
      'Fasse wiederkehrende Übungen zusammen und starte sie mit einem Tipp';

  @override
  String planMeta(int count, int minutes) {
    return '$count Übungen · ca. $minutes Min.';
  }

  @override
  String get planStart => 'Starten';

  @override
  String get planSaveAsMine => 'Als meinen Plan speichern';

  @override
  String get premiumCopyRoutine => 'Plan kopieren';

  @override
  String get planSaved => 'In Meine Pläne gespeichert';

  @override
  String get planEdit => 'Bearbeiten';

  @override
  String get planDelete => 'Plan löschen';

  @override
  String get planDeleted => 'Plan gelöscht';

  @override
  String get planNameHint => 'Planname';

  @override
  String get planDefaultName => 'Meine Einheit';

  @override
  String get planAddDrills => 'Übungen hinzufügen';

  @override
  String get planEmptyDrills => 'Noch keine Übungen. Füge ein paar hinzu';

  @override
  String get planSave => 'Speichern';

  @override
  String get planAddTo => 'Zu Plan hinzufügen';

  @override
  String planAddedTo(String name) {
    return 'Zu „$name“ hinzugefügt';
  }

  @override
  String get planNewWith => 'Neuer Plan mit dieser Übung';

  @override
  String get planNext => 'Weiter';

  @override
  String get planSkip => 'Überspringen';

  @override
  String get planAllDone => 'Einheit geschafft';

  @override
  String get pickerTitle => 'Übungen wählen';

  @override
  String pickerSelected(int count) {
    return '$count ausgewählt';
  }

  @override
  String get planReorderHint => 'Zum Sortieren am Griff ziehen';

  @override
  String get planRemoveDrill => 'Aus Plan entfernen';

  @override
  String get presetWarmup => 'Aufwärmen';

  @override
  String get presetWarmupLine =>
      'Handgelenke und Schulterblätter vor jeder Einheit aktivieren';

  @override
  String get presetSupport => 'Armstütz';

  @override
  String get presetSupportLine => 'Den Boden halten, stabil bleiben';

  @override
  String get presetCore => 'Rumpf-Kompression';

  @override
  String get presetCoreLine => 'Hüfte heben, Beine einziehen';

  @override
  String get presetLegs => 'Beinkreise';

  @override
  String get presetLegsLine => 'Beine öffnen, weit kreisen';

  @override
  String get presetSide => 'Seitstütz';

  @override
  String get presetSideLine =>
      'Stabiler Seitstütz, Schulter beim Wechsel halten';

  @override
  String get presetFlare => 'Ganze Flare-Kette';

  @override
  String get presetFlareLine =>
      'Alle Hauptmuskelgruppen des Flares in einer Einheit';

  @override
  String get planUpNext => 'Als Nächstes';

  @override
  String planDrillCount(int count) {
    return '$count Übungen';
  }

  @override
  String get settingsHint => 'Darstellung, Wiedergabe, Qualität';

  @override
  String get planRunEnded => 'Einheit beendet';

  @override
  String get trainerSoundOn => 'Sprache und Töne einschalten';

  @override
  String get trainerSoundOff => 'Sprache und Töne ausschalten';

  @override
  String get filterAction => 'Filter';

  @override
  String get filterReset => 'Zurücksetzen';

  @override
  String filterShowCount(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count Übungen anzeigen',
      one: '1 Übung anzeigen',
    );
    return '$_temp0';
  }

  @override
  String get filterScene => 'Umgebung';

  @override
  String get filterSection => 'Bereich';

  @override
  String get pickerAdded => 'Hinzugefügt';

  @override
  String get recordsStreakUnit => 'Tage in Folge';

  @override
  String get recordsSessions => 'Einheiten';

  @override
  String get recordsMinutes => 'Minuten';

  @override
  String get recordsDays => 'Trainingstage';

  @override
  String get recordsThisWeek => 'Diese Woche';

  @override
  String get recordsHeatmap => 'Letzte 16 Wochen';

  @override
  String get recordsMilestones => 'Meilensteine';

  @override
  String milestoneDays(int count) {
    return '$count Tage in Folge';
  }

  @override
  String milestoneLeft(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'Noch $count Tage',
      one: 'Noch 1 Tag',
    );
    return '$_temp0';
  }

  @override
  String milestoneEarned(String date) {
    return 'Erreicht am $date';
  }

  @override
  String get milestoneLocked => 'Gesperrt';

  @override
  String milestoneUnlocked(int count) {
    return 'Meilenstein erreicht: $count Tage in Folge';
  }

  @override
  String get recordsEmptyTitle => 'Noch keine Einheiten';

  @override
  String get recordsEmptyAction => 'Erste Übung starten';

  @override
  String get heatLess => 'Weniger';

  @override
  String get heatMore => 'Mehr';

  @override
  String pickerAddCount(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count Übungen hinzufügen',
      one: '1 Übung hinzufügen',
    );
    return '$_temp0';
  }

  @override
  String libraryDose(int sets, String amount) {
    return '$sets Sätze × $amount';
  }
}
