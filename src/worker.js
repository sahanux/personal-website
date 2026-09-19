/**
 * The site is static; this Worker exists only to keep one canonical hostname.
 *
 * www.sahankaru.online → sahankaru.online (301), preserving path and query.
 * Every other hostname (the apex itself, *.workers.dev, localhost) is served
 * straight from the static assets in public/.
 */
const CANONICAL = "sahankaru.online";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === `www.${CANONICAL}`) {
      url.hostname = CANONICAL;
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
