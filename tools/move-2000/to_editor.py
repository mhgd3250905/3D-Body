#!/usr/bin/env python3
"""Pose-Hub 2000 (r7.npz, solved per-frame world joints) -> Flare editor sequence (flare-demonstration v1).

Both rigs: Y up, facing +Z, model-left +X, metres. Pose-Hub rest rotations are identity (hand: fingers +-X, palm -Y;
foot: toe +Z, sole -Y). Editor (Snow) handQuaternion/footQuaternion are world rotations applied to Snow's rest bone,
so hand q = frame(W@+-X, W@-Y) * frame(snowFinger, snowPalm)^-1, foot q = W_foot.
Retarget: arms are the same length on both rigs; Snow legs are ~8% shorter and the torso ~6 cm longer. The pelvis is
placed so the shoulders match r7 when the body is inverted (planted arms keep their reach/straightness) and so the
legs keep their direction when upright (blended by the pelvis up-vector). Free ankles keep the r7 leg direction at
Snow leg length; planted hands/feet keep the r7 floor spot.
Usage: to_editor.py r7.npz coach-rig.json out.json [--dump keys.json]"""
import sys, json, math, argparse
sys.path.insert(0, '/workspace/work/pylib')
import numpy as np

ap = argparse.ArgumentParser(); ap.add_argument('npz'); ap.add_argument('rig'); ap.add_argument('out')
ap.add_argument('--rev', default='r7', help='Pose-Hub revision tag, e.g. r8')
ap.add_argument('--max-turn', type=float, default=80.0, help='max body rotation (deg) between neighbouring keys')
A = ap.parse_args()
REVN = int(A.rev.lstrip("r"))   # numeric revision (string compare put r10 before r9)
d = np.load(A.npz); FPS = int(d['fps']); NF = len(d['P_pelvis']); T_END = (NF - 1) / FPS
L = {k: np.array(v, float) for k, v in json.load(open(A.rig))['landmarks'].items()}
n = lambda v: v / np.linalg.norm(v)
X, Y, Z = np.eye(3)

def m2q(M):
    t = np.trace(M)
    if t > 0: s = math.sqrt(t + 1) * 2; q = [(M[2,1]-M[1,2])/s, (M[0,2]-M[2,0])/s, (M[1,0]-M[0,1])/s, s/4]
    else:
        i = int(np.argmax(np.diag(M)))
        if i == 0: s = math.sqrt(1+M[0,0]-M[1,1]-M[2,2])*2; q = [s/4,(M[0,1]+M[1,0])/s,(M[0,2]+M[2,0])/s,(M[2,1]-M[1,2])/s]
        elif i == 1: s = math.sqrt(1+M[1,1]-M[0,0]-M[2,2])*2; q = [(M[0,1]+M[1,0])/s,s/4,(M[1,2]+M[2,1])/s,(M[0,2]-M[2,0])/s]
        else: s = math.sqrt(1+M[2,2]-M[0,0]-M[1,1])*2; q = [(M[0,2]+M[2,0])/s,(M[1,2]+M[2,1])/s,s/4,(M[1,0]-M[0,1])/s]
    q = np.array(q); return q / np.linalg.norm(q)

def frame(finger, normal):   # same as coach-motion.js frame(): y = finger, z = normal (orthogonalised), x = y cross z
    y = n(finger); z = n(normal - y * (normal @ y)); x = n(np.cross(y, z)); return np.stack([x, y, z], 1)

SNOW_HAND = {}
for sd, sg in (('left', 1), ('right', -1)):
    f = n(np.array([sg * 0.98253144, 0.05483374, 0.17783482])); nr = np.array([sg * 0.06068526, -0.99777448, -0.02762938])
    SNOW_HAND[sd] = frame(f, nr)
WAIST = L['pelvis'] + (L['torso'] - L['pelvis']) * 0.30          # coach-motion waistRest
LEG_E = {sd: np.linalg.norm(L[sd + 'Hip'] - L[sd + 'Knee']) + np.linalg.norm(L[sd + 'Knee'] - L[sd + 'Ankle']) for sd in ('left', 'right')}
P = lambda b, i: d['P_' + b][i]; W = lambda b, i: d['W_' + b][i]
LEG_R = np.linalg.norm(P('leftShin', 0) - P('leftThigh', 0)) + np.linalg.norm(P('leftFoot', 0) - P('leftShin', 0))
RATIO = LEG_E['left'] / LEG_R
FOOT_PLANT_Y, SNOW_FLAT_WRIST_Y = 0.13, 0.031   # Snow flat palm (getGroundHandPose) wrist height
ARM_E = {sd: np.linalg.norm(L[sd + 'Shoulder'] - L[sd + 'Elbow']) + np.linalg.norm(L[sd + 'Elbow'] - L[sd + 'Wrist']) for sd in ('left', 'right')}
T0, T1 = 1.40, 3.30
if REVN >= 11: T0, T1 = 1.80, 3.70   # r11: slower entry (spin starts 1.80 s)
STRAIGHT = 0.975   # planted-arm reach (shoulder-wrist / arm length) when inverted, ~25 deg elbow at most

def editor_pose(i):
    Rp, Rt = W('pelvis', i), W('torso', i); Rtq = Rp.T @ Rt
    up = Rp @ Y
    def upper(rest, pel):   # coach-motion upperOffset with an independent waist rotation
        return pel + Rp @ (WAIST - L['pelvis']) + Rt @ (rest - WAIST)
    # pelvis candidates: shoulders match (inverted) / legs keep direction (upright)
    sh_r = (P('leftUpperArm', i) + P('rightUpperArm', i)) / 2
    sh_e0 = (upper(L['leftShoulder'], np.zeros(3)) + upper(L['rightShoulder'], np.zeros(3))) / 2
    p_hand = sh_r - sh_e0
    hips_r = {sd: P(sd + 'Thigh', i) for sd in ('left', 'right')}
    planted = [sd for sd in ('left', 'right') if P(sd + 'Foot', i)[1] < FOOT_PLANT_Y]
    legs = planted or ['left', 'right']
    # Snow hip sits where the r7 hip would be after shortening the leg about its (planted) ankle
    p_leg = np.mean([P(sd + 'Foot', i) + RATIO * (hips_r[sd] - P(sd + 'Foot', i)) - Rp @ (L[sd + 'Hip'] - L['pelvis']) for sd in legs], 0)
    w = float(np.clip((0.35 - up[1]) / 0.7, 0, 1))   # up.y >= .35 -> legs, <= -.35 -> shoulders
    t = i / FPS; te = t if t <= T1 else T0 - (t - T1); te = min(te, T0) if t <= T1 else te
    LOCK = {'left': te >= 0.95, 'right': 0.60 <= te <= 1.00}
    if REVN >= 10: LOCK = {'right': te >= 0.95, 'left': 0.60 <= te <= 1.00}   # r10 is mirrored: left hand plants first, right hand is the axis
    if REVN >= 11: LOCK = {'right': te >= 1.17, 'left': 0.70 <= te <= 1.45}   # r11: slower entry, left plants 0.72, right lands 1.19, left lifts 1.46
    locked_sides = [sd for sd in LOCK if LOCK[sd]]
    if locked_sides:   # Snow flat-palm wrist height differs from r7: move the inverted body with the planted hands
        p_hand = p_hand + np.array([0, np.mean([SNOW_FLAT_WRIST_Y - P(sd + 'Hand', i)[1] for sd in locked_sides]), 0])
    pel = (1 - w) * p_leg + w * p_hand
    if locked_sides and w > 0.5:   # inverted on the hands: lift the body until the planted arms are near straight (real 2000: long arms)
        wr_of = lambda sd: np.array([P(sd + 'Hand', i)[0], SNOW_FLAT_WRIST_Y, P(sd + 'Hand', i)[2]])
        reach = lambda dy, sd: np.linalg.norm(wr_of(sd) - upper(L[sd + 'Shoulder'], pel + np.array([0, dy, 0]))) / ARM_E[sd]
        lo, hi = 0.0, 0.15
        if min(reach(0, sd) for sd in locked_sides) < STRAIGHT:
            for _ in range(40):
                mid = (lo + hi) / 2
                if min(reach(mid, sd) for sd in locked_sides) < STRAIGHT and max(reach(mid, sd) for sd in locked_sides) < 0.995: lo = mid
                else: hi = mid
            pel = pel + np.array([0, lo, 0])
    for _ in range(20):   # planted arms must stay reachable on the Snow rig (editor refuses unreachable locked hands)
        worst = None
        for sd in locked_sides:
            wr = np.array([P(sd + 'Hand', i)[0], SNOW_FLAT_WRIST_Y, P(sd + 'Hand', i)[2]]); dv = wr - upper(L[sd + 'Shoulder'], pel)
            ex = np.linalg.norm(dv) - ARM_E[sd] * 0.995
            if ex > 1e-5 and (worst is None or ex > worst[0]): worst = (ex, dv / np.linalg.norm(dv))
        if worst is None: break
        pel = pel + worst[1] * worst[0]
    pose = {'version': 1, 'pelvis': pel.tolist(), 'bodyQuaternion': m2q(Rp).tolist(), 'torsoQuaternion': m2q(Rtq).tolist(),
            'groundLock': True, 'limbs': {}}
    for sd, sg in (('left', 1), ('right', -1)):
        sh_e = upper(L[sd + 'Shoulder'], pel); hip_e = pel + Rp @ (L[sd + 'Hip'] - L['pelvis'])
        wr_r = P(sd + 'Hand', i); el_r = P(sd + 'Forearm', i); s_r = P(sd + 'UpperArm', i)
        locked = LOCK[sd]
        wrist = np.array([wr_r[0], SNOW_FLAT_WRIST_Y, wr_r[2]]) if locked else sh_e + (wr_r - s_r)
        elbow = sh_e + (el_r - s_r)
        elbow_pole = elbow + 0.30 * (W(sd + 'UpperArm', i) @ -Z)         # Pose-Hub: elbow crease = upper-arm +Z
        Wh = W(sd + 'Hand', i)
        hq = frame(Wh @ (sg * X), Wh @ -Y) @ SNOW_HAND[sd].T
        an_r = P(sd + 'Foot', i); kn_r = P(sd + 'Shin', i); hp_r = hips_r[sd]
        if an_r[1] < FOOT_PLANT_Y: ankle = an_r.copy()
        else: ankle = hip_e + (an_r - hp_r) * RATIO
        knee = hip_e + (kn_r - hp_r) * RATIO
        knee_pole = knee + 0.30 * (W(sd + 'Thigh', i) @ Z)              # Pose-Hub: knee front = thigh +Z
        pose['limbs'][sd] = {'wrist': wrist.tolist(), 'elbowPole': elbow_pole.tolist(), 'ankle': ankle.tolist(), 'kneePole': knee_pole.tolist(),
                             'handQuaternion': m2q(hq).tolist(), 'footQuaternion': m2q(W(sd + 'Foot', i)).tolist(), 'handLocked': locked}
    return pose

def rot_between(i, j):
    M = W('pelvis', i).T @ W('pelvis', j); c = (np.trace(M) - 1) / 2; return math.degrees(math.acos(max(-1, min(1, c))))

# key moments (r7 seconds): entry names from move_2000_r5.py K list; exit = entry reversed (T_SPIN1 + T_SPIN0 - t)
T0, T1 = 1.40, 3.30
if REVN >= 11: T0, T1 = 1.80, 3.70   # r11: slower entry (spin starts 1.80 s)
ENTRY = [(0.00, '站立'), (0.24, '迈步起势'), (0.40, '宽站拧腰蓄力'), (0.56, '右手前伸找地'), (0.64, '右手撑地'),
         (0.75, '后腿抡起'), (0.85, '蹬地翻上 · 左手找地'), (0.97, '双手撑地 · 分腿倒立'), (1.14, '右手离地 · 带转'),
         (1.27, '叠手并腿夹头')]
if REVN >= 9:   # r9: entry re-keyed from the reference videos (face camera -> turn + hinge -> plant -> kick over -> left hand lands ahead)
    ENTRY = [(0.00, '面向镜头展臂'), (0.22, '左转迈步'), (0.34, '弓步屈髋 · 右手下探'), (0.46, '右手找地'), (0.58, '右手撑地 · 后腿抡起'),
             (0.68, '前脚蹬地'), (0.80, '左臂侧平伸直'), (0.90, '左臂下落'), (1.00, '左手落地 · 分腿倒立'), (1.12, '右手离地'),
             (1.19, '屈腿 · 右手过去'), (1.27, '叠手屈腿夹头')]
if REVN >= 10:   # r10: r9 mirrored (left hand plants first, right hand is the axis), hips driven over the hand, wide split, drive
    ENTRY = [(0.00, '面向镜头展臂'), (0.22, '右转迈步'), (0.34, '弓步屈髋 · 左手下探'), (0.46, '左手找地 · 顶髋'), (0.58, '左手撑地 · 后腿抡起'),
             (0.68, '大劈叉 · 前脚蹬地'), (0.80, '右臂侧平伸直'), (0.90, '右臂下落'), (1.00, '右手落地 · 分腿倒立'), (1.12, '左手离地'),
             (1.19, '屈腿 · 左手过去'), (1.27, '叠手屈腿夹头')]
if REVN >= 11:   # r11: refs + HMR2 data: legs together at the plant, kick after it, support foot on the first-hand side, 0.5 m hands, walk-over before the stack
    ENTRY = [(0.00, '面向镜头展臂'), (0.20, '转身'), (0.32, '左脚上步'), (0.48, '屈髋侧转 · 左手下探'), (0.62, '左手找地'),
             (0.72, '左手撑地 · 两腿并拢'), (0.84, '右腿后摆 · 顶髋'), (0.96, '髋过撑地手'), (1.04, '左脚蹬离'), (1.12, '右臂侧平落下'),
             (1.19, '右手落地'), (1.33, '分腿倒立'), (1.40, '移到右手上方'), (1.49, '左手离地'), (1.57, '屈腿 · 左手过去'), (1.66, '叠手屈腿夹头')]
EXIT = [(round(T1 + T0 - t, 3), nm) for t, nm in reversed(ENTRY)]
EXIT_NAMES = {'站立': '落地站立', '迈步起势': '收步', '宽站拧腰蓄力': '宽站落地', '右手前伸找地': '右手离地起身',
              '右手撑地': '右手撑地 · 出', '后腿抡起': '后腿落下', '蹬地翻上 · 左手找地': '左手离地 · 落腿',
              '双手撑地 · 分腿倒立': '双手撑地 · 分腿 · 出', '右手离地 · 带转': '右手落地 · 拆叠', '叠手并腿夹头': '拆叠手 · 分腿'}
if REVN >= 9:
    EXIT_NAMES = {'面向镜头展臂': '落地站立', '左转迈步': '收步转回', '弓步屈髋 · 右手下探': '弓步起身', '右手找地': '右手离地',
                  '右手撑地 · 后腿抡起': '右手撑地 · 后腿落下', '前脚蹬地': '前脚落地', '左臂侧平伸直': '左臂侧平抬起', '左臂下落': '左手离地',
                  '左手落地 · 分腿倒立': '双手撑地 · 分腿 · 出', '右手离地': '右手落地 · 拆叠', '屈腿 · 右手过去': '右手回撑', '叠手屈腿夹头': '拆叠手 · 屈腿'}
if REVN >= 10:
    EXIT_NAMES = {'面向镜头展臂': '落地站立', '右转迈步': '收步转回', '弓步屈髋 · 左手下探': '弓步起身', '左手找地 · 顶髋': '左手离地',
                  '左手撑地 · 后腿抡起': '左手撑地 · 后腿落下', '大劈叉 · 前脚蹬地': '前脚落地', '右臂侧平伸直': '右臂侧平抬起', '右臂下落': '右手离地',
                  '右手落地 · 分腿倒立': '双手撑地 · 分腿 · 出', '左手离地': '左手落地 · 拆叠', '屈腿 · 左手过去': '左手回撑', '叠手屈腿夹头': '拆叠手 · 屈腿'}
if REVN >= 11:
    EXIT_NAMES = {'面向镜头展臂': '落地站立', '转身': '转回', '左脚上步': '收步', '屈髋侧转 · 左手下探': '弓步起身', '左手找地': '左手离地',
                  '左手撑地 · 两腿并拢': '左手撑地 · 两脚落地', '右腿后摆 · 顶髋': '右腿落下', '髋过撑地手': '髋回撤', '左脚蹬离': '左脚落地',
                  '右臂侧平落下': '右臂侧平抬起', '右手落地': '右手离地', '分腿倒立': '分腿倒立 · 出', '移到右手上方': '身体移回中间',
                  '左手离地': '左手落地 · 拆叠', '屈腿 · 左手过去': '左手回撑', '叠手屈腿夹头': '拆叠手 · 屈腿'}
keys = [(t, nm, 'entry') for t, nm in ENTRY] + [(T0, '叠手旋转开始', 'spin')]
# spin: split evenly so no neighbour pair turns more than max-turn degrees
f0, f1 = round(T0 * FPS), round(T1 * FPS)
spin_frames = [f0]
while spin_frames[-1] < f1:
    a = spin_frames[-1]; b = a + 1
    while b < f1 and rot_between(a, b + 1) <= A.max_turn: b += 1
    spin_frames.append(min(b, f1))
spin_frames = spin_frames[1:]
for k, f in enumerate(spin_frames):
    keys.append((f / FPS, '叠手旋转结束 · 减速' if f == f1 else f'叠手旋转 {k + 1}', 'spin'))
keys += [(t, EXIT_NAMES[nm], 'exit') for t, nm in EXIT if t > T1 + 1e-6]
# split any remaining segment that turns too far (entry kick-over turns fast)
def frm(t): return min(NF - 1, int(round(t * FPS)))
changed = True
while changed:
    changed = False
    for a in range(len(keys) - 1):
        ia, ib = frm(keys[a][0]), frm(keys[a + 1][0])
        if ib - ia > 1 and rot_between(ia, ib) > A.max_turn:
            tm = (ia + ib) // 2 / FPS; keys.insert(a + 1, (tm, keys[a][1].split(' · ')[0] + ' · 过渡', keys[a][2])); changed = True; break
keys[-1] = (T_END, '落地站立', 'exit')

GUIDE = {
    'entry': dict(hands='撑地手掌心朝下、手指朝身体外侧；手臂接近伸直，肩主动推地。', feet='起势时双脚踩稳；后腿抡起时绷脚尖、整条腿伸长。',
                  body='宽站拧腰蓄力，右手先撑、后腿抡圈带髋翻上，左手接着落地成分腿倒立。', cue='先找地，再抡腿；手臂伸长撑住。',
                  exercises=['wristLoad', 'scapPush', 'trunkControl']),
    'spin': dict(hands='左手为轴手，掌心朝下、手指朝外；右手扣在左手腕上叠手。', feet='双腿并拢绷脚尖，身体竖直倒立。',
                 body='叠手倒立，两肘外张，靠肩和躯干的扭转带动整体旋转。', cue='轴手压稳，身体拉长，转动由肩带出。',
                 exercises=['scapPush', 'wristLoad', 'trunkControl']),
    'exit': dict(hands='拆叠手，右手回到撑地点，掌心朝下、手指朝外；手臂接近伸直。', feet='分腿、落腿，脚尖先着地再踩稳。',
                 body='按入场倒放原路落地，回到起始站姿。', cue='减速、拆手、落腿、站起。', exercises=['scapPush', 'trunkControl', 'wristLoad']),
}
PHASE = {'entry': 'front', 'spin': 'sideA', 'exit': 'rear'}
steps = []
for k, (t, nm, part) in enumerate(keys):
    i = frm(t)
    pose = editor_pose(i)
    steps.append({'id': f'b2000-{k:02d}', 'name': nm, 'phase': PHASE[part], 'part': part, 'r7Time': round(i / FPS, 3), 'r7Frame': i,
                  'stepNumber': k + 1, 'guide': GUIDE[part], 'pose': pose})
# non-loop move: it starts and ends standing; make the last key exactly the first so the editor's loop closes on a hold
steps[-1]['pose'] = json.loads(json.dumps(steps[0]['pose']))
N = len(steps); period = round(T_END * N / (N - 1), 3)
seq = {'format': 'flare-demonstration', 'version': 1, 'title': ('2000 · 面向镜头起势 → 左手撑地侧翻 → 右手轴叠手旋转 → 原路落地' if REVN >= 10 else '2000 · 面向镜头起势 → 侧翻撑地 → 叠手旋转 → 原路落地' if REVN >= 9 else '2000 · 站立起势 → 叠手旋转 → 原路落地'), 'period': period,
       'source': {'kind': 'move-2000', 'revision': f'pose-hub-2000-{A.rev}', 'file': f'b2000/{A.rev}.npz', 'script': 'b2000/editor/to_editor.py',
                  'fps': FPS, 'r7Duration': T_END, 'legRatio': round(RATIO, 4), 'stepIds': [s['id'] for s in steps]},
       'steps': steps}
json.dump(seq, open(A.out, 'w'), ensure_ascii=False, indent=1)
print('steps', N, 'period', period, file=sys.stderr)
for k, s in enumerate(steps):
    lk = ''.join('L' if s['pose']['limbs']['left']['handLocked'] else '-') + ('R' if s['pose']['limbs']['right']['handLocked'] else '-')
    turn = rot_between(steps[k - 1]['r7Frame'], s['r7Frame']) if k else 0
    print(f"{k:02d} t={s['r7Time']:.2f} turn={turn:5.1f} lock={lk} {s['name']}", file=sys.stderr)
