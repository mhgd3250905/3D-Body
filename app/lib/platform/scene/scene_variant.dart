/// Build-time selection for the PR109 trial; ordinary builds keep the coach.
Uri configuredSceneUri(Uri uri) {
  const body = String.fromEnvironment('FLARE_BODY', defaultValue: 'original');
  if (body != 'training') return uri;
  return uri.replace(queryParameters: {...uri.queryParameters, 'body': body});
}
