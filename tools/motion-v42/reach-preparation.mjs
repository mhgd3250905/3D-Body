import * as T from 'three';
const V = a => new T.Vector3().fromArray(a);
const smooth = x => { x = T.MathUtils.clamp(x, 0, 1); return x*x*x*(10+x*(-15+6*x)); };
const windows = {
  left: { start: .35, end: .49, handStart: .40, onset: .025, degreesPerPhase: 600 },
  right: { start: .79, end: .97, handStart: .89, onset: .04, degreesPerPhase: 470 },
};
const angleAt = (joints, side) => V(joints[side+'Shoulder']).sub(V(joints[side+'Elbow']))
  .angleTo(V(joints[side+'Wrist']).sub(V(joints[side+'Elbow'])));
const transform = (from, to, q) => new T.Matrix4().makeTranslation(...to.toArray())
  .multiply(new T.Matrix4().makeRotationFromQuaternion(q))
  .multiply(new T.Matrix4().makeTranslation(...from.clone().negate().toArray()));

// A forearm-only pass after the accepted R8 arm solve. Upper-arm transforms
// and the actual elbow point are immutable; extension changes only wrist reach.
export function createReachPreparation({ model, bones }) {
  let prepared = false;
  const curves = {}, hands = {};
  const applyMatrix = (name, matrix) => {
    const bone = bones.get(name);
    const local = bone.parent.matrixWorld.clone().invert().multiply(matrix).multiply(bone.matrixWorld);
    local.decompose(bone.position, bone.quaternion, bone.scale);
    bone.updateMatrix();
    model.updateMatrixWorld(true);
  };
  return {
    parameters: { windows, scope: 'Earlier continuous elbow extension on immutable R8 upper-arm and elbow trajectories' },
    prepare(evaluate) {
      for (const side of ['left','right']) {
        const { start, end, handStart } = windows[side];
        curves[side] = angleAt(evaluate(start).joints, side);
        evaluate(handStart);
        const from = bones.get(side+'Hand').getWorldQuaternion(new T.Quaternion());
        evaluate(end);
        hands[side] = { from, to: bones.get(side+'Hand').getWorldQuaternion(new T.Quaternion()) };
      }
      prepared = true;
    },
    apply({ phase, joints }) {
      if (!prepared) return {};
      const result = {};
      for (const side of ['left','right']) {
        const win = windows[side];
        if (phase <= win.start || phase >= win.end) continue;
        const shoulder = V(joints[side+'Shoulder']), elbow = V(joints[side+'Elbow']), wrist = V(joints[side+'Wrist']);
        const upper = elbow.clone().sub(shoulder).normalize(), forearm = wrist.clone().sub(elbow).normalize();
        const before = upper.clone().negate().angleTo(forearm);
        const elapsed = phase-win.start, ramp = T.MathUtils.clamp(elapsed/win.onset,0,1);
        const rise = elapsed < win.onset
          ? win.onset*(ramp**6-3*ramp**5+2.5*ramp**4)
          : elapsed-win.onset/2;
        const preparation = curves[side]+T.MathUtils.degToRad(win.degreesPerPhase)*rise;
        // The original R8 extension takes over as soon as it catches this
        // earlier preparation. This avoids carrying an almost-straight arm
        // sideways and then pulling the wrist back at the last instant.
        const delta = preparation-before, width = T.MathUtils.degToRad(30);
        const fraction = T.MathUtils.clamp(delta/width,0,1);
        const addition = delta <= 0 ? 0 : delta >= width ? delta-width/2
          : width*(fraction**3-.5*fraction**4);
        const after = before+addition;
        const bend = forearm.clone().addScaledVector(upper,-forearm.dot(upper)).normalize();
        const next = upper.clone().multiplyScalar(-Math.cos(after)).addScaledVector(bend,Math.sin(after)).normalize();
        const nextWrist = elbow.clone().addScaledVector(next,wrist.distanceTo(elbow));
        const rotation = new T.Quaternion().setFromUnitVectors(forearm,next);
        const forearmMatrix = transform(elbow,elbow,rotation);
        const handBefore = bones.get(side+'Hand').getWorldQuaternion(new T.Quaternion());
        const handAfter = handBefore.clone();
        if (phase > win.handStart) {
          const u = (phase-win.handStart)/(win.end-win.handStart);
          const target = hands[side].from.clone().slerp(hands[side].to,smooth(u));
          handAfter.copy(target);
        }
        const handMatrix = transform(wrist,nextWrist,handAfter.multiply(handBefore.clone().invert()));
        applyMatrix(side+'Forearm',forearmMatrix);
        applyMatrix(side+'Hand',handMatrix);
        result[side] = { forearmTransform:forearmMatrix.toArray(),handTransform:handMatrix.toArray(),
          elbowBeforeDegrees:T.MathUtils.radToDeg(before),elbowAfterDegrees:T.MathUtils.radToDeg(after),
          wristDisplacement:nextWrist.distanceTo(wrist),phaseLabel:'early-reach-preparation' };
      }
      return result;
    },
  };
}
