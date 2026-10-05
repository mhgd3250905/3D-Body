import fs from 'node:fs';
import crypto from 'node:crypto';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createCoachMotion } from '../src/coach-motion.js';
import { createFlareRig } from '../src/flare-rig.js';
import { createFlarePosePresets } from '../src/pose-presets.js';

// This diagnostic measures the actual GLB, not the arbitrary local axes of a
// Blender bone. Source finger landmarks identify which end is the fingertip.
// Snow's finger bones were consolidated into Hand: their endpoints below are
// calibration references, not separate moving bones or finger contact sensors.
globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
globalThis.ProgressEvent ??= class { constructor(type, values) { Object.assign(this, values); } };
const SIDES = ['left', 'right'];
const UP = new THREE.Vector3(0, 1, 0);
const DOWN = UP.clone().negate();
const FRONT = new THREE.Vector3(0, 0, 1);
const vector = values => new THREE.Vector3().fromArray(values);
const rounded = values => values.map(value => Number(value.toFixed(8)));
const coordinates = point => rounded(point.toArray());
const angle = (a, b) => THREE.MathUtils.radToDeg(Math.acos(THREE.MathUtils.clamp(a.clone().normalize().dot(b.clone().normalize()), -1, 1)));
const yaw = direction => THREE.MathUtils.radToDeg(Math.atan2(direction.x, direction.z));
const mean = points => points.reduce((sum, point) => sum.add(point), new THREE.Vector3()).divideScalar(points.length);
const limits = points => ({ min: coordinates(new THREE.Box3().setFromPoints(points).min), max: coordinates(new THREE.Box3().setFromPoints(points).max) });

// Measured read-only from snow_v4.2.blend frame 1, original DEF finger heads /
// terminal tails. Converted from Blender (x,y,z) to Three model (x,z,-y).
const SOURCE_LEFT = {
  wrist: [.6703301668167114, 1.330108642578125, -.009014129638671875],
  middleMCP: [.7706469893455505, 1.335707187652588, .009142871014773846],
  indexMCP: [.7687801718711853, 1.3319947719573975, .03518039733171463],
  pinkyMCP: [.7634642124176025, 1.3337039947509766, -.03822042793035507],
  thumbTip: [.78108811378479, 1.2801240682601929, .08816935122013092],
  indexTip: [.8766849637031555, 1.3139888048171997, .05365566909313202],
  middleTip: [.8906436562538147, 1.3199056386947632, .023703988641500473],
  ringTip: [.8830722570419312, 1.3199615478515625, -.009912737645208836],
  pinkyTip: [.8552143573760986, 1.320658802986145, -.03932007774710655],
};
const SOURCE_RIGHT = {
  wrist: [-.6703300476074219, 1.330108642578125, -.009014127776026726],
  middleMCP: [-.7706472277641296, 1.335707187652588, .009143080562353134],
  indexMCP: [-.7687802314758301, 1.3319947719573975, .03518039733171463],
  pinkyMCP: [-.7634633779525757, 1.3337039947509766, -.0382203683257103],
  thumbTip: [-.7810879945755005, 1.2801240682601929, .08816934376955032],
  indexTip: [-.8766854405403137, 1.3139904737472534, .05365581065416336],
  middleTip: [-.8906445503234863, 1.3199052810668945, .023704085499048233],
  ringTip: [-.8830720782279968, 1.3199632167816162, -.00991276279091835],
  pinkyTip: [-.8552137613296509, 1.3206591606140137, -.03932002931833267],
};
const sourceHands = { left: SOURCE_LEFT, right: SOURCE_RIGHT };

// Small symmetric 3x3 Jacobi eigensolver; independent geometry plane fitting.
function principalAxes(points) {
  const center = mean(points);
  const a = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const point of points) {
    const d = point.clone().sub(center).toArray();
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) a[i][j] += d[i] * d[j] / points.length;
  }
  const v = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (let sweep = 0; sweep < 40; sweep++) {
    let p = 0, q = 1;
    for (const [i, j] of [[0, 2], [1, 2]]) if (Math.abs(a[i][j]) > Math.abs(a[p][q])) [p, q] = [i, j];
    if (Math.abs(a[p][q]) < 1e-16) break;
    const t = .5 * Math.atan2(2 * a[p][q], a[q][q] - a[p][p]);
    const c = Math.cos(t), s = Math.sin(t);
    const app = a[p][p], aqq = a[q][q], apq = a[p][q];
    a[p][p] = c * c * app - 2 * s * c * apq + s * s * aqq;
    a[q][q] = s * s * app + 2 * s * c * apq + c * c * aqq;
    a[p][q] = a[q][p] = 0;
    for (let k = 0; k < 3; k++) if (k !== p && k !== q) {
      const akp = a[k][p], akq = a[k][q];
      a[k][p] = a[p][k] = c * akp - s * akq;
      a[k][q] = a[q][k] = s * akp + c * akq;
    }
    for (let k = 0; k < 3; k++) {
      const vkp = v[k][p], vkq = v[k][q];
      v[k][p] = c * vkp - s * vkq;
      v[k][q] = s * vkp + c * vkq;
    }
  }
  return [0, 1, 2].map(index => ({ variance: a[index][index], axis: new THREE.Vector3(v[0][index], v[1][index], v[2][index]).normalize() })).sort((x, y) => y.variance - x.variance);
}
function orient(axis, reference) { return axis.dot(reference) < 0 ? axis.clone().negate() : axis.clone(); }

const source = new URL('../public/coach/flare-coach.glb', import.meta.url);
const bytes = fs.readFileSync(source);
const { scene: model } = await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
const rigData = JSON.parse(fs.readFileSync(new URL('../public/coach/coach-rig.json', import.meta.url), 'utf8'));
model.updateMatrixWorld(true);
const inverseModel = model.matrixWorld.clone().invert();
const inverseModelRotation = model.getWorldQuaternion(new THREE.Quaternion()).invert();
const restBoneRotations = new Map();
model.traverse(bone => { if (bone.isBone) restBoneRotations.set(bone.name, inverseModelRotation.clone().multiply(bone.getWorldQuaternion(new THREE.Quaternion()))); });
const records = Object.fromEntries(SIDES.map(side => [side, { hand: [], sole: [], foot: [] }]));
const meshes = [];
model.traverse(mesh => { if (mesh.isSkinnedMesh) meshes.push(mesh); });
for (const skeleton of new Set(meshes.map(mesh => mesh.skeleton))) skeleton.update();
const point = new THREE.Vector3();
for (const mesh of meshes) {
  const indices = mesh.geometry.getAttribute('skinIndex');
  const weights = mesh.geometry.getAttribute('skinWeight');
  const normals = mesh.geometry.getAttribute('normal');
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(new THREE.Matrix4().multiplyMatrices(inverseModel, mesh.matrixWorld));
  for (let i = 0; i < indices.count; i++) {
    const total = {};
    for (let component = 0; component < 4; component++) {
      const name = mesh.skeleton.bones[indices.getComponent(i, component)]?.name;
      total[name] = (total[name] ?? 0) + weights.getComponent(i, component);
    }
    for (const side of SIDES) {
      const handWeight = total[side + 'Hand'] ?? 0, footWeight = total[side + 'Foot'] ?? 0;
      if (handWeight <= .70 && footWeight <= .99) continue;
      mesh.getVertexPosition(i, point).applyMatrix4(mesh.matrixWorld).applyMatrix4(inverseModel);
      const item = { mesh, index: i, rest: point.clone(), weight: handWeight,
        restNormal: new THREE.Vector3().fromBufferAttribute(normals, i).applyMatrix3(normalMatrix).normalize() };
      if (handWeight > .70) records[side].hand.push(item);
      if (footWeight > .99) {
        records[side].foot.push(item);
        if (/Coach_Soles/.test(mesh.name)) records[side].sole.push(item);
      }
    }
  }
}
function actual(item) { return item.mesh.getVertexPosition(item.index, new THREE.Vector3()).applyMatrix4(item.mesh.matrixWorld).applyMatrix4(model.matrixWorld.clone().invert()); }
function nearest(items, target) { return items.reduce((best, item) => item.rest.distanceToSquared(target) < best.rest.distanceToSquared(target) ? item : best); }

const calibrations = {};
for (const side of SIDES) {
  const source = sourceHands[side];
  const wrist = vector(source.wrist);
  const finger = vector(source.middleMCP).sub(wrist).normalize();
  const width = vector(source.indexMCP).sub(vector(source.pinkyMCP));
  const normal = orient(new THREE.Vector3().crossVectors(finger, width).normalize(), DOWN);
  const sideAxis = new THREE.Vector3().crossVectors(normal, finger).normalize();
  const palmPatch = records[side].hand.filter(item => {
    const offset = item.rest.clone().sub(wrist);
    // Fit the palmar-facing surface only. A fit through both back and palm
    // plus the curved thumb is a thick volume, not a contact-plane estimate.
    return offset.dot(finger) > .025 && offset.dot(finger) < .095 && Math.abs(offset.dot(sideAxis)) < .030 && item.restNormal.dot(normal) > .60;
  });
  const palmNormalGeometry = orient(principalAxes(palmPatch.map(item => item.rest))[2].axis, normal);
  const soleAxes = principalAxes(records[side].sole.map(item => item.rest));
  const soleLong = orient(soleAxes[0].axis, FRONT), soleNormal = orient(soleAxes[2].axis, DOWN);
  const projection = records[side].sole.map(item => item.rest.dot(soleLong));
  const low = Math.min(...projection), high = Math.max(...projection);
  const toe = records[side].sole.filter((item, i) => projection[i] > high - (high - low) * .07);
  const heel = records[side].sole.filter((item, i) => projection[i] < low + (high - low) * .07);
  const tips = Object.fromEntries(['thumbTip', 'indexTip', 'middleTip', 'ringTip', 'pinkyTip'].map(name => [name, nearest(records[side].hand.filter(item => item.weight > .999), vector(source[name]))]));
  calibrations[side] = { wrist, finger, normal, palmNormalGeometry, palmPatch, soleLong, soleNormal, toe, heel, tips };
}
const motion = createCoachMotion({ model, driver: createFlareRig(), rigData });
const presets = createFlarePosePresets(motion);
const results = [];
const findings = [];
const renderSnapshots = [];

for (const preset of presets) {
  motion.applyPose(preset.pose);
  const effective = motion.capturePose();
  const metrics = motion.getMetrics();
  const hands = {}, feet = {};
  for (const side of SIDES) {
    const calibration = calibrations[side], limb = effective.limbs[side];
    const handQ = new THREE.Quaternion().fromArray(limb.handQuaternion);
    const wrist = vector(metrics.joints[side + 'Wrist']);
    const sourcePoint = name => vector(sourceHands[side][name]).sub(vector(rigData.landmarks[side + 'Wrist'])).applyQuaternion(handQ).add(wrist);
    const palmDirection = calibration.finger.clone().applyQuaternion(handQ);
    const palmNormal = calibration.normal.clone().applyQuaternion(handQ);
    const palmPoints = calibration.palmPatch.map(actual);
    const geometryNormal = orient(principalAxes(palmPoints)[2].axis, palmNormal);
    const fingertipPoints = Object.fromEntries(Object.entries(calibration.tips).map(([name, item]) => [name, {
      actualSurfacePoint: coordinates(actual(item)), sourceBoneProxyPoint: coordinates(sourcePoint(name)),
      sourceBoneToSurfaceDistance: item.rest.distanceTo(vector(sourceHands[side][name])),
    }]));
    let maxRigidHandError = 0;
    for (const item of records[side].hand) {
      // A 99.9% Hand vertex still follows a little Forearm and is not rigid.
      if (item.weight < 1-1e-7) continue;
      const expected = item.rest.clone().sub(vector(rigData.landmarks[side + 'Wrist'])).applyQuaternion(handQ).add(wrist);
      maxRigidHandError = Math.max(maxRigidHandError, expected.distanceTo(actual(item)));
    }
    const support = preset.supportHands.includes(side);
    const allHand = records[side].hand.map(actual);
    hands[side] = {
      support, palmLongDirection: coordinates(palmDirection), palmLongYawDegrees: yaw(palmDirection),
      palmNormalFromSourceLandmarks: coordinates(palmNormal), palmNormalDownErrorDegrees: angle(palmNormal, DOWN),
      palmPatchGeometryThinAxis: coordinates(geometryNormal), geometryThinAxisDownErrorDegrees: angle(geometryNormal, DOWN),
      wristToMiddleTipDirection: coordinates(sourcePoint('middleTip').sub(wrist).normalize()),
      wristToMiddleTipYawDegrees: yaw(sourcePoint('middleTip').sub(wrist)),
      wristToActualMiddleSkinTipDirection: coordinates(actual(calibration.tips.middleTip).sub(wrist).normalize()),
      wristToActualMiddleSkinTipYawDegrees: yaw(actual(calibration.tips.middleTip).sub(wrist)),
      actualPalmPatchBounds: limits(palmPoints), actualWholeHandBounds: limits(allHand),
      actualSkinTipPoints: fingertipPoints, maximumPureHandVertexDeltaError: maxRigidHandError,
      interpretation: 'Palm orientation uses original wrist/MCP landmarks; the geometry thin axis fits the natural curved palmar-facing skin, not a flat contact surface. Original source bone-tip proxies are curved reference positions; actual opened skin tips are measured separately. Whole-hand minimum is not proof of every digit contact.',
    };
    if (support && hands[side].palmNormalDownErrorDegrees > 5) findings.push(`${preset.id}: ${side} palm landmark plane is ${hands[side].palmNormalDownErrorDegrees.toFixed(2)} degrees from face-down.`);
    if (support && Math.abs(hands[side].actualWholeHandBounds.min[1] - .006) > .0001) findings.push(`${preset.id}: ${side} actual hand minimum is ${hands[side].actualWholeHandBounds.min[1].toFixed(5)} m; contact target is .006 m.`);
    if (maxRigidHandError > 1e-5) findings.push(`${preset.id}: ${side} source hand delta does not match real pure-Hand skin: ${maxRigidHandError} m.`);

    const solePoints = records[side].sole.map(actual);
    const toe = mean(calibration.toe.map(actual)), heel = mean(calibration.heel.map(actual));
    const long = toe.clone().sub(heel).normalize();
    const footQ = new THREE.Quaternion().fromArray(limb.footQuaternion);
    const soleNormal = orient(principalAxes(solePoints)[2].axis, calibration.soleNormal.clone().applyQuaternion(footQ));
    const hip = vector(metrics.joints[side + 'Hip']), knee = vector(metrics.joints[side + 'Knee']), ankle = vector(metrics.joints[side + 'Ankle']);
    const shin = ankle.clone().sub(knee).normalize();
    const leg = ankle.clone().sub(hip).normalize();
    const anterior = knee.clone().sub(hip).addScaledVector(leg, -knee.clone().sub(hip).dot(leg));
    anterior.addScaledVector(shin, -anterior.dot(shin)).normalize();
    const instepNormal = soleNormal.clone().negate();
    feet[side] = {
      realSoleHeelCenter: coordinates(heel), realSoleToeCenter: coordinates(toe),
      actualHeelToToeDirection: coordinates(long), actualToeYawDegrees: yaw(long),
      actualAnkleToToeDirection: coordinates(toe.clone().sub(ankle).normalize()),
      actualSoleOutwardNormal: coordinates(soleNormal), actualInstepOutwardNormal: coordinates(instepNormal),
      shinDirection: coordinates(shin), legChordDirection: coordinates(leg),
      toeAxisDotShin: long.dot(shin), toeAxisToShinDegrees: angle(long, shin),
      toeAxisToLegChordDegrees: angle(long, leg),
      ankleToToeToShinDegrees: angle(toe.clone().sub(ankle), shin),
      kneeAnteriorDirection: coordinates(anterior), instepToKneeAnteriorDegrees: angle(instepNormal, anterior),
      actualSoleBounds: limits(solePoints), actualAllFootWeightedBounds: limits(records[side].foot.map(actual)),
      interpretation: 'Toe axis is the real sole heel-to-toe direction, not an assumed bone axis. Ankle-to-toe includes the original shoe thickness/drop. Roll compares instep to the solved knee-bend side; near-straight knees make this a geometric cue, not anatomical motion-range validation.',
    };
    if (feet[side].toeAxisToShinDegrees > 15) findings.push(`${preset.id}: ${side} real shoe long axis is ${feet[side].toeAxisToShinDegrees.toFixed(2)} degrees from the shin extension.`);
    if (feet[side].instepToKneeAnteriorDegrees > 45) findings.push(`${preset.id}: ${side} instep roll differs ${feet[side].instepToKneeAnteriorDegrees.toFixed(2)} degrees from the solved knee-bend side.`);
  }
  results.push({ id: preset.id, name: preset.name, phase: preset.phase, supportHands: preset.supportHands, technique: preset.technique ?? null, hands, feet });
  renderSnapshots.push({ id: preset.id, name: preset.name, bones: rigData.bones.map(({ name }) => {
    const bone = model.getObjectByName(name);
    const rotation = inverseModelRotation.clone().multiply(bone.getWorldQuaternion(new THREE.Quaternion())).multiply(restBoneRotations.get(name).clone().invert());
    return { name, position: coordinates(bone.getWorldPosition(new THREE.Vector3()).applyMatrix4(inverseModel)), deltaQuaternion: rounded(rotation.toArray()) };
  }) });
}

const output = new URL('../output/pose-orientations/', import.meta.url);
fs.mkdirSync(output, { recursive: true });
const calibrationReport = Object.fromEntries(SIDES.map(side => {
  const value = calibrations[side];
  return [side, {
    sourceHandLandmarks: sourceHands[side], sourcePalmLong: coordinates(value.finger), sourcePalmNormal: coordinates(value.normal),
    sourcePalmPatchGeometryThinAxis: coordinates(value.palmNormalGeometry), sourcePalmPatchVertexCount: value.palmPatch.length,
    sourcePalmPatchBounds: limits(value.palmPatch.map(item => item.rest)),
    sourcePalmPatchPrincipalVariances: principalAxes(value.palmPatch.map(item => item.rest)).map(item => item.variance),
    sourceActualSoleLongAxis: coordinates(value.soleLong), sourceSoleLongAxisToPositiveZDegrees: angle(value.soleLong, FRONT),
    sourceActualSoleNormal: coordinates(value.soleNormal), sourceSoleNormalToDownDegrees: angle(value.soleNormal, DOWN),
    handVertexCount: records[side].hand.length, soleVertexCount: records[side].sole.length,
  }];
}));
const report = {
  inspectedAt: new Date().toISOString(), model: 'public/coach/flare-coach.glb', modelSha256: crypto.createHash('sha256').update(bytes).digest('hex'),
  sourceLandmarks: 'assets/blender-studio-source/snow-rig-v4/Snow/snow_v4.2.blend, frame 1, DEF finger heads / terminal tails',
  sourceBlendSha256: '80FD0A81BCA90F0EFDCDCB98422DF0E198AE57F4A1C239E13FB795922779B1FC',
  units: 'metres and degrees, Three model-local x-right/y-up/z-front, yaw=atan2(x,z)',
  calibration: calibrationReport, findings, presets: results,
  limitations: ['The GLB has 20 consolidated deformation bones, no independently articulated finger bones.', 'Palm landmark and fitted geometry planes are geometric references; they do not measure pressure, every finger contact, dynamic balance or a physiological motion range.', 'Loaded preset technique metadata is reported verbatim; anatomical orientation is measured separately from quaternions.'],
};
fs.writeFileSync(new URL('diagnostics.json', output), JSON.stringify(report, null, 2));
fs.writeFileSync(new URL('render-bone-snapshots.json', output), JSON.stringify(renderSnapshots, null, 2));
const n = value => value.toFixed(2);
const table = results.flatMap(preset => SIDES.map(side => `| ${preset.name} | ${side} ${preset.hands[side].support ? '支撑' : '离地'} | ${n(preset.hands[side].palmLongYawDegrees)} | ${n(preset.hands[side].palmNormalDownErrorDegrees)} | ${n(preset.hands[side].actualWholeHandBounds.min[1] * 1000)} | ${n(preset.feet[side].toeAxisToShinDegrees)} | ${n(preset.feet[side].instepToKneeAnteriorDegrees)} |`)).join('\n');
const markdown = `# 实际手掌与鞋朝向诊断\n\n读取当前 Snow GLB 与 \`src/pose-presets.js\`，不修改角色、姿势或用户草稿。掌面使用源 Snow 的腕、中指掌指关节及横向掌指关节标定；另独立拟合实际掌区皮肤薄轴。足长轴来自真实鞋底前后端，鞋底外法线来自真实鞋底网格平面。\n\n左右按人物本人；朝向 yaw=atan2(x,z)，0°为世界 +Z，180°为世界 -Z。源模型指骨端点有曲度，派生真实手网格现已准备平掌下表面；原指骨代理与实际皮肤指尖分别记录。20 骨架未提供独立指骨；掌面朝下、网格最低点贴地不等于五指每个关节都接地。\n\n| 姿势 | 侧别 / 状态 | 掌纵轴 yaw ° | 掌面偏离朝下 ° | 手网格最低 mm | 真实鞋长轴偏离小腿 ° | 鞋面与膝弯向夹角 ° |\n| --- | --- | --- | --- | --- | --- | --- |\n${table}\n\n${findings.length ? '测量提示：\n\n' + findings.map(value => '- ' + value).join('\n') : '当前模板的支撑掌标定面、实际手最低点及鞋长轴均未触发诊断提示。'}\n\n完整数值、源标定、实际皮肤指尖点与每个模板的 technique 元数据：\`output/pose-orientations/diagnostics.json\`。复查：\`node tools/inspect-pose-orientations.mjs\`。\n`;
fs.writeFileSync(new URL('diagnostics.md', output), markdown);
console.log(JSON.stringify({ inspectedPoses: results.length, modelSha256: report.modelSha256, calibration: calibrationReport, findings, report: 'output/pose-orientations/diagnostics.json' }, null, 2));
