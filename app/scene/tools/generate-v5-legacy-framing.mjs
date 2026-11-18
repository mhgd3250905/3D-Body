import fs from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { Box3, Vector3 } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { createBakedMotion } from '../src/baked-motion.js';
import { buildMmRest, createSurfaceSelection } from '../src/mapped-mesh.js';
import { GROUPS, phaseAt, phaseTicks } from '../src/phase.js';

globalThis.ProgressEvent ??= class { constructor(type, fields) { Object.assign(this, { type }, fields); } };
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });

const rig = JSON.parse(fs.readFileSync(new URL('../public/coach/coach-v41-rig.json', import.meta.url)));
const source = new URL('../public/coach/flare-coach-v42-r17-animated.meshopt.glb.gz', import.meta.url);
const raw = gunzipSync(fs.readFileSync(source));
const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
  .parseAsync(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength), '');
const motion = createBakedMotion(gltf, rig);
const { clock } = motion;
const loop = new Box3();
for (let i = 0; i < 18; i++) {
  motion.update(i * clock.period / 18);
  const { min, max } = motion.getMetrics().bounds;
  loop.union(new Box3(new Vector3(...min), new Vector3(...max)));
}
loop.expandByScalar(rig.height * 0.045);

const sampleTimes = new Set(Array.from({ length: 163 }, (_, i) => clock.duration * i / 162));
for (const [i, tick] of phaseTicks.entries()) {
  const midpoint = (tick.time + (phaseTicks[i + 1]?.time ?? clock.period)) / 2;
  sampleTimes.add(clock.toWall(tick.time));
  sampleTimes.add(clock.toWall(midpoint - 1e-8));
  sampleTimes.add(clock.toWall(midpoint));
}
const times = [...sampleTimes].sort((a, b) => a - b).map(wall => clock.toSequence(wall));
const round = value => Number(value.toFixed(8));
const poses = times.map(time => {
  motion.update(time);
  const { min, max } = motion.getMetrics().bounds;
  return [...min, ...max].map(round);
});
const surface = createSurfaceSelection(buildMmRest(motion, gltf.scene));
const directions = Object.fromEntries(Object.keys(GROUPS).map(id => [id, []]));
for (const [id, rows] of Object.entries(directions)) {
  for (const side of ['left', 'right', 'both']) {
    // The focus field changes only with group and side. Keep the original
    // posing and camera direction calculations for each sampled moment.
    surface.show(id, [{ groupId: id, side }], true);
    for (const [i, time] of times.entries()) {
      if ((phaseAt(time).items.find(item => item.groupId === id)?.side ?? 'both') !== side) continue;
      motion.update(time);
      rows[i] = surface.focusDirection()?.toArray().map(round) ?? null;
    }
  }
}
surface.dispose();
motion.dispose();
const data = {
  baseline: 'cf654dde8601bd6a2a10475136e9581119e4994d',
  loop: [...loop.min.toArray(), ...loop.max.toArray()],
  times, poses, directions,
};
fs.writeFileSync(new URL('../src/v5/legacy-framing.json', import.meta.url), JSON.stringify(data) + '\n');
