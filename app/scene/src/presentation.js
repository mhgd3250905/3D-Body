// Asset readiness only opens the command bridge. Presentation additionally
// requires a complete draw of the configured stage and two browser frames.
export function createPresentationGate({ canPresent, requestRender, onPresented,
  scheduleFrame = callback => requestAnimationFrame(callback), cancelFrame = id => cancelAnimationFrame(id) }) {
  let requestId = null, generation = 0, frame = null;
  function invalidate() {
    generation++;
    if (frame !== null) cancelFrame(frame);
    frame = null;
    // Paused scenes also need a fresh draw after a setting invalidates a fence.
    if (requestId !== null) requestRender();
  }
  function request(id) { requestId = id; invalidate(); }
  function cancel() { requestId = null; invalidate(); }
  function rendered(complete) {
    if (requestId === null) return;
    if (!complete || !canPresent()) { invalidate(); return; }
    if (frame !== null) return;
    const version = generation, id = requestId;
    function commit(remaining) {
      frame = scheduleFrame(() => {
        if (version !== generation || id !== requestId) return;
        frame = null;
        if (!canPresent()) { invalidate(); return; }
        if (remaining > 1) commit(remaining - 1);
        else { requestId = null; onPresented(id); }
      });
    }
    commit(2);
  }
  return { request, invalidate, rendered, cancel, get pending() { return requestId !== null; } };
}
