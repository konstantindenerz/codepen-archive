// Finding the external URLs an archived demo still depends on.
//
// Shared by the vendoring step (which downloads and rewrites them) and the
// verification step (which asserts none are left).

// Hosts that only ever appear as prose, documentation links or XML
// namespaces — never as something the browser actually loads.
const NON_ASSET_HOSTS = new Set([
  'www.w3.org',
  'caniuse.com',
  'developer.mozilla.org',
  'web.dev',
  'material.io',
  'm3.material.io',
  'drafts.css-houdini.org',
  'twitter.com',
  'x.com',
  'github.com',
  'codepen.io',       // profile/pen links in comments; real resources are matched separately
  'cdpn.io',
  'en.wikipedia.org',
  // Credit links for assets and libraries, written in source comments.
  'pixabay.com',
  'supermachine.art',
  'tweakpane.github.io',
  'unused-css.com',
  'alvaromontoro.com',
  'wave.novoselski.net',
]);

const URL_PATTERN = /https?:\/\/[^\s'"()<>\\`]+/g;

/** Trim trailing punctuation that regexes happily swallow. */
function tidy(url) {
  return url.replace(/[.,;:!?]+$/, '').replace(/&quot$/, '');
}

/**
 * External URLs a document genuinely loads.
 *
 * `codepen.io/<user>/pen/<slug>.js` is the exception to the host blocklist:
 * CodePen lets a pen be included as a resource, and those *are* real loads.
 */
export function findExternalUrls(text) {
  const found = new Set();

  for (const raw of text.match(URL_PATTERN) ?? []) {
    const url = tidy(raw);
    let host;
    try {
      host = new URL(url).host;
    } catch {
      continue;
    }

    if (/codepen\.io\/[^/]+\/pen\/[A-Za-z0-9]+\.(js|css|scss|less)$/.test(url)) {
      found.add(url);
      continue;
    }

    if (NON_ASSET_HOSTS.has(host)) continue;

    // A bare origin is a <link rel="preconnect"> hint, not a file.
    if (new URL(url).pathname === '/' && !new URL(url).search) continue;

    found.add(url);
  }

  return [...found];
}

export { NON_ASSET_HOSTS };
