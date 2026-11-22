#!/usr/bin/env python3
"""Scan app/lib/ui for values that should come from the HipLab-mapped tokens.

Reports, per file: colour literals (Color(0x...)), font family literals,
and button/group radii or heights written as bare numbers that have a
FlareGeometry token. theme.dart and app_glass.dart are the token/material
owners and are reported separately. Advisory only; exit code is always 0.

    python3 tools/ui_token_scan.py            # summary
    python3 tools/ui_token_scan.py --detail   # every hit with its line
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1] / 'lib'
OWNERS = {'theme.dart', 'app_glass.dart'}
CHECKS = {
    'color': re.compile(r'Color\(0x[0-9a-fA-F]{8}\)'),
    'font': re.compile(r"fontFamily:\s*'[^']+'"),
    'radius': re.compile(r'Radius\.circular\((?:10|12|14)\)|BorderRadius\.circular\((?:10|12|14)\)'),
    'height50': re.compile(r'height:\s*(?:50|52|54)\b'),
}


def main() -> None:
    detail = '--detail' in sys.argv
    totals = {k: 0 for k in CHECKS}
    for path in sorted((ROOT / 'ui').rglob('*.dart')):
        lines = path.read_text(encoding='utf-8').splitlines()
        hits = {k: [] for k in CHECKS}
        for number, line in enumerate(lines, 1):
            if line.strip().startswith('//'):
                continue
            for key, pattern in CHECKS.items():
                if pattern.search(line):
                    hits[key].append((number, line.strip()))
        counts = {k: len(v) for k, v in hits.items()}
        if not any(counts.values()):
            continue
        owner = ' (token owner)' if path.name in OWNERS else ''
        print(f'{path.relative_to(ROOT)}{owner}: ' +
              ', '.join(f'{k}={v}' for k, v in counts.items() if v))
        if path.name not in OWNERS:
            for k, v in counts.items():
                totals[k] += v
        if detail:
            for key, rows in hits.items():
                for number, text in rows:
                    print(f'    {key} L{number}: {text[:100]}')
    print('outside token owners: ' +
          ', '.join(f'{k}={v}' for k, v in totals.items()))


if __name__ == '__main__':
    main()
