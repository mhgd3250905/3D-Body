import * as C from './core.js';
import { createStage, stateAt, DUR, SEG, webglOK } from './stage.js';
import { createMannequin } from './mannequin.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pad2 = (n) => String(n).padStart(2, '0');
const store = new C.Store();
window.__store = store;
const S = store.s;
const SPEEDS = [0.25, 0.5, 0.75, 1];
const SIDE = { left: '左侧', right: '右侧', both: '双侧' };
const SUP = { both: '双手支撑', left: '左手支撑', right: '右手支撑' };
const SEC_LABEL = { support: '肩臂支撑', core: '核心协调', legs: '髋腿摆动' };
const I = {
  watch: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l5.5-3.5z"/></svg>',
  muscles: '<svg viewBox="0 0 24 24"><circle cx="12" cy="4.6" r="2.1"/><path d="M8 21l1.5-7.2L7 9.3 12 8l5 1.3-2.5 4.5L16 21"/></svg>',
  library: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
  today: '<svg viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4M8.5 15l2.3 2.2L15.5 13"/></svg>',
  path: '<svg viewBox="0 0 24 24"><circle cx="5" cy="18" r="2"/><circle cx="19" cy="6" r="2"/><path d="M7 18h6a3 3 0 0 0 0-6h-2a3 3 0 0 1 0-6h6"/></svg>',
  progress: '<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  settings: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24"><rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  timer: '<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9.5 2.5h5"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  left: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 5l-7 7 7 7"/></svg>',
};
const NAV = [
  ['watch', '动作', 'Motion', '1'], ['muscles', '肌群', 'Muscles', '2'], ['library', '训练库', 'Drills', '3'], ['today', '今日', 'Today', '4'],
  ['path', '路径', 'Path', '5'], ['progress', '记录', 'Log', '6'], ['settings', '设置', 'Settings', '7'],
];

/* ---------------- toast ---------------- */
let toastT = 0;
function toast(msg, undo) {
  const t = $('#toast'); t.innerHTML = `<span>${esc(msg)}</span>${undo ? '<button>撤销</button>' : ''}`;
  if (undo) t.querySelector('button').onclick = () => { undo(); t.classList.remove('on'); };
  t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), undo ? 5000 : 2400);
}

/* ---------------- routing ---------------- */
let route = 'watch';
const ui = { group: null, mGroup: null, tier: S.settings.tier, q: '', lTier: '', lSec: '', lGroup: '', pathStage: null, wTier: S.settings.tier };
function go() {
  const r = (location.hash.replace(/^#\/?/, '').split('?')[0]) || 'watch';
  route = NAV.some((n) => n[0] === r) ? r : 'watch';
  $$('.view').forEach((v) => v.classList.toggle('on', v.id === 'v-' + route));
  renderNav(); renderView();
  if (route === 'muscles') ensureBig();
  document.title = `${NAV.find((n) => n[0] === route)[1]} · FlareLab 网页版`;
}
addEventListener('hashchange', go);
function renderNav() {
  const n = store.todayIds.length;
  $('#nav').innerHTML = NAV.map(([id, t, en, k]) => `<a href="#/${id}" data-r="${id}" class="${route === id ? 'on' : ''}" title="${t} (${k})">${I[id]}<span class="t">${t}</span>${id === 'today' && n ? `<span class="badge">${n}</span>` : ''}<span class="en">${en}</span></a>`).join('');
  const days = store.weekDays(), td = store.trainingDays, today = store.today;
  $('#weekcard').innerHTML = `<div class="row"><span class="eyebrow">本周练习</span><span class="eyebrow">连续 <b>${store.streak}</b> 天</span></div>
    <div class="big" style="margin-top:10px">${store.weekTrainingDays}<small>/ ${S.settings.weeklyGoal} 天</small></div>
    <div class="dots">${days.map((d, i) => `<i class="${td.has(d) ? 'on' : ''} ${d === today ? 'today' : ''}">${'一二三四五六日'[i]}</i>`).join('')}</div>`;
}
function renderView() {
  if (route === 'watch') renderWatchInsp();
  if (route === 'muscles') renderMuscles();
  if (route === 'library') renderLibrary();
  if (route === 'today') renderToday();
  if (route === 'path') renderPath();
  if (route === 'progress') renderProgress();
  if (route === 'settings') renderSettings();
}
store.on(() => { renderNav(); if (route !== 'library') renderView(); else refreshLibraryBadges(); if (drawerId) renderDrawer(); });

/* ---------------- motion stage ---------------- */
let stage = null, mini = null, cur = stateAt(S.lastTime || 1.4);
const gl = webglOK();
function initStage() {
  const host = $('#stage');
  if (!gl) { host.classList.add('gl-failed'); $('#ldtxt').textContent = '当前浏览器无法使用 WebGL，3D 动作无法显示。阶段、肌群与训练内容仍可使用。'; renderSegs(); return; }
  stage = createStage(host, {
    speed: S.web.speed, xray: S.web.xray, time: S.lastTime || 1.4,
    onProgress: (p) => ($('#ldpct').textContent = Math.round(p * 100) + '%'),
    onReady: () => { host.classList.add('ready'); document.documentElement.dataset.ready = 'true'; },
    onError: () => { host.classList.add('gl-failed'); $('#ldtxt').textContent = '3D 暂时无法显示，请刷新页面重试。'; },
    onPhase: (st) => { cur = st; renderStTop(); if (route === 'watch') renderWatchInsp(); markSegs(); mini && mini.setPhase(st); },
    onTime: (t) => updateTimeUI(t),
    onPlay: (p) => { $('#playBtn').innerHTML = p ? I.pause : I.play; $('#hint').textContent = p ? '拖动旋转 · 滚轮缩放 · 暂停后点身体选肌群' : '点身体或右侧列表查看肌群 · 空格继续'; },
    onPick: (gid) => { if (gid) selectGroup(gid); },
  });
  stage.setQuality(S.web.quality);
  window.__stage = stage;
  $('#playBtn').innerHTML = I.pause;
  mini = createMannequin($('#miniStage'), { mode: 'mini', groups: C.groups, onPick: (gid) => gid && selectGroup(gid) });
  mini.setPhase(cur);
  renderSegs(); renderStTop(); syncControls();
}
function renderStTop() {
  const p = C.phases[cur.phase];
  $('#stTop').innerHTML = `<div class="num">${pad2(cur.phase + 1)}</div><h2>${esc(p.name)}</h2><div class="en">${C.PHASE_EN[cur.phase]}</div>
    <div class="tags"><span class="chip">${esc(p.detail)}</span><span class="chip"><i></i>${SUP[cur.support]}</span></div>`;
  $('#cnow').innerHTML = `<b>${pad2(cur.phase + 1)} · ${esc(p.name)}</b>${C.PHASE_EN[cur.phase]}${stage && stage.loop ? '<span class="lp">● 循环本阶段</span>' : ''}`;
}
function renderSegs() {
  $('#segs').innerHTML = C.phases.map((p, i) => {
    const s = SEG.filter((x) => x[0] === i).reduce((a, x) => a + (x[2] - x[1]), 0);
    return `<button data-i="${i}" style="flex:${s.toFixed(3)}" title="${esc(p.name)} (←/→)"><b>${pad2(i + 1)}</b><span>${esc(p.name)}</span><i class="fill"></i></button>`;
  }).join('');
  markSegs();
}
function markSegs() { $$('#segs button').forEach((b, i) => b.classList.toggle('on', i === cur.phase)); }
let lastSave = 0;
function updateTimeUI(t) {
  const el = $('#segs'); if (!el.offsetParent) return;
  // map time to the visual timeline (phase 0 tail folded into first segment)
  const btns = $$('#segs button'); const i = cur.phase; const b = btns[i];
  const segs = SEG.filter((x) => x[0] === i); const total = segs.reduce((a, x) => a + (x[2] - x[1]), 0);
  let into = 0; for (const s of segs) { if (t >= s[1] && t <= s[2] + 0.02) { into += t - s[1]; break; } into += s[2] - s[1]; }
  if (i === 0 && t >= SEG[8][1]) into = t - SEG[8][1];
  const f = Math.min(1, Math.max(0, into / total));
  btns.forEach((x, k) => (x.querySelector('.fill').style.width = k < i ? '100%' : k === i ? (f * 100).toFixed(1) + '%' : '0'));
  const r = el.getBoundingClientRect(), br = b.getBoundingClientRect();
  $('#phead').style.left = (br.left - r.left + br.width * f - 1).toFixed(1) + 'px';
  $('#tread').innerHTML = `<b>${t.toFixed(2)}</b> s`;
  const now = performance.now(); if (now - lastSave > 4000 && store.s.safetyAccepted) { lastSave = now; store.s.lastTime = Math.min(9, +t.toFixed(3)); try { localStorage.setItem('flare.learning.v1', JSON.stringify(store.s)); } catch (e) {} }
}
function syncControls() {
  $('#speedSeg').innerHTML = SPEEDS.map((s, i) => `<button data-s="${s}" class="${stage && stage.speed === s ? 'on' : ''}" title="速度 (${i + 1})">${s}×</button>`).join('');
  $('#xrayBtn').classList.toggle('on', !!(stage && stage.xray));
  $('#loopBtn').classList.toggle('on', !!(stage && stage.loop));
}
$('#playBtn').onclick = () => stage && stage.toggle();
$('#segs').onclick = (e) => { const b = e.target.closest('button'); if (b && stage) stage.seekPhase(+b.dataset.i); };
$('#speedSeg').onclick = (e) => { const b = e.target.closest('button'); if (b) setSpeed(+b.dataset.s); };
function setSpeed(s) { if (!stage) return; stage.setSpeed(s); store.setWeb({ speed: s }); if ([0.25, 0.5, 1].includes(s)) store.s.settings.speed = s; syncControls(); toast(`播放速度 ${s}×`); }
$('#xrayBtn').onclick = () => toggleXray();
function toggleXray() { if (!stage) return; stage.setXray(!stage.xray); store.setWeb({ xray: stage.xray }); syncControls(); }
$('#loopBtn').onclick = () => toggleLoop();
function toggleLoop() { if (!stage) return; stage.setLoop(!stage.loop); syncControls(); renderStTop(); toast(stage.loop ? `循环当前阶段 · ${C.phases[cur.phase].name}` : '恢复整圈'); }
$('#viewSeg').onclick = (e) => { const b = e.target.closest('button'); if (b && stage) stage.setView(b.dataset.v); };

function selectGroup(gid) {
  ui.group = gid; stage && stage.select(gid); stage && stage.pause();
  if (route !== 'watch') location.hash = '#/watch'; else renderWatchInsp();
}
function sideFor(item) { return item.side === 'support' ? cur.support : item.side === 'free' ? (cur.support === 'left' ? 'right' : cur.support === 'right' ? 'left' : 'both') : item.side; }

/* ---------------- inspector (watch) ---------------- */
function drillMini(d, compact) {
  const inToday = store.todayIds.includes(d.id);
  return `<div class="dmini"><img src="${d.img}" alt="" loading="lazy" data-open="${d.id}" style="cursor:pointer"><div>
    <div style="display:flex;gap:8px;align-items:center"><span class="tier ${d.tier}">${d.tier}</span><span class="en">${esc(d.tierLabel)}</span></div>
    <b style="margin-top:6px;cursor:pointer" data-open="${d.id}">${esc(d.name)}</b><div class="en">${esc(d.nameEn)}</div><div class="rx">${esc(d.prescription)}</div>
    ${compact ? '' : `<div class="acts"><button class="btn sm pri" data-start="${d.id}">${I.timer}开始训练</button><button class="btn sm ${inToday ? 'done' : ''}" data-today="${d.id}">${inToday ? I.check + '已加入' : I.plus + '加入今日'}</button></div>`}
  </div></div>`;
}
function groupBlock(gid, { inWatch }) {
  const g = C.groupById[gid];
  const p = C.phases[cur.phase];
  const pr = p.primary.find((x) => x.id === gid), sc = p.secondary.find((x) => x.id === gid);
  const gp = C.groupPhases(gid);
  const tier = ui.wTier;
  const ds = C.drillsFor(gid, tier);
  return `
  <div class="ghead" style="--c:${g.colour}"><span class="sw"></span><div><div class="eyebrow">${SEC_LABEL[g.section]} · ${C.SECTION_EN[g.section]}</div><h3 style="margin-top:4px">${esc(g.label)}</h3></div></div>
  <p class="cap">${esc(g.role)}</p>
  ${inWatch ? `<div class="sec"><div class="eyebrow"><span>在这一阶段做什么 · <b>${pad2(cur.phase + 1)} ${esc(p.name)}</b></span>${pr ? `<span class="side">${SIDE[sideFor(pr)]} · 主力</span>` : sc ? `<span class="side" style="color:var(--mute);border-color:var(--hair2)">${SIDE[sideFor(sc)]} · 协同</span>` : ''}</div>
    <div class="why ${pr ? '' : 'off'}">${pr ? esc(pr.why) : sc ? '这一刻作为协同肌群参与，帮助主力肌群稳定姿态。' : '这一刻不是它的主要发力时机。可在下方选择它发力的阶段。'}</div></div>` : ''}
  <div class="sec"><div class="eyebrow"><span>发力阶段 · Phases</span><span>${gp.filter((x) => x.level === 'primary').length} 主力 / ${gp.filter((x) => x.level === 'secondary').length} 协同</span></div>
    <div class="phlist">${gp.map((x) => `<button data-seek="${x.i}" class="${x.level === 'primary' ? '' : 's'}" title="${esc(x.why || '协同')}"><b>${pad2(x.i + 1)}</b>${esc(C.phases[x.i].name)}</button>`).join('') || '<span class="note">整圈中不作为主要或协同肌群标注。</span>'}</div>
    ${!inWatch ? `<div class="mlist" style="margin-top:12px">${gp.filter((x) => x.level === 'primary').map((x) => `<button class="mrow" style="--c:${g.colour}" data-seek="${x.i}"><span class="bar"></span><div><b>${pad2(x.i + 1)} · ${esc(C.phases[x.i].name)}</b><p>${esc(x.why)}</p></div><span class="side">${x.side === 'support' ? '支撑侧' : x.side === 'free' ? '自由侧' : SIDE[x.side]}</span></button>`).join('')}</div>` : ''}
  </div>
  ${g.note || g.deep ? `<div class="sec"><p class="note">${g.deep ? '深层肌群 · 颜色/斜线示意所在部位。' : ''}${esc(g.note || '')}</p></div>` : ''}
  <div class="sec"><div class="eyebrow"><span>针对性训练 · Drills</span></div>
    <div class="tiertabs seg" data-wtier>${['A', 'B', 'C'].map((t) => `<button data-t="${t}" class="${t === tier ? 'on' : ''}">${t} ${C.tiers[t]}</button>`).join('')}</div>
    ${ds.length ? ds.map((d) => drillMini(d)).join('') : '<p class="note">这个肌群暂无该器械档的训练</p>'}
  </div>`;
}
function renderWatchInsp() {
  const el = $('#wInsp'); const p = C.phases[cur.phase];
  if (ui.group) {
    el.innerHTML = `<div class="insp-in"><button class="back" data-unsel>${I.left} 返回本阶段肌群</button>${groupBlock(ui.group, { inWatch: true })}
      <p class="note" style="margin-top:26px">色区是教学位置示意，不代表肌电、肌力或真实肌肉边界。</p></div>`;
  } else {
    el.innerHTML = `<div class="insp-in">
      <div class="eyebrow"><b>${pad2(cur.phase + 1)}</b> / 08 · ${SUP[cur.support]}</div>
      <h3 style="margin-top:8px">${esc(p.name)} <span style="color:var(--mute);font-weight:400;font-size:15px">· ${esc(p.detail)}</span></h3>
      <p class="cap">${esc(p.caption)}</p>
      <div class="sec"><div class="eyebrow"><span>这一刻的主力 · Primary</span><span>${p.primary.length}</span></div>
        <div class="mlist">${p.primary.map((x) => { const g = C.groupById[x.id]; return `<button class="mrow" style="--c:${g.colour}" data-g="${x.id}"><span class="bar"></span><div><b>${esc(g.label)}</b><p>${esc(x.why)}</p></div><span class="side">${SIDE[sideFor(x)]}</span></button>`; }).join('')}</div></div>
      <div class="sec"><div class="eyebrow"><span>协同 · Secondary</span></div>
        <div class="chips">${p.secondary.map((x) => { const g = C.groupById[x.id]; return `<button class="chip" style="--c:${g.colour}" data-g="${x.id}"><i></i>${esc(g.label)} <span style="color:var(--dim)">${SIDE[sideFor(x)]}</span></button>`; }).join('')}</div></div>
      <div class="sec kbd-only"><div class="eyebrow"><span>快捷键</span></div>
        <div class="chips" style="color:var(--mute);font-size:12px;gap:10px"><span><kbd>空格</kbd> 播放/暂停</span><span><kbd>←</kbd><kbd>→</kbd> 阶段</span><span><kbd>1</kbd>–<kbd>4</kbd> 速度</span><span><kbd>L</kbd> 循环</span><span><kbd>X</kbd> 高亮</span></div></div>
      <p class="note" style="margin-top:26px">教学重点，不是肌电（EMG）；颜色只区分肌群，不表示用力大小。初次尝试全旋请在适合的场地由有经验的人陪同。</p>
    </div>`;
  }
}
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-g],[data-unsel],[data-seek],[data-open],[data-start],[data-today],[data-wtier] button,[data-mg]');
  if (!t) return;
  if (t.matches('[data-wtier] button')) { ui.wTier = t.dataset.t; renderView(); return; }
  if (t.dataset.g) { selectGroup(t.dataset.g); return; }
  if (t.hasAttribute('data-unsel')) { ui.group = null; stage && stage.select(null); renderWatchInsp(); return; }
  if (t.dataset.seek) { const i = +t.dataset.seek; if (route !== 'watch') { const g = route === 'muscles' ? ui.mGroup : ui.group; location.hash = '#/watch'; if (g) { ui.group = g; stage && stage.select(g); } } closeDrawer(); stage && (stage.seekPhase(i), stage.pause()); cur = stateAt(stage ? stage.time : 0); renderStTop(); renderWatchInsp(); markSegs(); return; }
  if (t.dataset.open) { openDrawer(t.dataset.open); return; }
  if (t.dataset.start) { openTimer(t.dataset.start); return; }
  if (t.dataset.today) { toggleToday(t.dataset.today); return; }
  if (t.dataset.mg) { setMGroup(t.dataset.mg); }
});
function toggleToday(id) {
  if (store.todayIds.includes(id)) { store.removeToday(id); toast('已移出今日训练', () => store.addToday(id)); }
  else { store.addToday(id); toast('已加入今日训练'); }
}

/* ---------------- muscles view ---------------- */
let big = null;
function ensureBig() {
  if (big || !gl) return;
  big = createMannequin($('#bigStage'), { mode: 'full', groups: C.groups, onReady: () => $('#mbig').classList.add('ready'), onPick: (gid) => gid && setMGroup(gid) });
  window.__big = big;
  if (ui.mGroup) big.select(ui.mGroup);
}
function setMGroup(gid) { ui.mGroup = gid; big && big.select(gid); renderMuscles(); }
$('#mViewSeg').onclick = (e) => { const b = e.target.closest('button'); if (b && big) big.setView(b.dataset.v); };
function renderMuscles() {
  $('#glist').innerHTML = `<div class="eyebrow" style="padding:0 10px">17 个肌群 · 3 个部位</div>` + C.sections.map((s) => `<h4>${esc(SEC_LABEL[s.id])}<span>${C.SECTION_EN[s.id]}</span></h4>` +
    C.groups.filter((g) => g.section === s.id).map((g) => `<button data-mg="${g.id}" class="${ui.mGroup === g.id ? 'on' : ''}" style="--c:${g.colour}"><i></i>${esc(g.label)}<em>${C.groupPhases(g.id).filter((x) => x.level === 'primary').length}</em></button>`).join('')).join('');
  const g = ui.mGroup && C.groupById[ui.mGroup];
  $('#mTop').innerHTML = g ? `<div class="eyebrow">${SEC_LABEL[g.section]} · ${C.SECTION_EN[g.section]}</div><h2>${esc(g.label)}</h2>` : `<div class="eyebrow">肌群人台 · Muscle map</div><h2>每块肌群在哪里</h2><div class="en">Tap a region</div>`;
  $('#mInsp').innerHTML = `<div class="insp-in">${g ? groupBlock(g.id, { inWatch: false }) : `
    <h3>点选身体或左侧列表</h3><p class="cap">17 个肌群按 支撑（肩臂）/ 核心折叠 / 腿部绕环 分区，各用一种颜色。选中后显示它的作用、在哪几个阶段发力，以及 A 徒手 / B 家用器械 / C 健身房 三档针对性训练。</p>
    <div class="sec">${C.sections.map((s) => `<div class="eyebrow" style="margin:16px 0 8px">${esc(s.label)}</div><div class="chips">${C.groups.filter((x) => x.section === s.id).map((x) => `<button class="chip" style="--c:${x.colour}" data-mg="${x.id}"><i></i>${esc(x.label)}</button>`).join('')}</div>`).join('')}</div>
    <p class="note" style="margin-top:26px">人台色区是教学位置示意：深层肌群用斜线表示所在部位，不代表真实肌肉边界或用力大小。</p>`}</div>`;
}

/* ---------------- library ---------------- */
function renderLibrary() {
  const el = $('#v-library');
  if (!el.dataset.built) {
    el.dataset.built = 1;
    el.innerHTML = `<div class="page"><div class="ph"><div><div class="eyebrow">训练库 · Drill library</div><h1>按肌群找动作<span class="disp">51 DRILLS</span></h1><p>${esc(C.drillNote)} 每个训练都有示意图、动作要点、常见错误、组次与安全说明。</p></div></div>
      <div class="toolbar"><label class="search">${I.search}<input id="q" placeholder="搜索训练或英文名称" autocomplete="off"><kbd>/</kbd></label>
        <div class="seg" id="ltier"></div><div class="seg" id="lsec"></div>
        <select class="sel" id="lgroup"><option value="">全部肌群</option>${C.groups.map((g) => `<option value="${g.id}">${esc(g.label)}</option>`).join('')}</select>
        <span class="count" id="lcount"></span></div>
      <div class="grid" id="lgrid"></div></div>`;
    $('#q').oninput = (e) => { ui.q = e.target.value; libGrid(); };
    $('#lgroup').onchange = (e) => { ui.lGroup = e.target.value; libGrid(); };
    $('#ltier').onclick = (e) => { const b = e.target.closest('button'); if (b) { ui.lTier = b.dataset.t; libGrid(); } };
    $('#lsec').onclick = (e) => { const b = e.target.closest('button'); if (b) { ui.lSec = b.dataset.s; libGrid(); } };
  }
  libGrid();
}
function libGrid() {
  $('#ltier').innerHTML = [['', '全部'], ['A', 'A 徒手'], ['B', 'B 家用器械'], ['C', 'C 健身房']].map(([t, l]) => `<button data-t="${t}" class="${ui.lTier === t ? 'on' : ''}">${l}</button>`).join('');
  $('#lsec').innerHTML = [['', '全部部位'], ['support', '肩臂支撑'], ['core', '核心协调'], ['legs', '髋腿摆动']].map(([t, l]) => `<button data-s="${t}" class="${ui.lSec === t ? 'on' : ''}">${l}</button>`).join('');
  const list = C.searchDrills(ui.q, { tier: ui.lTier || undefined, section: ui.lSec || undefined, groupId: ui.lGroup || undefined });
  $('#lcount').textContent = `${list.length} / 51`;
  const done = store.completedTodayIds, today = store.todayIds;
  $('#lgrid').innerHTML = list.length ? list.map((d) => { const g = C.groupById[d.groupId]; return `<button class="dcard" data-open="${d.id}">
    <div class="im"><img src="${d.img}" alt="${esc(d.name)}" loading="lazy"><span class="tier ${d.tier}">${d.tier}</span>${done.has(d.id) ? '<span class="ok">今日已完成</span>' : today.includes(d.id) ? '<span class="ok" style="background:var(--ember-d);color:var(--ember)">今日训练</span>' : ''}</div>
    <div class="bd"><span class="g" style="--c:${g.colour}"><i></i>${esc(g.label)}</span><b>${esc(d.name)}</b><span class="en">${esc(d.nameEn)}</span>
      <div class="rx"><span>${esc(d.prescription)}</span><span class="diff">${[1, 2, 3].map((k) => `<i class="${k <= d.difficulty ? 'on' : ''}"></i>`).join('')}</span></div></div></button>`; }).join('')
    : '<div class="empty" style="grid-column:1/-1"><b>没有匹配的训练</b>试试其他关键词</div>';
}
function refreshLibraryBadges() { if ($('#lgrid')) libGrid(); }

/* ---------------- drawer ---------------- */
let drawerId = null;
function openDrawer(id) { drawerId = id; renderDrawer(); $('#drawer').classList.add('on'); $('#scrim').classList.add('on'); }
function closeDrawer() { drawerId = null; $('#drawer').classList.remove('on'); $('#scrim').classList.remove('on'); }
$('#scrim').onclick = closeDrawer;
function renderDrawer() {
  const d = C.drillById[drawerId]; if (!d) return; const g = C.groupById[d.groupId];
  const inToday = store.todayIds.includes(d.id);
  const doseTxt = d.dose.mode === 'time' ? `计时 · ${d.dose.min}${d.dose.max > d.dose.min ? '–' + d.dose.max : ''} 秒` : d.dose.mode === 'reps' ? `计次 · ${d.dose.min}${d.dose.max > d.dose.min ? '–' + d.dose.max : ''} 次` : '按说明完成，手动确认';
  const sibs = C.drillsFor(d.groupId).filter((x) => x.id !== d.id);
  $('#drawer').innerHTML = `<div class="dh"><span class="eyebrow"><b>●</b> ${esc(g.label)} · ${d.tier} ${esc(d.tierLabel)}</span><button class="iconbtn" id="dclose" aria-label="关闭 (Esc)">${I.x}</button></div>
    <div class="db"><div class="hero"><img src="${d.img}" alt="动作示意图"></div><div class="dc">
      <div style="display:flex;gap:10px;align-items:center"><span class="tier ${d.tier}">${d.tier}</span><span class="diff">${[1, 2, 3].map((k) => `<i class="${k <= d.difficulty ? 'on' : ''}"></i>`).join('')}</span></div>
      <h2>${esc(d.name)}</h2><div class="en">${esc(d.nameEn)}</div>
      <div class="kv"><div><span>组次与时间</span><b>${esc(d.prescription)}</b></div><div><span>器械</span><b>${esc(d.equipment)}</b></div><div><span>计时方式</span><b>${doseTxt}</b></div><div><span>组间休息</span><b>${d.dose.restSec} 秒${d.dose.perSide ? ' · 左右各一' : ''}</b></div></div>
      <div class="blk"><h4>为什么练它</h4><p>${esc(d.why)}</p></div>
      <div class="blk"><h4>动作要点</h4><ol>${d.cues.map((c) => `<li>${esc(c)}</li>`).join('')}</ol></div>
      <div class="blk"><h4>常见错误</h4><p>${esc(d.mistake)}</p></div>
      ${d.safety ? `<div class="blk warn"><h4>安全提示</h4><p>${esc(d.safety)}</p></div>` : ''}
      <div class="blk"><h4>同肌群其他档位</h4><div style="display:flex;flex-direction:column;gap:8px">${sibs.map((x) => drillMini(x, true)).join('')}</div></div>
      <div class="blk"><h4>对应肌群</h4><button class="chip" style="--c:${g.colour}" data-g="${g.id}"><i></i>在 3D 动作中查看${esc(g.label)}</button></div>
      <p class="note" style="margin-top:20px">训练为教学建议，图示不替代逐条动作说明。</p>
    </div></div>
    <div class="df"><button class="btn ${inToday ? 'done' : ''}" data-today="${d.id}">${inToday ? I.check + '已加入今日训练' : I.plus + '加入今日训练'}</button><button class="btn pri" data-start="${d.id}">${I.timer}开始训练</button></div>`;
  $('#dclose').onclick = closeDrawer;
}

/* ---------------- timer ---------------- */
let tm = null;
const PHASE_LABEL = { ready: '准备开始', countdown: '准备', work: '练习中', paused: '已暂停', rest: '组间休息', nextSide: '换另一侧', finished: '本次训练完成', abandoned: '本次已结束' };
let audio = null;
function beep(f = 880, d = 0.12) {
  if (!S.settings.sound) return;
  try { audio ??= new AudioContext(); const o = audio.createOscillator(), g = audio.createGain(); o.frequency.value = f; o.connect(g); g.connect(audio.destination); g.gain.setValueAtTime(0.0001, audio.currentTime); g.gain.exponentialRampToValueAtTime(0.18, audio.currentTime + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + d); o.start(); o.stop(audio.currentTime + d + 0.02); } catch (e) {}
}
function openTimer(id) {
  const d = C.drillById[id]; closeDrawer(); stage && stage.pause();
  tm = { d, t: new C.DrillTimer(d.dose), startedAt: null, pain: false, logged: false, lastPhase: 'ready', lastSec: -1, raf: 0 };
  $('#timer').classList.add('on'); renderTimer(true); loopTimer();
}
function loopTimer() {
  if (!tm) return; tm.t.tick(); const sn = tm.t.snap;
  if (sn.phase !== tm.lastPhase) { if (sn.phase === 'work') beep(1046, 0.25); if (sn.phase === 'rest' || sn.phase === 'nextSide') beep(660, 0.25); if (sn.phase === 'finished') { beep(784, 0.15); setTimeout(() => beep(1046, 0.3), 160); } tm.lastPhase = sn.phase; renderTimer(true); }
  else renderTimer(false);
  const sec = Math.ceil(sn.remainingMs / 1000);
  if ((sn.phase === 'countdown' || ((sn.phase === 'work' || sn.phase === 'rest') && sec <= 3)) && sec !== tm.lastSec && sec > 0 && sn.durationMs) beep(sn.phase === 'rest' ? 520 : 880, 0.08);
  tm.lastSec = sec;
  if (sn.phase === 'finished' && !tm.logged) logTm();
  tm.raf = requestAnimationFrame(loopTimer);
}
function logTm() {
  if (!tm || tm.logged || !tm.startedAt) return; tm.logged = true; const sn = tm.t.snap;
  const now = new Date();
  const active = Math.min(Math.floor(sn.activeWorkMs / 1000), Math.floor((now - tm.startedAt) / 1000) + 1);
  store.logSession({ id: 'w' + tm.startedAt.getTime().toString(36) + Math.random().toString(36).slice(2, 6), drillId: tm.d.id, startedAt: tm.startedAt.toISOString(), endedAt: now.toISOString(),
    activeSeconds: Math.max(0, active), completedSets: sn.completedSets, plannedSets: sn.sets, pain: tm.pain, completed: sn.phase === 'finished' });
}
function closeTimer() { if (!tm) return; cancelAnimationFrame(tm.raf); tm = null; $('#timer').classList.remove('on'); }
function tAct(a) {
  if (!tm) return; const t = tm.t, sn = t.snap;
  if (a === 'start') { if (!tm.startedAt) tm.startedAt = new Date(); audio ??= (() => { try { return new AudioContext(); } catch (e) { return null; } })(); t.start(); }
  if (a === 'pause') t.pause(); if (a === 'resume') t.resume(); if (a === 'rep') t.rep(); if (a === 'set') t.completeSet();
  if (a === 'skip') t.skipRest(); if (a === 'add') t.addRest(15);
  if (a === 'pain') { tm.pain = true; t.abandon(); logTm(); renderTimer(true); toast('已记录不适。停止当前练习，休息后再决定是否继续。'); return; }
  if (a === 'end') {
    if (sn.phase === 'finished' || sn.phase === 'abandoned' || !tm.startedAt) { closeTimer(); return; }
    openModal(`<div class="eyebrow">结束练习</div><h2 style="font-size:24px;margin:10px 0 8px">结束这次练习？</h2><p style="color:var(--mute)">已完成的部分会存为一条未完成记录。</p>
      <div style="display:flex;gap:10px;margin-top:24px;justify-content:flex-end"><button class="btn" id="mk">继续练</button><button class="btn pri" id="me">结束并保存</button></div>`);
    t.pause(); $('#mk').onclick = () => { closeModal(); t.resume(); }; $('#me').onclick = () => { closeModal(); t.abandon(); logTm(); closeTimer(); toast('已保存在本机'); };
    return;
  }
  renderTimer(true);
}
function renderTimer(full) {
  const d = tm.d, sn = tm.t.snap, dose = d.dose; const el = $('#timer');
  const ph = sn.phase, eff = sn.eff;
  let val = '', sub = '', frac = 0;
  if (ph === 'ready') { val = dose.mode === 'time' ? sn.target : dose.mode === 'reps' ? sn.target : dose.sets; sub = dose.mode === 'time' ? '秒 / 组' : dose.mode === 'reps' ? '次 / 组' : '组 · 手动确认'; }
  else if (eff === 'countdown' || eff === 'rest') { val = Math.ceil(sn.remainingMs / 1000); sub = eff === 'rest' ? '秒 · 休息' : '秒后开始'; frac = sn.durationMs ? 1 - sn.remainingMs / sn.durationMs : 0; }
  else if (eff === 'work') { if (dose.mode === 'time') { val = Math.ceil(sn.remainingMs / 1000); sub = '秒'; frac = 1 - sn.remainingMs / sn.durationMs; } else if (dose.mode === 'reps') { val = sn.reps; sub = `/ ${sn.target} 次`; frac = sn.reps / sn.target; } else { val = Math.floor(sn.elapsedMs / 1000); sub = '秒 · 按说明完成'; frac = 0; } }
  else if (ph === 'nextSide') { val = sn.side === 'right' ? '右' : (sn.blockLabel || '下一项'); sub = sn.side ? '换另一侧' : '下一个动作'; }
  else if (ph === 'finished') { val = '✓'; sub = `${sn.sets} 组全部完成`; frac = 1; }
  else if (ph === 'abandoned') { val = sn.completedSets; sub = `组完成 · 共 ${sn.sets} 组`; }
  const C2 = 2 * Math.PI * 47;
  if (!full && $('#tval')) {
    $('#tval').textContent = val; $('#tsub').textContent = sub; $('#tfg').style.strokeDashoffset = (C2 * (1 - Math.min(1, frac))).toFixed(1); return;
  }
  const side = sn.side ? (sn.side === 'left' ? '左侧' : '右侧') : '';
  let acts = '';
  if (ph === 'ready' || ph === 'nextSide') acts = `<button class="btn pri lg" data-ta="start">${ph === 'ready' ? '开始' : '继续 · ' + (side || sn.blockLabel)}</button>`;
  else if (ph === 'countdown') acts = `<button class="btn lg" data-ta="pause">暂停</button>`;
  else if (ph === 'work') acts = (dose.mode === 'reps' ? `<button class="btn pri lg" data-ta="rep">完成 1 次 <kbd>空格</kbd></button><button class="btn lg" data-ta="set">本组完成</button>` : dose.mode === 'manual' ? `<button class="btn pri lg" data-ta="set">本组完成 <kbd>↵</kbd></button>` : `<button class="btn lg" data-ta="set">提前结束本组</button>`) + `<button class="btn lg" data-ta="pause">暂停</button>`;
  else if (ph === 'rest') acts = `<button class="btn pri lg" data-ta="skip">结束休息</button><button class="btn lg" data-ta="add">+15 秒休息</button><button class="btn lg" data-ta="pause">暂停</button>`;
  else if (ph === 'paused') acts = `<button class="btn pri lg" data-ta="resume">继续 <kbd>空格</kbd></button>`;
  else acts = `<button class="btn pri lg" data-ta="end">完成</button>${ph === 'finished' ? `<button class="btn lg" id="again">再练一次</button>` : ''}`;
  el.innerHTML = `<div class="th"><span class="tier ${d.tier}">${d.tier}</span><div><h2>${esc(d.name)}</h2><div class="en">${esc(d.nameEn)} · ${esc(d.prescription)}</div></div>
      <div class="sp"><span class="mono" style="color:var(--mute);font-size:12px">第 ${sn.set} / ${sn.sets} 组${side ? ' · ' + side : ''}${sn.blockLabel ? ' · ' + esc(sn.blockLabel) : ''}</span><button class="iconbtn" data-ta="end" aria-label="结束本次练习 (Esc)">${I.x}</button></div></div>
    <div class="tl2"><img src="${d.img}" alt=""><div class="blk"><h4>动作要点</h4><ol>${d.cues.map((c) => `<li>${esc(c)}</li>`).join('')}</ol></div><div class="blk"><h4>常见错误</h4><p>${esc(d.mistake)}</p></div>${d.safety ? `<div class="blk warn"><h4>安全提示</h4><p>${esc(d.safety)}</p></div>` : ''}</div>
    <div class="tc"><div class="setdots">${Array.from({ length: sn.sets }, (_, i) => `<i class="${i < sn.completedSets ? 'on' : i === sn.set - 1 && ph !== 'finished' ? 'cur' : ''}"></i>`).join('')}</div>
      <div class="ringwrap ${eff === 'rest' ? 'rest' : ''}"><svg viewBox="0 0 100 100"><circle class="bgc" cx="50" cy="50" r="47"/><circle class="fgc" id="tfg" cx="50" cy="50" r="47" stroke-dasharray="${C2.toFixed(1)}" stroke-dashoffset="${(C2 * (1 - Math.min(1, frac))).toFixed(1)}"/></svg>
        <div class="mid"><div class="st">${PHASE_LABEL[ph]}${ph === 'paused' ? ' · ' + PHASE_LABEL[sn.eff] : ''}</div><div class="val" id="tval">${val}</div><div class="sub" id="tsub">${sub}</div></div></div>
      <div class="tacts">${acts}</div>
      ${dose.mode === 'manual' && ph === 'ready' ? '<p class="note">按原训练说明完成，再手动确认本组</p>' : ''}</div>
    <div class="tf"><button class="btn sm ghost pain" data-ta="pain">不适，停止练习</button><span class="kbd-only">切到其他标签页时练习会暂停；回来后点继续 · <kbd>Esc</kbd> 结束</span></div>`;
  $$('[data-ta]', el).forEach((b) => (b.onclick = () => tAct(b.dataset.ta)));
  const ag = $('#again', el); if (ag) ag.onclick = () => { const id = tm.d.id; closeTimer(); openTimer(id); };
}
document.addEventListener('visibilitychange', () => { if (document.hidden && tm) tm.t.pause(); });

/* ---------------- modal ---------------- */
function openModal(html, cls = '') { const m = $('#modal'); m.className = 'modal on ' + cls; $('#sheet').innerHTML = html; }
function closeModal() { $('#modal').className = 'modal'; }
$('#modal .bg').onclick = () => { if (S.safetyAccepted) closeModal(); };

function showWelcome() {
  openModal(`<div class="art"><img src="/img/hero.webp" alt=""><div class="mark"><div class="eyebrow">FLARELAB · 网页版</div></div></div>
    <div class="txt"><div class="eyebrow"><b>FLARE</b> · 托马斯训练助手</div><h1>托马斯全旋</h1><p class="lead">跟着动作，看懂每一刻哪里在发力。</p>
      <div class="steps"><div><b>01</b><span>看 · 慢放与八阶段</span></div><div><b>02</b><span>懂 · 同一姿态的肌群作用</span></div><div><b>03</b><span>练 · 组次计时与本地记录</span></div></div>
      <p class="note">旋转真实 3D，暂停选肌群，再进入对应练习。记录只保存在这台设备的浏览器里，不上传服务器。</p>
      <div class="acts" style="margin-top:22px"><button class="btn pri lg" id="wgo">开始</button><span class="note" style="text-align:center">继续即表示已阅读安全提示</span></div></div>`, 'welcome');
  $('#wgo').onclick = showSafety;
}
function showSafety() {
  openModal(`<div class="eyebrow">练之前</div><h2 style="font-size:30px;margin-top:8px">三件事</h2>
    <div class="rules"><div><b>01</b><div><p>每次先热身手腕</p><span>约 6 分钟，学习路径第一课就是它</span></div></div>
    <div><b>02</b><div><p>刺痛、麻木、头晕就停</p><span>酸可以，痛不行</span></div></div>
    <div><b>03</b><div><p>这是动作教学</p><span>不能替代教练、医生或康复治疗；初次全旋请有人陪同</span></div></div></div>
    <div style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap"><button class="btn lg" id="sa">先做入门自评</button><button class="btn pri lg" id="sg">我知道了</button></div>`);
  $('#sg').onclick = () => { store.acceptSafety(); closeModal(); stage && stage.play(); };
  $('#sa').onclick = () => { store.acceptSafety(); showAssessment(); };
}
const ASSESS = [['wrist', '手腕伸展'], ['pike', '直腿抬腿'], ['straddle', '跨坐开胯'], ['dips', '受控臂屈伸次数'], ['lsit', 'L-sit']];
const GRADES = [['未完成', '尚未完成 / 有不适'], ['能完成', '可以完成基础练习'], ['较稳定', '稳定完成，仍需巩固'], ['很轻松', '轻松完成，准备进阶']];
const DIPS = [['0–3', '入门'], ['4–7', '基础'], ['8–12', '良好'], ['13+', '优秀']];
function showAssessment() {
  const g = { ...S.assessmentGrades };
  const draw = () => {
    openModal(`<div class="assess"><div class="eyebrow">入门自评 · 自行确认，不是 AI 测评</div><h2 style="font-size:28px;margin:8px 0 6px">从哪一阶段开始</h2>
      <p class="note" style="margin-bottom:12px">按最近一次实际表现选择，只用于安排起点。手腕不适从阶段 1 开始；结果不是能力或医疗评估。</p>
      ${ASSESS.map(([id, l]) => `<div class="q"><h4>${l}</h4><div class="opts">${(id === 'dips' ? DIPS : GRADES).map(([a, b], i) => `<button data-a="${id}" data-v="${i + 1}" class="${g[id] === i + 1 ? 'on' : ''}"><b>${a}</b>${b}</button>`).join('')}</div></div>`).join('')}
      <div style="display:flex;gap:10px;justify-content:space-between;align-items:center;margin-top:18px;flex-wrap:wrap"><span class="note">${Object.keys(g).length === 5 ? `建议从 <b style="color:var(--ember)">阶段 ${C.placement(g)}</b> 开始` : `已选 ${Object.keys(g).length} / 5`}</span>
      <div style="display:flex;gap:10px"><button class="btn" id="askip">从基础开始</button><button class="btn pri" id="asave" ${Object.keys(g).length === 5 ? '' : 'disabled'}>保存自评起点</button></div></div></div>`);
    $$('[data-a]').forEach((b) => (b.onclick = () => { g[b.dataset.a] = +b.dataset.v; draw(); }));
    $('#askip').onclick = () => { store.skipAssessment(); closeModal(); toast('从阶段 1 开始'); };
    $('#asave').onclick = () => { store.recordAssessment(g); closeModal(); toast(`自评已保存在本机 · 从阶段 ${S.startStage} 开始`); };
  };
  draw();
}

/* ---------------- today ---------------- */
function renderToday() {
  const ids = store.todayIds, done = store.completedTodayIds;
  const st = C.stages.find((s) => s.n === store.currentStage);
  const next = st.lessons.find((l) => !S.completedLessonIds.includes(l.id)) || st.lessons[0];
  const d0 = new Date();
  $('#v-today').innerHTML = `<div class="page"><div class="ph"><div><div class="eyebrow">今日训练 · ${d0.getMonth() + 1} 月 ${d0.getDate()} 日 周${'日一二三四五六'[d0.getDay()]}</div><h1>今天练什么</h1><p>从肌群详解或训练库加入，组成今天的练习。完成计时训练后会留下本地记录。</p></div>
    ${ids.length ? `<button class="btn pri lg" data-start="${ids.find((x) => !done.has(x)) || ids[0]}">${I.timer}开始第一个未完成</button>` : ''}</div>
    <div class="two"><div>
      <div class="tiles" style="grid-template-columns:repeat(3,1fr)"><div class="tile"><span>今日训练</span><b>${ids.length}<small>项</small></b></div><div class="tile"><span>已完成</span><b>${ids.filter((x) => done.has(x)).length}<small>/ ${ids.length}</small></b></div><div class="tile"><span>今日练习</span><b>${store.todayMinutes}<small>分钟</small></b></div></div>
      ${ids.length ? `<div class="tlist">${ids.map((id) => { const d = C.drillById[id], g = C.groupById[d.groupId], ok = done.has(id); return `<div class="trow"><img src="${d.img}" alt="" data-open="${id}" style="cursor:pointer"><div><div style="display:flex;gap:8px;align-items:center"><span class="tier ${d.tier}">${d.tier}</span><b style="cursor:pointer" data-open="${id}">${esc(d.name)}</b>${ok ? '<span class="flag" style="background:rgba(127,216,166,.14);color:var(--ok)">✓ 已完成</span>' : ''}</div>
        <div class="meta"><span class="chip" style="--c:${g.colour};height:22px"><i></i>${esc(g.label)}</span><span>${esc(d.prescription)}</span><span>${esc(d.equipment)}</span></div></div>
        <div class="acts"><button class="btn sm ghost" data-rm="${id}">移出</button><button class="btn sm ${ok ? '' : 'pri'}" data-start="${id}">${I.timer}${ok ? '再练一次' : '开始'}</button></div></div>`; }).join('')}</div>`
      : `<div class="empty"><b>今天还没有安排</b>从肌群详解或训练库加入，组成今天的练习<div style="margin-top:18px;display:flex;gap:10px;justify-content:center"><a class="btn" href="#/library">打开训练库</a><a class="btn" href="#/watch">看动作选肌群</a></div></div>`}
    </div>
    <div class="panel"><h3><span>本课练习 · 阶段 ${st.n}</span><a class="eyebrow" href="#/path">学习路径 →</a></h3>
      <div class="eyebrow" style="margin-bottom:6px">第 ${next.n} 课 · ${next.minutes} 分钟</div><b style="font-size:17px">${esc(next.title)}</b>
      <div class="tlist" style="margin-top:14px">${next.drills.map((id) => drillMini(C.drillById[id], true)).join('')}</div>
      <button class="btn pri" style="width:100%;margin-top:14px" id="addLesson">${I.plus}全部加入今日</button>
      <p class="note" style="margin-top:12px">课程为教学草稿，尚待教练审核。</p></div></div></div>`;
  $$('[data-rm]').forEach((b) => (b.onclick = () => { const id = b.dataset.rm; store.removeToday(id); toast('已移出今日训练', () => store.addToday(id)); }));
  $('#addLesson').onclick = () => { next.drills.forEach((id) => store.ensureToday() || (!store.s.today.ids.includes(id) && store.s.today.ids.push(id))); store.save(); toast('已加入今日训练'); };
}

/* ---------------- path ---------------- */
function renderPath() {
  const curN = store.currentStage; const sel = ui.pathStage ?? curN; const st = C.stages.find((s) => s.n === sel);
  const unlocked = store.isStageUnlocked(sel);
  const graded = Object.keys(S.assessmentGrades).length === 5;
  $('#v-path').innerHTML = `<div class="page"><div class="ph"><div><div class="eyebrow">学习路径 · Learning path · 18 课</div><h1>从手腕热身到连续托马斯</h1><p>${esc(C.curriculumNote)}</p></div>
      <div class="card" style="padding:16px 18px;display:flex;gap:16px;align-items:center"><div><div class="eyebrow">起点</div><b style="font-size:18px">阶段 ${S.startStage}</b><div class="note">${graded ? '来自入门自评' : '未做入门自评'}</div></div><button class="btn" id="doAssess">${graded ? '重新自评' : '入门自评'}</button></div></div>
    <div class="stepper">${C.stages.map((s) => { const pass = store.isStagePassed(s.n), un = store.isStageUnlocked(s.n); const tot = s.lessons.length + s.gates.length; const dn = s.lessons.filter((l) => S.completedLessonIds.includes(l.id)).length + s.gates.filter((g) => S.gateReports[g.id]).length;
      return `<button data-stage="${s.n}" class="${pass ? 'pass' : ''} ${s.n === curN && !pass ? 'cur' : ''} ${s.n === sel ? 'sel' : ''} ${un ? '' : 'locked'}"><span class="st">${pass ? '已完成' : s.n === curN ? '当前阶段' : un ? '已开启' : '未开启'}</span><div class="n">${pad2(s.n)}</div><b>${esc(s.title)}</b><span>${s.weeks[0]}–${s.weeks[1]} 周 · ${s.lessons.length} 课</span><div class="bar"><i style="width:${(dn / tot * 100).toFixed(0)}%"></i></div></button>`; }).join('')}</div>
    ${unlocked ? '' : '<div class="banner">完成前一阶段课程与自评后开启。内容可以先浏览，记录需按顺序完成。</div>'}
    <div class="ph" style="margin-bottom:16px"><div><div class="eyebrow">阶段 ${st.n} · ${st.weeks[0]}–${st.weeks[1]} 周</div><h1 style="font-size:26px">${esc(st.title)}</h1></div></div>
    <div class="lessons">${st.lessons.map((l) => { const dn = S.completedLessonIds.includes(l.id); return `<div class="lesson ${dn ? 'done' : ''}"><div class="lh"><div><div class="mono">第 ${l.n} 课 · ${l.minutes} 分钟</div><b>${esc(l.title)}</b></div>${dn ? '<span class="flag" style="background:rgba(127,216,166,.14);color:var(--ok)">✓ 已练</span>' : ''}</div>
      ${l.phases.length ? `<div><div class="eyebrow" style="margin-bottom:6px">相关动作阶段</div><div class="phlist">${l.phases.map((s) => `<button data-seek="${s - 9}"><b>${pad2(s - 8)}</b>${esc(C.phases[s - 9].name)}</button>`).join('')}</div></div>` : ''}
      <div><div class="eyebrow" style="margin-bottom:6px">本课练习</div><div class="dl">${l.drills.map((id) => { const d = C.drillById[id]; return `<button data-open="${id}"><img src="${d.img}" alt=""><span class="tier ${d.tier}">${d.tier}</span><span>${esc(d.name)}</span></button>`; }).join('')}</div></div>
      <div class="foot"><button class="btn sm ${dn ? 'done' : ''}" data-lesson="${l.id}" ${unlocked ? '' : 'disabled'}>${dn ? I.check + '本课已记录' : '标记本课已练习'}</button><button class="btn sm ghost" data-addl="${l.id}">${I.plus}加入今日</button></div></div>`; }).join('')}</div>
    <div style="margin-top:28px"><div class="eyebrow">阶段自评 · 自行确认，不是 AI 测评</div>
      ${st.gates.map((g) => `<div class="gate ${S.gateReports[g.id] ? 'on' : ''}" data-gate="${g.id}" ${unlocked ? '' : 'style="pointer-events:none;opacity:.5"'}><span class="cb"></span><div><b>${esc(g.text)}</b><span>${g.kind === 'self-review' ? '原方案为 AI 检测；App 与网页版均改为自行回顾确认' : '我已在无痛情况下完成'}</span></div></div>`).join('')}</div>
  </div>`;
  $$('[data-stage]').forEach((b) => (b.onclick = () => { ui.pathStage = +b.dataset.stage; renderPath(); }));
  $$('[data-lesson]').forEach((b) => (b.onclick = () => { const id = b.dataset.lesson; const on = !S.completedLessonIds.includes(id); store.completeLesson(id, on); toast(on ? '本课已记录' : '已取消记录'); }));
  $$('[data-addl]').forEach((b) => (b.onclick = () => { store.ensureToday(); C.lessonById[b.dataset.addl].drills.forEach((id) => { if (!S.today.ids.includes(id)) S.today.ids.push(id); }); store.save(); toast('已加入今日训练'); }));
  $$('[data-gate]').forEach((b) => (b.onclick = () => { store.reportGate(b.dataset.gate, !S.gateReports[b.dataset.gate]); }));
  $('#doAssess').onclick = showAssessment;
}

/* ---------------- progress ---------------- */
function renderProgress() {
  const ss = [...S.sessions].sort((a, b) => b.endedAt.localeCompare(a.endedAt));
  const days = store.weekDays(), td = store.trainingDays, today = store.today;
  // 18-week heatmap (minutes per day)
  const mins = {}; S.sessions.forEach((x) => { const k = C.dateStamp(x.endedAt); mins[k] = (mins[k] || 0) + x.activeSeconds; });
  const end = new Date(); end.setHours(12, 0, 0, 0); const wd = (end.getDay() + 6) % 7; const start = new Date(end); start.setDate(end.getDate() - wd - 7 * 17);
  const cells = []; for (let i = 0; i < 18 * 7; i++) { const d = new Date(start); d.setDate(start.getDate() + i); const k = C.dateStamp(d); const v = mins[k] || 0; cells.push(`<i class="${k > today ? 'fut' : v > 900 ? 'l3' : v > 300 ? 'l2' : v > 0 || td.has(k) ? 'l1' : ''}" title="${k}${v ? ' · ' + Math.round(v / 60) + ' 分钟' : ''}"></i>`); }
  $('#v-progress').innerHTML = `<div class="page"><div class="ph"><div><div class="eyebrow">记录 · Progress</div><h1>练习记录</h1><p>由本人确认的本地学习记录，不是能力评分或健康评估。记录了不适的训练会被标出，但不会自动判断任何课程已完成。</p></div></div>
    <div class="tiles"><div class="tile"><span>训练次数</span><b>${S.sessions.length}</b></div><div class="tile"><span>练习分钟</span><b>${store.totalMinutes}</b></div><div class="tile"><span>已练课程</span><b>${S.completedLessonIds.length}<small>/ 18</small></b></div><div class="tile"><span>连续天数</span><b>${store.streak}<small>天</small></b></div></div>
    <div class="two"><div style="display:flex;flex-direction:column;gap:20px">
      <div class="panel"><h3><span>本周练习天数</span><span class="eyebrow">${store.weekTrainingDays} / ${S.settings.weeklyGoal} 天目标</span></h3><div class="wk">${days.map((d, i) => `<div class="${td.has(d) ? 'on' : ''} ${d === today ? 'today' : ''}">${d === today ? '今天' : '周' + '一二三四五六日'[i]}<b>${+d.slice(8)}</b></div>`).join('')}</div></div>
      <div class="panel"><h3><span>近 18 周</span><span class="eyebrow">每格一天 · 颜色越深练得越久</span></h3><div class="heat">${cells.join('')}</div></div></div>
      <div class="panel"><h3><span>最近</span><span class="eyebrow">${ss.length} 条</span></h3>${ss.length ? ss.slice(0, 30).map((x) => { const d = C.drillById[x.drillId]; const t = new Date(x.endedAt); return `<div class="hrow"><div><b style="cursor:pointer" data-open="${d.id}">${esc(d.name)}</b>${x.completed ? '' : '<span class="flag inc">未完成</span>'}${x.pain ? '<span class="flag painf">记录了不适</span>' : ''}<br><span>${t.getMonth() + 1}/${t.getDate()} ${pad2(t.getHours())}:${pad2(t.getMinutes())} · ${d.tier} ${esc(d.tierLabel)}</span></div><div class="r">${x.completedSets}/${x.plannedSets} 组<br>${Math.round(x.activeSeconds / 60) || '<1'} 分钟</div></div>`; }).join('') : '<div class="empty" style="padding:30px 10px"><b>还没有记录</b>完成一次计时训练，记录会留在这里</div>'}</div></div></div>`;
}

/* ---------------- settings ---------------- */
function renderSettings() {
  const s = S.settings, w = S.web;
  const segH = (key, opts, val) => `<div class="seg" data-set="${key}">${opts.map(([v, l]) => `<button data-v="${v}" class="${String(val) === String(v) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
  $('#v-settings').innerHTML = `<div class="page"><div class="ph"><div><div class="eyebrow">设置 · Settings</div><h1>设置</h1><p>所有设置与记录只保存在当前浏览器（localStorage）。换浏览器或清除网站数据前，请先导出备份。</p></div></div>
    ${store.error ? `<div class="banner">${esc(store.error)}</div>` : ''}
    <div class="sgrid"><div style="display:flex;flex-direction:column;gap:18px">
      <div class="panel"><h3>训练</h3>
        <div class="srow"><div><b>默认器械档</b><span>肌群详解里先显示的训练档位</span></div>${segH('tier', [['A', 'A 徒手'], ['B', 'B 家用'], ['C', 'C 健身房']], s.tier)}</div>
        <div class="srow"><div><b>每周目标</b><span>本周练习天数</span></div>${segH('weeklyGoal', [[2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6']], s.weeklyGoal)}</div>
        <div class="srow"><div><b>计时提示音</b><span>倒数、换组与完成时播放短音</span></div>${segH('sound', [[true, '开'], [false, '关']], s.sound)}</div></div>
      <div class="panel"><h3>播放</h3>
        <div class="srow"><div><b>默认播放速度</b><span>快捷键 1–4 随时切换</span></div>${segH('speed', SPEEDS.map((x) => [x, x + '×']), w.speed)}</div>
        <div class="srow"><div><b>画面质量</b><span>省电会关闭阴影并降低像素比</span></div>${segH('quality', [['battery', '省电'], ['balanced', '均衡'], ['high', '高清']], w.quality)}</div>
        <div class="srow"><div><b>肌群高亮（X 光）</b><span>播放时按阶段点亮主力与协同肌群</span></div>${segH('xray', [[true, '开'], [false, '关']], w.xray)}</div></div>
      <div class="panel"><h3>本地数据</h3>
        <div class="srow"><div><b>导出备份</b><span>JSON 格式，与 App“复制本地备份”同一结构</span></div><div style="display:flex;gap:8px"><button class="btn sm" id="bcopy">复制</button><button class="btn sm" id="bdl">下载</button></div></div>
        <div class="srow"><div><b>导入备份</b><span>从文件恢复，会替换当前浏览器里的记录</span></div><label class="btn sm">选择文件<input type="file" accept="application/json,.json" id="bimp" hidden></label></div>
        <div class="srow"><div><b>清除本机记录</b><span>删除设置、今日训练、自评与全部训练记录</span></div><button class="btn sm pain" id="breset">清除</button></div></div>
    </div><div style="display:flex;flex-direction:column;gap:18px">
      <div class="panel prose"><h3>练之前的三件事 <button class="btn sm" id="sshow">查看</button></h3><p>先热身手腕和肩部。按自己的能力练习，出现疼痛或头晕时停止。初次尝试全旋时，请在适合的场地由有经验的人陪同。内容用于动作学习，不作诊断。</p></div>
      <div class="panel prose"><h3>关于 FlareLab 网页版</h3><p>托马斯训练助手的网页端：观看托马斯全旋，了解各阶段的肌群作用，选择适合自己的训练并记录练习。内容与 App 同源（同一份训练库、阶段肌群数据和学习路径草稿）。</p><p>手机上推荐使用 App：iOS TestFlight / Android Google Play 内测，报名见 <a href="https://flare.uuugk.win/" target="_blank" rel="noopener" style="color:var(--ember)">flare.uuugk.win</a>。</p></div>
      <div class="panel prose"><h3>教学说明</h3><p>色区是教学位置示意，不代表肌电、肌力或真实肌肉边界。深层肌群用斜线或颜色表示所在部位。课程与入门阈值是教学草稿，阶段记录由本人确认；没有相机 AI、订阅、账号或云同步。</p></div>
      <div class="panel prose"><h3>模型与素材来源 · 开源许可</h3><p>Snow Rig © Blender Foundation · CC BY 4.0，服饰、材质与动画已修改。Human Base Meshes · Blender Studio 与社区贡献者 · CC0。Three.js · MIT。meshoptimizer · MIT。Noto Sans SC · Anton · JetBrains Mono · SIL OFL 1.1。</p></div>
    </div></div></div>`;
  $$('[data-set]').forEach((g) => g.onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return; const k = g.dataset.set; let v = b.dataset.v;
    if (k === 'weeklyGoal' || k === 'speed') v = +v; if (v === 'true') v = true; if (v === 'false') v = false;
    if (k === 'speed') { setSpeed(v); return renderSettings(); }
    if (k === 'quality') { store.setWeb({ quality: v }); stage && stage.setQuality(v); return; }
    if (k === 'xray') { store.setWeb({ xray: v }); stage && stage.setXray(v); syncControls(); return; }
    if (k === 'tier') ui.wTier = v;
    store.setSettings({ [k]: v });
  });
  const json = () => JSON.stringify(S, null, 2);
  $('#bcopy').onclick = async () => { try { await navigator.clipboard.writeText(json()); toast('备份已复制，请保存到自己的文件'); } catch (e) { toast('无法访问剪贴板，请使用下载'); } };
  $('#bdl').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([json()], { type: 'application/json' })); a.download = `flarelab-backup-${store.today}.json`; a.click(); };
  $('#bimp').onchange = async (e) => { const f = e.target.files[0]; if (!f) return; try { store.importJSON(await f.text()); Object.assign(S, store.s); toast('备份已导入'); location.reload(); } catch (err) { toast('文件格式不对，未导入'); } };
  $('#breset').onclick = () => {
    openModal(`<h2 style="font-size:22px">清除本机记录？</h2><p style="color:var(--mute);margin-top:8px">设置、今日训练、自评、课程与训练记录都会被删除，且无法恢复。建议先导出备份。</p><div style="display:flex;gap:10px;justify-content:flex-end;margin-top:22px"><button class="btn" id="rk">取消</button><button class="btn pri" id="ry">清除</button></div>`);
    $('#rk').onclick = closeModal; $('#ry').onclick = () => { store.reset(); location.reload(); };
  };
  $('#sshow').onclick = showSafety;
}

/* ---------------- keyboard ---------------- */
function showKeys() {
  openModal(`<div class="eyebrow">键盘快捷键</div><h2 style="font-size:26px;margin-top:6px">快捷键</h2><div class="keys">
    ${[['播放 / 暂停', '空格'], ['上一 / 下一阶段', '← →'], ['播放速度 0.25 / 0.5 / 0.75 / 1×', '1 2 3 4'], ['循环当前阶段', 'L'], ['肌群高亮', 'X'], ['正面 / 侧面 / 背面', 'F S B'], ['复位镜头', 'R'], ['取消选中肌群 / 关闭面板', 'Esc'], ['搜索训练', '/'], ['切换页面', 'G 然后 1–7'], ['计时：完成 1 次 / 继续', '空格'], ['计时：本组完成', 'Enter']].map(([a, k]) => `<div><span>${a}</span><span>${k.split(' ').map((x) => `<kbd>${x}</kbd>`).join(' ')}</span></div>`).join('')}
  </div><div style="text-align:right;margin-top:20px"><button class="btn" id="kc">关闭</button></div>`);
  $('#kc').onclick = closeModal;
}
$('#keysBtn').onclick = showKeys;
let gPrefix = 0;
addEventListener('keydown', (e) => {
  if (e.target.matches('input,select,textarea')) { if (e.key === 'Escape') e.target.blur(); return; }
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key;
  if (tm) {
    const sn = tm.t.snap;
    if (k === ' ') { e.preventDefault(); if (sn.phase === 'paused') tAct('resume'); else if (sn.phase === 'ready' || sn.phase === 'nextSide') tAct('start'); else if (sn.phase === 'work' && tm.d.dose.mode === 'reps') tAct('rep'); else if (sn.phase === 'work' || sn.phase === 'rest' || sn.phase === 'countdown') tAct('pause'); }
    if (k === 'Enter' && sn.phase === 'work') tAct('set');
    if (k === 'Escape') tAct('end');
    return;
  }
  if ($('#modal').classList.contains('on')) { if (k === 'Escape' && S.safetyAccepted) closeModal(); return; }
  if (k === 'Escape') { if (drawerId) return closeDrawer(); if (ui.group) { ui.group = null; stage && stage.select(null); renderWatchInsp(); } return; }
  if (k === '?') return showKeys();
  if (k === 'g') { gPrefix = performance.now(); return; }
  if (performance.now() - gPrefix < 1200 && /^[1-7]$/.test(k)) { gPrefix = 0; location.hash = '#/' + NAV[+k - 1][0]; return; }
  if (k === '/' && route === 'library') { e.preventDefault(); $('#q').focus(); return; }
  if (route !== 'watch' || !stage) return;
  if (k === ' ') { e.preventDefault(); stage.toggle(); }
  else if (k === 'ArrowRight') { e.preventDefault(); stage.seekPhase(cur.phase + 1); }
  else if (k === 'ArrowLeft') { e.preventDefault(); stage.seekPhase(cur.phase - 1); }
  else if (/^[1-4]$/.test(k)) setSpeed(SPEEDS[+k - 1]);
  else if (k === 'l' || k === 'L') toggleLoop();
  else if (k === 'x' || k === 'X') toggleXray();
  else if ('fF'.includes(k)) stage.setView('front'); else if ('sS'.includes(k)) stage.setView('side'); else if ('bB'.includes(k)) stage.setView('back'); else if ('rR'.includes(k)) stage.setView('reset');
});

/* ---------------- boot ---------------- */
initStage();
go();
if (!S.safetyAccepted) { stage && stage.pause(); showWelcome(); }
window.__app = { go, openDrawer, openTimer, selectGroup, setMGroup, store, ui, showKeys, closeModal };
