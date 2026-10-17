import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {poseHubPaths, poseHubConfig, assertOutsidePoseHub} from '../pose-hub-paths.mjs';

// Keep all disposable fixtures on the project drive, including on Windows.
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const temporary = path.join(repo, 'output');
fs.mkdirSync(temporary, {recursive: true});
const fixture = fs.mkdtempSync(path.join(temporary, 'pose-hub-paths-test-'));
const put = (name, text = '') => {const file = path.join(fixture, name); fs.mkdirSync(path.dirname(file), {recursive: true}); fs.writeFileSync(file, text);};
for (const name of ['MIGRATION.md', 'drill-anim/lib/boot.mjs', 'runtime/src/viewer.js', 'vite.config.js']) put(name);
put('drill-anim/lib/config.mjs', `export const config=()=>({app_dir:process.env.APP_DIR}); export const loadTheme=()=>({});`);
const previous = {hub: process.env.POSE_HUB_DIR, app: process.env.APP_DIR};

test.after(() => {
  for (const [key, value] of [['POSE_HUB_DIR', previous.hub], ['APP_DIR', previous.app]]) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
  // fixture is the freshly-created, resolved child, never an arbitrary caller path.
  assert.equal(path.dirname(fs.realpathSync.native(fixture)), fs.realpathSync.native(temporary));
  fs.rmSync(fixture, {recursive: true});
});

test('requires an explicit migrated checkout instead of a cwd-relative fallback', () => {
  assert.throws(() => poseHubPaths(''), /Set POSE_HUB_DIR/);
  assert.throws(() => poseHubPaths('../3D-Pose-Hub'), /absolute/);
  assert.throws(() => poseHubPaths(repo), /Invalid POSE_HUB_DIR/);
  assert.equal(poseHubPaths(fixture).drillAnim, path.join(fs.realpathSync.native(fixture), 'drill-anim'));
});

test('all migrated command entry points fail before writes when POSE_HUB_DIR is missing', () => {
  const env = {...process.env}; delete env.POSE_HUB_DIR;
  const before = fs.readdirSync(fixture);
  for (const command of ['reframe-library.mjs', ...['render', 'export-glb', 'derive-collarfix', 'verify-collarfix', 'shoot-app', 'closeup'].map(name => `tools/flare-body-swap/${name}.mjs`)]) {
    const result = spawnSync(process.execPath, [path.join(repo, command)], {cwd: fixture, env, encoding: 'utf8', windowsHide: true});
    assert.notEqual(result.status, 0, command);
    assert.match(result.stderr, /Set POSE_HUB_DIR/, command);
    assert.deepEqual(fs.readdirSync(fixture), before, command);
  }
});

test('boot config must target Pose-Hub root, with runtime under that root', async () => {
  const paths = poseHubPaths(fixture);
  process.env.APP_DIR = fixture;
  assert.equal((await poseHubConfig(paths)).C.app_dir, fixture);
  process.env.APP_DIR = repo;
  await assert.rejects(() => poseHubConfig(paths), /app_dir must resolve/);
});

test('protects the external checkout, including outputs through a junction', () => {
  const paths = poseHubPaths(fixture);
  assert.throws(() => assertOutsidePoseHub(path.join(fixture, 'new/nested.glb'), paths), /read-only/);
  assert.doesNotThrow(() => assertOutsidePoseHub(path.join(temporary, 'elsewhere.glb'), paths));
  const junction = path.join(fixture, 'alias');
  fs.symlinkSync(path.join(fixture, 'runtime'), junction, process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => assertOutsidePoseHub(path.join(junction, 'new.glb'), paths), /read-only/);
});

test('bridges only the two retained FlareLab files using exact URLs and original bytes', async () => {
  process.env.POSE_HUB_DIR = fixture;
  const {flareInputs, provideFlareInputs} = await import('./pose-hub.mjs');
  const spec = {bakedClipPath: '/app/scene/source/coach/flare-coach-v41-animated.glb', bakedPhasePath: '/app/scene/src/v41-phases.json'};
  assert.throws(() => flareInputs({...spec, bakedClipPath: '/../AGENTS.md'}), /Unrecognized/);
  const routes = [];
  const page = {url: () => 'http://127.0.0.1:8848/?inspect', route: async (url, handler) => {
    await handler({fulfill: async response => routes.push({url, ...response})});
  }};
  await provideFlareInputs(page, spec);
  assert.equal(routes.length, 2);
  for (const [index, input] of flareInputs(spec).entries()) {
    assert.equal(routes[index].url, 'http://127.0.0.1:8848' + input.url);
    assert.deepEqual(routes[index].body, fs.readFileSync(input.path));
    assert.equal(routes[index].contentType, input.contentType);
  }
});
