import { mirrorPose, mirrorText } from './pose-mirror.js';
import { samePose, validSequence } from './official-poses.js';
import { rebaseTransitionEdits, validateTransitionEdits } from './transition-edits.js';
import { SEGMENT_ANGLE_JOINTS, SEGMENT_BEND_JOINTS } from './segment-guides.js';

const clone = value => structuredClone(value);
const reflect = value => [-value[0], value[1], value[2]];
const mirrorJoint = key => key.startsWith('left') ? 'right' + key.slice(4) : key.startsWith('right') ? 'left' + key.slice(5) : key;
const identity = ref => JSON.stringify([ref?.kind, ref?.id]);

function mirrorOwnedPose(pose) {
  const known = mirrorPose(pose);
  // Opaque metadata is retained. Only the current pose schema is reflected.
  return { ...clone(pose), ...known, limbs: { ...clone(pose.limbs),
    left: { ...clone(pose.limbs.right), ...known.limbs.left },
    right: { ...clone(pose.limbs.left), ...known.limbs.right } } };
}

function mirrorControls(controls, knownKeys, transform) {
  const result = Object.fromEntries(Object.entries(controls).filter(([key]) => !knownKeys.includes(key)).map(([key, value]) => [key, clone(value)]));
  for (const key of knownKeys) if (Object.hasOwn(controls, key)) result[mirrorJoint(key)] = transform(controls[key]);
  return result;
}

function quaternionDifference(first, second) {
  const normalized = value => {
    const maximum = Math.max(...value.map(Math.abs)), scaled = value.map(number => number / maximum), length = Math.hypot(...scaled);
    return scaled.map(number => number / length);
  };
  const a = normalized(first), b = normalized(second);
  const dot = Math.min(1, Math.abs(a.reduce((sum, number, index) => sum + number * b[index], 0)));
  return 2 * Math.acos(dot);
}

function boundaryDifference(sourcePose, targetPose) {
  const expected = mirrorOwnedPose(sourcePose), distances = [], rotations = [];
  const distance = (a, b) => Math.hypot(...a.map((number, index) => number - b[index]));
  distances.push(distance(expected.pelvis, targetPose.pelvis));
  rotations.push(quaternionDifference(expected.bodyQuaternion, targetPose.bodyQuaternion));
  for (const key of ['pelvisQuaternion', 'torsoQuaternion']) {
    if (expected[key] || targetPose[key]) rotations.push(quaternionDifference(
      expected[key] ?? (key === 'pelvisQuaternion' ? expected.bodyQuaternion : [0, 0, 0, 1]),
      targetPose[key] ?? (key === 'pelvisQuaternion' ? targetPose.bodyQuaternion : [0, 0, 0, 1])));
  }
  for (const side of ['left', 'right']) {
    for (const key of ['wrist', 'elbowPole', 'ankle', 'kneePole']) distances.push(distance(expected.limbs[side][key], targetPose.limbs[side][key]));
    for (const key of ['handQuaternion', 'footQuaternion']) rotations.push(quaternionDifference(expected.limbs[side][key], targetPose.limbs[side][key]));
  }
  return { exact: samePose(expected, targetPose), maximumControlPointDistance: Math.max(...distances),
    maximumRotationAngleRadians: Math.max(...rotations),
    handLocksMatch: ['left', 'right'].every(side => expected.limbs[side].handLocked === targetPose.limbs[side].handLocked),
    groundLockMatches: expected.groundLock === targetPose.groundLock };
}

/** Build a reviewable continuation without persistence or modifying the inputs.
 * By default only 14→15→16→09 is replaced, protecting 09→…→14. Explicit
 * includeFrame14 mirrors the completed 09→…→13 half onto 13→…→09, updating
 * 14/15/16 and protecting 09/13. Draft and opaque metadata stay untouched.
 * Profile controls are mirrored and time-reversed; their new actual endpoints
 * naturally adapt asymmetric protected boundaries.
 * Mirrored K poses at such a boundary are reported as unresolved, never moved
 * by a guessed retargeting or by replacing the user's protected original pose.
 */
export function mirrorTransitionContinuation(sequence, document, { includeFrame14 = false } = {}) {
  if (typeof includeFrame14 !== 'boolean') throw new TypeError('镜像第 14 帧的选项需要为 true 或 false。');
  const sourceEnd = includeFrame14 ? 4 : 3, targetStart = includeFrame14 ? 4 : 5;
  const targetSegments = includeFrame14 ? [4, 5, 6, 7] : [5, 6, 7];
  const stepMap = new Map(Array.from({ length: sourceEnd + 1 }, (_, index) => [index, 8 - index]));
  const updates = includeFrame14 ? [[5, 3], [6, 2], [7, 1]] : [[6, 2], [7, 1]];
  if (!validSequence(sequence)) throw new Error('请使用当前完整的 9–16–9 正式循环。');
  const numbers = [9, 10, 11, 12, 13, 14, 15, 16, 9];
  if (sequence.steps.some((step, index) => step.sourceStepNumber !== numbers[index])) {
    throw new Error('原步骤编号与 9–16–9 循环不一致，无法确定镜像对应关系。');
  }
  const checked = validateTransitionEdits(document, sequence), skipped = new Set(checked.skippedSteps ?? []);
  if ([0, targetStart, 8].some(index => skipped.has(index))) {
    throw new Error(`第 09 或 ${includeFrame14 ? '13' : '14'} 帧已跳过，补齐后可能改变已完成区间；请先恢复该边界帧。当前动画未改动。`);
  }
  const backup = { ...clone(document), sequence: clone(sequence) };
  const nextSequence = clone(sequence), nextDocument = clone(checked), warnings = [], unresolved = [];
  const boundaries = [
    includeFrame14 ? { sourceIndex: 4, targetIndex: 4, sourceStepNumber: 13, targetStepNumber: 13 } :
      { sourceIndex: 3, targetIndex: 5, sourceStepNumber: 12, targetStepNumber: 14 },
    { sourceIndex: 0, targetIndex: 8, sourceStepNumber: 9, targetStepNumber: 9 },
  ].map(boundary => ({ ...boundary, ...boundaryDifference(sequence.steps[boundary.sourceIndex].pose, sequence.steps[boundary.targetIndex].pose) }));
  for (const boundary of boundaries) if (!boundary.exact) {
    warnings.push(`保留已调整的原第 ${boundary.targetStepNumber} 步；镜像路线将连接该实际端点，边界处不保证逐帧完全对称。`);
  }
  if (!samePose(sequence.steps[0].pose, sequence.steps[8].pose)) {
    unresolved.push({ kind: 'loop-boundary', message: '首尾原第 09 步姿态不同；已保留两者，请先确认循环边界。' });
  }
  if (!includeFrame14 && skipped.has(3)) unresolved.push({ kind: 'skipped-source-boundary', message: '用于镜像的原第 12 步被跳过，源区间依赖第 13 步，需先确认此边界。' });

  for (const [target, source] of updates) nextSequence.steps[target].pose = mirrorOwnedPose(sequence.steps[source].pose);
  const usedIds = new Set([...sequence.steps, ...checked.points, ...(checked.footCurves ?? []), ...(checked.segmentGuides ?? [])].map(item => item.id));
  const fresh = (kind, sourceId) => {
    const stem = `mirror-${kind}-${sourceId}`;let id = stem, suffix = 1;
    while (usedIds.has(id)) id = `${stem}-${suffix++}`;
    usedIds.add(id);return id;
  };
  const refs = new Map(), times = new Map();
  const poses = new Map();
  for (const [index, step] of sequence.steps.entries()) {
    times.set(identity({ kind: 'step', id: step.id }), index);
    poses.set(identity({ kind: 'step', id: step.id }), step.pose);
    if (stepMap.has(index)) refs.set(identity({ kind: 'step', id: step.id }), sequence.steps[stepMap.get(index)].id);
  }
  for (const point of checked.points) {
    times.set(identity({ kind: 'point', id: point.id }), point.segment + point.at);
    poses.set(identity({ kind: 'point', id: point.id }), point.pose);
  }
  const mirroredPoints = checked.points.filter(point => point.segment >= 0 && point.segment < sourceEnd).map(point => {
    const id = fresh('point', point.id);refs.set(identity({ kind: 'point', id: point.id }), id);
    const mirrored = { ...clone(point), id, segment: 7 - point.segment, at: 1 - point.at, pose: mirrorOwnedPose(point.pose) };
    if (Object.hasOwn(point, 'name')) mirrored.name = mirrorText(point.name);
    const boundary = boundaries.find(boundary => !boundary.exact && (mirrored.segment === targetStart ? boundary.targetIndex === targetStart :
      mirrored.segment === 7 ? boundary.targetIndex === 8 : false));
    if (boundary) {
      const note = { kind: 'keyframe-boundary', sourcePointId: point.id, targetPointId: id, targetSegment: mirrored.segment,
        targetStepNumber: boundary.targetStepNumber,
        message: `镜像 K 帧与保留的原第 ${boundary.targetStepNumber} 步存在边界差；未擅自移动该 K 或原帧。` };
      if (checked.enabled && !point.skipped) unresolved.push(note);else warnings.push(note.message);
    }
    return mirrored;
  });
  const oldTargetPoints = checked.points.filter(point => targetSegments.includes(point.segment));
  nextDocument.points = [...checked.points.filter(point => !targetSegments.includes(point.segment)).map(clone), ...mirroredPoints];

  const directedRange = entry => {
    const start = times.get(identity(entry.from)), finish = times.get(identity(entry.to));
    if (start === undefined || finish === undefined) return null;
    return { start, end: finish > start ? finish : finish + sequence.steps.length };
  };
  const inRange = (entry, start, end) => {
    const span = directedRange(entry);return span && span.start >= start && span.end <= end;
  };
  const mappedRef = ref => {
    const id = refs.get(identity(ref));
    if (!id) throw new Error('镜像路线缺少对应的保存帧，当前动画未改动。');
    return { ...clone(ref), id };
  };
  const reversedRefs = entry => ({ from: mappedRef(entry.to), to: mappedRef(entry.from) });
  const mirroredCurves = (checked.footCurves ?? []).filter(curve => inRange(curve, 0, sourceEnd)).map(curve => ({
    ...clone(curve), id: fresh('curve', curve.id), ...reversedRefs(curve),
    side: curve.side === 'left' ? 'right' : 'left', bend: reflect(curve.bend),
  }));
  const mirroredGuides = (checked.segmentGuides ?? []).filter(entry => inRange(entry, 0, sourceEnd)).map(entry => {
    const result = { ...clone(entry), id: fresh('guide', entry.id), ...reversedRefs(entry) };
    if (Object.hasOwn(entry, 'bends')) result.bends = mirrorControls(entry.bends, SEGMENT_BEND_JOINTS, reflect);
    if (Object.hasOwn(entry, 'bendAngles')) result.bendAngles = mirrorControls(entry.bendAngles, SEGMENT_ANGLE_JOINTS, value => -value);
    if (Object.hasOwn(entry, 'smoothPaths')) result.smoothPaths = mirrorControls(entry.smoothPaths, SEGMENT_BEND_JOINTS,
      path => ({ ...clone(path), bend: reflect(path.bend) }));
    if (Object.hasOwn(entry, 'orbitPaths')) {
      for (const joint of SEGMENT_BEND_JOINTS) {
        const path = entry.orbitPaths[joint];
        if (!path || Object.hasOwn(path, 'normal')) continue;
        const at = pose => joint === 'pelvis' ? pose.pelvis : pose.limbs[joint.startsWith('left') ? 'left' : 'right'][joint.endsWith('Wrist') ? 'wrist' : 'ankle'];
        const a = at(poses.get(identity(entry.from))), b = at(poses.get(identity(entry.to)));
        if (path.arc !== 'long' && a.every((number, index) => number === b[index])) continue;
        const radialA = a.map((number, index) => number - path.center[index]);
        const radialB = b.map((number, index) => number - path.center[index]);
        const cross = [radialA[1] * radialB[2] - radialA[2] * radialB[1],
          radialA[2] * radialB[0] - radialA[0] * radialB[2], radialA[0] * radialB[1] - radialA[1] * radialB[0]];
        if (cross.every(number => number === 0)) unresolved.push({ kind: 'orbit-plane', sourceGuideId: entry.id, joint,
          message: '退化旋转弧线未保存备用法向，不能猜测镜像后的旋转平面；请先确认该路线。' });
      }
      result.orbitPaths = mirrorControls(entry.orbitPaths, SEGMENT_BEND_JOINTS, path => ({
        ...clone(path), center: reflect(path.center),
        // A spatial mirror and reversed endpoint order cancel the axial sign.
        // This is a polar reflection, including the degenerate half/full circle.
        ...(Object.hasOwn(path, 'normal') ? { normal: reflect(path.normal) } : {}),
      }));
    }
    return result;
  });
  const oldTargetCurves = (checked.footCurves ?? []).filter(curve => inRange(curve, targetStart, 8));
  const oldTargetGuides = (checked.segmentGuides ?? []).filter(entry => inRange(entry, targetStart, 8));
  if (Object.hasOwn(checked, 'footCurves')) nextDocument.footCurves = [
    ...checked.footCurves.filter(curve => !inRange(curve, targetStart, 8)).map(clone), ...mirroredCurves,
  ];
  if (Object.hasOwn(checked, 'segmentGuides')) nextDocument.segmentGuides = [
    ...checked.segmentGuides.filter(entry => !inRange(entry, targetStart, 8)).map(clone), ...mirroredGuides,
  ];
  const danglingCurves = (checked.footCurves ?? []).filter(curve => !directedRange(curve)).length;
  const danglingGuides = (checked.segmentGuides ?? []).filter(entry => !directedRange(entry)).length;
  if (danglingCurves || danglingGuides) warnings.push(`保留 ${danglingCurves} 条历史脚路线和 ${danglingGuides} 条无法定位的历史整段路线，未生成缺少对应帧的镜像。`);
  for (const [target, source] of updates) {
    if (skipped.has(source)) skipped.add(target);else skipped.delete(target);
  }
  if (Object.hasOwn(checked, 'skippedSteps')) nextDocument.skippedSteps = [...skipped].sort((a, b) => a - b);
  const rebased = rebaseTransitionEdits(nextDocument, sequence, nextSequence);
  return { sequence: nextSequence, document: rebased, backup, updatedIndices: updates.map(([target]) => target), targetSegments,
    counts: { pointsAdded: mirroredPoints.length, pointsReplaced: oldTargetPoints.length,
      footCurvesAdded: mirroredCurves.length, footCurvesReplaced: oldTargetCurves.length,
      segmentGuidesAdded: mirroredGuides.length, segmentGuidesReplaced: oldTargetGuides.length },
    boundaries, warnings, unresolved, canApply: unresolved.length === 0 };
}
