import * as THREE from 'three';

// A multi-material garment is a named glTF group containing primitives whose
// generated names need not include the garment's authored node name.
export function isCoveredActorPart(mesh) {
  for (let node = mesh; node; node = node.parent) {
    if (node.name === 'Coach_Body' || /^Coach_Training_(Tee|Shorts)(_|$)/.test(node.name)) return true;
  }
  return false;
}

const HEAD_PARTS = new Set(['Coach_Face', 'Coach_Hair', 'Coach_Brows', 'Coach_Eyes', 'Coach_Eye_Glints',
  'Coach_Lower_Gums', 'Coach_Lower_Teeth', 'Coach_Upper_Gums', 'Coach_Upper_Teeth', 'Coach_Tongue']);
export function isOriginalActorHeadPart(mesh) {
  for (let node = mesh; node; node = node.parent) if (HEAD_PARTS.has(node.name)) return true;
  return false;
}

// Restore the same Snow skin beneath the garments. The source actor, rig,
// authored poses and default outfit remain intact; no second actor is posed.
export function attachStudyBody(coach, study) {
  return attachStudyPart(coach, study, 'Coach_Body', 'Coach_Body', 'Coach_Study_Body', 'studySkin');
}

export function attachStudyHead(coach, study) {
  return attachStudyPart(coach, study, 'Coach_Study_Head', 'Coach_Body', 'Coach_Study_Head', 'studyHead');
}

function attachStudyPart(coach, study, sourceName, referenceName, name, flag) {
  coach.updateMatrixWorld(true); study.updateMatrixWorld(true);
  const bones = new Map();
  coach.traverse(object => { if (object.isBone) bones.set(object.name, object); });
  const original = coach.getObjectByName(referenceName);
  const source = study.getObjectByName(sourceName);
  if (!original?.isSkinnedMesh || !source?.isSkinnedMesh || source.skeleton.bones.length !== 20) {
    throw new Error('study_skin_missing');
  }
  const bound = source.skeleton.bones.map(bone => {
    const target = bones.get(bone.name);
    if (!target) throw new Error('study_bone_missing');
    if (bone.matrixWorld.elements.some((value, index) => Math.abs(value - target.matrixWorld.elements[index]) > 1e-5)) {
      throw new Error('study_bind_pose_mismatch');
    }
    return target;
  });
  const mesh = new THREE.SkinnedMesh(source.geometry, source.material);
  mesh.name = name; mesh.userData[flag] = true;
  const local = original.parent.matrixWorld.clone().invert().multiply(source.matrixWorld);
  local.decompose(mesh.position, mesh.quaternion, mesh.scale);
  original.parent.add(mesh); coach.updateMatrixWorld(true);
  mesh.bind(new THREE.Skeleton(bound, source.skeleton.boneInverses.map(matrix => matrix.clone())), source.bindMatrix.clone());
  mesh.visible = false; mesh.frustumCulled = false;
  return mesh;
}
