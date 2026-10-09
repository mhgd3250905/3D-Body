# v33: move the right hand's floor spot toward where the right shoulder is at touchdown,
# so the arm lands closer to vertical (user request). Input: flare-sequence-before-v33.json.
#
# usage: python3 tools/rekey/v33_right_spot.py [dz] [carry]
#   dz    : +z shift of the right floor spot on every right-locked step (default 0.10; v33 ships 0.10)
#   carry : comma list "key:weight" of right-support keys whose whole body moves with
#           the spot (pelvis, ankles, poles, free wrist), default "1:1,2:1,3:1".
#
# Why the carry: during the right support the shoulder sweeps over the hand from
# +13 cm z (touchdown, key 0) to -14 cm z (key 3). Moving only the spot helps the
# touchdown and hurts key 3 by the same amount (arm 16 -> 23 deg, hips 1.9 cm lower,
# right knee bent to 164 because the hips drop under fixed ankles). Carrying keys 1-3
# rigidly with the spot keeps mid-support exactly as in v32 (same arm lean, same hip
# height, same legs); keys 0 and 4 stay put (both hands down, left hand unchanged).
import json, sys
DZ = float(sys.argv[1]) if len(sys.argv) > 1 else 0.10
CARRY = {int(k): float(w) for k, w in (p.split(':') for p in (sys.argv[2] if len(sys.argv) > 2 else '1:1,2:1,3:1').split(',') if p)}
d = json.load(open('public/coach/flare-sequence-before-v33.json'))
for i, s in enumerate(d['steps']):
    pose = s['pose']
    r = pose['limbs']['right']
    if r['handLocked']:
        r['wrist'][2] = round(r['wrist'][2] + DZ, 4)
    w = CARRY.get(i, 0.0)
    if w:
        sh = DZ * w
        pose['pelvis'][2] += sh
        for side in ('left', 'right'):
            L = pose['limbs'][side]
            for key in ('elbowPole', 'ankle', 'kneePole'):
                L[key][2] += sh
            if not L['handLocked']:
                L['wrist'][2] += sh
json.dump(d, open('public/coach/flare-sequence.json', 'w'), indent=2)
print('right spot z +', DZ, 'carry', CARRY)
