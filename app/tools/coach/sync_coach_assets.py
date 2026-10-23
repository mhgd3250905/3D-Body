#!/usr/bin/env python3
"""从固定 SDK 及 Pose-Hub 提交同步 profile 和 flarelab 目录，并核验既有媒体。

用法：python tools/coach/sync_coach_assets.py SDK路径 --pose-hub PoseHub路径
SDK ref 从 pubspec.yaml 读取；Pose-Hub ref 可显式指定，不读取未提交素材。
"""
import json
import subprocess
import argparse
import hashlib
import re
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('sdk', type=Path)
parser.add_argument('--pose-hub', type=Path, required=True,
                    help='Authoritative Pose-Hub checkout; tracked catalog only')
parser.add_argument('--pose-hub-ref', default='36e1bb678047a3d5613a553a05be37dac8d9046b')
args = parser.parse_args()
sdk = args.sdk
app = Path(__file__).resolve().parents[2]
out = app / 'assets' / 'coach'
out.mkdir(parents=True, exist_ok=True)
sdk_ref = re.search(r'  ugk_coach:.*?ref: ([0-9a-f]{40})',
                    (app / 'pubspec.yaml').read_text(encoding='utf-8'), re.S).group(1)

def committed(repo, ref, path):
    # Read committed inputs even if a neighbouring checkout contains other work.
    return subprocess.check_output(['git', '-C', str(repo), 'show', f'{ref}:{path}'])

catalog_bytes = committed(args.pose_hub, args.pose_hub_ref, 'catalog/catalog.json')
catalog = json.loads(catalog_bytes)
profile = json.loads(committed(sdk, sdk_ref, 'profiles/flarelab.json'))
apps = set(profile['select'].get('apps', []))
catalog['drills'] = [d for d in catalog['drills'] if apps & set(d.get('apps', []))]
if isinstance(catalog.get('apps'), dict):
    catalog['apps'] = {k: v for k, v in catalog['apps'].items() if k in apps or k == 'pose-hub'}
sha = subprocess.check_output(['git', '-C', str(sdk), 'rev-parse', sdk_ref], text=True).strip()
hub_sha = subprocess.check_output(['git', '-C', str(args.pose_hub), 'rev-parse', args.pose_hub_ref], text=True).strip()
catalog.setdefault('source', {})
if isinstance(catalog['source'], dict):
    catalog['source']['flarelabSnapshot'] = {
        'sdkCommit': sha, 'poseHubCommit': hub_sha,
        'catalogSha256': hashlib.sha256(catalog_bytes).hexdigest(),
        'filter': {'apps': sorted(apps)},
    }

# An import must never silently point at a missing or different demonstration.
repo_root = Path(__file__).resolve().parents[3]
verified = 0
for drill in catalog['drills']:
    for kind in ('video', 'cover'):
        sources = drill.get('assets', {}).get(kind, {}).get('sources', [])
        source = next((s for s in sources if s.get('app') == 'flarelab'), None)
        if source is None:
            raise ValueError(f"Missing FlareLab {kind}: {drill['id']}")
        media = (repo_root / source['path']).resolve()
        if not media.is_relative_to((repo_root / 'app/assets').resolve()):
            raise ValueError('Media path outside App assets')
        if hashlib.sha256(media.read_bytes()).hexdigest() != source['sha256']:
            raise ValueError(f"Media hash mismatch: {drill['id']} {kind}")
        verified += 1

(out / 'catalog.json').write_text(json.dumps(catalog, ensure_ascii=False, indent=1) + '\n', encoding='utf-8', newline='\n')
(out / 'flarelab.json').write_text(json.dumps(profile, ensure_ascii=False, indent=1) + '\n', encoding='utf-8', newline='\n')
print(f"catalog {catalog['version']} drills={len(catalog['drills'])} media={verified} sdk={sha[:7]} poseHub={hub_sha[:7]} -> {out}")
