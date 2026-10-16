// Read-only verification of the immutable, user-accepted R15 release.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const args=process.argv.slice(2);
if(args.length&&(args.length!==2||args[0]!=='--dir'))throw Error('Usage: node tools/motion-v42-r15/verify-release.mjs [--dir output/<batch>]');
const release=JSON.parse(fs.readFileSync(new URL('./releases/v42-r15.json',import.meta.url),'utf8'));
const directory=path.resolve(root,args[1]??release.originalOutput);
function check(file,expected){
 try{
  const data=fs.readFileSync(file),sha256=crypto.createHash('sha256').update(data).digest('hex');
  return {file,bytes:data.length,sha256,matches:sha256===expected.sha256&&data.length===expected.bytes};
 }catch(error){return {file,matches:false,error:error.code??error.message};}
}
const assets=release.assets.map(asset=>({kind:asset.kind,...check(path.join(directory,asset.file),asset)}));
const frozenFiles=[...release.requiredInputs,...release.frozenFiles].map(item=>check(path.resolve(root,item.path),item));
const passed=[...assets,...frozenFiles].every(item=>item.matches);
console.log(JSON.stringify({release:release.id,sourceVersionRef:release.sourceVersionRef,passed,assets,frozenFiles},null,2));
if(!passed)process.exitCode=1;
