# Coach QA real-model check

This opt-in check uses the App's `FlareCoachChat` host and its exact
SDK `CoachChatController` with `agentMode: qaV2`, fixed SDK v0.7.1 commit
`9dd93163e9f355665e5c923f374c64f03bf65a86`, authorized scope and bundled AI tags.
The ordinary full suite skips it and sends no model requests.

From `app/`, run with the project's Flutter toolchain:

```powershell
flutter test --no-pub --concurrency=1 --reporter expanded test/live/coach_qa_live_test.dart --dart-define=FLARE_QA_LIVE=true --dart-define=FLARE_QA_OUTPUT=E:/AII-3D/3D-Body/output/qa070-20261104/live --dart-define-from-file=<local-private-config>
```

The private build config must select `deepseek-v4.1-flash`; the App supplies
`thinking: {type: enabled}` and `reasoning_effort: max`. Never commit the config,
credentials, headers or provider reasoning. This test does not read the config
file itself: it consumes `CoachConfig.fromEnvironment` like the App.

There are exactly three independent, fixed conversations and ten user turns:
support-arm recommendations with place/equipment answers and a second-card
replacement; a 10-minute home bodyweight core plan with first-card replacement
and a duration change; office leg recommendations without lying down, followed
by an easier request and a place change. Responses never expand the script.

Each fresh conversation completes the SDK's own safety acknowledgement controls
with synthetic healthy-adult fixture answers; these are not model calls or
real user health data. Model turns use `CoachChatController.send`, and pending
single/multiple choice questions use its public `answerChoices` method with the
displayed option text. If an expected option is missing, the deviation is logged
and the fixed answer goes through `answerQuestion`; no extra turn is invented.
Replies come from `lastQaReply`. The test checks QA v2 mode, maximum thinking and
the App scope without installing any custom App conversation adapter.

`dialogues.json` and `dialogues.md` retain verbatim user/assistant text, delivered
questions/options, numbered action IDs/names/reasons, plans and model-step timing.
All scopes/errors are recorded; unexpected model behavior is preserved instead
of rewritten. These are model/App-host checks, not device, tag-safety or final
action QA acceptance. The action labels remain unreviewed `ai-draft` data.
