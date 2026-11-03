# Deploy dist/ to a Cloudflare Pages project via direct upload (no wrangler).
#   python3 deploy_pages.py                 # project flarelab-preview → https://flarelab-preview.pages.dev
#   python3 deploy_pages.py --project NAME
# Needs CLOUDFLARE_API_TOKEN with Pages:Edit on the account (in Hark it is injected on the wire).
# The asset upload calls use the short-lived upload JWT and must bypass any credential-injecting
# proxy (it would replace the JWT with the API token), so they go out with trust_env=False.
# Used for previews because the token available in Hark has Pages but not Workers Scripts permission.
import base64, json, os, sys, requests, blake3
A = '36f7672020cfc6c515e198c5786d99da'
P = 'flarelab-preview'
if '--project' in sys.argv: P = sys.argv[sys.argv.index('--project') + 1]
if P == 'flarelab': sys.exit('refusing to deploy to the live name')
API = f'https://api.cloudflare.com/client/v4/accounts/{A}/pages/projects'
H = {'User-Agent': 'curl/8.5.0'}
if os.environ.get('CLOUDFLARE_API_TOKEN', '').strip() and not os.environ.get('HTTPS_PROXY'): H['Authorization'] = 'Bearer ' + os.environ['CLOUDFLARE_API_TOKEN']
HERE = os.path.dirname(os.path.abspath(__file__)); D = os.path.join(HERE, 'dist')
CT = {'.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.glb': 'model/gltf-binary', '.webp': 'image/webp',
      '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json', '.txt': 'text/plain'}

r = requests.get(f'{API}/{P}', headers=H, timeout=30)
if r.status_code == 404:
    r = requests.post(API, headers=H, json={'name': P, 'production_branch': 'main'}, timeout=30)
print('project', r.status_code)
jwt = requests.get(f'{API}/{P}/upload-token', headers=H, timeout=30).json()['result']['jwt']
direct = requests.Session(); direct.trust_env = False
JH = {'Authorization': 'Bearer ' + jwt, 'User-Agent': 'curl/8.5.0'}

files = {}
for root, _, fs in os.walk(D):
    for f in fs:
        p = os.path.join(root, f); url = '/' + os.path.relpath(p, D).replace(os.sep, '/')
        raw = open(p, 'rb').read(); b64 = base64.b64encode(raw).decode()
        ext = os.path.splitext(f)[1]
        h = blake3.blake3((b64 + ext.lstrip('.')).encode()).hexdigest()[:32]
        files[url] = (h, b64, CT.get(ext, 'application/octet-stream'))
missing = direct.post('https://api.cloudflare.com/client/v4/pages/assets/check-missing', headers=JH, json={'hashes': [v[0] for v in files.values()]}, timeout=60).json()['result']
print('files', len(files), 'missing', len(missing))
todo = [v for v in files.values() if v[0] in set(missing)]
batch, size = [], 0
def flush():
    global batch, size
    if not batch: return
    r = direct.post('https://api.cloudflare.com/client/v4/pages/assets/upload', headers=JH, json=[{'key': h, 'value': b, 'metadata': {'contentType': c}, 'base64': True} for h, b, c in batch], timeout=180)
    print('upload', len(batch), r.status_code); r.raise_for_status(); batch, size = [], 0
for v in todo:
    batch.append(v); size += len(v[1])
    if size > 20_000_000 or len(batch) >= 400: flush()
flush()
direct.post('https://api.cloudflare.com/client/v4/pages/assets/upsert-hashes', headers=JH, json={'hashes': [v[0] for v in files.values()]}, timeout=60)
manifest = {u: v[0] for u, v in files.items()}
headers_file = '''/fonts/*
  Cache-Control: public, max-age=604800
/img/*
  Cache-Control: public, max-age=86400
/coach.glb
  Cache-Control: public, max-age=86400
/*
  X-Content-Type-Options: nosniff
'''
r = requests.post(f'{API}/{P}/deployments', headers=H, files={'manifest': (None, json.dumps(manifest)), 'branch': (None, 'main'), '_headers': ('_headers', headers_file)}, timeout=120)
d = r.json(); print('deploy', r.status_code, d.get('success'), (d.get('result') or {}).get('url'), d.get('errors'))
