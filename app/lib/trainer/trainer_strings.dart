import 'package:ugk_trainer_runtime/ugk_trainer.dart' as sdk;

import '../l10n/app_localizations.dart';

// Only vocabulary absent from the host's existing 14-language ARBs lives here.
// first move, round, countdown caption, discomfort, discomfort title,
// easier continuation, previous move, minutes, completed moves, load failure,
// unavailable move, each side.
const _words = <String, List<String>>{
  'zh': [
    '第一个动作',
    '轮',
    '秒后开始',
    '不舒服',
    '哪里不舒服？',
    '减小幅度，继续',
    '上一个动作',
    '分钟',
    '完成动作',
    '训练暂时无法载入',
    '动作不可用',
    '每侧',
  ],
  'zh_Hant': [
    '第一個動作',
    '輪',
    '秒後開始',
    '不舒服',
    '哪裡不舒服？',
    '減小幅度，繼續',
    '上一個動作',
    '分鐘',
    '完成動作',
    '暫時無法載入訓練',
    '動作無法使用',
    '每側',
  ],
  'en': [
    'First move',
    'Round',
    'sec to go',
    'Discomfort',
    'What feels wrong?',
    'Reduce the range, continue',
    'Previous move',
    'min',
    'moves done',
    'Training could not be loaded',
    'Move unavailable',
    'each side',
  ],
  'es': [
    'Primer ejercicio',
    'Ronda',
    's para empezar',
    'Molestias',
    '¿Qué molestia sientes?',
    'Reduce la amplitud y continúa',
    'Ejercicio anterior',
    'min',
    'ejercicios completados',
    'No se pudo cargar el entrenamiento',
    'Ejercicio no disponible',
    'por lado',
  ],
  'pt': [
    'Primeiro exercício',
    'Volta',
    's para começar',
    'Desconforto',
    'O que está a incomodar?',
    'Reduz a amplitude e continua',
    'Exercício anterior',
    'min',
    'exercícios concluídos',
    'Não foi possível carregar o treino',
    'Exercício indisponível',
    'de cada lado',
  ],
  'fr': [
    'Premier exercice',
    'Tour',
    's avant de commencer',
    'Gêne',
    'Où ressentez-vous une gêne ?',
    'Réduire l’amplitude et continuer',
    'Exercice précédent',
    'min',
    'exercices terminés',
    'Impossible de charger la séance',
    'Exercice indisponible',
    'de chaque côté',
  ],
  'de': [
    'Erste Übung',
    'Runde',
    's bis zum Start',
    'Beschwerden',
    'Was fühlt sich unangenehm an?',
    'Bewegungsumfang verringern, weiter',
    'Vorherige Übung',
    'Min.',
    'Übungen geschafft',
    'Training konnte nicht geladen werden',
    'Übung nicht verfügbar',
    'je Seite',
  ],
  'it': [
    'Primo esercizio',
    'Giro',
    's all’inizio',
    'Fastidio',
    'Dove senti fastidio?',
    'Riduci l’ampiezza e continua',
    'Esercizio precedente',
    'min',
    'esercizi completati',
    'Impossibile caricare l’allenamento',
    'Esercizio non disponibile',
    'per lato',
  ],
  'ru': [
    'Первое упражнение',
    'Круг',
    'с до начала',
    'Дискомфорт',
    'Что вызывает дискомфорт?',
    'Уменьшить амплитуду и продолжить',
    'Предыдущее упражнение',
    'мин',
    'упражнений выполнено',
    'Не удалось загрузить тренировку',
    'Упражнение недоступно',
    'на каждую сторону',
  ],
  'ja': [
    '最初の種目',
    'ラウンド',
    '秒で開始',
    '違和感',
    'どこに違和感がありますか？',
    '可動域を小さくして続ける',
    '前の種目',
    '分',
    '完了した種目',
    'トレーニングを読み込めませんでした',
    '種目を利用できません',
    '左右それぞれ',
  ],
  'ko': [
    '첫 동작',
    '라운드',
    '초 후 시작',
    '불편함',
    '어디가 불편한가요?',
    '동작 범위를 줄여 계속',
    '이전 동작',
    '분',
    '완료한 동작',
    '훈련을 불러올 수 없습니다',
    '동작을 사용할 수 없습니다',
    '각 방향',
  ],
  'ar': [
    'التمرين الأول',
    'جولة',
    'ث حتى البدء',
    'انزعاج',
    'أين تشعر بالانزعاج؟',
    'قلّل مدى الحركة وتابع',
    'التمرين السابق',
    'دقيقة',
    'تمارين مكتملة',
    'تعذّر تحميل التدريب',
    'التمرين غير متاح',
    'لكل جانب',
  ],
  'hi': [
    'पहला व्यायाम',
    'दौर',
    'सेकंड में शुरू',
    'असुविधा',
    'कहाँ असुविधा हो रही है?',
    'गति की सीमा घटाकर जारी रखें',
    'पिछला व्यायाम',
    'मिनट',
    'पूरे किए व्यायाम',
    'प्रशिक्षण लोड नहीं हो सका',
    'व्यायाम उपलब्ध नहीं है',
    'हर तरफ़',
  ],
  'id': [
    'Gerakan pertama',
    'Putaran',
    'dtk sebelum mulai',
    'Rasa tidak nyaman',
    'Bagian mana yang tidak nyaman?',
    'Kurangi rentang gerak, lanjutkan',
    'Gerakan sebelumnya',
    'menit',
    'gerakan selesai',
    'Latihan tidak dapat dimuat',
    'Gerakan tidak tersedia',
    'tiap sisi',
  ],
};

List<String> _for(AppLocalizations s) =>
    _words[s.localeName] ??
    _words[s.localeName.split('_').first] ??
    _words['en']!;

String trainerLoadFailed(AppLocalizations s) => _for(s)[9];
String trainerMoveUnavailable(AppLocalizations s) => _for(s)[10];

// Rest feedback belongs to the player and uses the app's locale.
const _restFeedback =
    <String, (String, String, String, String, String, String)>{
      'zh': ('刚才感觉怎么样？', '选择刚才的感受', '已选择', '舒服', '有点紧', '疼'),
      'zh_Hant': ('剛才感覺如何？', '選擇剛才的感受', '已選擇', '舒服', '有點緊', '痛'),
      'en': (
        'How did that feel?',
        'Choose how the last set felt',
        'Selected',
        'Good',
        'Tight',
        'Pain',
      ),
      'es': (
        '¿Cómo te sentiste?',
        'Elige cómo sentiste la serie',
        'Seleccionado',
        'Bien',
        'Tensión',
        'Dolor',
      ),
      'pt': (
        'Como te sentiste?',
        'Escolhe como foi a série',
        'Selecionado',
        'Bem',
        'Tensão',
        'Dor',
      ),
      'fr': (
        'Comment te sens-tu ?',
        'Évalue ta dernière série',
        'Sélectionné',
        'Bien',
        'Tension',
        'Douleur',
      ),
      'de': (
        'Wie hat es sich angefühlt?',
        'Bewerte den letzten Satz',
        'Ausgewählt',
        'Gut',
        'Spannung',
        'Schmerz',
      ),
      'it': (
        'Come ti sei sentito?',
        'Valuta l’ultima serie',
        'Selezionato',
        'Bene',
        'Tensione',
        'Dolore',
      ),
      'ru': (
        'Как ощущения?',
        'Оцени последний подход',
        'Выбрано',
        'Хорошо',
        'Напряжение',
        'Боль',
      ),
      'ja': ('どんな感じでしたか？', '直前のセットの感覚を選択', '選択済み', '快適', '張り', '痛み'),
      'ko': ('어떤 느낌이었나요?', '직전 세트의 느낌을 선택하세요', '선택됨', '편안함', '뻐근함', '통증'),
      'ar': (
        'كيف شعرت؟',
        'اختر شعورك في المجموعة الأخيرة',
        'تم الاختيار',
        'جيد',
        'شدّ',
        'ألم',
      ),
      'hi': (
        'कैसा लगा?',
        'पिछले सेट का अनुभव चुनें',
        'चुन लिया',
        'अच्छा',
        'खिंचाव',
        'दर्द',
      ),
      'id': (
        'Bagaimana rasanya?',
        'Pilih rasanya pada set terakhir',
        'Dipilih',
        'Nyaman',
        'Tegang',
        'Nyeri',
      ),
    };

(String, String, String, String, String, String) trainerRestFeedbackLabels(
  AppLocalizations s,
) =>
    _restFeedback[s.localeName] ??
    _restFeedback[s.localeName.split('_').first] ??
    _restFeedback['en']!;

const _completeTimed = <String, String>{
  'zh': '提前完成本段',
  'zh_Hant': '提前完成本段',
  'en': 'Finish this timed part',
  'es': 'Terminar este tramo cronometrado',
  'pt': 'Concluir esta parte cronometrada',
  'fr': 'Terminer cette partie chronométrée',
  'de': 'Diesen Zeitabschnitt beenden',
  'it': 'Termina questa parte a tempo',
  'ru': 'Завершить этот отрезок',
  'ja': 'この時間区間を終了',
  'ko': '이 시간 구간 완료',
  'ar': 'إنهاء هذا الجزء الموقّت',
  'hi': 'यह समयबद्ध भाग पूरा करें',
  'id': 'Selesaikan bagian berwaktu ini',
};

// The four positions come from the existing forearms-A teaching cue. They are
// labels for the shared demonstration, not newly rendered individual clips.
const _wristDirections = <String, List<String>>{
  'zh': ['手指朝前', '手指朝侧', '手指朝后', '手背撑地'],
  'zh_Hant': ['手指朝前', '手指朝側', '手指朝後', '手背撐地'],
  'en': [
    'Fingers forward',
    'Fingers sideways',
    'Fingers backward',
    'Backs of hands down',
  ],
  'es': [
    'Dedos al frente',
    'Dedos hacia los lados',
    'Dedos hacia atrás',
    'Dorso de las manos apoyado',
  ],
  'pt': [
    'Dedos para a frente',
    'Dedos para os lados',
    'Dedos para trás',
    'Dorso das mãos apoiado',
  ],
  'fr': [
    'Doigts vers l’avant',
    'Doigts sur les côtés',
    'Doigts vers l’arrière',
    'Dos des mains au sol',
  ],
  'de': [
    'Finger nach vorn',
    'Finger zur Seite',
    'Finger nach hinten',
    'Handrücken am Boden',
  ],
  'it': [
    'Dita in avanti',
    'Dita verso i lati',
    'Dita all’indietro',
    'Dorso delle mani a terra',
  ],
  'ru': [
    'Пальцы вперёд',
    'Пальцы в стороны',
    'Пальцы назад',
    'Тыльной стороной ладоней вниз',
  ],
  'ja': ['指を前に向ける', '指を横に向ける', '指を後ろに向ける', '手の甲を床につける'],
  'ko': ['손가락을 앞으로', '손가락을 옆으로', '손가락을 뒤로', '손등을 바닥에'],
  'ar': [
    'الأصابع للأمام',
    'الأصابع إلى الجانبين',
    'الأصابع للخلف',
    'ظهر اليدين على الأرض',
  ],
  'hi': [
    'उँगलियाँ आगे',
    'उँगलियाँ बगल की ओर',
    'उँगलियाँ पीछे',
    'हाथों का पिछला भाग नीचे',
  ],
  'id': [
    'Jari ke depan',
    'Jari ke samping',
    'Jari ke belakang',
    'Punggung tangan di lantai',
  ],
};

List<String> trainerWristDirections(AppLocalizations s) =>
    _wristDirections[s.localeName] ??
    _wristDirections[s.localeName.split('_').first] ??
    _wristDirections['en']!;

const _timedWristCue = <String, String>{
  'zh': '每个手位轻摇约 15 秒',
  'zh_Hant': '每個手位輕搖約 15 秒',
  'en': 'Rock gently for about 15 seconds in each position',
  'es': 'Balancéate suavemente unos 15 segundos en cada posición',
  'pt': 'Balance-se suavemente por cerca de 15 segundos em cada posição',
  'fr': 'Balancez-vous doucement environ 15 secondes dans chaque position',
  'de': 'In jeder Handposition etwa 15 Sekunden sanft vor und zurück wippen',
  'it': 'Dondola delicatamente per circa 15 secondi in ogni posizione',
  'ru': 'Мягко покачивайтесь около 15 секунд в каждом положении рук',
  'ja': '手の向きごとに約15秒、やさしく体を揺らす',
  'ko': '손 위치마다 약 15초 동안 가볍게 몸을 흔드세요',
  'ar': 'تأرجح برفق لنحو ١٥ ثانية في كل وضعية لليدين',
  'hi': 'हाथों की हर स्थिति में लगभग 15 सेकंड हल्के से झूलें',
  'id': 'Goyangkan tubuh perlahan sekitar 15 detik di setiap posisi',
};

String trainerTimedWristCue(AppLocalizations s) =>
    _timedWristCue[s.localeName] ??
    _timedWristCue[s.localeName.split('_').first] ??
    _timedWristCue['en']!;

String? _completionTitle(AppLocalizations s, sdk.SessionResult? result) {
  if (result == null ||
      result.completedExercises == 0 ||
      result.completedExercises >= result.totalExercises) {
    return null;
  }
  final progress = '${result.completedExercises}/${result.totalExercises}';
  // The V1 heading takes host copy, but its subtitle is the SDK plan name.
  // Keep the achievement immediately below the heading in the same slot.
  return switch (s.localeName) {
    'zh' => '今天先练到这里\n完成 $progress 个动作',
    'zh_Hant' => '今天先練到這裡\n完成 $progress 個動作',
    _ => '${s.planRunEnded}\n$progress ${_for(s)[8]}',
  };
}

sdk.TrainerStrings trainerStrings(
  AppLocalizations s, {
  sdk.SessionResult? result,
}) {
  final w = _for(s);
  final playerCopy = s.localeName.startsWith('zh')
      ? sdk.TrainerStrings.zh()
      : sdk.TrainerStrings.en();
  return sdk.TrainerStrings(
    extendRest: s.addRest,
    completeTimedPhase:
        _completeTimed[s.localeName] ??
        _completeTimed[s.localeName.split('_').first] ??
        _completeTimed['en']!,
    soundOn: s.trainerSoundOn,
    soundOff: s.trainerSoundOff,
    prepFirst: '${s.countdown} · ${w[0]}',
    restNext: '${s.rest} · ${s.planNext}',
    restBetweenSets: s.rest,
    roundRest: '${s.completed} · ${s.rest}',
    switchTo: (side) =>
        '${s.switchSide} · ${side == sdk.Side.left ? s.leftSide : s.rightSide}',
    sideName: (side) => side == sdk.Side.left ? s.leftSide : s.rightSide,
    roundOf: (round, rounds) => '${w[1]} $round/$rounds',
    setOf: s.setsLabel,
    dose: ({required bool reps, required int amount, required bool perSide}) =>
        '${reps ? s.countLabel(amount) : s.secondsLabel(amount)}${perSide ? ' · ${w[11]}' : ''}',
    secondsCaption: s.secondsUnit,
    startsInCaption: w[2],
    repsCaption: (reps) => '/ ${s.countLabel(reps)}',
    selfPacedCaption: s.manualMode,
    completeSet: s.completeSet,
    paused: s.paused,
    next: s.planNext,
    nextUp: s.planUpNext,
    upcomingLabel: s.planUpNext,
    restLabel: s.rest,
    demonstration: s.drillDemo,
    startTraining: s.startTimer,
    playerStart: s.start,
    howTo: s.cues,
    instructionsLabel: s.cues,
    precautions: s.safety,
    closeInstructions: playerCopy.closeInstructions,
    discomfort: w[3],
    discomfortTitle: w[4],
    discomfortBody: '${s.safetyRule2}. ${s.safetyRule2Note}.',
    discomfortContinue: w[5],
    discomfortSkip: s.planSkip,
    discomfortEnd: s.endSessionConfirm,
    close: s.close,
    closeTitle: s.endSessionTitle,
    closeSheetTitle: s.endSessionTitle,
    closeSheetProgress: playerCopy.closeSheetProgress,
    closeBody: s.endSessionBody,
    closeConfirm: s.endSessionConfirm,
    closeCancel: s.keepTraining,
    previous: w[6],
    skip: s.planSkip,
    pause: s.pause,
    resume: s.resume,
    doneFull: s.planAllDone,
    donePartial: s.planRunEnded,
    completionTitle: _completionTitle(s, result),
    minutes: w[7],
    exercisesDone: w[8],
    finish: s.done,
    feelingPrompt: playerCopy.feelingPrompt,
    feelingLabels: playerCopy.feelingLabels,
    actualDuration: playerCopy.actualDuration,
    totalReps: playerCopy.totalReps,
    totalWorkTime: playerCopy.totalWorkTime,
    streak: s.streak,
    trainedAreasLabel: playerCopy.trainedAreasLabel,
    skipped: playerCopy.skipped,
    replay: playerCopy.replay,
    durationLabel: playerCopy.durationLabel,
    saveFailed: s.saveFailed,
    saveRetry: s.retry,
    mediaUnavailable: s.demoFailed,
    mediaDownloading: playerCopy.mediaDownloading,
    mediaDownloadingSemantics: playerCopy.mediaDownloadingSemantics,
    mediaDownloadFailed: playerCopy.mediaDownloadFailed,
    mediaDownloadFailedSemantics: playerCopy.mediaDownloadFailedSemantics,
    mediaDownloadVerifying: playerCopy.mediaDownloadVerifying,
    mediaDownloadReady: playerCopy.mediaDownloadReady,
    notificationChannel: s.library,
    notificationChannelDescription: s.library,
    notificationTitle: s.appName,
    // The SDK owns playback state; this fixed text stays accurate when paused.
    notificationText: s.library,
  );
}
