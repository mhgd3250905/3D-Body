import { Quaternion, Vector3 } from 'three';

export function createV5Pose(bones, motion, wrists) {
  const mainNames = Object.keys(motion.frames[0].q);
  const names = [...mainNames, ...wrists.bones];
  const count = motion.count;
  if (motion.frames.length !== count || wrists.frames.length !== count ||
      wrists.count !== count || wrists.fps !== motion.fps || wrists.bones.length !== 16 ||
      names.some(name => !bones[name]) || new Set(names).size !== names.length) {
    throw Error('V5 animation and wristfix tracks do not match the loaded rig');
  }
  const clips = motion.frames.map(({ q, p }, index) => ({
    rotations: [...mainNames.map(name => q[name]), ...wrists.frames[index]]
      .map(values => new Quaternion().fromArray(values).normalize()),
    pelvis: new Vector3().fromArray(p),
  }));
  const joints = names.map(name => bones[name]);
  const pelvis = bones.pelvis.position;

  function apply(frame) {
    const current = Math.floor(frame);
    const a = clips[current];
    const b = clips[(current + 1) % count];
    const fraction = frame - current;
    for (let i = 0; i < joints.length; i++) {
      joints[i].quaternion.slerpQuaternions(a.rotations[i], b.rotations[i], fraction);
    }
    pelvis.lerpVectors(a.pelvis, b.pelvis, fraction);
  }

  return { apply, mainNames };
}
