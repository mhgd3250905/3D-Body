// Share code round trip (no browser): full 2000 backup -> 复制分享码 -> 粘贴还原 is lossless in JS and in
// tools/move-2000/share_code.py, from_editor.py gives the same keys for both formats, and the move tag guards hold.
// Usage: node tools/verify-share-code.mjs   (python3 + numpy needed for the from_editor.py part; SKIP_PY=1 skips it)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

globalThis.location = { search: '?move=2000', href: 'http://127.0.0.1/?move=2000' }; // load the modules in 2000 mode
const root = fileURLToPath(new URL('../', import.meta.url)), out = path.join(root, 'output/share-code');
fs.mkdirSync(out, { recursive: true });
const { IS_2000, moveOf, assertSameMove, tagMove } = await import('../src/move-2000.js');
const { OFFICIAL_FLARE_SEQUENCE, updateOfficialFrame, validSequence } = await import('../src/official-poses.js');
const { createTransitionEdits, validateTransitionEdits } = await import('../src/transition-edits.js');
const { encodeShareCode, decodeShareCode, restorePayload, isShareCode } = await import('../src/share-code.js');

const checks = [];
const check = (name, pass, detail) => { checks.push({ name, pass: !!pass, ...(detail === undefined ? {} : { detail }) }); if (!pass) throw new Error(name + (detail ? ' ' + JSON.stringify(detail) : '')); };
const canonical = value => JSON.stringify(value, (_, child) => child && typeof child === 'object' && !Array.isArray(child)
  ? Object.fromEntries(Object.keys(child).sort().map(key => [key, child[key]])) : child);
const clone = value => structuredClone(value);
const nudge = (pose, dy, dx = 0) => { const next = clone(pose); next.pelvis[1] += dy; next.pelvis[0] += dx; next.limbs.left.wrist[2] += dx; return next; };

check('modules load in 2000 mode', IS_2000 && OFFICIAL_FLARE_SEQUENCE.source.kind === 'move-2000' && OFFICIAL_FLARE_SEQUENCE.steps.length === 39);
const bundled = OFFICIAL_FLARE_SEQUENCE;

// 1) untouched animation: the code is tiny and restores the same backup
const untouched = tagMove({ ...createTransitionEdits(bundled), sequence: clone(bundled) });
const fullUntouched = JSON.stringify(untouched);
const codeUntouched = await encodeShareCode(untouched, bundled, '2000');
const backUntouched = restorePayload(await decodeShareCode(codeUntouched), bundled);
check('untouched: lossless', canonical(backUntouched) === canonical(untouched));
check('untouched: code is short', codeUntouched.length < 400, { code: codeUntouched.length, json: fullUntouched.length });

// 2) edited: two original frames changed (one is the linked loop end), one renamed, three K frames, settings changed
let sequence = updateOfficialFrame(bundled, 12, nudge(bundled.steps[12].pose, 0.031, -0.012));
sequence = updateOfficialFrame(sequence, 0, nudge(sequence.steps[0].pose, -0.004));
sequence.steps[20].name = '叠手并腿旋转 · 开哥改';
check('edited sequence is a valid 2000 sequence', validSequence(sequence));
let document = createTransitionEdits(sequence);
document = { ...document, legPath: 'linear', interpolation: 'linear', points: [
  { id: 'k-a', segment: 5, at: 0.5, name: 'K 06 → 07 · 50.0%', pose: nudge(sequence.steps[5].pose, 0.02, 0.01) },
  { id: 'k-b', segment: 17, at: 0.25, name: '中间帧：手更外', pose: nudge(sequence.steps[17].pose, -0.01, 0.02) },
  { id: 'k-c', segment: 30, at: 0.75, pose: nudge(sequence.steps[31].pose, 0.005), skipped: true },
], skippedSteps: [33] };
document = validateTransitionEdits(document, sequence);
const edited = tagMove({ ...document, sequence });
const fullEdited = JSON.stringify(edited);
const codeEdited = await encodeShareCode(edited, bundled, '2000');
const payloadEdited = await decodeShareCode(codeEdited);
const backEdited = restorePayload(payloadEdited, bundled);
check('edited: lossless', canonical(backEdited) === canonical(edited));
check('edited: only changed frames are carried', Object.keys(payloadEdited.steps).map(Number).sort((a, b) => a - b).join() === '0,12,20,38', Object.keys(payloadEdited.steps));
check('edited: code much shorter than full JSON', codeEdited.length * 5 < fullEdited.length, { code: codeEdited.length, json: fullEdited.length });
check('edited: restored document accepted by the editor', !!validateTransitionEdits((({ sequence: _s, move: _m, ...rest }) => rest)(backEdited), backEdited.sequence));
check('isShareCode recognises codes with line breaks', isShareCode(codeEdited.slice(0, 40) + '\n' + codeEdited.slice(40)) && !isShareCode(fullEdited));
const wrapped = restorePayload(await decodeShareCode(codeEdited.slice(0, 50) + '\n  ' + codeEdited.slice(50)), bundled);
check('code survives chat line wrapping', canonical(wrapped) === canonical(edited));

// 3) move guards: 2000 data is tagged; 托马斯 data is refused here and vice versa
check('2000 backup tagged move 2000', edited.move === '2000' && moveOf(edited) === '2000' && payloadEdited.move === '2000');
let refused = '';
try { assertSameMove({ format: 'flare-transition-edits', version: 1, points: [], sequence: { source: { kind: 'saved-loop-9-16' } } }); } catch (error) { refused = error.message; }
check('托马斯 backup refused in 2000 mode', refused.includes('托马斯'), refused);
let badBase = '';
try { restorePayload({ ...payloadEdited, base: 'pose-hub-2000-r0' }, bundled); } catch (error) { badBase = error.message; }
check('code from another keyframe revision is refused', badBase.includes('pose-hub-2000-r0'), badBase);
let broken = '';
try { await decodeShareCode(codeEdited.slice(0, -12)); } catch (error) { broken = error.message; }
check('truncated code is refused', broken.includes('不完整'), broken);

fs.writeFileSync(path.join(out, 'full.json'), fullEdited);
fs.writeFileSync(path.join(out, 'code.txt'), codeEdited);
fs.writeFileSync(path.join(out, 'code-untouched.txt'), codeUntouched);

// 4) Python: share_code.py restores the same backup; from_editor.py gives identical keys for both formats
if (process.env.SKIP_PY !== '1') {
  const py = process.env.PYTHON || 'python3', tools = path.join(root, 'tools/move-2000');
  const restored = JSON.parse(execFileSync(py, [path.join(tools, 'share_code.py'), path.join(out, 'code.txt')], { encoding: 'utf8', maxBuffer: 64 << 20 }));
  check('python share_code.py: lossless', canonical(restored) === canonical(edited));
  const inline = JSON.parse(execFileSync(py, [path.join(tools, 'share_code.py'), codeUntouched], { encoding: 'utf8', maxBuffer: 64 << 20 }));
  check('python share_code.py: inline code', canonical(inline) === canonical(untouched));
  const rig = path.join(root, 'public/coach/coach-rig.json');
  execFileSync(py, [path.join(tools, 'from_editor.py'), path.join(out, 'full.json'), rig, path.join(out, 'keys-full.json')]);
  execFileSync(py, [path.join(tools, 'from_editor.py'), path.join(out, 'code.txt'), rig, path.join(out, 'keys-code.json')]);
  const a = fs.readFileSync(path.join(out, 'keys-full.json'), 'utf8'), b = fs.readFileSync(path.join(out, 'keys-code.json'), 'utf8');
  const keys = JSON.parse(a).keys;
  check('from_editor.py: share code == full JSON (same numbers)', canonical(JSON.parse(a)) === canonical(JSON.parse(b)), { keys: keys.length });
  check('from_editor.py: 39 frames + 3 K frames', keys.length === 42 && keys.filter(key => key.kind === 'K').length === 3);
}
console.log(JSON.stringify({ pass: true, codeChars: codeEdited.length, fullJsonChars: fullEdited.length, untouchedCodeChars: codeUntouched.length, checks }, null, 1));
