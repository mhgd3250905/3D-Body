import assert from 'node:assert/strict';
import { createPresentationGate } from '../src/presentation.js';

function harness() {
  let frameId = 0, drawable = true, draws = 0;
  const frames = new Map(), presented = [];
  const gate = createPresentationGate({
    canPresent: () => drawable,
    requestRender: () => draws++,
    onPresented: id => presented.push(id),
    scheduleFrame: callback => { frames.set(++frameId, callback); return frameId; },
    cancelFrame: id => frames.delete(id),
  });
  return { gate, presented,
    get draws() { return draws; },
    set drawable(value) { drawable = value; },
    frame() { const callbacks = [...frames.values()]; frames.clear(); for (const callback of callbacks) callback(); },
  };
}

{
  const h = harness();
  h.gate.request(1);
  h.gate.rendered(false); h.frame(); h.frame();
  assert.deepEqual(h.presented, [], 'an empty miniature never reveals an otherwise drawn stage');
  h.gate.rendered(true); h.frame();
  assert.deepEqual(h.presented, [], 'the first paint opportunity is not the presentation acknowledgement');
  h.frame(); h.gate.rendered(true); h.frame();
  assert.deepEqual(h.presented, [1], 'one complete stage is acknowledged exactly once');
}

{
  const h = harness();
  h.gate.request(2); h.gate.rendered(true); h.frame();
  // A late viewport/theme/seek update arrives after drawing, before commit.
  const draws = h.draws;
  h.gate.invalidate(); h.frame(); h.frame();
  assert.deepEqual(h.presented, [], 'settings invalidate a frame awaiting presentation');
  assert.ok(h.draws > draws, 'even a paused scene is asked to redraw the new settings');
  h.gate.rendered(true); h.frame(); h.frame();
  assert.deepEqual(h.presented, [2]);
}

{
  const h = harness();
  h.gate.request(3); h.gate.rendered(true); h.frame();
  h.gate.request(4); h.frame();
  assert.deepEqual(h.presented, [], 'a replacement request cannot accept the previous frame');
  h.gate.rendered(true); h.frame(); h.frame();
  assert.deepEqual(h.presented, [4]);
}

{
  const h = harness();
  h.gate.request(5); h.gate.rendered(true); h.frame();
  h.drawable = false; h.frame();
  assert.deepEqual(h.presented, [], 'a hidden, resized or lost-context stage is not presented');
  h.drawable = true;
  h.gate.rendered(true); h.frame(); h.frame();
  assert.deepEqual(h.presented, [5], 'a visible, stable redraw finishes the same pending request');
}

{
  const h = harness();
  h.gate.request(6); h.gate.rendered(true); h.frame(); h.gate.cancel(); h.frame();
  assert.deepEqual(h.presented, [], 'error/disposal cancels an in-flight acknowledgement');
  assert.equal(h.gate.pending, false);
  h.gate.request(7); h.gate.rendered(true); h.frame();
  h.gate.rendered(false); h.frame();
  assert.deepEqual(h.presented, [], 'a later incomplete draw also invalidates the commit');
  h.gate.rendered(true); h.frame(); h.frame();
  assert.deepEqual(h.presented, [7]);
}

console.log('Presentation checks passed: complete stage, paint fence, late settings, paused redraw, replacement, recovery and cancellation.');
