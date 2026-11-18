// Move switch for the editor: 托马斯 (Flare, default) or 2000. Imported first by main.js, before any module
// touches storage. The header switch (or ?move=2000, kept for old links) picks the move; the choice lives in
// sessionStorage for this tab only, so a fresh page still opens 托马斯.
// Everything the editor stores in 2000 mode lives under its own "b2000:" localStorage namespace, so the 托马斯
// personal steps, drafts, K frames and formal selection are never read or written.
const PREFIX = 'b2000:';
const SESSION_KEY = 'editor-move';
export const MOVES = { flare: '托马斯', 2000: '2000' };
const nativeStorage = globalThis.Storage?.prototype
  ? { get: globalThis.Storage.prototype.getItem, set: globalThis.Storage.prototype.setItem }
  : null;

function session() { try { return globalThis.sessionStorage ?? null; } catch { return null; } }
function sessionMove() {
  const store = session();
  try { return store && nativeStorage ? nativeStorage.get.call(store, SESSION_KEY) : null; } catch { return null; }
}
const params = typeof location !== 'undefined' ? new URLSearchParams(location.search) : new URLSearchParams();
const requested = params.get('move') ?? sessionMove() ?? import.meta.env?.VITE_DEFAULT_MOVE ?? 'flare';
export const IS_2000 = requested === '2000';
export const CURRENT_MOVE = IS_2000 ? '2000' : 'flare';
export const MOVE_2000_TITLE = '2000 · 姿势/动画编辑';

/** Which move a backup / export / pose library belongs to. Untagged files are 托马斯 unless they carry 2000 frames. */
export function moveOf(data) {
  if (typeof data?.move === 'string') return data.move === '2000' ? '2000' : 'flare';
  const kind = data?.sequence?.source?.kind ?? data?.source?.kind;
  if (kind === 'move-2000') return '2000';
  if (data?.format === 'flare-pose-library' && Array.isArray(data.steps) &&
      data.steps.some(step => typeof step?.sourcePreset === 'string' && step.sourcePreset.startsWith('b2000-'))) return '2000';
  return 'flare';
}
/** Throw a clear message when a file or code from the other move is pasted here (keeps 托马斯 and 2000 apart). */
export function assertSameMove(data) {
  const move = moveOf(data);
  if (move === CURRENT_MOVE) return;
  throw new Error(move === '2000'
    ? '这是 2000 的动作数据，请先点顶部「2000」切换后再导入；托马斯数据未改动。'
    : '这是托马斯的动作数据，请先点顶部「托马斯」切换后再导入；2000 数据未改动。');
}
/** Tag what this page exports. 托马斯 exports stay exactly as before (no extra field). */
export function tagMove(data) { return IS_2000 ? { ...data, move: '2000' } : data; }

/** Reload the editor on the other move without editing the address by hand. */
export function switchMove(move) {
  if (move === CURRENT_MOVE || !Object.hasOwn(MOVES, move)) return;
  const store = session();
  try { if (store && nativeStorage) nativeStorage.set.call(store, SESSION_KEY, move); } catch { /* the URL below still carries the choice */ }
  const url = new URL(location.href);
  url.searchParams.delete('move');
  if (!store) url.searchParams.set('move', move);
  location.assign(url.href);
}

function namespaceStorage() {
  const proto = globalThis.Storage?.prototype;
  if (!proto || proto.__b2000) return;
  const { getItem, setItem, removeItem, key } = proto;
  const lengthGetter = Object.getOwnPropertyDescriptor(proto, 'length').get;
  const own = storage => {
    const keys = [];
    const count = lengthGetter.call(storage);
    for (let i = 0; i < count; i++) { const name = key.call(storage, i); if (name?.startsWith(PREFIX)) keys.push(name.slice(PREFIX.length)); }
    return keys;
  };
  Object.defineProperties(proto, {
    __b2000: { value: true },
    getItem: { value(name) { return getItem.call(this, PREFIX + name); }, configurable: true, writable: true },
    setItem: { value(name, value) { return setItem.call(this, PREFIX + name, value); }, configurable: true, writable: true },
    removeItem: { value(name) { return removeItem.call(this, PREFIX + name); }, configurable: true, writable: true },
    key: { value(index) { return own(this)[index] ?? null; }, configurable: true, writable: true },
    clear: { value() { for (const name of own(this)) removeItem.call(this, PREFIX + name); }, configurable: true, writable: true },
    length: { get() { return own(this).length; }, configurable: true },
  });
}

if (typeof document !== 'undefined') document.documentElement.dataset.move = CURRENT_MOVE;

if (IS_2000) {
  namespaceStorage();
  // The Flare smooth-loop playback carries Flare-specific hand-over tuning; 2000 plays the
  // editor's own key-to-key interpolation (the same path K frames and routes edit).
  globalThis.__COACH_SMOOTH_OFF = true;
  if (typeof document !== 'undefined') {
    document.title = MOVE_2000_TITLE;
    const swap = text => text.replace(/托马斯全旋/g, '2000').replace(/托马斯/g, '2000').replace(/Flare 首页/g, '2000 首页');
    const keep = node => node.parentElement?.closest('[data-move-keep]');
    const fix = node => {
      if (node.nodeType === 3) { if (node.data.includes('托马斯') && !keep(node)) node.data = swap(node.data); return; }
      if (node.nodeType !== 1 || node.closest?.('[data-move-keep]')) return;
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      for (let text = walker.nextNode(); text; text = walker.nextNode()) if (text.data.includes('托马斯') && !keep(text)) text.data = swap(text.data);
    };
    const start = () => {
      // Only the 托马斯-only controls are hidden: v42/v41 replace the animation with 托马斯 frames, the
      // 9-phase strip and the 数学轨迹 version selector are built for the 托马斯 cycle.
      const style = document.createElement('style');
      style.textContent = '[data-b2000-hidden],html[data-move="2000"] .motion-source{display:none!important}';
      document.head.append(style);
      fix(document.body);
      new MutationObserver(records => {
        for (const record of records) {
          if (record.type === 'characterData') fix(record.target);
          else for (const node of record.addedNodes) fix(node);
        }
      }).observe(document.body, { subtree: true, childList: true, characterData: true });
    };
    if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
  }
}
