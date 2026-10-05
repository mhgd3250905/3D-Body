import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {isDeepStrictEqual} from 'node:util';
import {Quaternion,Vector3,Matrix4} from 'three';
import {mirrorPose} from '../src/pose-mirror.js';

const require=createRequire(import.meta.url);
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root=fileURLToPath(new URL('../',import.meta.url)),out=path.join(root,'output/playwright');
await fs.mkdir(out,{recursive:true});
const checks=[],errors=[],check=(name,pass,detail)=>{checks.push({name,pass:!!pass,...(detail===undefined?{}:{detail})});if(!pass)throw new Error(name);};
const close=(a,b,tolerance=1e-7)=>a.length===b.length&&a.every((v,i)=>Math.abs(v-b[i])<=tolerance);
function compareDraft(a,b){
  let maximumNumericDifference=0;
  const same=(first,second)=>{
    if(typeof first==='number'&&typeof second==='number'){
      const difference=Math.abs(first-second);maximumNumericDifference=Math.max(maximumNumericDifference,difference);
      return Number.isFinite(difference)&&difference<=1e-12;
    }
    if(first&&second&&typeof first==='object'&&typeof second==='object'){
      const keys=Object.keys(first);return Array.isArray(first)===Array.isArray(second)&&keys.length===Object.keys(second).length&&keys.every(key=>key in second&&same(first[key],second[key]));
    }
    return first===second;
  };
  return {same:same(a,b),maximumNumericDifference};
}
const reflection=new Matrix4().makeScale(-1,1,1);
const reflect=p=>new Vector3().fromArray(p).applyMatrix4(reflection).toArray();
function rotationMatches(source,target){
  const wanted=reflection.clone().multiply(new Matrix4().makeRotationFromQuaternion(new Quaternion().fromArray(source))).multiply(reflection);
  const actual=new Matrix4().makeRotationFromQuaternion(new Quaternion().fromArray(target));
  return close(wanted.elements,actual.elements,1e-10);
}
function mirroredFrom(source,target,tolerance=1e-7){
  if(!close(reflect(source.pelvis),target.pelvis,tolerance)||!rotationMatches(source.bodyQuaternion,target.bodyQuaternion)||source.groundLock!==target.groundLock)return false;
  for(const side of ['left','right']){
    const from=source.limbs[side],to=target.limbs[side==='left'?'right':'left'];
    if(from.handLocked!==to.handLocked)return false;
    for(const key of ['wrist','elbowPole','ankle','kneePole'])if(!close(reflect(from[key]),to[key],tolerance))return false;
    for(const key of ['handQuaternion','footQuaternion'])if(!rotationMatches(from[key],to[key]))return false;
  }
  return true;
}
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1440,height:1050},acceptDownloads:true});
page.on('pageerror',error=>errors.push(error.message));
const library=()=>page.evaluate(()=>window.flareInspector.poseLibrary());
const snapshot=()=>page.evaluate(()=>window.flareInspector.capturePose());
const open=async side=>{const button=page.locator(side==='library'?'#toggle-library':'#toggle-details');if(await button.getAttribute('aria-expanded')!=='true')await button.click();};
let failure;
try{
  await page.goto(new URL('?inspect=1',process.argv[2]||'http://127.0.0.1:8810/').href);
  await page.waitForFunction(()=>document.documentElement.dataset.ready==='true');
  for(let index=0;index<5;index++){
    await open('library');await page.locator('[data-preset]').nth(index).click();await open('details');
    // Use real numeric controls to make the saved poses different from templates.
    await page.locator('#pose-handle-select').selectOption('leftAnkle');
    const previous=Number(await page.locator('#pose-rot-1').inputValue());
    await page.locator('#pose-rot-1').fill(String(previous+7+index));await page.locator('#pose-rot-1').press('Tab');
    await page.locator('#pose-save').click();
  }
  const before=await library(),draft=JSON.stringify(await snapshot());
  const templates=await page.evaluate(()=>window.flareInspector.presetLibrary());
  check('Five genuinely edited source poses save',before.steps.length===5&&before.steps.every((step,i)=>JSON.stringify(step.pose)!==JSON.stringify(templates[i].pose)));
  check('Double reflection restores positions and rotations',before.steps.every(step=>{
    const twice=mirrorPose(mirrorPose(step.pose));return isDeepStrictEqual(twice,step.pose);
  }));
  await open('library');await page.locator('#pose-complete-mirrors').click();
  const after=await library();
  check('Completion adds four steps to make a full nine-pose sequence',after.steps.length===9);
  check('Original five remain byte-for-byte unchanged',JSON.stringify(after.steps.slice(0,5))===JSON.stringify(before.steps));
  // Restoring the live rig runs normalized quaternion and IK arithmetic.
  // Saved source JSON stays byte-identical above; allow only machine-scale
  // rounding in the recomputed live capture, not a change in pose or locks.
  const draftComparison=compareDraft(JSON.parse(draft),await snapshot());
  check('Existing draft is preserved',draftComparison.same,{maximumNumericDifference:draftComparison.maximumNumericDifference,tolerance:1e-12});
  check('A full pre-completion local backup exists',await page.evaluate(expected=>JSON.stringify(JSON.parse(localStorage.getItem('flare-pose-mirror-backup-v1')).steps)===expected,JSON.stringify(before.steps)));
  for(let index=0;index<4;index++){
    const source=before.steps[3-index],target=after.steps[5+index];
    check(`Step ${6+index} mirrors edited step ${4-index}, including all directions and locks`,target.mirrorOf===source.id&&mirroredFrom(source.pose,target.pose));
    await page.locator(`[data-pose-load="${target.id}"]`).click();await open('library');
    check(`Step ${6+index} applies to the real rig without meaningful drift`,mirroredFrom(source.pose,await snapshot(),1e-5));
    const metric=await page.evaluate(()=>window.flareInspector.rigMetrics());
    check(`Step ${6+index} keeps real bone lengths and shoes above the floor`,metric.minFootHeight>=.006-1e-7&&Object.entries(metric.segmentLengths).every(([name,length])=>Math.abs(length-metric.expectedLengths[name])<1e-8));
  }
  check('Repetition cannot duplicate the completed half',await page.locator('#pose-complete-mirrors').isDisabled());
  await page.locator('[data-pose-load]').nth(6).click();await open('details');await page.locator('#pose-technique > summary').click();
  check('Opposite support guidance follows the mirrored pose',(await page.locator('#pose-technique').innerText()).includes('左掌朝下'));
  await page.locator('#pose-name').fill('左手单撑 · 我的镜像优化');await page.locator('#pose-update').click();
  check('Mirrored steps stay editable without changing the source',(await library()).steps[6].name==='左手单撑 · 我的镜像优化'&&JSON.stringify((await library()).steps.slice(0,5))===JSON.stringify(before.steps));
  const downloadEvent=page.waitForEvent('download');await page.locator('#pose-export').click();
  const download=await downloadEvent,exportPath=path.join(out,'mirror-verification-steps.json');await download.saveAs(exportPath);
  const exported=JSON.parse(await fs.readFile(exportPath,'utf8'));
  check('Export preserves all nine poses and mirrored provenance',exported.steps.length===9&&exported.steps[6].mirrored&&exported.steps[6].mirrorOf===before.steps[2].id);
  const restoredPage=await browser.newPage({viewport:{width:1280,height:1000}});
  await restoredPage.goto(new URL('?inspect=1',process.argv[2]||'http://127.0.0.1:8810/').href);await restoredPage.waitForFunction(()=>document.documentElement.dataset.ready==='true');
  await restoredPage.locator('#pose-import-file').setInputFiles(exportPath);await restoredPage.waitForFunction(()=>window.flareInspector.poseLibrary().steps.length===9);
  check('A restored library keeps mirrored provenance without duplicating the other side',await restoredPage.evaluate(()=>{const steps=window.flareInspector.poseLibrary().steps;return steps[6].mirrored&&steps[6].mirrorOf===steps[2].id;})&&await restoredPage.locator('#pose-complete-mirrors').isDisabled());
  await restoredPage.close();
  // An isolated profile stands in for the original browser holding the user's
  // five saves; the completion runs on refresh without replacing source data.
  const autoPage=await browser.newPage({viewport:{width:1280,height:1000}});
  await autoPage.addInitScript(saved=>{if(!localStorage.getItem('flare-pose-library-v1'))localStorage.setItem('flare-pose-library-v1',JSON.stringify(saved));},before);
  await autoPage.goto(new URL('?inspect=1',process.argv[2]||'http://127.0.0.1:8810/').href);
  await autoPage.waitForFunction(()=>document.documentElement.dataset.ready==='true');
  check('Original-browser refresh completes the five edited saves automatically',await autoPage.evaluate(saved=>{const lib=window.flareInspector.poseLibrary();return lib.steps.length===9&&JSON.stringify(lib.steps.slice(0,5))===saved;},JSON.stringify(before.steps)));
  await autoPage.locator('#pose-undo-mirrors').click();await autoPage.reload();await autoPage.waitForFunction(()=>document.documentElement.dataset.ready==='true');
  check('An explicit undo remains undone after a refresh',await autoPage.evaluate(()=>window.flareInspector.poseLibrary().steps.length===5));
  await autoPage.close();
  await page.reload();await page.waitForFunction(()=>document.documentElement.dataset.ready==='true');await open('library');
  check('Reload retains the full sequence and original five',(await library()).steps.length===9&&JSON.stringify((await library()).steps.slice(0,5))===JSON.stringify(before.steps));
  await open('details');await page.locator('#pose-technique > summary').click();check('Reload retains the mirrored draft guidance',(await page.locator('#pose-technique').innerText()).includes('左掌朝下'));
  await page.locator('#pose-undo-mirrors').click();
  check('Undo completion restores the five originals',(await library()).steps.length===5&&JSON.stringify((await library()).steps)===JSON.stringify(before.steps));
  check('Removed mirror steps remain recoverable',(await library()).removed.length===4);
  await page.locator('#pose-complete-mirrors').click();await page.locator('[data-pose-load]').nth(6).click();
  await open('library');await open('details');await page.locator('#pose-technique > summary').click();await page.locator('#pose-fit').click();
  await page.screenshot({path:path.join(out,'pose-mirror-nine-steps.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});await open('library');
  check('Mirror controls fit a mobile drawer',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  check('No browser exceptions',errors.length===0,errors);
}catch(error){failure=error.stack;await page.screenshot({path:path.join(out,'pose-mirroring-failure.png'),fullPage:true}).catch(()=>{});}
finally{await fs.writeFile(path.join(out,'pose-mirroring-verification.json'),JSON.stringify({passed:checks.filter(c=>c.pass).length,total:checks.length,failure,checks,errors},null,2));await browser.close();}
console.log(JSON.stringify({passed:checks.filter(c=>c.pass).length,total:checks.length,failure,report:path.join(out,'pose-mirroring-verification.json')},null,2));if(failure)process.exitCode=1;
