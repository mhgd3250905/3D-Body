"""Read-only PNG scan and alpha verification for a separately composited cycle.

No model, animation, renderer, spec, theme, or original output is changed.
"""
import argparse
import hashlib
import io
import json
import math
from pathlib import Path
from PIL import Image


def sha_file(path):
    h = hashlib.sha256()
    with path.open('rb') as f:
        for block in iter(lambda: f.read(1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()


def bbox(im, threshold=10):
    box = im.getchannel('A').point([0 if a <= threshold else 255 for a in range(256)]).getbbox()
    if box is None:
        raise ValueError('Empty body alpha')
    return [box[0], box[1], box[2] - 1, box[3] - 1]


def write(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def scan(args):
    job = args.source.resolve()
    library = job.parent.parent
    dest = args.out.resolve()
    if dest == job or job in dest.parents:
        raise ValueError('Derived output must be outside the original production job')
    spec = json.loads((job / 'spec.json').read_text(encoding='utf-8'))
    inputs = json.loads((job / 'input.json').read_text(encoding='utf-8'))
    rows = json.loads((job / 'frames/met-cycle.json').read_text(encoding='utf-8'))
    n = round(spec['timeline']['duration'] * spec.get('fps', 30))
    assert sorted(r['f'] for r in rows) == [-1] + list(range(n)), 'Full raw cycle plus still required'
    records = []
    union = [math.inf, math.inf, -math.inf, -math.inf]
    raw_size = None
    for r in sorted(rows, key=lambda r: r['f']):
        name = 'still' if r['f'] < 0 else f"{r['f']:04d}"
        gp, mp = job / f'frames/g-{name}.png', job / f'frames/m-{name}.png'
        gbytes = gp.read_bytes()
        with Image.open(io.BytesIO(gbytes)) as image:
            im = image.convert('RGBA')
            assert im.width == im.height == 2160, 'Expected original2160 square PNG'
            raw_size = im.size
            bb = bbox(im)
        with Image.open(mp) as image:
            assert image.size == raw_size, 'Main/glow dimensions disagree'
        assert min(bb[0], bb[1], raw_size[0]-1-bb[2], raw_size[1]-1-bb[3]) > 2, 'Original raw body is clipped'
        union = [min(union[0], bb[0]), min(union[1], bb[1]), max(union[2], bb[2]), max(union[3], bb[3])]
        records.append({'f': r['f'], 'timeSeconds': r['t'], 'raw': {'gPath': gp.relative_to(library).as_posix(), 'gSha256': hashlib.sha256(gbytes).hexdigest(), 'mPath': mp.relative_to(library).as_posix(), 'mSha256': sha_file(mp), 'bbox': bb, 'size': list(raw_size)}})
    size = spec.get('size', 1080)
    # Inclusive pixel bounds are used; retain the small raster rounding reserve.
    scale = size * args.occupancy / max(union[2]-union[0]+1, union[3]-union[1]+1)
    ox = size / 2 - ((union[0]+union[2])/2) * scale
    oy = size / 2 - ((union[1]+union[3])/2) * scale
    previous = json.loads((job / 'composite/place.json').read_text(encoding='utf-8'))
    placement = {'s': scale, 'ox': ox, 'oy': oy, 'reference': 'Entire raw new-profile body alpha cycle plus original still; one constant2D transform only', 'unionRawBBox': union, 'occupancy': args.occupancy, 'alphaThreshold': 10}
    write(dest / 'composite/place.json', placement)
    proof = {'schemaVersion': 1, 'id': spec['id'], 'sourceLibraryRoot': library.as_posix(), 'sourceFingerprint': inputs['fingerprint'], 'canvasSize': size, 'rawSize': list(raw_size), 'occupancy': args.occupancy, 'alphaThreshold': 10, 'resampling': 'LANCZOS', 'alphaPlacement': 'Full RGBA image resize then paste with itself as alpha mask into1080 transparent canvas; no source crop', 'unionRawBBox': union, 'previousPlace': previous, 'constantTransform': {'s': scale, 'ox': ox, 'oy': oy, 'resizedWidth': round(raw_size[0]*scale), 'resizedHeight': round(raw_size[1]*scale), 'pasteX': round(ox), 'pasteY': round(oy)}, 'summary': {'frames': n, 'checkedIncludingStill': len(records), 'fitAllFrames': False, 'edgeTouchFrames': None}, 'frames': records}
    write(dest / 'framing-plan.json', proof)
    print(json.dumps({'id': spec['id'], 'frames': n, 'unionRawBBox': union, 'constantTransform': proof['constantTransform']}, ensure_ascii=False), flush=True)


def verify(args):
    dest = args.out.resolve()
    proof = json.loads((dest / 'framing-plan.json').read_text(encoding='utf-8'))
    library = Path(proof['sourceLibraryRoot'])
    pl = proof['constantTransform']
    size = proof['canvasSize']
    margins, edge_frames = [], []
    for r in proof['frames']:
        raw = r['raw']
        assert sha_file(library / raw['gPath']) == raw['gSha256'], 'Original glow SHA changed'
        assert sha_file(library / raw['mPath']) == raw['mSha256'], 'Original main SHA changed'
        with Image.open(library / raw['gPath']) as source:
            image = source.convert('RGBA').resize((pl['resizedWidth'], pl['resizedHeight']), Image.Resampling.LANCZOS)
        unplaced = bbox(image, proof['alphaThreshold'])
        uncropped = [unplaced[0]+pl['pasteX'], unplaced[1]+pl['pasteY'], unplaced[2]+pl['pasteX'], unplaced[3]+pl['pasteY']]
        assert min(uncropped[0], uncropped[1], size-1-uncropped[2], size-1-uncropped[3]) >= 40, 'Scaled body would crop before paste'
        canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        canvas.paste(image, (pl['pasteX'], pl['pasteY']), image)
        # This is the actual alpha composition performed by frozen comp.py.
        bb = bbox(canvas, proof['alphaThreshold'])
        margin = min(bb[0], bb[1], size-1-bb[2], size-1-bb[3])
        alpha = canvas.getchannel('A')
        boundary = max(alpha.crop((0,0,size,2)).getextrema()[1], alpha.crop((0,size-2,size,size)).getextrema()[1], alpha.crop((0,0,2,size)).getextrema()[1], alpha.crop((size-2,0,size,size)).getextrema()[1])
        fits = margin >= 40 and boundary == 0
        r['composite'] = {'bodyAlphaBBox': bb, 'uncroppedBodyAlphaBBox': uncropped, 'edgeTouch': boundary > 0, 'edgeAlphaMax': boundary, 'minimumMarginPixels': margin, 'fit': fits}
        margins.append(margin)
        if boundary: edge_frames.append(r['f'])
        name = 'still' if r['f'] < 0 else f"{r['f']:04d}"
        with Image.open(dest / f'composite/{name}.png') as final:
            assert final.size == (size, size), 'Missing/wrong final composite'
    edges = {}
    for f in (dest / 'composite').glob('edge-*.json'):
        edges.update(json.loads(f.read_text(encoding='utf-8')))
    assert len(edges) == len(proof['frames']), 'Frozen compositor did not check every frame plus still'
    assert all(v == 0 for v in edges.values()), 'Frozen compositor detected body alpha at frame boundary'
    proof['summary'].update({'fitAllFrames': all(r['composite']['fit'] for r in proof['frames']), 'edgeTouchFrames': len(edge_frames), 'edgeTouchFrameIndices': edge_frames, 'minimumBodyMarginPixels': min(margins), 'frozenCompositorEdgeFrames': sum(v > .05 for v in edges.values()), 'sourceRawUntouched': True, 'allCompositeFramesPresent': True})
    assert proof['summary']['fitAllFrames'] and not edge_frames, 'Full-body safe margin check failed'
    write(dest / 'framing-proof.json', proof)
    print(json.dumps({'id': proof['id'], 'summary': proof['summary']}), flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('mode', choices=['scan', 'verify'])
    parser.add_argument('--source', type=Path)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--occupancy', type=float, default=.89)
    args = parser.parse_args()
    assert .88 <= args.occupancy <= .90
    scan(args) if args.mode == 'scan' else verify(args)
