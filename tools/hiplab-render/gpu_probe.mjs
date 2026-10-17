import fs from 'node:fs';
import {boot} from '../drill-anim/lib/boot.mjs';
import {loadTheme} from '../drill-anim/lib/config.mjs';

const {b,p}=await boot({size:1080,pr:2,theme:loadTheme('themes/glow-b.json')});
try {
  const gpu=await p.evaluate(()=>{
    const gl=flareInspector.viewer.renderer.getContext();
    const ext=gl.getExtension('WEBGL_debug_renderer_info');
    return {vendor:ext?gl.getParameter(ext.UNMASKED_VENDOR_WEBGL):gl.getParameter(gl.VENDOR),
      renderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),
      width:gl.drawingBufferWidth,height:gl.drawingBufferHeight};
  });
  fs.writeFileSync(process.argv[2],JSON.stringify(gpu,null,2)+'\n');
  console.log(JSON.stringify(gpu));
  if(!/NVIDIA|4080/i.test(gpu.renderer)||/SwiftShader|llvmpipe/i.test(gpu.renderer))
    throw new Error('Expected hardware NVIDIA renderer');
} finally {await b.close();}
