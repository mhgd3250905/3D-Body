import * as THREE from 'three';

// Warm skin and a matte finish match the accepted Ultraleap wrist presentation.
// The body surface is a real BodyParts3D mesh, not a geometric mannequin.
export function createSkinMaterial(){
  const material=new THREE.MeshPhysicalMaterial({color:0xc48f73,roughness:.60,metalness:0,clearcoat:0,ior:1.4,specularIntensity:.35,envMapIntensity:.28,transparent:true,depthWrite:true});
  material.onBeforeCompile=shader=>{
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nattribute float aReveal;\nvarying float vReveal;\nvarying vec3 vSurfacePosition;');
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvReveal = aReveal;\nvSurfacePosition = position;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying float vReveal;\nvarying vec3 vSurfacePosition;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      // Simple fitted sports shorts are a display material on the source skin.
      float shorts = smoothstep(0.650, 0.668, vSurfacePosition.y)
        * (1.0 - smoothstep(0.973, 0.981, vSurfacePosition.y))
        * (1.0 - smoothstep(0.170, 0.196, abs(vSurfacePosition.x)));
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.026, 0.040, 0.024), shorts);
      float reveal = smoothstep(0.06, 0.92, vReveal);
      diffuseColor.a *= 1.0 - reveal * 0.985;
    `);
  };
  material.customProgramCacheKey=()=> 'friendly-body-surface-v1';
  return material;
}

export function updateSurfaceMask(skinGeometry,parts,ids,reveal){
  const positions=skinGeometry.getAttribute('position');
  let attribute=skinGeometry.getAttribute('aReveal');
  if(!attribute||attribute.count!==positions.count){attribute=new THREE.Float32BufferAttribute(new Float32Array(positions.count),1);skinGeometry.setAttribute('aReveal',attribute);}
  const values=attribute.array;values.fill(0);
  if(reveal){
    const regions=parts.filter(mesh=>ids.has(mesh.userData.part.id)).map(mesh=>mesh.geometry.boundingBox);
    for(let i=0;i<positions.count;i++){
      const x=positions.getX(i),y=positions.getY(i);
      let mask=0;
      for(const box of regions){
        // Project each real structure onto the overlying skin. Retain a soft
        // boundary; keep the rest of the body fully covered.
        const dx=Math.max(box.min.x-x,0,x-box.max.x);
        const dy=Math.max(box.min.y-y,0,y-box.max.y);
        const distance=Math.hypot(dx,dy);
        const value=1-THREE.MathUtils.smoothstep(distance,0.005,0.028);
        mask=Math.max(mask,value);if(mask>.999)break;
      }
      values[i]=mask;
    }
  }
  attribute.needsUpdate=true;
  return attribute;
}
