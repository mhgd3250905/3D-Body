import 'package:flutter/material.dart';
import 'package:ugk_coach_chat/ugk_coach_chat.dart';

import '../coach/flare_coach_chat.dart';
import 'page_kit.dart';

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
  });
  final FlareCoachChat coach;
  final CoachChatHostActions actions;
  @override
  State<FlareCoachChatPage> createState() => _FlareCoachChatPageState();
}

class _FlareCoachChatPageState extends State<FlareCoachChatPage> {
  late Future<CoachChatController> _loading = widget.coach.load(
    actions: widget.actions,
  );

  @override
  Widget build(BuildContext context) => FutureBuilder<CoachChatController>(
    future: _loading,
    builder: (context, snapshot) {
      if (snapshot.data case final chat?) {
        return CoachChatPage(controller: chat);
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
