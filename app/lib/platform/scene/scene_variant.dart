import '../../domain/learning_settings.dart';

/// The saved athlete choice is shared by the native view and web iframe.
Uri configuredSceneUri(Uri uri, {String body = 'original'}) {
  final parameters = {...uri.queryParametersAll}
    ..remove('body')
    ..remove('character');
  if (body == 'training') {
    parameters['body'] = ['training'];
  } else if (body != 'original' &&
      LearningSettings.actorBodies.contains(body)) {
    parameters['character'] = [body];
  }
  return uri.replace(queryParameters: parameters);
}
