"""Localized public listing copy and crawl metadata for FlareLab."""
import json
from html import escape

SITE = "https://flare.uuugk.win/"
WEB_APP = "https://flare-app.uuugk.win/"
APP_STORE = "https://apps.apple.com/app/id6821186142"
PLAY_STORE = "https://play.google.com/store/apps/details?id=dev.mhgd.flare"
ALTERNATES = {"zh-CN": SITE, "en": SITE + "en/", "x-default": SITE}

LABELS_EN = {
    "deltoids": "Deltoids",
    "rotator-cuff": "Rotator cuff",
    "triceps": "Triceps",
    "forearms": "Forearm and wrist muscles",
    "serratus": "Serratus anterior",
    "scapular": "Middle and lower traps, rhomboids",
    "chest": "Pectoralis major",
    "lats": "Latissimus dorsi",
    "abs": "Rectus and transversus abdominis",
    "obliques": "Obliques",
    "erectors": "Spinal erectors",
    "hip-flexors": "Hip flexors",
    "glute-max": "Gluteus maximus",
    "hip-abductors": "Gluteus medius and hip abductors",
    "adductors": "Adductors",
    "quadriceps": "Quadriceps",
    "hamstrings": "Hamstrings",
}

COPY = {
    "zh-CN": {
        "name": "托马斯训练助手",
        "title": "托马斯训练助手 · FlareLab",
        "description": "托马斯训练助手（FlareLab）：3D 动作拆解、逐阶段肌群同步、三档针对训练与 AI 教练，把托马斯全旋变成看得见、量得出的学习阶梯。iOS 与 Android 已上架。",
        "intro": "托马斯全旋是霹雳舞与体操中以双手交替支撑、双腿绕身体连续画圈的动作。FlareLab 将一圈拆成八个阶段，用可旋转的 3D 模型展示支撑和换重心，并同步标出关联肌群。初学者可从三档针对训练开始，也可向 AI 教练询问练习方法。",
        "web_link": "也可以先试网页版 →",
        "alt": ("在 App Store 下载", "在 Google Play 上获取"),
        "faq": (
            ("在哪里下载？", f'可在 <a href="{APP_STORE}">App Store</a> 和 <a href="{PLAY_STORE}">Google Play</a> 搜索「托马斯训练助手」或 FlareLab，也可以直接使用<a href="{WEB_APP}">网页版</a>。'),
            ("免费吗？", "基础动作分解与部分训练可免费使用。Flare Premium 提供 AI 教练、自定义训练计划等功能，订阅条款以 App 内商店页面为准。"),
            ("零基础能练吗？", "可以。App 把托马斯拆成阶段，按三档针对训练从基础力量、活动度和支撑开始。"),
            ("和看视频学有什么不同？", "3D 模型可任意角度暂停查看每个阶段，并同步显示该阶段发力肌群，还能随时问 AI 教练。"),
            ("需要联网吗？", "内置的 3D 动作分解可离线使用。训练视频首次播放需要下载，在线 AI 教练需要联网。"),
        ),
    },
    "en": {
        "name": "FlareLab",
        "title": "FlareLab – Thomas Flare Trainer",
        "description": "Learn the Thomas flare with interactive 3D breakdowns, phase-by-phase muscle maps, three levels of targeted drills, and an AI coach. Available on iOS and Android.",
        "intro": "The Thomas flare is a breaking and gymnastics move where you alternate hand support as your legs circle your body. FlareLab breaks one full rotation into eight phases. You can pause the 3D model and rotate it to see each hand placement and weight shift from different angles. The muscle map highlights the muscles involved at each phase. Three levels of drills help beginners build strength, mobility, and support. You can also ask the AI coach about a phase or how to practice it.",
        "web_link": "Try the web app first →",
        "alt": ("Download on the App Store", "Get it on Google Play"),
        "faq": (
            ("Where can I download it?", f'Search for FlareLab or 托马斯训练助手 on the <a href="{APP_STORE}">App Store</a> and <a href="{PLAY_STORE}">Google Play</a>, or try the <a href="{WEB_APP}">web app</a>.'),
            ("Is it free?", "Basic movement breakdowns and some training are free. Flare Premium includes the AI coach, custom training plans, and other features. See the in-app store for subscription terms."),
            ("Can I start as a complete beginner?", "Yes. The app breaks the flare into phases and offers three levels of drills, starting with basic strength, mobility, and support."),
            ("How is this different from learning from a video?", "Pause and rotate the 3D model to inspect each phase from any angle, with the active muscles highlighted for that phase. You can also ask the AI coach a question at any point."),
            ("Does it need an internet connection?", "The built-in 3D breakdown works offline. Exercise videos need to download on first use, and the online AI coach needs a connection."),
        ),
    },
}


def render_seo(lang):
    copy = COPY[lang]
    site_url = ALTERNATES[lang]
    organization_id = SITE + "#organization"
    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "MobileApplication",
                "@id": site_url + "#app",
                "name": copy["name"],
                "alternateName": "FlareLab" if lang == "zh-CN" else "托马斯训练助手",
                "description": copy["description"],
                "url": site_url,
                "inLanguage": lang,
                "operatingSystem": ["iOS", "Android"],
                "applicationCategory": "HealthApplication",
                "installUrl": [APP_STORE, PLAY_STORE],
                "sameAs": [APP_STORE, PLAY_STORE],
                "publisher": {"@id": organization_id},
            },
            {
                "@type": "FAQPage",
                "@id": site_url + "#faq",
                "inLanguage": lang,
                "mainEntity": [
                    {"@type": "Question", "name": question,
                     "acceptedAnswer": {"@type": "Answer", "text": answer}}
                    for question, answer in copy["faq"]
                ],
            },
            {"@type": "Organization", "@id": organization_id, "name": "UGK", "url": SITE},
        ],
    }
    alternate_links = [
        f'<link rel="alternate" hreflang="{locale}" href="{url}">'
        for locale, url in ALTERNATES.items()
    ]
    title = escape(copy["title"])
    description = escape(copy["description"])
    return "\n".join([
        f"<title>{title}</title>",
        f'<meta name="description" content="{description}">',
        f'<link rel="canonical" href="{site_url}">',
        *alternate_links,
        '<meta property="og:type" content="website">',
        f'<meta property="og:title" content="{title}">',
        f'<meta property="og:description" content="{description}">',
        f'<meta property="og:url" content="{site_url}">',
        f'<meta property="og:image" content="{SITE}img/og.jpg">',
        '<meta name="twitter:card" content="summary_large_image">',
        '<script type="application/ld+json">',
        json.dumps(schema, ensure_ascii=False, indent=2).replace("<", "\\u003c"),
        "</script>",
    ])


def render_faq(lang):
    return "\n".join(
        f'<details data-reveal{" open" if i == 1 else ""}><summary><span class="mono">Q{i}</span>'
        f'<span class="q">{escape(question)}</span><span class="pl"></span></summary>'
        f'<div class="a">{answer}</div></details>'
        for i, (question, answer) in enumerate(COPY[lang]["faq"], 1)
    )


def render_badges(lang, badge_assets):
    copy = COPY[lang]
    links = [
        f'<a href="{url}"><img src="/img/{image}" alt="{escape(alt)}" height="48"></a>'
        for url, image, alt in zip((APP_STORE, PLAY_STORE), badge_assets, copy["alt"])
    ]
    return (
        '<div class="store-links"><div class="store-badges">' + "".join(links) + "</div>"
        f'<a class="web-link" href="{WEB_APP}">{escape(copy["web_link"])}</a></div>'
    )


def render_sitemap():
    rows = []
    for url in (SITE, SITE + "en/"):
        links = "\n".join(
            f'    <xhtml:link rel="alternate" hreflang="{lang}" href="{alternate}"/>'
            for lang, alternate in ALTERNATES.items()
        )
        rows.append(f"  <url>\n    <loc>{url}</loc>\n{links}\n  </url>")
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
        'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
        + "\n".join(rows) + "\n</urlset>\n"
    )
