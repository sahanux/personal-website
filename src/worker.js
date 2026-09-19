/**
 * The site is static, so this Worker just hands every request to the asset
 * store. Both hostnames — sahankaru.online and www.sahankaru.online — serve
 * the site directly; neither redirects to the other.
 *
 * (An earlier version redirected www to the apex for a single canonical URL.
 * If that is ever wanted again, redirect here rather than in the dashboard,
 * so the rule stays in version control.)
 */
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
