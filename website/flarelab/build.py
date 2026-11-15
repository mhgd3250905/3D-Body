import json, os, shutil, subprocess, html, sys
from pathlib import Path
from site_content import (
    COPY, LABELS_EN, SITE, render_badges, render_faq, render_seo, render_sitemap,
)
B = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(B, '..', '..'))
S = B + '/src'; D = B + '/dist'
os.makedirs(D + '/img', exist_ok=True); os.makedirs(D + '/fonts', exist_ok=True)
data = json.load(open(S + '/flare-data.json', encoding='utf-8'))
drills = json.load(open(S + '/drills.json', encoding='utf-8'))
PH_EN = ['Rear support', 'First transfer', 'First side support', 'First leg pass', 'Front support', 'Second transfer', 'Second side support', 'Second leg pass']

sections = [('support', '支撑', 'Support'), ('core', '核心', 'Core'), ('legs', '腿部', 'Legs')]


def render_page(lang, template_name):
    english = lang == 'en'
    rail = ''.join(
        f'<div class="tick{" on" if i == 0 else ""}"><b>{i + 1:02d}</b>'
        f'{html.escape(PH_EN[i] if english else phase["name"])}</div>'
        for i, phase in enumerate(data['phases'])
    )
    legend = []
    for key, zh, en in sections:
        items = ''.join(
            f'<li data-g="{group["id"]}">'
            f'{html.escape(LABELS_EN[group["id"]] if english else group["label"])}</li>'
            for group in data['groups'] if group['sec'] == key
        )
        heading = en if english else f'<b>{zh}</b>{en}'
        legend.append(f'<div><h4>{heading}</h4><ul>{items}</ul></div>')

    cards = []
    for group_id, tiers in drills['drills'].items():
        for tier in ('A', 'B', 'C'):
            drill = tiers.get(tier)
            image = f'd-{group_id}-{tier}.webp'
            if not drill or not Path(S, 'img', image).is_file():
                continue
            english_name = drill.get('nameEn') or drill['name']
            name = english_name if english else drill['name']
            subtitle = '' if english else f'<span>{html.escape(english_name)}</span>'
            cards.append(
                f'<div class="dcard"><img loading="lazy" src="/img/{image}" '
                f'alt="{html.escape(name)}"><p><i>{tier}</i>{html.escape(name)}{subtitle}</p></div>'
            )

    language_suffix = 'en' if english else 'zh-cn'
    replacements = {
        'STYLES': Path(S, 'styles.css').read_text(encoding='utf-8'),
        'SEO': render_seo(lang),
        'BADGES': render_badges(lang, (
            f'app-store-{language_suffix}.svg', f'google-play-{language_suffix}.svg',
        )),
        'INTRO': f'<p class="faq-intro">{html.escape(COPY[lang]["intro"])}</p>',
        'FAQ': render_faq(lang),
        'RAIL': rail,
        'LEGEND': ''.join(legend),
        'ROW1': ''.join(cards[0::2] * 2),
        'ROW2': ''.join(cards[1::2] * 2),
    }
    output = Path(S, template_name).read_text(encoding='utf-8')
    for key, value in replacements.items():
        marker = '{{' + key + '}}'
        if marker not in output:
            raise ValueError(f'Missing {marker} in {template_name}')
        output = output.replace(marker, value)
    return output


out = render_page('zh-CN', 'index.tpl.html')
en = render_page('en', 'index.en.tpl.html')
Path(D, 'index.html').write_text(out, encoding='utf-8')
Path(D, 'en').mkdir(exist_ok=True)
Path(D, 'en', 'index.html').write_text(en, encoding='utf-8')
Path(D, 'robots.txt').write_text(
    f'User-agent: *\nAllow: /\nSitemap: {SITE}sitemap.xml\n', encoding='utf-8'
)
Path(D, 'sitemap.xml').write_text(render_sitemap(), encoding='utf-8')
shutil.copy(Path(S, 'llms.txt'), Path(D, 'llms.txt'))

# bundle js
esb = os.environ.get('ESBUILD')
cmd = [esb] if esb else [shutil.which('node') or 'node', os.path.join(ROOT, 'node_modules', 'esbuild', 'bin', 'esbuild')]
subprocess.run(cmd + [S + '/main.js', '--bundle', '--minify', '--format=iife', '--target=es2019', '--legal-comments=none', '--outfile=' + D + '/app.js'], check=True)

# fonts
chars = set(out + en) | set(json.dumps(data, ensure_ascii=False)) | set(open(S + '/main.js', encoding='utf-8').read())
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
    used = f in out or f in en or f in ('icon.png', 'og.jpg', 'flare-loop.webp')
    if used: shutil.copy(S + '/img/' + f, D + '/img/' + f)
shutil.copy(B + '/coach.glb', D + '/coach.glb')
shutil.copytree(S + '/fonts/licenses', D + '/fonts/licenses', dirs_exist_ok=True)
tot = 0
for r, _, fs in os.walk(D):
    for f in fs: tot += os.path.getsize(os.path.join(r, f))
print('dist bytes', tot)
