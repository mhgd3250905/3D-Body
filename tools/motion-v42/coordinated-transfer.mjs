import * as T from 'three';

const V = a => new T.Vector3().fromArray(a);
const rad = T.MathUtils.degToRad, deg = T.MathUtils.radToDeg;
const smooth = x => {
  x = T.MathUtils.clamp(x, 0, 1);
  return x * x * x * (10 + x * (-15 + 6 * x));
};
const transform = (from, to, q) => new T.Matrix4()
  .makeTranslation(...to.toArray())
  .multiply(new T.Matrix4().makeRotationFromQuaternion(q))
  .multiply(new T.Matrix4().makeTranslation(...from.clone().negate().toArray()));

// Normalized authoring phases, not timing measured from a human demonstration.
const windows = {
  left: { start: .06, full: .16, aligned: .40, release: .43, end: .495, reference: .28 },
  right: { start: .505, full: .61, aligned: .88, release: .90, end: .975, reference: .74 },
};

// The original shoulder bone orientation is the anatomical boundary. A bent
// forearm is carried in that upper-arm coordinate system; geometry changes
// with it. No independent humeral roll is added to fit an old wrist route.
export function createCoordinatedTransfer({ model, bones }) {
  let prepared = false;
  const reference = {}, landing = {}, turnCurves = {};
  const applyMatrix = (names, matrix) => {
    for (const name of names) {
      const bone = bones.get(name);
      const local = bone.parent.matrixWorld.clone().invert().multiply(matrix).multiply(bone.matrixWorld);
      local.decompose(bone.position, bone.quaternion, bone.scale);
      bone.updateMatrix();
    }
    model.updateMatrixWorld(true);
  };

  return {
    parameters: {
      windows,
      transportElbowDegrees: [104, 108],
      shoulderMotion: 'minimal whole-arm swing from original R1 bone orientation',
    },
    prepare(evaluate) {
      for (const side of ['left', 'right']) {
        const win = windows[side], { joints } = evaluate(win.reference);
        const s = V(joints[side + 'Shoulder']), e = V(joints[side + 'Elbow']), w = V(joints[side + 'Wrist']);
        const u = e.clone().sub(s).normalize(), f = w.clone().sub(e).normalize();
        const uq = bones.get(side + 'UpperArm').getWorldQuaternion(new T.Quaternion());
        reference[side] = {
          b: f.clone().addScaledVector(u, -f.dot(u)).normalize().applyQuaternion(uq.clone().invert()),
        };
        evaluate(win.end);
        landing[side] = bones.get(side + 'Hand').getWorldQuaternion(new T.Quaternion());
      }
      // Unwrap the source-to-carried plane angle once. Recomputing an atan2
      // shortest branch independently per frame can jump during late extension.
      for (const side of ['left', 'right']) {
        const win = windows[side], rows = [];
        let previous = null;
        for (let i = 0; i <= 240; i++) {
          const phase = win.start + (win.end - win.start) * i / 240, { joints } = evaluate(phase);
          const u = V(joints[side + 'Elbow']).sub(V(joints[side + 'Shoulder'])).normalize();
          const f = V(joints[side + 'Wrist']).sub(V(joints[side + 'Elbow'])).normalize();
          const oldB = f.clone().addScaledVector(u, -f.dot(u)).normalize();
          const b = reference[side].b.clone()
            .applyQuaternion(bones.get(side + 'UpperArm').getWorldQuaternion(new T.Quaternion()));
          let turn = Math.atan2(new T.Vector3().crossVectors(oldB, b).dot(u), oldB.dot(b));
          if (previous !== null) {
            while (turn - previous > Math.PI) turn -= 2 * Math.PI;
            while (turn - previous < -Math.PI) turn += 2 * Math.PI;
          }
          rows.push(turn);
          previous = turn;
        }
        turnCurves[side] = rows;
      }
      prepared = true;
    },
    apply({ joints, flight, phase }) {
      if (!prepared) return {};
      const result = {};
      for (const side of ['left', 'right']) {
        const win = windows[side];
        if (phase <= win.start || phase >= win.end || flight[side] <= 0) continue;
        const s = V(joints[side + 'Shoulder']), e = V(joints[side + 'Elbow']), w = V(joints[side + 'Wrist']);
        const u = e.clone().sub(s).normalize(), f = w.clone().sub(e).normalize();
        const l1 = s.distanceTo(e), l2 = e.distanceTo(w);
        const oldHand = bones.get(side + 'Hand').getWorldQuaternion(new T.Quaternion());
        const blend = smooth((phase - win.start) / (win.full - win.start))
          * smooth((win.end - phase) / (win.end - win.release));
        const oldB = f.clone().addScaledVector(u, -f.dot(u)).normalize();
        const index = T.MathUtils.clamp((phase - win.start) / (win.end - win.start) * 240, 0, 239.999999);
        const i = Math.floor(index);
        const turn = T.MathUtils.lerp(turnCurves[side][i], turnCurves[side][i + 1], index - i);
        const poleRelease = side === 'left' ? .40 : .88;
        const transportBlend = smooth((phase - win.start) / (win.full - win.start))
          * smooth((win.end - phase) / (win.end - poleRelease));
        const b = oldB.clone().applyAxisAngle(u, turn * transportBlend);
        const oldAngle = u.clone().negate().angleTo(f);
        const stable = rad(104 + 4 * Math.sin(Math.PI
          * T.MathUtils.clamp((phase - win.full) / (win.aligned - win.full), 0, 1)));
        const angle = T.MathUtils.lerp(oldAngle, stable, blend);
        const carried = u.clone().multiplyScalar(-Math.cos(angle)).addScaledVector(b, Math.sin(angle)).normalize();
        const carriedRay = u.clone().multiplyScalar(l1).addScaledVector(carried, l2).normalize();
        const landingRay = w.clone().sub(s).normalize();

        // Move the complete bent arm from the original anatomical upper-arm
        // orientation. This swing changes the elbow route instead of adding
        // axial roll while leaving the elbow fixed.
        const close = new T.Quaternion().setFromUnitVectors(carriedRay, landingRay);
        const nu = u.clone().applyQuaternion(close), nf = carried.applyQuaternion(close);
        const ne = s.clone().addScaledVector(nu, l1), nw = ne.clone().addScaledVector(nf, l2);
        // Keep the skin's existing axial convention: only the necessary swing
        // follows the changed segment direction, never an independent bone roll.
        const geometricLower = new T.Quaternion().setFromUnitVectors(f, nf);
        const upperMatrix = transform(s, s, close), lowerMatrix = transform(e, ne, geometricLower);
        const targetHand = geometricLower.clone().multiply(oldHand);
        // Palm preparation overlaps transport. Retain a little wrist follow,
        // and return exactly to the inherited contact orientation at the end.
        const alignStart = side === 'left' ? .29 : .77, alignEnd = side === 'left' ? .405 : .885;
        targetHand.slerp(landing[side], .92 * smooth((phase - alignStart) / (alignEnd - alignStart))
          * smooth((win.end - phase) / .025));
        const handMatrix = transform(w, nw, targetHand.multiply(oldHand.clone().invert()));
        applyMatrix([side + 'UpperArm'], upperMatrix);
        applyMatrix([side + 'Forearm'], lowerMatrix);
        applyMatrix([side + 'Hand'], handMatrix);
        result[side] = {
          shoulderTransform: upperMatrix.toArray(), forearmTransform: lowerMatrix.toArray(),
          handTransform: handMatrix.toArray(), originalPalm: joints[side + 'Palm'],
          elbowDisplacement: ne.distanceTo(e), wristDisplacement: nw.distanceTo(w),
          elbowBeforeDegrees: deg(oldAngle), elbowAfterDegrees: deg(angle),
          phaseLabel: phase < win.full ? 'release-and-fold'
            : phase < win.aligned ? 'bent-arm-transport' : 'aligned-descent-and-reach',
          blend,
        };
      }
      return result;
    },
  };
}
