import json, os, re, shutil, subprocess, html, sys
B = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(B, '..', '..'))
S = B + '/src'; D = B + '/dist'
os.makedirs(D + '/img', exist_ok=True); os.makedirs(D + '/fonts', exist_ok=True)
data = json.load(open(S + '/flare-data.json', encoding='utf-8'))
drills = json.load(open(S + '/drills.json', encoding='utf-8'))
PH_EN = ['Rear support', 'First transfer', 'First side support', 'First leg pass', 'Front support', 'Second transfer', 'Second side support', 'Second leg pass']

rail = ''.join(f'<div class="tick{" on" if i==0 else ""}"><b>{i+1:02d}</b>{p["name"]}</div>' for i, p in enumerate(data['phases']))
secs = [('support', '支撑', 'Support'), ('core', '核心', 'Core'), ('legs', '腿部', 'Legs')]
legend = ''
for key, zh, en in secs:
    items = ''.join(f'<li data-g="{g["id"]}">{g["label"]}</li>' for g in data['groups'] if g['sec'] == key)
    legend += f'<div><h4><b>{zh}</b>{en}</h4><ul>{items}</ul></div>'
cards = []
for gid, tiers in drills['drills'].items():
    for t in ('A', 'B', 'C'):
        d = tiers.get(t)
        if not d: continue
        img = f'd-{gid}-{t}.webp'
        if not os.path.exists(S + '/img/' + img): continue
        cards.append(f'<div class="dcard"><img loading="lazy" src="/img/{img}" alt="{html.escape(d["name"])}"><p><i>{t}</i>{html.escape(d["name"])}<span>{html.escape(d.get("nameEn",""))}</span></p></div>')
# interleave so neighbouring cards differ
row1 = cards[0::2]; row2 = cards[1::2]
tpl = open(S + '/index.tpl.html', encoding='utf-8').read()
out = tpl.replace('{{RAIL}}', rail).replace('{{LEGEND}}', legend).replace('{{ROW1}}', ''.join(row1 * 2)).replace('{{ROW2}}', ''.join(row2 * 2))
open(D + '/index.html', 'w', encoding='utf-8').write(out)

# bundle js
esb = os.environ.get('ESBUILD')
cmd = [esb] if esb else [shutil.which('node') or 'node', os.path.join(ROOT, 'node_modules', 'esbuild', 'bin', 'esbuild')]
subprocess.run(cmd + [S + '/main.js', '--bundle', '--minify', '--format=iife', '--target=es2019', '--legal-comments=none', '--outfile=' + D + '/app.js'], check=True)

# fonts
chars = set(out) | set(json.dumps(data, ensure_ascii=False)) | set(open(S + '/main.js', encoding='utf-8').read())
chars |= set('0123456789°·—→×✓●◐/%.:-+ ')
txt = ''.join(sorted(c for c in chars if ord(c) >= 32))
open(B + '/chars.txt', 'w', encoding='utf-8').write(txt)
F = os.environ.get('FONTS_DIR', B + '/fonts')  # NotoSansSC[wght].ttf, Anton-Regular.ttf, JetBrainsMono[wght].ttf (not committed, ~38MB)
def run(module, *a): subprocess.run([sys.executable, '-m', module, *a], check=True)
if os.environ.get('FONTS_DIR'):
    for w in (400, 900):
        inst = f'{F}/nsc-{w}.ttf'
        if not os.path.exists(inst):
            run('fontTools.varLib.instancer', f'{F}/NotoSansSC[wght].ttf', f'wght={w}', '-o', inst)
        run('fontTools.subset', inst, '--text-file=' + B + '/chars.txt', '--flavor=woff2', '--layout-features=*', '--output-file=' + f'{D}/fonts/nsc-{w}.woff2')
    latin = ''.join(chr(c) for c in range(32, 127)) + '°·—→×✓’“”'
    run('fontTools.subset', F + '/Anton-Regular.ttf', '--text=' + latin, '--flavor=woff2', '--output-file=' + D + '/fonts/anton.woff2')
    run('fontTools.subset', F + '/JetBrainsMono[wght].ttf', '--text=' + latin + '●◐', '--flavor=woff2', '--output-file=' + D + '/fonts/mono.woff2')
else:
    # The deployed font subsets are committed as build inputs. No download or
    # private font directory is needed to reproduce the current website.
    for name in ('nsc-400.woff2', 'nsc-900.woff2', 'anton.woff2', 'mono.woff2'):
        shutil.copy(S + '/fonts/' + name, D + '/fonts/' + name)

# assets
for f in os.listdir(S + '/img'):
    used = f in out or f in ('icon.png', 'og.jpg', 'flare-loop.webp')
    if used: shutil.copy(S + '/img/' + f, D + '/img/' + f)
shutil.copy(B + '/coach.glb', D + '/coach.glb')
shutil.copytree(S + '/fonts/licenses', D + '/fonts/licenses', dirs_exist_ok=True)
tot = 0
for r, _, fs in os.walk(D):
    for f in fs: tot += os.path.getsize(os.path.join(r, f))
print('dist bytes', tot)
