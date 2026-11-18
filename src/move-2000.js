// 2000 editor mode. Imported first by main.js, before any module touches storage.
// Open with ?move=2000 (or a build with VITE_DEFAULT_MOVE=2000; ?move=flare switches back).
// Everything the editor stores in this mode lives under its own "b2000:" localStorage namespace,
// so the Flare (托马斯) personal steps, drafts, K frames and formal selection are never read or written.
const params = typeof location !== 'undefined' ? new URLSearchParams(location.search) : new URLSearchParams();
const requested = params.get('move');
export const IS_2000 = requested ? requested === '2000' : import.meta.env?.VITE_DEFAULT_MOVE === '2000';
export const MOVE_2000_TITLE = '2000 · 姿势/动画编辑';
const PREFIX = 'b2000:';

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

if (IS_2000) {
  namespaceStorage();
  // The Flare smooth-loop playback carries Flare-specific hand-over tuning; 2000 plays the
  // editor's own key-to-key interpolation (the same path K frames and routes edit).
  globalThis.__COACH_SMOOTH_OFF = true;
  if (typeof document !== 'undefined') {
    document.title = MOVE_2000_TITLE;
    document.documentElement.dataset.move = '2000';
    const swap = text => text.replace(/托马斯全旋/g, '2000').replace(/托马斯/g, '2000').replace(/Flare 首页/g, '2000 首页');
    const fix = node => {
      if (node.nodeType === 3) { if (node.data.includes('托马斯')) node.data = swap(node.data); return; }
      if (node.nodeType !== 1) return;
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      for (let text = walker.nextNode(); text; text = walker.nextNode()) if (text.data.includes('托马斯')) text.data = swap(text.data);
    };
    const start = () => {
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
