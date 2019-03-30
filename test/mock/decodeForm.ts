/**
 * Decodes form encoded data.
 *
 * For some reason, nock does not do this automatically for the reply callback.
 */
function decodeForm(body: string): any {
  return body
    .split('&')
    .map(
      kv => kv.split('=').map(s => decodeURIComponent(s))
    )
    .reduce(
      (obj, e) => ({...obj, [e[0]]: e[1]}),
        {}
    );
}

export default decodeForm;
