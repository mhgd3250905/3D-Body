import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createServer} from 'vite';
import {Quaternion,Vector3} from 'three';

const root=fileURLToPath(new URL('../',import.meta.url)),out=path.join(root,'output/official-sequence');
const require=createRequire(import.meta.url);
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const bundled=JSON.parse(await fs.readFile(path.join(root,'public/coach/flare-sequence.json'),'utf8'));
const LIBRARY='flare-pose-library-v1',FORMAL='flare-demonstration-v1',BACKUP='flare-demonstration-backup-v1';
const checks=[],errors=[],consoleErrors=[],externalRequests=[],frames=[];
const check=(name,pass,detail)=>{checks.push({name,pass:Boolean(pass),...(detail===undefined?{}:{detail})});assert.ok(pass,name);};
const numericDifference=(a,b)=>{
 let maximum=0;
 const compare=(x,y)=>{
  if(typeof x==='number'||typeof y==='number'){
   if(typeof x!=='number'||typeof y!=='number'||!Number.isFinite(x)||!Number.isFinite(y)){maximum=Infinity;return;}
   maximum=Math.max(maximum,Math.abs(x-y));
  }else if(x&&y&&typeof x==='object'&&typeof y==='object'){
   const keys=Object.keys(x);if(keys.length!==Object.keys(y).length){maximum=Infinity;return;}
   for(const key of keys)compare(x[key],y[key]);
  }else if(x!==y)maximum=Infinity;
 };compare(a,b);return maximum;
};
const finite=value=>typeof value==='number'?Number.isFinite(value):!value||typeof value!=='object'||Object.values(value).every(finite);
const variants=(suffix,factor)=>bundled.steps.map((step,index)=>{
 const pose=structuredClone(step.pose);
 for(const side of ['left','right']){
  const yaw=new Quaternion().setFromAxisAngle(new Vector3(0,1,0),factor*(index+1)*(side==='left'?1:-1));
  pose.limbs[side].footQuaternion=yaw.multiply(new Quaternion().fromArray(pose.limbs[side].footQuaternion)).normalize().toArray();
 }
 return {id:`ui-${suffix}-${index+1}`,name:step.name,sourcePreset:step.id,mirrored:step.mirrored===true,createdAt:'2026-10-05T00:00:00.000Z',pose};
});
const makeLibrary=steps=>{
 const draft=structuredClone(steps[3].pose);
 draft.limbs.left.footQuaternion=new Quaternion().setFromAxisAngle(new Vector3(0,1,0),.005).multiply(new Quaternion().fromArray(draft.limbs.left.footQuaternion)).normalize().toArray();
 return {version:1,steps,draft,removed:[],title:'验收草稿 · 保留',draftSourcePreset:steps[3].sourcePreset,draftMirrored:false};
};
const aSteps=variants('upgrade',.0003),bSteps=variants('adopt',.0007);
const aLibrary=makeLibrary(aSteps),bLibrary=makeLibrary(bSteps);
const aRaw='\n  '+JSON.stringify(aLibrary,null,3)+'\n',bRaw='\n '+JSON.stringify(bLibrary,null,2)+'\n';
await fs.mkdir(out,{recursive:true});
const server=await createServer({root,configFile:false,cacheDir:'output/official-sequence/.vite-ui',logLevel:'error',server:{host:'127.0.0.1',port:8876,strictPort:true,hmr:false}});
await server.listen();
const base='http://127.0.0.1:8876/?inspect=1',origin=new URL(base).origin;
let browser,failure,activePage;
const contexts=[];
async function context(seed){
 const c=await browser.newContext({viewport:{width:1440,height:1020},deviceScaleFactor:1});contexts.push(c);
 await c.route('**/*',route=>{
  const url=route.request().url();if(url.startsWith('http')&&new URL(url).origin!==origin){externalRequests.push(url);return route.abort();}return route.continue();
 });
 if(seed)await c.addInitScript(({origin,key,raw})=>{if(location.origin===origin&&!localStorage.getItem(key))localStorage.setItem(key,raw);},{origin,key:LIBRARY,raw:seed});
 const p=await c.newPage();activePage=p;p.setDefaultTimeout(12000);
 p.on('pageerror',error=>errors.push(error.message));p.on('console',message=>{if(message.type()==='error')consoleErrors.push(message.text());});
 return p;
}
const status=p=>p.evaluate(()=>window.flareInspector.status());
const pose=p=>p.evaluate(()=>window.flareInspector.capturePose());
const demonstration=p=>p.evaluate(()=>window.flareInspector.demonstration());
const rawLibrary=p=>p.evaluate(key=>localStorage.getItem(key),LIBRARY);
const storage=p=>p.evaluate(()=>Object.fromEntries(Object.keys(localStorage).sort().map(key=>[key,localStorage.getItem(key)])));
const settle=p=>p.waitForTimeout(180);
async function ready(p){await p.waitForFunction(()=>document.documentElement.dataset.ready==='true'&&typeof window.flareInspector?.demonstration==='function',{},{timeout:45000});await settle(p);}
async function drawer(p,side,open){const button=p.locator('#toggle-'+side);if((await button.getAttribute('aria-expanded'))!==String(open))await button.click();await p.waitForFunction(({side,open})=>window.flareInspector.status().workspace[side+'Open']===open,{side,open});await settle(p);}
async function mode(p,value){await drawer(p,'library',true);await p.locator(`button[data-mode="${value}"]`).click();await settle(p);}
async function completeBody(p,label){
 const projection=await p.evaluate(()=>window.flareInspector.projectCoach());
 check(label+': actual model vertices fit the complete viewport',projection?.min?.every(v=>Number.isFinite(v)&&v>=-1.001)&&projection?.max?.every(v=>Number.isFinite(v)&&v<=1.001),projection);
 const state=await status(p),viewport=p.viewportSize();
 if(viewport.width>960){
  const box={left:(projection.min[0]+1)*viewport.width/2,right:(projection.max[0]+1)*viewport.width/2,top:(1-projection.max[1])*viewport.height/2,bottom:(1-projection.min[1])*viewport.height/2};
  const inset=state.framingInsets;
  check(label+': model clears open drawers and HUD',box.left>=inset.left-2&&box.right<=viewport.width-inset.right+2&&box.top>=inset.top-2&&box.bottom<=viewport.height-inset.bottom+2,{box,inset});
 }
 const dimensions=await p.evaluate(()=>{const b=document.querySelector('#scene canvas').getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height,innerWidth,innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight};});
 check(label+': canvas fills the window',Math.abs(dimensions.x)<1&&Math.abs(dimensions.y)<1&&Math.abs(dimensions.width-dimensions.innerWidth)<1&&Math.abs(dimensions.height-dimensions.innerHeight)<1,dimensions);
 check(label+': no document overflow',dimensions.scrollWidth<=dimensions.innerWidth+1&&dimensions.scrollHeight<=dimensions.innerHeight+1,dimensions);
}
async function bones(p,label){
 const state=await status(p),metrics=state.motion;
 const maximumLengthError=Math.max(...Object.entries(metrics.segmentLengths).map(([name,value])=>Math.abs(value-metrics.expectedLengths[name])));
 const maximumSupportDrift=Math.max(0,...Object.values(metrics.supportDrift).filter(value=>value!==null));
 check(label+': pose and runtime metrics finite',finite(await pose(p))&&finite(metrics));
 check(label+': fixed bone lengths',maximumLengthError<1e-6,maximumLengthError);
 check(label+': finite locked hand support',Number.isFinite(maximumSupportDrift)&&maximumSupportDrift<1e-6,maximumSupportDrift);
 frames.push({label,time:state.time,supportHands:metrics.supportHands,maximumLengthError,maximumSupportDrift,minFootHeight:metrics.minFootHeight});
}
function onlyFormal(before,after,label){
 const all=new Set([...Object.keys(before),...Object.keys(after)]),unexpected=[];
 for(const key of all)if(key!==FORMAL&&key!==BACKUP&&before[key]!==after[key])unexpected.push(key);
 check(label+': only formal/backup storage changed',unexpected.length===0,unexpected);
}
async function equalsSteps(p,steps,label){
 const formal=await demonstration(p);
 check(label+': contains nine steps',formal.steps.length===9&&formal.period===9);
 check(label+': poses match actual supplied steps',formal.steps.every((step,index)=>JSON.stringify(step.pose)===JSON.stringify(steps[index].pose)));
 check(label+': source step identities retained',formal.steps.every((step,index)=>step.sourceStepId===steps[index].id));
}
try{
 browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
 const p=await context();await p.goto(base);await ready(p);
 let state=await status(p);
 check('Default opens motion paused at zero',state.mode==='motion'&&!state.playing&&state.time===0,state.mode);
 check('Default uses nine-step nine-second cycle',state.motion.period===9&&state.motion.demonstration.count===9);
 await drawer(p,'library',true);await drawer(p,'details',true);
 const buttons=p.locator('#pose-presets button[data-preset]');
 check('Left drawer contains nine formal pose buttons',await buttons.count()===9);
 check('Timeline ends at nine seconds',Number(await p.locator('#timeline').getAttribute('max'))===9);
 const labels=await buttons.locator('strong').allTextContents();
 check('Formal labels match bundled user sequence',JSON.stringify(labels)===JSON.stringify(bundled.steps.map(s=>s.name)),labels);
 for(const [index,step] of bundled.steps.entries()){
  await drawer(p,'library',true);await p.locator(`button[data-preset="${step.id}"]`).click();await settle(p);
  state=await status(p);const actual=await pose(p),difference=numericDifference(actual,step.pose);
  check(`Formal button ${index+1}: integer time and index`,state.mode==='motion'&&!state.playing&&Math.abs(state.time-index)<1e-9&&state.motion.demonstration.index===index,state.time);
  check(`Formal button ${index+1}: original user pose`,difference<1e-6,{difference});
  check(`Formal button ${index+1}: button is selected`,await p.locator(`button[data-preset="${step.id}"]`).getAttribute('aria-pressed')==='true');
  await bones(p,`Integer ${index}`);await completeBody(p,`Desktop step ${index+1}`);
 }
 await drawer(p,'details',true);await p.locator('#timeline').fill('9');await settle(p);
 check('Timeline nine seconds loops to first pose',numericDifference(await pose(p),bundled.steps[0].pose)<1e-6);
 for(const time of [.5,1.5,3.5,4.5,6.5,8.5]){await p.locator('#timeline').fill(String(time));await settle(p);await bones(p,`Interpolated ${time}`);}
 await p.locator('#timeline').fill('0');await p.locator('#speed').selectOption('1');await p.locator('#play-button').click();
 const playing=[];
 for(let i=0;i<8;i++){await p.waitForTimeout(80);playing.push(await status(p));}
 check('Play advances the actual loop',playing.every(s=>s.playing)&&playing.at(-1).time>playing[0].time+.15,playing.map(s=>s.time));
 await p.locator('#play-button').click();const paused=(await status(p)).time;await p.waitForTimeout(200);
 check('Pause freezes the selected time',!(await status(p)).playing&&Math.abs((await status(p)).time-paused)<1e-9);
 await bones(p,'Paused playback');
 await p.locator('#timeline').fill('2');await drawer(p,'library',true);await drawer(p,'details',true);await settle(p);await completeBody(p,'Desktop delivery');
 await p.screenshot({path:path.join(out,'正式展示.png'),fullPage:false});
 await drawer(p,'library',false);await drawer(p,'details',false);await completeBody(p,'Desktop hidden drawers');
 check('Both desktop drawers hide independently',!(await status(p)).workspace.libraryOpen&&!(await status(p)).workspace.detailsOpen);

 await p.setViewportSize({width:390,height:844});await settle(p);
 await drawer(p,'library',true);await drawer(p,'details',true);
 check('Mobile drawers are exclusive',!(await status(p)).workspace.libraryOpen&&(await status(p)).workspace.detailsOpen);
 await drawer(p,'details',false);await drawer(p,'library',true);await p.locator(`button[data-preset="${bundled.steps[2].id}"]`).click();await settle(p);
 check('Mobile preset closes both drawers',!(await status(p)).workspace.libraryOpen&&!(await status(p)).workspace.detailsOpen);
 await completeBody(p,'Mobile hidden drawers');await p.screenshot({path:path.join(out,'正式展示-手机.png'),fullPage:false});

 const upgraded=await context(aRaw);await upgraded.goto(base);await ready(upgraded);
 await equalsSteps(upgraded,aSteps,'Upgrade auto-adoption');
 check('Upgrade preserves exact personal storage bytes',await rawLibrary(upgraded)===aRaw);
 check('Upgrade preserves saved draft JSON',JSON.stringify((await upgraded.evaluate(()=>window.flareInspector.poseLibrary())).draft)===JSON.stringify(aLibrary.draft));
 const upgradeStorage=await storage(upgraded);check('Upgrade writes only separate formal stores',!!upgradeStorage[FORMAL]&&!!upgradeStorage[BACKUP]);
 const aFormal=await demonstration(upgraded);await upgraded.reload();await ready(upgraded);
 check('Reload keeps auto-adopted formal sequence',JSON.stringify(await demonstration(upgraded))===JSON.stringify(aFormal));
 check('Reload preserves exact personal storage bytes',await rawLibrary(upgraded)===aRaw);

 // A published sequence already exists: replace personal test steps without
 // touching that formal store, then exercise the actual adopt/undo buttons.
 await upgraded.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key:LIBRARY,raw:bRaw});
 await upgraded.reload();await ready(upgraded);
 check('Existing formal selection survives different personal edits',JSON.stringify(await demonstration(upgraded))===JSON.stringify(aFormal));
 const beforeNavigation=await rawLibrary(upgraded),navigationMode=(await status(upgraded)).mode;
 await mode(upgraded,'pose');await drawer(upgraded,'library',true);await settle(upgraded);
 const navigationDifference=numericDifference(await pose(upgraded),bLibrary.draft);
 check('Pose navigation restores saved draft without rewriting personal bytes',navigationMode==='motion'&&beforeNavigation===bRaw&&navigationDifference<1e-6&&await rawLibrary(upgraded)===beforeNavigation,{difference:navigationDifference});
 check('Personal nine-step shelf exposes adopt button',await upgraded.locator('#pose-use-demonstration').isVisible());
 const beforeAdoption=await storage(upgraded),personalBefore=await rawLibrary(upgraded);
 await upgraded.locator('#pose-use-demonstration').click();await settle(upgraded);
 await equalsSteps(upgraded,bSteps,'Explicit personal-step adoption');
 check('Adopt leaves personal storage byte-identical',await rawLibrary(upgraded)===personalBefore);
 onlyFormal(beforeAdoption,await storage(upgraded),'Adopt');
 check('Undo button is available',await upgraded.locator('#pose-undo-demonstration').isVisible());
 const beforeUndo=await storage(upgraded);await upgraded.locator('#pose-undo-demonstration').click();await settle(upgraded);
 check('Undo restores previous formal sequence',JSON.stringify(await demonstration(upgraded))===JSON.stringify(aFormal));
 check('Undo keeps personal edits and draft untouched',await rawLibrary(upgraded)===personalBefore);
 onlyFormal(beforeUndo,await storage(upgraded),'Undo');
 await upgraded.reload();await ready(upgraded);
 check('Reload retains undone formal choice',JSON.stringify(await demonstration(upgraded))===JSON.stringify(aFormal));
 check('Reload after undo keeps personal bytes untouched',await rawLibrary(upgraded)===personalBefore);

 // Explicitly editing a displayed frame differs from entering the editor via
 // navigation: it replaces only the working draft with that displayed frame.
 await drawer(upgraded,'details',true);await upgraded.locator('#timeline').fill('2');await settle(upgraded);
 const displayedFrame=await pose(upgraded),beforeFrameEdit=JSON.parse(await rawLibrary(upgraded));
 await upgraded.locator('#edit-current-pose').click();await settle(upgraded);
 const frameDifference=numericDifference(await pose(upgraded),displayedFrame),afterFrameRaw=await rawLibrary(upgraded),afterFrameEdit=JSON.parse(afterFrameRaw);
 check('Edit this pose adopts current frame while preserving saved steps',(await status(upgraded)).mode==='pose'&&frameDifference<1e-6&&numericDifference(afterFrameEdit.draft,displayedFrame)<1e-6&&JSON.stringify(afterFrameEdit.steps)===JSON.stringify(beforeFrameEdit.steps),{difference:frameDifference});
 await upgraded.reload();await ready(upgraded);await mode(upgraded,'pose');
 const reloadedDraftDifference=numericDifference(await pose(upgraded),afterFrameEdit.draft);
 check('Reload then pose navigation restores edited draft without rewriting bytes',reloadedDraftDifference<1e-6&&await rawLibrary(upgraded)===afterFrameRaw,{difference:reloadedDraftDifference});
 check('No browser page exceptions',errors.length===0,errors);
 check('No browser console errors',consoleErrors.length===0,consoleErrors);
 check('All requests remain local/offline',externalRequests.length===0,externalRequests);
}catch(error){failure=error.stack;await activePage?.screenshot({path:path.join(out,'demonstration-ui-failure.png'),fullPage:false}).catch(()=>{});}
finally{
 const report={pass:!failure,passed:checks.filter(c=>c.pass).length,total:checks.length,failure,checks,errors,consoleErrors,externalRequests,frames,screenshot:path.join(out,'正式展示.png'),syntheticStorageFixtures:'Independent isolated browser contexts with tiny world-Y foot rotation edits; no human browser storage read or modified.'};
 await fs.writeFile(path.join(out,'demonstration-ui-verification.json'),JSON.stringify(report,null,2));
 await browser?.close();await server.close();
 console.log(JSON.stringify({pass:report.pass,passed:report.passed,total:report.total,failure,errors,report:path.join(out,'demonstration-ui-verification.json'),screenshot:report.screenshot},null,2));
 if(failure)process.exitCode=1;
}
