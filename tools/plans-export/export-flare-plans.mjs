import { readFile, writeFile } from 'node:fs/promises';

const source = new URL('../../app/assets/data/flare-plans.json', import.meta.url);
const destination = new URL('./flare-plans-source.json', import.meta.url);
const selectedIds = new Set([
  'general-warmup',
  'general-cooldown',
  'general-cooldown-t2',
  'general-cooldown-t3',
]);

const { plans: sourcePlans } = JSON.parse(await readFile(source, 'utf8'));
if (!Array.isArray(sourcePlans)) {
  throw new Error('Expected a plans array in the Flare app catalog.');
}

const plans = sourcePlans.filter((plan) => selectedIds.has(plan.id));
for (const id of selectedIds) {
  if (plans.filter((plan) => plan.id === id).length !== 1) {
    throw new Error(`Expected exactly one Flare plan with ID ${id}.`);
  }
}

await writeFile(destination, JSON.stringify({ plans }, null, 2) + '\n', 'utf8');
