// Preserve PR109's original GLB. Derive only the accepted native-skin colour
// and post-skinning cloth sink, sourced from the frozen training-human-v2 pipeline.
// node tools/flare-body-swap/derive-collarfix.mjs --pipeline-root ROOT --out NEW_GLB --gzip NEW_GZIP --report NEW_REPORT
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import {createRequire} from 'node:module';import {gzipSync} from 'node:zlib';import {fileURLToPath,pathToFileURL} from 'node:url';
const REPO=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const args=process.argv.slice(2),opt=(k,d)=>args.includes(k)?args[args.indexOf(k)+1]:d;
const pipeline=path.resolve(opt('--pipeline-root',REPO));
const source=path.join(REPO,'app/scene/source/coach/flare-coach-v41-training-human-animated.glb');
const output=path.resolve(opt('--out',path.join(REPO,'app/scene/source/coach/flare-coach-v41-training-human-collarfix-20261013.glb')));
const gzip=path.resolve(opt('--gzip',args.includes('--out')?output+'.gz':path.join(REPO,'app/scene/public/coach/flare-coach-v41-training-human-collarfix-20261013.glb.gz')));
const reportPath=path.resolve(opt('--report',output+'.json'));
if(fs.existsSync(output)||fs.existsSync(gzip)||fs.existsSync(reportPath))throw new Error('Derivation output already exists; preserve it and choose new --out, --gzip and --report paths.');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const baseline=JSON.parse(fs.readFileSync(path.join(REPO,'tools/drill-anim/models/training-human-v2.json'),'utf8'));
const sources=Object.entries(baseline.sourceSha256).map(([file,expected])=>{
 let bytes=fs.readFileSync(path.join(pipeline,file));if(!file.endsWith('.glb'))bytes=Buffer.from(bytes.toString('utf8').replace(/\r\n/g,'\n'));
 const actual=sha(bytes);if(actual!==expected)throw new Error('Frozen source changed: '+file);return {file,sha256:actual};
});
const require=createRequire(path.join(REPO,'app/scene/package.json'));
const {NodeIO,Accessor}=await import(pathToFileURL(require.resolve('@gltf-transform/core')).href);
const {ALL_EXTENSIONS}=await import(pathToFileURL(require.resolve('@gltf-transform/extensions')).href);
const {config,loadTheme}=await import(pathToFileURL(path.join(pipeline,'tools/drill-anim/lib/config.mjs')).href);
const {boot}=await import(pathToFileURL(path.join(pipeline,'tools/drill-anim/lib/boot.mjs')).href);
const theme=loadTheme(),{b,p}=await boot({size:512,pr:1,theme,bakeHands:[]});let live;
try {
 live=await p.evaluate(th=>{
  __drill.selectModelProfile({modelProfile:'training-human-v2',alignClavicles:false});
  const v=flareInspector.viewer,T=__toonT,skin=new T.Color(th.skin.base),parts=[];
  for(const name of ['Coach_Body','Mesh001']){
   const mesh=v.coach.getObjectByName(name),sink=mesh.geometry.getAttribute('aSink');
   const shader={uniforms:{},vertexShader:'',fragmentShader:'vec3 alb=vec3(0.0)'};mesh.material.onBeforeCompile(shader);
   parts.push({name,sink:Array.from({length:sink.count},(_,i)=>sink.getX(i)),collar:shader.uniforms.uCollar.value,forceSkin:shader.fragmentShader.includes('W4=vec4(1.0,0.0,0.0,0.0)'),sinkEnabled:shader.uniforms.uSinkK.value});
  }
  return {profile:__trainingCollarReport,skin:skin.toArray(),parts};
 },theme);
} finally {await b.close();}
if(!live.profile.enabled||!live.parts.find(x=>x.name==='Mesh001').forceSkin)throw new Error('Accepted collar profile is not active');
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS),document=await io.read(source);
const buffer=document.getRoot().listBuffers()[0],changes=[];
for(const part of live.parts){
 const node=document.getRoot().listNodes().find(n=>n.getName()===part.name),primitive=node.getMesh().listPrimitives()[0];
 if(primitive.getAttribute('POSITION').getCount()!==part.sink.length)throw new Error('Vertex count mismatch: '+part.name);
 const accessor=document.createAccessor(part.name+'_cloth_sink',buffer).setType(Accessor.Type.SCALAR).setArray(Float32Array.from(part.sink));
 primitive.setAttribute('_SINK',accessor);
 let colourVertices=0;
 if(part.name==='Mesh001'){
  const colour=primitive.getAttribute('COLOR_0'),array=colour.getArray().slice();
  for(let i=0;i<colour.getCount();i++){if(live.skin.some((v,k)=>Math.abs(array[i*3+k]-v)>1e-6))colourVertices++;array.set(live.skin,i*3);}
  colour.setArray(array);
 }
 changes.push({mesh:part.name,colourVerticesChanged:colourVertices,sinkVertices:part.sink.filter(x=>x>0).length,maxSinkMm:Math.max(...part.sink)*1000});
}
for(const file of [output,gzip,reportPath])fs.mkdirSync(path.dirname(file),{recursive:true});
await io.write(output,document);const bytes=fs.readFileSync(output);fs.writeFileSync(gzip,gzipSync(bytes,{level:9}));
const report={variant:'training-human-collarfix-20261013',source,sourceSha256:sha(fs.readFileSync(source)),output,outputSha256:sha(bytes),gzip,gzipSha256:sha(fs.readFileSync(gzip)),sources,profile:live.profile,changes,
 contract:'Only Mesh001 COLOR_0 changes; _SINK is added to native skin. POSITION/NORMAL/indices/weights/rig/animation/materials are retained. App applies sink after skinning.'};
fs.mkdirSync(path.dirname(reportPath),{recursive:true});fs.writeFileSync(reportPath,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
