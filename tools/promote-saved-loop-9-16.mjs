import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createFlareSequence } from '../src/flare-sequence.js';

const root=fileURLToPath(new URL('../',import.meta.url));
const folder=path.join(root,'托马斯');
const sourceFile=path.join(folder,'16.json');
const sourceRaw=fs.readFileSync(sourceFile,'utf8');
const source=JSON.parse(sourceRaw);
assert.equal(source.format,'flare-pose-library');
assert.equal(source.version,1);
assert.ok(source.steps.length>=16);
const sourceHash=crypto.createHash('sha256').update(sourceRaw).digest('hex');
const stamp=new Date().toLocaleString('sv-SE',{timeZone:'Asia/Shanghai'}).replace(' ','T').replaceAll(':','-');
const backupFolder=path.join(folder,'备份',stamp+'-正式替换前');
fs.mkdirSync(backupFolder,{recursive:true});
for(const file of fs.readdirSync(folder).filter(name=>name.endsWith('.json'))){
  fs.copyFileSync(path.join(folder,file),path.join(backupFolder,file),fs.constants.COPYFILE_EXCL);
}
const officialFile=path.join(root,'public/coach/flare-sequence.json');
const legacyFile=path.join(root,'public/coach/flare-sequence-before-9-16.json');
fs.copyFileSync(officialFile,path.join(backupFolder,'旧正式展示.json'),fs.constants.COPYFILE_EXCL);
if(!fs.existsSync(legacyFile))fs.copyFileSync(officialFile,legacyFile,fs.constants.COPYFILE_EXCL);
const output=path.join(root,'output/official-loop-9-16');
fs.mkdirSync(path.join(output,'before'),{recursive:true});
if(!fs.existsSync(path.join(output,'before/flare-sequence.json')))fs.copyFileSync(officialFile,path.join(output,'before/flare-sequence.json'));
const numbers=[9,10,11,12,13,14,15,16,9];
const ids=['flare-saved-09-rear','flare-saved-10-left-transfer','flare-saved-11-left-support','flare-saved-12-left-pass','flare-saved-13-front','flare-saved-14-right-pass','flare-saved-15-right-support','flare-saved-16-right-transfer','flare-saved-09-rear-repeat'];
const names=['后双撑 · 循环起点','左侧移重 · 单手接重','左侧单撑 · 高 V 开腿','左侧换腿 · 接回前撑','前双撑 · 中间过渡','右侧换腿 · 前撑转移','右侧单撑 · 高 V 开腿','右侧移重 · 接回后撑','后双撑 · 接回起点'];
const phases=['rear','sideA','sideA','sideA','front','sideB','sideB','sideB','rear'];
const steps=numbers.map((number,index)=>{
  const saved=source.steps[number-1];
  return {id:ids[index],name:names[index],phase:phases[index],sourceStepId:saved.id,sourceStepNumber:number,sourceStepName:saved.name,sourcePreset:saved.sourcePreset||null,mirrored:saved.mirrored===true,pose:structuredClone(saved.pose)};
});
const sequence={format:'flare-demonstration',version:1,title:'托马斯 · 完整循环 9–16–9',period:9,
  source:{kind:'saved-loop-9-16',revision:'user-loop-9-16-20261005',file:'托马斯/16.json',exportedAt:source.exportedAt,sha256:sourceHash,stepNumbers:numbers,stepIds:steps.map(step=>step.sourceStepId)},steps};
const playback=createFlareSequence(steps,{period:9});
for(let i=0;i<steps.length;i++){
  assert.deepEqual(steps[i].pose,source.steps[numbers[i]-1].pose);
  assert.deepEqual(playback.sample(i),steps[i].pose);
}
assert.deepEqual(steps[0].pose,steps.at(-1).pose);
assert.equal(fs.readFileSync(sourceFile,'utf8'),sourceRaw);
const value=JSON.stringify(sequence,null,2)+'\n';
fs.writeFileSync(officialFile,value);
fs.writeFileSync(path.join(folder,'正式循环-9到16回9.json'),value);
const report={sourceFile,sourceHash,sourceSteps:source.steps.length,backupFolder,officialFile,sourceNumbers:numbers,
  anchorPosesUnchanged:true,closureExactlyMatchesOriginal9:true,personalSourceUnchanged:true,
  steps:steps.map((step,index)=>({displayIndex:index+1,number:step.sourceStepNumber,name:step.name,sourceId:step.sourceStepId,support: Object.entries(step.pose.limbs).filter(([,limb])=>limb.handLocked).map(([side])=>side)}))};
fs.writeFileSync(path.join(output,'source-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
