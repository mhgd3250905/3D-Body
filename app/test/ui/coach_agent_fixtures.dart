import 'dart:convert';
import 'package:ugk_coach/ugk_coach.dart' as uc;

/// Reuses historical plan bodies, but sends genuine 0.4 tools to the Agent.
class AgentFakeLlmClient extends uc.FakeLlmClient {
  AgentFakeLlmClient(List<Object> script) : super(script.map(_step).toList());

  static Object _step(Object value) {
    if (value is uc.FakeStep) {
      return (uc.LlmRequest request) async => _step(await value(request));
    }
    if (value is String) {
      try {
        return _step(jsonDecode(value) as Object);
      } on Object {
        return value;
      }
    }
    if (value is! Map) return value;
    final text = value['text'] as String? ?? '';
    final options = value['options'] as List? ?? const [];
    final tool = switch (value['kind']) {
      'plan' => 'show_plan',
      'ask' => 'ask_user',
      _ => null,
    };
    return uc.LlmResponse(
      content: tool == 'ask_user' ? '' : text,
      model: 'fake-model',
      usage: const uc.TokenUsage(promptTokens: 1000, completionTokens: 200),
      toolCalls: tool == null
          ? const []
          : [
              uc.LlmToolCall(
                id: 'tool-fixture',
                name: tool,
                arguments: jsonEncode(
                  tool == 'show_plan'
                      ? value['plan']
                      : {
                          'question': text,
                          'mode': options.length >= 2 ? 'choice' : 'text',
                          if (options.length >= 2) 'options': options,
                          if (options.length >= 2)
                            'multiple': value['multiple'] ?? false,
                        },
                ),
              ),
            ],
    );
  }
}
