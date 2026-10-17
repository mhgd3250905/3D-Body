// Separate CPU-only full-cycle framing repair. Frozen production inputs stay read-only.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {poseHubPaths,assertOutsidePoseHub} from './tools/pose-hub-paths.mjs';
const HUB=poseHubPaths();
const ROOT=path.dirname(fileURLToPath(import.meta.url));
const arg=(name,fallback)=>{const i=process.argv.indexOf(name);return i<0?fallback:process.argv[i+1]};
// Resolve existing symlinks/junctions before any output write. New leaves inherit
// the physical identity of their nearest existing parent directory.
function physical(p){const abs=path.resolve(p);return fs.existsSync(abs)?fs.realpathSync.native(abs):path.join(physical(path.dirname(abs)),path.basename(abs));}
const source=physical(arg('--source',ROOT+'/output/training-human-v2-library-final-20261013'));
const out=physical(arg('--out',ROOT+'/output/training-human-v2-library-framing-20261013'));
const PY=arg('--python','E:/AII-3D/3D-Pose/hark-4080-venv/Scripts/python.exe');
const ids=arg('--ids','t-tuck-planche,t-lsit-vsit-circles').split(',');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const hash=p=>sha(fs.readFileSync(p));
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n')};
const pathKey=p=>process.platform==='win32'?p.toLowerCase():p;
assert(pathKey(out)!==pathKey(source)&&!pathKey(out).startsWith(pathKey(source+path.sep)),'Derived output must be outside production');
assert(ids.every(id=>/^[a-z0-9-]+$/.test(id)),'Invalid id');
assertOutsidePoseHub(out,HUB);
const plan=read(source+'/plan.json'),comp=path.join(HUB.drillAnim,'lib/comp.py');
const protectedPaths=['drill-anim/batch-rerender.mjs','drill-anim/lib/comp.py','drill-anim/models/training-human-v2.json','drill-anim/batches/training-human-v2-20261013/job-catalog.json'];
const frozen=()=>Object.fromEntries(protectedPaths.map(n=>[n,hash(path.join(HUB.root,n))]));
const frozenBefore=frozen();
function child(exe,args,log){return new Promise((resolve,reject)=>{
 const stream=fs.createWriteStream(log,{flags:'a'}),p=spawn(exe,args,{cwd:ROOT,env:{...process.env,PYTHONUTF8:'1',OPENBLAS_NUM_THREADS:'1',OMP_NUM_THREADS:'1',MKL_NUM_THREADS:'1'},windowsHide:true});
 p.stdout.pipe(stream,{end:false});p.stderr.pipe(stream,{end:false});p.on('error',reject);
 p.on('close',code=>{stream.end();code===0?resolve():reject(Error(`${path.basename(exe)} exited${code}; ${log}`))});
})}
function probe(file,n,size,duration){
 const p=spawnSync('ffprobe',['-v','error','-count_frames','-select_streams','v:0','-show_entries','stream=codec_name,width,height,pix_fmt,nb_read_frames,avg_frame_rate,r_frame_rate,duration:format=duration','-of','json',file],{encoding:'utf8',windowsHide:true});
 assert.equal(p.status,0,p.stderr);const j=JSON.parse(p.stdout),s=j.streams[0];
 assert.equal(s.codec_name,'h264');assert.equal(s.pix_fmt,'yuv420p');assert.equal(s.width,size);assert.equal(s.height,size);assert.equal(Number(s.nb_read_frames),n);assert.equal(s.avg_frame_rate,'30/1');assert(Math.abs(Number(s.duration??j.format.duration)-duration)<1e-4);
 const bytes=fs.readFileSync(file);let cursor=0,moov=-1,mdat=-1;
 while(cursor+8<=bytes.length){let len=bytes.readUInt32BE(cursor),type=bytes.toString('ascii',cursor+4,cursor+8);if(len===1)len=Number(bytes.readBigUInt64BE(cursor+8));if(len===0)len=bytes.length-cursor;if(type==='moov')moov=cursor;if(type==='mdat')mdat=cursor;if(len<8)break;cursor+=len;}
 assert(moov>=0&&mdat>=0&&moov<mdat,'MP4 faststart missing');
 return {...s,duration:Number(s.duration??j.format.duration),frames:n,fps:30,sha256:sha(bytes),bytes:bytes.length,faststart:true};
}
fs.mkdirSync(out,{recursive:true});
const manifest={schemaVersion:1,kind:'constant_full_cycle_reframe',sourceLibraryRoot:source.replaceAll('\\','/'),sourceModel:{id:plan.model.id,version:plan.model.version},sourceRecipe:plan.recipe,poseHub:{checkout:HUB.root.replaceAll('\\','/'),readOnlyInputsSha256:frozenBefore},createdAt:new Date().toISOString(),overrides:{}};
if(fs.existsSync(out+'/delivery-manifest.json')){
 const old=read(out+'/delivery-manifest.json');assert.equal(old.sourceLibraryRoot,manifest.sourceLibraryRoot);manifest.overrides=old.overrides;manifest.createdAt=old.createdAt;
}
for(const id of ids){
 const job=source+'/jobs/'+id,dest=out+'/jobs/'+id,input=read(job+'/input.json'),result=read(job+'/result.json'),spec=read(job+'/spec.json');
 assert.equal(result.frames,Math.round(spec.timeline.duration*30));assert(result.decodeVerified,'Source production job must be complete');
 const evidenceNames=['input.json','result.json','qa.json','baseline-qa.json','motion-invariance.json','frames/met-cycle.json','reference/met-cycle.json','spec-original.json','spec.json','theme.json','source.json','renderer.json','composite/place.json'];
 const evidence=()=>Object.fromEntries(evidenceNames.map(n=>[n,hash(job+'/'+n)]));const before=evidence();
 if(manifest.overrides[id]){
  const old=manifest.overrides[id];assert.deepEqual(old.sourceEvidenceSha256,before);assert.equal(hash(out+'/'+old.framingProof.path),old.framingProof.sha256,'Repair proof missing or changed');
  await child(PY,['-X','utf8',ROOT+'/reframe-cycle.py','verify','--out',dest],dest+'/resume-validation.log');assert.equal(hash(out+'/'+old.framingProof.path),old.framingProof.sha256,'Repair proof changed on replay');
  for(const k of ['master','mobile']){const file=out+'/'+old.media[k].path;assert.equal(hash(file),old.media[k].sha256);probe(file,result.frames,k==='master'?1080:720,result.duration);await child('ffmpeg',['-v','error','-xerror','-threads','1','-i',file,'-f','null','-'],dest+'/resume-validation.log');}
  assert.equal(hash(out+'/'+old.poster.path),old.poster.sha256);await child(PY,['-X','utf8','-c',"from PIL import Image;import sys;im=Image.open(sys.argv[1]);im.load();assert im.format=='JPEG' and im.size==(540,540)",out+'/'+old.poster.path],dest+'/resume-validation.log');
  assert.deepEqual(evidence(),before);console.log('Strictly verified existing repair '+id);continue;
 }
 fs.mkdirSync(dest,{recursive:true});const log=dest+'/reframe.log';
 write(dest+'/source-evidence.json',{sourceLibraryRoot:manifest.sourceLibraryRoot,id,sourceFingerprint:input.fingerprint,sourceEvidenceSha256:before,model:plan.model,recipe:plan.recipe,originalQaPath:job+'/qa.json',motionProofPath:job+'/motion-invariance.json',originalResultPath:job+'/result.json'});
 console.log('Scan original full raw cycle '+id);
 await child(PY,['-X','utf8',ROOT+'/reframe-cycle.py','scan','--source',job,'--out',dest],log);
 const count=result.frames,mid=Math.ceil(count/2);
 console.log('Composite '+id+' using2 CPU workers; no renderer');
 await child(PY,['-X','utf8',comp,job+'/frames',job+'/spec.json',job+'/theme.json',dest+'/composite','still'],log);
 await Promise.all([[0,mid],[mid,count]].map(([a,b],k)=>child(PY,['-X','utf8',comp,job+'/frames',job+'/spec.json',job+'/theme.json',dest+'/composite',`${a}:${b}`],dest+`/comp-${k}.log`)));
 await child(PY,['-X','utf8',ROOT+'/reframe-cycle.py','verify','--out',dest],log);
 const proof=read(dest+'/framing-proof.json');assert(proof.summary.fitAllFrames&&proof.summary.edgeTouchFrames===0);
 const media={};
 for(const [kind,size,crf]of[['master',1080,18],['mobile',720,20]]){
  const file=out+`/media/${kind}/${id}.mp4`;fs.mkdirSync(path.dirname(file),{recursive:true});
  await child('ffmpeg',['-y','-v','error','-framerate','30','-i',dest+'/composite/%04d.png','-frames:v',String(count),...(size===720?['-vf','scale=720:720:flags=lanczos']:[]),'-c:v','libx264','-threads','2','-preset','medium','-crf',String(crf),'-pix_fmt','yuv420p','-movflags','+faststart',file],log);
  media[kind]={...probe(file,count,size,result.duration),path:path.relative(out,file).replaceAll('\\','/'),crf};
  await child('ffmpeg',['-v','error','-xerror','-threads','1','-i',file,'-f','null','-'],log);media[kind].decodeVerified=true;
 }
 const posterFile=out+`/media/posters/${id}.jpg`,posterFrame=Math.round(result.posterTime*30);fs.mkdirSync(path.dirname(posterFile),{recursive:true});
 await child(PY,['-X','utf8','-c',"from PIL import Image;import sys;Image.open(sys.argv[1]).convert('RGB').resize((540,540),Image.Resampling.LANCZOS).save(sys.argv[2],quality=92)",dest+`/composite/${String(posterFrame).padStart(4,'0')}.png`,posterFile],log);
 await child(PY,['-X','utf8','-c',"from PIL import Image;import sys;im=Image.open(sys.argv[1]);im.load();assert im.format=='JPEG' and im.size==(540,540)",posterFile],log);
 assert.deepEqual(evidence(),before,'Source production evidence changed');assert.deepEqual(frozen(),frozenBefore,'Frozen production input changed');
 const relProof=path.relative(out,dest+'/framing-proof.json').replaceAll('\\','/');
 manifest.overrides[id]={sourceFingerprint:input.fingerprint,modelId:plan.model.id,modelVersion:plan.model.version,sourceEvidenceSha256:before,media,poster:{path:path.relative(out,posterFile).replaceAll('\\','/'),sha256:hash(posterFile),bytes:fs.statSync(posterFile).size,width:540,height:540,timeSeconds:result.posterTime},framingProof:{path:relProof,sha256:hash(dest+'/framing-proof.json')},originalComposite:{edgeTouchFrames:result.qa.frame_edge_touch_frames},bodyQaInherited:true,appearanceAndMotionUnchanged:true,originalStatus:result.status,originalQaPass:result.qa.pass,originalQaPath:job+'/qa.json',motionProofPath:job+'/motion-invariance.json',originalResultPath:job+'/result.json',framingStatus:'passed',bodyQaStatus:'inherited_without_changes',completedAt:new Date().toISOString()};
 write(out+'/delivery-manifest.json',manifest);console.log('Completed repaired framing '+id+'; body margin '+proof.summary.minimumBodyMarginPixels+'px; original QA/status retained');
}
const frozenAfter=frozen();assert.deepEqual(frozenAfter,frozenBefore,'Frozen production input changed');
manifest.finalValidation={strictDecodeErrorsFatal:true,rawPngAndProofReplayed:true,toolsSha256:{'reframe-library.mjs':hash(ROOT+'/reframe-library.mjs'),'reframe-cycle.py':hash(ROOT+'/reframe-cycle.py')}};
write(out+'/delivery-manifest.json',manifest);
write(out+'/frozen-input-check.json',{before:frozenBefore,after:frozenAfter,unchanged:true});
console.log('Completed '+Object.keys(manifest.overrides).length+' independent framing repairs: '+out);
