// Groin close-ups of the Flare v41 training human at chosen frames (crotch-smooth QA).
// node tools/flare-body-swap/closeup.mjs --out DIR --frames 76,136,190,196 [--size 560] [--before] [--angles 0,-45] [--gaps 35,0] [--dist 0.75]
// Two views per frame: "cam" = the video camera direction zoomed on the hips; "front" = from the
// pelvis front, 35° below the hips, looking into the crotch between the spread thighs.
import fs from 'node:fs';import path from 'node:path';import {bootFlare,loadSpec} from './stage.mjs';
import {HUB} from './pose-hub.mjs';
import {assertOutsidePoseHub} from '../pose-hub-paths.mjs';
const A=process.argv.slice(2),opt=(k,d)=>{const i=A.indexOf(k);return i<0?d:A[i+1];};
const out=path.resolve(opt('--out','closeups')),SZ=+opt('--size',640),frames=opt('--frames','76,196').split(',').map(Number),before=A.includes('--before');
assertOutsidePoseHub(out,HUB);fs.mkdirSync(out,{recursive:true});
const spec=loadSpec();spec.size=SZ;spec.highlight={groups:[],side:'both',pulseBase:1};
const {b,p,crotchReport}=await bootFlare({size:SZ,spec,crotch:!before,crotchOpts:JSON.parse(opt('--crotch-opts','{}'))});
await p.evaluate(d=>{window.__closeDist=d;},+opt('--dist',1.05));
if(opt('--gaps'))await p.evaluate(a=>{window.__gapAngles=a;},opt('--gaps').split(',').map(Number));
if(opt('--angles'))await p.evaluate(a=>{window.__closeAngles=a;},opt('--angles').split(',').map(Number));
if(crotchReport)fs.writeFileSync(path.join(out,'crotch-report.json'),JSON.stringify(crotchReport,null,1));
await p.evaluate(([s,SZ])=>{__setHighlight(s.highlight);__toonUni.uSinkK.value=1;__drill.setupCamera(s,SZ);},[spec,SZ]);
for(let k=0;k<2;k++){await p.evaluate(([s,SZ])=>{__drill.frame(s,0,0,null,{size:SZ,full:false});return 1;},[spec,SZ]);await p.waitForTimeout(200);}
for(const f of frames){
  const shots=await p.evaluate(([s,f,SZ])=>{
    __drill.frame(s,f/30,f,null,{full:false,size:SZ});
    const v=flareInspector.viewer,T=__toonT,pel=v.coach.getObjectByName('pelvis');
    const J=Object.assign({},v.motion.getMetrics().joints,__drill._jo||{}),hip=new T.Vector3(...J.leftHip).add(new T.Vector3(...J.rightHip)).multiplyScalar(0.5);
    const lat=new T.Vector3(...J.leftHip).sub(new T.Vector3(...J.rightHip)).normalize(),up0=new T.Vector3(...J.shoulderCenter).sub(new T.Vector3(...J.pelvis)).normalize(),fwd=lat.clone().cross(up0).normalize(),up=fwd.clone().cross(lat).normalize();
    const tgt=hip.clone().addScaledVector(up,-0.08);
    const res={};const bg=v.scene.background;v.scene.background=new T.Color('#1b1c20');
    const views={cam:v.camera.position.clone().sub(__drill.cam0.tgt).normalize()};
    // between the legs: thigh bisector (the crotch opening), tilted toward the pelvis front by 35° / 0°
    const dL=new T.Vector3(...J.leftKnee).sub(new T.Vector3(...J.leftHip)).normalize(),dR=new T.Vector3(...J.rightKnee).sub(new T.Vector3(...J.rightHip)).normalize(),bis=dL.add(dR).normalize();
    for(const a of (window.__gapAngles||[]))views['gap'+a]=bis.clone().multiplyScalar(Math.cos(a*Math.PI/180)).addScaledVector(fwd,Math.sin(a*Math.PI/180)).normalize();
    // around the lateral (hip-to-hip) axis: 0 = straight at the pelvis front, -90 = from between the feet
    for(const a of (window.__closeAngles||[-35]))views['front'+(a===-35?'':a)]=fwd.clone().multiplyScalar(Math.cos(a*Math.PI/180)).addScaledVector(up,Math.sin(a*Math.PI/180)).normalize();
    for(const [k,d] of Object.entries(views)){const cam=new T.PerspectiveCamera(30,1,0.05,30);cam.position.copy(tgt).addScaledVector(d,window.__closeDist||1.05);cam.up.copy(k.startsWith('gap')?up:k.startsWith('front')?(Math.abs(d.dot(up))>0.95?fwd:up):new T.Vector3(0,1,0));cam.lookAt(tgt);cam.updateProjectionMatrix();cam.updateMatrixWorld();
      window.__glowU.value=0;v.renderer.render(v.scene,cam);res[k]=v.renderer.domElement.toDataURL('image/png');}
    v.scene.background=bg;return res;},[spec,f,SZ]);
  for(const [k,d] of Object.entries(shots))fs.writeFileSync(path.join(out,`${k}-${String(f).padStart(4,'0')}.png`),Buffer.from(d.split(',')[1],'base64'));
  console.log('frame',f);
}
await b.close();
