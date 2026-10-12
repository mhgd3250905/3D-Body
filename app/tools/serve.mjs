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
  '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gz': 'application/gzip',
  '.bin': 'application/octet-stream', '.md': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml',
};
function byteRange(value, size) {
  if (size === 0) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(value.trim());
  if (!match || (!match[1] && !match[2])) return null;
  if (!match[1]) {
    const suffix = Number(match[2]);
    if (!Number.isSafeInteger(suffix) || suffix <= 0) return null;
    return [Math.max(0, size - suffix), size - 1];
  }
  const start = Number(match[1]), end = match[2] ? Number(match[2]) : size - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= size || end < start) return null;
  return [start, Math.min(end, size - 1)];
}
http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405).end();
    return;
  }
  let name;
  try {
    // Validate before URL parsing can normalize raw or encoded dot segments.
    const raw = request.url.split('?')[0];
    if (!raw.startsWith('/') || raw.startsWith('//') || raw.includes('#')) throw new Error('Invalid path');
    const decoded = decodeURIComponent(raw);
    if (decoded.includes('\\') || decoded.includes('%') || /[\x00-\x1f\x7f]/.test(decoded) ||
        decoded.split('/').some(segment => segment === '.' || segment === '..')) throw new Error('Invalid path');
    name = path.resolve(root, '.' + (decoded === '/' ? '/index.html' : decoded));
    const relative = path.relative(root, name);
    if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Invalid path');
  } catch {
    response.writeHead(400).end();
    return;
  }
  let stat;
  try { stat = fs.statSync(name); } catch { /* Missing file. */ }
  if (!stat?.isFile()) {
    response.writeHead(404).end('Not found');
    return;
  }
  const extension = path.extname(name).toLowerCase(), video = extension === '.mp4';
  const headers = {
    'Content-Type': types[extension] ?? 'application/octet-stream',
    'Content-Length': stat.size,
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
    ...(video ? { 'Accept-Ranges': 'bytes' } : {}),
  };
  let selected;
  if (video && request.method === 'GET' && request.headers.range != null) {
    selected = byteRange(request.headers.range, stat.size);
    if (!selected) {
      response.writeHead(416, {
        ...headers, 'Content-Length': 0, 'Content-Range': `bytes */${stat.size}`,
      }).end();
      return;
    }
    headers['Content-Length'] = selected[1] - selected[0] + 1;
    headers['Content-Range'] = `bytes ${selected[0]}-${selected[1]}/${stat.size}`;
  }
  response.writeHead(selected ? 206 : 200, headers);
  if (request.method === 'HEAD') response.end();
  else {
    const stream = fs.createReadStream(name, selected ? { start: selected[0], end: selected[1] } : undefined);
    stream.on('error', () => response.destroy());
    response.on('close', () => stream.destroy());
    stream.pipe(response);
  }
}).listen(port, '127.0.0.1', () => {
  console.log('Flare Flutter preview: http://127.0.0.1:' + port + '/');
});
