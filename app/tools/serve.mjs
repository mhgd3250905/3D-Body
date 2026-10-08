import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../build/web/', import.meta.url));
const argument = process.argv.indexOf('--port');
const port = argument < 0 ? 8820 : Number(process.argv[argument + 1]);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid port');
if (!fs.existsSync(path.join(root, 'index.html'))) {
  console.error('Run flutter build web --no-web-resources-cdn from app first.');
  process.exit(1);
}
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json',
  '.wasm': 'application/wasm', '.ttf': 'font/ttf', '.woff2': 'font/woff2',
  '.glb': 'model/gltf-binary', '.png': 'image/png', '.webp': 'image/webp',
  '.gz': 'application/gzip',
  '.bin': 'application/octet-stream', '.md': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml',
};
http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405).end();
    return;
  }
  let name;
  try {
    const url = new URL(request.url, 'http://127.0.0.1');
    const decoded = decodeURIComponent(url.pathname);
    if (decoded.includes('\\') || decoded.includes('\0')) throw new Error('Invalid path');
    name = path.resolve(root, '.' + (decoded === '/' ? '/index.html' : decoded));
    const relative = path.relative(root, name);
    if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Invalid path');
  } catch {
    response.writeHead(400).end();
    return;
  }
  if (!fs.existsSync(name) || !fs.statSync(name).isFile()) {
    response.writeHead(404).end('Not found');
    return;
  }
  response.writeHead(200, {
    'Content-Type': types[path.extname(name)] ?? 'application/octet-stream',
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
  });
  if (request.method === 'HEAD') response.end();
  else fs.createReadStream(name).pipe(response);
}).listen(port, '127.0.0.1', () => {
  console.log('Flare Flutter preview: http://127.0.0.1:' + port + '/');
});
