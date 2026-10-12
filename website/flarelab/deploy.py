import os, json, requests, mimetypes, gzip
A = '36f7672020cfc6c515e198c5786d99da'; N = os.environ.get('WORKER', 'flarelab')
B = f'https://api.cloudflare.com/client/v4/accounts/{A}'
H = {'User-Agent': 'curl/8.5.0'}
if os.environ.get('CLOUDFLARE_API_TOKEN'): H['Authorization'] = 'Bearer ' + os.environ['CLOUDFLARE_API_TOKEN']
HERE = os.path.dirname(os.path.abspath(__file__))
D = os.path.join(HERE, 'dist')
# Auth: set CLOUDFLARE_API_TOKEN (Workers Scripts:Edit). In Hark the token is injected on the wire.
if os.environ.get('CLOUDFLARE_API_TOKEN'): pass
CT = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.glb': 'model/gltf-binary', '.webp': 'image/webp',
      '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json'}
files = []
for r, _, fs in os.walk(D):
    for f in sorted(fs):
        p = os.path.join(r, f); url = '/' + os.path.relpath(p, D).replace(os.sep, '/')
        files.append((url, p))
parts = {}; imports = []; table = []
for i, (url, p) in enumerate(files):
    mod = f'a{i}.bin'
    parts[mod] = (mod, open(p, 'rb').read(), 'application/octet-stream')
    imports.append(f'import m{i} from "./{mod}";')
    ext = os.path.splitext(p)[1]
    long = ext in ('.woff2', '.webp', '.png', '.jpg', '.glb')
    cc = 'public, max-age=86400' if long else 'public, max-age=300, must-revalidate'
    table.append(f'"{url}":[m{i},"{CT.get(ext, "application/octet-stream")}","{cc}"]')
worker = '\n'.join(imports) + '\nconst F={' + ','.join(table) + '''};
export default{async fetch(req){const u=new URL(req.url);let p=decodeURIComponent(u.pathname);if(p==="/"||p==="")p="/index.html";
const e=F[p]||(p.endsWith("/")?F[p+"index.html"]:null);
if(!e){if(!p.includes("."))return new Response(null,{status:302,headers:{location:"/"}});return new Response("Not found",{status:404,headers:{"content-type":"text/plain"}});}
const h={"content-type":e[1],"cache-control":e[2],"access-control-allow-origin":"*","x-content-type-options":"nosniff"};
if(req.method==="HEAD")return new Response(null,{headers:h});
return new Response(e[0],{headers:h});}};
'''
open(os.path.join(HERE, 'worker.js'), 'w').write(worker)
raw = sum(len(v[1]) for v in parts.values())
gz = sum(len(gzip.compress(v[1], 6)) for v in parts.values()) + len(gzip.compress(worker.encode()))
print('files', len(files), 'raw', raw, 'gzip est', gz)
meta = {'main_module': 'worker.js', 'compatibility_date': '2026-10-01', 'bindings': []}
mp = {'metadata': (None, json.dumps(meta), 'application/json'), 'worker.js': ('worker.js', worker, 'application/javascript+module')}
mp.update(parts)
u = requests.put(f'{B}/workers/scripts/{N}', files=mp, headers=H, timeout=180)
print('script', u.status_code, u.text[:600])
u = requests.post(f'{B}/workers/scripts/{N}/subdomain', json={'enabled': True}, headers=H); print('subdomain', u.status_code, u.text[:200])
