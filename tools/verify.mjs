import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require=createRequire(import.meta.url);
let playwright;
const candidates=[process.env.FLARE_PLAYWRIGHT_MODULE,'playwright',path.join(process.env.USERPROFILE||'','.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')].filter(Boolean);
for(const candidate of candidates){try{playwright=require(candidate);break;}catch{}}
if(!playwright)throw new Error('Playwright is needed only for verification. Install it or set FLARE_PLAYWRIGHT_MODULE.');
const root=fileURLToPath(new URL('../',import.meta.url));
const output=path.join(root,'output/playwright');await fs.mkdir(output,{recursive:true});
const base=process.argv[2]||'http://127.0.0.1:8810/';
const origin=new URL(base).origin;
const checks=[],errors=[],external=[];
const check=(name,value,detail)=>{checks.push({name,pass:!!value,...(detail===undefined?{}:{detail})});if(!value)throw new Error(name);};
const browser=await playwright.chromium.launch({channel:process.env.FLARE_BROWSER_CHANNEL||'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1440,height:1020},deviceScaleFactor:1,acceptDownloads:true});
const page=await context.newPage();
page.on('pageerror',error=>errors.push(error.message));
page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
await page.route('**/*',route=>{const url=route.request().url();if(url.startsWith('http')&&new URL(url).origin!==origin){external.push(url);return route.abort();}return route.continue();});
const status=()=>page.evaluate(()=>window.flareInspector.status());
const settle=()=>page.waitForTimeout(220);
const open=async side=>{const button=page.locator(side==='library'?'#toggle-library':'#toggle-details');if(await button.getAttribute('aria-expanded')!=='true')await button.click();};
const pickMode=async mode=>{await open('library');await page.locator(`button[data-mode="${mode}"]`).click();};
let failure;
try{
  await page.goto(new URL('?inspect=1',base).href);await page.waitForFunction(()=>document.documentElement.dataset.ready==='true',{},{timeout:30000});
  let state=await status();
  check('Real anatomy loads',state.ready&&state.parts===637&&state.triangles===932140);
  check('Formal nine-step demonstration opens paused',state.mode==='motion'&&!state.playing&&!state.editor.enabled&&state.motion.demonstration.count===9);
  await pickMode('anatomy');await settle();state=await status();
  check('Complete friendly Snow character is available',state.character==='Snow Rig'&&state.coachVisible&&!state.anatomyVisible&&state.layer==='skin');
  check('All eight functional groups have real meshes',Object.values(state.groupCounts).length===8&&Object.values(state.groupCounts).every(n=>n>0),state.groupCounts);
  check('Character uses a bounded number of draw calls',state.drawCalls<40,state.drawCalls);
  check('Desktop has no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const projection=await page.evaluate(()=>window.flareInspector.projectCoach());
  check('Standing coach fits desktop canvas',projection.min.every(v=>v>-1)&&projection.max.every(v=>v<1),projection);
  check('Standing shoes stay above ground',projection.bounds[0][1]>=-.003,projection.bounds[0][1]);
  await page.screenshot({path:path.join(output,'friendly-coach-desktop.png'),fullPage:true});
  for(const id of ['scapular','arms','chest','core','hipFlexors','glutes','adductors','shoulders']){await page.locator(`[data-group="${id}"]`).click();check(`Select ${id}`,(await status()).selectedGroup===id);}
  state=await status();check('Muscle selection shows only the local reference',state.layer==='reveal'&&state.focused&&state.anatomyVisible&&!state.coachVisible);
  await page.locator('[data-group="hipFlexors"]').click();check('Deep hip muscles can be isolated',(await status()).focused);
  await settle();await page.screenshot({path:path.join(output,'deep-hip-flexors.png'),fullPage:true});
  await page.locator('[data-layer="skin"]').click();check('Return to complete friendly character',(await status()).coachVisible&&!(await status()).anatomyVisible);
  await page.locator('[data-view="back"]').click();check('Back view',(await status()).camera[2]<0);
  await settle();await page.screenshot({path:path.join(output,'anatomy-back.png'),fullPage:true});
  await page.locator('[data-view="side"]').click();check('Side view',Math.abs((await status()).camera[0])>1);
  await page.locator('#reset-view').click();await settle();
  const cameraBefore=(await status()).camera;
  const box=await page.locator('#scene').boundingBox();
  await page.mouse.move(box.x+box.width*.50,box.y+box.height*.54);await page.mouse.down();await page.mouse.move(box.x+box.width*.63,box.y+box.height*.49,{steps:8});await page.mouse.up();await settle();
  check('Orbit drag changes camera',(await status()).camera.some((x,i)=>Math.abs(x-cameraBefore[i])>.02));
  await page.mouse.wheel(0,-160);await settle();check('Zoom changes camera',(await status()).camera.some((x,i)=>Math.abs(x-cameraBefore[i])>.1));
  await page.locator('#reset-view').click();await settle();
  await page.locator('#muscle-search').fill('deltoid');check('Search finds original anatomy structures',await page.locator('.source-search-item').count()>0);
  await page.locator('.source-search-item').first().click();check('Original structure selection',(await status()).selectedPart!==null);
  await page.locator('#muscle-search').fill('no_such_anatomy');check('Empty search feedback',await page.locator('.search-empty').isVisible());await page.locator('#muscle-search').fill('');
  await page.locator('[data-group="shoulders"]').click();
  const projected=await page.evaluate(()=>window.flareInspector.projectPart('FJ1467M'));
  if(projected){const rect=await page.locator('#scene').boundingBox();await page.mouse.click(rect.x+projected.x,rect.y+projected.y);check('Picking actual mesh selects a structure',(await status()).selectedPart!==null);}
  await page.locator('[data-group="core"]').click();check('Missing structures are disclosed',(await page.locator('#detail-panel').innerText()).includes('腹横肌'));
  await page.locator('[data-group="shoulders"]').click();
  await pickMode('motion');state=await status();
  check('Motion uses the same friendly Snow character',state.character==='Snow Rig'&&state.coachVisible&&!state.anatomyVisible&&state.motion.skinning.bones===20,state.motion.source);
  const keyframes=[{time:0,hands:2},{time:2,hands:1},{time:4,hands:2},{time:6,hands:1}];
  for(let i=0;i<keyframes.length;i++){
    await page.locator(`[data-phase="${i}"]`).click();await settle();const s=await status();check(`Phase ${i+1} time`,Math.abs(s.time-keyframes[i].time)<.02);check(`Phase ${i+1} support`,s.motion.supportHands.length===keyframes[i].hands,s.motion.supportHands);
    if(i===0)check('Front support chest faces down',s.motion.chestForward[1]<-.4);
    if(i===2)check('Rear support chest faces up',s.motion.chestForward[1]>.4);
    await page.screenshot({path:path.join(output,`flare-phase-${i+1}.png`),fullPage:true});
    const projection=await page.evaluate(()=>window.flareInspector.projectCoach());
    check(`Phase ${i+1} complete character fits`,projection.min.every(v=>v>-1)&&projection.max.every(v=>v<1),projection);
    check(`Phase ${i+1} real shoes stay above ground`,projection.bounds[0][1]>=-.003,projection.bounds[0][1]);
  }
  const samples=await page.evaluate(()=>{const results=[];for(let i=0;i<=90;i++){window.flareInspector.setTime(i/10);const m=window.flareInspector.rigMetrics();results.push({t:i/10,minFootHeight:m.minFootHeight,supportDrift:m.supportDrift,segmentLengths:m.segmentLengths,expectedLengths:m.expectedLengths});}return results;});
  check('Feet stay above ground throughout cycle',samples.every(s=>s.minFootHeight>=-.002),Math.min(...samples.map(s=>s.minFootHeight)));
  const maximumDrift=Math.max(...samples.flatMap(s=>Object.values(s.supportDrift).filter(v=>v!==null)));
  check('Support palms remain fixed throughout cycle',maximumDrift<.0001,maximumDrift);
  const maximumLengthError=Math.max(...samples.flatMap(s=>Object.entries(s.segmentLengths).map(([id,length])=>{const type=id==='torso'?'torso':id.toLowerCase().includes('upperarm')?'upperArm':id.toLowerCase().includes('forearm')?'forearm':id.toLowerCase().includes('thigh')?'thigh':id.toLowerCase().includes('shin')?'shin':null;const expected=typeof s.expectedLengths[id]==='number'?s.expectedLengths[id]:type?s.expectedLengths[type]:length;return typeof expected==='number'?Math.abs(length-expected):0;})));
  check('Source body segment lengths stay fixed',maximumLengthError<.0001,maximumLengthError);
  await page.locator('[data-phase="0"]').click();await page.locator('#play-button').click();await page.waitForTimeout(350);state=await status();check('Playback advances',state.playing&&state.time>.02);
  await page.locator('#play-button').click();const paused=(await status()).time;await page.waitForTimeout(250);check('Pause holds frame',Math.abs((await status()).time-paused)<.02);
  await page.locator('#speed').selectOption('0.25');await page.locator('#timeline').fill('4');check('Timeline seeks frame',Math.abs((await status()).time-4)<.02);
  await pickMode('training');check('Eight training cards',await page.locator('.training-card').count()===8);
  for(const id of ['wristLoad','scapPush','supportShift','rearSupport','trunkControl','compression','hipControl','flareSegments']){await page.locator(`[data-training="${id}"]`).click();check(`Training guide ${id}`,await page.locator('.training-detail-steps li').count()===3);}
  await page.locator('[data-training="compression"]').click();await settle();await page.screenshot({path:path.join(output,'training.png'),fullPage:true});
  await page.locator('#about-button').click();check('Model attribution is visible',await page.locator('#about-dialog').isVisible()&&(await page.locator('#about-dialog').innerText()).includes('CC BY 4.0'));await page.keyboard.press('Escape');check('Source dialog closes',!await page.locator('#about-dialog').isVisible());
  for(const url of ['/coach/ATTRIBUTION.md','/coach/coach-rig.json','/coach/flare-coach.glb','/anatomy/ATTRIBUTION.md','/research.md','/favicon.svg'])check(`Local source link ${url}`,(await context.request.get(new URL(url,base).href)).ok());
  await pickMode('anatomy');await page.locator('[data-group="shoulders"]').click();
  const downloaded=page.waitForEvent('download');await page.locator('#capture-button').click();const download=await downloaded;const downloadPath=path.join(output,'exported-view.png');await download.saveAs(downloadPath);const png=await fs.readFile(downloadPath);check('View exports a valid PNG',png.length>20000&&png.subarray(1,4).toString()==='PNG');
  for(const size of [{width:390,height:844},{width:320,height:568},{width:844,height:390}]){
    await page.setViewportSize(size);await settle();check(`Layout ${size.width}x${size.height}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await open('details');await page.locator('[data-layer="skin"]').click();await page.locator('[data-close-drawer="details"]').click();await settle();
    let projection=await page.evaluate(()=>window.flareInspector.projectCoach());check(`Full friendly character fits ${size.width}`,projection.min.every(v=>v>-1)&&projection.max.every(v=>v<1),projection);await page.screenshot({path:path.join(output,`standing-${size.width}.png`),fullPage:false});
    await pickMode('motion');await page.locator('[data-phase="1"]').click();check(`Mobile interaction ${size.width}`,Math.abs((await status()).time-2)<.02);await page.locator('[data-close-drawer="library"]').click();await settle();
    projection=await page.evaluate(()=>window.flareInspector.projectCoach());check(`Full Flare character fits ${size.width}`,projection.min.every(v=>v>-1)&&projection.max.every(v=>v<1),projection);await page.screenshot({path:path.join(output,`mobile-${size.width}.png`),fullPage:false});await pickMode('anatomy');
  }
  await page.setViewportSize({width:1440,height:1020});await open('details');await page.locator('[data-layer="skin"]').click();await settle();await page.screenshot({path:path.join(output,'final-desktop.png'),fullPage:false});
  check('No external requests needed',external.length===0,external);
  check('No browser errors',errors.length===0,errors);
  const production=await context.newPage();await production.goto(base);await production.waitForFunction(()=>document.documentElement.dataset.ready==='true',{},{timeout:30000});check('Production does not expose diagnostic object',await production.evaluate(()=>typeof window.flareInspector==='undefined'));await production.close();
}catch(error){failure=error.message;await page.screenshot({path:path.join(output,'failure.png'),fullPage:true}).catch(()=>{});}
finally{await fs.writeFile(path.join(output,'verification.json'),JSON.stringify({date:new Date().toISOString(),passed:checks.filter(c=>c.pass).length,total:checks.length,failure,checks,errors,external},null,2));await browser.close();}
console.log(JSON.stringify({passed:checks.filter(c=>c.pass).length,total:checks.length,failure,report:path.join(output,'verification.json')},null,2));if(failure)process.exitCode=1;
