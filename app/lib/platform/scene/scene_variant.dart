/// The saved athlete choice is shared by the native view and web iframe.
Uri configuredSceneUri(Uri uri, {String body = 'original'}) {
  if (body != 'training') return uri;
  return uri.replace(queryParameters: {...uri.queryParameters, 'body': body});
}
