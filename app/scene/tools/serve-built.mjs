import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('../../assets/scene/', import.meta.url)));
const port = Number(process.argv[process.argv.indexOf('--port') + 1]) || 8842;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.glb': 'model/gltf-binary', '.md': 'text/plain; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
http.createServer((request, response) => {
  const requestUrl = new URL(request.url, 'http://127.0.0.1:' + port);
  if (requestUrl.pathname === '/host.html') {
    response.writeHead(200, { 'Content-Type': types['.html'] });
    response.end('<!doctype html><html><meta name="viewport" content="width=device-width,initial-scale=1"><body style="margin:0;background:#101116"><iframe title="Flare scene test host" src="./index.html" style="border:0;width:100vw;height:100vh;display:block"></iframe><script>window.events=[];window.addEventListener("message",e=>{if(e.origin===location.origin&&e.data?.source==="flare-scene")events.push(e.data);});</script></body></html>'); return;
  }
  let pathname; try { pathname = decodeURIComponent(requestUrl.pathname); } catch { response.writeHead(400); response.end(); return; }
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!(file.startsWith(root + path.sep) || file === root) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { response.writeHead(404); response.end(); return; }
  response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); fs.createReadStream(file).pipe(response);
}).listen(port, '127.0.0.1', () => console.log('Flare scene preview http://127.0.0.1:' + port));
