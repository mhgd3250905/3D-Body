import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const require=createRequire(import.meta.url);
const playwright=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root=fileURLToPath(new URL('../',import.meta.url)),out=path.join(root,'output/playwright');
await fs.mkdir(out,{recursive:true});
const base=process.argv[2]||'http://127.0.0.1:8810/',checks=[],errors=[];
const check=(name,pass,detail)=>{checks.push({name,pass:!!pass,...(detail===undefined?{}:{detail})});if(!pass)throw new Error(name);};
const browser=await playwright.chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1440,height:1020},deviceScaleFactor:1,acceptDownloads:true});
const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
const status=()=>page.evaluate(()=>window.flareInspector.status());
const pose=()=>page.evaluate(()=>window.flareInspector.capturePose());
const library=()=>page.evaluate(()=>window.flareInspector.poseLibrary());
const settle=()=>page.waitForTimeout(100);
const open=async side=>{const button=page.locator(side==='library'?'#toggle-library':'#toggle-details');if(await button.getAttribute('aria-expanded')!=='true')await button.click();};
let failure;
try{
  await page.goto(new URL('?inspect=1',base).href);await page.waitForFunction(()=>document.documentElement.dataset.ready==='true');
  await open('library');await open('details');
  await page.locator('button[data-mode="motion"]').click();await page.locator('[data-phase="1"]').click();const phasePose=await pose();
  await page.locator('#edit-current-pose').click();let s=await status();
  check('Editor starts from the current Flare stage',s.mode==='pose'&&s.motion.mode==='manual'&&JSON.stringify((await pose()).pelvis)===JSON.stringify(phasePose.pelvis));
  check('Eleven editable handles and a selected gizmo',s.editor.enabled&&s.editor.handles.length===11&&s.editor.selected==='pelvis');
  check('Editor has no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('#pose-standing').click();await page.locator('#pose-handle-select').selectOption('leftWrist');
  const before=await pose();const numericY=before.limbs.left.wrist[1]*100+6;
  await page.locator('#pose-pos-1').fill(numericY.toFixed(1));await page.locator('#pose-pos-1').press('Tab');await settle();
  check('Position input moves the real wrist',Math.abs((await pose()).limbs.left.wrist[1]-numericY/100)<.002);
  await page.locator('#pose-undo').click();check('Undo restores the previous pose',Math.abs((await pose()).limbs.left.wrist[1]-before.limbs.left.wrist[1])<1e-8);

  // Hit the visible Y-axis above the selected wrist, then drag it with a real pointer.
  await page.locator('#pose-fit').click();await settle();
  const canvas=await page.locator('#scene').boundingBox(),handle=await page.evaluate(()=>window.flareInspector.projectHandle('leftWrist'));
  let axisPoint;
  for(const offset of [22,30,38,46,54]){
    await page.mouse.move(canvas.x+handle.x,canvas.y+handle.y-offset);await page.waitForTimeout(30);
    if((await status()).editor.axis==='Y'){axisPoint={x:canvas.x+handle.x,y:canvas.y+handle.y-offset};break;}
  }
  check('Visible Y gizmo can be picked',!!axisPoint,{handle,canvas});
  const dragBefore=await pose(),cameraBefore=(await status()).camera;
  await page.mouse.down();check('Dragging starts', (await status()).editor.dragging);
  await page.mouse.move(axisPoint.x,axisPoint.y-22,{steps:6});await page.mouse.up();await settle();
  check('Dragging changes the wrist height',Math.abs((await pose()).limbs.left.wrist[1]-dragBefore.limbs.left.wrist[1])>.025);
  s=await status();check('Drag ends without moving the camera',!s.editor.dragging&&s.camera.every((v,i)=>Math.abs(v-cameraBefore[i])<1e-7));
  await page.locator('#pose-undo').click();check('One undo reverses the entire drag',Math.abs((await pose()).limbs.left.wrist[1]-dragBefore.limbs.left.wrist[1])<1e-8);

  await page.locator('#pose-handle-select').selectOption('leftAnkle');await page.locator('[data-pose-transform="rotate"]').click();
  await page.locator('#pose-rot-1').fill('35');await page.locator('#pose-rot-1').press('Tab');
  check('Foot orientation is editable',Math.abs((await pose()).limbs.left.footQuaternion[1])>.15);
  check('Rotated shoe remains above floor',(await status()).motion.minFootHeight>=.004);
  await page.locator('#pose-name').fill('起始支撑');await page.locator('#pose-save').click();
  check('A named step saves locally',(await library()).steps.length===1&&(await library()).steps[0].name==='起始支撑');
  const first=JSON.stringify((await library()).steps[0].pose);
  await page.locator('[data-preset]').nth(4).click();check('Prepared key poses remain inside editing',(await status()).mode==='pose'&&(await status()).motion.mode==='manual');
  await page.locator('#pose-name').fill('后撑换手');await page.locator('#pose-save').click();
  check('Multiple middle steps save',(await library()).steps.length===2);
  await page.locator('[data-pose-load]').first().click();check('Loading a step restores its pose',JSON.stringify(await pose())===first);
  await page.locator('#pose-name').fill('前支撑标准参考');await page.locator('#pose-update').click();check('Existing steps can be renamed and updated',(await library()).steps[0].name==='前支撑标准参考');
  await page.locator('[data-pose-up]').nth(1).click();check('Steps can be reordered',(await library()).steps[0].name==='后撑换手');
  await page.locator('[data-pose-delete]').first().click();check('Step removal is recoverable',(await library()).steps.length===1&&(await library()).removed.length===1);
  await page.locator('#pose-restore').click();check('Removed step restores',(await library()).steps.length===2);

  const downloadPromise=page.waitForEvent('download');await page.locator('#pose-export').click();const download=await downloadPromise;
  const exported=path.join(out,'my-flare-steps.json');await download.saveAs(exported);const file=JSON.parse(await fs.readFile(exported,'utf8'));
  check('JSON export contains complete poses',file.format==='flare-pose-library'&&file.version===1&&file.steps.length===2&&file.steps.every(step=>step.pose.limbs.left.wrist.length===3));
  await page.locator('#pose-import-file').setInputFiles(exported);await page.waitForFunction(()=>window.flareInspector.poseLibrary().steps.length===4);
  check('JSON import restores all steps',(await library()).steps.length===4);
  const countBefore=(await library()).steps.length,poseBefore=JSON.stringify(await pose());
  await page.locator('#pose-import-file').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'flare-pose-library',version:1,steps:[{name:'坏数据',pose:{version:1,pelvis:[0,0,0]}}]}))});
  await settle();check('Malformed pose import leaves existing work intact',(await library()).steps.length===countBefore&&JSON.stringify(await pose())===poseBefore);
  await page.locator('#pose-handle-select').selectOption('leftKnee');
  check('Knee supports rotation as well as moving its bending direction',(await status()).editor.canRotate&&await page.locator('[data-pose-transform="rotate"]').isEnabled());
  await page.locator('#pose-fit').click();await page.screenshot({path:path.join(out,'pose-editor-desktop.png'),fullPage:true});
  const savedDraft=JSON.stringify(await pose());await page.reload();await page.waitForFunction(()=>document.documentElement.dataset.ready==='true');await open('library');await page.locator('button[data-mode="pose"]').click();await open('details');
  check('Reload preserves saved steps and the draft',(await library()).steps.length===4&&JSON.stringify(await pose())===savedDraft);
  await page.setViewportSize({width:390,height:844});await settle();await open('details');await page.locator('#pose-fit').click();
  check('Mobile editor layout does not overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('#pose-handle-select').selectOption('rightWrist');check('Mobile editor controls select correctly',(await status()).editor.selected==='rightWrist');
  await page.screenshot({path:path.join(out,'pose-editor-mobile.png'),fullPage:true});
  await open('library');await page.locator('button[data-mode="anatomy"]').click();check('Leaving edit mode removes gizmos',!(await status()).editor.enabled&&(await status()).motion.mode==='standing');
  check('No browser exceptions',errors.length===0,errors);
}catch(error){failure=error.stack;await page.screenshot({path:path.join(out,'pose-editor-failure.png'),fullPage:true}).catch(()=>{});}
finally{await fs.writeFile(path.join(out,'pose-editor-verification.json'),JSON.stringify({passed:checks.filter(c=>c.pass).length,total:checks.length,failure,checks,errors},null,2));await browser.close();}
console.log(JSON.stringify({passed:checks.filter(c=>c.pass).length,total:checks.length,failure,report:path.join(out,'pose-editor-verification.json')},null,2));if(failure)process.exitCode=1;
