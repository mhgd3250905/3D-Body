// Run with root npm ci installed; writes only ignored output/ validation files.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'output/website-pr-audit/core.mjs');
mkdirSync(dirname(out), { recursive: true });
execFileSync(process.execPath, [resolve(root, 'node_modules/esbuild/bin/esbuild'), resolve(root, 'webapp/src/core.js'), '--bundle', '--platform=node', '--format=esm', '--outfile=' + out]);
const { Store, validState } = await import(pathToFileURL(out));
const saved = new Map();
globalThis.localStorage = { getItem: (k) => saved.get(k) ?? null, setItem: (k, v) => saved.set(k, v) };
const store = new Store();
store.acceptSafety();
const good = structuredClone(store.s);
good.sessions = [{ id: 'one', drillId: 'deltoids-A', startedAt: '2026-10-12T01:00:00Z', endedAt: '2026-10-12T01:01:00Z', activeSeconds: 30, completedSets: 1, plannedSets: 1, pain: false, completed: true }];
assert.ok(validState(good));
store.importJSON(JSON.stringify(good));
const before = saved.get('flare.learning.v1');
const mutations = [
  (s) => s.sessions[0].activeSeconds = -1,
  (s) => s.sessions[0].activeSeconds = 999,
  (s) => s.sessions[0].endedAt = 'broken',
  (s) => s.sessions[0].completedSets = 2,
  (s) => s.sessions[0].completed = 'yes',
  (s) => s.sessions.push(structuredClone(s.sessions[0])),
  (s) => s.today.date = '2026-02-30',
  (s) => s.today.ids = ['deltoids-A', 'deltoids-A'],
  (s) => s.settings.sound = 'on',
  (s) => s.lastTime = '5',
  (s) => s.startStage = 99,
  (s) => s.assessmentGrades = { wrist: 4 },
  (s) => s.web.speed = '0.5',
  (s) => s.today.ids = ['constructor'],
  (s) => s.gateReports = { constructor: true },
  (s) => s.sessions[0].startedAt = '1',
  (s) => s.sessions[0].drillId = ['deltoids-A'],
  (s) => s.today.ids = [['deltoids-A']],
];
for (const mutate of mutations) {
  const bad = structuredClone(good); mutate(bad);
  assert.equal(validState(bad), false);
  assert.throws(() => store.importJSON(JSON.stringify(bad)));
  assert.equal(saved.get('flare.learning.v1'), before, 'failed imports must preserve saved progress');
  assert.deepEqual(store.s, good, 'failed imports must preserve in-memory progress');
}
const appBackup = structuredClone(good); delete appBackup.web;
assert.ok(validState(appBackup), 'App backup has no web-specific settings');
store.importJSON(JSON.stringify(appBackup));
assert.equal(store.s.sessions.length, 1);
console.log(`backup validation passed: ${mutations.length} rejected corrupt states; valid App backup imported`);
