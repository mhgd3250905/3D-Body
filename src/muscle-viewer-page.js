// Standalone test / porting page: /muscle-viewer.html?groups=quadriceps,glutes&title=...
// Optional: &secondary=adductors &deep=hip-flexors &side=left &subtitle=... &accent=%23ff5a36 &select=glutes &view=back &debug=1
import { createMuscleViewer } from './muscle-viewer.js';
import { resolveGroup } from './muscle-map.js';

const query = new URLSearchParams(location.search);
const ids = key => (query.get(key) ?? '').split(',').map(value => value.trim()).filter(Boolean);
const side = query.get('side') ?? 'both';
const groups = ids('groups').length || ids('secondary').length || ids('deep').length ? ids('groups') : ['quadriceps', 'glutes'];
const items = [
  ...groups.map(groupId => ({ groupId, level: resolveGroup(groupId)?.deep ? 'deep' : 'primary', side })),
  ...ids('secondary').map(groupId => ({ groupId, level: 'secondary', side })),
  ...ids('deep').map(groupId => ({ groupId, level: 'deep', side })),
];
const viewer = createMuscleViewer({ debugTools: query.has("tools"),
  container: document.getElementById('muscle-viewer'),
  title: query.get('title') ?? '目标肌群', subtitle: query.get('subtitle') ?? '3D 位置示意',
  items, accent: query.get('accent') ?? '#ff5a36', debug: query.has('debug'),
});
const wait = setInterval(() => {
  if (!viewer.state.loaded) return;clearInterval(wait);
  if (query.get('view') === 'back') viewer.setView('back');
  if (query.get('select')) setTimeout(() => viewer.select(query.get('select')), 50);
}, 50);
if (query.has('inspect')) window.muscleViewer = viewer;
