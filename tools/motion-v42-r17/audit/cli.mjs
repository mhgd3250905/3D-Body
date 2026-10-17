// Shared CLI for read-only motion audits. Reports always go to a new output folder.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

export const root=fileURLToPath(new URL('../../../',import.meta.url));
export function auditArguments(name,defaultCandidate='output/flare-v42-r17-20261017'){
 const options={candidate:defaultCandidate,out:null,checkPaths:false};
 for(let i=2;i<process.argv.length;i++){
  const arg=process.argv[i];
  if(arg==='--check-paths')options.checkPaths=true;
  else if(arg==='--candidate'||arg==='--out'){
   const value=process.argv[++i];if(!value||value.startsWith('--'))throw new Error(`${arg} requires a path`);
   options[arg==='--candidate'?'candidate':'out']=value;
  }else throw new Error(`Usage: node tools/motion-v42-r17/audit/${name}.mjs [--candidate output/<batch>] [--out output/<new-audit>] [--check-paths]`);
 }
 const stamp=new Date().toISOString().replace(/[:.]/g,'-');
 options.out=path.resolve(root,options.out??`output/r17-${name}-${stamp}`);
 const outputRoot=path.resolve(root,'output'),relative=path.relative(outputRoot,options.out);
 if(!relative||relative.startsWith('..')||path.isAbsolute(relative))throw new Error('--out must name a new directory within project output');
 if(!options.checkPaths){
  if(fs.existsSync(options.out))throw new Error(`Refusing to reuse existing audit directory: ${options.out}`);
  for(let parent=path.dirname(options.out);parent!==path.dirname(outputRoot);parent=path.dirname(parent))if(fs.existsSync(parent)&&fs.lstatSync(parent).isSymbolicLink())throw new Error('Audit output cannot traverse a symlink or junction');
  fs.mkdirSync(options.out,{recursive:true});
 }
 return options;
}
export const assetPaths=dir=>['training','coach'].map(kind=>path.join(dir,`flare-${kind}-v42-candidate.glb`));
export function checkInputs(options,files){
 if(!options.checkPaths)return;
 const inputs=files.map(file=>{const absolute=path.resolve(root,file),bytes=fs.readFileSync(absolute);return{path:path.relative(root,absolute).replaceAll('\\','/'),bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')}});
 console.log(JSON.stringify({readOnlyPathCheck:true,candidate:options.candidate,outputIfRun:options.out,inputs},null,2));
 process.exit(0);
}
