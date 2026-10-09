// Slim flare-coach.glb: drop unused UV/second colour sets, dedup, KHR_mesh_quantization.
// Usage (no project dependency added): npm i --no-save @gltf-transform/core@4 @gltf-transform/functions@4 @gltf-transform/extensions@4
//   node tools/slim-coach-glb.mjs in.glb public/coach/flare-coach.glb
// GLTFLoader reads KHR_mesh_quantization natively; no decoder, still fully offline.
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {prune,dedup,quantize,weld} from '@gltf-transform/functions';
const [src,dst]=process.argv.slice(2);
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc=await io.read(src);
let removed=0;
for(const mesh of doc.getRoot().listMeshes())for(const prim of mesh.listPrimitives()){
  for(const sem of ['TEXCOORD_0','TEXCOORD_1','COLOR_1']){const a=prim.getAttribute(sem);if(a){prim.setAttribute(sem,null);removed++;}}
}
await doc.transform(dedup(),prune(),quantize({quantizePosition:14,quantizeNormal:10,quantizeColor:8,quantizeWeight:8,quantizeTexcoord:12}));
await io.write(dst,doc);console.log('removed attrs',removed);
