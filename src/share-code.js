// Short share code for an animation backup (动画编辑 → 复制分享码).
// Code = "B2K1." + base64url(deflate-raw(JSON payload)). The payload keeps only what differs from the bundled
// keyframes of this move (changed original frames, by field), all K frames / curves / routes / settings, and drops
// the transition document's `base` when it is just the sequence's own frames. Decoding against the same bundled
// keyframes gives back the full backup exactly. tools/move-2000/share_code.py reads the same format.
export const SHARE_CODE_PREFIX = 'B2K1.';
const FORMAT = 'b2k-share';
const json = value => JSON.stringify(value);
const clone = value => structuredClone(value);
const canonical = value => JSON.stringify(value, (_, child) => child && typeof child === 'object' && !Array.isArray(child)
  ? Object.fromEntries(Object.keys(child).sort().map(key => [key, child[key]])) : child);
const baseOf = sequence => ({ period: sequence.period, steps: sequence.steps.map(step => ({ id: step.id, pose: clone(step.pose) })) });

export function isShareCode(text) {
  return typeof text === 'string' && text.trim().replace(/\s+/g, '').startsWith(SHARE_CODE_PREFIX);
}

function diffObject(base, next) {
  const set = {}, del = [];
  for (const key of Object.keys(next)) if (!Object.hasOwn(base, key) || json(base[key]) !== json(next[key])) set[key] = next[key];
  for (const key of Object.keys(base)) if (!Object.hasOwn(next, key)) del.push(key);
  return { ...(Object.keys(set).length ? { s: set } : {}), ...(del.length ? { d: del } : {}) };
}
function patchObject(base, diff = {}) {
  const out = clone(base);
  for (const key of diff.d || []) delete out[key];
  for (const [key, value] of Object.entries(diff.s || {})) out[key] = clone(value);
  return out;
}

/** Build the compact payload object (exported for tests). */
export function sharePayload(backup, bundled, move) {
  if (!backup?.sequence?.steps) throw new Error('请先生成完整动画备份。');
  const { sequence, move: _ignored, ...document } = backup;
  const { steps, ...top } = sequence, { steps: baseSteps, ...baseTop } = bundled;
  const payload = { f: FORMAT, v: 1, move, base: bundled.source?.revision ?? null, seq: diffObject(baseTop, top) };
  if (steps.length === baseSteps.length) {
    const changed = {};
    steps.forEach((step, index) => { const diff = diffObject(baseSteps[index], step); if (diff.s || diff.d) changed[index] = diff; });
    payload.steps = changed;
  } else payload.fullSteps = steps;
  if (Object.hasOwn(document, 'base') && canonical(document.base) === canonical(baseOf(sequence))) { delete document.base; payload.docBase = 1; }
  payload.doc = document;
  return payload;
}
export function restorePayload(payload, bundled) {
  if (payload?.f !== FORMAT || payload.v !== 1) throw new Error('分享码格式无法识别。');
  const expected = bundled.source?.revision ?? null;
  if (payload.base !== expected) throw new Error(`这份分享码基于 ${payload.base || '另一版'} 关键帧，当前页面是 ${expected || '另一版'}，无法安全还原。`);
  const { steps: baseSteps, ...baseTop } = bundled;
  const steps = payload.fullSteps ? clone(payload.fullSteps) : baseSteps.map((step, index) => patchObject(step, payload.steps?.[index]));
  const top = patchObject(baseTop, payload.seq), ordered = {};
  for (const key of Object.keys(bundled)) if (key === 'steps') ordered.steps = steps; else if (Object.hasOwn(top, key)) ordered[key] = top[key];
  for (const key of Object.keys(top)) if (!Object.hasOwn(ordered, key)) ordered[key] = top[key];
  const document = clone(payload.doc || {});
  if (payload.docBase) {
    const rebuilt = {};let placed = false;
    for (const [key, value] of Object.entries(document)) { rebuilt[key] = value; if (key === 'version') { rebuilt.base = baseOf(ordered);placed = true; } }
    if (!placed) rebuilt.base = baseOf(ordered);
    return { ...rebuilt, sequence: ordered, ...(payload.move ? { move: payload.move } : {}) };
  }
  return { ...document, sequence: ordered, ...(payload.move ? { move: payload.move } : {}) };
}

function base64url(bytes) {
  let binary = '';for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function unbase64url(text) {
  const clean = text.replace(/-/g, '+').replace(/_/g, '/'), padded = clean + '='.repeat((4 - clean.length % 4) % 4);
  const binary = atob(padded), bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
async function pipe(bytes, stream) {
  const out = new Response(new Blob([bytes]).stream().pipeThrough(stream));
  return new Uint8Array(await out.arrayBuffer());
}

export async function encodeShareCode(backup, bundled, move) {
  const text = JSON.stringify(sharePayload(backup, bundled, move));
  return SHARE_CODE_PREFIX + base64url(await pipe(new TextEncoder().encode(text), new CompressionStream('deflate-raw')));
}
export async function decodeShareCode(code, bundled) {
  const body = String(code).trim().replace(/\s+/g, '');
  if (!body.startsWith(SHARE_CODE_PREFIX)) throw new Error('这不是分享码。');
  let payload;
  try { payload = JSON.parse(new TextDecoder().decode(await pipe(unbase64url(body.slice(SHARE_CODE_PREFIX.length)), new DecompressionStream('deflate-raw')))); }
  catch { throw new Error('分享码不完整或已损坏，请重新复制整段。'); }
  return payload;
}
