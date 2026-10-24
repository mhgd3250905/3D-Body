import 'dart:convert';
import 'dart:io';

import 'package:flare/coach/coach_config.dart';
import 'package:flare/coach/coach_service.dart';
import 'package:flare/coach/usage_store.dart';
import 'package:flare/data/local_state_storage.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ugk_coach/ugk_coach.dart' as uc;

import '../domain/fixtures.dart';

class _Memory implements LocalStateStorage {
  @override
  Future<String?> read(String key) async => null;
  @override
  Future<void> write(String key, String value) async {}
}

/// No live calls in ordinary test runs. Run explicitly with a local defines file.
class _BoundedClient implements uc.LlmClient {
  _BoundedClient(this.client);
  final uc.OpenAiCompatibleClient client;
  int calls = 0;
  @override
  String get model => client.model;
  @override
  uc.Pricing? get pricing => client.pricing;
  @override
  Future<uc.LlmResponse> complete(
    uc.LlmRequest request, {
    uc.CancelToken? cancel,
  }) {
    if (calls >= 6) {
      throw const uc.LlmException(
        uc.LlmErrorKind.auth,
        'smoke call budget reached',
      );
    }
    calls++;
    return client.complete(request, cancel: cancel);
  }
}

void main() {
  test(
    'opt-in live Agent clarification and plan smoke',
    () async {
      const config = CoachConfig.fromEnvironment;
      expect(
        config.configured,
        isTrue,
        reason: 'Missing local coach build defines',
      );
      final transport = uc.OpenAiCompatibleClient(
        config: uc.LlmConfig.deepSeekOpenCsg.copyWith(
          baseUrl: config.baseUrl,
          model: config.model,
          jsonMode: false,
          maxRetries: 0,
        ),
        auth: uc.ApiKeyAuth(config.apiKey),
      );
      final client = _BoundedClient(transport);
      final service = CoachService(
        config: config,
        appCatalog: loadCatalogFixture(),
        client: client,
        usage: CoachUsageStore(),
        storage: _Memory(),
        maxRequestRetries: 0,
        readAsset: (path) async => File(path).readAsStringSync(),
      );
      final watch = Stopwatch()..start();
      final turns = <Map<String, Object?>>[];
      var input = '我是 bboy，平时久坐，肌肉紧张，练托马斯前想热身。';
      try {
        for (var i = 0; i < 2; i++) {
          final answer = await service.send(input);
          if (answer == null) break;
          turns.add({
            'index': i + 1,
            'cancelled': answer.status == uc.TurnStatus.cancelled,
            'presetReason': answer.fallbackReason?.name,
            'questionMode': answer.question?.mode.name,
            'multiple': answer.question?.multiple,
            'optionCount': answer.question?.options.length,
            'planId': answer.plan?.plan.id,
            'actionIds': answer.plan?.plan.exerciseIds.toList(),
            'tokens': answer.usage.promptTokens + answer.usage.completionTokens,
            'questionCount': service.agent?.questionsAsked,
          });
          if (answer.question == null) break;
          final question = answer.question!;
          input = question.options.isEmpty
              ? '肩背和髋比较紧，没有伤病。在家徒手，20 分钟，一级，直接出计划。'
              : '${question.options.first}。在家徒手，20 分钟，一级，没有伤病，直接出计划。';
        }
      } finally {
        watch.stop();
        final report = {
          'sdkCommit': 'd7e0b8fa3afc514fe3a53427cfddb8f7b24c984f',
          'model': config.model,
          'calls': client.calls,
          'elapsedMs': watch.elapsedMilliseconds,
          'turns': turns,
          'askedThenPlanned':
              turns.length == 2 &&
              turns.first['questionMode'] != null &&
              turns.last['planId'] != null &&
              turns.last['presetReason'] == null,
        };
        const output = String.fromEnvironment(
          'COACH_SMOKE_OUTPUT',
          defaultValue: '../output/sdk-step1-20261023/live-coach.json',
        );
        File(
          output,
        ).writeAsStringSync(const JsonEncoder.withIndent('  ').convert(report));
        await service.dispose();
        transport.close();
      }
      expect(turns, hasLength(2));
      expect(turns.first['questionMode'], isNotNull);
      expect(turns.last['planId'], isNotNull);
      expect(
        turns.every((turn) => turn['presetReason'] == null),
        isTrue,
        reason: 'Live result fell back; inspect safe report',
      );
    },
    skip: !const bool.fromEnvironment('RUN_COACH_LIVE_SMOKE'),
    timeout: const Timeout(Duration(minutes: 8)),
  );
}
