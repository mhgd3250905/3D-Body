// R14 trial: fold each free arm in the bilateral shoulder/support-arm plane.
// The accepted R12 source and earlier candidate batches are read only.
import * as T from 'three';
import { createNaturalFlareMotion as createR12 } from '../motion-v42/natural-motion.mjs';
const smooth=x=>{x=T.MathUtils.clamp(x,0,1);return x*x*x*(10+x*(-15+6*x));};
const windows={left:{start:.045,full:.14,hold:.37,end:.472},right:{start:.505,full:.60,hold:.88,end:.95}};
const transform=(from,to,q)=>new T.Matrix4().makeTranslation(...to.toArray())
  .multiply(new T.Matrix4().makeRotationFromQuaternion(q))
  .multiply(new T.Matrix4().makeTranslation(...from.clone().negate().toArray()));
const unwrap=(value,previous)=>{while(value-previous>Math.PI)value-=2*Math.PI;while(value-previous< -Math.PI)value+=2*Math.PI;return value;};

export function createNaturalFlareMotion(options) {
  const source=createR12(options),{model}=options,bones=new Map();
  model.traverse(o=>{if(o.isBone)bones.set(o.name,o);});
  const point=name=>bones.get(name).getWorldPosition(new T.Vector3());
  function geometry(side) {
    const other=side==='left'?'right':'left';
    const s=point(side+'UpperArm'),e=point(side+'Forearm'),w=point(side+'Hand');
    const os=point(other+'UpperArm'),ow=point(other+'Hand');
    const across=s.clone().sub(os).normalize(),support=ow.clone().sub(os).normalize();
    const normal=new T.Vector3().crossVectors(across,support);
    if(normal.length()<.05) throw new Error('Bilateral plane is degenerate');
    normal.normalize();
    const ray=w.clone().sub(s),reach=ray.length(),axis=ray.clone().normalize();
    const targetAxis=axis.clone().addScaledVector(normal,-axis.dot(normal));
    if(targetAxis.length()<.1) throw new Error('Free arm is normal to bilateral plane');
    targetAxis.normalize();
    // Continuous outside elbow branch: forearm folds back towards the wrist,
    // rather than placing the elbow through the chest to make it "inward".
    const targetBend=new T.Vector3().crossVectors(targetAxis,normal).normalize();
    const radial=e.clone().sub(s),along=radial.dot(axis);radial.addScaledVector(axis,-along);
    const bend=radial.clone().normalize();
    const raySwing=new T.Quaternion().setFromUnitVectors(axis,targetAxis);
    const carried=bend.clone().applyQuaternion(raySwing);
    const turn=Math.atan2(targetAxis.dot(carried.clone().cross(targetBend)),carried.dot(targetBend));
    return {s,e,w,os,ow,normal,reach,axis,targetAxis,targetBend,radial,along,bend,raySwing,turn};
  }
  const curves={};
  for(const side of ['left','right']) {
    const win=windows[side],rows=[];
    for(let i=0;i<=600;i++) {
      const phase=T.MathUtils.lerp(win.start,win.end,i/600);source.updatePhase(phase);
      const g=geometry(side);rows.push({phase,raw:g.turn});
    }
    let previous=rows[0].raw;
    for(const row of rows){row.entry=unwrap(row.raw,previous);previous=row.entry;}
    previous=rows.at(-1).raw;
    for(const row of [...rows].reverse()){row.exit=unwrap(row.raw,previous);previous=row.exit;}
    curves[side]=rows;
  }
  function continuousTurn(side,phase,g) {
    const win=windows[side];
    // At full weight ±2pi branches are identical. Separate entry/exit unwraps
    // choose short boundary routes; the blend has zero first/second derivative.
    if(phase>=win.full && phase<=win.hold) return g.turn;
    const key=phase<win.full?'entry':'exit';
    const index=T.MathUtils.clamp((phase-win.start)/(win.end-win.start)*600,0,599.999999);
    const i=Math.floor(index),rows=curves[side];
    return unwrap(g.turn,T.MathUtils.lerp(rows[i][key],rows[i+1][key],index-i));
  }
  let adjustments={};
  function updatePhase(value) {
    source.updatePhase(value);adjustments={};
    const phase=((value%1)+1)%1, before=source.getMetrics();
    for(const side of ['left','right']) {
      const win=windows[side];if(phase<=win.start || phase>=win.end)continue;
      const g=geometry(side),weight=smooth((phase-win.start)/(win.full-win.start))*(1-smooth((phase-win.hold)/(win.end-win.hold)));
      const swing=new T.Quaternion().slerp(g.raySwing,weight);
      const axis=g.axis.clone().applyQuaternion(swing);
      const turn=continuousTurn(side,phase,g)*weight;
      const bend=g.bend.clone().applyQuaternion(swing).applyAxisAngle(axis,turn);
      const ne=g.s.clone().addScaledVector(axis,g.along).addScaledVector(bend,g.radial.length());
      const nw=g.s.clone().addScaledVector(axis,g.reach);
      const upper=new T.Quaternion().setFromUnitVectors(g.e.clone().sub(g.s).normalize(),ne.clone().sub(g.s).normalize());
      const lower=new T.Quaternion().setFromUnitVectors(g.w.clone().sub(g.e).normalize(),nw.clone().sub(ne).normalize());
      const handTransform=transform(g.w,nw,lower);
      const targets=[
        [side+'UpperArm',transform(g.s,g.s,upper).multiply(bones.get(side+'UpperArm').matrixWorld)],
        [side+'Forearm',transform(g.e,ne,lower).multiply(bones.get(side+'Forearm').matrixWorld)],
        [side+'Hand',handTransform.clone().multiply(bones.get(side+'Hand').matrixWorld)],
      ];
      for(const [name,matrix] of targets){const b=bones.get(name);b.parent.matrixWorld.clone().invert().multiply(matrix).decompose(b.position,b.quaternion,b.scale);b.updateMatrix();model.updateMatrixWorld(true);}
      adjustments[side]={weight,turnDegrees:T.MathUtils.radToDeg(turn),elbowDisplacement:ne.distanceTo(g.e),wristDisplacement:nw.distanceTo(g.w),
        elbowPlaneDistance:Math.abs(ne.clone().sub(g.s).dot(g.normal)),wristPlaneDistance:Math.abs(nw.clone().sub(g.s).dot(g.normal)),
        palm:new T.Vector3().fromArray(before.joints[side+'Palm']).applyMatrix4(handTransform).toArray(),handTransform:handTransform.toArray()};
    }
    model.traverse(o=>{if(o.isSkinnedMesh)o.skeleton.update();});return model;
  }
  function getMetrics(){const metrics=source.getMetrics();for(const [side,a] of Object.entries(adjustments))metrics.joints[side+'Palm']=[...a.palm];
    return {...metrics,version:'v42-r14-bilateral-arm-plane',design:{...metrics.design,planeRefinement:adjustments}};}
  function capturePose(){const pose=source.capturePose();for(const [side,a]of Object.entries(adjustments)){
    pose.limbs[side].wrist=point(side+'Hand').toArray();pose.limbs[side].elbowPole=point(side+'Forearm').toArray();
    pose.limbs[side].handQuaternion=new T.Quaternion().setFromRotationMatrix(new T.Matrix4().fromArray(a.handTransform))
      .multiply(new T.Quaternion().fromArray(pose.limbs[side].handQuaternion)).normalize().toArray();}return pose;}
  updatePhase(0);
  return {...source,updatePhase,getMetrics,capturePose,parameters:{...source.parameters,revision:'v42-r14-bilateral-arm-plane',armPlaneWindows:windows},
    describeRecovery:()=>({...source.describeRecovery(),armPlane:{windows,definition:'Plane through both shoulders and supporting wrist. Free shoulder-wrist ray projected into plane at constant reach; outside elbow branch folds forearm back within plane. Hand follows forearm swing.',scope:'Both free arms; original support arms/body/legs/contact windows preserved; free wrists may move.'}})};
}
