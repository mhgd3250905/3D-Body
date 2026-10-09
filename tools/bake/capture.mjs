// Bake step 1/2: record the final runtime motion exactly as the viewer plays it.
//
// Opens the built app (dist/, served by tools/server.mjs) headless with default URL
// params (+ ?inspect to reach the viewer), integrates the viewer's own paced clock
// (viewer.paceStep, speed 1) to map wall time -> sequence time, and samples one full
// seamless loop at 60 fps. For every frame it records the local position / quaternion /
// scale of the 20 deform bones, the two runtime spine helpers (spineLower/spineUpper,
// spine-helpers.js), the armature and the scene root, plus world joint positions and a
// subset of skinned vertices for verification.
//
// usage: node tools/bake/capture.mjs [--port 8810] [--fps 60] [--out tools/bake/out/capture.json]
// needs: npm run build; node tools/server.mjs --port <port> running; playwright + chromium
//        (PLAYWRIGHT_MODULE=/abs/path/to/node_modules/playwright/index.mjs if not resolvable)
import fs from 'node:fs';
import path from 'node:path';

const arg = (name, fallback) => { const i = process.argv.indexOf('--' + name); return i >= 0 ? process.argv[i + 1] : fallback; };
const port = Number(arg('port', 8810)), fps = Number(arg('fps', 60));
const out = arg('out', 'tools/bake/out/capture.json');
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');

const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 900, height: 800 } });
const errors = []; page.on('pageerror', e => errors.push(e.message));
await page.goto(`http://127.0.0.1:${port}/?inspect`);
await page.waitForFunction(() => document.documentElement.dataset.ready === 'true', null, { timeout: 180000 });

const result = await page.evaluate(({ fps }) => {
  const v = window.flareInspector.viewer, motion = v.motion, coach = v.coach;
  v.playing = false;
  const period = motion.getMetrics().period;
  // ---- paced clock at speed 1: integrate the viewer's own paceStep finely ----
  const savedSpeed = v.speed; v.speed = 1; v.pacing = null;
  const dt = 1 / 2400; const wall = [0], raw = [0]; v.time = 0;
  while (v.time < period) { v.time += v.paceStep(dt); wall.push(wall.length * dt); raw.push(v.time); if (wall.length > 2400 * 120) throw new Error('paced clock did not complete a loop'); }
  const n = raw.length - 1, loopWall = wall[n - 1] + dt * (period - raw[n - 1]) / (raw[n] - raw[n - 1]);
  const rawAt = w => { const x = w / dt, i = Math.min(Math.floor(x), n - 1), f = x - i; return Math.min(period, raw[i] + (raw[i + 1] - raw[i]) * f); };
  // the viewer's own 60 fps playback (delta = 1/60, 8 sub-steps) for reference
  v.time = 0; let frames60 = 0; while (v.time < period) { v.time += v.paceStep(1 / 60); frames60++; }
  v.speed = savedSpeed;

  const names = ['pelvis', 'torso', 'neck', 'head', 'leftScapula', 'leftUpperArm', 'leftForearm', 'leftHand', 'leftThigh', 'leftPatella', 'leftShin', 'leftFoot', 'rightScapula', 'rightUpperArm', 'rightForearm', 'rightHand', 'rightThigh', 'rightPatella', 'rightShin', 'rightFoot', 'spineLower', 'spineUpper'];
  const nodes = names.map(name => coach.getObjectByName(name));
  const rig = coach.getObjectByName('Coach_Rig');
  const body = coach.getObjectByName('Coach_Body');
  const vertexIds = []; for (let i = 0; i < body.geometry.attributes.position.count; i += 97) vertexIds.push(i);
  const P = new v.coach.position.constructor(), Q = new v.coach.quaternion.constructor(), S = new v.coach.position.constructor();
  const r = x => Math.round(x * 1e7) / 1e7;
  const sample = time => {
    v.setTime(time); motion.update(time); coach.updateMatrixWorld(true);
    // helpers carry matrixWorld only (matrixAutoUpdate off); armature is identity, so local = world
    const local = nodes.map(node => {
      if (node.matrixAutoUpdate) return [...node.position.toArray(), ...node.quaternion.toArray(), ...node.scale.toArray()].map(r);
      node.matrixWorld.decompose(P, Q, S); return [...P.toArray(), ...Q.toArray(), ...S.toArray()].map(r);
    });
    const world = nodes.map(node => { const m = node.matrixWorld.elements; return [m[12], m[13], m[14]].map(r); });
    const rootT = [coach, rig].map(o => [...o.position.toArray(), ...o.quaternion.toArray(), ...o.scale.toArray()].map(r));
    const verts = []; for (const i of vertexIds) { body.getVertexPosition(i, P); P.applyMatrix4(body.matrixWorld); verts.push(r(P.x), r(P.y), r(P.z)); }
    return { local, world, root: rootT, verts };
  };
  const N = Math.round(loopWall * fps);
  const frames = [];
  for (let i = 0; i <= N; i++) { const w = i * loopWall / N, t = rawAt(w); frames.push({ wall: w, raw: t, ...sample(t) }); }
  // live probes between bake samples (interpolation check) + determinism re-sample
  const probes = []; for (let k = 0; k < 24; k++) { const w = (k + 0.37) * loopWall / 24, t = rawAt(w); probes.push({ wall: w, raw: t, ...sample(t) }); }
  const again = sample(frames[123].raw);
  const det = Math.max(...again.world.flat().map((x, i) => Math.abs(x - frames[123].world.flat()[i])));
  const demo = window.flareInspector.demonstration();
  const smoothLoop = (motion.getLoopTimeScale?.(period * .995) ?? 1) > 1.5;
  return { names, period, loopWall, N, frames60, dtIntegrate: dt, vertexIds, frames, probes, determinismMaxDiff: det, smoothLoop,
    sequence: { period: demo.period, skippedSteps: demo.skippedSteps || [], steps: demo.steps.map(s => ({ sourceStepNumber: s.sourceStepNumber ?? s.source?.stepNumber, phase: s.phase, pose: { limbs: { left: { handLocked: s.pose?.limbs?.left?.handLocked }, right: { handLocked: s.pose?.limbs?.right?.handLocked } } } })) },
    userAgent: navigator.userAgent, url: location.href };
}, { fps });
result.errors = errors; result.capturedAt = new Date().toISOString();
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(result));
console.log(`captured ${result.frames.length} frames, loop ${result.loopWall.toFixed(4)} s wall (viewer 60fps playback: ${result.frames60} frames), determinism ${result.determinismMaxDiff}, errors ${errors.length}`);
await browser.close();
