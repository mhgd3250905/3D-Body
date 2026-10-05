import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {
  OFFICIAL_FLARE_SEQUENCE,
  sequenceFromSavedSteps,
  resolveOfficialSequence,
  saveOfficialSequence,
  previousOfficialSequence,
  restoreOfficialSequence,
} from '../src/official-poses.js';

const PERSONAL='flare-pose-library-v1',FORMAL='flare-demonstration-v1',BACKUP='flare-demonstration-backup-v1';
const clone=value=>structuredClone(value),bundleBefore=clone(OFFICIAL_FLARE_SEQUENCE);
const bundlePath=new URL('../public/coach/flare-sequence.json',import.meta.url);
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const bundleSHA256=hash(fs.readFileSync(bundlePath));

// Deliberately never access real browser/local storage in this regression.
class MemoryStorage {
  constructor(seed={}){this.values=new Map(Object.entries(seed));this.mutations=[];}
  getItem(key){return this.values.has(key)?this.values.get(key):null;}
  setItem(key,value){this.values.set(key,String(value));this.mutations.push({operation:'set',key});}
  removeItem(key){this.values.delete(key);this.mutations.push({operation:'remove',key});}
}
const checks=[];
function check(name,run){
  try{run();checks.push({name,pass:true});}
  catch(error){checks.push({name,pass:false,error:error.message});}
}
function fixture(){
  const steps=bundleBefore.steps.map((step,index)=>({...clone(step),id:`personal-step-${index+1}`}));
  // A valid, recognizably authored change proves promotion uses private poses,
  // rather than silently replacing them with the packaged templates.
  steps[2].pose.limbs.left.elbowPole[2]+=.0123;
  const draft=clone(steps[1].pose);draft.pelvis[0]+=.0456;
  return {version:1,steps,draft,title:'尚未保存的个人草稿',removed:[{id:'deleted-user-step'}],draftSourcePreset:'flare-right-transfer',draftMirrored:false};
}
function seeded(library=fixture()){
  const personalBytes=JSON.stringify(library,null,2)+'\n';
  return {storage:new MemoryStorage({[PERSONAL]:personalBytes,'unrelated-setting':' untouched '}),personalBytes,library};
}
function isolated(storage,personalBytes){
  assert.equal(storage.getItem(PERSONAL),personalBytes,'personal library/draft raw bytes changed');
  assert.equal(storage.getItem('unrelated-setting'),' untouched ');
  assert.ok(storage.mutations.every(change=>[FORMAL,BACKUP].includes(change.key)),'wrote outside the two official keys');
}

check('No storage returns an independent packaged sequence',()=>{
  const first=resolveOfficialSequence();assert.deepEqual(first,bundleBefore);
  first.steps[0].pose.pelvis[0]+=10;first.steps[0].name='modified return';first.source.firstFiveIds.push('extra');
  assert.deepEqual(resolveOfficialSequence(),bundleBefore);
});
check('Empty storage loads the package without creating keys',()=>{
  const storage=new MemoryStorage();assert.deepEqual(resolveOfficialSequence(storage),bundleBefore);assert.deepEqual(storage.mutations,[]);
});
check('Matching personal nine-step names promote exact private poses',()=>{
  const {storage,personalBytes,library}=seeded(),result=resolveOfficialSequence(storage);
  assert.equal(result.source.kind,'saved-browser-steps');
  assert.deepEqual(result.source.firstFiveIds,library.steps.slice(0,5).map(step=>step.id));
  result.steps.forEach((step,index)=>{
    assert.equal(step.id,bundleBefore.steps[index].id);assert.equal(step.phase,bundleBefore.steps[index].phase);
    assert.equal(step.name,library.steps[index].name);assert.equal(step.sourceStepId,library.steps[index].id);
    assert.equal(step.mirrored,library.steps[index].mirrored===true);assert.deepEqual(step.pose,library.steps[index].pose);
  });
  assert.deepEqual(JSON.parse(storage.getItem(FORMAL)),result);assert.deepEqual(JSON.parse(storage.getItem(BACKUP)),bundleBefore);
  assert.deepEqual(storage.mutations.map(change=>change.key),[BACKUP,FORMAL]);isolated(storage,personalBytes);
});
check('Promotion returns cannot mutate persisted data or the bundle',()=>{
  const {storage,personalBytes}=seeded(),result=resolveOfficialSequence(storage),publishedBytes=storage.getItem(FORMAL);
  result.steps[0].pose.limbs.left.ankle[0]+=7;result.steps[0].name='changed';result.source.firstFiveIds.pop();
  assert.equal(storage.getItem(FORMAL),publishedBytes);
  const reread=resolveOfficialSequence(storage);assert.deepEqual(reread,JSON.parse(publishedBytes));
  const writes=storage.mutations.length;resolveOfficialSequence(storage);assert.equal(storage.mutations.length,writes);isolated(storage,personalBytes);
});
check('Explicit official sequence takes precedence over matching private names',()=>{
  const {storage,personalBytes,library}=seeded(),official=sequenceFromSavedSteps(library.steps);
  official.steps[0].name='已确认的正式第一步';official.steps[0].pose.pelvis[2]+=.0234;
  storage.values.set(FORMAL,JSON.stringify(official));
  assert.deepEqual(resolveOfficialSequence(storage),official);assert.deepEqual(storage.mutations,[]);isolated(storage,personalBytes);
});
check('Saving backs up exact previous formal bytes and leaves private drafts intact',()=>{
  const {storage,personalBytes,library}=seeded();resolveOfficialSequence(storage);const previousBytes=storage.getItem(FORMAL);
  const changed=clone(library.steps);changed[3].pose.limbs.right.kneePole[0]+=.0789;
  const sequence=sequenceFromSavedSteps(changed);saveOfficialSequence(sequence,storage);
  assert.equal(storage.getItem(BACKUP),previousBytes);assert.deepEqual(JSON.parse(storage.getItem(FORMAL)),sequence);
  const savedBytes=storage.getItem(FORMAL);sequence.steps[3].pose.pelvis[1]+=2;
  assert.equal(storage.getItem(FORMAL),savedBytes);isolated(storage,personalBytes);
});
check('First explicit save backs up the package rather than modifying private data',()=>{
  const {storage,personalBytes,library}=seeded(),sequence=sequenceFromSavedSteps(library.steps);
  saveOfficialSequence(sequence,storage);assert.deepEqual(JSON.parse(storage.getItem(BACKUP)),bundleBefore);isolated(storage,personalBytes);
});
check('Undo restores only official keys, preserving private draft byte for byte',()=>{
  const {storage,personalBytes,library}=seeded();resolveOfficialSequence(storage);const previousBytes=storage.getItem(FORMAL);
  const sequence=sequenceFromSavedSteps(library.steps);sequence.steps[1].pose.pelvis[0]+=.0567;saveOfficialSequence(sequence,storage);
  const backupBytes=storage.getItem(BACKUP),returned=previousOfficialSequence(storage);
  assert.deepEqual(returned,JSON.parse(previousBytes));returned.steps[0].pose.pelvis[0]+=3;
  assert.equal(storage.getItem(BACKUP),backupBytes);restoreOfficialSequence(previousOfficialSequence(storage),storage);
  assert.deepEqual(JSON.parse(storage.getItem(FORMAL)),JSON.parse(previousBytes));assert.equal(storage.getItem(BACKUP),null);
  assert.deepEqual(storage.mutations.slice(-2),[{operation:'set',key:FORMAL},{operation:'remove',key:BACKUP}]);isolated(storage,personalBytes);
});
check('Saved-step conversion clones raw pose numbers and original names',()=>{
  const library=fixture(),before=clone(library.steps),sequence=sequenceFromSavedSteps(library.steps);
  sequence.steps.forEach((step,index)=>{assert.deepEqual(step.pose,before[index].pose);assert.equal(step.name,before[index].name);});
  library.steps[0].pose.bodyQuaternion[0]+=1;sequence.steps[1].pose.limbs.left.ankle[0]+=5;
  assert.deepEqual(sequence.steps[0].pose,before[0].pose);assert.deepEqual(library.steps[1].pose,before[1].pose);
});

const invalidLibraries=[
  ['unrelated step name',library=>{library.steps[4].name='我的其他动作';}],
  ['reordered names',library=>{[library.steps[1],library.steps[2]]=[library.steps[2],library.steps[1]];}],
  ['older five-step personal library',library=>{library.steps=library.steps.slice(0,5);}],
  ['eight-step personal library',library=>{library.steps.pop();}],
  ['unsupported library version',library=>{library.version=2;}],
  ['missing left limb',library=>{delete library.steps[2].pose.limbs.left;}],
  ['zero body quaternion',library=>{library.steps[2].pose.bodyQuaternion=[0,0,0,0];}],
  ['invalid hand quaternion',library=>{library.steps[2].pose.limbs.right.handQuaternion=[0,0,0];}],
  ['nonboolean hand lock',library=>{library.steps[2].pose.limbs.right.handLocked=1;}],
  ['nonboolean floor lock',library=>{library.steps[2].pose.groundLock='true';}],
  ['invalid coordinate',library=>{library.steps[2].pose.pelvis[1]=null;}],
  ['empty name',library=>{library.steps[2].name='';}],
];
for(const [name,mutate] of invalidLibraries)check(`Reject ${name} without touching the private library`,()=>{
  const library=fixture();mutate(library);const {storage,personalBytes}=seeded(library);
  assert.deepEqual(resolveOfficialSequence(storage),bundleBefore);assert.deepEqual(storage.mutations,[]);isolated(storage,personalBytes);
});
check('Malformed personal JSON falls back without overwriting it',()=>{
  const personalBytes='{ malformed private data',storage=new MemoryStorage({[PERSONAL]:personalBytes,'unrelated-setting':' untouched '});
  assert.deepEqual(resolveOfficialSequence(storage),bundleBefore);assert.deepEqual(storage.mutations,[]);isolated(storage,personalBytes);
});
check('Invalid published data cannot override the packaged sequence',()=>{
  for(const invalid of [null,{...clone(bundleBefore),period:8},{...clone(bundleBefore),version:2}]){
    const storage=new MemoryStorage({[FORMAL]:JSON.stringify(invalid)});assert.deepEqual(resolveOfficialSequence(storage),bundleBefore);assert.deepEqual(storage.mutations,[]);
  }
  const bad=clone(bundleBefore);bad.steps[1].id='unrelated-id';
  const storage=new MemoryStorage({[FORMAL]:JSON.stringify(bad)});assert.deepEqual(resolveOfficialSequence(storage),bundleBefore);assert.deepEqual(storage.mutations,[]);
});
check('Invalid published data permits adoption of a recognized private library',()=>{
  const {storage,personalBytes,library}=seeded();storage.values.set(FORMAL,JSON.stringify({...clone(bundleBefore),period:8}));
  const result=resolveOfficialSequence(storage);result.steps.forEach((step,index)=>assert.deepEqual(step.pose,library.steps[index].pose));isolated(storage,personalBytes);
});
check('Invalid save and undo requests perform no writes',()=>{
  const {storage,personalBytes}=seeded();
  for(const mutate of [sequence=>sequence.steps.pop(),sequence=>{sequence.period=8;},sequence=>{sequence.steps[0].phase='wrong';},sequence=>{sequence.steps[0].name='';},sequence=>{sequence.steps[0].pose.limbs.left.footQuaternion=[0,0,0,0];}]){
    const bad=clone(bundleBefore);mutate(bad);
    assert.throws(()=>saveOfficialSequence(bad,storage));assert.throws(()=>restoreOfficialSequence(bad,storage));
  }
  assert.deepEqual(storage.mutations,[]);isolated(storage,personalBytes);assert.throws(()=>saveOfficialSequence(clone(bundleBefore)));
});
check('Invalid saved-step conversion fails without changing its input',()=>{
  assert.throws(()=>sequenceFromSavedSteps(fixture().steps.slice(0,5)));
  const steps=fixture().steps;steps[3].name='   ';const before=clone(steps);
  assert.throws(()=>sequenceFromSavedSteps(steps));assert.deepEqual(steps,before);
});
check('Missing or invalid backup cannot be returned as an undo sequence',()=>{
  assert.equal(previousOfficialSequence(),null);assert.equal(previousOfficialSequence(new MemoryStorage()),null);
  assert.equal(previousOfficialSequence(new MemoryStorage({[BACKUP]:'broken json'})),null);
  assert.equal(previousOfficialSequence(new MemoryStorage({[BACKUP]:JSON.stringify({...clone(bundleBefore),period:8})})),null);
});
check('All operations leave imported and on-disk bundled data unchanged',()=>{
  assert.deepEqual(OFFICIAL_FLARE_SEQUENCE,bundleBefore);assert.equal(hash(fs.readFileSync(bundlePath)),bundleSHA256);
});

const report={pass:checks.every(result=>result.pass),storage:'isolated in-memory only',checks:checks.length,passed:checks.filter(result=>result.pass).length,
  formalKeys:[FORMAL,BACKUP],privateKey:PERSONAL,personalLibraryAndDraftBytesPreserved:true,bundleSHA256,results:checks};
const output=new URL('../output/official-sequence/',import.meta.url);fs.mkdirSync(output,{recursive:true});
fs.writeFileSync(new URL('verification.json',output),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pass:report.pass,checks:report.checks,passed:report.passed,failed:checks.filter(result=>!result.pass)},null,2));
if(!report.pass)process.exitCode=1;
