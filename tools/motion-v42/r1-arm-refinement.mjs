import * as THREE from 'three';

const V=a=>new THREE.Vector3().fromArray(a);
const rad=THREE.MathUtils.degToRad,deg=THREE.MathUtils.radToDeg;
const smooth=x=>{x=THREE.MathUtils.clamp(x,0,1);return x*x*x*(10+x*(-15+6*x));};

// R7/04's two narrow pole-direction turns were measured at 541 stored poses.
// These are CURRENT normalized clip phases (before the source rhythm mapping).
// Rows contain [start, end, start angle, end angle, start slope, end slope].
// Angles are degrees; slopes are degrees per whole normalized cycle. The
// endpoint values/slopes come from that retained 04 curve. A Hermite bridge
// spreads its turn locally; the 0.006-cycle C2 edge blend preserves the exact
// original correction outside each open interval and at every boundary.
const POLE_TRANSFER_WINDOWS={
  left:[.27,.34,-19.386,30.33,846,-40],
  right:[.68,.74,-31.28,20.88,60,880],
};
// Bounded degree-valued residuals on the Hermite bridge. A finite internal
// comparison chose these to reduce the actual baked forearm step peaks while
// retaining the 04 poses at .20/.25/.65/.75 and every pose outside the windows.
// The residual basis is 16*u²*(1-u)² * [1, (2*u-1), (2*u-1)²].
const DEFAULT_POLE_POLISH={left:[-12,-9,15],right:[9,-13,-12]};
const POLE_EDGE_BLEND_PHASE=.006;

/** A local refinement of the solved R1 arm, not a new transfer route.
 * The wrist moves a few centimetres toward the actual head and torso axis.
 * The original elbow bend is minimally transported, then steered a bounded
 * amount toward the ribs. The two segment lengths and anatomical hinge remain.
 */
export function createR1ArmRefinement({ model,bones,parameters={} }) {
  const {polish=structuredClone(DEFAULT_POLE_POLISH),...scalarParameters}=parameters;
  const settings={ headwardMetres:0.055, inwardMetres:0.025, poleTuckDegrees:42, closeDegrees:12, ...scalarParameters };
  for (const [name,value] of Object.entries(settings)) if (!Number.isFinite(value) || value<0) throw new Error(`Invalid arm refinement ${name}`);
  if(settings.headwardMetres>0.08 || settings.inwardMetres>0.05 || settings.poleTuckDegrees>60 || settings.closeDegrees>20) throw new Error('R1 refinement exceeds local edit bounds');
  for(const side of ['left','right']) if(!Array.isArray(polish[side]) || polish[side].length!==3 || polish[side].some(value=>!Number.isFinite(value) || Math.abs(value)>30)) throw new Error('Invalid local pole polish coefficients');
  const transform=(from,to,q)=>new THREE.Matrix4().makeTranslation(...to.toArray())
    .multiply(new THREE.Matrix4().makeRotationFromQuaternion(q))
    .multiply(new THREE.Matrix4().makeTranslation(...from.clone().negate().toArray()));
  const frame=(u,f)=>{
    const b=f.clone().addScaledVector(u,-f.dot(u)).normalize();
    return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(u,b,new THREE.Vector3().crossVectors(u,b)));
  };
  function apply(names,matrix) {
    for(const name of names) {
      const bone=bones.get(name);
      if(bone.parent.isBone) throw new Error('R1 refinement expects parallel deform bones');
      const local=bone.parent.matrixWorld.clone().invert().multiply(matrix).multiply(bone.matrixWorld);
      local.decompose(bone.position,bone.quaternion,bone.scale);bone.updateMatrix();
    }
    model.updateMatrixWorld(true);
  }
  return { parameters:{...settings,polish},apply({joints,flight,recovery,phase}) {
    const result={};
    const head=V(joints.head),bodyLeft=V(joints.leftShoulder).sub(V(joints.rightShoulder)).normalize();
    const chest=V(joints.leftShoulder).add(V(joints.rightShoulder)).multiplyScalar(0.5);
    const bodyUp=chest.sub(V(joints.pelvis)).normalize(),bodyFront=new THREE.Vector3().crossVectors(bodyLeft,bodyUp).normalize();
    for(const side of ['left','right']) {
      const amount=recovery[side];
      if(flight[side]<=0 || amount<=0) continue;
      const s=V(joints[side+'Shoulder']),e=V(joints[side+'Elbow']),w=V(joints[side+'Wrist']);
      const l1=s.distanceTo(e),l2=e.distanceTo(w),axis=w.clone().sub(s).normalize();
      const bend=e.clone().sub(s).addScaledVector(axis,-e.clone().sub(s).dot(axis)).normalize();
      const headward=head.clone().sub(w).normalize();
      const nw=w.clone().addScaledVector(headward,settings.headwardMetres*amount)
        .addScaledVector(bodyLeft,(side==='left'?-1:1)*settings.inwardMetres*amount);
      const ray=nw.clone().sub(s),distance=ray.length(),nextAxis=ray.normalize();
      if(distance>=l1+l2-0.00001 || distance<=Math.abs(l1-l2)+0.00001) continue;
      bend.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(axis,nextAxis)).normalize();
      const transported=bend.clone();
      const down=V(joints[side+'Hip']).sub(s).normalize();
      const preferred=down.clone().addScaledVector(bodyFront,0.7);
      preferred.addScaledVector(nextAxis,-preferred.dot(nextAxis)).normalize();
      const angle=Math.atan2(new THREE.Vector3().crossVectors(bend,preferred).dot(nextAxis),bend.dot(preferred));
      let tuck=rad(settings.poleTuckDegrees)*amount*Math.sin(angle);
      const curve=POLE_TRANSFER_WINDOWS[side];
      const [lo,hi,a,b,da,db]=curve;
      if(phase>lo && phase<hi){
        const u=(phase-lo)/(hi-lo),u2=u*u,u3=u2*u;
        const c=polish[side],x=2*u-1;
        const shaped=(2*u3-3*u2+1)*a+(u3-2*u2+u)*(hi-lo)*da+(-2*u3+3*u2)*b+(u3-u2)*(hi-lo)*db+16*u2*(1-u)*(1-u)*(c[0]+c[1]*x+c[2]*x*x);
        const blend=smooth((phase-lo)/POLE_EDGE_BLEND_PHASE)*smooth((hi-phase)/POLE_EDGE_BLEND_PHASE);
        tuck=THREE.MathUtils.lerp(tuck,rad(shaped)*settings.poleTuckDegrees/42,blend);
      }
      bend.applyAxisAngle(nextAxis,tuck).normalize();
      const along=(l1*l1-l2*l2+distance*distance)/(2*distance);
      const radius=Math.sqrt(Math.max(0,l1*l1-along*along));
      const ne=s.clone().addScaledVector(nextAxis,along).addScaledVector(bend,radius);
      // Residual shoulder closing addresses the remaining wide mid-transfer
      // poses. It moves the whole solved arm, preserving its hinge and length.
      const provisional=ne.clone().sub(s).normalize(),open=provisional.angleTo(down);
      const gate=THREE.MathUtils.smoothstep(deg(open),72,100);
      const close=rad(settings.closeDegrees)*amount*gate;
      const closing=new THREE.Quaternion().slerp(new THREE.Quaternion().setFromUnitVectors(provisional,down),close/Math.max(open,1e-8));
      ne.sub(s).applyQuaternion(closing).add(s);nw.sub(s).applyQuaternion(closing).add(s);
      const oldUpper=e.clone().sub(s).normalize(),oldForearm=w.clone().sub(e).normalize();
      const nextUpper=ne.clone().sub(s).normalize(),nextForearm=nw.clone().sub(ne).normalize();
      const shoulderQ=frame(nextUpper,nextForearm).multiply(frame(oldUpper,oldForearm).invert());
      const forearmQ=new THREE.Quaternion().setFromUnitVectors(oldForearm.clone().applyQuaternion(shoulderQ),nextForearm).multiply(shoulderQ);
      const upperMatrix=transform(s,s,shoulderQ),lowerMatrix=transform(e,ne,forearmQ);
      apply([side+'UpperArm'],upperMatrix);apply([side+'Forearm',side+'Hand'],lowerMatrix);
      result[side]={shoulderTransform:upperMatrix.toArray(),forearmTransform:lowerMatrix.toArray(),
        originalPalm:joints[side+'Palm'],headwardDisplacement:nw.clone().sub(w).dot(headward),
        elbowDisplacement:ne.distanceTo(e),wristDisplacement:nw.distanceTo(w),
        tuckDegrees:deg(tuck),transportedBendDot:bend.dot(transported),
        openingBeforeDegrees:deg(oldUpper.angleTo(down)),openingAfterDegrees:deg(nextUpper.angleTo(down)),
        elbowBeforeDegrees:deg(oldUpper.clone().negate().angleTo(oldForearm)),elbowAfterDegrees:deg(nextUpper.clone().negate().angleTo(nextForearm))};
    }
    return result;
  }};
}
