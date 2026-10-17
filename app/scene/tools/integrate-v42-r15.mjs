// Publish only the byte-identified, user-accepted R15 into new runtime assets.
// Use the frozen accepted R15 output; no animation rebake is needed:
// node app/scene/tools/integrate-v42-r15.mjs --from output/<new-batch>
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { MeshoptEncoder } from 'meshoptimizer';
import { phaseTimeline, samplePhase, phaseItems, supportLabel } from '../source/v41-runtime/src/flare-phase-muscles.js';
import { FLARE_GROUPS } from '../source/v41-runtime/src/flare-muscle-groups.js';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const args = process.argv.slice(2);
if (args.length !== 2 || args[0] !== '--from') throw Error('Usage: node app/scene/tools/integrate-v42-r15.mjs --from output/<batch>');
const from = path.resolve(root, args[1]);
assert.equal(path.dirname(from), path.join(root, 'output'), 'Use an independent output batch');
const read = name => fs.readFileSync(path.join(root, name));
const json = name => JSON.parse(read(name));
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const release = json('tools/motion-v42-r15/releases/v42-r15.json');
const comparison = JSON.parse(fs.readFileSync(path.join(from, 'comparison-clock.json')));
const clockInput = release.requiredInputs.find(x => x.path.endsWith('/comparison-clock.json'));
const inheritedBytes = read(clockInput.path);
assert.equal(sha(inheritedBytes), clockInput.sha256, 'Frozen R14 clock changed');
const inherited = JSON.parse(inheritedBytes);
assert.deepEqual(comparison.phases, inherited.phases);
let maxInheritedClockError = 0;
for (let i = 0; i < comparison.baselineSequenceTimes.length; i++) maxInheritedClockError = Math.max(maxInheritedClockError, Math.abs(comparison.baselineSequenceTimes[i] - inherited.baselineSequenceTimes[i]));
assert.ok(maxInheritedClockError < 1e-12, 'R15 must retain the accepted inherited teaching clock');
const sequence = json('app/scene/source/coach/flare-sequence-v41.json');
assert.equal(comparison.duration, release.duration);
assert.equal(comparison.phases.length, release.frames);
assert.equal(comparison.baselineSequenceTimes.length, release.frames);
assert.equal(comparison.baselineSequenceTimes[0], 0);
assert.equal(comparison.baselineSequenceTimes.at(-1), 9);
for (let i = 1; i < release.frames; i++) {
  assert.ok(comparison.phases[i] > comparison.phases[i - 1]);
  assert.ok(comparison.baselineSequenceTimes[i] > comparison.baselineSequenceTimes[i - 1], 'R15 teaching clock must be invertible');
}
// Existing historical assets are never rewritten. A rerun may only reproduce
// identical bytes at these v42-specific paths.
const published = [];
function publish(relative, bytes) {
  const filename = path.join(root, relative);
  if (fs.existsSync(filename)) assert.ok(read(relative).equals(bytes), 'Refusing different bytes at ' + relative);
  else { fs.mkdirSync(path.dirname(filename), { recursive: true }); fs.writeFileSync(filename, bytes); }
  published.push({ destination: relative, bytes: bytes.length, sha256: sha(bytes) });
}
await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
for (const asset of release.assets) {
  const raw = fs.readFileSync(path.join(from, asset.file));
  assert.equal(raw.length, asset.bytes); assert.equal(sha(raw), asset.sha256, 'Not the accepted R15');
  const base = asset.kind === 'coach' ? 'flare-coach-v42-r15-animated' : 'flare-coach-v42-r15-training-human';
  publish(`app/scene/source/coach/${base}.glb`, raw);
  const document = await io.readBinary(raw);
  assert.equal(document.getRoot().listAnimations()[0].getName(), 'flare_v42_candidate_loop');
  document.createExtension(EXTMeshoptCompression).setRequired(true)
    .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });
  // Encoding only: no quantization, resampling, topology or material changes.
  publish(`app/scene/public/coach/${base}.meshopt.glb.gz`, gzipSync(await io.writeBinary(document), { level: 9 }));
  if (asset.kind === 'coach') publish(`public/coach/${base}.glb`, raw);
}
const clock = { version: 'v42-r15', frameTimes: comparison.phases.map(p => p * comparison.duration), sequenceTime: comparison.baselineSequenceTimes };
const timeline = phaseTimeline(sequence, { smooth: true });
const frames = clock.frameTimes.map((time, frame) => {
  const sequenceTime = clock.sequenceTime[frame];
  const { current } = samplePhase(timeline, sequenceTime);
  const items = phaseItems(current.phase, current.support);
  return { frame, time, sequenceTime, keyIndex: current.index, phaseSource: current.phase.source, phaseId: current.phase.id, support: current.support,
    primary: items.filter(x => x.level === 'primary').map(x => ({ id: x.groupId, side: x.side })),
    secondary: items.filter(x => x.level === 'secondary').map(x => ({ id: x.groupId, side: x.side })) };
});
const phases = { format: 'flare-phases-v1', version: 'v42-r15', clip: 'flare_v42_candidate_loop', fps: 540 / comparison.duration,
  duration: comparison.duration, frameCount: frames.length,
  keys: timeline.keys.map(key => ({ keyIndex: key.index, sequenceTime: key.time, phaseId: key.phase.id, source: key.phase.source, support: key.support, supportLabel: supportLabel(key.support) })),
  phaseDefs: Object.fromEntries(timeline.keys.map(key => [key.phase.id, { source: key.phase.source, name: key.phase.name, detail: key.phase.detail, caption: key.phase.caption }])),
  groups: Object.fromEntries(FLARE_GROUPS.map(group => [group.groupId, { label: group.label, section: group.section, colour: group.colour }])), frames };
const clockBytes = Buffer.from(JSON.stringify(clock) + '\n');
publish('app/scene/src/v42-r15-clock.json', clockBytes);
publish('public/coach/flare-v42-r15-clock.json', clockBytes);
publish('app/scene/src/v42-r15-phases.json', Buffer.from(JSON.stringify(phases) + '\n'));
const manifest = { version: 'v42-r15', motionSourceRef: release.sourceVersionRef, tag: release.gitTag,
  duration: release.duration, frames: release.frames, bones: release.bones, tracks: release.tracks, clip: 'flare_v42_candidate_loop',
  clock: 'Host sequence 0–9 maps through the accepted R15 authored phase clock to the 1.35-second clip. Playback speed is applied once.',
  phaseSemantics: 'Source teaching/support groups remapped through R15 sourceSequenceTime, not uniform sequence or old v41 frame indices. Functional associations, not EMG measurements.',
  encoding: 'Lossless meshopt + gzip relative to accepted R15; no quantization, simplification, animation resampling or retargeting.',
  acceptance: release.acceptance, license: json('tools/motion-v42/releases/v42-r12.json').license, inheritedClock: { source: clockInput.path, sha256: clockInput.sha256, maximumSequenceTimeError: maxInheritedClockError }, assets: published };
const manifestBytes = Buffer.from(JSON.stringify(manifest, null, 2) + '\n');
publish('app/scene/tools/v42-r15-source-manifest.json', manifestBytes);
console.log(JSON.stringify({ version: manifest.version, assets: manifest.assets, sourceManifest: 'app/scene/tools/v42-r15-source-manifest.json' }, null, 2));
