// R16: conservative authored study based on the frozen, accepted R14 GLB.
// Reference video informs event relationships, never supplies fitted joint values.
import * as T from 'three';

const SIDES = ['left', 'right'];
const V = a => new T.Vector3(...a);
const clamp = T.MathUtils.clamp;
const smooth = x => { x = clamp(x, 0, 1); return x*x*x*(10+x*(-15+6*x)); };
const wrap = x => ((x % 1) + 1) % 1;
const rigid = (from, to, q) => new T.Matrix4().makeTranslation(to.x,to.y,to.z)
  .multiply(new T.Matrix4().makeRotationFromQuaternion(q))
  .multiply(new T.Matrix4().makeTranslation(-from.x,-from.y,-from.z));
const position = m => new T.Vector3().setFromMatrixPosition(m);
const rotation = m => new T.Quaternion().setFromRotationMatrix(m).normalize();

export const R16_PARAMETERS = Object.freeze({
  revision: 'v42-r16-support-elbow-fix', cycleSeconds: 1.35, sampleCount: 540,
  sideTorsoElevationDegrees: 18, maximumAdditionalTiltDegrees: 14,
  contactOverlapPhase: .005, armVelocityRampFraction: .01,
  contactTimingBlendPhase: .04,
  armLandingReturnPhase: [.39, .425],
  maximumElbowOpenDegrees: 177, maximumContactTranslationMetres: .03,
  sideWindows: {left: [.08,.21,.31,.425], right: [.58,.71,.81,.925]},
  shoeDesiredMinY: .012, shoeMaximumCorrectionDegrees: 15,
});

// Integral of a quintic velocity ramp: finite cruise speed, zero endpoint velocity.
function travel(u, ramp) {
  u = clamp(u,0,1);
  const integral = x => 2.5*x**4-3*x**5+x**6;
  if (u < ramp) return ramp*integral(u/ramp)/(1-ramp);
  if (u > 1-ramp) return 1-ramp*integral((1-u)/ramp)/(1-ramp);
  return (u-ramp/2)/(1-ramp);
}

export function createReferenceMotion({model, sourceModel, baselineModel, rigData, clip, palmAnchors, clock, parameters={}}) {
  const settings = {...R16_PARAMETERS,...parameters};
  const bones = new Map(); model.traverse(o=>{if(o.isBone)bones.set(o.name,o);});
  if(model===sourceModel)throw new Error('The frozen sampler and output actor must be separate scenes');
  const sourceBones = new Map();sourceModel.traverse(o=>{if(o.isBone)sourceBones.set(o.name,o);});
  const restInverse = new Map(); baselineModel.updateMatrixWorld(true);
  baselineModel.traverse(o=>{if(o.isBone)restInverse.set(o.name,o.matrixWorld.clone().invert());});
  const landmarks = Object.fromEntries(Object.entries(rigData.landmarks).map(([n,p])=>[n,V(p)]));
  const boneFor = n => ['pelvis','torso','head','neck'].includes(n)?n:n.replace(/Shoulder$/,'UpperArm').replace(/Elbow$/,'Forearm').replace(/Wrist$/,'Hand').replace(/Hip$/,'Thigh').replace(/Knee$/,'Shin').replace(/Ankle$/,'Foot');
  const meshes=[],outputMeshes=[];sourceModel.traverse(o=>{if(o.isSkinnedMesh)meshes.push(o);});model.traverse(o=>{if(o.isSkinnedMesh)outputMeshes.push(o);});
  const mixer=new T.AnimationMixer(sourceModel),action=mixer.clipAction(clip);
  action.setLoop(T.LoopOnce,1);action.clampWhenFinished=true;action.play();
  const seek=p=>{
    // R14 has translation/rotation tracks only. Reset the previous evaluation's
    // scale and normalize float32 source quaternions before reading a new pose.
    for(const b of sourceBones.values())b.scale.set(1,1,1);
    action.enabled=true;action.paused=false;mixer.setTime(clamp(p,0,1)*clip.duration);
    for(const b of sourceBones.values())b.quaternion.normalize();
    sourceModel.updateMatrixWorld(true);for(const m of meshes)m.skeleton.update();
  };
  seek(0);
  const palmLocal=Object.fromEntries(SIDES.map(s=>[s,V(palmAnchors[s]).applyMatrix4(sourceBones.get(s+'Hand').matrixWorld.clone().invert())]));
  const shoeRefs=Object.fromEntries(SIDES.map(s=>[s,[]]));
  for(const mesh of meshes) {
    if(!/^Coach_(Sneakers|Soles|Shoe_Details)(?:_|$)/.test(mesh.name))continue;
    const a=mesh.geometry.attributes;
    for(let i=0;i<a.position.count;i++)for(const side of SIDES){
      let w=0;for(let k=0;k<4;k++)if(mesh.skeleton.bones[a.skinIndex.getComponent(i,k)]?.name===side+'Foot')w+=a.skinWeight.getComponent(i,k);
      if(w>.7)shoeRefs[side].push({mesh,i});
    }
  }
  function joints(matrices) {
    const result={};
    for(const [n,p]of Object.entries(landmarks)){const bn=boneFor(n);result[n]=p.clone().applyMatrix4(restInverse.get(bn)).applyMatrix4(matrices.get(bn));}
    for(const side of SIDES)result[side+'Palm']=palmLocal[side].clone().applyMatrix4(matrices.get(side+'Hand'));
    return result;
  }
  function sample(p,withShoes=false) {
    seek(p);const matrices=new Map([...sourceBones].map(([n,b])=>[n,b.matrixWorld.clone()]));
    const result={matrices,joints:joints(matrices)};
    if(withShoes)result.shoes=Object.fromEntries(SIDES.map(s=>[s,shoeRefs[s].map(({mesh,i})=>mesh.getVertexPosition(i,new T.Vector3()).applyMatrix4(mesh.matrixWorld))]));
    return result;
  }
  function applyMatrices(matrices) {
    for(const [n,m]of matrices){const b=bones.get(n);b.parent.matrixWorld.clone().invert().multiply(m).decompose(b.position,b.quaternion,b.scale);b.quaternion.normalize();b.scale.set(1,1,1);b.updateMatrix();}
    model.updateMatrixWorld(true);for(const m of outputMeshes)m.skeleton.update();
  }
  let phase=0,last=null,lastJoints=null;
  function updatePhase(value) {
    phase=wrap(value);const original=sample(phase,true);
    const matrices=new Map([...original.matrices].map(([n,m])=>[n,m.clone()]));
    const armInfo={}, armTargets={};
    for(const side of SIDES)armTargets[side]={pose:original,transport:new T.Matrix4()};
    // Compress only each free-arm journey; the inherited leg clock stays intact.
    for(const side of SIDES){
      const start=side==='left'?0:.5, u=(phase-start)/.5;
      if(u<0||u>1)continue;
      const inset=settings.contactOverlapPhase; // Half of this fraction at each end of the free half-cycle.
      const mapped=travel((u-inset)/(1-2*inset),settings.armVelocityRampFraction);
      // Restore R14's phase derivative through contact. A held wrist combined
      // with a moving torso otherwise makes the almost-straight other elbow
      // bend too quickly, even when the shoulder stays attached.
      const local=phase-start;
      // Retiming belongs to free flight. Restore the source timing before the
      // hand lands, so a future wrist target cannot push the torso down and
      // buckle the opposite, planted arm through the shared reach projection.
      const [landingStart,landingEnd]=settings.armLandingReturnPhase;
      const contactEase=smooth(local/settings.contactTimingBlendPhase)*smooth((.5-local)/settings.contactTimingBlendPhase)
        *(1-smooth((local-landingStart)/(landingEnd-landingStart)));
      const armPhase=T.MathUtils.lerp(phase,start+.5*mapped,contactEase),old=sample(armPhase);
      const s=old.joints[side+'Shoulder'],targetS=original.joints[side+'Shoulder'];
      const flight=smooth((old.joints[side+'Palm'].y-.008)/.12);
      const carried=rotation(original.matrices.get('torso')).multiply(rotation(old.matrices.get('torso')).invert());
      const q=new T.Quaternion().slerp(carried,flight);
      const transportedOrigin=s.clone().lerp(targetS,flight),transport=rigid(s,transportedOrigin,q);
      armTargets[side]={pose:old,transport};
      armInfo[side]={sourcePhase:armPhase,flight,contactEase};
    }
    // Keep both shoulders attached to the current torso. A minimal shared body
    // translation supplies reach for the briefly overlapping contact targets.
    // Dykstra projection finds the nearest translation in both reach balls.
    const constraints=SIDES.map(side=>{
      const {pose,transport}=armTargets[side],j=pose.joints;
      const s=j[side+'Shoulder'],e=j[side+'Elbow'],h=j[side+'Wrist'];
      const wrist=h.clone().applyMatrix4(transport),shoulder=original.joints[side+'Shoulder'];
      const l1=s.distanceTo(e),l2=e.distanceTo(h);
      const radius=Math.sqrt(l1*l1+l2*l2-2*l1*l2*Math.cos(T.MathUtils.degToRad(settings.maximumElbowOpenDegrees)));
      return {side,pose,transport,wrist,shoulder,l1,l2,radius,center:wrist.clone().sub(shoulder)};
    });
    const shift=new T.Vector3(),residuals=SIDES.map(()=>new T.Vector3());
    for(let iteration=0;iteration<96;iteration++){
      const previous=shift.clone();
      for(let i=0;i<constraints.length;i++){
        const c=constraints[i],candidate=shift.clone().add(residuals[i]),ray=candidate.clone().sub(c.center),radius=c.radius;
        const projected=ray.length()>radius?c.center.clone().add(ray.setLength(radius)):candidate.clone();
        residuals[i].copy(candidate).sub(projected);shift.copy(projected);
      }
      if(shift.distanceTo(previous)<1e-11&&constraints.every(c=>shift.distanceTo(c.center)<=c.radius+1e-8))break;
    }
    if(constraints.some(c=>shift.distanceTo(c.center)>c.radius+1e-6))throw new Error(`Contact reach did not converge at ${phase}`);
    if(shift.length()>settings.maximumContactTranslationMetres)throw new Error(`Contact translation exceeds conservative limit at ${phase}: ${shift.length()}`);
    const shiftMatrix=new T.Matrix4().makeTranslation(shift.x,shift.y,shift.z);
    for(const [name,m]of matrices)matrices.set(name,shiftMatrix.clone().multiply(m));
    for(const c of constraints){
      const {side,pose,transport,l1,l2,wrist}=c,j=pose.joints;
      const oldS=j[side+'Shoulder'].clone().applyMatrix4(transport),oldE=j[side+'Elbow'].clone().applyMatrix4(transport),oldH=j[side+'Wrist'].clone().applyMatrix4(transport);
      const s=c.shoulder.clone().add(shift),ray=wrist.clone().sub(s),reach=ray.length(),axis=ray.clone().normalize();
      const along=(l1*l1-l2*l2+reach*reach)/(2*reach),height=Math.sqrt(Math.max(0,l1*l1-along*along));
      const oldAxis=oldH.clone().sub(oldS).normalize(),bend=oldE.clone().sub(oldS).addScaledVector(oldAxis,-oldE.clone().sub(oldS).dot(oldAxis));
      bend.applyQuaternion(new T.Quaternion().setFromUnitVectors(oldAxis,axis));
      if(bend.lengthSq()<1e-14)bend.copy(new T.Vector3(0,1,0).addScaledVector(axis,-axis.y));
      bend.normalize();
      const e=s.clone().addScaledVector(axis,along).addScaledVector(bend,height);
      const upperQ=new T.Quaternion().setFromUnitVectors(oldE.clone().sub(oldS).normalize(),e.clone().sub(s).normalize());
      const lowerQ=new T.Quaternion().setFromUnitVectors(oldH.clone().sub(oldE).normalize(),wrist.clone().sub(e).normalize());
      matrices.set(side+'UpperArm',rigid(oldS,s,upperQ).multiply(transport).multiply(pose.matrices.get(side+'UpperArm')));
      matrices.set(side+'Forearm',rigid(oldE,e,lowerQ).multiply(transport).multiply(pose.matrices.get(side+'Forearm')));
      matrices.set(side+'Hand',transport.clone().multiply(pose.matrices.get(side+'Hand')));
      armInfo[side]={...armInfo[side],shoulderOffset:[0,0,0],reachMetres:reach};
    }
    // The side-support study is a whole-body rotation about the planted wrist.
    // It changes hip/shoulder relation without extending the supporting arm.
    let body={weight:0,tiltDegrees:0,contactTranslation:shift.toArray()}, bodyTransform=shiftMatrix.clone();
    const free=phase<.5?'left':'right',support=free==='left'?'right':'left';
    const [a,b,c,d]=settings.sideWindows[free];
    if(phase>a&&phase<d){
      const weight=smooth((phase-a)/(b-a))*(1-smooth((phase-c)/(d-c)));
      const current=joints(matrices),mid=current.leftShoulder.clone().add(current.rightShoulder).multiplyScalar(.5);
      const ray=mid.clone().sub(current.pelvis).normalize(),elevation=Math.asin(clamp(ray.y,-1,1));
      const extra=Math.max(0,Math.min(T.MathUtils.degToRad(settings.maximumAdditionalTiltDegrees),T.MathUtils.degToRad(settings.sideTorsoElevationDegrees)-elevation))*weight;
      const axis=ray.clone().cross(new T.Vector3(0,1,0)).normalize();
      const q=new T.Quaternion().setFromAxisAngle(axis,extra),pivot=current[support+'Wrist'];
      const tiltTransform=rigid(pivot,pivot,q);
      bodyTransform=tiltTransform.clone().multiply(shiftMatrix);
      const planted=matrices.get(support+'Hand').clone();
      for(const [name,m]of matrices)matrices.set(name,tiltTransform.clone().multiply(m));
      matrices.set(support+'Hand',planted); // palm orientation and position stay anchored.
      body={weight,tiltDegrees:T.MathUtils.radToDeg(extra),support,originalElevationDegrees:T.MathUtils.radToDeg(elevation),contactTranslation:shift.toArray()};
    }
    // Preserve knee angles: if needed, swing the complete leg a small amount.
    // No ankle-only IK, bone stretching, global body lift or hidden shoe clipping.
    const legInfo={};
    if(body.tiltDegrees>0||shift.lengthSq()>1e-14)for(const side of SIDES){
      const current=joints(matrices),hip=current[side+'Hip'],ankle=current[side+'Ankle'];
      const shoe=original.shoes[side].map(p=>p.clone().applyMatrix4(bodyTransform));
      const oldMin=Math.min(...original.shoes[side].map(p=>p.y)),target=Math.min(settings.shoeDesiredMinY,oldMin);
      const minY=Math.min(...shoe.map(p=>p.y));
      if(minY>=target)continue;
      const axis=ankle.clone().sub(hip).normalize().cross(new T.Vector3(0,1,0)).normalize();
      const correction=angle=>rigid(hip,hip,new T.Quaternion().setFromAxisAngle(axis,angle));
      const minimum=angle=>{const m=correction(angle);return Math.min(...shoe.map(p=>p.clone().applyMatrix4(m).y));};
      let lo=0,hi=T.MathUtils.degToRad(settings.shoeMaximumCorrectionDegrees);
      if(minimum(hi)<target-1e-6)throw new Error(`Shoe clearance cannot be met at ${phase}: ${side}`);
      for(let i=0;i<22;i++){const mid=(lo+hi)/2;if(minimum(mid)<target)lo=mid;else hi=mid;}
      const fix=correction(hi);
      for(const suffix of ['Thigh','Patella','Shin','Foot'])matrices.set(side+suffix,fix.clone().multiply(matrices.get(side+suffix)));
      legInfo[side]={angleDegrees:T.MathUtils.radToDeg(hi),beforeMinY:minY,targetMinY:target};
    }
    // Fold the carried free arm in its current bilateral plane, choosing the
    // nearest bend branch to retain the accepted R14 outward fold.
    const planeInfo={};
    for(const side of SIDES){
      const start=side==='left'?0:.5, local=phase-start;
      const w=smooth((local-.075)/.065)*(1-smooth((local-.37)/.065));
      if(w<=0)continue;
      const js=joints(matrices),other=side==='left'?'right':'left';
      const s=js[side+'Shoulder'],e=js[side+'Elbow'],h=js[side+'Wrist'];
      const normal=s.clone().sub(js[other+'Shoulder']).cross(js[other+'Wrist'].clone().sub(js[other+'Shoulder'])).normalize();
      const ray=h.clone().sub(s),reach=ray.length(),axis=ray.clone().normalize();
      const projected=axis.clone().addScaledVector(normal,-axis.dot(normal)).normalize();
      const nextAxis=axis.clone().applyQuaternion(new T.Quaternion().slerp(new T.Quaternion().setFromUnitVectors(axis,projected),w));
      const l1=s.distanceTo(e),l2=e.distanceTo(h),along=(l1*l1-l2*l2+reach*reach)/(2*reach),radius=Math.sqrt(Math.max(0,l1*l1-along*along));
      const oldBend=e.clone().sub(s).addScaledVector(axis,-along).normalize();
      const targetBend=normal.clone().cross(projected).normalize();if(targetBend.dot(oldBend)<0)targetBend.negate();
      const transportedBend=oldBend.clone().applyQuaternion(new T.Quaternion().setFromUnitVectors(axis,nextAxis));
      const turn=Math.atan2(nextAxis.dot(transportedBend.clone().cross(targetBend)),transportedBend.dot(targetBend))*w;
      const bend=transportedBend.applyAxisAngle(nextAxis,turn);
      const ne=s.clone().addScaledVector(nextAxis,along).addScaledVector(bend,radius),nh=s.clone().addScaledVector(nextAxis,reach);
      const upperQ=new T.Quaternion().setFromUnitVectors(e.clone().sub(s).normalize(),ne.clone().sub(s).normalize());
      const lowerQ=new T.Quaternion().setFromUnitVectors(h.clone().sub(e).normalize(),nh.clone().sub(ne).normalize());
      matrices.set(side+'UpperArm',rigid(s,s,upperQ).multiply(matrices.get(side+'UpperArm')));
      matrices.set(side+'Forearm',rigid(e,ne,lowerQ).multiply(matrices.get(side+'Forearm')));
      matrices.set(side+'Hand',rigid(h,nh,lowerQ).multiply(matrices.get(side+'Hand')));
      planeInfo[side]={weight:w,wristMoveMetres:nh.distanceTo(h),elbowMoveMetres:ne.distanceTo(e)};
    }
    applyMatrices(matrices);lastJoints=joints(matrices);
    last={body,armTiming:armInfo,legClearance:legInfo,armPlane:planeInfo};return model;
  }
  const getMetrics=()=>({phase,joints:Object.fromEntries(Object.entries(lastJoints).map(([n,p])=>[n,p.toArray()])),design:{referenceStudy:last,armRefinement:last.armTiming,planeRefinement:last.armPlane,reachPreparation:last.body}});
  const sourceSequenceTime=()=>{const x=phase*(clock.phases.length-1),i=Math.min(Math.floor(x),clock.phases.length-2);return T.MathUtils.lerp(clock.baselineSequenceTimes[i],clock.baselineSequenceTimes[i+1],x-i);};
  updatePhase(0);
  return {updatePhase,getMetrics,parameters:settings,sourceSequenceTime,
    describeRecovery:()=>({scope:'Frozen R14 animation as source. Side support wrist-pivot body tilt, shoulder-attached arms with at most 30mm contact reach translation, slight arm retiming, small whole-leg clearance correction preserving knee angles. Camera reference is not motion capture; no force model.',settings})};
}
