# FlareLab website v2 — page copy (zh / en) and HTML generator.
# build.py imports render(lang) and writes dist/index.html and dist/en/index.html.
import html, json, os

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = json.load(open(os.path.join(HERE, 'flare-data.json'), encoding='utf-8'))
DRILLS = json.load(open(os.path.join(HERE, 'drills.json'), encoding='utf-8'))
PH_EN = ['Rear support', 'First transfer', 'First side support', 'First leg pass', 'Front support', 'Second transfer', 'Second side support', 'Second leg pass']
PH_EN_D = ['Legs swing past the front', 'Weight onto one hand', 'One-arm support, high V', 'Scissor legs to the front', 'Hands behind, chest up', 'Switch hands', 'One-arm support, high V', 'Sweep back, catch the next loop']
MAIL = 'mhgd3250905@gmail.com'
MAIL2 = '294851575@qq.com'
SITE = 'https://flare.uuugk.win'

C = {
 'zh': dict(
  lang='zh-CN', title='托马斯训练助手 FlareLab｜用 3D 教练学托马斯全旋的训练 App',
  desc='托马斯训练助手（FlareLab）是一款用 3D 教练学托马斯全旋的训练 App：8 个动作阶段逐帧拆解，17 块肌群随动作高亮，51 个 A/B/C 分级训练，成套计划与训练记录。iOS 与 Android 内测免费报名。',
  nav=[('#features', '功能'), ('#how', '使用方法'), ('#faq', '常见问题')], other=('/en/', 'EN', 'English'),
  cta='报名内测', kicker='iOS · Android 内测中', h1='托马斯训练助手', brand2='FlareLab',
  lead='用 3D 教练学托马斯全旋的训练 App',
  sub='8 个动作阶段逐帧拆解，17 块肌群随动作高亮，51 个分级训练按徒手、家用器械、健身房分三档，另有成套计划和训练记录。',
  cta2='看功能介绍', note='内测免费 · iOS 用 TestFlight · Android 用 Google Play 内部测试',
  livek='实时 3D · 可拖动旋转', live0='03/08 · 第一侧支撑', poster_alt='3D 教练在舞台上做托马斯全旋',
  stats=[('8', '动作阶段'), ('17', '肌群'), ('51', '分级训练'), ('14', '种界面语言')],
  strip=[('05-muscles-sheet', '阶段肌群'), ('09-drill-detail', '训练详情'), ('t4-records', '训练记录')],
  f1=dict(h='8 个阶段逐帧拆解', p='App 把一圈托马斯分成 8 个阶段。拖动时间轴或点阶段编号，教练就停在那一帧；单指拖动可以从任意角度看支撑手和腿的位置。',
          li=['拖动时间轴逐帧查看', '0.25× / 0.5× / 1× 三档速度', '360° 拖动换视角', '7 种教练形象可选']),
  f2=dict(h='17 块肌群实时高亮', p='每个阶段列出这一刻的主要发力肌群和协同肌群，并按支撑手区分左右。点开任一肌群，可以看到它在这个阶段的作用、观察要点和对应训练。',
          li=['支撑 8 块：三角肌、肩袖、肱三头肌等', '核心 4 块：腹直肌、腹斜肌、竖脊肌、髋屈肌', '腿部 5 块：臀大肌、臀中肌、内收肌等', '从肌群一键进入对应训练'],
          cap=['阶段肌群列表', '肌群详情']),
  f3=dict(h='51 个分级训练（A/B/C 三档）', p='17 块肌群各配 3 个训练：A 徒手、B 家用器械、C 健身房。每个训练都有 3D 动作演示、组数次数、动作要点、常见错误和安全提示，可按器械和肌群筛选。',
          li=['A 徒手 · B 家用器械 · C 健身房', '3D 演示，可慢放', '组数、次数与动作要点', '常见错误与安全提示'], cap=['训练库', '训练详情'], more='训练库部分动作'),
  f4=dict(h='成套计划与自建计划', p='直接用现成的成套训练，比如热身激活、肩臂支撑、托马斯全链；也可以从训练库挑动作组成自己的计划。还可以用一句话说明场地和时长，让 AI 排一份计划。',
          li=['成套训练按无器械 / 居家 / 健身房分组', '自建计划：自选动作和顺序', 'AI 定制：说出场地和时长生成计划'], cap=['计划', '托马斯全链']),
  f5=dict(h='训练记录与里程碑', p='每次训练自动记录。记录页显示连续训练天数、累计次数、累计分钟和训练天数，以及本周打卡和近 16 周热力图；连续训练 3、7、14 天解锁里程碑。',
          li=['连续天数与累计数据', '本周打卡 + 近 16 周热力图', '3 / 7 / 14 天里程碑'], cap=['训练记录']),
  how_h='4 步开始训练', how=[('下载', '报名后收到邀请，通过 TestFlight（iOS）或 Google Play 内部测试（Android）安装。'),
                          ('选阶段', '在首页选你卡住的阶段，看教练演示和这一刻的发力肌群。'),
                          ('跟练', '从肌群进入对应训练，或直接开始一套成套计划，按组数跟练。'),
                          ('记录', '练完自动保存，在记录页查看连续天数、热力图和里程碑。')],
  faq_h='常见问题', faq=[
   ('收费吗？', '内测期间免费。'),
   ('支持哪些设备？', 'iPhone 通过 TestFlight 安装，Android 手机通过 Google Play 内部测试安装。'),
   ('怎么加入内测？', f'发邮件到 {MAIL}，写明手机系统和用于测试的账号邮箱（iOS 填 Apple ID 邮箱，Android 填 Google 账号邮箱）。我们把邀请发到这个邮箱，按邮件里的链接安装即可。'),
   ('需要联网吗？', '3D 演示和训练内容可以离线使用。'),
   ('支持哪些语言？', '简体中文、繁体中文、英语、日语、韩语、西班牙语等 14 种界面语言。'),
   ('训练内容安全吗？', '训练是教学建议，不是医疗处方，剂量按初中级 breaker 保守设置。每个训练都附安全提示，出现疼痛或麻木请立即停止。')],
  join_h='报名 iOS / Android 内测', join_p='内测免费。发邮件告诉我们手机系统和测试账号邮箱，我们会把安装邀请发给你。',
  join_b=[('iOS 报名（TestFlight）', '托马斯训练助手 内测报名 iOS'), ('Android 报名（Google Play）', '托马斯训练助手 内测报名 Android')],
  join_m=f'报名邮箱：{MAIL} · {MAIL2}', foot='托马斯训练助手 · FlareLab', drag='可拖动旋转',
 ),
 'en': dict(
  lang='en', title='FlareLab — learn the Thomas flare with a 3D coach',
  desc='FlareLab (托马斯训练助手) is a training app that teaches the Thomas flare with a 3D coach: 8 phases frame by frame, 17 muscle groups highlighted as the move plays, 51 drills in three levels, ready-made plans and a training log. Free beta on iOS and Android.',
  nav=[('#features', 'Features'), ('#how', 'How it works'), ('#faq', 'FAQ')], other=('/', '中文', '中文'),
  cta='Join the beta', kicker='Beta on iOS · Android', h1='FlareLab', brand2='托马斯训练助手 · Thomas Flare Trainer',
  lead='The training app that teaches the Thomas flare with a 3D coach',
  sub='Eight phases broken down frame by frame, 17 muscle groups highlighted as the move plays, and 51 drills in three levels — bodyweight, home gear and gym — plus training plans and a log.',
  cta2='See the features', note='Free during beta · iOS via TestFlight · Android via Google Play internal testing',
  livek='Live 3D · drag to rotate', live0='03/08 · First side support', poster_alt='3D coach performing a Thomas flare on a lit stage',
  stats=[('8', 'phases'), ('17', 'muscle groups'), ('51', 'drills'), ('14', 'app languages')],
  strip=[('05-muscles-sheet', 'Muscles per phase'), ('09-drill-detail', 'Drill detail'), ('t4-records', 'Training log')],
  f1=dict(h='8 phases, frame by frame', p='FlareLab splits one flare loop into eight phases. Drag the timeline or tap a phase number and the coach freezes on that frame; drag with one finger to see the hands and legs from any angle.',
          li=['Scrub the timeline frame by frame', '0.25× / 0.5× / 1× playback', 'Rotate the view 360°', '7 coach looks to choose from']),
  f2=dict(h='17 muscle groups, highlighted live', p='For every phase the app lists the prime movers and the supporting muscles, split left and right by support hand. Tap a group to see what it does in that phase, what to watch for, and which drills train it.',
          li=['Support (8): deltoids, rotator cuff, triceps…', 'Core (4): abs, obliques, erectors, hip flexors', 'Legs (5): glutes, hip abductors, adductors…', 'Jump straight from a muscle to its drills'],
          cap=['Muscles in this phase', 'Muscle detail']),
  f3=dict(h='51 drills in three levels (A/B/C)', p='Each of the 17 muscle groups has three drills: A bodyweight, B home equipment, C gym. Every drill comes with a 3D demo, sets and reps, form cues, common mistakes and a safety note, and you can filter by equipment or muscle.',
          li=['A bodyweight · B home gear · C gym', '3D demo with slow motion', 'Sets, reps and form cues', 'Common mistakes and safety notes'], cap=['Drill library', 'Drill detail'], more='A few drills from the library'),
  f4=dict(h='Ready-made and custom plans', p='Start a ready-made session — warm-up activation, shoulder and arm support, the full flare chain — or build your own plan from the drill library. You can also describe your space and time in one sentence and let AI put a plan together.',
          li=['Sessions for no equipment, home or gym', 'Custom plans: your drills, your order', 'AI plans from your space and time'], cap=['Plans', 'Full flare chain']),
  f5=dict(h='Training log and milestones', p='Every session is saved automatically. The log shows your current streak, total sessions, total minutes and training days, this week at a glance and a 16-week heatmap. Streaks of 3, 7 and 14 days unlock milestones.',
          li=['Streak and running totals', 'This week + 16-week heatmap', '3 / 7 / 14-day milestones'], cap=['Training log']),
  how_h='Start training in 4 steps', how=[('Install', 'After you sign up you get an invite: install via TestFlight on iOS or Google Play internal testing on Android.'),
                          ('Pick a phase', 'On the home screen, pick the phase you are stuck on and watch the coach and the muscles working in it.'),
                          ('Train', 'Open the drills for that muscle group, or start a ready-made plan, and follow the sets.'),
                          ('Track', 'Sessions save automatically; check your streak, heatmap and milestones in the log.')],
  faq_h='FAQ', faq=[
   ('Is it free?', 'Yes, the app is free during the beta.'),
   ('Which devices are supported?', 'iPhone via TestFlight and Android phones via Google Play internal testing.'),
   ('How do I join the beta?', f'Email {MAIL} with your phone platform and the account email you will test with (your Apple ID for iOS, your Google account for Android). We send the invite to that address — just follow the link in it.'),
   ('Does it need an internet connection?', 'The 3D demos and drill content work offline.'),
   ('Which languages does the app support?', '14, including English, Simplified and Traditional Chinese, Japanese, Korean and Spanish.'),
   ('Is the training safe?', 'Drills are coaching advice, not medical prescriptions, with conservative volumes for beginner-to-intermediate breakers. Every drill has a safety note; stop if you feel pain or numbness.')],
  join_h='Join the iOS / Android beta', join_p='The beta is free. Email us your phone platform and test account email and we will send you an install invite.',
  join_b=[('Sign up for iOS (TestFlight)', 'FlareLab beta signup iOS'), ('Sign up for Android (Google Play)', 'FlareLab beta signup Android')],
  join_m=f'Sign-up email: {MAIL} · {MAIL2}', foot='FlareLab · 托马斯训练助手', drag='Drag to rotate',
 ),
}

def e(s): return html.escape(s, quote=True)

def phone(shot, alt, cls='', eager=False):
    lz = '' if eager else ' loading="lazy"'
    return (f'<figure class="phone {cls}"><img src="/img/ui-{shot}-360.webp" srcset="/img/ui-{shot}-360.webp 360w, /img/ui-{shot}-640.webp 640w" '
            f'sizes="(max-width:760px) 62vw, 300px" width="360" height="780" alt="{e(alt)}" decoding="async"{lz}></figure>')

def ul(items): return '<ul class="ticks">' + ''.join(f'<li>{e(i)}</li>' for i in items) + '</ul>'

def feature(n, f, visual, flip=False, id_=''):
    idattr = f' id="{id_}"' if id_ else ''
    return (f'<section class="feat{" flip" if flip else ""}"{idattr}><div class="feat-copy" data-reveal><div class="num mono">{n:02d}</div>'
            f'<h2>{e(f["h"])}</h2><p class="body">{e(f["p"])}</p>{ul(f["li"])}</div><div class="feat-vis" data-reveal>{visual}</div></section>')

def render(lang):
    c = C[lang]; zh = lang == 'zh'
    mail = lambda subj: f'mailto:{MAIL}?subject={html.escape(subj)}'
    navl = ''.join(f'<a class="l" href="{h}">{e(t)}</a>' for h, t in c['nav'])
    stats = ''.join(f'<div><b class="disp">{n}</b><span>{e(t)}</span></div>' for n, t in c['stats'])
    strip = ''.join(phone(s, a, f'sp{i}', eager=True) + '' for i, (s, a) in enumerate(c['strip']))
    strip_caps = ''.join(f'<span>{e(a)}</span>' for s, a in c['strip'])
    # phases grid
    ph = ''
    for i, p in enumerate(DATA['phases']):
        name = p['name'] if zh else PH_EN[i]; det = p['detail'] if zh else PH_EN_D[i]
        ph += (f'<div class="ph"><img src="/img/ph{i+1}-480.webp" width="480" height="480" loading="lazy" decoding="async" alt="{e(name)}">'
               f'<div class="n disp">{i+1:02d}</div><div class="t"><b>{e(name)}</b><span>{e(det)}</span></div></div>')
    v1 = f'<div class="phases">{ph}</div>'
    v2 = f'<div class="duo">{phone("05-muscles-sheet", c["f2"]["cap"][0])}{phone("06-muscle-detail", c["f2"]["cap"][1], "lo")}</div>'
    # drill thumbnails: one per muscle group, alternating tiers
    thumbs = ''
    for k, (gid, tiers) in enumerate(list(DRILLS['drills'].items())[:12]):
        t = 'ABC'[k % 3]; d = tiers[t]; nm = d['name'] if zh else d.get('nameEn', d['name'])
        thumbs += f'<div class="dt"><img src="/img/d-{gid}-{t}.webp" width="360" height="360" loading="lazy" decoding="async" alt="{e(nm)}"><p><i>{t}</i>{e(nm)}</p></div>'
    v3 = f'<div class="duo">{phone("08-library", c["f3"]["cap"][0])}{phone("09-drill-detail", c["f3"]["cap"][1], "lo")}</div>'
    v4 = f'<div class="duo">{phone("10-plans", c["f4"]["cap"][0])}{phone("11-preset-detail", c["f4"]["cap"][1], "lo")}</div>'
    v5 = f'<div class="duo one">{phone("t4-records", c["f5"]["cap"][0])}</div>'
    how = ''.join(f'<li data-reveal><span class="disp">{i+1:02d}</span><b>{e(t)}</b><p>{e(p)}</p></li>' for i, (t, p) in enumerate(c['how']))
    faq = ''.join(f'<details{" open" if i == 0 else ""}><summary>{e(q)}</summary><p>{e(a)}</p></details>' for i, (q, a) in enumerate(c['faq']))
    joinb = ''.join(f'<a class="btn{"" if i == 0 else " alt"}" href="{mail(s)}">{e(t)}</a>' for i, (t, s) in enumerate(c['join_b']))
    other_href, other_short, other_long = c['other']
    canon = SITE + ('/' if zh else '/en/')
    return f'''<!doctype html>
<html lang="{c['lang']}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{e(c['title'])}</title>
<meta name="description" content="{e(c['desc'])}">
<meta name="theme-color" content="#09090b">
<link rel="canonical" href="{canon}">
<link rel="alternate" hreflang="zh-CN" href="{SITE}/"><link rel="alternate" hreflang="en" href="{SITE}/en/">
<meta property="og:title" content="{e(c['title'])}"><meta property="og:description" content="{e(c['desc'])}">
<meta property="og:image" content="{SITE}/img/og.jpg"><meta property="og:type" content="website">
<link rel="icon" href="/img/icon.png">
<link rel="preload" href="/fonts/nsc-900.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" as="image" href="/img/hero-1440.webp" imagesrcset="/img/hero-960.webp 960w, /img/hero-1440.webp 1440w" imagesizes="100vw">
<link rel="stylesheet" href="/site.css">
</head>
<body>
<nav id="nav"><a class="brand" href="{'/' if zh else '/en/'}"><img src="/img/icon.png" width="34" height="34" alt=""><span><b>{e(C['zh']['h1'])}</b><i>FlareLab</i></span></a>
<div class="links">{navl}<a class="lang" href="{other_href}" hreflang="{'en' if zh else 'zh-CN'}" aria-label="{e(other_long)}">{e(other_short)}</a><a class="btn sm" href="#join">{e(c['cta'])}</a></div></nav>

<header class="hero">
  <div class="hero-stage" id="hero-stage" role="img" aria-label="{e(c['poster_alt'])}">
    <img class="poster" src="/img/hero-1440.webp" srcset="/img/hero-960.webp 960w, /img/hero-1440.webp 1440w" sizes="100vw" width="1440" height="900" alt="" fetchpriority="high">
    <img class="loopimg" data-src="/img/flare-loop.webp" alt="">
    <canvas id="gl"></canvas>
  </div>
  <div class="hero-copy">
    <div class="kicker mono"><i></i>{e(c['kicker'])}</div>
    <div class="brand2 disp">{e(c['brand2'])}</div>
    <h1>{e(c['h1'])}</h1>
    <p class="lead">{e(c['lead'])}</p>
    <p class="sub">{e(c['sub'])}</p>
    <div class="cta"><a class="btn" href="#join">{e(c['cta'])}</a><a class="ghost" href="#features">{e(c['cta2'])}</a></div>
    <p class="note">{e(c['note'])}</p>
  </div>
  <div class="live"><div class="mono">{e(c['livek'])}</div><b id="hero-live">{e(c['live0'])}</b></div>
</header>

<div class="stats">{stats}</div>

<section class="strip" aria-label="App">
  <div class="strip-row">{strip}</div>
  <div class="strip-caps mono">{strip_caps}</div>
</section>

<div id="features">
{feature(1, c['f1'], v1)}
{feature(2, c['f2'], v2, flip=True)}
{feature(3, c['f3'], v3)}
<div class="drills" data-reveal><div class="mono dl">{e(c['f3']['more'])}</div><div class="drow">{thumbs}</div></div>
{feature(4, c['f4'], v4, flip=True)}
{feature(5, c['f5'], v5)}
</div>

<section class="how" id="how"><h2>{e(c['how_h'])}</h2><ol>{how}</ol></section>

<section class="faq" id="faq"><h2>{e(c['faq_h'])}</h2><div class="qa">{faq}</div></section>

<section class="join" id="join">
  <div class="join-in" data-reveal>
    <img class="join-icon" src="/img/icon.png" width="72" height="72" alt="">
    <h2>{e(c['join_h'])}</h2>
    <p class="body">{e(c['join_p'])}</p>
    <div class="cta">{joinb}</div>
    <p class="note">{e(c['join_m'])}</p>
  </div>
</section>

<footer><span>© 2026 {e(c['foot'])}</span><span class="fl"><a href="/" hreflang="zh-CN"{' aria-current="page"' if zh else ''}>中文</a> · <a href="/en/" hreflang="en"{'' if zh else ' aria-current="page"'}>English</a> · <a href="mailto:{MAIL}">{MAIL}</a></span></footer>
<script src="/app.js" defer></script>
</body>
</html>
'''
