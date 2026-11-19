// Headless check of the 托马斯 / 2000 switch in the one editor page.
// Usage: node tools/verify-move-switch.mjs [baseUrl=http://127.0.0.1:8810/]   (npm run build && npm start first)
// Checks: default opens 托马斯 untouched; header switch reloads into 2000 without editing the URL; 2000 plays its
// 39 keyframes; 2000 storage stays under b2000:; 复制分享码 → 粘贴 restores the exact animation; a 2000 code is refused
// in 托马斯 mode; ?move=2000 still works; switching back returns to 托马斯.
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const require=createRequire(import.meta.url);
const playwright=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const root=fileURLToPath(new URL('../',import.meta.url)),out=path.join(root,'output/playwright');
await fs.mkdir(out,{recursive:true});
const base=process.argv[2]||'http://127.0.0.1:8810/',checks=[],errors=[];
const check=(name,pass,detail)=>{checks.push({name,pass:!!pass,...(detail===undefined?{}:{detail})});if(!pass)throw new Error(name+(detail===undefined?'':' '+JSON.stringify(detail).slice(0,400)));};
const canonical=value=>JSON.stringify(value,(_,child)=>child&&typeof child==='object'&&!Array.isArray(child)?Object.fromEntries(Object.keys(child).sort().map(key=>[key,child[key]])):child);
const browser=await playwright.chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
let failure,flareSnapshot;
try{
  const context=await browser.newContext({viewport:{width:1440,height:960},deviceScaleFactor:1});
  await context.grantPermissions(['clipboard-read','clipboard-write'],{origin:new URL(base).origin});
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));page.on('dialog',dialog=>dialog.accept());
  const ready=()=>page.waitForFunction(()=>document.documentElement.dataset.ready==='true',null,{timeout:180000});
  const rawKeys=()=>page.evaluate(()=>{const p=Storage.prototype,len=Object.getOwnPropertyDescriptor(p,'length').get,keys=[];
    // read the real keys even when the 2000 namespace wrapper is installed
    const nativeKey=p.__b2000?null:p.key;const n=len.call(localStorage);
    if(nativeKey)for(let i=0;i<n;i++)keys.push(nativeKey.call(localStorage,i));return {count:n,keys};});
  const toast=()=>page.evaluate(()=>document.querySelector('#toast').hidden?'':document.querySelector('#toast').textContent);
  const click=selector=>page.evaluate(sel=>{const el=document.querySelector(sel);if(!el)throw new Error('missing '+sel);el.click();},selector);
  const openTransition=async()=>{await click('button[data-mode="transition"]');await page.waitForSelector('#transition-json-generate',{state:'attached'});
    await page.evaluate(()=>{document.querySelector('#transition-json-backup').open=true;});};
  const generate=async()=>{await click('#transition-json-generate');await page.waitForTimeout(150);return JSON.parse(await page.inputValue('#transition-json-text'));};
  const paste=async text=>{await page.evaluate(value=>{const area=document.querySelector('#transition-json-text');area.value=value;area.dispatchEvent(new Event('input',{bubbles:true}));},text);await click('#transition-json-import');await page.waitForTimeout(600);};

  // 1) default = 托马斯
  await page.goto(new URL('?inspect=1',base).href);await ready();
  const flare=await page.evaluate(()=>({move:document.documentElement.dataset.move,title:document.title,stage:document.querySelector('#stage-title').textContent,
    pressed:[...document.querySelectorAll('[data-move-switch]')].map(b=>[b.textContent,b.getAttribute('aria-pressed')]),
    kind:window.flareInspector.demonstration().source?.kind,steps:window.flareInspector.demonstration().steps.length,
    presets:document.querySelectorAll('#pose-presets [data-preset]').length,
    hiddenV42:getComputedStyle(document.querySelector('#use-v42-default')).display==='none',phaseCards:document.querySelectorAll('#phase-strip [data-phase]').length}));
  flareSnapshot={demonstration:await page.evaluate(()=>window.flareInspector.demonstration()),presets:await page.evaluate(()=>window.flareInspector.presetLibrary().map(p=>({id:p.id,name:p.name,pose:p.pose})))};
  check('default opens 托马斯',flare.move==='flare'&&!flare.title.includes('2000')&&flare.kind!=='move-2000'&&flare.pressed[0][1]==='true'&&flare.pressed[1][1]==='false',flare);
  check('托马斯 keeps its own controls (v42 button, phase strip)',!flare.hiddenV42&&flare.phaseCards>0,flare);
  const flareKeysBefore=await rawKeys();
  check('托马斯 storage has no b2000 keys before switching',!flareKeysBefore.keys.some(k=>k.startsWith('b2000:')),flareKeysBefore);
  await page.screenshot({path:path.join(out,'move-switch-flare.png')});

  // 2) header switch -> 2000 without touching the URL by hand
  await Promise.all([page.waitForNavigation(),click('[data-move-switch="2000"]')]);await ready();
  const m2000=await page.evaluate(()=>({move:document.documentElement.dataset.move,url:location.search,title:document.title,switchText:[...document.querySelectorAll('[data-move-switch]')].map(b=>b.textContent),
    pressed:document.querySelector('[data-move-switch="2000"]').getAttribute('aria-pressed'),kind:window.flareInspector.demonstration().source?.kind,
    revision:window.flareInspector.demonstration().source?.revision,steps:window.flareInspector.demonstration().steps.length,presets:document.querySelectorAll('#pose-presets [data-preset]').length}));
  check('switch reloads into 2000, URL has no move param',m2000.move==='2000'&&!m2000.url.includes('move=')&&m2000.kind==='move-2000'&&m2000.pressed==='true',m2000);
  check('switch labels stay 托马斯 / 2000 inside 2000 mode',m2000.switchText.join('/')==='托马斯/2000',m2000.switchText);
  check('2000 has 39 keyframes and 39 pose presets',m2000.steps===39&&m2000.presets===39,m2000);
  await click('button[data-mode="motion"]');await page.waitForTimeout(300);
  const t0=await page.evaluate(()=>window.flareInspector.viewer.time);
  await click('#play-button');await page.waitForTimeout(4000);
  const play=await page.evaluate(()=>({time:window.flareInspector.viewer.time,playing:window.flareInspector.viewer.playing,label:document.querySelector('#time-label').textContent}));await click('#play-button');
  check('2000 plays in 动作分解',play.playing&&play.time!==t0&&/4\.8/.test(play.label),{t0,...play});
  const sweep=await page.evaluate(()=>{const v=window.flareInspector.viewer,period=v.motion.getMetrics().period,fails=[];
    for(let t=0;t<=period+1e-6;t+=0.05){try{v.setTime(t);v.motion.getMetrics();}catch(e){fails.push([t.toFixed(2),String(e).slice(0,100)]);}}return {period,fails};});
  check('2000 full timeline solves (39 frames, ~4.8 s)',sweep.fails.length===0&&Math.abs(sweep.period-4.807)<0.01,sweep);
  await page.screenshot({path:path.join(out,'move-switch-2000.png')});
  check('reload keeps 2000 in this tab',await page.reload().then(ready).then(()=>page.evaluate(()=>document.documentElement.dataset.move))==='2000');

  // 3) share code: edit -> 复制分享码 -> fresh 2000 storage -> paste -> same animation
  await openTransition();
  const tools=await page.evaluate(()=>['#transition-export','#transition-import','#transition-json-generate','#transition-share-copy','#transition-json-copy','#transition-save','#transition-left-lock'].map(s=>[s,!!document.querySelector(s)]));
  check('2000 animation tools present (export/import/backup/share/K/hand lock)',tools.every(([,ok])=>ok),tools);
  const original=await generate();
  check('2000 full backup tagged move 2000',original.move==='2000'&&original.sequence.steps.length===39,{move:original.move});
  const edited=structuredClone(original);
  const step=edited.sequence.steps[12];step.pose.pelvis[1]+=0.03;step.pose.limbs.left.wrist[2]-=0.02;
  edited.points=[{id:'k-smoke-a',segment:5,at:0.5,name:'smoke K',pose:structuredClone(edited.sequence.steps[5].pose)},{id:'k-smoke-b',segment:20,at:0.25,pose:structuredClone(edited.sequence.steps[20].pose)}];
  edited.points[0].pose.pelvis[1]+=0.02;edited.points[1].pose.pelvis[0]+=0.01;
  edited.base={period:edited.sequence.period,steps:edited.sequence.steps.map(s=>({id:s.id,pose:s.pose}))};
  await paste(JSON.stringify(edited));
  const afterJson=await generate();
  check('full JSON paste applied (frame 13 + 2 K frames)',afterJson.points.length===2&&Math.abs(afterJson.sequence.steps[12].pose.pelvis[1]-edited.sequence.steps[12].pose.pelvis[1])<1e-9,{points:afterJson.points.length,toast:await toast()});
  await click('#transition-share-copy');await page.waitForTimeout(400);
  const code=await page.inputValue('#transition-json-text');const note=await page.textContent('#transition-json-note');
  const clip=await page.evaluate(()=>navigator.clipboard.readText().catch(()=>''));
  check('复制分享码 gives a short B2K1 code on the clipboard',code.startsWith('B2K1.')&&code.length*10<JSON.stringify(afterJson).length&&(clip===code||note.includes('Ctrl+C')),{code:code.length,json:JSON.stringify(afterJson).length,clip:clip===code});
  await fs.writeFile(path.join(out,'move-switch-code.txt'),code);await fs.writeFile(path.join(out,'move-switch-full.json'),JSON.stringify(afterJson));
  // wipe only the 2000 namespace, reload, paste the code
  await page.evaluate(()=>localStorage.clear());await page.reload();await ready();await openTransition();
  const wiped=await generate();check('2000 storage wiped back to bundled keyframes',wiped.points.length===0);
  await paste(code);
  const restored=await generate();
  const strip=b=>{const c=structuredClone(b);delete c.sequence.source.origin;return c;};
  check('pasting the share code restores the same animation',canonical(strip(restored))===canonical(strip(afterJson)),{toast:await toast(),points:restored.points.length});
  check('restored keeps the move tag',restored.move==='2000');
  const keys2000=await page.evaluate(()=>{const p=Storage.prototype;return Object.getOwnPropertyDescriptor(p,'length').get.call(localStorage);});
  check('2000 stored data under its own namespace',keys2000>0);

  // 4) ?move=2000 compatibility, then back to 托马斯 and refuse the 2000 code there
  await page.goto(new URL('?inspect=1&move=2000',base).href);await ready();
  check('?move=2000 still opens 2000',await page.evaluate(()=>document.documentElement.dataset.move)==='2000');
  await Promise.all([page.waitForNavigation(),click('[data-move-switch="flare"]')]);await ready();
  check('switch back opens 托马斯',await page.evaluate(()=>document.documentElement.dataset.move==='flare'&&!location.search.includes('move=')));
  const flareKeys=await rawKeys();
  check('托马斯 sees b2000 data only under its prefix (isolated)',flareKeys.keys.some(k=>k.startsWith('b2000:'))&&!flareKeys.keys.filter(k=>!k.startsWith('b2000:')).some(k=>!flareKeysBefore.keys.includes(k)),flareKeys);
  const flareAfter={demonstration:await page.evaluate(()=>window.flareInspector.demonstration()),presets:await page.evaluate(()=>window.flareInspector.presetLibrary().map(p=>({id:p.id,name:p.name,pose:p.pose})))};
  check('托马斯 animation and presets unchanged after 2000 work',canonical(flareAfter)===canonical(flareSnapshot));
  await openTransition();
  const flareDocBefore=await page.evaluate(()=>JSON.stringify(window.flareInspector.transitions().document));
  await paste(code);
  const refusal=await toast();
  check('2000 code refused in 托马斯 mode with a hint',refusal.includes('2000')&&refusal.includes('切换'),refusal);
  await paste(JSON.stringify(afterJson));
  const refusal2=await toast();
  check('2000 full JSON refused in 托马斯 mode',refusal2.includes('2000')&&refusal2.includes('切换'),refusal2);
  check('托马斯 animation untouched by refused pastes',await page.evaluate(()=>JSON.stringify(window.flareInspector.transitions().document))===flareDocBefore);
  const flareBackup=await generate();
  check('托马斯 backup has no move field (format unchanged)',!Object.hasOwn(flareBackup,'move'));
  // new tab -> 托马斯 by default even after using 2000
  const fresh=await context.newPage();await fresh.goto(new URL('?inspect=1',base).href);await fresh.waitForFunction(()=>document.documentElement.dataset.ready==='true',null,{timeout:180000});
  check('a new tab opens 托马斯',await fresh.evaluate(()=>document.documentElement.dataset.move)==='flare');await fresh.close();
  check('no page errors',errors.length===0,errors);
}catch(error){failure=error;}
finally{await browser.close();}
const report={pass:!failure,error:failure?.message,checks,errors};
await fs.writeFile(path.join(out,'move-switch.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,1));
if(failure)process.exitCode=1;
