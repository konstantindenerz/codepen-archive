// Throttled, resumable HTTP client.
//
// Everything here is deliberately sequential: this pipeline hits third-party
// hosts a few hundred times and must never look like a scraper storm. One
// request at a time, a pause between each, and a hard stop if a host starts
// pushing back.

import { setTimeout as sleep } from 'node:timers/promises';
import { writeFile, mkdir, access } from 'node:fs/promises';
import { dirname } from 'node:path';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

// Per-host pause in ms. CodePen gets the longest leash.
const DELAY = {
  'cdpn.io': 4000,
  'codepen.io': 4000,
  'assets.codepen.io': 4000,
  'konstantin-denerz.com': 1500,
  default: 3000,
};

const BACKOFF = [8000, 20000, 45000];
const MAX_CONSECUTIVE_FAILURES = 3;

let consecutiveFailures = 0;
const lastHit = new Map();

const jitter = () => Math.floor(Math.random() * 1000);

async function waitForTurn(host) {
  const gap = DELAY[host] ?? DELAY.default;
  const previous = lastHit.get(host);
  if (previous !== undefined) {
    const elapsed = Date.now() - previous;
    const remaining = gap + jitter() - elapsed;
    if (remaining > 0) await sleep(remaining);
  }
  lastHit.set(host, Date.now());
}

/** Fetch a URL as an ArrayBuffer, retrying politely on 429/5xx. */
export async function get(url, { accept } = {}) {
  const host = new URL(url).host;

  for (let attempt = 0; ; attempt++) {
    await waitForTurn(host);

    let response;
    try {
      response = await fetch(url, {
        headers: {
          'user-agent': UA,
          accept: accept ?? '*/*',
          'accept-language': 'en-US,en;q=0.9',
        },
        redirect: 'follow',
      });
    } catch (cause) {
      if (attempt >= BACKOFF.length) {
        consecutiveFailures++;
        guardAgainstRunawayFailures(url);
        throw new Error(`network error for ${url}: ${cause.message}`);
      }
      await sleep(BACKOFF[attempt]);
      continue;
    }

    if (response.ok) {
      consecutiveFailures = 0;
      return {
        buffer: Buffer.from(await response.arrayBuffer()),
        contentType: response.headers.get('content-type') ?? '',
        url: response.url,
      };
    }

    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt >= BACKOFF.length) {
      consecutiveFailures++;
      guardAgainstRunawayFailures(url);
      throw new Error(`HTTP ${response.status} for ${url}`);
    }

    // Honour Retry-After when the server bothers to send one.
    const retryAfter = Number(response.headers.get('retry-after'));
    await sleep(Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000
      : BACKOFF[attempt]);
  }
}

function guardAgainstRunawayFailures(url) {
  if (consecutiveFailures < MAX_CONSECUTIVE_FAILURES) return;
  throw new Error(
    `aborting: ${consecutiveFailures} consecutive failures (last: ${url}). ` +
    `The host is probably rate-limiting us — wait a while before retrying.`,
  );
}

export async function getText(url, options) {
  return (await get(url, options)).buffer.toString('utf8');
}

export async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Download to `path` unless it is already there.
 * Returns 'skipped' or 'downloaded' so callers can report progress honestly.
 */
export async function download(url, path, options) {
  if (await exists(path)) return 'skipped';
  const { buffer } = await get(url, options);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, buffer);
  return 'downloaded';
}
