"""Publish two R17 assets from an allowed direct output batch into this viewer."""
from __future__ import annotations
import argparse
import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import struct

EXPECTED_VIEWER = Path('E:/AII-MotionLab/reference-viewer-20261017/r17-preview')
EXPECTED_SOURCE = Path('E:/AII-3D/3D-Body/output/flare-v42-r17-20261017')
EXPECTED_OUTPUT = Path('E:/AII-3D/3D-Body/output')
BASELINE_HASHES = {
    'training': '3b642a583bfed64303ce217d9894eecaae3c3668887a0e196cf91d0c024a96cd',
    'coach': '4da3f15e74f6f1c78c5e3db3022fc3daad46141c6b3a0ab9569f60d4cb495055',
}


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def parse_glb(data: bytes) -> dict:
    if len(data) < 20:
        raise ValueError('Candidate is too short for GLB')
    magic, version, size, json_size, json_type = struct.unpack_from('<IIIII', data)
    if (magic, version, size, json_type) != (0x46546C67, 2, len(data), 0x4E4F534A):
        raise ValueError('Invalid GLB header')
    gltf = json.loads(data[20:20 + json_size])
    if len(gltf.get('animations', [])) != 1 or not gltf.get('skins'):
        raise ValueError('Expected one animated, skinned candidate')
    animation = gltf['animations'][0]
    durations = [gltf['accessors'][sampler['input']].get('max', [0])[0]
                 for sampler in animation['samplers']]
    duration = max(durations)
    if not 0.1 < duration < 20:
        raise ValueError('Unexpected candidate animation duration')
    return {'duration_seconds': duration, 'tracks': len(animation['channels']),
            'animation': animation.get('name', '')}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check-only', action='store_true', help='Validate fixed sources without publishing')
    parser.add_argument('--source-batch', default=str(EXPECTED_SOURCE),
                        help='Absolute R17 direct child batch of the fixed project output directory')
    args = parser.parse_args()
    root = Path(__file__).resolve().parent
    if str(root).casefold() != str(EXPECTED_VIEWER).casefold():
        raise RuntimeError('Refusing to publish outside the fixed R17 viewer')
    requested_source = Path(args.source_batch)
    if not requested_source.is_absolute():
        raise RuntimeError('Source batch must be an absolute directory path')
    source_root = requested_source.resolve(strict=True)
    if str(source_root).casefold() != str(requested_source).casefold():
        raise RuntimeError('Candidate source must not be redirected')
    if str(source_root.parent).casefold() != str(EXPECTED_OUTPUT).casefold():
        raise RuntimeError('Candidate source must be a direct child of the fixed output directory')
    if not re.fullmatch(r'flare-v42-r17-[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*', source_root.name):
        raise RuntimeError('Only new flare-v42-r17-* batches are allowed; R16 is prohibited')
    asset_root = (root / 'assets').resolve(strict=True)
    if asset_root.parent != root:
        raise RuntimeError('Viewer asset directory must not be redirected')
    baseline_before = {kind: digest((asset_root / f'r16-{kind}.glb').read_bytes()) for kind in BASELINE_HASHES}
    if baseline_before != BASELINE_HASHES:
        raise RuntimeError('R16 viewer baseline hash mismatch; refusing publication')
    payloads = []
    for kind in ('training', 'coach'):
        source = source_root / f'flare-{kind}-v42-candidate.glb'
        if source.resolve(strict=True).parent != source_root:
            raise RuntimeError('Candidate source file must not be redirected')
        data = source.read_bytes()
        destination = asset_root / f'r17-{kind}.glb'
        if destination.resolve().parent != asset_root or destination.name not in ('r17-training.glb', 'r17-coach.glb'):
            raise RuntimeError('Refusing an unexpected candidate destination')
        details = parse_glb(data)
        payloads.append((data, destination, {'kind': kind, 'source': str(source),
                         'file': destination.relative_to(root).as_posix(),
                         'sha256': digest(data), 'bytes': len(data), **details}))
    if args.check_only:
        print(json.dumps({'check_only': True, 'sources_valid': True,
                          'assets': [p[2] for p in payloads]}, indent=2))
        return
    # The only replaced assets are the two fixed r17-* copies. R16 sources are
    # never opened here; baseline copies are read-only integrity checks.
    lock = root / '.candidate-publication.lock'
    with lock.open('x', encoding='ascii') as stream:
        stream.write(str(os.getpid()))
    try:
        for data, destination, item in payloads:
            temporary = asset_root / (destination.name + '.partial')
            temporary.write_bytes(data)
            if digest(temporary.read_bytes()) != item['sha256']:
                raise RuntimeError('Candidate copy hash mismatch')
            os.replace(temporary, destination)
        receipt = {'version': 'flare-v42-r17-candidate', 'status': 'awaiting-user-review',
                   'source_batch': source_root.name, 'source_directory': str(source_root),
                   'stage': 'trial' if '-trial' in source_root.name.lower() else 'candidate',
                   'published_at': datetime.datetime.now(datetime.timezone.utc).isoformat(),
                   'assets': [p[2] for p in payloads], 'baseline_hashes': BASELINE_HASHES,
                   'scope': 'Only isolated viewer candidate copies were replaced; original R16 and App untouched'}
        manifest = root / 'candidate-manifest.json'
        pending_manifest = root / 'candidate-manifest.json.partial'
        pending_manifest.write_text(json.dumps(receipt, indent=2) + '\n', encoding='utf-8')
        os.replace(pending_manifest, manifest)
        baseline_after = {kind: digest((asset_root / f'r16-{kind}.glb').read_bytes()) for kind in BASELINE_HASHES}
        if baseline_after != baseline_before:
            raise RuntimeError('Unexpected R16 viewer baseline change during publication')
        print(json.dumps(receipt, indent=2))
    finally:
        lock.unlink(missing_ok=True)


if __name__ == '__main__':
    main()
