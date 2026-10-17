import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {poseHubPaths, poseHubConfig} from '../pose-hub-paths.mjs';

export const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const HUB = poseHubPaths();
export const DA = HUB.drillAnim;
export const loadConfig = () => poseHubConfig(HUB);
export const loadSpec = () => JSON.parse(fs.readFileSync(path.join(DA, 'batches/training-human-v2-20261013/specs/flare-v41-loop.json'), 'utf8'));

// These two frozen FlareLab inputs were intentionally not migrated to runtime/.
// Only these exact URLs are bridged; the Pose-Hub server cannot read arbitrary App files.
export function flareInputs(spec, repo = REPO) {
  const allowed = {
    '/app/scene/source/coach/flare-coach-v41-animated.glb': 'model/gltf-binary',
    '/app/scene/src/v41-phases.json': 'application/json',
  };
  return ['bakedClipPath', 'bakedPhasePath'].filter(key => spec[key]).map(key => {
    const url = spec[key];
    if (!Object.hasOwn(allowed, url)) throw new Error('Unrecognized frozen FlareLab input: ' + url);
    return {url, path: path.join(repo, url.slice(1)), contentType: allowed[url]};
  });
}

export async function provideFlareInputs(page, spec) {
  for (const input of flareInputs(spec)) {
    // Read before installing the route: missing inputs fail before the adapter runs.
    const body = fs.readFileSync(input.path);
    await page.route(new URL(input.url, page.url()).href, route => route.fulfill({body, contentType: input.contentType}));
  }
}
