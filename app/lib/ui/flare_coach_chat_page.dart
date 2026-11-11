import 'dart:async';

import 'package:flutter/material.dart';
import 'package:ugk_coach_chat/ugk_coach_chat.dart';

import '../coach/flare_coach_chat.dart';
import '../coach/membership_gateway.dart';
import 'components.dart';
import 'flare_membership_page.dart';
import 'page_kit.dart';
import 'theme.dart';

/// AI 定制只做中文（模型、目录文案都是中文），其他语言界面不显示入口。
bool aiCoachAvailable(BuildContext context) =>
    Localizations.localeOf(context).languageCode == 'zh';

/// Only the route, lifecycle and dependency lookup belong to Flare; the SDK
/// CoachChatPage owns the conversation, cards, questions and composer.
class FlareCoachChatPage extends StatefulWidget {
  const FlareCoachChatPage({
    super.key,
    required this.coach,
    required this.actions,
    this.onPremiumRequired,
  });
  final FlareCoachChat coach;
  final CoachChatHostActions actions;
  final Future<void> Function()? onPremiumRequired;
  @override
  State<FlareCoachChatPage> createState() => _FlareCoachChatPageState();
}

class _FlareCoachChatPageState extends State<FlareCoachChatPage> {
  late Future<CoachChatController> _loading = widget.coach.load(
    actions: widget.actions,
  );

  @override
  void initState() {
    super.initState();
    widget.coach.gatewayNotice.addListener(_onGatewayNotice);
  }

  void _onGatewayNotice() {
    final notice = widget.coach.gatewayNotice.value;
    if (notice == null ||
        !mounted ||
        ModalRoute.of(context)?.isCurrent != true) {
      return;
    }
    final s = context.strings;
    switch (notice.kind) {
      case GatewayRejection.premiumRequired:
        unawaited(widget.onPremiumRequired?.call());
      case GatewayRejection.dailyQuota:
        showMembershipMessage(context, s.premiumQuota(notice.limit!));
      case GatewayRejection.rateLimit:
        showMembershipMessage(context, s.premiumRateLimit);
    }
  }

  @override
  void dispose() {
    widget.coach.gatewayNotice.removeListener(_onGatewayNotice);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => FutureBuilder<CoachChatController>(
    future: _loading,
    builder: (context, snapshot) {
      if (snapshot.data case final chat?) {
        final page = CoachChatPage(controller: chat);
        if (widget.onPremiumRequired == null) return page;
        return Column(
          children: [
            Expanded(child: page),
            Material(
              color: FlareColors.background,
              child: SafeArea(
                top: false,
                minimum: const EdgeInsets.fromLTRB(16, 4, 16, 6),
                child: Text(
                  context.strings.premiumAiDisclaimer,
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 12, color: FlareColors.secondary),
                ),
              ),
            ),
          ],
        );
      }
      return Scaffold(
        body: SafeArea(
          child: Column(
            children: [
              FlareNavBar(
                title: '托马斯训练助手',
                onBack: () => Navigator.of(context).maybePop(),
              ),
              Expanded(
                child: Center(
                  child: snapshot.hasError
                      ? TextButton(
                          key: const ValueKey('coach-restore-retry'),
                          onPressed: () => setState(() {
                            _loading = widget.coach.load(
                              actions: widget.actions,
                            );
                          }),
                          child: const Text('对话恢复失败，点击重试'),
                        )
                      : const CircularProgressIndicator(),
                ),
              ),
            ],
          ),
        ),
      );
    },
  );
}
