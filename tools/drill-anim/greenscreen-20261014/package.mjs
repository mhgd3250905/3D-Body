// Offline gallery and output hashes; no external assets or network dependencies.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const out=path.resolve(root,process.argv[2]||'output/app51-greenscreen-20261014');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const manifest=read(out+'/delivery-manifest.json');
assert.equal(manifest.actions.length,51,'Package only a fully completed App51');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const entries=[];
for(const a of manifest.actions){for(const media of Object.values(a.media)){assert.equal(hash(path.join(out,media.path)),media.sha256);entries.push({...media,id:a.id});}}
const data=JSON.stringify(manifest.actions.map(a=>({id:a.id,name:a.name,status:a.inheritedPostureStatus,duration:a.duration,...Object.fromEntries(Object.entries(a.media).map(([k,v])=>[k,v.path]))}))).replaceAll('<','\\u003c');
fs.writeFileSync(out+'/index.html',`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>App51 · 独立绿幕素材</title><style>body{margin:0;background:#171a1f;color:#eef1f4;font:16px system-ui,sans-serif}main{max-width:1200px;margin:auto;padding:24px}h1{font-size:25px}p{line-height:1.6;color:#b9c1cd}input{font:inherit;padding:12px;border-radius:10px;border:1px solid #697381;background:#242a32;color:white;width:min(90%,400px)}section{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin-top:24px}article{background:#242a32;border-radius:14px;overflow:hidden;padding-bottom:16px}video{display:block;width:100%;aspect-ratio:1;background:#00ff00}h2{font-size:18px;margin:16px 14px 8px}small{display:block;margin:0 14px;color:#bec7d2}nav{display:flex;flex-wrap:wrap;gap:12px;margin:14px}a{color:#88ddeb;text-decoration:underline}@media(max-width:580px){main{padding:16px}section{grid-template-columns:1fr}}</style><main><h1>App51 · 独立绿幕素材</h1><p>51项，30fps，共423.2秒。动作、时序、镜头、人物及必要器械沿用当前App选版；纯绿背景，无舞台阴影或外部光晕。1080高清版与720便携版均为MP4，可用于色度抠像。原App视频保持。</p><p>人体原审核状态：23项ready、28项待核对。本页视频完成及解码通过，不代表全部动作QA通过。绿幕色：#00FF00；肌群高亮为青蓝，抠像后请检查轮廓及器械细线。</p><label>查找动作 <input id="search" placeholder="输入名称或ID"></label><p id="count"></p><section id="grid"></section><p><a href="README.md">交付说明</a> · <a href="delivery-manifest.json">交付清单</a> · <a href="SHA256SUMS.txt">SHA256校验</a></p></main><script>const items=${data};const grid=document.querySelector('#grid');function render(){document.querySelectorAll('video').forEach(v=>v.pause());grid.replaceChildren();let count=0;for(const a of items){if(!(a.name+' '+a.id).toLowerCase().includes(document.querySelector('#search').value.toLowerCase()))continue;count++;const card=document.createElement('article'),v=document.createElement('video');v.src=a.mobile;v.poster=a.poster;v.controls=true;v.preload='none';v.playsInline=true;v.loop=true;v.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==v)other.pause()}));const h=document.createElement('h2');h.textContent=a.name;const s=document.createElement('small');s.textContent=a.id+' · '+a.duration+'秒 · '+(a.status==='ready'?'原QA ready':'原QA待核对');const nav=document.createElement('nav');for(const [k,label]of[['master','下载1080高清'],['mobile','下载720便携']]){const l=document.createElement('a');l.href=a[k];l.download='';l.textContent=label;nav.append(l)}card.append(v,h,s,nav);grid.append(card)}document.querySelector('#count').textContent='显示 '+count+' / 51 项'}document.querySelector('#search').addEventListener('input',render);render();</script></html>`);
fs.writeFileSync(out+'/index.html',fs.readFileSync(out+'/index.html','utf8').replace('<meta name="viewport"','<link rel="icon" href="data:,"><meta name="viewport"').replace('抠像后请检查轮廓及器械细线。','抠像时开启去绿色溢色，再检查轮廓及器械细线。'));
fs.copyFileSync(path.join(root,'docs/app51-greenscreen-2026-10-14.md'),out+'/README.md');
fs.mkdirSync(out+'/recipe',{recursive:true});
for(const f of ['produce.mjs','package.mjs','verify.py'])fs.copyFileSync(path.join(root,'tools/drill-anim/greenscreen-20261014',f),out+'/recipe/'+f);
const collect=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?collect(path.join(d,e.name)):[path.join(d,e.name)]);
const files=collect(out).filter(f=>!['SHA256SUMS.txt','package-manifest.json'].includes(path.basename(f))).sort().map(f=>({path:path.relative(out,f).replaceAll('\\','/'),bytes:fs.statSync(f).size,sha256:hash(f)}));
fs.writeFileSync(out+'/SHA256SUMS.txt',files.map(f=>f.sha256+'  '+f.path).join('\n')+'\n');
fs.writeFileSync(out+'/package-manifest.json',JSON.stringify({createdAt:new Date().toISOString(),actions:51,portablePlayback:true,reRenderRequiresOriginalRgbaFrames:true,files},null,2)+'\n');
console.log('Packaged '+files.length+' files with offline gallery and SHA256');
