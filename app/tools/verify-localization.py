"""Validate bundled localization sources; no network or file mutation."""
import json
import re
from pathlib import Path

APP = Path(__file__).resolve().parents[1]
LOCALES = ['zh', 'zh_Hant', 'en', 'es', 'pt', 'fr', 'de', 'it', 'ru', 'ja', 'ko', 'ar', 'hi', 'id']

def read(path):
    return json.loads(path.read_text(encoding='utf-8'))

arb = read(APP / 'lib/l10n/app_zh.arb')
content = read(APP / 'assets/l10n/content_zh.json')
failures = []
source_words = set()
def collect(value):
    if isinstance(value, str) and re.search(r'[\u3400-\u9fff]', value):
        source_words.add(value)
    elif isinstance(value, list):
        for item in value: collect(item)
    elif isinstance(value, dict):
        for item in value.values(): collect(item)
for filename in ['phase-muscles.json', 'drills.json', 'course-stages.json', 'source-manifest.json']:
    collect(read(APP / f'assets/data/{filename}'))
source_words.update(re.findall(r"'([^']*[\u3400-\u9fff][^']*)'", (APP / 'lib/data/muscle_knowledge.dart').read_text(encoding='utf-8')))
if set(content) != source_words:
    failures.append('Chinese content template differs from original catalog/knowledge sources')
for code in LOCALES:
    ui = read(APP / f'lib/l10n/app_{code}.arb')
    words = read(APP / f'assets/l10n/content_{code}.json')
    if set(ui) != set(arb) or set(words) != set(content):
        failures.append(f'{code}: key coverage')
    if ui.get('@@locale') != code:
        failures.append(f'{code}: locale code')
    for key, value in arb.items():
        if key.startswith('@') and key != '@@locale' and ui.get(key) != value:
            failures.append(f'{code}: metadata {key}')
        if not key.startswith('@'):
            if not ui.get(key, '').strip():
                failures.append(f'{code}: empty UI {key}')
            expected = re.findall(r'\{([a-zA-Z][a-zA-Z0-9_]*)[},]', value)
            actual = re.findall(r'\{([a-zA-Z][a-zA-Z0-9_]*)[},]', ui.get(key, ''))
            if sorted(expected) != sorted(actual):
                failures.append(f'{code}: placeholder {key}')
    for key, original in content.items():
        value = words.get(key, '')
        if not value.strip():
            failures.append(f'{code}: empty content')
        if re.findall(r'\d+(?:\.\d+)?', original) != re.findall(r'\d+(?:\.\d+)?', value):
            failures.append(f'{code}: changed numeric tokens: {key!a}')
print(json.dumps({'locales': len(LOCALES), 'uiKeys': sum(not k.startswith('@') for k in arb), 'contentKeys': len(content), 'failures': failures}, indent=2))
raise SystemExit(bool(failures))
