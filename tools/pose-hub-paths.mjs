// Explicit, read-only dependency on the migrated Pose-Hub checkout.
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

export function poseHubPaths(directory = process.env.POSE_HUB_DIR) {
  if (!directory?.trim()) throw new Error('Set POSE_HUB_DIR to a 3D-Pose-Hub checkout; no local renderer fallback is used.');
  if (!path.isAbsolute(directory)) throw new Error('POSE_HUB_DIR must be an absolute checkout path.');
  const root = fs.realpathSync.native(directory);
  for (const name of ['MIGRATION.md', 'drill-anim/lib/config.mjs', 'drill-anim/lib/boot.mjs', 'runtime/src/viewer.js', 'vite.config.js']) {
    if (!fs.statSync(path.join(root, name), {throwIfNoEntry: false})?.isFile()) throw new Error(`Invalid POSE_HUB_DIR: missing ${name}`);
  }
  return {root, drillAnim: path.join(root, 'drill-anim'), runtime: path.join(root, 'runtime')};
}

export async function poseHubConfig(paths) {
  const module = await import(pathToFileURL(path.join(paths.drillAnim, 'lib/config.mjs')).href);
  const C = module.config();
  if (!C.app_dir || fs.realpathSync.native(C.app_dir) !== paths.root) {
    throw new Error('Pose-Hub config app_dir must resolve to POSE_HUB_DIR (Vite serves runtime/); update that checkout config or APP_DIR.');
  }
  return {...module, C};
}

// Resolve junctions as well as symlinks, including nonexistent output leaves.
export function physicalPath(file) {
  const absolute = path.resolve(file);
  return fs.existsSync(absolute) ? fs.realpathSync.native(absolute) : path.join(physicalPath(path.dirname(absolute)), path.basename(absolute));
}

export function assertOutsidePoseHub(file, paths) {
  const relative = path.relative(paths.root, physicalPath(file));
  if (!relative || (!relative.startsWith('..' + path.sep) && relative !== '..' && !path.isAbsolute(relative))) {
    throw new Error('Output must stay outside the read-only Pose-Hub checkout: ' + file);
  }
}
