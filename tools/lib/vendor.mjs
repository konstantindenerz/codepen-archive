// Naming and rewriting rules for vendored assets.
//
// Every external file the demos need is copied into a single shared
// `assets/vendor/` directory. Shared, because the same avatar, font or
// background image is used by several pens — one copy each keeps the repo
// from ballooning.

import { createHash } from 'node:crypto';
import { extname, basename } from 'node:path';

export const VENDOR_DIR = 'assets/vendor';

/** Demos live at pens/<dir>/index.html, so the vendor dir is two levels up. */
export const VENDOR_PREFIX_FROM_PEN = '../../assets/vendor';

const MAX_NAME_LENGTH = 48;

function shortHash(input) {
  return createHash('sha256').update(input).digest('hex').slice(0, 6);
}

/**
 * A readable, collision-free filename for a URL.
 *
 * CodePen upload names are wild — percent-encoded DALL·E prompts of 150
 * characters are common — so the readable part is normalised and truncated,
 * and a hash of the full URL guarantees uniqueness.
 */
const EXTENSION_BY_TYPE = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'image/avif': '.avif',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'audio/mpeg': '.mp3',
  'audio/wav': '.wav',
  'font/woff2': '.woff2',
  'font/woff': '.woff',
  'font/ttf': '.ttf',
  'text/css': '.css',
  'text/plain': '.txt',
  'application/javascript': '.js',
  'text/javascript': '.js',
  'application/json': '.json',
};

export function vendorName(url, contentType) {
  const { pathname, searchParams } = new URL(url);
  const decoded = decodeURIComponent(basename(pathname) || 'asset');

  let extension = extname(decoded).toLowerCase();
  let stem = extension ? decoded.slice(0, -extension.length) : decoded;

  // Google Fonts CSS endpoints carry the family in the query, not the path.
  if (!extension && pathname.startsWith('/css')) {
    extension = '.css';
    stem = (searchParams.get('family') ?? 'fonts').split(':')[0];
  }

  // Some URLs (Gravatar, for one) name no extension at all; the response's
  // content type is the only hint about what the bytes actually are.
  if (!extension && contentType) {
    extension = EXTENSION_BY_TYPE[contentType.split(';')[0].trim().toLowerCase()] ?? '';
  }

  const readable = stem
    .normalize('NFKD')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, MAX_NAME_LENGTH)
    .replace(/-+$/g, '') || 'asset';

  return `${readable}-${shortHash(url)}${extension}`;
}

/**
 * Replace every occurrence of a URL with its local path.
 *
 * The same URL shows up HTML-escaped (`&amp;`) inside attributes and plain
 * inside inline scripts and styles, so both spellings are replaced.
 */
export function rewriteUrls(text, mapping, prefix) {
  let result = text;

  for (const [url, name] of mapping) {
    const local = `${prefix}/${name}`;
    for (const spelling of new Set([url, url.replace(/&/g, '&amp;')])) {
      result = result.split(spelling).join(local);
    }
  }

  return result;
}

/** Hosts whose Cloudflare protection makes Node fetches impossible. */
export function needsBrowser(url) {
  const { host } = new URL(url);
  return host === 'assets.codepen.io' || host === 'codepen.io';
}
