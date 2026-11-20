// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Arabic (`ar`).
class AppLocalizationsAr extends AppLocalizations {
  AppLocalizationsAr([String locale = 'ar']) : super(locale);

  @override
  String get premiumPreviewBadge => 'FLARE PRO';

  @override
  String get premiumPreviewSubscribe => 'افتح مزايا Flare Pro';

  @override
  String get premiumPreviewFooter =>
      'بعد الاشتراك، تتاح لك التدريبات والسجل والخطط المخصصة.';

  @override
  String get premiumPreviewBenefitStreak => 'أيام متتالية';

  @override
  String get premiumPreviewBenefitMilestones => 'الإنجازات';

  @override
  String get premiumPreviewBenefitDuration => 'مدة التدريب';

  @override
  String get premiumPreviewBenefitActions => 'اختيار التمارين';

  @override
  String get premiumPreviewBenefitSets => 'مجموعات مرنة';

  @override
  String get premiumPreviewBenefitSaves => 'حفظ بلا حدود';

  @override
  String get premiumPreviewBenefitVoice => 'توقيت صوتي';

  @override
  String get premiumPreviewBenefitDemos => 'عرض التمارين';

  @override
  String get premiumPreviewBenefitLogging => 'تسجيل تلقائي';

  @override
  String get premiumPreviewRecordsTitle => 'سجّل كل تمرين';

  @override
  String get premiumPreviewRecordsHighlight => 'كل';

  @override
  String get premiumPreviewRecordsDescription =>
      'يُحفظ وقت التمرين وأيام التدريب المتتالية والإنجازات تلقائيًا، لتتابع تقدّمك بسهولة.';

  @override
  String get premiumPreviewPlanEditorTitle => 'صمّم خطتك بنفسك';

  @override
  String get premiumPreviewPlanEditorHighlight => 'بنفسك';

  @override
  String get premiumPreviewPlanEditorDescription =>
      'اختر التمارين وعدّل عدد المجموعات واحفظ خطتك التدريبية الخاصة.';

  @override
  String get premiumPreviewTrainingTitle => 'تدرّب معنا، كل مجموعة تُحسب';

  @override
  String get premiumPreviewTrainingHighlight => 'كل مجموعة';

  @override
  String get premiumPreviewTrainingDescription =>
      'تابع التوقيت الصوتي وعروض التمارين. تُسجَّل جلستك تلقائيًا عند الانتهاء.';

  @override
  String premiumConditionalTrial(int days) {
    return 'تجربة مجانية لمدة $days أيام للمؤهلين';
  }

  @override
  String premiumSubscribeAt(String price) {
    return 'اشترك مقابل $price';
  }

  @override
  String premiumTrialOffer(int days) {
    return 'تجربة مجانية لمدة $days أيام';
  }

  @override
  String premiumPlanSummary(int count) {
    return '$count خطة لكل مرحلة من تمرين فلير';
  }

  @override
  String get premiumAngleCount => 'الزوايا الرئيسية';

  @override
  String get premiumMuscleCount => 'المجموعات العضلية';

  @override
  String get premiumLevelCount => 'مستويات الصعوبة';

  @override
  String get premiumVoiceTitle => 'إرشاد صوتي وعروض ثلاثية الأبعاد';

  @override
  String get premiumVoiceDescription => 'تنبيهات للعدّ وتبديل الجانب والراحة';

  @override
  String get premiumCustomDescription => 'أنشئ خطة من تمارينك المعتادة';

  @override
  String get premiumPerYear => '/سنة';

  @override
  String get premiumPerMonth => '/شهر';

  @override
  String premiumStoreOffline(String store) {
    return 'تعذّر الاتصال بـ $store. تُطبّق أسعار المتجر.';
  }

  @override
  String premiumStoreRetryFailed(String store) {
    return 'لا يزال الاتصال بـ $store متعذّرًا. أعد المحاولة لاحقًا.';
  }

  @override
  String premiumTrialRenewal(String price, String store) {
    return 'يتجدّد الاشتراك بسعر $price بعد التجربة. يمكنك الإلغاء في أي وقت من $store.';
  }

  @override
  String premiumPaidRenewal(String price, String store) {
    return 'يتجدّد الاشتراك بسعر $price. يمكنك الإلغاء في أي وقت من $store.';
  }

  @override
  String premiumStoreRenewal(String store) {
    return 'يتجدّد الاشتراك تلقائيًا. يمكنك الإلغاء من $store.';
  }

  @override
  String get premiumTitle => 'افتح Flare Premium';

  @override
  String get premiumSubtitle => 'صمّم تدريبك بطريقتك';

  @override
  String get premiumAiCoach => 'ابدأ أي خطة تدريب في أي وقت';

  @override
  String get premiumAiPlans =>
      'خطط حسب الزاوية والمجموعة العضلية بثلاثة مستويات';

  @override
  String get premiumCustomWorkouts => 'تمارين مخصصة بلا حدود';

  @override
  String get premiumMonthly => 'شهري';

  @override
  String get premiumYearly => 'سنوي';

  @override
  String premiumMonthlyEstimate(String price) {
    return 'حوالي $price شهريًا';
  }

  @override
  String premiumSavings(int percent) {
    return 'وفّر $percent٪';
  }

  @override
  String premiumTrial(int days) {
    return 'ابدأ تجربة مجانية لمدة $days أيام';
  }

  @override
  String get premiumSubscribe => 'اشترك';

  @override
  String get premiumDisclosure =>
      'يتجدد الاشتراك تلقائيًا. يمكنك إلغاؤه في أي وقت عبر Google Play. ألغِ الاشتراك قبل انتهاء التجربة لتجنب أي رسوم.';

  @override
  String get premiumRestore => 'استعادة المشتريات';

  @override
  String get premiumTerms => 'شروط الخدمة';

  @override
  String get premiumPrivacy => 'سياسة الخصوصية';

  @override
  String get premiumStatus => 'Flare Premium';

  @override
  String get premiumActive => 'العضوية نشطة';

  @override
  String get premiumInactive => 'لا توجد عضوية نشطة';

  @override
  String get premiumManage => 'إدارة الاشتراك';

  @override
  String get premiumUnavailable => 'المتجر غير متاح. حاول مرة أخرى.';

  @override
  String get premiumRestoreEmpty => 'لم يتم العثور على اشتراك نشط.';

  @override
  String premiumQuota(int limit) {
    return 'استخدمت جميع طلبات الذكاء الاصطناعي اليوم ($limit). عُد غدًا.';
  }

  @override
  String get premiumRateLimit => 'طلبات كثيرة جدًا. حاول بعد قليل.';

  @override
  String get premiumAiDisclaimer =>
      'اقتراحات الذكاء الاصطناعي للرجوع إليها فقط وليست نصيحة طبية.';

  @override
  String get actorBodyLabel => 'شخصية توماس';

  @override
  String get actorBodyOriginal => 'مدرب كرتوني';

  @override
  String get actorBodyTraining => 'مجسم تدريب';

  @override
  String get actorBodyShadow => 'ظل الليل';

  @override
  String get actorBodyChrome => 'جناح فضي';

  @override
  String get actorBodyStreet => 'ستايل الشارع';

  @override
  String get actorBodyRobot => 'ميكا';

  @override
  String get actorBodyCyber => 'فضة سايبر';

  @override
  String get appName => 'Flare توماس';

  @override
  String get flareStraightLegs => 'توماس (بساقين ممدودتين)';

  @override
  String get tagline => 'افهم الحركة وتدرّب على كل خطوة.';

  @override
  String get watch => 'الحركة';

  @override
  String get library => 'التدريب';

  @override
  String get path => 'المسار';

  @override
  String get progress => 'السجل';

  @override
  String get settings => 'الإعدادات';

  @override
  String get motionBrand => 'Flare · مساعد توماس';

  @override
  String get more => 'المزيد';

  @override
  String get timeline => 'مخطط الحركة الزمني';

  @override
  String get phaseLabel => 'مرحلة الحركة';

  @override
  String get viewLabel => 'المنظور';

  @override
  String get switchToMuscles => 'عرض نموذج العضلات واقفًا';

  @override
  String get switchToMotion => 'عرض حركة توماس';

  @override
  String get fullLoop => 'الحركة كاملة · 8 مراحل';

  @override
  String get practiceLoop => 'تكرار هذه المرحلة';

  @override
  String get restoreLoop => 'استعادة الحركة كاملة';

  @override
  String get play => 'تشغيل';

  @override
  String get pause => 'إيقاف مؤقت';

  @override
  String get resume => 'متابعة';

  @override
  String get resetView => 'إعادة ضبط المنظور';

  @override
  String get front => 'الأمام';

  @override
  String get back => 'الخلف';

  @override
  String get goBack => 'رجوع';

  @override
  String get side => 'الجانب';

  @override
  String get homeGoToTraining => 'اذهب إلى التدريب';

  @override
  String get loadingScene => 'جارٍ تجهيز الحركة ثلاثية الأبعاد…';

  @override
  String get sceneFailed =>
      'العرض ثلاثي الأبعاد غير متاح مؤقتًا. أعد فتح صفحة الحركة.';

  @override
  String get retry => 'إعادة المحاولة';

  @override
  String get muscles => 'عضلات هذه المرحلة';

  @override
  String get primary => 'الدور الأساسي';

  @override
  String get secondary => 'الدور المساند';

  @override
  String get teachingNote =>
      'توضح المناطق الملونة مواقع تعليمية. ولا تمثل نشاط تخطيط كهربية العضل أو قوة العضلة أو حدودها الدقيقة.';

  @override
  String get deepNote => 'يشير التظليل المخطط إلى موضع العضلات العميقة.';

  @override
  String get deepMotionNote => 'يشير التمييز إلى موضع عضلة عميقة.';

  @override
  String get bothSides => 'الجانبان';

  @override
  String get leftSide => 'الجانب الأيسر';

  @override
  String get rightSide => 'الجانب الأيمن';

  @override
  String get whyHere => 'الدور في هذه المرحلة';

  @override
  String get relatedDrills => 'تمارين مستهدفة';

  @override
  String get sourceNote => 'ملاحظات عن النموذج والمواقع التعليمية';

  @override
  String get returnToMotion => 'العودة إلى الإطار نفسه';

  @override
  String get addToday => 'أضف إلى تدريب اليوم';

  @override
  String get addedToday => 'أُضيف إلى تدريب اليوم';

  @override
  String get tierA => 'A وزن الجسم';

  @override
  String get tierB => 'B معدات منزلية';

  @override
  String get tierC => 'C النادي الرياضي';

  @override
  String get all => 'الكل';

  @override
  String get supportSection => 'دعم الكتفين والذراعين';

  @override
  String get coreSection => 'تنسيق عضلات الجذع';

  @override
  String get legsSection => 'تأرجح الوركين والساقين';

  @override
  String get searchDrills => 'ابحث عن تمارين أو عضلات';

  @override
  String get libraryCount => '51 تمرينًا · 17 مجموعة عضلية';

  @override
  String get noResults => 'لا توجد تمارين مطابقة. جرّب بحثًا آخر.';

  @override
  String get illustration => 'عرض توضيحي للتمرين';

  @override
  String get dose => 'المجموعات والوقت';

  @override
  String get equipment => 'المعدات';

  @override
  String get cues => 'إرشادات الحركة';

  @override
  String get mistake => 'أخطاء شائعة';

  @override
  String get drillWhy => 'لماذا تمارس هذا التمرين؟';

  @override
  String get safety => 'السلامة';

  @override
  String get startTimer => 'ابدأ التدريب';

  @override
  String get today => 'تدريب اليوم';

  @override
  String get todayEmpty =>
      'أضف تمارين من تفاصيل العضلات أو المكتبة لإعداد تدريب اليوم';

  @override
  String get remove => 'إزالة من تدريب اليوم';

  @override
  String get clearMuscleFilter => 'مسح تصفية العضلات';

  @override
  String get countdown => 'استعد';

  @override
  String get work => 'قيد التدريب';

  @override
  String get rest => 'الراحة بين المجموعات';

  @override
  String get switchSide => 'بدّل إلى الجانب الآخر';

  @override
  String get finished => 'اكتمل التدريب';

  @override
  String get abandoned => 'انتهت الجلسة';

  @override
  String get paused => 'متوقف مؤقتًا';

  @override
  String get start => 'ابدأ';

  @override
  String get completeSet => 'أكمل المجموعة';

  @override
  String get skipRest => 'إنهاء الراحة';

  @override
  String get addRest => '+15 ثانية راحة';

  @override
  String get saved => 'حُفظ على هذا الجهاز';

  @override
  String get saving => 'جارٍ الحفظ…';

  @override
  String get saveFailed =>
      'لم يكتمل الحفظ. ما زالت هذه الجلسة متاحة؛ حاول مجددًا.';

  @override
  String get storageReadFailed =>
      'السجلات المحلية غير متاحة مؤقتًا. تم الاحتفاظ ببياناتك الأصلية.';

  @override
  String get done => 'تم';

  @override
  String get manualMode =>
      'اتبع تعليمات التمرين ثم أكّد إكمال كل مجموعة يدويًا';

  @override
  String get backgroundPause =>
      'يتوقف التدريب مؤقتًا عند انتقال التطبيق إلى الخلفية. اضغط متابعة عند العودة.';

  @override
  String setsLabel(int current, int total) {
    return 'المجموعة $current من $total';
  }

  @override
  String countLabel(int count) {
    return '$count تكرارًا';
  }

  @override
  String secondsLabel(int seconds) {
    return '$seconds ث';
  }

  @override
  String stageLabel(int stage) {
    return 'المرحلة $stage';
  }

  @override
  String get courseDraft =>
      'مسودة مسار التعلّم · 18 درسًا. لا تزال الدروس وحدود التقييم الذاتي بحاجة إلى مراجعة مدرّب؛ وإكمالها لا يعني تلقائيًا إتقان الحركة.';

  @override
  String get locked => 'يُفتح بعد إكمال دروس المرحلة السابقة وتقييمها الذاتي';

  @override
  String get current => 'المرحلة الحالية';

  @override
  String get passed => 'مكتمل';

  @override
  String get lessons => 'الدروس';

  @override
  String get gate => 'تقييم المرحلة الذاتي';

  @override
  String get selfReport => 'تقييم ذاتي، وليس تقييمًا بالذكاء الاصطناعي';

  @override
  String get confirmGate => 'أكملت ذلك دون ألم';

  @override
  String get markLesson => 'وضع علامة على الدرس بأنه تم التدرب عليه';

  @override
  String get lessonCompleted => 'تم تسجيل التدريب';

  @override
  String get watchPhases => 'مشاهدة الحركة المرتبطة';

  @override
  String get suggestedDrills => 'تمارين هذا الدرس';

  @override
  String get assessment => 'تقييم ذاتي أولي';

  @override
  String get assessmentNote =>
      'اختر وفقًا لآخر أداء فعلي لك. الغرض فقط تحديد نقطة بداية. إذا شعرت بانزعاج في المعصم فابدأ من المرحلة 1. هذا ليس تقييمًا للقدرات أو تقييمًا طبيًا.';

  @override
  String get wristTest => 'بسط المعصم';

  @override
  String get compressionTest => 'رفع الساق مستقيمة';

  @override
  String get supportTest => 'الجلوس على شكل L';

  @override
  String get dipsTest => 'تمارين المتوازي بتحكم';

  @override
  String get hipTest => 'فتح الوركين بوضعية التفتيح';

  @override
  String get dipsGrade1 => '0–3 تكرارات · مبتدئ';

  @override
  String get dipsGrade2 => '4–7 تكرارات · أساسي';

  @override
  String get dipsGrade3 => '8–12 تكرارًا · جيد';

  @override
  String get dipsGrade4 => '13 تكرارًا فأكثر · ممتاز';

  @override
  String get grade1 => 'لم يكتمل / شعور بانزعاج';

  @override
  String get grade2 => 'يمكنه إكمال التمارين الأساسية';

  @override
  String get grade3 => 'أداء ثابت ويحتاج إلى مزيد من التدريب';

  @override
  String get grade4 => 'أداء مريح وجاهز للتقدم';

  @override
  String get gradeShort1 => 'ليس بعد';

  @override
  String get gradeShort2 => 'يمكنه ذلك';

  @override
  String get gradeShort3 => 'ثابت';

  @override
  String get gradeShort4 => 'بسهولة';

  @override
  String get dipsShort1 => '0–3';

  @override
  String get dipsShort2 => '4–7';

  @override
  String get dipsShort3 => '8–12';

  @override
  String get dipsShort4 => '13+';

  @override
  String get saveAssessment => 'حفظ نقطة البداية وفق التقييم الذاتي';

  @override
  String get skipAssessment => 'ابدأ بالأساسيات';

  @override
  String get assessmentSaved => 'حُفظ التقييم الذاتي على هذا الجهاز';

  @override
  String get welcomeTitle => 'قسّم دورة كاملة إلى خطوات واضحة';

  @override
  String get welcomeBody =>
      'أدر نموذجًا حقيقيًا ثلاثي الأبعاد، وأوقفه لاختيار العضلات، ثم افتح تمرينًا مناسبًا. تبقى الحركة والرسوم والسجلات على هذا الجهاز وتعمل دون اتصال.';

  @override
  String get welcomeStep1 => 'شاهد · حركة بطيئة وثماني مراحل';

  @override
  String get welcomeStep2 => 'افهم · دور العضلات في كل وضعية';

  @override
  String get welcomeStep3 => 'تدرّب · مجموعات ومؤقتات وسجلات محلية';

  @override
  String get safetyBody =>
      'أحمِ معصميك وكتفيك أولًا. تدرّب وفق قدراتك وتوقف إذا شعرت بألم أو دوار. عند تجربة الدورة الكاملة لأول مرة، اختر مكانًا مناسبًا واطلب من شخص ذي خبرة أن يبقى معك. هذا المحتوى لتعلّم الحركة ولا يقدم تشخيصًا.';

  @override
  String get ackSafety => 'أفهم إرشادات السلامة';

  @override
  String get enterApp => 'فتح الحركة ثلاثية الأبعاد';

  @override
  String get history => 'السجل';

  @override
  String get historyEmpty => 'أكمل جلسة تدريب مؤقتة لتظهر هنا';

  @override
  String get sessionCount => 'الجلسات';

  @override
  String get activeMinutes => 'دقائق التدريب';

  @override
  String get lessonCount => 'الدروس التي تدربت عليها';

  @override
  String get incomplete => 'غير مكتمل';

  @override
  String get painFlag => 'تم تسجيل انزعاج';

  @override
  String get aboutTitle => 'عن Flare';

  @override
  String get aboutBody =>
      'إصدار تطوير محلي 1.0.0. شاهد حركة توماس فلير، وتعرّف على دور العضلات في كل مرحلة، واختر تمارين مناسبة وسجّل تدريبك. تعمل الحركة والوسائط وسجلات التدريب دون اتصال.';

  @override
  String get privacyTitle => 'البيانات المحلية والخصوصية';

  @override
  String get privacyBody =>
      'تُحفظ الإعدادات وخططك والتقييمات الذاتية وسجلات التدريب على هذا الجهاز فقط. تأتي النماذج والوسائط مع التطبيق ولا يُرفع شيء إلى خادم. بيانات معاينة المتصفح خاصة بذلك المتصفح. صدّر نسخة احتياطية قبل نقل البيانات أو إعادة التثبيت.';

  @override
  String get creditsTitle => 'مصادر النماذج والوسائط';

  @override
  String get creditsBody =>
      'Snow Rig © Blender Foundation · CC BY 4.0؛ تم تعديل الملابس والمواد والرسوم المتحركة. Human Base Meshes · Blender Studio والمساهمون من المجتمع · CC0. Three.js · MIT. المناطق الملونة على النموذج لوحات تعليمية ولا تحل محل الشبكات التشريحية المفقودة من BodyParts3D. قدّم المستخدم صور التمارين والعلامة؛ ويجب استكمال التحقق من التراخيص قبل الإصدار.';

  @override
  String get speedLabel => 'السرعة الافتراضية';

  @override
  String get qualityLabel => 'جودة الصورة';

  @override
  String get balanced => 'متوازنة';

  @override
  String get battery => 'توفير البطارية';

  @override
  String get high => 'عالية';

  @override
  String get exportBackup => 'نسخ احتياطي محلي';

  @override
  String get backupCopied =>
      'تم نسخ النسخة الاحتياطية. احفظها في ملف من اختيارك.';

  @override
  String get contentDraftNote =>
      'التمارين اقتراحات تعليمية. ولا تحل الرسوم محل تعليمات كل تمرين.';

  @override
  String get close => 'إغلاق';

  @override
  String pausedAt(String time) {
    return 'متوقف عند $time ث';
  }

  @override
  String phaseHeading(String source, String name) {
    return '$source · $name';
  }

  @override
  String get primaryShort => 'أساسي';

  @override
  String get secondaryShort => 'مساند';

  @override
  String get together => 'عمل مشترك';

  @override
  String get assistMuscles => 'العضلات المساندة';

  @override
  String get sceneNone => 'دون معدات';

  @override
  String get sceneHome => 'في المنزل';

  @override
  String get sceneGym => 'في النادي';

  @override
  String get sceneNoneHint => 'بوزن الجسم، في أي مكان';

  @override
  String get sceneHomeHint => 'أشرطة مقاومة وأثقال يدوية ومعدات منزلية أخرى';

  @override
  String get sceneGymHint => 'أجهزة وأوزان حرة';

  @override
  String get chooseScene => 'اختر بيئة التدريب';

  @override
  String trainGroup(String name) {
    return 'درّب $name';
  }

  @override
  String moreCount(int count) {
    return '+$count';
  }

  @override
  String get deepMotionHint => 'عضلة عميقة · يشير اللون إلى موقعها';

  @override
  String get deepMusclesHint => 'عضلة عميقة · يشير التخطيط إلى موقعها';

  @override
  String get noDrillForTier =>
      'لا تتوفر تمارين لهذه العضلة مع مستوى المعدات هذا';

  @override
  String get brandEyebrow => 'FLARE';

  @override
  String get welcomeHeadline => 'حركة توماس فلير';

  @override
  String get welcomeLine => 'تابع الحركة واكتشف العضلات التي تعمل في كل لحظة.';

  @override
  String get startApp => 'ابدأ';

  @override
  String get welcomeFootPrefix => 'بالمتابعة، تؤكد أنك قرأت';

  @override
  String get safetySheetEyebrow => 'قبل التدريب';

  @override
  String get safetySheetTitle => 'ثلاثة أمور مهمة';

  @override
  String get safetyRule1 => 'أحمِ معصميك أولًا';

  @override
  String get safetyRule1Note => 'حرّك معصميك ولوحي كتفيك قبل أن تبدأ التدريب.';

  @override
  String get safetyRule2 => 'توقف عند الألم الحاد أو الخدر أو الدوار';

  @override
  String get safetyRule2Note => 'إجهاد العضلات مقبول، أما الألم فلا';

  @override
  String get safetyRule3 => 'هذا محتوى لتعلّم الحركة';

  @override
  String get safetyRule3Note =>
      'لا يحل محل المدرّب أو الطبيب أو العلاج التأهيلي. اطلب من شخص أن يرافقك عند تجربة الدورة كاملة لأول مرة.';

  @override
  String get gotIt => 'فهمت';

  @override
  String get startWithAssessment => 'ابدأ بتقييم ذاتي';

  @override
  String get libraryHint => 'اعثر على تمارين حسب مجموعة العضلات';

  @override
  String moreProgressHint(int count) {
    return '$count أيام هذا الأسبوع';
  }

  @override
  String get playbackSpeed => 'سرعة التشغيل';

  @override
  String phaseMoment(String source) {
    return '$source · العضلات الأساسية في هذه اللحظة';
  }

  @override
  String othersInvolved(String names) {
    return 'عضلات أخرى مشاركة · $names';
  }

  @override
  String groupCount(int count) {
    return 'و$count مجموعات';
  }

  @override
  String get allSections => 'كل المناطق';

  @override
  String get search => 'بحث';

  @override
  String get closeSearch => 'إغلاق البحث';

  @override
  String get clearSearch => 'مسح البحث';

  @override
  String get spec => 'الجرعة التدريبية';

  @override
  String get moreCuesAndSafety => 'مزيد من الإرشادات والأخطاء الشائعة والسلامة';

  @override
  String get addTodayShort => 'أضف اليوم';

  @override
  String get secondsUnit => 'ث';

  @override
  String get painStopShort => 'توقف عند الشعور بعدم الارتياح';

  @override
  String get pathTitle => 'مسار التعلّم';

  @override
  String continueLesson(String title) {
    return 'متابعة · $title';
  }

  @override
  String get allDone => 'اكتمل الكل';

  @override
  String get confirmStageGates => 'بانتظار التأكيد · متطلبات المرحلة';

  @override
  String get stageGates => 'تقييم المرحلة الذاتي · إقرار شخصي';

  @override
  String get weekDays => 'أيام التدريب هذا الأسبوع';

  @override
  String get streak => 'أيام متتالية';

  @override
  String get recent => 'الأحدث';

  @override
  String get weekdayLabels => 'اثن,ثلا,أرب,خمي,جمع,سبت,أحد';

  @override
  String get todayLabel => 'اليوم';

  @override
  String get completed => 'مكتمل';

  @override
  String get playbackGroup => 'التشغيل';

  @override
  String get otherGroup => 'أخرى';

  @override
  String get aboutFlare => 'عن Flare';

  @override
  String get aboutHint => 'الإصدار والمصادر والتراخيص والبيانات المحلية';

  @override
  String get safetyHint => 'ثلاثة أمور قبل التدريب';

  @override
  String get teachingTitle => 'ملاحظات تعليمية';

  @override
  String get licenses => 'تراخيص مفتوحة المصدر';

  @override
  String minutesShort(int count) {
    return '$count د';
  }

  @override
  String get lessonPhases => 'مراحل الحركة المرتبطة';

  @override
  String phasesShort(String list) {
    return 'المراحل $list';
  }

  @override
  String get appearanceGroup => 'المظهر';

  @override
  String get appearanceLabel => 'السمة';

  @override
  String get themeSystem => 'النظام';

  @override
  String get themeDark => 'داكن';

  @override
  String get themeLight => 'فاتح';

  @override
  String get sceneLoading => 'جارٍ تحميل الحركة ثلاثية الأبعاد';

  @override
  String get endSessionTitle => 'هل تريد إنهاء هذه الجلسة؟';

  @override
  String get endSessionBody => 'سيُحفظ الجزء المكتمل كسجل غير مكتمل.';

  @override
  String get endSessionConfirm => 'إنهاء وحفظ';

  @override
  String get keepTraining => 'متابعة التدريب';

  @override
  String get removedFromToday => 'أُزيل من تدريب اليوم';

  @override
  String get undo => 'تراجع';

  @override
  String get addedTodayToast => 'أُضيف إلى تدريب اليوم';

  @override
  String trainedOn(String day) {
    return 'تم التدريب · $day';
  }

  @override
  String notTrainedOn(String day) {
    return 'لم يتم التدريب · $day';
  }

  @override
  String get drillDemo => 'مشاهدة عرض التمرين';

  @override
  String get demoReplay => 'إعادة التشغيل';

  @override
  String get demoSeek => 'موضع التشغيل';

  @override
  String get demoSpeed => 'سرعة العرض';

  @override
  String get demoFailed => 'الفيديو غير متاح مؤقتًا. حاول مجددًا.';

  @override
  String get demoPaused => 'توقف التدريب والعرض مؤقتًا';

  @override
  String get languageLabel => 'اللغة';

  @override
  String get languageSystem => 'اتباع إعداد النظام';

  @override
  String get languageTitle => 'لغة التطبيق';

  @override
  String get sceneAccessibleTitle => 'حركة توماس فلير ثلاثية الأبعاد من Flare';

  @override
  String weekDayLabel(String day) {
    return 'يوم $day';
  }

  @override
  String get syncEffort => 'خريطة العضلات';

  @override
  String get muscleMap => 'خريطة العضلات';

  @override
  String get phaseMapAccessibility =>
      'خريطتا العضلات الأمامية والخلفية المتزامنتان مع مرحلة الحركة';

  @override
  String viewGroup(String group) {
    return 'عرض $group';
  }

  @override
  String get reviewFirstPhases =>
      'راجع بنفسك المراحل 09–11: هل يتصل الارتكاز الخلفي ونقل الوزن والارتكاز الجانبي بسلاسة؟';

  @override
  String get reviewFullLoop =>
      'راجع الدورة كاملة بنفسك: هل يتصل تبديل اليدين وفتح الساقين والإيقاع بسلاسة؟';

  @override
  String get wristFlexion => 'ثني المعصم';

  @override
  String get wristExtension => 'بسط المعصم';

  @override
  String get plansByAngle => 'حسب الزاوية';

  @override
  String get plansByMuscle => 'حسب المجموعة العضلية';

  @override
  String get anglePlanLabel => 'خطة الزاوية';

  @override
  String get musclePlanLabel => 'خطة العضلات';

  @override
  String get angleSupportPlanIntro =>
      'ارتكز على يد وافتح ساقيك على شكل V مرتفع. قوِّ ثباتك هنا.';

  @override
  String get deltoidsPlanIntro =>
      'اسند جسمك فوق يد واحدة. تعمل عضلات الكتف في كل دورة فلير.';

  @override
  String get planTrainingContent => 'محتوى التمرين';

  @override
  String get planMuscleLinkHint => 'اضغط على العضلة لعرض خطتها';

  @override
  String get planSpecialized => 'خطة مخصّصة';

  @override
  String planRestSeconds(int seconds) {
    return 'راحة $seconds ث';
  }

  @override
  String get planBodyweightSubstitution => 'بديل بوزن الجسم';

  @override
  String get planBodyweightScene => 'بوزن الجسم';

  @override
  String get hubAngle => 'الزاوية';

  @override
  String get hubMuscle => 'العضلات';

  @override
  String hubMinutesFrom(int count) {
    return 'من $count د';
  }

  @override
  String get hubThreeTiers => 'ثلاثة مستويات';

  @override
  String get hubPrimaryMuscles => 'العضلات الرئيسية في هذه المرحلة';

  @override
  String get hubSpecializedPlan => 'خطة مخصصة';

  @override
  String get hubSupportTab => 'الارتكاز';

  @override
  String get hubCoreTab => 'الجذع';

  @override
  String get hubLegsTab => 'الساقان';

  @override
  String get hubStillPlanning => 'قيد الإعداد';

  @override
  String get hubPlanComingSoon => 'الخطة المخصصة قيد الإعداد';

  @override
  String hubViewNamedPlan(String name) {
    return 'عرض خطة «$name»';
  }

  @override
  String get hubPhase09Caption =>
      'ارتكز على كلتا يديك وارفع ساقيك المتباعدتين إلى الأمام.';

  @override
  String get hubPhase10Caption => 'انقل وزنك من كلتا يديك إلى يد واحدة.';

  @override
  String get hubPhase11Caption =>
      'اسند جسمك بالكامل على يد واحدة وأنت على جانبك. كتف الارتكاز يتحمل العبء الأكبر.';

  @override
  String get hubPhase12Caption =>
      'استدر لتواجه الأمام وبدّل موضع ساقيك أمام الجسم بحركة مقصية.';

  @override
  String get hubPhase13Caption =>
      'ضع كفيك خلفك وأرجح ساقيك المتباعدتين إلى الخلف.';

  @override
  String get hubPhase14Caption =>
      'بدّل يد الارتكاز وأرجح ساقيك الممدودتين إلى الخلف.';

  @override
  String get hubPhase15Caption =>
      'ارتكز على اليد الأخرى وأبق ساقيك على شكل V مرتفع.';

  @override
  String get hubPhase16Caption => 'استدر لتواجه الأرض وأرجح ساقيك خلفك.';

  @override
  String get planTierBeginner => 'مبتدئ';

  @override
  String get planTierIntermediate => 'متوسط';

  @override
  String get planTierAdvanced => 'متقدم';

  @override
  String get planActiveMuscles => 'العضلات المستخدمة';

  @override
  String get planExercises => 'التمارين';

  @override
  String planDosePerSide(String dose) {
    return '$dose · لكل جانب';
  }

  @override
  String get planTierSummary => 'مبتدئ · متوسط · متقدم';

  @override
  String get plans => 'الخطط';

  @override
  String get plansHint => 'تمارين موجهة وخططك الخاصة';

  @override
  String get plansLastSession => 'آخر جلسة';

  @override
  String get plansContinue => 'متابعة';

  @override
  String get plansToday => 'اليوم';

  @override
  String get plansYesterday => 'أمس';

  @override
  String plansFinishedCount(int completed, int total) {
    return '$completed/$total تمارين';
  }

  @override
  String get plansNewCompactHint => 'اجمع تمارينك المعتادة';

  @override
  String get plansNewEmptyHint => 'اجمع التمارين التي تؤديها كثيرًا';

  @override
  String get plansAnglesTitle => 'زوايا الفلير الصعبة';

  @override
  String get plansAnglesDescription =>
      'حسّن ثباتك في أصعب لحظات الدورة الكاملة.';

  @override
  String get plansMusclesTitle => 'مجموعات العضلات التي تحتاج إلى تقوية';

  @override
  String get plansMusclesDescription =>
      'المناطق الأكثر تحمّلًا للضغط أثناء الفلير.';

  @override
  String plansSeeAll(int count) {
    return 'الكل ($count)';
  }

  @override
  String get plansOneHandSupport => 'ارتكاز على يد واحدة';

  @override
  String get plansTwoHandSupport => 'ارتكاز على اليدين';

  @override
  String get plansThreeLevels => '3 مستويات';

  @override
  String get plansAiTitle => 'خطة بالذكاء الاصطناعي';

  @override
  String get plansAiHint => 'اختر المكان والمدة ومجموعة العضلات.';

  @override
  String get plansAiUnavailable => 'الذكاء الاصطناعي غير متاح';

  @override
  String get plansReady => 'مجموعات جاهزة';

  @override
  String get plansMine => 'خططي';

  @override
  String get planNew => 'خطة جديدة';

  @override
  String get planNewHint => 'اجمع التمارين التي تكررها وابدأها بلمسة واحدة';

  @override
  String planMeta(int count, int minutes) {
    return '$count تمارين · نحو $minutes دقيقة';
  }

  @override
  String get planStart => 'ابدأ';

  @override
  String get planSaveAsMine => 'حفظ كخطتي';

  @override
  String get premiumCopyRoutine => 'نسخ الخطة';

  @override
  String get planSaved => 'حُفظت في خططي';

  @override
  String get planEdit => 'تعديل';

  @override
  String get planDelete => 'حذف الخطة';

  @override
  String get planDeleted => 'حُذفت الخطة';

  @override
  String get planNameHint => 'اسم الخطة';

  @override
  String get planDefaultName => 'حصتي';

  @override
  String get planAddDrills => 'إضافة تمارين';

  @override
  String get planEmptyDrills => 'لا توجد تمارين بعد. أضف بعضها';

  @override
  String get planSave => 'حفظ';

  @override
  String get planAddTo => 'إضافة إلى خطة';

  @override
  String planAddedTo(String name) {
    return 'أُضيف إلى «$name»';
  }

  @override
  String get planNewWith => 'خطة جديدة بهذا التمرين';

  @override
  String get planNext => 'التالي';

  @override
  String get planSkip => 'تخطٍّ';

  @override
  String get planAllDone => 'اكتملت المجموعة';

  @override
  String get pickerTitle => 'اختر التمارين';

  @override
  String pickerSelected(int count) {
    return 'تم اختيار $count';
  }

  @override
  String get planReorderHint => 'اسحب المقبض لإعادة الترتيب';

  @override
  String get planRemoveDrill => 'إزالة من الخطة';

  @override
  String get presetWarmup => 'الإحماء';

  @override
  String get presetWarmupLine => 'نشّط المعصمين ولوحي الكتف قبل كل حصة';

  @override
  String get presetSupport => 'دعم الذراعين';

  @override
  String get presetSupportLine => 'ثبّت الأرض وابقَ مستقرًا';

  @override
  String get presetCore => 'ضغط الجذع';

  @override
  String get presetCoreLine => 'ارفع الحوض واطوِ الساقين';

  @override
  String get presetLegs => 'دوائر الساقين';

  @override
  String get presetLegsLine => 'افتح الساقين وأدرهما باتساع';

  @override
  String get presetSide => 'الدعم الجانبي';

  @override
  String get presetSideLine => 'لوح جانبي ثابت دون هبوط الكتف عند التبديل';

  @override
  String get presetFlare => 'سلسلة الفلير كاملة';

  @override
  String get presetFlareLine =>
      'كل مجموعات عضلات الفلير الرئيسية في مجموعة واحدة';

  @override
  String get planUpNext => 'التالي';

  @override
  String planDrillCount(int count) {
    return '$count تمارين';
  }

  @override
  String get settingsHint => 'المظهر والتشغيل والجودة';

  @override
  String get planRunEnded => 'انتهت الجلسة';

  @override
  String get trainerSoundOn => 'تشغيل الصوت والتنبيهات';

  @override
  String get trainerSoundOff => 'إيقاف الصوت والتنبيهات';

  @override
  String get filterAction => 'تصفية';

  @override
  String get filterReset => 'إعادة ضبط';

  @override
  String filterShowCount(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'عرض $count تمرينًا',
      few: 'عرض $count تمارين',
      two: 'عرض تمرينين',
      one: 'عرض تمرين واحد',
    );
    return '$_temp0';
  }

  @override
  String get filterScene => 'البيئة';

  @override
  String get filterSection => 'المنطقة';

  @override
  String get pickerAdded => 'مضاف';

  @override
  String get recordsStreakUnit => 'أيام متتالية';

  @override
  String get recordsSessions => 'الجلسات';

  @override
  String get recordsMinutes => 'الدقائق';

  @override
  String get recordsDays => 'أيام التدريب';

  @override
  String get recordsThisWeek => 'هذا الأسبوع';

  @override
  String get recordsHeatmap => 'آخر 16 أسبوعًا';

  @override
  String get recordsMilestones => 'الإنجازات';

  @override
  String milestoneDays(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count يومًا متتاليًا',
      few: '$count أيام متتالية',
    );
    return '$_temp0';
  }

  @override
  String milestoneLeft(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'بقي $count يومًا',
      few: 'بقيت $count أيام',
      two: 'بقي يومان',
      one: 'بقي يوم واحد',
    );
    return '$_temp0';
  }

  @override
  String milestoneEarned(String date) {
    return 'تحقق في $date';
  }

  @override
  String get milestoneLocked => 'مقفل';

  @override
  String milestoneUnlocked(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'إنجاز جديد: $count يومًا متتاليًا',
      few: 'إنجاز جديد: $count أيام متتالية',
    );
    return '$_temp0';
  }

  @override
  String get recordsEmptyTitle => 'لا توجد جلسات بعد';

  @override
  String get recordsEmptyAction => 'جرّب تمرينك الأول';

  @override
  String get heatLess => 'أقل';

  @override
  String get heatMore => 'أكثر';

  @override
  String pickerAddCount(int count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: 'إضافة $count تمرينًا',
      few: 'إضافة $count تمارين',
      two: 'إضافة تمرينين',
      one: 'إضافة تمرين واحد',
    );
    return '$_temp0';
  }

  @override
  String libraryDose(int sets, String amount) {
    return '$sets مجموعات × $amount';
  }

  @override
  String get planEquipmentNeeded => 'يلزمك:';

  @override
  String planEquipmentNameForId(String id) {
    String _temp0 = intl.Intl.selectLogic(id, {
      'mat': 'بساط تمرين',
      'chair': 'كرسي',
      'band': 'شريط مقاومة',
      'dumbbell': 'ثقل يدوي',
      'wall': 'جدار',
      'cable': 'جهاز البكرات',
      'block': 'قالب يوغا',
      'pullup_bar': 'عارضة عقلة',
      'parallettes': 'متوازي منخفض',
      'dip_bars': 'عارضتا متوازي',
      'slider': 'أقراص انزلاق',
      'rings': 'حلقات جمباز',
      'landmine': 'قاعدة مفصلية لقضيب الأثقال',
      'swiss_ball': 'كرة تمرين',
      'roman_chair': 'كرسي روماني',
      'kettlebell': 'ثقل بمقبض',
      'reverse_hyper': 'جهاز فرط التمديد العكسي',
      'ghd': 'جهاز تمرين الأليتين وخلف الفخذ',
      'hip_abductor_machine': 'جهاز إبعاد الورك',
      'leg_extension_machine': 'جهاز مد الساقين',
      'foam_roller': 'أسطوانة إسفنجية',
      'towel': 'منشفة',
      'doorframe': 'إطار باب',
      'bench': 'مقعد تمارين الأثقال',
      'barbell': 'قضيب أثقال',
      'clamp_pad': 'وسادة صغيرة',
      'other': '',
    });
    return '$_temp0';
  }

  @override
  String get warmupCooldownHeading => 'قبل التمرين وبعده';

  @override
  String get preWorkoutWarmup => 'الإحماء قبل التمرين';

  @override
  String get postWorkoutStretch => 'الإطالة بعد التمرين';

  @override
  String preWorkoutWarmupPrompt(int minutes) {
    final intl.NumberFormat minutesNumberFormat =
        intl.NumberFormat.decimalPattern(localeName);
    final String minutesString = minutesNumberFormat.format(minutes);

    return 'لم تبدأ الإحماء؟ جرّب $minutesString دقائق من ';
  }

  @override
  String planCirclesInBothDirections(int count) {
    return '$count دورات في كل اتجاه لكل جانب';
  }

  @override
  String get planCircleClockwise => 'مع عقارب الساعة';

  @override
  String get planCircleCounterclockwise => 'عكس عقارب الساعة';

  @override
  String planPeakHold(int seconds) {
    return 'الثبات في الأعلى $seconds ث';
  }

  @override
  String get continuePostWorkoutStretch =>
      'تابع الإطالة بعد التمرين · ١٠ دقائق';

  @override
  String bodyweightPlanMinutes(int minutes) {
    return '$minutes د · وزن الجسم';
  }

  @override
  String get temporaryPlanDemo => 'عرض مؤقت';
}
