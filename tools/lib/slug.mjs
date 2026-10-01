// Turning pen titles into folder names.
//
// Titles are full of emoji, parentheses and typographic noise
// ("Flux Capacitor (Animation, CSS) | ⚡️ 1.21 GIGAWATTS! ⚡️"), so the folder
// name is a readable kebab-case reduction plus the CodePen slug. The slug
// suffix keeps names unique and lets you jump from a folder straight back to
// the original pen.

const MAX_TITLE_LENGTH = 60;

/** "Hexagon Grid - Ripple Effect" -> "hexagon-grid-ripple-effect" */
export function kebab(title) {
  return (title ?? '')
    .normalize('NFKD')
    // Strip emoji, symbols and anything else that is not a letter or digit.
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, MAX_TITLE_LENGTH)
    .replace(/-+$/g, '');
}

/**
 * Folder name for a pen: readable title plus its slug.
 *
 * Editor 2.0 UUIDs are shortened to their first segment — a full UUID would
 * dwarf the title it is meant to disambiguate. The normaliser still checks the
 * result is unique across the archive.
 */
export function penDir(title, slug) {
  const suffix = isNewEditorSlug(slug) ? slug.split('-')[0] : slug;
  const name = kebab(title);
  return name ? `${name}-${suffix}` : suffix;
}

/**
 * The pen slug out of any CodePen URL.
 *
 * Classic pens use a short alphanumeric slug (`/pen/poYVOpv`). Pens authored in
 * CodePen's "Editor 2.0" use a UUID under an `/editor/` path
 * (`/editor/<user>/pen/019b8567-3da5-...`), so hyphens have to survive.
 */
export function slugFromUrl(url) {
  const match = /\/pen\/([A-Za-z0-9-]+)/.exec(url ?? '');
  return match ? match[1] : null;
}

/** Editor 2.0 pens are identified by their UUID slug. */
export function isNewEditorSlug(slug) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(slug ?? '');
}

/** File extension for a CodePen preprocessor name. */
export function sourceExtension(kind, preProcessor) {
  const map = {
    html: { none: 'html', pug: 'pug', haml: 'haml', markdown: 'md', slim: 'slim' },
    css: { none: 'css', scss: 'scss', sass: 'sass', less: 'less', stylus: 'styl', postcss: 'css' },
    js: { none: 'js', babel: 'js', typescript: 'ts', coffeescript: 'coffee', livescript: 'ls' },
  };
  return map[kind]?.[preProcessor] ?? map[kind].none;
}
