// Read-only actual-GLB check; run from any directory. Relative paths use project root.
// node tools/motion-v42/verify-lateral-transition.mjs [candidate.glb] [--baseline baseline.glb]
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { loadGlb } from '../../app/scene/tools/bake-v41-node.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const sceneRoot = path.join(root, 'app/scene');
const defaultCandidate = 'output/flare-v42-r12-20261015/flare-training-v42-candidate.glb';
const windows = { right: [.82, .88], left: [.36, .42] };
const intervals = 240;
const limitsMm = { right: { shoulder: .01, torso: .4 }, left: { shoulder: .01, torso: .01 } };

function parseArgs(argv) {
  let candidate, baseline;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--baseline') {
      if (baseline !== undefined || !argv[i + 1] || argv[i + 1].startsWith('--')) {
        throw new Error('Supply exactly one path after --baseline.');
      }
      baseline = argv[++i];
    } else if (argv[i].startsWith('-') || candidate !== undefined) {
      throw new Error(`Unexpected argument: ${argv[i]}`);
    } else candidate = argv[i];
  }
  const resolve = value => path.resolve(root, value);
  return { candidate: resolve(candidate ?? defaultCandidate), baseline: baseline === undefined ? null : resolve(baseline) };
}

// Maximum outward increase after any earlier minimum, not sum of positive steps.
function maximumReturn(rows, key) {
  let low = rows[0], maximum = 0, from = rows[0].phase, to = rows[0].phase;
  for (const row of rows) {
    if (row[key] < low[key]) low = row;
    const increase = row[key] - low[key];
    if (increase > maximum) { maximum = increase; from = low.phase; to = row.phase; }
  }
  return { maximumOutwardReturnMm: maximum * 1000, fromPhase: from, toPhase: to };
}

async function measure(filename) {
  if (!fs.existsSync(filename) || !fs.statSync(filename).isFile()) throw new Error(`GLB not found: ${filename}`);
  const bytes = fs.readFileSync(filename);
  // loadGlb resolves against app/scene, not cwd or this script's directory.
  const gltf = await loadGlb(path.relative(sceneRoot, filename).split(path.sep).map(encodeURIComponent).join('/'));
  const model = gltf.scene, clip = gltf.animations[0];
  if (!clip || !Number.isFinite(clip.duration) || clip.duration <= 0) throw new Error(`Missing valid animation: ${filename}`);
  const bones = {};
  for (const name of ['torso', 'leftUpperArm', 'rightUpperArm', 'leftHand', 'rightHand']) {
    const bone = model.getObjectByName(name);
    if (!bone?.isBone) throw new Error(`Missing bone ${name}: ${filename}`);
    bones[name] = bone;
  }
  const mixer = new THREE.AnimationMixer(model), action = mixer.clipAction(clip);
  action.setLoop(THREE.LoopOnce, 1); action.clampWhenFinished = true; action.play();
  const sides = {};
  for (const [side, [start, end]] of Object.entries(windows)) {
    const rows = [], opposite = side === 'right' ? 'left' : 'right';
    for (let i = 0; i <= intervals; i++) {
      const phase = start + (end - start) * i / intervals;
      action.enabled = true; action.paused = false; mixer.setTime(phase * clip.duration);
      model.updateMatrixWorld(true);
      const shoulder = bones[side + 'UpperArm'].getWorldPosition(new THREE.Vector3());
      const other = bones[opposite + 'UpperArm'].getWorldPosition(new THREE.Vector3());
      const wrist = bones[side + 'Hand'].getWorldPosition(new THREE.Vector3());
      const outward = shoulder.clone().sub(other);
      const torso = bones.torso.getWorldQuaternion(new THREE.Quaternion());
      if (![...shoulder, ...other, ...wrist, ...torso].every(Number.isFinite) || outward.length() < 1e-6 || torso.length() < 1e-6) {
        throw new Error(`Invalid shoulder/torso transform at ${side} phase ${phase}: ${filename}`);
      }
      const relative = wrist.sub(shoulder);
      const shoulderValue = relative.dot(outward.normalize());
      const local = relative.clone().applyQuaternion(torso.normalize().invert());
      rows.push({ phase, shoulder: shoulderValue, torso: local.x * (side === 'right' ? -1 : 1) });
    }
    sides[side] = { window: [start, end], sampleCount: rows.length,
      shoulder: maximumReturn(rows, 'shoulder'), torso: maximumReturn(rows, 'torso') };
  }
  mixer.stopAllAction(); mixer.uncacheRoot(model);
  return { path: filename, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), clip: clip.name,
    durationSeconds: clip.duration, sampleCount: Object.values(sides).reduce((n, side) => n + side.sampleCount, 0), sides };
}

try {
  const args = parseArgs(process.argv.slice(2));
  // An explicitly requested missing baseline is an error, never a silent fallback.
  if (args.baseline && !fs.existsSync(args.baseline)) throw new Error(`Baseline GLB not found: ${args.baseline}`);
  const candidate = await measure(args.candidate);
  const baseline = args.baseline ? await measure(args.baseline) : null;
  const failures = [];
  for (const [side, axes] of Object.entries(limitsMm)) for (const [axis, limit] of Object.entries(axes)) {
    const measured = candidate.sides[side][axis];
    measured.limitMm = limit; measured.passed = measured.maximumOutwardReturnMm <= limit;
    if (baseline) measured.baselineMaximumOutwardReturnMm = baseline.sides[side][axis].maximumOutwardReturnMm;
    if (!measured.passed) failures.push({ side, axis, measuredMm: measured.maximumOutwardReturnMm, limitMm: limit });
  }
  console.log(JSON.stringify({ format: 'flare-lateral-transition-check-v1', passed: failures.length === 0,
    method: { sampling: 'Actual GLB AnimationMixer interpolation; 241 samples per window, phase step 0.00025. These are not additional authored keyframes.',
      shoulderAxis: 'Wrist relative to same-side shoulder, projected onto opposite-shoulder to same-side-shoulder unit vector.',
      torsoAxis: 'Same shoulder-relative wrist transformed by inverse torso world quaternion; right -x / left +x outward for this rig.',
      maximumReturn: 'Largest later outward coordinate minus any earlier minimum within the window; not cumulative positive travel.',
      thresholds: 'Regression tolerances for accepted R12, not human biomechanics or realism criteria.',
      limitations: 'Only lateral wrist return in the stated windows; not full-vector jitter, collision, dynamics or visual acceptance.' },
    candidate, ...(baseline ? { baseline } : {}), failures }, null, 2));
  process.exitCode = failures.length ? 1 : 0;
} catch (error) {
  console.error(JSON.stringify({ error: error.message }));
  process.exitCode = 2;
}
