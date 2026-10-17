// Screenshot the real App scene (app/scene, phone 390x844) with the current coach and with
// ?body=training at the same seek times. node tools/flare-body-swap/shoot-app.mjs <url> <outdir> <t,t,...>
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
import {HUB,loadConfig} from './pose-hub.mjs';
import {assertOutsidePoseHub} from '../pose-hub-paths.mjs';
const [url,outDir,ts]=process.argv.slice(2);assertOutsidePoseHub(outDir,HUB);fs.mkdirSync(outDir,{recursive:true});
const {C}=await loadConfig();
if(C.ld_library_path)process.env.LD_LIBRARY_PATH=C.ld_library_path;if(C.playwright_browsers_path)process.env.PLAYWRIGHT_BROWSERS_PATH=C.playwright_browsers_path;
const {chromium}=await import(pathToFileURL(C.playwright_module).href);
const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const report={};
for(const [tag,q] of [['old',''],['new','?body=training']]){
  const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});const errors=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,300))});
  await p.goto(url+q);await p.waitForFunction(()=>window.__flareScene,null,{timeout:170000});
  // Seeking pauses the App, which shows its pause-only muscle callouts; hide them (and the
  // phase card) so the comparison shows the clean playing view of the athlete.
  if(process.env.CLEAN!=='0')await p.addStyleTag({content:'#hotspots{display:none!important}'});
  const stats=await p.evaluate(()=>({geometry:window.__flareScene.geometryStats,surface:window.__flareScene.getActorSurface()}));
  for(const t of ts.split(',').map(Number)){
    await p.evaluate(t=>window.__flareScene.setTime(t),t);await p.waitForTimeout(700);
    await p.screenshot({path:`${outDir}/app-${tag}-${t.toFixed(2)}.png`});
    (report.joints??={})[tag+'@'+t]=await p.evaluate(()=>window.__flareScene.getMetrics().joints);
  }
  report[tag]={errors,stats};await p.close();
}
let jd=0;for(const k of Object.keys(report.joints).filter(k=>k.startsWith('old@'))){const a=report.joints[k],b=report.joints['new@'+k.slice(4)];for(const j of Object.keys(a))for(let i=0;i<3;i++)jd=Math.max(jd,Math.abs(a[j][i]-b[j][i]));}
report.jointParityMaxMm=jd*1000;delete report.joints;
fs.writeFileSync(`${outDir}/app-report.json`,JSON.stringify(report,null,1));console.log(JSON.stringify(report).slice(0,1500));
await b.close();
