import assert from 'node:assert/strict';
import {createFlareSequence} from '../src/flare-sequence.js';
import {OFFICIAL_FLARE_SEQUENCE as bundled,updateOfficialFrame,validSequence} from '../src/official-poses.js';

const clone=structuredClone;
const checks=[];
function check(name,run){run();checks.push(name);}
function freeze(value){
  if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}
  return value;
}
const metadata=step=>Object.fromEntries(Object.entries(step).filter(([key])=>key!=='pose'));
const source=freeze(clone(bundled)),original=clone(source),bundleBefore=clone(bundled);
const pose=clone(source.steps[4].pose);
pose.pelvis[0]+=0.025;
pose.bodyQuaternion=pose.bodyQuaternion.map(number=>number*2);
pose.torsoQuaternion=[0.1,0.2,0,0.97];
pose.limbs.right.kneeTwist=0.12;
pose.limbs.left.handLocked=false;
pose.groundLock=false;
freeze(pose);
const poseBefore=clone(pose),inner=updateOfficialFrame(source,4,pose),last=source.steps.length-1;

check('Replacing an inner frame retains all nine IDs, names and node metadata',()=>{
  assert.equal(inner.steps.length,source.steps.length);
  assert.deepEqual(inner.steps.map(metadata),source.steps.map(metadata));
  assert.equal(inner.title,source.title);
  assert.ok(validSequence(inner));
});
check('Only the selected inner pose changes, retaining exact optional fields and flags',()=>{
  for(let index=0;index<source.steps.length;index++)assert.deepEqual(inner.steps[index].pose,index===4?pose:source.steps[index].pose);
  assert.deepEqual(createFlareSequence(inner.steps,{period:inner.period}).sample(4),pose);
});
check('Browser origin changes while original source provenance and hash are preserved',()=>{
  assert.deepEqual(inner.source,{...source.source,origin:'browser-keyframe-edit'});
  assert.equal(inner.source.sha256,source.source.sha256);
});

for(const index of [0,last])check(`Editing closed-loop end ${index} synchronizes both poses without changing either metadata`,()=>{
  const updated=updateOfficialFrame(source,index,pose);
  assert.deepEqual(updated.steps[0].pose,pose);
  assert.deepEqual(updated.steps[last].pose,pose);
  assert.notEqual(updated.steps[0].pose,updated.steps[last].pose);
  assert.deepEqual(updated.steps.map(metadata),source.steps.map(metadata));
  for(let at=1;at<last;at++)assert.deepEqual(updated.steps[at].pose,source.steps[at].pose);
});
check('Loop equality is independent of object property ordering',()=>{
  const reordered=clone(source);
  reordered.steps[last].pose=Object.fromEntries(Object.entries(reordered.steps[last].pose).reverse());
  reordered.steps[last].pose.limbs=Object.fromEntries(Object.entries(reordered.steps[last].pose.limbs).reverse());
  assert.deepEqual(updateOfficialFrame(reordered,0,pose).steps[last].pose,pose);
});
check('Distinct end poses remain independent when either end is edited',()=>{
  const open=clone(source);open.steps[last].pose.pelvis[0]+=0.01;
  for(const index of [0,last]){
    const updated=updateOfficialFrame(open,index,pose),other=index===0?last:0;
    assert.deepEqual(updated.steps[index].pose,pose);
    assert.deepEqual(updated.steps[other].pose,open.steps[other].pose);
  }
});
check('Sequences without an optional source record get browser origin',()=>{
  const noSource=clone(source);delete noSource.source;
  assert.deepEqual(updateOfficialFrame(noSource,4,pose).source,{origin:'browser-keyframe-edit'});
  assert.equal(Object.hasOwn(noSource,'source'),false);
});
check('Returned data shares no mutable pose, source or unchanged metadata with inputs',()=>{
  const updated=updateOfficialFrame(source,0,pose);
  updated.steps[0].pose.pelvis[0]+=1;
  assert.deepEqual(updated.steps[last].pose,pose);
  updated.steps[1].pose.pelvis[0]+=1;
  updated.steps[1].sourceStepName='独立副本';
  updated.source.stepIds[0]='independent-copy';
  assert.deepEqual(source,original);
  assert.deepEqual(pose,poseBefore);
  assert.deepEqual(bundled,bundleBefore);
});

check('Noninteger, nonnumeric and out-of-range indexes are rejected',()=>{
  for(const index of [-1,9,0.5,NaN,Infinity,'0',null,undefined])assert.throws(()=>updateOfficialFrame(source,index,pose),RangeError);
});
check('Malformed sequences, duplicate IDs and malformed source records are rejected',()=>{
  const duplicate=clone(source);duplicate.steps[1].id=duplicate.steps[0].id;
  const short=clone(source);short.steps.pop();
  const wrongPeriod=clone(source);wrongPeriod.period=8;
  const brokenPose=clone(source);brokenPose.steps[1].pose.limbs.left.wrist[0]=NaN;
  const brokenSource=clone(source);brokenSource.source=[];
  for(const sequence of [null,{},duplicate,short,wrongPeriod,brokenPose,brokenSource])assert.throws(()=>updateOfficialFrame(sequence,0,pose));
});
check('Invalid replacement poses fail before any input can change',()=>{
  const invalid=[];
  for(const number of [NaN,Infinity,-Infinity]){const bad=clone(pose);bad.pelvis[0]=number;invalid.push(bad);}
  const zeroQuaternion=clone(pose);zeroQuaternion.bodyQuaternion=[0,0,0,0];invalid.push(zeroQuaternion);
  const lock=clone(pose);lock.limbs.left.handLocked='true';invalid.push(lock);
  const missing=clone(pose);delete missing.limbs.right.ankle;invalid.push(missing);
  const optional=clone(pose);optional.limbs.right.kneeTwist=NaN;invalid.push(optional);
  for(const bad of [null,{},...invalid]){
    const before=clone(bad);
    assert.throws(()=>updateOfficialFrame(source,4,bad));
    assert.deepEqual(bad,before);
  }
});
check('Successful and failed calls leave the bundle and both original arguments untouched',()=>{
  assert.deepEqual(source,original);
  assert.deepEqual(pose,poseBefore);
  assert.deepEqual(bundled,bundleBefore);
});
console.log(JSON.stringify({pass:true,checks:checks.length,scope:'Pure formal-keyframe replacement; no storage, browser or asset writes.'}));
