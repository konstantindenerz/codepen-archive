#!/usr/bin/env node
// A localhost receiver for data captured in the browser.
//
// Some payloads are too large for Chrome to hand over as an automatic download,
// and routing binary data through the console mangles it. Posting straight from
// the page to a local port avoids both problems — Chrome treats http://localhost
// as trustworthy, so an HTTPS page may post to it.
//
// Large payloads are sent in chunks: POST /chunk?i=<n> for each part, then
// POST /done to assemble them. The server exits once /done is handled.
//
// Usage: node tools/lib/receiver.mjs <output-file> [port]

import { createServer } from 'node:http';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const output = process.argv[2];
const port = Number(process.argv[3] ?? 8765);

if (!output) {
  console.error('usage: node tools/lib/receiver.mjs <output-file> [port]');
  process.exit(1);
}

// Chrome's Private Network Access rules block a public HTTPS page from
// reaching a loopback address unless the preflight explicitly opts in.
const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type',
  'access-control-allow-private-network': 'true',
  'access-control-max-age': '600',
};

const chunks = new Map();

const readBody = (request) =>
  new Promise((resolve, reject) => {
    const parts = [];
    request.on('data', (part) => parts.push(part));
    request.on('end', () => resolve(Buffer.concat(parts)));
    request.on('error', reject);
  });

const server = createServer(async (request, response) => {
  const { pathname, searchParams } = new URL(request.url, 'http://localhost');

  if (request.method === 'OPTIONS') {
    response.writeHead(204, CORS).end();
    return;
  }

  if (request.method !== 'POST') {
    response.writeHead(405, CORS).end();
    return;
  }

  if (pathname === '/chunk') {
    const index = Number(searchParams.get('i'));
    const body = await readBody(request);
    chunks.set(index, body);
    response.writeHead(200, CORS).end(`chunk ${index}: ${body.length}`);
    console.log(`chunk ${index}: ${(body.length / 1048576).toFixed(1)} MB`);
    return;
  }

  if (pathname === '/done') {
    const ordered = [...chunks.keys()].sort((a, b) => a - b).map((key) => chunks.get(key));
    const body = Buffer.concat(ordered);
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, body);
    response.writeHead(200, CORS).end(`received ${body.length}`);
    console.log(`assembled ${(body.length / 1048576).toFixed(1)} MB -> ${output}`);
    server.close();
    setTimeout(() => process.exit(0), 200);
    return;
  }

  // Single-shot: small payloads can skip the chunking dance.
  const body = await readBody(request);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, body);
  response.writeHead(200, CORS).end(`received ${body.length}`);
  console.log(`received ${(body.length / 1048576).toFixed(1)} MB -> ${output}`);
  server.close();
  setTimeout(() => process.exit(0), 200);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`listening on http://localhost:${port}`);
});
