import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { mirroredStep, mirrorPose } from '../src/pose-mirror.js';
import { createFlareSequence } from '../src/flare-sequence.js';

const root=fileURLToPath(new URL('../',import.meta.url));
const directory=path.join(root,'托马斯');
const sourceFile=path.join(directory,'13.json');
const raw=fs.readFileSync(sourceFile,'utf8');
const original=JSON.parse(raw);
assert.equal(original.format,'flare-pose-library');
assert.equal(original.version,1);
assert.equal(original.steps.length,13);
createFlareSequence(original.steps);
const before=structuredClone(original);
const exportedAt=new Date().toISOString();
const stamp=exportedAt.replace(/[:.]/g,'-');
const backupDirectory=path.join(directory,'备份',stamp+'-镜像前');
fs.mkdirSync(backupDirectory,{recursive:true});
const backupFiles=[];
for(const file of fs.readdirSync(directory).filter(name=>name.endsWith('.json'))){
  const source=path.join(directory,file),backup=path.join(backupDirectory,file);
  fs.copyFileSync(source,backup,fs.constants.COPYFILE_EXCL);
  const digest=crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex');
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync(backup)).digest('hex'),digest);
  backupFiles.push({file,sha256:digest});
}
const numbers=[12,11,10];
const names=['右侧换腿 · 第12步镜像','右侧单撑 · 第11步镜像','右侧移重 · 第10步镜像'];
const sourceSteps=numbers.map(number=>original.steps[number-1]);
const steps=sourceSteps.map((source,index)=>{
  const number=numbers[index];
  const step=mirroredStep(source,{id:`mirror-20261005-${number}-${source.id}`,createdAt:exportedAt,number});
  // The latest saves reuse old template names while describing new body sides.
  // Use the user's stated right side and avoid old template direction guidance.
  step.name=names[index];
  step.sourcePreset=null;
  assert.deepEqual(mirrorPose(step.pose),source.pose);
  return step;
});
createFlareSequence(steps);
const full={...original,exportedAt,steps:[...original.steps,...steps]};
assert.deepEqual(full.steps.slice(0,13),before.steps);
assert.deepEqual(original,before);
assert.equal(fs.readFileSync(sourceFile,'utf8'),raw);
const additions={format:'flare-pose-library',version:1,character:original.character,exportedAt,steps};
const update={format:'flare-saved-mirror-update',version:1,id:'user-saved-13-right-mirrors-20261005',requiredStepIds:original.steps.map(step=>step.id),sourceSteps,steps};
const write=(file,value)=>fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n');
const fullFile=path.join(directory,'已补齐-16步.json');
const mirrorFile=path.join(directory,'右侧镜像-3步.json');
write(fullFile,full);
write(mirrorFile,additions);
write(path.join(root,'public/coach/saved-right-mirrors-2026-10-05.json'),update);
const report={sourceFile,sourceExportedAt:original.exportedAt,backupDirectory,backupFiles,fullFile,mirrorFile,originalSteps:13,completedSteps:16,originalStepsUnchanged:true,
  mappings:steps.map((step,index)=>({number:14+index,mirrors:numbers[index],id:step.id,sourceId:step.mirrorOf,name:step.name,doubleMirrorRestoresSource:true,locks:{left:step.pose.limbs.left.handLocked,right:step.pose.limbs.right.handLocked,ground:step.pose.groundLock}})),
  recommendedCycle:[9,10,11,12,13,14,15,16,9]};
const reportDirectory=path.join(root,'output/user-poses-2026-10-05');
fs.mkdirSync(reportDirectory,{recursive:true});
write(path.join(reportDirectory,'mirror-report.json'),report);
console.log(JSON.stringify(report,null,2));
