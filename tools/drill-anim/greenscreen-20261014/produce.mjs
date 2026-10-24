// Additive App51 chroma-key derivatives from the actual frozen RGBA render frames.
// No 3D solver, recolouring, source overwrite, or App media replacement.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {spawn,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const args=process.argv.slice(2), opt=(k,d)=>args.includes(k)?args[args.indexOf(k)+1]:d;
const out=path.resolve(repo,opt('--out','output/app51-greenscreen-20261014'));
assert(out.startsWith(repo+path.sep)&&out!==repo,'Output must be a new child of the project');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write=(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');};
const manifestFile=path.join(repo,'app/assets/data/drill-media-manifest.json');
const manifest=read(manifestFile), sourceManifestSha256=sha(manifestFile);
const recipe={version:1,background:'#00ff00',fps:30,placement:'Frozen composite/place.json, identical rounded scale and offsets',foreground:'Frozen main RGBA pass including body highlights and necessary props; straight alpha overlay',omitted:'Synthetic floor shadows, gradient, outer orange halo, inner compositing rim, external highlight bloom',master:'1080x1080 H264/yuv420p CRF14',mobile:'720x720 H264/yuv420p CRF16',sourceQa:manifest.summary.audit_states,producerSha256:sha(fileURLToPath(import.meta.url))};
fs.mkdirSync(out,{recursive:true});
const planFile=path.join(out,'plan.json');
if(fs.existsSync(planFile)){const previous=read(planFile);assert.equal(previous.sourceManifestSha256,sourceManifestSha256);assert.deepEqual(previous.recipe,recipe,'Use a new batch for a changed recipe');}
else write(planFile,{sourceManifestSha256,sourceCommit:spawnSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8',windowsHide:true}).stdout.trim(),recipe,createdAt:new Date().toISOString(),scope:'App51 only; original media and App preserved'});
const run=(exe,argv,log)=>new Promise((resolve,reject)=>{const s=fs.createWriteStream(log,{flags:'a'}),p=spawn(exe,argv,{cwd:repo,windowsHide:true});p.stdout.pipe(s,{end:false});p.stderr.pipe(s,{end:false});p.on('error',reject);p.on('close',code=>{s.end();code===0?resolve():reject(Error(`${exe} failed (${code}): ${log}`));});});
function probe(file,n,size,duration){const r=spawnSync('ffprobe',['-v','error','-select_streams','v:0','-count_frames','-show_entries','stream=codec_name,pix_fmt,width,height,nb_read_frames,r_frame_rate:format=duration','-of','json',file],{encoding:'utf8',windowsHide:true});assert.equal(r.status,0,r.stderr);const p=JSON.parse(r.stdout),s=p.streams[0];assert.equal(s.codec_name,'h264');assert.equal(s.pix_fmt,'yuv420p');assert.equal(s.width,size);assert.equal(s.height,size);assert.equal(s.r_frame_rate,'30/1');assert.equal(Number(s.nb_read_frames),n);assert(Math.abs(Number(p.format.duration)-duration)<0.02);return{...s,duration:Number(p.format.duration),sha256:sha(file),bytes:fs.statSync(file).size,fullDecode:true};}
async function job(a){
 const id=a.id,folder=path.join(out,'jobs',id),resultFile=path.join(folder,'result.json');
 if(fs.existsSync(resultFile)){const r=read(resultFile);for(const v of Object.values(r.media))assert.equal(sha(path.join(out,v.path)),v.sha256);console.log('verified existing '+id);return r;}
 const source=path.join(repo,id==='erectors-B'?'output/training-human-v2-erectors-B-footfix-20261013':'output/training-human-v2-library-final-20261013/jobs/'+id);
 const place=read(source+'/composite/place.json'), spec=read(source+'/spec.json');
 assert.equal(spec.modelProfile,'training-human-v2');assert.equal(a.fps,30);
 assert.equal(sha(path.join(repo,'app',a.video_asset)),a.sha256,'Current App input differs');
 assert.equal(sha(path.join(repo,a.source_path)),a.sha256,'Frozen selected input differs');
 const rows=read(source+'/frames/met-cycle.json').filter(r=>r.f>=0);
 assert.equal(rows.length,a.frames);rows.forEach((r,i)=>{assert.equal(r.f,i);assert(Math.abs(r.t-i/30)<1e-7);});
 fs.mkdirSync(folder,{recursive:true});
 const frames=[];for(let i=0;i<a.frames;i++){const file=`${source}/frames/m-${String(i).padStart(4,'0')}.png`;frames.push({f:i,t:i/30,sha256:sha(file)});}
 const protectedFiles=['spec.json','theme.json','composite/place.json','frames/met-cycle.json','result.json'];
 const sourceSha256=Object.fromEntries(protectedFiles.map(p=>[p,sha(source+'/'+p)]));
 write(folder+'/source.json',{id,name:a.name,rawDirectory:path.relative(repo,source+'/frames').replaceAll('\\','/'),sourceAppVideoSha256:a.sha256,sourceQa:a.audit_status,sourceSha256,frames,place});
 const head=fs.readFileSync(source+'/frames/m-0000.png');assert.equal(head.toString('ascii',12,16),'IHDR');assert.equal(head[25],6,'PNG must be RGBA');const rawWidth=head.readUInt32BE(16),rawHeight=head.readUInt32BE(20);
 const w=Math.round(rawWidth*place.s),h=Math.round(rawHeight*place.s),x=Math.round(place.ox),y=Math.round(place.oy);
 const log=folder+'/production.log';
 const input=source+'/frames/m-%04d.png';
 const base=`[0:v]scale=${w}:${h}:flags=lanczos,format=rgba[fg];color=c=0x00ff00:s=1080x1080:r=30[bg];[bg][fg]overlay=x=${x}:y=${y}:format=rgb:shortest=1,format=rgb24`;
 const master=`media/master/${id}-greenscreen.mp4`,mobile=`media/mobile/${id}-greenscreen.mp4`,poster=`media/posters/${id}-greenscreen.png`;
 for(const p of [master,mobile,poster])fs.mkdirSync(path.dirname(path.join(out,p)),{recursive:true});
 assert(!fs.existsSync(path.join(out,master))&&!fs.existsSync(path.join(out,mobile)),'Partial output exists; choose a new batch or diagnose explicitly');
 console.log('encoding '+id+' '+a.frames+' frames');
 await run('ffmpeg',['-v','error','-filter_complex_threads','2','-framerate','30','-start_number','0','-i',input,'-filter_complex',base+',split=2[master][mobile0];[mobile0]scale=720:720:flags=lanczos[mobile]',
 '-map','[master]','-frames:v',String(a.frames),'-c:v','libx264','-threads','2','-crf','14','-pix_fmt','yuv420p','-movflags','+faststart',path.join(out,master),
 '-map','[mobile]','-frames:v',String(a.frames),'-c:v','libx264','-threads','2','-crf','16','-pix_fmt','yuv420p','-movflags','+faststart',path.join(out,mobile)],log);
 const pf=Math.round(a.poster_time_seconds*30);assert(pf>=0&&pf<a.frames);
 await run('ffmpeg',['-v','error','-filter_complex_threads','1','-i',`${source}/frames/m-${String(pf).padStart(4,'0')}.png`,'-filter_complex',base+',scale=540:540:flags=lanczos[poster]','-map','[poster]','-frames:v','1',path.join(out,poster)],log);
 const media={};for(const [name,rel,size]of[['master',master,1080],['mobile',mobile,720]]){await run('ffmpeg',['-v','error','-xerror','-threads','1','-i',path.join(out,rel),'-f','null','-'],log);media[name]={path:rel,...probe(path.join(out,rel),a.frames,size,a.duration_seconds)};}
 media.poster={path:poster,sha256:sha(path.join(out,poster)),bytes:fs.statSync(path.join(out,poster)).size,timeSeconds:a.poster_time_seconds};
 assert.deepEqual(Object.fromEntries(protectedFiles.map(p=>[p,sha(source+'/'+p)])),sourceSha256,'Source changed');
 assert.equal(sha(path.join(repo,'app',a.video_asset)),a.sha256,'App video changed');
 const r={id,name:a.name,status:'green_media_complete',inheritedPostureStatus:a.audit_status,frames:a.frames,duration:a.duration_seconds,fps:30,media,sourceRecord:'jobs/'+id+'/source.json',recipe,completedAt:new Date().toISOString()};write(resultFile,r);console.log('complete '+id);return r;
}
const only=opt('--only',null),jobs=Object.values(manifest.actions).filter(a=>!only||only.split(',').includes(a.id));assert(jobs.length);
const results=[],queue=jobs.slice();await Promise.all(Array.from({length:Math.min(Number(opt('--workers','2')),jobs.length)},async()=>{while(queue.length)results.push(await job(queue.shift()));}));
assert.equal(sha(manifestFile),sourceManifestSha256);
write(out+'/delivery-manifest.json',{sourceManifestSha256,recipe,actions:results.sort((a,b)=>a.id.localeCompare(b.id)),summary:{actions:results.length,frames:results.reduce((n,a)=>n+a.frames,0),seconds:results.reduce((n,a)=>n+a.duration,0),allGreenVideosFullyDecoded:true,allPostureQaPassed:false,appReplaced:false},createdAt:new Date().toISOString()});
console.log('done '+results.length+' actions');
