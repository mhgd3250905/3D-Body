// Verify the immutable, user-accepted R14 outputs without rebaking or changing files.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const args=process.argv.slice(2);
if(args.length && (args.length!==2 || args[0]!=='--dir'))throw Error('Usage: node tools/motion-v42-r14/verify-release.mjs [--dir output/<batch>]');
const release=JSON.parse(fs.readFileSync(new URL('./releases/v42-r14.json',import.meta.url),'utf8'));
const directory=path.resolve(root,args[1]??release.originalOutput);
const assets=release.assets.map(asset=>{
 const file=path.join(directory,asset.file),bytes=fs.readFileSync(file);
 const sha256=crypto.createHash('sha256').update(bytes).digest('hex');
 return {kind:asset.kind,file,bytes:bytes.length,sha256,matches:sha256===asset.sha256&&bytes.length===asset.bytes};
});
const passed=assets.every(asset=>asset.matches);
console.log(JSON.stringify({release:release.id,sourceVersionRef:release.sourceVersionRef,passed,assets},null,2));
if(!passed)process.exitCode=1;
