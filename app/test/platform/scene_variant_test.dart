import 'package:flare/platform/scene/scene_variant.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('each character uses the matching selector on native and web URLs', () {
    for (final base in [
      Uri.parse('http://127.0.0.1:8821/index.html'),
      Uri.parse('https://example.test/app/assets/scene/index.html'),
    ]) {
      for (final body in ['shadow', 'chrome', 'street', 'robot', 'cyber']) {
        final result = configuredSceneUri(base, body: body);
        expect(result.queryParameters, {'character': body});
        expect(result.host, base.host);
        expect(result.path, base.path);
      }
      expect(configuredSceneUri(base, body: 'training').queryParameters, {
        'body': 'training',
      });
      expect(configuredSceneUri(base).queryParameters, isEmpty);
    }
  });

  test(
    'reusing a scene URL replaces selectors and preserves other options',
    () {
      var uri = Uri.parse(
        'http://127.0.0.1:8821/index.html?body=training&character=shadow'
        '&fx=0&theme=dark&quality=high&tag=one&tag=two#scene',
      );
      for (final body in [
        'chrome',
        'training',
        'street',
        'original',
        'robot',
        'cyber',
        'future-character',
      ]) {
        uri = configuredSceneUri(uri, body: body);
        final parameters = uri.queryParametersAll;
        expect(parameters['fx'], ['0']);
        expect(parameters['theme'], ['dark']);
        expect(parameters['quality'], ['high']);
        expect(parameters['tag'], ['one', 'two']);
        expect(uri.fragment, 'scene');
        if (body == 'training') {
          expect(parameters['body'], ['training']);
          expect(parameters.containsKey('character'), isFalse);
        } else if (body == 'original' || body == 'future-character') {
          expect(parameters.containsKey('body'), isFalse);
          expect(parameters.containsKey('character'), isFalse);
        } else {
          expect(parameters['character'], [body]);
          expect(parameters.containsKey('body'), isFalse);
        }
      }
    },
  );

  test('default and unknown choices remove both stale selectors', () {
    final uri = Uri.parse(
      'http://127.0.0.1:8821/index.html?body=training&character=chrome',
    );
    expect(configuredSceneUri(uri).queryParameters, isEmpty);
    expect(
      configuredSceneUri(uri, body: 'unsupported').queryParameters,
      isEmpty,
    );
  });
}
