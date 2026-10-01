#!/usr/bin/env node
// A local collector for assets only a real browser can download.
//
// CodePen's asset host is behind Cloudflare, which rejects curl and headless
// Chrome alike. The user's own Chrome gets through — but handing the bytes back
// is the awkward part: large automatic downloads get blocked, and Chrome 150
// refuses outright when a public HTTPS page talks to localhost.
//
// Serving the collector page from localhost sidesteps both. The page is a local
// origin talking to a local origin, and it reaches CodePen's CDN through CORS.
//
// Usage: node tools/collector/server.mjs <urls.json> <output.json> [port]

import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const [urlsFile, output, portArg] = process.argv.slice(2);
const port = Number(portArg ?? 8765);

if (!urlsFile || !output) {
  console.error('usage: node tools/collector/server.mjs <urls.json> <output.json> [port]');
  process.exit(1);
}

const urls = JSON.parse(await readFile(urlsFile, 'utf8'));
const page = await readFile(join(dirname(new URL(import.meta.url).pathname), 'collect.html'), 'utf8');

const readBody = (request) =>
  new Promise((resolve, reject) => {
    const parts = [];
    request.on('data', (part) => parts.push(part));
    request.on('end', () => resolve(Buffer.concat(parts)));
    request.on('error', reject);
  });

const server = createServer(async (request, response) => {
  const { pathname } = new URL(request.url, 'http://localhost');

  if (pathname === '/' || pathname === '/collect.html') {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(page);
    return;
  }

  if (pathname === '/urls.json') {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify(urls));
    return;
  }

  if (pathname === '/result' && request.method === 'POST') {
    const body = await readBody(request);
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, body);
    response.writeHead(200, { 'content-type': 'text/plain' });
    response.end('ok');
    console.log(`received ${(body.length / 1048576).toFixed(1)} MB -> ${output}`);
    server.close();
    setTimeout(() => process.exit(0), 200);
    return;
  }

  response.writeHead(404).end();
});

server.listen(port, '127.0.0.1', () => {
  console.log(`collector ready: http://localhost:${port}/ (${urls.length} urls)`);
});
