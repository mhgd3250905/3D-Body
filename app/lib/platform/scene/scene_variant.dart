import '../../domain/learning_settings.dart';

const flareStraightLegsScene = 'flare-v5';

/// The saved athlete choice is shared by the native view and web iframe.
Uri configuredSceneUri(Uri uri, {String body = 'original'}) {
  final parameters = {...uri.queryParametersAll}
    ..remove('body')
    ..remove('character');
  if (body == flareStraightLegsScene) {
    return uri.replace(
      path: uri.resolve('v5.html').path,
      queryParameters: parameters,
    );
  }
  if (body == 'training') {
    parameters['body'] = ['training'];
  } else if (body != 'original' &&
      LearningSettings.actorBodies.contains(body)) {
    parameters['character'] = [body];
  }
  return uri.replace(queryParameters: parameters);
}
