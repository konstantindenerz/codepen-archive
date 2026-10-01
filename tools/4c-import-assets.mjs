#!/usr/bin/env node
// Step 4c — import the assets fetched by the browser in step 4b.
//
// Decodes the base64 payloads into assets/vendor/ and records them in the
// vendor manifest, so the rewrite step treats them like any other asset.
//
// Usage: node tools/4c-import-assets.mjs <codepen-assets.json>

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { VENDOR_DIR, vendorName } from './lib/vendor.mjs';
import { exists } from './lib/http.mjs';

const MANIFEST = 'data/vendor-manifest.json';

const input = process.argv[2];
if (!input) {
  console.error('usage: node tools/4c-import-assets.mjs <codepen-assets.json>');
  process.exit(1);
}

const payload = JSON.parse(await readFile(input, 'utf8'));
const manifest = (await exists(MANIFEST))
  ? JSON.parse(await readFile(MANIFEST, 'utf8'))
  : { fetchedAt: new Date().toISOString(), assets: [], fonts: [] };

const known = new Map(manifest.assets.map((asset) => [asset.url, asset]));

await mkdir(VENDOR_DIR, { recursive: true });

let imported = 0;
let bytes = 0;

for (const asset of payload.assets) {
  const name = vendorName(asset.url, asset.contentType);
  const buffer = Buffer.from(asset.base64, 'base64');

  if (buffer.length !== asset.bytes) {
    throw new Error(`size mismatch for ${asset.url}: ${buffer.length} != ${asset.bytes}`);
  }

  await writeFile(join(VENDOR_DIR, name), buffer);
  known.set(asset.url, { url: asset.url, name });
  imported++;
  bytes += buffer.length;
}

manifest.assets = [...known.values()].sort((a, b) => a.url.localeCompare(b.url));
await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(
  `imported ${imported} assets (${(bytes / 1048576).toFixed(1)} MB), ` +
  `manifest now has ${manifest.assets.length} entries`,
);

if (payload.failures?.length) {
  console.log(`\n${payload.failures.length} failed in the browser:`);
  console.log(payload.failures.map((f) => `  ${f.url} — ${f.reason}`).join('\n'));
  process.exitCode = 1;
}
