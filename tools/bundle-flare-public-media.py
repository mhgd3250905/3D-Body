"""Materialize the pinned Flare catalogue's offline media for internal builds."""

from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile
from urllib.parse import urljoin

ROOT = Path(__file__).resolve().parents[1] / 'app' / 'assets' / 'public_media'


def descriptors():
    pack = json.loads((ROOT / 'catalog.json').read_bytes())
    overlay = json.loads((ROOT / 'flare-warmup-action.json').read_bytes())
    base = pack['mediaDistribution']['baseUrl']
    files = {}

    def add(directory, extension, descriptor):
        url = urljoin(base, descriptor['path'])
        if not url.startswith(base) or descriptor.get('downloadUrl', url) != url:
            raise ValueError(f"Unexpected media URL for {descriptor['path']}")
        digest = descriptor['sha256']
        target = ROOT / 'offline' / directory / f'{digest}.{extension}'
        record = (target, url, descriptor['bytes'], digest)
        previous = files.setdefault(target, record)
        if previous[2] != record[2]:
            raise ValueError(f'Conflicting lengths for {digest}')

    for action in [*pack['actions'], overlay['action']]:
        add('video', 'mp4', action['files']['video'])
        for clip in (action.get('voice') or {}).get('files', []):
            add('voice', 'm4a', clip)
    for clip in pack['voiceCommon']['files']:
        add('voice', 'm4a', clip)
    return list(files.values())


def materialize(record):
    target, url, size, digest = record

    def valid(data):
        return len(data) == size and hashlib.sha256(data).hexdigest() == digest

    if target.is_file() and valid(target.read_bytes()):
        return size
    result = subprocess.run(
        ['curl', '--fail', '--silent', '--show-error', '--max-time', '25',
         '--retry', '2', url],
        check=True,
        stdout=subprocess.PIPE,
    )
    if not valid(result.stdout):
        raise ValueError(f'Byte length or SHA-256 mismatch for {url}')
    # Keep in-progress outputs outside the declared Flutter asset directories.
    with tempfile.TemporaryDirectory(dir=ROOT / 'offline') as scratch:
        staging = Path(scratch) / target.name
        staging.write_bytes(result.stdout)
        staging.replace(target)
    return size


def main():
    records = descriptors()
    print(f'Checking {len(records)} bundled media objects', flush=True)
    with ThreadPoolExecutor(max_workers=32) as pool:
        total = 0
        for index, size in enumerate(pool.map(materialize, records), 1):
            total += size
            if index % 250 == 0:
                print(f'Verified {index}/{len(records)}', flush=True)
    print(f'Verified {len(records)} files ({total:,} bytes)', flush=True)


if __name__ == '__main__':
    main()
