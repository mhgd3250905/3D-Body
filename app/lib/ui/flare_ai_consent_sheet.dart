import 'package:flutter/material.dart';

import '../l10n/app_localizations.dart';
import 'theme.dart';

AppLocalizations _consentStrings(BuildContext context) {
  final locale = Localizations.localeOf(context);
  return locale.languageCode == 'zh'
      ? AppLocalizations.of(context)
      : lookupAppLocalizations(const Locale('en'));
}

Future<bool> showFlareAiConsentSheet(
  BuildContext context, {
  required Future<void> Function() onAgree,
  required VoidCallback onOpenPrivacy,
}) async {
  final granted = await showModalBottomSheet<bool>(
    context: context,
    isDismissible: false,
    enableDrag: false,
    showDragHandle: false,
    isScrollControlled: true,
    useSafeArea: true,
    backgroundColor: FlarePalette.dark.surface,
    shape: const RoundedRectangleBorder(
      borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
    ),
    clipBehavior: Clip.antiAlias,
    sheetAnimationStyle: const AnimationStyle(
      duration: Duration(milliseconds: 250),
      curve: Curves.easeOutCubic,
    ),
    builder: (context) => PopScope(
      canPop: false,
      child: _ConsentSheet(onAgree: onAgree, onOpenPrivacy: onOpenPrivacy),
    ),
  );
  return granted == true;
}

class _ConsentSheet extends StatefulWidget {
  const _ConsentSheet({required this.onAgree, required this.onOpenPrivacy});

  final Future<void> Function() onAgree;
  final VoidCallback onOpenPrivacy;

  @override
  State<_ConsentSheet> createState() => _ConsentSheetState();
}

class _ConsentSheetState extends State<_ConsentSheet> {
  bool _saving = false;
  bool _saveFailed = false;

  Future<void> _agree() async {
    if (_saving) return;
    setState(() {
      _saving = true;
      _saveFailed = false;
    });
    try {
      await widget.onAgree();
      if (mounted) Navigator.of(context).pop(true);
    } on Object {
      if (!mounted) return;
      setState(() {
        _saving = false;
        _saveFailed = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final s = _consentStrings(context);
    const palette = FlarePalette.dark;
    return SafeArea(
      top: false,
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(24, 28, 24, 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Semantics(
              header: true,
              child: Text(
                s.aiConsentTitle,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            const SizedBox(height: 12),
            _AiDisclosure(strings: s, color: const Color(0xccffffff)),
            const SizedBox(height: 12),
            Align(
              alignment: AlignmentDirectional.centerStart,
              child: TextButton(
                onPressed: _saving ? null : widget.onOpenPrivacy,
                style: TextButton.styleFrom(
                  foregroundColor: palette.accent,
                  padding: EdgeInsets.zero,
                  minimumSize: const Size(0, 44),
                  textStyle: const TextStyle(
                    fontSize: 14,
                    decoration: TextDecoration.underline,
                  ),
                ),
                child: Text(s.aiConsentPrivacyLink),
              ),
            ),
            if (_saveFailed)
              Semantics(
                liveRegion: true,
                child: Text(
                  s.aiConsentSaveFailed,
                  style: TextStyle(color: palette.danger),
                ),
              ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _saving ? null : _agree,
              style: FilledButton.styleFrom(
                minimumSize: const Size.fromHeight(52),
                backgroundColor: palette.accent,
                foregroundColor: palette.onAccent,
                textStyle: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              child: Text(s.aiConsentAgree, textAlign: TextAlign.center),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: _saving
                  ? null
                  : () => Navigator.of(context).pop(false),
              style: TextButton.styleFrom(
                minimumSize: const Size.fromHeight(48),
                foregroundColor: const Color(0xb3ffffff),
                textStyle: const TextStyle(fontSize: 15),
              ),
              child: Text(s.aiConsentDecline, textAlign: TextAlign.center),
            ),
          ],
        ),
      ),
    );
  }
}

class _AiDisclosure extends StatelessWidget {
  const _AiDisclosure({required this.strings, required this.color});

  final AppLocalizations strings;
  final Color color;

  @override
  Widget build(BuildContext context) => DefaultTextStyle.merge(
    style: TextStyle(color: color, fontSize: 15, height: 1.5),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(strings.aiConsentIntroduction),
        const SizedBox(height: 8),
        Padding(
          padding: const EdgeInsetsDirectional.only(start: 16),
          child: Column(
            children: [
              _Bullet(text: strings.aiConsentConversation),
              const SizedBox(height: 6),
              _Bullet(text: strings.aiConsentTrainingContext),
            ],
          ),
        ),
        const SizedBox(height: 8),
        Text(strings.aiConsentLocalData),
      ],
    ),
  );
}

class _Bullet extends StatelessWidget {
  const _Bullet({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) => Row(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      const ExcludeSemantics(child: Text('•')),
      const SizedBox(width: 8),
      Expanded(child: Text(text)),
    ],
  );
}

class FlareAiPrivacySection extends StatefulWidget {
  const FlareAiPrivacySection({
    super.key,
    required this.granted,
    required this.onWithdraw,
  });

  final bool granted;
  final Future<void> Function() onWithdraw;

  @override
  State<FlareAiPrivacySection> createState() => _FlareAiPrivacySectionState();
}

class _FlareAiPrivacySectionState extends State<FlareAiPrivacySection> {
  bool _saving = false;

  Future<void> _withdraw() async {
    if (_saving) return;
    final s = _consentStrings(context);
    setState(() => _saving = true);
    var message = s.aiConsentWithdrawn;
    try {
      await widget.onWithdraw();
    } on Object {
      message = s.aiConsentSaveFailed;
    }
    if (!mounted) return;
    setState(() => _saving = false);
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    final s = _consentStrings(context);
    final secondary = FlareColors.secondary;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Semantics(
          header: true,
          child: Text(
            s.aiConsentPrivacyTitle,
            style: TextStyle(
              color: FlareColors.text,
              fontSize: 17,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        const SizedBox(height: 8),
        _AiDisclosure(strings: s, color: secondary),
        const SizedBox(height: 8),
        Text(
          s.aiConsentPrivacyGateway,
          style: TextStyle(color: secondary, fontSize: 15, height: 1.5),
        ),
        const SizedBox(height: 8),
        TextButton(
          onPressed: widget.granted && !_saving ? _withdraw : null,
          style: TextButton.styleFrom(
            foregroundColor: FlareColors.accentText,
            padding: EdgeInsets.zero,
            minimumSize: const Size(0, 44),
            textStyle: const TextStyle(fontSize: 14),
          ),
          child: Text(s.aiConsentWithdraw, textAlign: TextAlign.start),
        ),
      ],
    );
  }
}
