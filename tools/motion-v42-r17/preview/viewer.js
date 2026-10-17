import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const $=id=>document.getElementById(id);
const state={phase:.0297,playing:false,duration:1.35,body:'training',candidateLoading:false,mode:'whole',seamCursor:.95};
const loader=new GLTFLoader(),panels=[];
let syncing=false,candidateReceipt=null;
for(const id of ['baselineStage','candidateStage']){
 const element=$(id),scene=new THREE.Scene();scene.background=new THREE.Color('#fafcfb');
 const camera=new THREE.PerspectiveCamera(34,1,.01,50);
 const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.outputColorSpace=THREE.SRGBColorSpace;element.appendChild(renderer.domElement);
 scene.add(new THREE.HemisphereLight('#ffffff','#819b93',2.4));
 const key=new THREE.DirectionalLight('#fff5e7',3.2);key.position.set(2.5,5,3);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-2.2,right:2.2,top:2.2,bottom:-2.2,near:.1,far:12});key.shadow.bias=-.00015;key.shadow.normalBias=.008;scene.add(key);
 const fill=new THREE.DirectionalLight('#e0f3ff',1.7);fill.position.set(-3,2,-3);scene.add(fill);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:'#f4f8f6',roughness:1}));floor.rotation.x=-Math.PI/2;floor.position.y=-.014;floor.receiveShadow=true;scene.add(floor);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=false;controls.enableZoom=false;controls.enablePan=false;controls.minPolarAngle=.1;controls.maxPolarAngle=Math.PI*.48;
 const panel={element,scene,camera,renderer,controls,entries:{}};panels.push(panel);
 controls.addEventListener('change',()=>{if(syncing)return;syncing=true;for(const other of panels)if(other!==panel){other.camera.position.copy(camera.position);other.controls.target.copy(controls.target);other.controls.update();}syncing=false;});
 new ResizeObserver(()=>{renderer.setSize(element.clientWidth,element.clientHeight,false);camera.aspect=element.clientWidth/element.clientHeight;camera.updateProjectionMatrix();}).observe(element);
}
function setView(view){
 const positions={standard:[3.3,2.35,4.1],front:[0,1.75,5.1],side:[5.1,1.75,0],back:[0,1.75,-5.1]};syncing=true;
 for(const p of panels){p.controls.target.set(0,.8,0);p.camera.position.fromArray(positions[view]).sub(p.controls.target).multiplyScalar(.83).add(p.controls.target);p.controls.update();}syncing=false;
}
setView('front');
const reference=$('referenceVideo');
function referenceSeek(){
 const frame=Math.round(50+state.phase*34);reference.currentTime=(frame+.001)/30;$('referenceFrame').textContent=`参考帧 ${frame} / 130 · 模型相位 ${(state.phase*100).toFixed(2)}%`;
}
function referencePlay(){
 if(!$('reference').open||state.mode==='seam')return;
 reference.playbackRate=(34/30)/state.duration;
 reference.play().catch(()=>{$('referenceFrame').textContent='参考视频未播放，可先暂停再播放对照。';});
}
function seek(value,updateReference=true){
 state.phase=THREE.MathUtils.clamp(value,0,1);
 for(const p of panels)for(const [kind,entry] of Object.entries(p.entries)){
  entry.model.visible=kind===state.body;if(!entry.model.visible)continue;entry.action.enabled=true;entry.action.paused=false;entry.mixer.setTime(state.phase*entry.clip.duration);entry.model.updateMatrixWorld(true);
 }
 $('phase').value=(state.phase*100).toFixed(2);$('phaseLabel').textContent=(state.phase*100).toFixed(2)+'%';
 if(updateReference&&reference.readyState>=1)referenceSeek();
}
function refreshReadiness(updateStatus=true){
 const baseline=panels[0].entries[state.body],candidate=panels[1].entries[state.body];$('play').disabled=!baseline||!candidate;$('seam').disabled=!baseline||!candidate;
 document.title='R17 接缝右肘修复 · 待用户复核';$('releaseTitle').textContent=document.title;
 $('releaseBadge').textContent='待用户复核';$('candidateTitle').textContent='R17 · 接缝右肘修复';$('candidateTag').textContent='待用户复核';
 $('baselineStatus').textContent=baseline?`原始 R16 · ${baseline.clip.duration.toFixed(2)} 秒 · ${baseline.clip.tracks.length} 轨道`:'正在读取 R16';
 const hash=candidateReceipt?.assets.find(a=>a.kind===state.body)?.sha256.slice(0,12)||'';
 $('candidateStatus').textContent=candidate?`R17 修复 · ${candidateReceipt.source_batch} · ${candidate.clip.duration.toFixed(2)} 秒 · ${hash} · 待用户复核`:'R17 资产待发布';
 $('candidatePending').hidden=!!candidate;
 if(updateStatus&&baseline&&candidate){$('status').textContent='已核对实际 R17 GLB 哈希。左为 R16 原版，右为 R17 修复；重点查看 95% → 0% → 8% 的右肘。待用户复核。';$('status').classList.remove('error');}
}
function setPlaying(value){state.playing=value;$('play').textContent=value?'暂停对照':'播放对照';if(value){referenceSeek();referencePlay();}else reference.pause();}
async function loadEntry(url,expectedHash=null){
 let gltf,verifiedSha256=null;
 if(expectedHash){
  const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw new Error('GLB 读取失败：HTTP '+response.status);
  const bytes=await response.arrayBuffer();
  verifiedSha256=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),v=>v.toString(16).padStart(2,'0')).join('');
  if(verifiedSha256!==expectedHash)throw new Error('GLB 与候选记录的哈希不符');
  gltf=await loader.parseAsync(bytes,new URL('.',new URL(url,location.href)).href);
 }else gltf=await loader.loadAsync(url);
 const model=gltf.scene,clip=gltf.animations[0];if(!clip)throw new Error('GLB 缺少动作轨道');
 model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;}});
 const mixer=new THREE.AnimationMixer(model),action=mixer.clipAction(clip);action.setLoop(THREE.LoopOnce,1);action.clampWhenFinished=true;action.play();return {model,clip,mixer,action,verifiedSha256};
}
function disposeEntry(panel,entry){
 if(!entry)return;panel.scene.remove(entry.model);entry.mixer.stopAllAction();entry.mixer.uncacheRoot(entry.model);
 const textures=new Set(),materials=new Set(),geometries=new Set();entry.model.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)for(const mat of(Array.isArray(o.material)?o.material:[o.material]))materials.add(mat);});
 for(const mat of materials){for(const value of Object.values(mat))if(value?.isTexture)textures.add(value);mat.dispose();}for(const tex of textures)tex.dispose();for(const geo of geometries)geo.dispose();
}
async function loadCandidate(){
 if(state.candidateLoading)return;state.candidateLoading=true;setPlaying(false);$('reloadCandidate').disabled=true;
 try{
  const response=await fetch('./candidate-manifest.json?t='+Date.now(),{cache:'no-store'});
  if(response.status===404){$('status').textContent='R17 候选资产待发布；R16 基线可先拖动查看。';return;}
  if(!response.ok)throw new Error('候选记录读取失败：HTTP '+response.status);
  const receipt=await response.json();if(receipt.version!=='flare-v42-r17-candidate')throw new Error('候选记录版本不符');
  const loaded=await Promise.all(['training','coach'].map(async kind=>{
   const item=receipt.assets.find(a=>a.kind===kind);if(!item||item.file!==`assets/r17-${kind}.glb`)throw new Error('候选资产路径不符');
   const entry=await loadEntry('./'+item.file+'?sha256='+item.sha256,item.sha256);return {kind,entry};
  }));
  for(const {kind,entry}of loaded){disposeEntry(panels[1],panels[1].entries[kind]);panels[1].entries[kind]=entry;panels[1].scene.add(entry.model);}
  candidateReceipt=receipt;seek(state.phase);refreshReadiness();
 }catch(error){$('status').textContent='候选读取失败：'+error.message;$('status').classList.add('error');console.error(error);}
 finally{state.candidateLoading=false;$('reloadCandidate').disabled=false;refreshReadiness(false);}
}
$('play').onclick=()=>{if(state.mode==='seam'){state.seamCursor=state.phase>=.95?state.phase:state.phase<=.08?1+state.phase:.95;}setPlaying(!state.playing);};
$('seam').onclick=()=>{state.mode='seam';state.seamCursor=.95;reference.pause();seek(.95);setPlaying(true);};
$('whole').onclick=()=>{state.mode='whole';setPlaying(true);};
$('phase').oninput=()=>{setPlaying(false);seek(Number($('phase').value)/100);};
for(const button of document.querySelectorAll('[data-phase]'))button.onclick=()=>{setPlaying(false);seek(Number(button.dataset.phase)/100);};
$('body').onchange=()=>{state.body=$('body').value;seek(state.phase);refreshReadiness();};
$('view').onchange=()=>setView($('view').value);
$('duration').onchange=()=>{state.duration=Number($('duration').value);if(state.playing){referenceSeek();referencePlay();}};
$('reloadCandidate').onclick=loadCandidate;
$('mirrorReference').onchange=()=>{const mirrored=$('mirrorReference').checked;reference.style.transform=mirrored?'scaleX(-1)':'none';$('mirrorStatus').textContent=mirrored?'已镜像参考画面 · 原文件未改动':'原画面 · 未镜像';};
reference.addEventListener('loadedmetadata',referenceSeek);if(reference.readyState>=1)referenceSeek();
$('reference').addEventListener('toggle',()=>{if($('reference').open){referenceSeek();if(state.playing)referencePlay();}else reference.pause();});
try{
 const entries=await Promise.all(['training','coach'].map(async kind=>({kind,entry:await loadEntry(`./assets/r16-${kind}.glb`, {"training": "3b642a583bfed64303ce217d9894eecaae3c3668887a0e196cf91d0c024a96cd", "coach": "4da3f15e74f6f1c78c5e3db3022fc3daad46141c6b3a0ab9569f60d4cb495055"}[kind])})));
 for(const {kind,entry} of entries){panels[0].entries[kind]=entry;panels[0].scene.add(entry.model);}seek(state.phase);refreshReadiness();
}catch(error){$('status').textContent='R16 基线读取失败：'+error.message;$('status').classList.add('error');console.error(error);}
await loadCandidate();
let last=performance.now();function render(now){
 const dt=Math.min((now-last)/1000,.1);last=now;
 if(state.playing){
  if(state.mode==='seam'){
   // Unwrapped cursor crosses 1.0 without play/reset/restart; only the window end wraps.
   state.seamCursor+=dt/6;
   if(state.seamCursor>1.08)state.seamCursor=.95+(state.seamCursor-1.08);
   seek(state.seamCursor%1,true);
  }else{const next=state.phase+dt/state.duration;seek(next%1,false);if(next>=1&&$('reference').open){referenceSeek();referencePlay();}}
  if($('reference').open)$('referenceFrame').textContent=`参考帧 ${Math.round(50+state.phase*34)} / 130 · 模型相位 ${(state.phase*100).toFixed(2)}%`;
 }
 for(const p of panels)p.renderer.render(p.scene,p.camera);requestAnimationFrame(render);
}requestAnimationFrame(render);
