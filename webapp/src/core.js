// Pure logic ported 1:1 from the Flutter app (app/lib/domain + control):
// dose parsing, DrillTimer state machine, LearningStore (same localStorage
// JSON shape as the app's `flare.learning.v1`, so backups stay compatible).
import PM from '../../app/assets/data/phase-muscles.json';
import DL from '../../app/assets/data/drills.json';
import CS from '../../app/assets/data/course-stages.json';

/* ---------------- catalog ---------------- */
export function parseDose(raw, restTime = 60, restReps = 90) {
  const text = raw.replace(/\s+/g, ' ').trim();
  const sm = /(\d+)\s*(?:[–—\-~至到]\s*(\d+))?\s*组/.exec(text);
  if (!sm) return null;
  const sets = +sm[1], setsMax = +(sm[2] || sm[1]);
  if (sets < 1 || setsMax < sets) return null;
  const after = text.slice(sm.index + sm[0].length);
  const parts = after.split(/[×x*]/);
  const tail = (parts.length > 1 ? parts.slice(1).join(' ') : after).replace(/每侧|每边|单侧/g, '');
  const q = /(\d+)\s*(?:[–—\-~至到]\s*(\d+))?/.exec(tail);
  if (!q) return null;
  let min = +q[1], max = +(q[2] || q[1]);
  if (min <= 0 || max < min) return null;
  const unit = tail.slice(q.index + q[0].length).trim();
  let mode;
  if (/^(秒|s\b|sec)/i.test(unit)) mode = 'time';
  else if (/^(分钟|min)/i.test(unit)) { mode = 'time'; min *= 60; max *= 60; }
  else if (/^(次|下|步|rep)/i.test(unit)) mode = 'reps';
  else return null;
  return { sets, setsMax, perSide: /每侧|每边|单侧/.test(text), mode, min, max, restSec: mode === 'time' ? restTime : restReps, raw,
    blockLabels: text.includes('每个字母') ? ['Y', 'T', 'W'] : [''] };
}
function manualDose(raw) {
  const c = /(\d+)\s*(?:组|轮)/.exec(raw);
  return { sets: c ? +c[1] : 1, setsMax: c ? +c[1] : 1, perSide: /每侧|每边|单侧/.test(raw), mode: 'manual', min: 0, max: 0, restSec: 90, raw, blockLabels: [''] };
}

export const PHASE_EN = ['Rear support', 'First transfer', 'First side support', 'First leg pass', 'Front support', 'Second transfer', 'Second side support', 'Second leg pass'];
export const SECTION_EN = { support: 'Support', core: 'Core', legs: 'Legs' };
export const sections = PM.sections;
export const groups = PM.groups.map((g) => ({ ...g, id: g.groupId }));
export const groupById = Object.fromEntries(groups.map((g) => [g.id, g]));
export const phases = PM.phases; // index 0..7 <-> source 9..16
export const phaseIndexBySource = (s) => s - 9;
export const tiers = DL.meta.tiers;
export const drillNote = DL.meta.note;
export const drills = [];
for (const [gid, t] of Object.entries(DL.drills)) {
  for (const k of ['A', 'B', 'C']) {
    const d = t[k]; if (!d) continue;
    let dose = parseDose(d.prescription) || manualDose(d.prescription);
    if (d.id === 'forearms-B') dose = { ...dose, blockLabels: ['腕屈', '腕伸'] };
    drills.push({ ...d, groupId: gid, dose, img: `/img/${d.id}.webp` });
  }
}
export const drillById = Object.fromEntries(drills.map((d) => [d.id, d]));
export const drillsFor = (gid, tier) => drills.filter((d) => d.groupId === gid && (!tier || d.tier === tier));
export function searchDrills(q, { tier, groupId, section } = {}) {
  const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return drills.filter((d) => {
    if (tier && d.tier !== tier) return false;
    if (groupId && d.groupId !== groupId) return false;
    const g = groupById[d.groupId];
    if (section && g.section !== section) return false;
    const hay = `${d.name} ${d.nameEn} ${d.equipment} ${g.label} ${d.tierLabel}`.toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
}
export const curriculumNote = CS.meta.note;
export const stages = CS.stages.map((s) => ({
  ...s,
  gates: s.gates.map((g) => g.kind === 'ai'
    ? { ...g, sourceText: g.text, text: g.id === 'ai9to11' ? '自行回顾 09–11：后撑、移重与侧撑是否连贯' : '自行回顾整圈：换手、开腿与节奏是否连贯', kind: 'self-review' }
    : g),
}));
export const lessonById = {}; export const gateById = {};
stages.forEach((s) => { s.lessons.forEach((l) => (lessonById[l.id] = { ...l, stage: s.n })); s.gates.forEach((g) => (gateById[g.id] = g)); });
// phases in which a group is primary / secondary
export function groupPhases(gid) {
  const out = [];
  phases.forEach((p, i) => {
    const pr = p.primary.find((x) => x.id === gid);
    if (pr) out.push({ i, level: 'primary', why: pr.why, side: pr.side });
    else if (p.secondary.find((x) => x.id === gid)) out.push({ i, level: 'secondary', why: '', side: p.secondary.find((x) => x.id === gid).side });
  });
  return out;
}

/* ---------------- DrillTimer (app/lib/domain/drill_timer.dart) ---------------- */
export class DrillTimer {
  constructor(dose, target = dose.min, now = () => performance.now(), maxGap = 5000) {
    this.dose = dose; this.target = target; this._now = now; this.maxGap = maxGap;
    this.phase = 'ready'; this.pausedFrom = 'work'; this.set = 1; this.side = dose.perSide ? 'left' : null; this.block = 0;
    this.bStart = 0; this.bDur = 0; this.pausedAt = 0; this.termAt = 0; this.lastClock = 0; this.lastTick = this.read();
    this.reps = 0; this.completedSets = 0; this.activeMs = 0;
  }
  read() { const c = this._now(); if (c > this.lastClock) this.lastClock = c; return this.lastClock; }
  elapsed(now) {
    if (this.phase === 'ready' || this.phase === 'nextSide') return 0;
    const t = this.phase === 'paused' ? this.pausedAt : (this.phase === 'finished' || this.phase === 'abandoned') ? this.termAt : now;
    const e = Math.max(0, t - this.bStart);
    return this.bDur > 0 ? Math.min(e, this.bDur) : e;
  }
  get snap() {
    const e = this.elapsed(this.read());
    const working = this.phase === 'work' || (this.phase === 'paused' && this.pausedFrom === 'work');
    return { phase: this.phase, eff: this.phase === 'paused' ? this.pausedFrom : this.phase, set: this.set, sets: this.dose.sets, side: this.side,
      blockLabel: this.dose.blockLabels[this.block], durationMs: this.bDur, remainingMs: this.bDur > 0 ? Math.max(0, this.bDur - e) : 0,
      elapsedMs: e, reps: this.reps, target: this.target, completedSets: this.completedSets, activeWorkMs: this.activeMs + (working ? e : 0) };
  }
  enter(p, now, dur = 0) { this.phase = p; this.bStart = now; this.bDur = dur; this.lastTick = now; if (p === 'finished' || p === 'abandoned') this.termAt = now; }
  start() { if (this.phase === 'ready' || this.phase === 'nextSide') this.enter('countdown', this.read(), 3000); }
  startWork(now) { this.reps = 0; this.enter('work', now, this.dose.mode === 'time' ? this.target * 1000 : 0); }
  afterWork(now) {
    this.activeMs += this.elapsed(now);
    if (this.dose.perSide && this.side === 'left') { this.side = 'right'; this.enter('nextSide', now); return; }
    if (this.block + 1 < this.dose.blockLabels.length) { this.block++; this.side = this.dose.perSide ? 'left' : null; this.enter('nextSide', now); return; }
    this.completedSets++;
    if (this.set >= this.dose.sets) this.enter('finished', now); else this.enter('rest', now, this.dose.restSec * 1000);
  }
  nextSet(now) { this.set++; this.side = this.dose.perSide ? 'left' : null; this.block = 0; this.enter('countdown', now, 3000); }
  tick() {
    const now = this.read();
    if ((this.phase === 'work' || this.phase === 'countdown') && now - this.lastTick > this.maxGap) { this.freeze(this.lastTick); this.lastTick = now; return; }
    this.lastTick = now;
    if (this.phase === 'countdown' && this.elapsed(now) >= this.bDur) this.startWork(now);
    else if (this.phase === 'work' && this.dose.mode === 'time' && this.elapsed(now) >= this.bDur) this.afterWork(now);
    else if (this.phase === 'rest' && this.elapsed(now) >= this.bDur) this.nextSet(now);
  }
  freeze(now) { this.pausedFrom = this.phase; this.pausedAt = now; this.phase = 'paused'; }
  pause() {
    if (['work', 'rest', 'countdown'].includes(this.phase)) {
      const now = this.read(); const stalled = this.phase !== 'rest' && now - this.lastTick > this.maxGap;
      this.freeze(stalled ? this.lastTick : now);
    }
  }
  resume() { if (this.phase !== 'paused') return; const now = this.read(); this.bStart += now - this.pausedAt; this.phase = this.pausedFrom; this.lastTick = now; }
  rep() { this.tick(); if (this.phase === 'work' && this.dose.mode === 'reps') { this.reps++; if (this.reps >= this.target) this.afterWork(this.read()); } }
  completeSet() { this.tick(); if (this.phase === 'work') this.afterWork(this.read()); }
  skipRest() { if (this.phase === 'rest') this.nextSet(this.read()); }
  addRest(s = 15) { if (this.phase === 'rest') this.bDur += s * 1000; }
  abandon() {
    if (this.phase === 'finished' || this.phase === 'abandoned') return;
    const now = this.read();
    if (this.phase === 'work' || (this.phase === 'paused' && this.pausedFrom === 'work')) {
      const stalled = this.phase === 'work' && now - this.lastTick > this.maxGap;
      this.activeMs += this.elapsed(stalled ? this.lastTick : now);
    }
    this.enter('abandoned', now);
  }
}

/* ---------------- LearningStore (app/lib/control/learning_store.dart) ---------------- */
const KEY = 'flare.learning.v1';
export const ASSESS_IDS = ['wrist', 'pike', 'straddle', 'dips', 'lsit'];
const stamp = (d) => { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; };
export const dateStamp = stamp;
export function placement(g) {
  const v = Object.values(g); if (!v.length || (g.wrist ?? 1) < 2) return 1;
  const a = v.reduce((s, x) => s + x, 0) / v.length; return a >= 3 ? 3 : a >= 2 ? 2 : 1;
}
const fresh = () => ({ version: 1, safetyAccepted: false, settings: { tier: 'A', speed: 0.5, cues: true, sound: true, haptics: true, weeklyGoal: 3, themeMode: 'system' },
  lastTime: 0, today: { date: '', ids: [] }, sessions: [], completedLessonIds: [], gateReports: {}, assessmentGrades: {}, startStage: 1,
  web: { quality: 'balanced', xray: true, speed: 0.5 } });

export function validState(j) {
  try {
    const record = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
    const integer = (v, min = 0) => Number.isSafeInteger(v) && v >= min;
    const date = (v) => typeof v === 'string' && Number.isFinite(Date.parse(v));
    const unique = (v) => new Set(v).size === v.length;
    if (!record(j)) return false;
    if (j.version !== 1 || typeof j.safetyAccepted !== 'boolean') return false;
    const s = j.settings;
    if (!record(s) || !['A', 'B', 'C'].includes(s.tier) || ![0.25, 0.5, 1].includes(s.speed) ||
        !integer(s.weeklyGoal, 1) || s.weeklyGoal > 7 || ['cues', 'sound', 'haptics'].some((k) => typeof s[k] !== 'boolean') ||
        !['system', 'dark', 'light'].includes(s.themeMode ?? 'system')) return false;
    if (!Number.isFinite(j.lastTime) || j.lastTime < 0 || j.lastTime > 9) return false;
    if (!record(j.today) || typeof j.today.date !== 'string' ||
        (j.today.date !== '' && (!/^\d{4}-\d{2}-\d{2}$/.test(j.today.date) || stamp(j.today.date + 'T12:00:00') !== j.today.date))) return false;
    if (!Array.isArray(j.sessions) || j.sessions.some((x) => !record(x) || typeof x.id !== 'string' || !x.id || !Object.hasOwn(drillById, x.drillId) ||
        !date(x.startedAt) || !date(x.endedAt) || Date.parse(x.endedAt) < Date.parse(x.startedAt) ||
        !integer(x.activeSeconds) || x.activeSeconds > Math.floor((Date.parse(x.endedAt) - Date.parse(x.startedAt)) / 1000) + 1 ||
        !integer(x.plannedSets, 1) || !integer(x.completedSets) || x.completedSets > x.plannedSets ||
        typeof x.pain !== 'boolean' || typeof x.completed !== 'boolean' || (x.completed && x.completedSets !== x.plannedSets)) ||
        !unique(j.sessions.map((x) => x.id))) return false;
    if (!Array.isArray(j.today.ids) || j.today.ids.some((id) => !Object.hasOwn(drillById, id)) || !unique(j.today.ids)) return false;
    if (!Array.isArray(j.completedLessonIds) || j.completedLessonIds.some((id) => !Object.hasOwn(lessonById, id))) return false;
    if (!record(j.gateReports) || Object.entries(j.gateReports).some(([id, value]) => !Object.hasOwn(gateById, id) || typeof value !== 'boolean')) return false;
    if (!record(j.assessmentGrades)) return false;
    const grades = Object.keys(j.assessmentGrades);
    if (grades.length && (grades.length !== ASSESS_IDS.length || grades.some((id) => !ASSESS_IDS.includes(id) ||
        !integer(j.assessmentGrades[id], 1) || j.assessmentGrades[id] > 4))) return false;
    if (j.startStage !== placement(j.assessmentGrades)) return false;
    if (j.web !== undefined && (!record(j.web) || !['battery', 'balanced', 'high'].includes(j.web.quality) ||
        ![0.25, 0.5, 0.75, 1].includes(j.web.speed) || typeof j.web.xray !== 'boolean')) return false;
    return true;
  } catch (e) { return false; }
}

export class Store {
  constructor() {
    this.listeners = new Set(); this.error = null; this.blocked = false;
    let raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { this.error = '本机进度暂时无法读取（浏览器禁用了本地存储），本次记录不会保存。'; this.blocked = true; }
    this.s = fresh();
    if (raw) {
      try { const j = JSON.parse(raw); if (!validState(j)) throw 0; this.s = { ...fresh(), ...j, web: { ...fresh().web, ...(j.web || {}) } }; }
      catch (e) { this.error = '已有本机进度格式异常，已保留原数据，本次记录暂未写入。'; this.blocked = true; }
    }
  }
  on(f) { this.listeners.add(f); return () => this.listeners.delete(f); }
  save() {
    if (!this.blocked) { try { localStorage.setItem(KEY, JSON.stringify(this.s)); this.error = null; } catch (e) { this.error = '本机存储暂时不可写，记录保留在本次会话中。'; } }
    this.listeners.forEach((f) => f());
  }
  get today() { return stamp(Date.now()); }
  get todayIds() { return this.s.today.date === this.today ? this.s.today.ids : []; }
  ensureToday() { if (this.s.today.date !== this.today) this.s.today = { date: this.today, ids: [] }; }
  addToday(id) { this.ensureToday(); if (!this.s.today.ids.includes(id)) this.s.today.ids.push(id); this.save(); }
  removeToday(id) { this.ensureToday(); this.s.today.ids = this.s.today.ids.filter((x) => x !== id); this.save(); }
  setSettings(p) { Object.assign(this.s.settings, p); this.save(); }
  setWeb(p) { Object.assign(this.s.web, p); this.save(); }
  acceptSafety() { this.s.safetyAccepted = true; this.save(); }
  logSession(x) { if (!this.s.sessions.find((r) => r.id === x.id)) this.s.sessions.push(x); this.save(); }
  completeLesson(id, on = true) { const set = new Set(this.s.completedLessonIds); on ? set.add(id) : set.delete(id); this.s.completedLessonIds = [...set].sort(); this.save(); }
  reportGate(id, v) { this.s.gateReports[id] = v; this.save(); }
  recordAssessment(g) { this.s.assessmentGrades = { ...g }; this.s.startStage = placement(g); this.save(); }
  skipAssessment() { this.s.assessmentGrades = {}; this.s.startStage = 1; this.save(); }
  reset() { this.s = fresh(); this.blocked = false; this.error = null; this.save(); }
  importJSON(text) { const j = JSON.parse(text); if (!validState(j)) throw new Error('invalid'); this.s = { ...fresh(), ...j, web: { ...fresh().web, ...(j.web || {}) } }; this.blocked = false; this.save(); }
  isStagePassed(n) { const st = stages.find((s) => s.n === n); return !!st && st.lessons.every((l) => this.s.completedLessonIds.includes(l.id)) && st.gates.every((g) => this.s.gateReports[g.id] === true); }
  isStageUnlocked(n) { if (n <= this.s.startStage) return true; for (let p = this.s.startStage; p < n; p++) if (!this.isStagePassed(p)) return false; return true; }
  get currentStage() { for (const st of stages.filter((s) => s.n >= this.s.startStage)) if (!this.isStagePassed(st.n)) return st.n; return stages[stages.length - 1].n; }
  get trainingDays() { return new Set(this.s.sessions.filter((x) => x.completedSets > 0 || x.activeSeconds > 0).map((x) => stamp(x.endedAt))); }
  get completedTodayIds() { return new Set(this.s.sessions.filter((x) => x.completed && stamp(x.endedAt) === this.today).map((x) => x.drillId)); }
  get streak() {
    const days = this.trainingDays; const c = new Date(); c.setHours(12, 0, 0, 0);
    if (!days.has(stamp(c))) c.setDate(c.getDate() - 1);
    let n = 0; while (days.has(stamp(c))) { n++; c.setDate(c.getDate() - 1); } return n;
  }
  weekDays() { // Mon..Sun stamps of this week
    const n = new Date(); n.setHours(12, 0, 0, 0); const wd = (n.getDay() + 6) % 7; const out = [];
    for (let i = 0; i < 7; i++) { const d = new Date(n); d.setDate(n.getDate() - wd + i); out.push(stamp(d)); } return out;
  }
  get weekTrainingDays() { const t = this.today, days = this.trainingDays; return this.weekDays().filter((d) => d <= t && days.has(d)).length; }
  get totalMinutes() { return Math.round(this.s.sessions.reduce((s, x) => s + x.activeSeconds, 0) / 60); }
  get todayMinutes() { return Math.round(this.s.sessions.filter((x) => stamp(x.endedAt) === this.today).reduce((s, x) => s + x.activeSeconds, 0) / 60); }
}
