import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {applySavedMirrorUpdate,SAVED_RIGHT_MIRROR_BACKUP_KEY} from '../src/saved-mirror-update.js';

const root=fileURLToPath(new URL('../',import.meta.url)),out=path.join(root,'output/saved-right-mirrors');
await fs.mkdir(out,{recursive:true});
const original=JSON.parse(await fs.readFile(path.join(root,'托马斯/13.json'),'utf8'));
const update=JSON.parse(await fs.readFile(path.join(root,'public/coach/saved-right-mirrors-2026-10-05.json'),'utf8'));
const key='flare-pose-library-v1',clone=x=>structuredClone(x),checks=[],errors=[];
const library={...clone(original),draft:clone(original.steps[12].pose),title:'保留中的原草稿',removed:[],draftSourcePreset:null,extra:{keep:'原有自定义字段'}};
const raw='\n  '+JSON.stringify(library,null,3)+'\n',oneLibrary={...clone(library),steps:[clone(original.steps[0])]},oneRaw=JSON.stringify(oneLibrary,null,2);
function check(name,pass,detail){checks.push({name,pass,...(detail===undefined?{}:{detail})});if(!pass)throw Error(name);}
function memory(value,options={}){
 const map=new Map([[key,value]]);if(options.backup!==undefined)map.set(SAVED_RIGHT_MIRROR_BACKUP_KEY,options.backup);
 return {getItem:k=>map.get(k)??null,setItem:(k,v)=>{if(options.failBackup&&k===SAVED_RIGHT_MIRROR_BACKUP_KEY)throw Error('quota');map.set(k,String(v));},map};
}
const valid=memory(raw),first=applySavedMirrorUpdate(valid);
check('Matching thirteen-step library appends exactly three',first.applied&&first.addedCount===3&&first.library.steps.length===16);
check('Original thirteen steps and working draft stay exact',JSON.stringify(first.library.steps.slice(0,13))===JSON.stringify(library.steps)&&JSON.stringify(first.library.draft)===JSON.stringify(library.draft)&&first.library.title===library.title&&JSON.stringify(first.library.extra)===JSON.stringify(library.extra));
check('Independent backup retains every original storage byte',valid.getItem(SAVED_RIGHT_MIRROR_BACKUP_KEY)===raw);
const appendedRaw=valid.getItem(key);check('A repeat application is inert',!applySavedMirrorUpdate(valid).applied&&valid.getItem(key)===appendedRaw);
const deleted=JSON.parse(appendedRaw);deleted.steps.pop();valid.setItem(key,JSON.stringify(deleted));check('Deleting an added step does not trigger re-addition',!applySavedMirrorUpdate(valid).applied&&JSON.parse(valid.getItem(key)).steps.length===15);
const old=memory(oneRaw);check('An unrelated one-step library remains byte-identical',!applySavedMirrorUpdate(old).applied&&old.getItem(key)===oneRaw&&old.getItem(SAVED_RIGHT_MIRROR_BACKUP_KEY)===null);
const changed=clone(library);changed.steps[11].pose.pelvis[0]+=.000000000001;const changedRaw=JSON.stringify(changed),mismatch=memory(changedRaw);check('Even a tiny source-pose edit prevents automatic append',!applySavedMirrorUpdate(mismatch).applied&&mismatch.getItem(key)===changedRaw);
const blocked=memory(raw,{failBackup:true});check('A failed backup prevents the library write',!applySavedMirrorUpdate(blocked).applied&&blocked.getItem(key)===raw);
const priorBackup=memory(raw,{backup:'existing backup bytes'});check('An existing backup is never overwritten',applySavedMirrorUpdate(priorBackup).applied&&priorBackup.getItem(SAVED_RIGHT_MIRROR_BACKUP_KEY)==='existing backup bytes');

const require=createRequire(import.meta.url),{chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const base='http://127.0.0.1:8810/?inspect=1',origin=new URL(base).origin;
let browser,activePage,failure;
async function pageFor(seed){
 const c=await browser.newContext({viewport:{width:1440,height:1100}});
 await c.addInitScript(({origin,key,raw})=>{if(location.origin===origin&&!localStorage.getItem(key))localStorage.setItem(key,raw);},{origin,key,raw:seed});
 const p=await c.newPage();activePage=p;p.on('pageerror',e=>errors.push(e.message));await p.goto(base);await p.waitForFunction(()=>document.documentElement.dataset.ready==='true');return p;
}
const stored=p=>p.evaluate(key=>localStorage.getItem(key),key);
async function enter(p){if(await p.locator('#toggle-library').getAttribute('aria-expanded')!=='true')await p.locator('#toggle-library').click();await p.locator('button[data-mode="pose"]').click();await p.waitForTimeout(100);}
try{
 browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
 const p=await pageFor(raw),applied=JSON.parse(await stored(p));
 check('Built page appends sixteen personal steps',applied.steps.length===16);
 check('Built page retains complete original thirteen steps',JSON.stringify(applied.steps.slice(0,13))===JSON.stringify(original.steps));
 check('Built page adds the exact mirrored steps',JSON.stringify(applied.steps.slice(13))===JSON.stringify(update.steps));
 check('Built page preserves draft, title and other fields',JSON.stringify(applied.draft)===JSON.stringify(library.draft)&&applied.title===library.title&&JSON.stringify(applied.extra)===JSON.stringify(library.extra));
 check('Built page writes exact raw backup separately',await p.evaluate(k=>localStorage.getItem(k),SAVED_RIGHT_MIRROR_BACKUP_KEY)===raw);
 check('Update marker is recorded once',applied.projectMirrorUpdates.filter(id=>id===update.id).length===1);
 await enter(p);
 check('Editor entry preserves the appended library and original draft bytes',await stored(p)===JSON.stringify(applied));
 check('Editor shows all sixteen personal buttons',await p.locator('[data-pose-load]').count()===16);
 check('Editor reports the three-step append once',/已自动补齐\s*3.*原来的\s*13/.test(await p.locator('#toast').textContent()));
 await p.locator('#pose-shelf').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(out,'16-steps.png'),fullPage:false});
 await p.reload();await p.waitForFunction(()=>document.documentElement.dataset.ready==='true');await enter(p);
 check('Reload neither duplicates nor rewrites appended steps',await stored(p)===JSON.stringify(applied)&&await p.locator('[data-pose-load]').count()===16);
 check('Reload preserves the same original raw backup',await p.evaluate(k=>localStorage.getItem(k),SAVED_RIGHT_MIRROR_BACKUP_KEY)===raw);
 check('Reload does not repeat the automatic-append notice',!(await p.locator('#toast').textContent()).includes('已自动补齐'));
 const one=await pageFor(oneRaw);await enter(one);
 check('Built page leaves an existing one-step library untouched',await stored(one)===oneRaw&&await one.locator('[data-pose-load]').count()===1);
 check('One-step context receives no mirror backup or update marker',await one.evaluate(k=>localStorage.getItem(k),SAVED_RIGHT_MIRROR_BACKUP_KEY)===null&&!JSON.parse(await stored(one)).projectMirrorUpdates);
 check('No browser page errors',errors.length===0,errors);
}catch(e){failure=e.stack;await activePage?.screenshot({path:path.join(out,'failure.png')}).catch(()=>{});}
finally{
 const report={pass:!failure,passed:checks.filter(c=>c.pass).length,total:checks.length,failure,errors,checks,scope:'Targeted updater and built-page checks in two isolated contexts; no human tab or storage touched; no full suite.',screenshot:path.join(out,'16-steps.png')};
 await fs.writeFile(path.join(out,'verification.json'),JSON.stringify(report,null,2));await browser?.close();console.log(JSON.stringify({pass:report.pass,passed:report.passed,total:report.total,failure,report:path.join(out,'verification.json'),screenshot:report.screenshot},null,2));if(failure)process.exitCode=1;
}
