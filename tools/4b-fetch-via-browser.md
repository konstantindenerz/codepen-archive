# Step 4b — fetch the Cloudflare-protected CodePen assets

`assets.codepen.io` (uploaded images, fonts, audio, video) and
`codepen.io/<user>/pen/<slug>.js|.css` (pens included as a resource by other
pens) both sit behind Cloudflare. `curl` and headless Chrome get a `403`; only
a real browser session gets through.

Happily, `assets.codepen.io` sends permissive CORS headers, so a normal page on
`codepen.io` can read the bytes. This step collects them all into **one** JSON
file rather than triggering 47 separate downloads.

## How to run it

1. Run `node tools/4-vendor-assets.mjs` first — it writes the list of deferred
   URLs to `tmp/browser-assets.json`.
2. Open <https://codepen.io/konstantindenerz/pens/popular> in Chrome.
3. Paste the list into the `URLS` constant below, then run the snippet in the
   DevTools console. It downloads `codepen-assets.json`.
4. Move that file next to the repo and run:
   `node tools/4c-import-assets.mjs ~/Downloads/codepen-assets.json`

```js
const URLS = [/* paste the contents of tmp/browser-assets.json here */];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const toBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  // Chunked so a multi-megabyte video does not blow the argument limit.
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
};

const assets = [];
const failures = [];

for (const [index, url] of URLS.entries()) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = await response.arrayBuffer();
    assets.push({
      url,
      contentType: response.headers.get('content-type') ?? '',
      bytes: buffer.byteLength,
      base64: toBase64(buffer),
    });
    console.log(`${index + 1}/${URLS.length}`, url.slice(-60), buffer.byteLength);
  } catch (error) {
    failures.push({ url, reason: String(error) });
    console.warn('FAILED', url, error);
  }
  await sleep(1500); // stay well under anything that looks like scraping
}

const blob = new Blob([JSON.stringify({ assets, failures })], { type: 'application/json' });
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = 'codepen-assets.json';
document.body.appendChild(a);
a.click();
a.remove();

({ ok: assets.length, failed: failures.length,
   mb: (assets.reduce((n, a) => n + a.bytes, 0) / 1048576).toFixed(1) });
```
