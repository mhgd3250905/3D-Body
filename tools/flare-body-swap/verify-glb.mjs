// Checks the training-human GLB against the approved v41 baked GLB: same 22 bones (names,
// hierarchy, rest TRS), the same flare_v41_loop clip (44 channels, identical keyframe times and
// values), and no face meshes. Motion parity means every flare rule that held for v41 holds
// for the swapped body at bone level. node tools/flare-body-swap/verify-glb.mjs
import {NodeIO} from '@gltf-transform/core';import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import path from 'node:path';import {fileURLToPath} from 'node:url';
const REPO=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS);
const load=f=>io.read(path.join(REPO,f));
const A=await load('app/scene/source/coach/flare-coach-v41-animated.glb'),B=await load('app/scene/source/coach/flare-coach-v41-training-human-animated.glb');
const checks=[];const ok=(name,pass,detail='')=>{checks.push({name,pass,detail});};
const bones=doc=>{const s=new Set();for(const sk of doc.getRoot().listSkins())for(const j of sk.listJoints())s.add(j);return [...s];};
const ba=bones(A),bb=bones(B),na=ba.map(n=>n.getName()).sort(),nb=bb.map(n=>n.getName()).sort();
ok('22 joints, same names',na.length===22&&JSON.stringify(na)===JSON.stringify(nb),`${na.length}/${nb.length}`);
const byName=l=>Object.fromEntries(l.map(n=>[n.getName(),n]));const ma=byName(ba),mb=byName(bb);let trs=0,parent=0;
const pName=(doc,n)=>{for(const m of doc.getRoot().listNodes())if(m.listChildren().includes(n))return m.getName();return null;};
for(const k of na){const a=ma[k],b=mb[k];for(const [x,y] of [[a.getTranslation(),b.getTranslation()],[a.getRotation(),b.getRotation()],[a.getScale(),b.getScale()]])for(let i=0;i<x.length;i++)trs=Math.max(trs,Math.abs(x[i]-y[i]));if(pName(A,a)!==pName(B,b))parent++;}
ok('rest TRS identical',trs<1e-6,`max |d| ${trs.toExponential(2)}`);ok('hierarchy identical',parent===0,`${parent} parent mismatches`);
const clip=doc=>doc.getRoot().listAnimations().find(a=>a.getName()==='flare_v41_loop');const ca=clip(A),cb=clip(B);
ok('clip flare_v41_loop present, 44 channels',!!cb&&cb.listChannels().length===44&&ca.listChannels().length===44);
let dt=0,dv=0;const key=c=>c.getTargetNode().getName()+'.'+c.getTargetPath();const chB=Object.fromEntries(cb.listChannels().map(c=>[key(c),c]));
for(const c of ca.listChannels()){const d=chB[key(c)];if(!d){dv=Infinity;continue;}const ia=c.getSampler().getInput().getArray(),ib=d.getSampler().getInput().getArray(),oa=c.getSampler().getOutput().getArray(),ob=d.getSampler().getOutput().getArray();
  if(ia.length!==ib.length||oa.length!==ob.length){dv=Infinity;continue;}for(let i=0;i<ia.length;i++)dt=Math.max(dt,Math.abs(ia[i]-ib[i]));for(let i=0;i<oa.length;i++)dv=Math.max(dv,Math.abs(oa[i]-ob[i]));}
ok('keyframe times identical',dt<1e-6,`max ${dt}`);ok('keyframe values identical',dv<1e-6,`max ${dv}`);
const meshes=B.getRoot().listNodes().filter(n=>n.getMesh()).map(n=>n.getName());
ok('no face meshes (eyes/brows/hair/teeth/tongue)',!meshes.some(n=>/Mesh004|Brows|Glints|Hair|Teeth|Gums|Tongue/.test(n)),meshes.join(','));
ok('faceless mannequin head present',meshes.includes('Toon_Mannequin_Head_v5'));
const pass=checks.every(c=>c.pass);console.log(JSON.stringify({pass,checks},null,1));process.exit(pass?0:1);
