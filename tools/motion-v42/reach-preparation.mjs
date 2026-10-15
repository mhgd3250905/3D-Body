import * as T from 'three';
const V = a => new T.Vector3().fromArray(a);
const smooth = x => { x = T.MathUtils.clamp(x, 0, 1); return x*x*x*(10+x*(-15+6*x)); };
// Integrated quintic velocity ramps with a broad constant-speed middle.
// Unlike a full-span smoothstep, this does not compress most motion at midspan.
const distributed = x => {
  x=T.MathUtils.clamp(x,0,1);
  const ramp=.2;
  if(x>1-ramp) return 1-distributed(1-x);
  if(x>=ramp) return (x-ramp/2)/(1-ramp);
  const t=x/ramp;
  return ramp*(t**6-3*t**5+2.5*t**4)/(1-ramp);
};
const windows = {
  left: { start: .38, straight: .472, end: .505, alignStart:.395, smoothStart:.42, smoothEnd:.46 },
  right: { start: .83, straight: .95, end: .995, alignStart:.86, smoothStart:.88, smoothEnd:.92 },
};
const transform = (from, to, q) => new T.Matrix4().makeTranslation(...to.toArray())
  .multiply(new T.Matrix4().makeRotationFromQuaternion(q))
  .multiply(new T.Matrix4().makeTranslation(...from.clone().negate().toArray()));

// R12: retain the distributed the middle transition, complete the extension before contact, then lower the long arm as a
// coordinated chain. All rotations are shortest swings of actual R8 bones;
// shoulder origins, segment lengths and the source support timing are retained.
export function createReachPreparation({ model, bones }) {
  let prepared = false;
  const reference = {};
  const applyMatrix = (name, matrix) => {
    const bone = bones.get(name);
    const local = bone.parent.matrixWorld.clone().invert().multiply(matrix).multiply(bone.matrixWorld);
    local.decompose(bone.position, bone.quaternion, bone.scale);
    bone.updateMatrix(); model.updateMatrixWorld(true);
  };
  return {
    parameters: { windows, straightDegrees:177, transitionProfile:'integrated-quintic-velocity-ramp-20-percent', rightEarlyAlignment:{start:.83,fadeStart:.86,end:.88,fraction:.22}, scope:'Coordinated two-bone early extension and landing-directed lowering; minimal anatomical swings without axial roll' },
    prepare(evaluate) {
      for (const side of ['left','right']) {
        evaluate(windows[side].start);
        const handFrom = bones.get(side+'Hand').getWorldQuaternion(new T.Quaternion());
        const win=windows[side], epsilon=.0001;
        const upperAt=p=>{const j=evaluate(p).joints;return V(j[side+'Elbow']).sub(V(j[side+'Shoulder'])).normalize();};
        const u0=upperAt(win.smoothStart),u1=upperAt(win.smoothEnd);
        const v0=upperAt(win.smoothStart+epsilon).sub(upperAt(win.smoothStart-epsilon)).multiplyScalar((win.smoothEnd-win.smoothStart)/(2*epsilon));
        const v1=upperAt(win.smoothEnd+epsilon).sub(upperAt(win.smoothEnd-epsilon)).multiplyScalar((win.smoothEnd-win.smoothStart)/(2*epsilon));
        const metrics = evaluate(win.end);
        const j=metrics.joints, endAngle=V(j[side+'Shoulder']).sub(V(j[side+'Elbow'])).angleTo(V(j[side+'Wrist']).sub(V(j[side+'Elbow'])));
        reference[side] = { wrist:V(metrics.joints[side+'Wrist']), handFrom, endAngle,u0,u1,v0,v1,
          handTo:bones.get(side+'Hand').getWorldQuaternion(new T.Quaternion()) };
      }
      prepared = true;
    },
    apply({ phase, joints }) {
      if (!prepared) return {};
      const result = {};
      for (const side of ['left','right']) {
        const win = windows[side];
        if (phase <= win.start || phase >= win.end) continue;
        const shoulder=V(joints[side+'Shoulder']), elbow=V(joints[side+'Elbow']), wrist=V(joints[side+'Wrist']);
        const upper=elbow.clone().sub(shoulder), forearm=wrist.clone().sub(elbow);
        const l1=upper.length(),l2=forearm.length(), before=upper.clone().negate().angleTo(forearm);
        const opening=distributed((phase-win.start)/(win.straight-win.start));
        const joining=smooth((phase-win.straight)/(win.end-win.straight));
        const straight=T.MathUtils.degToRad(177);
        const after=phase<=win.straight?T.MathUtils.lerp(before,straight,opening):T.MathUtils.lerp(straight,reference[side].endAngle,joining);
        const ref=reference[side], baseUpper=upper.clone().normalize();
        if(phase>win.smoothStart && phase<win.smoothEnd){
          const t=(phase-win.smoothStart)/(win.smoothEnd-win.smoothStart),t2=t*t,t3=t2*t;
          baseUpper.copy(ref.u0).multiplyScalar(2*t3-3*t2+1).addScaledVector(ref.v0,t3-2*t2+t)
            .addScaledVector(ref.u1,-2*t3+3*t2).addScaledVector(ref.v1,t3-t2).normalize();
        }
        const carry=new T.Quaternion().setFromUnitVectors(upper.clone().normalize(),baseUpper);
        const oldBend=forearm.clone().normalize().addScaledVector(upper.clone().normalize(),-forearm.clone().normalize().dot(upper.clone().normalize())).normalize().applyQuaternion(carry);
        const provisionalFore=baseUpper.clone().multiplyScalar(-Math.cos(after)).addScaledVector(oldBend,Math.sin(after));
        const provisionalWrist=baseUpper.clone().multiplyScalar(l1).addScaledVector(provisionalFore,l2);
        const ray=provisionalWrist.clone().normalize();
        const reach=Math.sqrt(l1*l1+l2*l2-2*l1*l2*Math.cos(after));
        const horizontal=new T.Vector3(ref.wrist.x-shoulder.x,0,ref.wrist.z-shoulder.z);
        const landing=horizontal.clone().setY(-Math.sqrt(Math.max(.000001,reach*reach-horizontal.lengthSq()))).normalize();
        let alignment=distributed((phase-win.alignStart)/(win.straight-win.alignStart));
        // R12: the right elbow was opening before its landing alignment began,
        // causing a millimetric outward wrist reversal near .848. Borrow only a
        // small part of the earlier alignment, then return exactly by .88.
        if(side==='right' && phase>.83 && phase<.88){
          const early=distributed((phase-.83)/(.95-.83));
          alignment+=.22*(early-alignment)*(1-smooth((phase-.86)/.02));
        }
        const raySwing=new T.Quaternion().setFromUnitVectors(ray,landing);
        const direction=ray.clone().applyQuaternion(new T.Quaternion().slerp(raySwing,alignment));
        // One continuous landing alignment acts on the complete extended chain.
        const bend=baseUpper.clone().addScaledVector(ray,-baseUpper.dot(ray)).normalize()
          .applyQuaternion(new T.Quaternion().setFromUnitVectors(ray,direction));
        const along=(l1*l1+reach*reach-l2*l2)/(2*reach);
        const lateral=Math.sqrt(Math.max(0,l1*l1-along*along));
        const nextElbow=shoulder.clone().addScaledVector(direction,along).addScaledVector(bend,lateral);
        const nextWrist=shoulder.clone().addScaledVector(direction,reach);
        const upperRotation=new T.Quaternion().setFromUnitVectors(upper.normalize(),nextElbow.clone().sub(shoulder).normalize());
        const lowerRotation=new T.Quaternion().setFromUnitVectors(forearm.normalize(),nextWrist.clone().sub(nextElbow).normalize());
        const upperMatrix=transform(shoulder,shoulder,upperRotation);
        const forearmMatrix=transform(elbow,nextElbow,lowerRotation);
        const handBefore=bones.get(side+'Hand').getWorldQuaternion(new T.Quaternion());
        const handAfter=reference[side].handFrom.clone().slerp(reference[side].handTo,opening);
        const handMatrix=transform(wrist,nextWrist,handAfter.multiply(handBefore.clone().invert()));
        applyMatrix(side+'UpperArm',upperMatrix);
        applyMatrix(side+'Forearm',forearmMatrix);
        applyMatrix(side+'Hand',handMatrix);
        result[side]={upperTransform:upperMatrix.toArray(),forearmTransform:forearmMatrix.toArray(),handTransform:handMatrix.toArray(),
          elbowBeforeDegrees:T.MathUtils.radToDeg(before),elbowAfterDegrees:T.MathUtils.radToDeg(after),
          elbowDisplacement:nextElbow.distanceTo(elbow),upperSwingDegrees:T.MathUtils.radToDeg(upperRotation.angleTo(new T.Quaternion())),
          wristDisplacement:nextWrist.distanceTo(wrist),phaseLabel:phase<win.straight?'complete-extension':'long-arm-lowering'};
      }
      return result;
    },
  };
}
