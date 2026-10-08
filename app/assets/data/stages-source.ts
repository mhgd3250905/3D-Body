// The 6-stage learning path. Lessons reference drills by id (07_训练库/drills.json)
// and phases by source step (06_肌群数据). Lesson lists are a FIRST DRAFT [示意] —
// the coaching content must be reviewed by a breaking coach before release.
export interface Gate { id: string; text: string; kind: 'hold' | 'reps' | 'pain-free' | 'ai'; target: number; unit: 's' | 'reps' | 'score'; phases?: number[] }
export interface Lesson { n: number; title: string; phases: number[]; drills: string[]; minutes: number }
export interface Stage { n: 1 | 2 | 3 | 4 | 5 | 6; weeks: [number, number]; gates: Gate[]; lessons: Lesson[]; pro: boolean }

export const STAGES: Stage[] = [
  { n: 1, weeks: [1, 2], pro: false,
    gates: [{ id: 'compression20', text: '屈体压缩 20 秒', kind: 'hold', target: 20, unit: 's' },
            { id: 'wristPainFree', text: '手腕伸展无痛', kind: 'pain-free', target: 1, unit: 'reps' }],
    lessons: [
      { n: 1, title: '手腕热身（每次必做）', phases: [], drills: ['forearms-A'], minutes: 6 },
      { n: 2, title: '肩胛稳定', phases: [9, 13], drills: ['serratus-A', 'scapular-A', 'triceps-A'], minutes: 15 },
      { n: 3, title: '压缩力量', phases: [9, 12], drills: ['hip-flexors-A', 'abs-A'], minutes: 15 },
    ] },
  { n: 2, weeks: [1, 3], pro: false,
    gates: [{ id: 'sideSupport10', text: '每只手侧撑 10 秒', kind: 'hold', target: 10, unit: 's' }],
    lessons: [
      { n: 1, title: '直臂支撑', phases: [9, 13], drills: ['triceps-B', 'deltoids-A'], minutes: 18 },
      { n: 2, title: '单手移重', phases: [10, 14], drills: ['serratus-A', 'rotator-cuff-A', 'forearms-A'], minutes: 18 },
      { n: 3, title: '三点支撑到侧撑', phases: [10, 11], drills: ['deltoids-A', 'obliques-A'], minutes: 18 },
    ] },
  { n: 3, weeks: [2, 3], pro: true,
    gates: [{ id: 'circles3', text: '3 个干净的开腿绕环', kind: 'reps', target: 3, unit: 'reps' }],
    lessons: [
      { n: 1, title: '跨步绕环', phases: [12, 13, 14], drills: ['hip-abductors-A', 'adductors-A'], minutes: 18 },
      { n: 2, title: '脚辅助后撑 · 高 V 开腿', phases: [9, 11], drills: ['hip-abductors-A', 'glute-max-A', 'erectors-A'], minutes: 18 },
      { n: 3, title: '高 V 侧撑保持', phases: [11, 15], drills: ['deltoids-A', 'obliques-A', 'hip-abductors-A'], minutes: 18 },
    ] },
  { n: 4, weeks: [2, 3], pro: true,
    gates: [{ id: 'ai9to11', text: 'AI 检测 09–11 得分 ≥70', kind: 'ai', target: 70, unit: 'score', phases: [9, 10, 11] }],
    lessons: [
      { n: 1, title: '后撑换手到侧撑', phases: [9, 10, 11], drills: ['deltoids-A', 'triceps-A', 'rotator-cuff-B'], minutes: 20 },
      { n: 2, title: '髋保持高度', phases: [10, 11, 16], drills: ['obliques-B', 'erectors-A'], minutes: 20 },
      { n: 3, title: '落手：掌先平、手臂竖直', phases: [13, 14], drills: ['forearms-B', 'serratus-B'], minutes: 20 },
    ] },
  { n: 5, weeks: [2, 3], pro: true,
    gates: [{ id: 'aiFull', text: '整圈 AI 得分 ≥70', kind: 'ai', target: 70, unit: 'score', phases: [9, 10, 11, 12, 13, 14, 15, 16] }],
    lessons: [
      { n: 1, title: '起势（kick-in）', phases: [9, 10], drills: ['glute-max-A', 'hamstrings-A'], minutes: 20 },
      { n: 2, title: '一整圈', phases: [9, 10, 11, 12, 13, 14, 15, 16], drills: ['deltoids-B', 'abs-B'], minutes: 22 },
      { n: 3, title: '第二侧（左手）', phases: [14, 15, 16], drills: ['deltoids-A', 'lats-A'], minutes: 20 },
    ] },
  { n: 6, weeks: [3, 6], pro: true,
    gates: [{ id: 'linked2', text: '连续 2 圈', kind: 'reps', target: 2, unit: 'reps' }],
    lessons: [
      { n: 1, title: '节奏：匀速无停顿', phases: [16, 9, 10], drills: ['abs-C', 'triceps-C'], minutes: 22 },
      { n: 2, title: '耐力', phases: [], drills: ['deltoids-C', 'hip-flexors-C'], minutes: 25 },
      { n: 3, title: '连续托马斯', phases: [], drills: ['scapular-C', 'obliques-C'], minutes: 25 },
    ] },
];

// Placement: each test graded 1..4 (see zh-CN assessment.grades); thresholds are [示意] and need validation.
export const PLACEMENT = {
  dips: [[0, 3, 1], [4, 7, 2], [8, 12, 3], [13, 999, 4]],          // reps → grade (from mockup s2)
  rule: (grades: Record<string, number>) => {
    const g = Object.values(grades); const avg = g.reduce((a, b) => a + b, 0) / Math.max(1, g.length);
    const wristOk = (grades.wrist ?? 1) >= 2;
    if (!wristOk) return 1;                                         // wrists first, always
    return avg >= 3 ? 3 : avg >= 2 ? 2 : 1;                          // never place above stage 3
  },
};
