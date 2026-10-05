import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync, gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

// Geometry from ashemag/human-atlas, retaining the original BodyParts3D IDs.
// Only repack existing optimized buffers; do not remesh or change coordinates.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, '.reference', 'human-atlas', 'public', 'models');
const output = path.join(root, 'public', 'anatomy');
fs.mkdirSync(output, { recursive: true });
const sourceRoot = path.resolve(source, '..', '..');
const attribution = fs.readFileSync(path.join(sourceRoot, 'public', 'ATTRIBUTION.md'), 'utf8');
fs.writeFileSync(path.join(output, 'ATTRIBUTION.md'), attribution + `

## Adaptations in this local fitness atlas

Source repository: https://github.com/ashemag/human-atlas
Source commit: 1c38bf35c254a891200d3cedecfd57abebe83d8d
Original application code: Copyright (c) 2026 ashemag, MIT. Full code license is
preserved in human-atlas-MIT.txt. The anatomy data remains CC BY 4.0.

The local atlas selects 238 skeleton structures and 399 skeletal-muscle meshes,
omitting organs, vessels, eye movement muscles and cardiac papillary muscles.
Existing optimized position, normal and index values are preserved exactly;
the buffers are repacked by layer into little-endian binary files with gzip.
Sixteen muscles originally mapped to skeletal/connective display layers are
reclassified as muscular. Original BodyParts3D/FMA identifiers, English names,
bounds and source-system mappings are preserved. Training-oriented anatomical
groups and Chinese display labels are added for selection. A separate optional
body-surface file is repacked from the original Skin structure.

This reference does not include independent meshes for rectus abdominis,
internal oblique, transversus abdominis, latissimus dorsi or quadratus lumborum.
The data is a static adult male reference; it has no animation rig or joint
weights. Any separate action demonstration is an illustrative reconstruction.
`);
fs.copyFileSync(path.join(sourceRoot, 'LICENSE'), path.join(output, 'human-atlas-MIT.txt'));
const atlas = JSON.parse(fs.readFileSync(path.join(source, 'atlas.json'), 'utf8'));
const sourceBuffers = atlas.chunks.map(chunk => fs.readFileSync(path.join(source, path.basename(chunk.url))));
const sourceCommit = '1c38bf35c254a891200d3cedecfd57abebe83d8d';
const sha256 = buffer => createHash('sha256').update(buffer).digest('hex');

// These named skeletal muscles were misclassified by the source display mapping.
const muscleCorrections = /fibularis|tibialis|tensor fasciae latae|subscapularis|levator scapulae/i;
// The fitness viewer does not need eye movement or cardiac papillary muscles.
const excludedMuscles = /papillary muscle|inferior oblique$|inferior rectus$|lateral rectus$|levator palpebrae|medial rectus$|superior oblique$|superior rectus$/i;
const muscularParts = atlas.parts.filter(part =>
  (part.system === 'muscular' || muscleCorrections.test(part.name)) && !excludedMuscles.test(part.name));
// This is the BodyParts3D axial + appendicular skeleton range. Keep vertebral
// disks and costal cartilage, but omit gums, teeth, larynx and nasal cartilage.
const skeletalParts = atlas.parts.filter(part => part.system === 'skeletal' && Number(part.id.slice(2)) >= 3152);

const groupDefinitions = [
  ['deltoids', '三角肌', 'Deltoids', /deltoid/i],
  ['triceps', '肱三头肌', 'Triceps', /triceps brachii|anconeus/i],
  ['serratus', '前锯肌', 'Serratus anterior', /serratus anterior/i],
  ['pectorals', '胸肌', 'Pectorals', /pectoralis/i],
  ['rotator-cuff', '肩袖', 'Rotator cuff', /supraspinatus|infraspinatus|teres minor|subscapularis/i],
  ['scapular', '肩胛稳定肌', 'Scapular muscles', /trapezius|rhomboid|levator scapulae/i],
  ['obliques', '腹外斜肌', 'External obliques', /external oblique/i],
  ['erectors', '竖脊肌群', 'Spinal extensors', /iliocostalis|longissimus|spinalis|lumbar rotator|thoracic rotator/i],
  ['hip-flexors', '髂腰肌', 'Iliopsoas', /psoas major|iliacus/i],
  ['glutes', '臀肌群', 'Gluteals', /gluteus/i],
  ['adductors', '髋内收肌群', 'Hip adductors', /adductor (brevis|longus|magnus|minimus)|gracilis|pectineus/i],
  ['quadriceps', '股四头肌', 'Quadriceps', /rectus femoris|vastus/i],
  ['hamstrings', '腘绳肌群', 'Hamstrings', /biceps femoris|semitendinosus|semimembranosus/i],
  ['forearms', '腕与前臂肌群', 'Forearm muscles', /carpi|pronator|supinator|brachioradialis|flexor digitorum (superficialis|profundus)|flexor pollicis longus|extensor digitorum$|extensor digiti minimi$|extensor indicis|extensor pollicis|abductor pollicis longus|palmaris longus/i],
  ['biceps', '肱二头肌与肱肌', 'Elbow flexors', /biceps brachii|brachialis|coracobrachialis/i],
  ['calves', '下腿肌群', 'Lower-leg muscles', /gastrocnemius|soleus|tibialis|fibularis|plantaris|popliteus|extensor digitorum longus|extensor hallucis longus|flexor digitorum longus|flexor hallucis longus/i],
  ['hip-rotators', '髋旋转与外展肌', 'Hip rotators', /gemellus|piriformis|obturator|quadratus femoris|tensor fasciae latae|sartorius/i],
  ['hands', '手内在肌', 'Intrinsic hand muscles', /of .* hand|opponens pollicis|abductor pollicis brevis|flexor pollicis brevis|adductor pollicis/i],
];
const groups = groupDefinitions.map(([id, label, name, pattern]) => ({
  id, label, name,
  elements: muscularParts.filter(part => pattern.test(part.name)).map(part => part.id),
}));
for (const group of groups) assert.ok(group.elements.length, `${group.id} has no geometry`);

function sideFor(part) {
  if (/\bleft\b/i.test(part.name)) return 'left';
  if (/\bright\b/i.test(part.name)) return 'right';
  if (part.bounds[1][0] < -0.005) return 'right';
  if (part.bounds[0][0] > 0.005) return 'left';
  return 'midline';
}

function pack(parts, filename, system, chunkIndex) {
  let bytes = 0;
  const segments = [];
  const append = (buffer, offset, length) => {
    const padding = (4 - bytes % 4) % 4;
    if (padding) { segments.push(Buffer.alloc(padding)); bytes += padding; }
    const start = bytes;
    segments.push(buffer.subarray(offset, offset + length));
    bytes += length;
    return start;
  };
  const packedParts = parts.map(part => {
    const buffer = sourceBuffers[part.chunk];
    const positions = append(buffer, part.positions, part.vertexCount * 12);
    const normals = append(buffer, part.normals, part.vertexCount * 6);
    const indices = append(buffer, part.indices, part.indexCount * 4);
    const memberships = groups.filter(group => group.elements.includes(part.id)).map(group => group.id);
    return {
      ...part, sourceSystem: part.system, system,
      chunk: chunkIndex, positions, normals, indices,
      side: sideFor(part), groups: memberships,
      muscleGroup: memberships[0] ?? (system === 'muscular' ? 'other-muscles' : null),
      tissue: system === 'skeletal' && /cartilage|disk/i.test(part.name) ? 'cartilage' : system === 'skeletal' ? 'bone' : system === 'muscular' ? 'muscle' : 'skin',
    };
  });
  const binary = Buffer.concat(segments);
  const compressed = gzipSync(binary, { level: 9, mtime: 0 });
  assert.deepEqual(gunzipSync(compressed), binary);
  fs.writeFileSync(path.join(output, filename + '.bin'), binary);
  fs.writeFileSync(path.join(output, filename + '.bin.gz'), compressed);
  return {
    parts: packedParts,
    chunk: {
      url: `/anatomy/${filename}.bin`, gzip: `/anatomy/${filename}.bin.gz`,
      bytes: binary.length, gzipBytes: compressed.length, system,
      sha256: sha256(binary), gzipSha256: sha256(compressed),
    },
  };
}

const bones = pack(skeletalParts, 'bones', 'skeletal', 0);
const muscles = pack(muscularParts, 'muscles', 'muscular', 1);
const parts = [...bones.parts, ...muscles.parts];
const ids = new Set(parts.map(part => part.id));
const concepts = atlas.concepts.map(concept => ({
  ...concept, elements: concept.elements.filter(id => ids.has(id)),
})).filter(concept => concept.elements.length);
const bounds = parts.reduce((result, part) => [
  result[0].map((value, axis) => Math.min(value, part.bounds[0][axis])),
  result[1].map((value, axis) => Math.max(value, part.bounds[1][axis])),
], [[Infinity, Infinity, Infinity], [-Infinity, -Infinity, -Infinity]]);
const manifest = {
  version: atlas.version,
  sex: 'male', source: 'BodyParts3D',
  sourceRepository: 'https://github.com/ashemag/human-atlas', sourceCommit,
  scope: 'Adult male reference skeleton and skeletal muscles for anatomy education',
  license: 'CC-BY-4.0', attribution: '/anatomy/ATTRIBUTION.md',
  coordinates: { units: 'meters', up: '+Y', anterior: '+Z', anatomicalLeft: '+X', bounds },
  optimized: atlas.optimized,
  packing: { endianness: 'little', alignment: 4, positionType: 'Float32', normalType: 'Int16 normalized', indexType: 'Uint32' },
  parts, chunks: [bones.chunk, muscles.chunk], concepts, groups,
  triangles: parts.reduce((total, part) => total + part.indexCount / 3, 0),
  classificationCorrections: parts.filter(part => part.system !== part.sourceSystem).map(part => ({ id: part.id, name: part.name, from: part.sourceSystem, to: part.system })),
  missingStructures: [
    { name: 'Rectus abdominis', label: '腹直肌' },
    { name: 'Internal oblique', label: '腹内斜肌' },
    { name: 'Transversus abdominis', label: '腹横肌' },
    { name: 'Latissimus dorsi', label: '背阔肌' },
    { name: 'Quadratus lumborum', label: '腰方肌' },
  ],
};
fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(manifest));

// Keep a separate optional surface manifest so a consumer never hides the
// muscles accidentally by rendering an opaque Skin part from the main list.
const skin = pack(atlas.parts.filter(part => part.id === 'FJ2810'), 'skin', 'integumentary', 0);
fs.writeFileSync(path.join(output, 'skin-manifest.json'), JSON.stringify({
  version: atlas.version, source: manifest.source, license: manifest.license,
  sourceRepository: manifest.sourceRepository, sourceCommit, coordinates: manifest.coordinates,
  parts: skin.parts, chunks: [skin.chunk], triangles: skin.parts[0].indexCount / 3,
  scope: 'Optional original body surface. Use only as a low-opacity silhouette reference.',
}));

// Validate every buffer view and every retained concept; this also catches
// invalid offsets if the upstream chunk packing ever changes.
const files = manifest.chunks.map(chunk => fs.readFileSync(path.join(output, path.basename(chunk.url))));
for (const part of parts) {
  const buffer = files[part.chunk];
  assert.equal(part.positions % 4, 0);
  assert.equal(part.normals % 4, 0);
  assert.equal(part.indices % 4, 0);
  assert.ok(part.indices + part.indexCount * 4 <= buffer.length);
  assert.ok(part.normals + part.vertexCount * 6 <= buffer.length);
  assert.ok(part.positions + part.vertexCount * 12 <= buffer.length);
  for (let index = 0; index < part.vertexCount * 3; index++) {
    assert.ok(Number.isFinite(buffer.readFloatLE(part.positions + index * 4)), `${part.id}: nonfinite vertex`);
  }
  for (let index = 0; index < part.indexCount; index++) {
    assert.ok(buffer.readUInt32LE(part.indices + index * 4) < part.vertexCount, `${part.id}: index outside geometry`);
  }
}
for (const concept of concepts) for (const id of concept.elements) assert.ok(ids.has(id));
assert.equal(ids.size, parts.length);
console.log(JSON.stringify({
  bones: bones.parts.length, muscles: muscles.parts.length,
  concepts: concepts.length, triangles: manifest.triangles,
  geometryBytes: manifest.chunks.reduce((total, chunk) => total + chunk.bytes, 0),
  gzipBytes: manifest.chunks.reduce((total, chunk) => total + chunk.gzipBytes, 0),
  correctedClassifications: manifest.classificationCorrections.length,
  optionalSkinBytes: skin.chunk.gzipBytes,
  output,
}, null, 2));
