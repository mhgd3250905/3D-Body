from pathlib import Path
import csv
import html
import json
import re
import markdown

ROOT = Path(__file__).resolve().parent
catalog = json.loads((ROOT / 'catalog-extract.json').read_text(encoding='utf-8'))
names = {row['id']: row['nameZh'] for row in catalog}
parts = [
    ('overview', '总评与调整原则', 'audit-overview.md'),
    ('angles', '21 套角度计划', 'angle-audit.md'),
    ('muscles', '51 套肌群计划', 'muscle-audit.md'),
    ('execution', '计数与时长核验', 'execution-audit.md'),
]

overview = (ROOT / 'audit-overview.md').read_text(encoding='utf-8')
candidate_block = overview.split('## 动作库新增候选', 1)[1].split('这些候选', 1)[0]
candidate_rows = []
for line in candidate_block.splitlines():
    if line.startswith('| P') or line.startswith('| 待核对'):
        candidate_rows.append([x.strip().replace('`', '') for x in line.strip('|').split('|')])
with (ROOT / 'missing-action-candidates.csv').open('w', encoding='utf-8-sig', newline='') as f:
    writer = csv.writer(f, lineterminator='\n')
    writer.writerow(['优先级', '候选动作或动作族', '用途', '现有动作与差别', '起始剂量草案（待试训）'])
    writer.writerows(candidate_rows)

source_texts = []
rendered = []
for key, title, filename in parts:
    text = (ROOT / filename).read_text(encoding='utf-8')
    source_texts.append(text)
    content = markdown.markdown(text, extensions=['tables', 'fenced_code', 'sane_lists'])
    def code_name(match):
        action_id = html.unescape(match.group(1))
        if action_id not in names:
            return match.group(0)
        name = html.escape(names[action_id])
        if key == 'muscles':
            return f'<span class="action">{name} <code>{html.escape(action_id)}</code></span>'
        return f'<code title="{name}">{html.escape(action_id)}</code>'
    content = re.sub(r'<code>([^<]+)</code>', code_name, content)
    content = content.replace('<table>', '<div class="table-wrap"><table>').replace('</table>', '</table></div>')
    rendered.append(f'<section class="pane" id="{key}" aria-label="{title}">{content}</section>')

css = '''
:root{--ink:#182a2a;--muted:#637171;--accent:#186b5c;--line:#dce5df;--paper:#fff;--bg:#f3f5ef}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.8 "Segoe UI","Microsoft YaHei",sans-serif}
.shell{max-width:1280px;margin:auto;padding:40px 30px 70px}.eyebrow{letter-spacing:.15em;font-size:12px;font-weight:700;color:var(--accent)}
header h1{font-size:clamp(28px,4vw,44px);line-height:1.25;margin:12px 0}header p{color:var(--muted);margin:8px 0}
.stats{display:flex;gap:12px;flex-wrap:wrap;margin:22px 0}.stats span{background:var(--paper);border:1px solid var(--line);padding:10px 18px;border-radius:12px}.stats b{font-size:23px;margin-right:7px;color:var(--accent)}
nav{position:sticky;top:0;z-index:2;background:rgba(243,245,239,.98);padding:12px 0;display:flex;gap:8px;flex-wrap:wrap;border-bottom:1px solid var(--line);margin-bottom:20px}
nav a,.download{padding:9px 15px;border-radius:9px;font-size:14px;text-decoration:none;color:var(--ink);border:1px solid var(--line);background:#fff}
nav a[aria-current=true]{background:var(--accent);border-color:var(--accent);color:#fff}
.pane{background:var(--paper);padding:30px;border:1px solid var(--line);border-radius:16px;margin-bottom:24px;scroll-margin-top:130px}
.js .pane:not(.active){display:none}.pane h1{font-size:25px;line-height:1.4;margin:0 0 16px}.pane h2{font-size:23px;margin:34px 0 15px;border-bottom:2px solid #e8eee8;padding-bottom:9px}.pane h3{font-size:19px;margin:26px 0 12px}
p{margin:12px 0}strong{color:#123e36}a{color:#176a76;text-underline-offset:3px}.table-wrap{overflow-x:auto;margin:18px 0 27px}table{border-collapse:collapse;width:100%;font-size:14px;line-height:1.75;min-width:710px}th{text-align:left;background:#edf3ee;color:#30544d;font-weight:700}th,td{padding:13px 14px;border:1px solid var(--line);vertical-align:top}tr:nth-child(even) td{background:#fafbf8}td:first-child{min-width:110px}#muscles td:first-child{width:155px}#angles td:first-child{width:155px}#muscles td:nth-child(2){width:34%}
code{font:12px/1.5 Consolas,monospace;overflow-wrap:anywhere;color:#4e6863;background:#eef3ef;border-radius:4px;padding:2px 4px}.action code{font-size:10px;display:inline;color:#78857f;background:transparent}.action{color:#205c50}blockquote{border-left:3px solid var(--accent);margin-left:0;padding-left:18px;color:var(--muted)}li{margin:7px 0}.files{display:flex;gap:8px;flex-wrap:wrap;margin:20px 0}.note{font-size:13px;color:var(--muted)}
@media(max-width:650px){.shell{padding:22px 12px 40px}.pane{padding:18px 14px}.stats{gap:7px}.stats span{padding:7px 10px}.stats b{font-size:20px}nav{gap:6px}nav a{padding:7px 9px;font-size:12px}.pane h2{font-size:20px}body{font-size:15px}}
@media print{body{background:#fff}.shell{padding:0;max-width:none}nav,.files{display:none!important}.js .pane:not(.active){display:block}.pane{border:none;padding:0;page-break-before:always}.pane:first-of-type{page-break-before:auto}.table-wrap{overflow:visible}table{min-width:0;font-size:10px}th,td{padding:7px}header h1{font-size:30px}a{color:inherit}}
'''
nav = ''.join(f'<a href="#{key}">{title}</a>' for key, title, _ in parts)
script = '''
document.documentElement.classList.add('js');
function selectPane(){
 const id=location.hash.slice(1)||'overview';
 const target=document.getElementById(id)||document.getElementById('overview');
 document.querySelectorAll('.pane').forEach(p=>p.classList.toggle('active',p===target));
 document.querySelectorAll('nav a').forEach(a=>a.setAttribute('aria-current',a.hash==='#'+target.id?'true':'false'));
}
window.addEventListener('hashchange',selectPane);selectPane();
'''
doc = f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Flare 训练计划审核 · 2026-11-17</title><style>{css}</style></head><body><main class="shell">
<header><div class="eyebrow">FLARE / TRAINING PLAN REVIEW</div><h1>把训练目标、动作与剂量对齐</h1><p>角度与肌群训练计划审核 · 2026 年 11 月 17 日</p><p class="note">源码 b461a0d · 候选处方供修订与试训 · 未修改产品计划</p></header>
<div class="stats"><span><b>72</b>套计划</span><span><b>8</b>个角度</span><span><b>17</b>个肌群</span><span><b>248</b>个可用动作</span><span><b>216</b>份场景排程核算</span></div>
<div class="files"><a class="download" href="training-plan-audit.md">下载完整 Markdown</a><a class="download" href="missing-action-candidates.csv">新增动作候选 CSV</a><a class="download" href="duration-comparison.csv">全部时长对照 CSV</a><a class="download" href="execution-issues.csv">执行问题与待核对项 CSV</a></div>
<nav aria-label="报告章节">{nav}</nav>{''.join(rendered)}
<p class="note">资料来自当前计划、固定动作目录与执行适配器。外部研究链接列在相关结论旁；具体组次是待试训建议。原始导出和分项报告与本页保存在同一目录。</p>
</main><script>{script}</script></body></html>'''
(ROOT / 'training-plan-audit.html').write_text(doc, encoding='utf-8', newline='\n')
(ROOT / 'training-plan-audit.md').write_text('\n\n---\n\n'.join(source_texts).rstrip() + '\n', encoding='utf-8', newline='\n')

assert len(candidate_rows) == 9
plan_data = json.loads((ROOT.parents[2] / 'assets/data/flare-plans.json').read_text(encoding='utf-8'))
expected = {p['id'] for p in plan_data['plans']}
plan_rows = set()
for filename in ['angle-audit.md', 'muscle-audit.md']:
    for line in (ROOT / filename).read_text(encoding='utf-8').splitlines():
        if line.startswith('| '):
            hit = re.match(r'\|\s*`?((?:angle-\d+|muscle-[a-z-]+)-t[123])', line)
            if hit:
                plan_rows.add(hit.group(1))
assert plan_rows == expected, f'Missing or unexpected plan rows: {plan_rows ^ expected}'
assert len(names) == 248
assert all((ROOT / filename).exists() for _, _, filename in parts)
with (ROOT / 'duration-comparison.csv').open(encoding='utf-8-sig') as f:
    assert len(list(csv.DictReader(f))) == 216
print(json.dumps({'plan_rows_verified':len(plan_rows),'action_catalog':len(names),'candidate_families':len(candidate_rows),'html_bytes':len(doc.encode('utf-8')),'output':str(ROOT / 'training-plan-audit.html')},ensure_ascii=False))
