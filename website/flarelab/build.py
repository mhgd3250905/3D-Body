# FlareLab website v2 build: renders zh (/) and en (/en/) pages, bundles the hero
# WebGL script, (optionally) re-subsets the CJK font to the glyphs used, copies assets.
#   python website/flarelab/build.py                      # reuse committed font subsets in src/fonts/
#   FONTS_DIR=/path python website/flarelab/build.py      # re-subset: needs NotoSansSC.ttf (variable wght) + fonttools + brotli
import json, os, shutil, subprocess, sys
B = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(B, '..', '..'))
S = B + '/src'; D = B + '/dist'
import importlib.util
spec = importlib.util.spec_from_file_location('flsite', S + '/site.py'); flsite = importlib.util.module_from_spec(spec); spec.loader.exec_module(flsite)

if os.path.isdir(D): shutil.rmtree(D)
for d in ('img', 'fonts', 'en'): os.makedirs(D + '/' + d, exist_ok=True)
pages = {'zh': flsite.render('zh'), 'en': flsite.render('en')}
open(D + '/index.html', 'w', encoding='utf-8').write(pages['zh'])
open(D + '/en/index.html', 'w', encoding='utf-8').write(pages['en'])
shutil.copy(S + '/site.css', D + '/site.css')

# bundle js
esb = os.environ.get('ESBUILD')
cmd = [esb] if esb else [shutil.which('node') or 'node', os.path.join(ROOT, 'node_modules', 'esbuild', 'bin', 'esbuild')]
subprocess.run(cmd + [S + '/hero.js', '--bundle', '--minify', '--format=iife', '--target=es2019', '--legal-comments=none', '--outfile=' + D + '/app.js'], check=True)

# fonts: CJK subset = every glyph on both pages + the live phase labels
data = json.load(open(S + '/flare-data.json', encoding='utf-8'))
chars = set(pages['zh']) | set(pages['en']) | set(''.join(p['name'] for p in data['phases'])) | set(open(S + '/hero.js', encoding='utf-8').read())
chars |= set('0123456789°·—→×✓/%.:-+ ') | set(chr(c) for c in range(32, 127))
txt = ''.join(sorted(c for c in chars if ord(c) >= 32))
open(B + '/chars.txt', 'w', encoding='utf-8').write(txt)
F = os.environ.get('FONTS_DIR')
if F:
    def run(module, *a): subprocess.run([sys.executable, '-m', module, *a], check=True)
    src = next(p for p in (F + '/NotoSansSC[wght].ttf', F + '/NotoSansSC.ttf') if os.path.exists(p))
    for w in (400, 900):
        inst = f'{B}/.nsc-{w}.ttf'
        run('fontTools.varLib.instancer', src, f'wght={w}', '-o', inst, '-q')
        run('fontTools.subset', inst, '--text-file=' + B + '/chars.txt', '--flavor=woff2', '--layout-features=*', '--output-file=' + f'{S}/fonts/nsc-{w}.woff2')
        os.remove(inst)
for name in ('nsc-400.woff2', 'nsc-900.woff2', 'anton.woff2', 'mono.woff2'):
    shutil.copy(S + '/fonts/' + name, D + '/fonts/' + name)
shutil.copytree(S + '/fonts/licenses', D + '/fonts/licenses', dirs_exist_ok=True)

# assets: only what the pages reference
allhtml = pages['zh'] + pages['en']
for f in os.listdir(S + '/img'):
    if f in allhtml or f in ('og.jpg',): shutil.copy(S + '/img/' + f, D + '/img/' + f)
shutil.copy(B + '/coach.glb', D + '/coach.glb')
tot = 0; big = []
for r, _, fs in os.walk(D):
    for f in fs:
        n = os.path.getsize(os.path.join(r, f)); tot += n
        if n > 200_000: big.append((f, n))
print('dist bytes', tot, 'files >200KB:', big)
