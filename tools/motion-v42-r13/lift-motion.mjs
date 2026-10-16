// R13 experiment: mirror R12's right landing, played backwards, into left lift.
// R12 authoring modules and all previously delivered assets remain immutable.
import * as T from 'three';
import { createNaturalFlareMotion as createR12 } from '../motion-v42/natural-motion.mjs';

const smooth = x => { x = T.MathUtils.clamp(x, 0, 1); return x*x*x*(10+x*(-15+6*x)); };
const mirror = v => new T.Vector3(-v.x, v.y, v.z);
const transform = (from, to, q) => new T.Matrix4().makeTranslation(...to.toArray())
  .multiply(new T.Matrix4().makeRotationFromQuaternion(q))
  .multiply(new T.Matrix4().makeTranslation(...from.clone().negate().toArray()));
const settings = Object.freeze({ start: .06, full: .12, peak: 146/540, end: .36,
  referenceStart: .92, referenceEnd: 400/540, stableAnchor: .144, followFrom: .20, settleFrom: .24,
  strength: 1, maxTurnDegrees: 30 });

export function createNaturalFlareMotion(options) {
  const source = createR12(options), { model } = options;
  const bones = new Map(); model.traverse(o => { if (o.isBone) bones.set(o.name, o); });
  const point = name => bones.get(name).getWorldPosition(new T.Vector3());
  // Anatomical frame from shoulders and torso/hip, rather than assuming a
  // particular imported bone roll is the body's left-right mirror plane.
  function bodyFrame() {
    const x = point('leftUpperArm').sub(point('rightUpperArm')).normalize();
    const y = point('torso').sub(point('pelvis')); y.addScaledVector(x, -y.dot(x)).normalize();
    const z = new T.Vector3().crossVectors(x,y).normalize();
    y.crossVectors(z,x).normalize();
    return new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(x,y,z));
  }
  function sample(phase, side) {
    source.updatePhase(phase); model.updateMatrixWorld(true);
    const s=point(side+'UpperArm'), e=point(side+'Forearm'), w=point(side+'Hand');
    const inv=bodyFrame().invert(), axis=w.clone().sub(s).normalize();
    const bend=e.clone().sub(s).addScaledVector(axis,-e.clone().sub(s).dot(axis)).normalize();
    return { y:w.y, axis:axis.applyQuaternion(inv), bend:bend.applyQuaternion(inv) };
  }
  // Match relative wrist elevation during lift to the reverse landing arc.
  // This uses the user's .92 reference, not the unstable nearly straight .95+.
  const references = Array.from({length:361},(_,i) => {
    const phase=T.MathUtils.lerp(settings.referenceStart,settings.referenceEnd,i/360);
    return { phase, ...sample(phase,'right') };
  });
  const leftLow=sample(settings.start,'left').y, leftHigh=sample(settings.peak,'left').y;
  const rightLow=references[0].y, rightHigh=references.at(-1).y;
  const turns=[];
  for(let i=0;i<=300;i++) {
    const phase=T.MathUtils.lerp(settings.start,settings.end,i/300);
    // Near-straight release directions are ill-conditioned. Carry the first
    // reliable correction into release, then C1-join the moving reference.
    // After the peak hold that correction and fade it, rather than chasing
    // a different descending-arm direction while supposedly fading out.
    let samplePhase=T.MathUtils.clamp(phase,settings.stableAnchor,settings.peak);
    if(samplePhase<settings.followFrom) {
      const t=(samplePhase-settings.stableAnchor)/(settings.followFrom-settings.stableAnchor);
      samplePhase=settings.stableAnchor+(settings.followFrom-settings.stableAnchor)*(6*t**3-8*t**4+3*t**5);
    } else if(samplePhase>settings.settleFrom) {
      const t=(samplePhase-settings.settleFrom)/(settings.peak-settings.settleFrom);
      samplePhase=settings.settleFrom+(settings.peak-settings.settleFrom)*(t+4*t**3-7*t**4+3*t**5);
    }
    const left=sample(samplePhase,'left');
    const lift=samplePhase>=settings.peak ? 1 : T.MathUtils.clamp((left.y-leftLow)/(leftHigh-leftLow),0,1);
    const height=T.MathUtils.lerp(rightLow,rightHigh,lift);
    let k=0; while(k<references.length-2 && references[k+1].y<height) k++;
    const a=references[k], b=references[k+1], f=T.MathUtils.clamp((height-a.y)/(b.y-a.y),0,1);
    const axis=mirror(a.axis.clone().lerp(b.axis,f).normalize());
    const bend=mirror(a.bend.clone().lerp(b.bend,f).normalize());
    bend.applyQuaternion(new T.Quaternion().setFromUnitVectors(axis,left.axis));
    const angle=Math.atan2(left.axis.dot(left.bend.clone().cross(bend)),left.bend.dot(bend));
    turns.push({phase,referencePhase:T.MathUtils.lerp(a.phase,b.phase,f),angle});
  }
  function interpolate(phase) {
    const n=T.MathUtils.clamp((phase-settings.start)/(settings.end-settings.start)*300,0,299.999999);
    const i=Math.floor(n), t=n-i;
    const vals=[i-1,i,i+1,i+2].map(j=>turns[T.MathUtils.clamp(j,0,300)].angle);
    const [a,b,c,d]=vals;
    const angle=.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t);
    return { angle, referencePhase:T.MathUtils.lerp(turns[i].referencePhase,turns[i+1].referencePhase,t) };
  }
  let adjustment=null;
  function updatePhase(value) {
    source.updatePhase(value); adjustment=null;
    const phase=((value%1)+1)%1;
    if(phase<=settings.start || phase>=settings.end) return model;
    const s=point('leftUpperArm'), e=point('leftForearm'), w=point('leftHand');
    const u=w.clone().sub(s).normalize(), radial=e.clone().sub(s);
    const along=radial.dot(u); radial.addScaledVector(u,-along);
    const weight=smooth((phase-settings.start)/(settings.full-settings.start))
      *(1-smooth((phase-settings.peak)/(settings.end-settings.peak)));
    const reference=interpolate(phase);
    const turn=T.MathUtils.clamp(reference.angle,-T.MathUtils.degToRad(settings.maxTurnDegrees),T.MathUtils.degToRad(settings.maxTurnDegrees))*weight*settings.strength;
    const next=e.clone().copy(s).addScaledVector(u,along).add(radial.applyAxisAngle(u,turn));
    const upper=new T.Quaternion().setFromUnitVectors(e.clone().sub(s).normalize(),next.clone().sub(s).normalize());
    const lower=new T.Quaternion().setFromUnitVectors(w.clone().sub(e).normalize(),w.clone().sub(next).normalize());
    const handWorld=bones.get('leftHand').matrixWorld.clone();
    const apply=(name,matrix)=>{const bone=bones.get(name);bone.parent.matrixWorld.clone().invert().multiply(matrix)
      .decompose(bone.position,bone.quaternion,bone.scale);bone.updateMatrix();model.updateMatrixWorld(true);};
    // Capture both targets before moving any bone, also supports hierarchical rigs.
    const upperWorld=transform(s,s,upper).multiply(bones.get('leftUpperArm').matrixWorld);
    const lowerWorld=transform(e,next,lower).multiply(bones.get('leftForearm').matrixWorld);
    apply('leftUpperArm',upperWorld); apply('leftForearm',lowerWorld); apply('leftHand',handWorld);
    model.traverse(o=>{if(o.isSkinnedMesh)o.skeleton.update();});
    adjustment={referencePhase:reference.referencePhase,turnDegrees:T.MathUtils.radToDeg(turn),weight,
      elbowDisplacement:next.distanceTo(e),shoulderAndWristPreserved:true};
    return model;
  }
  function getMetrics() {
    const metrics=source.getMetrics();
    return {...metrics,version:'v42-r13-left-lift-reference-c',design:{...metrics.design,liftRefinement:adjustment}};
  }
  updatePhase(0);
  function capturePose() {
    const pose=source.capturePose();
    if(adjustment) pose.limbs.left.elbowPole=point('leftForearm').toArray();
    return pose;
  }
  return {...source, updatePhase,getMetrics,capturePose,
    parameters:{...source.parameters,revision:'v42-r13-left-lift-reference-c',leftLift:settings},
    describeRecovery:()=>({...source.describeRecovery(),leftLift:{settings,reference:'R12 right .92 to .740741 reversed, mirrored in body coordinates; matched normalized wrist elevation',scope:'Left elbow bend plane only. Shoulder/wrist/hand transform, bone lengths and the rest of the cycle preserved.'}})};
}
