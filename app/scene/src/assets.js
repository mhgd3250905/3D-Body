import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { gunzipSync } from 'fflate';

export async function loadOfflineGlb(relativePath) {
  const url = new URL(relativePath, document.baseURI), response = await fetch(url);
  if (!response.ok) throw new Error('model_load_failed');
  let bytes = new Uint8Array(await response.arrayBuffer());
  // Some local hosts decode Content-Encoding themselves, others serve the gzip
  // asset verbatim. The fixed local fflate decoder also supports older WebViews.
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) bytes = gunzipSync(bytes);
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  return new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(buffer, new URL('.', url).href);
}
