import {fileURLToPath, pathToFileURL} from 'node:url';
import {dirname, resolve} from 'node:path';
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
import {execFileSync} from 'child_process';
const cache=new Map();
async function viaCurl(route){const url=route.request().url().split('#')[0];
 if(!cache.has(url)){const bodyPath=resolve(outDir,'curl-body.bin');const hdr=execFileSync('curl',['-s','-D','-','-o',bodyPath,'-A','Mozilla/5.0 QA',url]).toString();const body=require_fs.readFileSync(bodyPath);
  const lines=hdr.trim().split(/\r?\n/);const status=+lines[0].split(' ')[1];const headers={};for(const l of lines.slice(1)){const i=l.indexOf(':');if(i>0)headers[l.slice(0,i).toLowerCase()]=l.slice(i+1).trim();}
  delete headers['content-encoding'];delete headers['content-length'];delete headers['transfer-encoding'];cache.set(url,{status,headers,body});}
 const r=cache.get(url);await route.fulfill({status:r.status,headers:r.headers,body:r.body});}
import * as require_fs from 'fs';
const BASE=process.env.BASE||'http://127.0.0.1:8851/';
const outDir=resolve(dirname(fileURLToPath(import.meta.url)),'../output/webapp-qa');
require_fs.mkdirSync(outDir,{recursive:true});
const tag=process.env.TAG||'local';if(!/^[a-zA-Z0-9_-]+$/.test(tag))throw new Error('Invalid QA TAG');
const O=resolve(outDir,tag+'-');
const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];
async function mk(w,h,opts={}){const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:1,...opts});if(BASE.startsWith('https'))await p.route(BASE+'**',viaCurl);p.on('pageerror',e=>errs.push(w+' PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push(w+' '+m.text())});return p;}
const which=(process.env.ONLY||'desk,big,mob').split(',');
if(which.includes('desk')){
const p=await mk(1440,900);
await p.goto(BASE);await p.waitForTimeout(1500);
await p.screenshot({path:O+'1440-welcome.jpg',quality:85});
await p.click('#wgo');await p.waitForTimeout(500);await p.screenshot({path:O+'1440-safety.jpg',quality:85});
await p.click('#sg');
await p.waitForFunction(()=>document.documentElement.dataset.ready==='true',null,{timeout:90000});
await p.waitForTimeout(2500);
await p.screenshot({path:O+'1440-watch.jpg',quality:85});
await p.keyboard.press('Space');await p.keyboard.press('ArrowRight');await p.keyboard.press('ArrowRight');await p.waitForTimeout(1200);
console.log('state',JSON.stringify(await p.evaluate(()=>__stage.state())));
// click on body center
const box=await p.locator('#stage').boundingBox();
let picked=null;
for(const [fx,fy] of [[.5,.5],[.48,.55],[.52,.45],[.5,.6],[.45,.5],[.55,.5]]){await p.mouse.click(box.x+box.width*fx,box.y+box.height*fy);await p.waitForTimeout(300);picked=await p.evaluate(()=>__app.ui.group);if(picked)break;}
console.log('picked from 3D:',picked);
if(!picked){await p.click('#wInsp .mrow');}
await p.waitForTimeout(1500);
await p.screenshot({path:O+'1440-watch-muscle.jpg',quality:85});
await p.keyboard.press('Escape');
await p.goto(BASE+'#/muscles');await p.waitForTimeout(500);
await p.waitForFunction(()=>document.querySelector('#mbig').classList.contains('ready'),null,{timeout:90000});
await p.waitForTimeout(1200);
const mb=await p.locator('#bigStage').boundingBox();
await p.mouse.click(mb.x+mb.width*0.5,mb.y+mb.height*0.42);await p.waitForTimeout(800);
console.log('mannequin pick:',await p.evaluate(()=>__app.ui.mGroup));
if(!await p.evaluate(()=>__app.ui.mGroup)) await p.click('#glist [data-mg=deltoids]');
await p.waitForTimeout(1200);
await p.screenshot({path:O+'1440-muscles.jpg',quality:85});
await p.goto(BASE+'#/library');await p.waitForTimeout(1200);
await p.screenshot({path:O+'1440-library.jpg',quality:85});
await p.click('.dcard >> nth=4');await p.waitForTimeout(800);
await p.screenshot({path:O+'1440-drawer.jpg',quality:85});
await p.click('#drawer [data-today]');await p.waitForTimeout(300);
await p.click('#drawer [data-start]');await p.waitForTimeout(500);
await p.screenshot({path:O+'1440-timer-ready.jpg',quality:85});
await p.click('[data-ta=start]');await p.waitForTimeout(4600);
await p.screenshot({path:O+'1440-timer-work.jpg',quality:85});
console.log('timer',JSON.stringify(await p.evaluate(()=>document.querySelector('#tval').textContent+' '+document.querySelector('.ringwrap .st').textContent)));
// finish quickly via timer API-equivalent buttons
for(let i=0;i<90;i++){const s=await p.evaluate(()=>{const b=document.querySelector('[data-ta=set],[data-ta=skip],[data-ta=start]');if(b){b.click();return b.dataset.ta}return null});await p.waitForTimeout(400);const f=await p.evaluate(()=>document.querySelector('.ringwrap .st')?.textContent);if(f&&f.includes('完成'))break;}
await p.waitForTimeout(300);
await p.screenshot({path:O+'1440-timer-done.jpg',quality:85});
await p.evaluate(()=>document.querySelector('[data-ta=end]').click());await p.waitForTimeout(300);
await p.goto(BASE+'#/today');await p.waitForTimeout(800);await p.screenshot({path:O+'1440-today.jpg',quality:85});
await p.goto(BASE+'#/path');await p.waitForTimeout(800);
await p.click('[data-lesson] >> nth=0');await p.click('.gate >> nth=0');await p.waitForTimeout(300);
await p.screenshot({path:O+'1440-path.jpg',quality:85});
await p.reload();await p.waitForTimeout(1500);
console.log('persist after reload',JSON.stringify(await p.evaluate(()=>({s:__store.s.sessions.length,today:__store.todayIds,lessons:__store.s.completedLessonIds,gates:__store.s.gateReports,safety:__store.s.safetyAccepted}))));
await p.goto(BASE+'#/progress');await p.waitForTimeout(800);await p.screenshot({path:O+'1440-progress.jpg',quality:85});
await p.goto(BASE+'#/settings');await p.waitForTimeout(800);await p.screenshot({path:O+'1440-settings.jpg',quality:85});
await p.keyboard.press('?');await p.waitForTimeout(400);await p.screenshot({path:O+'1440-keys.jpg',quality:85});
await p.close();}
if(which.includes('big')){
const p=await mk(1920,1080);
await p.goto(BASE);await p.evaluate(()=>{__store.acceptSafety()});await p.reload();
await p.waitForFunction(()=>document.documentElement.dataset.ready==='true',null,{timeout:90000});await p.waitForTimeout(2500);
await p.screenshot({path:O+'1920-watch.jpg',quality:85});
await p.goto(BASE+'#/library');await p.waitForTimeout(1200);await p.screenshot({path:O+'1920-library.jpg',quality:85});
await p.goto(BASE+'#/muscles');await p.waitForFunction(()=>document.querySelector('#mbig').classList.contains('ready'),null,{timeout:90000});await p.click('#glist [data-mg=obliques]');await p.waitForTimeout(1500);await p.screenshot({path:O+'1920-muscles.jpg',quality:85});
await p.close();}
if(which.includes('mob')){
const p=await mk(390,844,{deviceScaleFactor:2,hasTouch:true,isMobile:true});
await p.goto(BASE);await p.waitForTimeout(1200);await p.screenshot({path:O+'390-welcome.jpg',quality:80});
await p.evaluate(()=>{__store.acceptSafety();__app.closeModal()});
await p.waitForFunction(()=>document.documentElement.dataset.ready==='true',null,{timeout:90000});await p.waitForTimeout(2500);
await p.screenshot({path:O+'390-watch.jpg',quality:80});
await p.evaluate(()=>document.querySelector('#v-watch').scrollTo(0,600));await p.waitForTimeout(300);await p.screenshot({path:O+'390-watch-insp.jpg',quality:80});
await p.goto(BASE+'#/library');await p.waitForTimeout(1200);await p.screenshot({path:O+'390-library.jpg',quality:80});
await p.click('.dcard >> nth=0');await p.waitForTimeout(700);await p.screenshot({path:O+'390-drawer.jpg',quality:80});
await p.click('#drawer [data-start]');await p.waitForTimeout(500);await p.screenshot({path:O+'390-timer.jpg',quality:80});
await p.evaluate(()=>document.querySelector('[data-ta=end]').click());
await p.goto(BASE+'#/path');await p.waitForTimeout(800);await p.screenshot({path:O+'390-path.jpg',quality:80});
await p.goto(BASE+'#/progress');await p.waitForTimeout(800);await p.screenshot({path:O+'390-progress.jpg',quality:80});
await p.close();}
console.log(errs.join('\n')||'no errors');
await b.close();
