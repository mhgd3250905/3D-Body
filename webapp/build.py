"""Build FlareLab web app -> webapp/dist/.

Needs: node_modules with three@0.170 + esbuild (webapp/node_modules or repo-root
node_modules via `npm ci`) and Pillow. By default uses committed src/fonts/.
Optional FONTS_DIR regenerates subsets with fontTools and brotli.
"""
import json, os, shutil, subprocess, glob, sys
from PIL import Image

B = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(B)
APP = os.path.join(ROOT, 'app')
S, D = B + '/src', B + '/dist'
shutil.rmtree(D, ignore_errors=True)
for p in ('img', 'fonts'): os.makedirs(f'{D}/{p}', exist_ok=True)

nm = B + '/node_modules' if os.path.exists(B + '/node_modules/three') else ROOT + '/node_modules'
esb = os.environ.get('ESBUILD')
cmd = [esb] if esb else [shutil.which('node') or 'node', nm + '/esbuild/bin/esbuild']
env = dict(os.environ, NODE_PATH=nm)
subprocess.run(cmd + [S + '/main.js', '--bundle', '--minify', '--format=iife', '--target=es2020', '--legal-comments=none',
                '--loader:.json=json', '--outfile=' + D + '/app.js'], check=True, env=env)
html = open(S + '/index.tpl.html', encoding='utf-8').read()
open(D + '/index.html', 'w', encoding='utf-8').write(html)

# images: drill thumbnails (dark, 512px), icon, welcome art
for f in glob.glob(APP + '/assets/drills/*-512.webp'):
    shutil.copy(f, f'{D}/img/{os.path.basename(f).replace("-512", "")}')
Image.open(APP + '/assets/brand/icon.png').convert('RGBA').resize((128, 128), Image.LANCZOS).save(D + '/img/icon.png', optimize=True)
im = Image.open(APP + '/assets/brand/hero-thomas.webp'); im.save(D + '/img/hero.webp', quality=80)
shutil.copy(B + '/coach.glb', D + '/coach.glb')
shutil.copy(APP + '/assets/scene/anatomy/mannequin-reference.meshopt.glb.gz', D + '/mannequin.glb.gz')

# fonts: subset Noto Sans SC to every character the app can render
data = ''.join(open(p, encoding='utf-8').read() for p in [
    APP + '/assets/data/drills.json', APP + '/assets/data/phase-muscles.json', APP + '/assets/data/course-stages.json', S + '/main.js', S + '/core.js', S + '/index.tpl.html'])
chars = set(data) | set('0123456789°·—–→←×✓●/%.:-+ 一二三四五六日月周年')
txt = ''.join(sorted(c for c in chars if ord(c) >= 32))
open(B + '/chars.txt', 'w', encoding='utf-8').write(txt)
F = os.environ.get('FONTS_DIR', B + '/fonts')
def run(module, *a): subprocess.run([sys.executable, '-m', module, *a], check=True)
if os.environ.get('FONTS_DIR'):
    for w in (400, 700):
        inst = f'{F}/nsc-{w}.ttf'
        if not os.path.exists(inst):
            run('fontTools.varLib.instancer', f'{F}/NotoSansSC[wght].ttf', f'wght={w}', '-o', inst)
        run('fontTools.subset', inst, '--text-file=' + B + '/chars.txt', '--flavor=woff2', '--layout-features=kern,liga,locl,palt,vert', '--output-file=' + f'{D}/fonts/nsc-{w}.woff2')
    latin = ''.join(chr(c) for c in range(32, 127)) + '°·—→×✓’“”'
    run('fontTools.subset', F + '/Anton-Regular.ttf', '--text=' + latin, '--flavor=woff2', '--output-file=' + D + '/fonts/anton.woff2')
    run('fontTools.subset', F + '/JetBrainsMono[wght].ttf', '--text=' + latin + '●◐', '--flavor=woff2', '--output-file=' + D + '/fonts/mono.woff2')
else:
    for name in ('nsc-400.woff2', 'nsc-700.woff2', 'anton.woff2', 'mono.woff2'):
        shutil.copy(S + '/fonts/' + name, D + '/fonts/' + name)
shutil.copytree(S + '/fonts/licenses', D + '/fonts/licenses', dirs_exist_ok=True)

tot = 0
for r, _, fs in os.walk(D):
    for f in fs: tot += os.path.getsize(os.path.join(r, f))
print('dist bytes', tot, 'chars', len(txt))
