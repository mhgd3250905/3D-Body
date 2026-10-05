import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {applySavedMirrorUpdate,SAVED_RIGHT_MIRROR_BACKUP_KEY} from '../src/saved-mirror-update.js';
import {
  OFFICIAL_FLARE_SEQUENCE as bundled,OFFICIAL_LOOP_UPGRADE_BACKUP_KEY as upgradeBackup,
  OFFICIAL_LOOP_UPGRADE_MARKER_KEY as marker,validSequence,resolveOfficialSequence,
  sequenceFromSavedSteps,saveOfficialSequence,previousOfficialSequence,restoreOfficialSequence,
} from '../src/official-poses.js';

const root=fileURLToPath(new URL('../',import.meta.url)),out=path.join(root,'output/saved-loop-9-16');
const old=JSON.parse(await fs.readFile(path.join(root,'public/coach/flare-sequence-before-9-16.json'),'utf8'));
const exported=JSON.parse(await fs.readFile(path.join(root,'托马斯/16.json'),'utf8'));
const KEY='flare-demonstration-v1',LIBRARY='flare-pose-library-v1',BACKUP='flare-demonstration-backup-v1';
const clone=structuredClone,numbers=[9,10,11,12,13,14,15,16,9],expected=numbers.map(n=>exported.steps[n-1]);
const library={...clone(exported),draft:clone(exported.steps[11].pose),title:'保留原草稿 · 17 步',removed:[],draftSourcePreset:null,extra:{keep:'原有个人字段'}};
const personalRaw='\n  '+JSON.stringify(library,null,3)+'\n',oldRaw='\n '+JSON.stringify(old,null,2)+'\n';
const checks=[],errors=[];
const check=(name,pass,detail)=>{checks.push({name,pass:Boolean(pass),...(detail===undefined?{}:{detail})});assert.ok(pass,name);};
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function memory(entries={},failKey){
 const map=new Map(Object.entries(entries));
 return {getItem:k=>map.get(k)??null,setItem:(k,v)=>{if(k===failKey)throw Error('quota');map.set(k,String(v));},removeItem:k=>map.delete(k),map};
}

await fs.mkdir(out,{recursive:true});
check('Old and new formal sequences validate independently',validSequence(old)&&validSequence(bundled));
check('The bundle uses original source 9..16..9 poses exactly',bundled.steps.every((step,i)=>equal(step.pose,expected[i].pose))&&equal(bundled.source.stepNumbers,numbers));
const duplicates=clone(old);duplicates.steps[1].id=duplicates.steps[0].id;
const badPhase=clone(old);badPhase.steps[2].phase='unknown';
const badPose=clone(old);badPose.steps[4].pose.pelvis[0]=NaN;
check('Duplicate IDs, unsupported phases and nonfinite poses are rejected',!validSequence(duplicates)&&!validSequence(badPhase)&&!validSequence(badPose));
const adopted=sequenceFromSavedSteps(library.steps);
check('Seventeen personal steps select only source 9..16 and repeat original 9',adopted.steps.every((step,i)=>equal(step.pose,expected[i].pose)&&step.sourceStepId===expected[i].id)&&equal(adopted.source.stepNumbers,numbers));
check('Official display names stay new while original saved names are retained separately',adopted.steps.every((step,i)=>step.name===bundled.steps[i].name&&step.sourceStepName===expected[i].name));
const shuffled=sequenceFromSavedSteps([...clone(library.steps)].reverse());
check('Existing source IDs win over reordered personal positions',shuffled.steps.every((step,i)=>equal(step.pose,expected[i].pose)));
const imported=clone(library.steps);imported.forEach((step,i)=>step.id='imported-'+i);
check('Imports with regenerated IDs fall back to positions 9..16..9',sequenceFromSavedSteps(imported).steps.every((step,i)=>equal(step.pose,expected[i].pose)&&step.sourceStepId===imported[numbers[i]-1].id));
const nine=clone(library.steps.slice(0,9));nine.forEach((step,i)=>step.name='自定义九步 '+(i+1));
const explicit=sequenceFromSavedSteps(nine);
check('Explicit arbitrary nine-step sequences remain supported',validSequence(explicit)&&explicit.steps.every((step,i)=>step.name===nine[i].name&&equal(step.pose,nine[i].pose)));
const inputRaw=JSON.stringify(library);adopted.steps[0].pose.pelvis[0]+=1;
check('Adoption does not alias or mutate any personal step or draft',JSON.stringify(library)===inputRaw);
const storage=memory({[KEY]:oldRaw,[LIBRARY]:personalRaw}),upgraded=resolveOfficialSequence(storage);
check('An old published display upgrades to the new bundle',equal(upgraded,bundled)&&equal(JSON.parse(storage.getItem(KEY)),bundled));
check('Upgrade preserves exact old raw bytes in both backups',storage.getItem(upgradeBackup)===oldRaw&&storage.getItem(BACKUP)===oldRaw);
check('Upgrade leaves every personal library byte unchanged',storage.getItem(LIBRARY)===personalRaw);
const publishedRaw=storage.getItem(KEY);resolveOfficialSequence(storage);
check('Upgrade is idempotent on reload',storage.getItem(KEY)===publishedRaw&&storage.getItem(marker)===bundled.source.revision);
restoreOfficialSequence(previousOfficialSequence(storage),storage);
check('Undo accepts the old IDs and phases and survives another resolve',equal(resolveOfficialSequence(storage),old)&&storage.getItem(upgradeBackup)===oldRaw&&storage.getItem(LIBRARY)===personalRaw);
const empty=memory({[LIBRARY]:personalRaw});resolveOfficialSequence(empty);
check('No previously published value still has the old default as undo',equal(previousOfficialSequence(empty),old));
const current=clone(bundled);current.steps[0].name='当前已发布内容';const currentRaw=JSON.stringify(current);
const recognizedNine={version:1,steps:clone(old.steps)};
const retained=memory({[KEY]:currentRaw,[LIBRARY]:JSON.stringify(recognizedNine)});
check('New-revision publication is not replaced by an old same-name personal nine',equal(resolveOfficialSequence(retained),current)&&retained.getItem(KEY)===currentRaw);
const blocked=memory({[KEY]:oldRaw,[LIBRARY]:personalRaw},upgradeBackup);
check('Failed independent backup prevents replacement of an old publication',equal(resolveOfficialSequence(blocked),old)&&blocked.getItem(KEY)===oldRaw&&blocked.getItem(BACKUP)===null);
const existing=memory({[KEY]:oldRaw,[upgradeBackup]:'existing independent raw backup'});resolveOfficialSequence(existing);
check('Independent upgrade backup is never overwritten',existing.getItem(upgradeBackup)==='existing independent raw backup');
const saved=memory();saveOfficialSequence(explicit,saved);
check('An explicit nine-step adoption is retained across resolution',equal(resolveOfficialSequence(saved),explicit));
const completePersonal=memory({[LIBRARY]:personalRaw});
check('Already-complete mirrors neither rewrite personal raw nor create a backup',!applySavedMirrorUpdate(completePersonal).applied&&completePersonal.getItem(LIBRARY)===personalRaw&&completePersonal.getItem(SAVED_RIGHT_MIRROR_BACKUP_KEY)===null);
const thirteen=clone(library);thirteen.steps=thirteen.steps.slice(0,13);const needsMirrors=memory({[LIBRARY]:JSON.stringify(thirteen)});
check('The previous thirteen-step append still adds exactly three once',applySavedMirrorUpdate(needsMirrors).addedCount===3&&!applySavedMirrorUpdate(needsMirrors).applied);

if(process.argv.includes('--module-only')){
 const report={pass:true,passed:checks.length,total:checks.length,checks,scope:'Only formal-loop selection and storage migration; no model or full-suite checks.'};
 await fs.writeFile(path.join(out,'module-verification.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({pass:true,passed:checks.length,report:path.join(out,'module-verification.json')}));
}else{
 const require=createRequire(import.meta.url),{chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
 const base='http://127.0.0.1:8810/?inspect=1',origin=new URL(base).origin;
 let browser,activePage,failure;
 const maximumDifference=(a,b)=>{
  let maximum=0;
  const visit=(x,y)=>{
   if(typeof x==='number'||typeof y==='number'){if(typeof x!=='number'||typeof y!=='number'||!Number.isFinite(x)||!Number.isFinite(y))maximum=Infinity;else maximum=Math.max(maximum,Math.abs(x-y));}
   else if(x&&y&&typeof x==='object'&&typeof y==='object'){if(Object.keys(x).length!==Object.keys(y).length)maximum=Infinity;for(const k of Object.keys(x))visit(x[k],y[k]);}
   else if(x!==y)maximum=Infinity;
  };visit(a,b);return maximum;
 };
 async function pageFor(seed,viewport={width:1440,height:1080}){
  const context=await browser.newContext({viewport});
  await context.addInitScript(({origin,seed})=>{if(location.origin===origin&&!localStorage.getItem('loop-ui-seeded')){for(const [key,value] of Object.entries(seed))localStorage.setItem(key,value);localStorage.setItem('loop-ui-seeded','1');}},{origin,seed});
  const page=await context.newPage();activePage=page;page.setDefaultTimeout(12000);page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base);await ready(page);return page;
 }
 async function ready(page){await page.waitForFunction(()=>document.documentElement.dataset.ready==='true'&&typeof window.flareInspector?.demonstration==='function',null,{timeout:45000});}
 const formal=page=>page.evaluate(()=>window.flareInspector.demonstration());
 const stored=(page,key)=>page.evaluate(key=>localStorage.getItem(key),key);
 async function drawer(page,side,open){const button=page.locator('#toggle-'+side);if(await button.getAttribute('aria-expanded')!==String(open))await button.click();}
 async function mode(page,value){await drawer(page,'library',true);await page.locator(`button[data-mode="${value}"]`).click();}
 try{
  browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
  const page=await pageFor({[KEY]:oldRaw,[LIBRARY]:personalRaw});
  check('Built page upgrades the old published loop to source 9..16..9',equal(await formal(page),bundled));
  check('Built page backs up every original published byte independently',await stored(page,upgradeBackup)===oldRaw);
  check('Built page keeps all seventeen personal steps and draft raw unchanged',await stored(page,LIBRARY)===personalRaw);
  await drawer(page,'library',true);
  check('Formal sidebar shows nine choices with original source badges',await page.locator('#pose-presets [data-preset]').count()===9&&equal(await page.locator('#pose-presets .preset-number').allTextContents(),numbers.map(number=>String(number).padStart(2,'0'))));
  const fixedView=await page.evaluate(()=>{const state=window.flareInspector.status();return {camera:state.camera,target:state.target};});
  const differences=[],cameraDifferences=[];
  for(let index=0;index<9;index++){
   await page.locator(`#pose-presets [data-preset="${bundled.steps[index].id}"]`).click();
   const snapshot=await page.evaluate(()=>({pose:window.flareInspector.capturePose(),status:window.flareInspector.status()}));
   differences.push(maximumDifference(snapshot.pose,expected[index].pose));
   cameraDifferences.push(maximumDifference({camera:snapshot.status.camera,target:snapshot.status.target},fixedView));
   check(`Source ${numbers[index]} at formal anchor ${index} keeps saved pose`,differences[index]<1e-6&&Math.abs(snapshot.status.time-index)<1e-9,{maximumPoseDifference:differences[index],time:snapshot.status.time});
  }
  check('Choosing the nine formal anchors preserves camera and target',Math.max(...cameraDifferences)<1e-9,{maximumCameraDifference:Math.max(...cameraDifferences)});
  const phaseOrder=await page.locator('#phase-strip [data-phase]').evaluateAll(buttons=>buttons.map(button=>Number(button.dataset.phase)));
  check('Four phase choices follow rear, first side, front, second side',equal(phaseOrder,[2,1,0,3]),phaseOrder);
  const phaseTargets=[[2,0],[1,2],[0,4],[3,6]],phaseSnapshots=[];
  for(const [phase,time] of phaseTargets){await page.locator(`#phase-strip [data-phase="${phase}"]`).click();phaseSnapshots.push(await page.evaluate(()=>window.flareInspector.status()));}
  check('Four phase buttons jump to anchors 0, 2, 4 and 6',phaseSnapshots.every((state,i)=>Math.abs(state.time-phaseTargets[i][1])<1e-9),phaseSnapshots.map(state=>state.time));
  check('Phase jumps also preserve the fixed camera',phaseSnapshots.every(state=>maximumDifference({camera:state.camera,target:state.target},fixedView)<1e-9));
  check('Clicking formal steps keeps the personal library byte-identical',await stored(page,LIBRARY)===personalRaw);
  await page.reload();await ready(page);
  check('Built-page reload preserves upgraded sequence, backup and personal raw',equal(await formal(page),bundled)&&await stored(page,upgradeBackup)===oldRaw&&await stored(page,LIBRARY)===personalRaw);
  await mode(page,'pose');
  check('Editor retains seventeen personal rows and enables adoption',await page.locator('[data-pose-load]').count()===17&&await page.locator('#pose-use-demonstration').isEnabled());
  check('Opening the editor restores original draft without writing personal data',maximumDifference(await page.evaluate(()=>window.flareInspector.capturePose()),library.draft)<1e-6&&await stored(page,LIBRARY)===personalRaw);
  await page.locator('#pose-undo-demonstration').click();
  check('UI undo restores old display with its former unique IDs and phases',equal(await formal(page),old)&&await stored(page,LIBRARY)===personalRaw);
  await page.reload();await ready(page);
  check('Undo stays selected after reload and does not re-upgrade',equal(await formal(page),old)&&await stored(page,LIBRARY)===personalRaw&&await stored(page,upgradeBackup)===oldRaw);
  await mode(page,'pose');await page.locator('#pose-use-demonstration').click();
  const expectedAdopted=sequenceFromSavedSteps(library.steps);
  check('UI adopts source 9..16..9 from all seventeen personal steps',equal(await formal(page),expectedAdopted)&&await stored(page,LIBRARY)===personalRaw);
  await page.reload();await ready(page);
  check('Explicit seventeen-step adoption remains after reload',equal(await formal(page),expectedAdopted)&&await stored(page,LIBRARY)===personalRaw);
  await drawer(page,'library',true);await drawer(page,'details',false);
  await page.screenshot({path:path.join(out,'正式循环9-16-9.png')});
  const mobile=await pageFor({[LIBRARY]:personalRaw},{width:390,height:844});
  await drawer(mobile,'library',true);
  check('Mobile drawer displays the formal nine-step list',await mobile.locator('#pose-presets [data-preset]').count()===9);
  await mobile.locator(`#pose-presets [data-preset="${bundled.steps[2].id}"]`).click();
  const mobileState=await mobile.evaluate(()=>({status:window.flareInspector.status(),projection:window.flareInspector.projectCoach()}));
  check('Mobile step choice closes its drawer and preserves source 11 pose',!mobileState.status.workspace.libraryOpen&&maximumDifference(await mobile.evaluate(()=>window.flareInspector.capturePose()),expected[2].pose)<1e-6);
  check('Mobile model remains visible within the full canvas',mobileState.projection.min.every(value=>Number.isFinite(value)&&value>=-1.01)&&mobileState.projection.max.every(value=>Number.isFinite(value)&&value<=1.01),mobileState.projection);
  await mobile.screenshot({path:path.join(out,'手机循环步骤.png')});
  check('No page errors occurred',errors.length===0,errors);
 }catch(error){failure=error.stack;await activePage?.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});}
 finally{
  const report={pass:!failure,passed:checks.filter(check=>check.pass).length,total:checks.length,checks,errors,failure,scope:'Targeted formal-loop migration, exact anchor selection, adoption/undo and one mobile drawer in isolated contexts. User browser storage and models untouched.',screenshot:path.join(out,'正式循环9-16-9.png')};
  await fs.writeFile(path.join(out,'verification.json'),JSON.stringify(report,null,2));await browser?.close();
  console.log(JSON.stringify({pass:report.pass,passed:report.passed,total:report.total,failure,report:path.join(out,'verification.json'),screenshot:report.screenshot},null,2));
  if(failure)process.exitCode=1;
 }
}
