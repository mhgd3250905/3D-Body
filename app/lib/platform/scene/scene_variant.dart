import '../../domain/learning_settings.dart';

const flareStraightLegsScene = 'flare-v5';
const flareTeachingScene = 'flare-v5-teaching';
const flareMediaScene = 'flare-v5-media';

/// The saved athlete choice is shared by the native view and web iframe.
Uri configuredSceneUri(Uri uri, {String body = 'original'}) {
  final parameters = {...uri.queryParametersAll}
    ..remove('body')
    ..remove('character')
    ..remove('actor');
  if (parameters['embed']?.singleOrNull == 'media') {
    parameters.remove('embed');
  }
  if (body == flareTeachingScene || body == flareMediaScene) {
    parameters['actor'] = [flareStraightLegsScene];
    if (body == flareMediaScene) parameters['embed'] = ['media'];
  } else if (body == 'training') {
    parameters['body'] = ['training'];
  } else if (body != 'original' &&
      LearningSettings.actorBodies.contains(body)) {
    parameters['character'] = [body];
  }
  return uri.replace(queryParameters: parameters);
}
