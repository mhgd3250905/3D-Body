"""Read-only source/video verification; writes additive QA evidence under the green batch.

python verify.py --only abs-A,erectors-B
python verify.py  # discovers every completed jobs/<id>/result.json

Sample comparisons verify composition, not new posture/clinical/device QA.
FFmpeg independently decodes every completed master/mobile in full. Four temporal
samples per action compare encoded pixels to original RGBA with the saved placement.
"""
import argparse
import hashlib
import json
import math
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

REPO = Path(__file__).resolve().parents[3]
GREEN = np.array([0, 255, 0], dtype=np.float64)


def read(p):
    return json.loads(Path(p).read_text(encoding='utf-8'))


def sha(p):
    h = hashlib.sha256()
    with Path(p).open('rb') as f:
        for block in iter(lambda: f.read(1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()


def run(args):
    p = subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if p.returncode:
        raise RuntimeError(p.stderr.decode('utf-8', errors='replace')[-4000:])
    return p.stdout


def js_round(n):
    return math.floor(n + 0.5)


def decode_samples(file, indexes, size):
    select = '+'.join('eq(n\\,%d)' % n for n in indexes)
    data = run(['ffmpeg', '-v', 'error', '-threads', '1', '-i', str(file),
                '-vf', 'select=' + select, '-fps_mode', 'passthrough',
                '-pix_fmt', 'rgb24', '-f', 'rawvideo', '-threads', '1', 'pipe:1'])
    a = np.frombuffer(data, dtype=np.uint8)
    assert a.size == len(indexes) * size * size * 3, ('sample decode size', file)
    return a.reshape(len(indexes), size, size, 3)


def placed_rgba(raw, place):
    with Image.open(raw) as im:
        assert im.mode == 'RGBA'
        w, h = im.size
    w, h = js_round(w * place['s']), js_round(h * place['s'])
    data = run(['ffmpeg', '-v', 'error', '-filter_threads', '1', '-i', str(raw),
                '-vf', f'scale={w}:{h}:flags=lanczos,format=rgba',
                '-frames:v', '1', '-pix_fmt', 'rgba', '-f', 'rawvideo',
                '-threads', '1', 'pipe:1'])
    scaled = np.frombuffer(data, dtype=np.uint8).reshape(h, w, 4)
    x, y = js_round(place['ox']), js_round(place['oy'])
    dst = np.zeros((1080, 1080, 4), np.uint8)
    left, top, right, bottom = max(0, x), max(0, y), min(1080, x+w), min(1080, y+h)
    assert right > left and bottom > top
    dst[top:bottom, left:right] = scaled[top-y:bottom-y, left-x:right-x]
    return dst


def source_alpha_evidence(raw):
    """Compare gray anti-aliased edge colors to nearby opaque gray surface colors.

    This distinguishes straight PNG RGB from RGB already multiplied by alpha.
    It is an empirical edge sample check, not a declaration based on file metadata.
    """
    a = np.asarray(Image.open(raw).convert('RGBA'))
    rgb, alpha = a[..., :3].astype(float), a[..., 3].astype(float) / 255
    dist, nearest = nd.distance_transform_edt(alpha < .99, return_indices=True)
    opaque_rgb = rgb[nearest[0], nearest[1]]
    neutral = (rgb.max(axis=2)-rgb.min(axis=2) < 30) & (rgb.sum(axis=2) > 75)
    nearby_neutral = (opaque_rgb.max(axis=2)-opaque_rgb.min(axis=2) < 30)
    mask = (alpha > .2) & (alpha < .8) & (dist < 4) & neutral & nearby_neutral
    count = int(mask.sum())
    if count < 20:
        return {'samples': count, 'conclusion': 'insufficient neutral edge samples'}
    color = rgb[mask]
    nearby = opaque_rgb[mask]
    straight = float(np.mean(np.abs(color-nearby)))
    premult = float(np.mean(np.abs(color-nearby*alpha[mask, None])))
    return {'samples': count, 'straightMae': straight, 'premultipliedMae': premult,
            'conclusion': 'straight' if straight < premult else 'inconclusive'}


def compare(rgb, reference, size):
    alpha = reference[..., 3].astype(float) / 255
    fg = reference[..., :3].astype(float)
    straight = fg * alpha[..., None] + GREEN * (1-alpha[..., None])
    double = fg * alpha[..., None]**2 + GREEN * (1-alpha[..., None]**2)
    if size != 1080:
        straight = np.asarray(Image.fromarray(np.uint8(np.clip(straight, 0, 255))).resize(
            (size, size), Image.Resampling.LANCZOS)).astype(float)
        double = np.asarray(Image.fromarray(np.uint8(np.clip(double, 0, 255))).resize(
            (size, size), Image.Resampling.LANCZOS)).astype(float)
        alpha = np.asarray(Image.fromarray(np.uint8(reference[..., 3])).resize(
            (size, size), Image.Resampling.LANCZOS)).astype(float)/255
    opaque = nd.binary_erosion(alpha > .995, iterations=4 if size == 1080 else 3)
    bg = nd.distance_transform_edt(alpha == 0) > (8 if size == 1080 else 6)
    edge = (alpha > .2) & (alpha < .8)
    cyan = opaque & (straight[..., 2] > 140) & (straight[..., 1] > 120) & (
        straight[..., 2] > straight[..., 0]*1.4)
    good_green = (rgb[..., 0] <= 12) & (rgb[..., 1] >= 245) & (rgb[..., 2] <= 12)
    err = np.abs(rgb.astype(float)-straight)
    result = {'foregroundInteriorPixels': int(opaque.sum()), 'backgroundPixels': int(bg.sum()),
              'backgroundGreenFraction': float(good_green[bg].mean()) if bg.any() else None,
              'foregroundInteriorMae': float(err[opaque].mean()) if opaque.any() else None,
              'foregroundInteriorP99': float(np.percentile(err[opaque], 99)) if opaque.any() else None,
              'cyanPixels': int(cyan.sum()), 'cyanMae': float(err[cyan].mean()) if cyan.any() else None,
              'alphaEdgePixels': int(edge.sum()),
              'straightAlphaEdgeMae': float(err[edge].mean()) if edge.any() else None,
              'doubleAlphaEdgeMae': float(np.abs(rgb.astype(float)-double)[edge].mean()) if edge.any() else None}
    assert result['backgroundPixels'] > 1000
    assert result['backgroundGreenFraction'] > .999, ('non-green remote background', result)
    assert result['foregroundInteriorPixels'] > 100
    assert result['foregroundInteriorMae'] < 8, ('foreground changed', result)
    if cyan.any():
        assert result['cyanMae'] < 10, ('cyan highlight changed', result)
    return result, np.uint8(np.clip(straight, 0, 255)), alpha, cyan


def key_preview(rgb):
    # Reproducible RGB distance key: full matte outside .20 normalized distance,
    # feather between .10/.20. This simulates an ordinary key, not source alpha.
    dist = np.sqrt(np.mean((rgb.astype(float)/255-GREEN/255)**2, axis=2))
    matte = np.clip((dist-.10)/.10, 0, 1)
    return matte


def write_panel(out, ident, frame, actual, expected, alpha, cyan):
    keyed = key_preview(actual)
    panels = [actual, expected]
    for color in ([255, 255, 255], [24, 24, 28]):
        panels.append(np.uint8(actual*keyed[..., None]+np.array(color)*(1-keyed[..., None])))
        # Exact source-alpha composite provides an honest visual comparison.
        denom = np.maximum(alpha[..., None], .001)
        foreground = np.clip((expected.astype(float)-GREEN*(1-alpha[..., None]))/denom, 0, 255)
        panels.append(np.uint8(foreground*alpha[..., None]+np.array(color)*(1-alpha[..., None])))
    # Typical green-spill suppression: reduce only green-dominant fringe color.
    # Cyan stays untouched because its blue channel is at least its green channel.
    despilled = actual.astype(float).copy()
    rb = np.maximum(despilled[..., 0], despilled[..., 2])
    spill = (despilled[..., 1] > rb*1.15) & (keyed > 0)
    despilled[..., 1][spill] = rb[spill]
    for color in ([255, 255, 255], [24, 24, 28]):
        panels.append(np.uint8(despilled*keyed[..., None]+np.array(color)*(1-keyed[..., None])))
    labels = ['Encoded green', 'RGBA straight reference', 'Actual key / white',
              'Source alpha / white', 'Actual key / dark', 'Source alpha / dark',
              'Key + despill / white', 'Key + despill / dark']
    canvas = Image.new('RGB', (4*540, 2*568), 'white')
    draw = ImageDraw.Draw(canvas)
    for i, (pix, label) in enumerate(zip(panels, labels)):
        x, y = (i % 4)*540, (i//4)*568
        draw.text((x+8, y+6), label, fill='black')
        canvas.paste(Image.fromarray(pix).resize((540, 540), Image.Resampling.LANCZOS), (x, y+28))
    target = out/f'{ident}-frame-{frame:04d}-key-comparison.png'
    canvas.save(target)
    return {'path': target.name, 'sha256': sha(target), 'keyMethod': 'normalized RGB distance .10/.20 feather',
            'despillMethod': 'Green > 1.15 * max(red, blue), green reduced to max(red, blue); preview only',
            'cyanPixels': int(cyan.sum()), 'cyanMatteMin': float(keyed[cyan].min()) if cyan.any() else None,
            'cyanMatteMean': float(keyed[cyan].mean()) if cyan.any() else None,
            'cyanDespillRgbChangeMax': float(np.abs(despilled-actual)[cyan].max()) if cyan.any() else None,
            'note': 'Ordinary key may retain a thin green fringe from codec chroma subsampling. Despill previews show typical reduction; edges need tuning in the destination editor. Source-alpha panels are ground-truth comparison, not delivered alpha video.'}


def verify_action(batch, action, qa_out):
    ident = action['id']
    result = read(batch/'jobs'/ident/'result.json')
    provenance = read(batch/'jobs'/ident/'source.json')
    rawdir = REPO/provenance['rawDirectory']
    assert rawdir.resolve().is_relative_to(REPO.resolve())
    expected_root = REPO/('output/training-human-v2-erectors-B-footfix-20261013/frames'
                         if ident == 'erectors-B' else 'output/training-human-v2-library-final-20261013/jobs/'+ident+'/frames')
    assert rawdir.resolve() == expected_root.resolve()
    place = read(rawdir.parent/'composite/place.json')
    assert place == provenance['place']
    assert provenance['sourceAppVideoSha256'] == action['sha256']
    assert sha(REPO/'app'/action['video_asset']) == action['sha256']
    assert sha(REPO/action['source_path']) == action['sha256']
    assert result['inheritedPostureStatus'] == action['audit_status']
    assert len(provenance['frames']) == action['frames']
    for i, row in enumerate(provenance['frames']):
        assert row['f'] == i and abs(row['t']-i/30) < 1e-7
    for rel, expected in provenance['sourceSha256'].items():
        assert sha(rawdir.parent/rel) == expected, ('source record drift', ident, rel)
    indexes = sorted(set([0, js_round(action['poster_time_seconds']*30), action['frames']//2, action['frames']-1]))
    media_checks, samples, panels = {}, [], []
    decoded = {}
    for name, size in [('master', 1080), ('mobile', 720)]:
        file = batch/result['media'][name]['path']
        assert sha(file) == result['media'][name]['sha256']
        p = json.loads(run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-count_frames',
                           '-show_entries', 'stream=codec_name,pix_fmt,width,height,nb_read_frames,r_frame_rate:format=duration',
                           '-of', 'json', str(file)]))
        s = p['streams'][0]
        assert (s['codec_name'], s['pix_fmt'], s['width'], s['height'], s['r_frame_rate']) == ('h264', 'yuv420p', size, size, '30/1')
        assert int(s['nb_read_frames']) == action['frames']
        assert abs(float(p['format']['duration'])-action['duration_seconds']) < .02
        run(['ffmpeg', '-v', 'error', '-xerror', '-threads', '1', '-i', str(file), '-f', 'null', '-'])
        decoded[name] = decode_samples(file, indexes, size)
        media_checks[name] = {'sha256': sha(file), 'probe': p, 'fullCpuDecode': True}
    alpha_evidence = source_alpha_evidence(rawdir/'m-0000.png')
    for j, f in enumerate(indexes):
        raw = rawdir/f'm-{f:04d}.png'
        assert sha(raw) == provenance['frames'][f]['sha256']
        reference = placed_rgba(raw, place)
        frame_results = {'frame': f, 't': f/30, 'sourceSha256': sha(raw)}
        for name, size in [('master', 1080), ('mobile', 720)]:
            metrics, expected, alpha, cyan = compare(decoded[name][j], reference, size)
            frame_results[name] = metrics
            matte = key_preview(decoded[name][j])
            if cyan.any():
                assert matte[cyan].min() > .99, ('key removes cyan', ident, f)
            if name == 'master' and f in [0, indexes[len(indexes)//2]]:
                panels.append(write_panel(qa_out, ident, f, decoded[name][j], expected, alpha, cyan))
        samples.append(frame_results)
    edges = [r['master'] for r in samples if r['master']['alphaEdgePixels'] > 20]
    if edges:
        straight = float(np.mean([r['straightAlphaEdgeMae'] for r in edges]))
        double = float(np.mean([r['doubleAlphaEdgeMae'] for r in edges]))
        assert straight < double, ('double alpha not excluded', ident, straight, double)
    else:
        straight = double = None
    return {'id': ident, 'pass': True, 'inheritedPostureStatus': action['audit_status'],
            'placement': place, 'sourcePngAlphaEvidence': alpha_evidence,
            'encodedEdgeStraightVsDouble': {'straightMae': straight, 'doubleMae': double,
                                            'conclusion': 'straight; double alpha rejected' if edges else 'insufficient alpha edge pixels'},
            'videos': media_checks, 'temporalSamples': samples, 'comparisonPanels': panels}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--out', default='output/app51-greenscreen-20261014')
    parser.add_argument('--only')
    args = parser.parse_args()
    batch = (REPO/args.out).resolve()
    assert batch.is_relative_to(REPO.resolve()) and batch != REPO
    evidence = batch/'verification'
    evidence.mkdir(exist_ok=True)
    manifest_path = REPO/'app/assets/data/drill-media-manifest.json'
    manifest = read(manifest_path)
    plan = read(batch/'plan.json')
    assert sha(manifest_path) == plan['sourceManifestSha256']
    only = set(args.only.split(',')) if args.only else None
    completed = [a for a in manifest['actions'].values() if (batch/'jobs'/a['id']/'result.json').exists() and (not only or a['id'] in only)]
    assert completed
    if only:
        assert {a['id'] for a in completed} == only, 'Requested unfinished action'
    rows = []
    for a in completed:
        row = verify_action(batch, a, evidence)
        (evidence/(a['id']+'-verification.json')).write_text(json.dumps(row, indent=2)+'\n', encoding='utf-8')
        rows.append(row)
        print('verified', a['id'], flush=True)
    summary = {'pass': True, 'actions': len(rows), 'videosFullyDecoded': len(rows)*2,
               'sampledEncodedFramesPerVideo': 'first, poster, midpoint, last (distinct)',
               'sourceManifestSha256': sha(manifest_path), 'verifierSha256': sha(__file__),
               'inheritedPostureStatus': {k: sum(r['inheritedPostureStatus']==k for r in rows) for k in ['ready', 'review_required']},
               'allPostureQaPassed': False, 'appReplaced': False,
               'scope': 'Every completed video fully decoded; sampled pixel comparisons, source bindings, placement, straight alpha, green purity, cyan preservation and practical key previews. No new posture/device QA.',
               'results': rows}
    name = 'verification-summary-'+('-'.join(sorted(only)) if only else 'all')+'.json'
    (evidence/name).write_text(json.dumps(summary, indent=2)+'\n', encoding='utf-8')
    print(json.dumps({k: v for k, v in summary.items() if k != 'results'}), flush=True)


if __name__ == '__main__':
    main()
