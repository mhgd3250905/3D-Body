// Export the selected artwork without generative changes to character or pose.
// node app/tools/export-brand-icons.mjs --sharp-root <existing sharp package>
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const args=process.argv.slice(2),sharpArg=args.indexOf('--sharp-root');
const require=createRequire(import.meta.url);
const sharp=require(sharpArg>=0?args[sharpArg+1]:'sharp');
const source=path.join(root,'app/assets/brand/icon-flare-angle2-b.png');
const output=path.join(root,'output/imagegen/flare-logo-20261011/adopted-teal');
const backup=path.join(output,'before');fs.mkdirSync(backup,{recursive:true});
const bg={r:17,g:18,b:18,alpha:1};
const records=[];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const relative=p=>path.relative(root,p).replaceAll('\\','/');
async function artwork(size,occupancy=1){const inner=Math.round(size*occupancy),offset=Math.floor((size-inner)/2);const image=await sharp(source).resize(inner,inner,{kernel:'lanczos3'}).removeAlpha().png().toBuffer();return occupancy===1?image:sharp({create:{width:size,height:size,channels:3,background:bg}}).composite([{input:image,left:offset,top:offset}]).removeAlpha().png().toBuffer();}
async function save(name,size,occupancy=1,kind='opaque'){const destination=path.join(root,name);if(fs.existsSync(destination)){const saved=path.join(backup,name);if(!fs.existsSync(saved)){fs.mkdirSync(path.dirname(saved),{recursive:true});fs.copyFileSync(destination,saved);}}fs.mkdirSync(path.dirname(destination),{recursive:true});let data=await artwork(size,occupancy);
if(kind==='round')data=await sharp(data).ensureAlpha().composite([{input:Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/></svg>`),blend:'dest-in'}]).png().toBuffer();
if(kind==='adaptive'){const inner=Math.round(size*occupancy),offset=Math.floor((size-inner)/2);data=await sharp({create:{width:size,height:size,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input:await artwork(inner),left:offset,top:offset}]).png().toBuffer();}
fs.writeFileSync(destination,data);const meta=await sharp(data).metadata();if(meta.width!==size||meta.height!==size)throw Error('Wrong size: '+name);if(kind==='opaque'&&meta.hasAlpha)throw Error('Unexpected alpha: '+name);records.push({path:name,size,occupancy,kind,bytes:data.length,sha256:hash(data)});return data;}
await save('app/assets/brand/icon.png',1024);
await save('app/assets/brand/icon-store-512.png',512);
for(const [density,size,foreground] of [['mdpi',48,108],['hdpi',72,162],['xhdpi',96,216],['xxhdpi',144,324],['xxxhdpi',192,432]]){const base='app/android/app/src/main/res/mipmap-'+density+'/';await save(base+'ic_launcher.png',size,.88);await save(base+'ic_launcher_round.png',size,.88,'round');await save(base+'ic_launcher_foreground.png',foreground,.62,'adaptive');}
for(const size of [20,29,40,58,60,80,87,120,152,167,180,1024])await save('app/ios/Runner/Assets.xcassets/AppIcon.appiconset/AppIcon-'+size+'.png',size);
await save('app/web/favicon.png',48,.88);
for(const size of [192,512]){await save('app/web/icons/Icon-'+size+'.png',size,.88);await save('app/web/icons/Icon-maskable-'+size+'.png',size,.78);}
const tiles=[];let index=0;
for(const [label,occupancy,mask] of [['Square',1,null],['iOS',1,'rounded'],['Circle',.88,'circle'],['Adaptive',.93,'circle'],['Maskable',.78,'circle']]){let data=await artwork(240,occupancy);let shape=mask==='circle'?'<circle cx="120" cy="120" r="120" fill="white"/>':'<rect width="240" height="240" rx="52" fill="white"/>';if(mask)data=await sharp(data).ensureAlpha().composite([{input:Buffer.from('<svg width="240" height="240">'+shape+'</svg>'),blend:'dest-in'}]).png().toBuffer();tiles.push({input:data,left:20+index*260,top:36});tiles.push({input:Buffer.from(`<svg width="240" height="28"><text x="120" y="21" text-anchor="middle" font-family="Arial" font-size="18" fill="white">${label}</text></svg>`),left:20+index*260,top:286});index++;}
await sharp({create:{width:1320,height:330,channels:3,background:{r:38,g:39,b:42}}}).composite(tiles).png().toFile(path.join(output,'crop-preview.png'));
const report={selected:'new-angle-B-teal',source:relative(source),sourceSha256:hash(fs.readFileSync(source)),sourceDimensions:await sharp(source).metadata(),background:'#111212',masterOccupancy:1,legacyOccupancy:.88,adaptiveForegroundOccupancy:.62,webMaskableOccupancy:.78,attribution:'Snow Rig © Blender Foundation | studio.blender.org, CC BY 4.0; project/user-model pose; AI character, teal wardrobe, lighting and logo treatment.',changes:'Resize and crop-safe export only. Original candidate retained; live 3D model and loading animation unchanged.',records};
fs.writeFileSync(path.join(output,'export-report.json'),JSON.stringify(report,null,2)+'\n');
fs.writeFileSync(path.join(root,'app/assets/brand/icon-manifest.json'),JSON.stringify({...report,sourceDimensions:{width:report.sourceDimensions.width,height:report.sourceDimensions.height},records},null,2)+'\n');
console.log(JSON.stringify({exports:records.length,sourceSha256:report.sourceSha256,masterSha256:records[0].sha256,preview:relative(path.join(output,'crop-preview.png'))},null,2));
