#!/usr/bin/env python3
"""Editor export -> Pose-Hub style 2000 keyframe list (so edits can go back into move_2000_r*.py later).

Accepts any JSON the 2000 editor writes: the animation backup from 动画编辑 (format flare-transition-edits, with
`sequence` and the K mid-frames in `points`), a flare-demonstration sequence, or the 姿势编辑 step export
(flare-pose-library), or a share code from 动画编辑 → 复制分享码 ("B2K1....", pasted into a file or given inline;
decoded against --base, default public/coach/move-2000-sequence.json). Output keys are in WORLD space with the spin yaw already baked in (th = 0), in Pose-Hub
channel names: pelvis, pelvisQ, spine (waist rotation vector, pelvis frame), <side>Wrist, <side>Elbow (pole direction),
<side>Ankle, <side>Knee (knee-front direction), <side>Toe/<side>Sole, <side>Fing/<side>Palm, <side>Locked.
Legs are lengthened back to the r7 rig (planted feet keep their floor spot); planted wrists go back to r7 palm height.
Usage: from_editor.py <export.json | share-code file | B2K1.code> coach-rig.json out.json [--leg-ratio 0.9223] [--base seq.json]"""
import sys, os, json, math, argparse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from share_code import load_any
sys.path.insert(0, '/workspace/work/pylib')
import numpy as np
ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('rig'); ap.add_argument('out'); ap.add_argument('--leg-ratio', type=float); ap.add_argument('--base')
A = ap.parse_args()
L = {k: np.array(v, float) for k, v in json.load(open(A.rig))['landmarks'].items()}
n = lambda v: v / np.linalg.norm(v)
X, Y, Z = np.eye(3)
def q2m(q):
    x, y, z, w = np.array(q, float) / np.linalg.norm(q)
    return np.array([[1-2*(y*y+z*z), 2*(x*y-z*w), 2*(x*z+y*w)], [2*(x*y+z*w), 1-2*(x*x+z*z), 2*(y*z-x*w)], [2*(x*z-y*w), 2*(y*z+x*w), 1-2*(x*x+y*y)]])
def rotvec(M):
    c = max(-1, min(1, (np.trace(M) - 1) / 2)); a = math.acos(c)
    if a < 1e-9: return np.zeros(3)
    v = np.array([M[2,1]-M[1,2], M[0,2]-M[2,0], M[1,0]-M[0,1]]) / (2 * math.sin(a)); return v * a
SNOW_F = {sd: n(np.array([sg * 0.98253144, 0.05483374, 0.17783482])) for sd, sg in (('left', 1), ('right', -1))}
SNOW_N = {}
for sd, sg in (('left', 1), ('right', -1)):
    nr = np.array([sg * 0.06068526, -0.99777448, -0.02762938]); SNOW_N[sd] = n(nr - SNOW_F[sd] * (nr @ SNOW_F[sd]))
WAIST = L['pelvis'] + (L['torso'] - L['pelvis']) * 0.30
src = load_any(A.src, A.base)
if src.get('format') == 'flare-transition-edits': seq = src['sequence']; points = src.get('points', [])
elif src.get('format') == 'flare-demonstration': seq = src; points = []
elif src.get('format') == 'flare-pose-library': seq = {'steps': src['steps'], 'period': None, 'source': {}}; points = []
else: sys.exit('unknown format ' + str(src.get('format')))
steps = seq['steps']; N = len(steps); period = seq.get('period') or N
ratio = A.leg_ratio or (seq.get('source') or {}).get('legRatio') or 0.9223
r7dur = (seq.get('source') or {}).get('r7Duration')
def r7time(coord):   # editor step coordinate -> r7 seconds (uniform editor spacing; last step = end of move)
    if r7dur is None: return None
    return round(min(coord, N - 1) * r7dur / (N - 1), 4)
def convert(pose):
    Rp = q2m(pose['bodyQuaternion']); Rt = Rp @ q2m(pose.get('torsoQuaternion', [0, 0, 0, 1]))
    pel = np.array(pose['pelvis']); k = {'pelvis': pel.tolist(), 'pelvisQ': list(pose['bodyQuaternion']), 'spine': rotvec(Rp.T @ Rt).tolist()}
    for sd in ('left', 'right'):
        lb = pose['limbs'][sd]; hq = q2m(lb['handQuaternion']); fq = q2m(lb['footQuaternion'])
        sh = pel + Rp @ (WAIST - L['pelvis']) + Rt @ (L[sd + 'Shoulder'] - WAIST); hip = pel + Rp @ (L[sd + 'Hip'] - L['pelvis'])
        wr = np.array(lb['wrist']); locked = bool(lb['handLocked'])
        if locked: wr = wr + np.array([0, 0.045 - 0.031, 0])
        el_dir = np.array(lb['elbowPole']) - (sh + wr) / 2; d_ = n(wr - sh); el_dir = el_dir - d_ * (el_dir @ d_)
        an = np.array(lb['ankle']); planted = an[1] < 0.13
        an_ph = an if planted else hip + (an - hip) / ratio
        kn_dir = np.array(lb['kneePole']) - (hip + an) / 2; d_ = n(an - hip); kn_dir = kn_dir - d_ * (kn_dir @ d_)
        k.update({sd + 'Wrist': wr.tolist(), sd + 'Elbow': n(el_dir).tolist(), sd + 'Ankle': an_ph.tolist(), sd + 'Knee': n(kn_dir).tolist(),
                  sd + 'Fing': (hq @ SNOW_F[sd]).tolist(), sd + 'Palm': (hq @ SNOW_N[sd]).tolist(),
                  sd + 'Toe': (fq @ Z).tolist(), sd + 'Sole': (fq @ -Y).tolist(), sd + 'Locked': locked})
    return k
keys = []
for i, st in enumerate(steps):
    keys.append({'kind': 'step', 'id': st.get('id'), 'name': st.get('name'), 'index': i, 'editorTime': round(i * period / N, 4),
                 'r7Time': st.get('r7Time', r7time(i)), 'key': convert(st['pose'])})
for p in points:
    c = p['segment'] + p['at']
    keys.append({'kind': 'K', 'id': p.get('id'), 'name': f"K {p['segment']}+{p['at']:.2f}", 'index': c, 'editorTime': round(c * period / N, 4),
                 'r7Time': r7time(c), 'key': convert(p['pose'])})
keys.sort(key=lambda k: k['index'])
json.dump({'format': 'pose-hub-2000-keys', 'version': 1, 'frame': 'world, Y up, model faces +Z at yaw 0, left +X; spin yaw baked in (th=0)',
           'legRatio': ratio, 'editorPeriod': period, 'keys': keys}, open(A.out, 'w'), ensure_ascii=False, indent=1)
print('keys', len(keys), '->', A.out)
