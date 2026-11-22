// With Vite running, open /?actor=flare-v5 in Chrome at a phone viewport.
// In the browser console, run (await import('/tools/test-handoff-frames.mjs')).runHandoffFrameTest().
import { Vector2, Vector3, Vector4 } from 'three';
import { FlarePlayer } from '../src/player.js';

function check(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitFor(find, label) {
  for (let attempt = 0; attempt < 360; attempt++) {
    const result = find();
    if (result) return result;
    await new Promise(resolve => requestAnimationFrame(resolve));
  }
  throw new Error('Timed out waiting for ' + label);
}

function findCrown(actor) {
  // V5 hair is rigid geometry in head-local coordinates. Track its actual
  // crown vertex, which moves with the head independently of the camera.
  const hair = actor.root.getObjectByName('hair-spiky');
  check(hair, 'V5 hair is required');
  const point = new Vector3();
  let crown;
  hair.traverseVisible(mesh => {
    if (!mesh.isMesh || mesh.userData.__outline) return;
    const vertices = mesh.geometry.getAttribute('position');
    for (let i = 0; i < vertices.count; i++) {
      point.fromBufferAttribute(vertices, i);
      if (!crown || point.y > crown.point.y) crown = { mesh, point: point.clone() };
    }
  });
  check(crown, 'V5 crown vertex is required');
  return crown;
}

function captureFrame(player, camera, crown) {
  const { renderer } = player;
  const canvas = renderer.domElement;
  const { x, y, width, height } = canvas.getBoundingClientRect();
  const viewport = renderer.getViewport(new Vector4());
  const size = renderer.getSize(new Vector2());
  const screen = position => {
    const ndc = position.project(camera);
    return [
      x + (viewport.x + (1 + ndc.x) * viewport.z / 2) * width / size.x,
      y + (size.y - viewport.y - (1 + ndc.y) * viewport.w / 2) * height / size.y,
    ];
  };
  const flight = player.hubFlight;
  return {
    frame: renderer.info.render.frame,
    phase: flight ? flight.returning ? 'return' : flight.landed ? 'landed' : 'entry'
      : player.trainingHub ? 'hub' : 'home',
    canvas: [x, y, width, height],
    buffer: [canvas.width, canvas.height],
    pixelRatio: renderer.getPixelRatio(),
    stageProps: player.stageProps.map(prop => prop.visible),
    scissor: renderer.getScissorTest() ? renderer.getScissor(new Vector4()).toArray() : null,
    shadowOpacity: player.shadowCatcher.material.opacity,
    poseTime: player.motion.getMetrics().time,
    pelvis: screen(new Vector3(...player.v5.joint('pelvis'))),
    headTop: screen(crown.mesh.localToWorld(crown.point.clone())),
  };
}

function checkHandoff(label, before, after) {
  check(after.frame === before.frame + 1, label + ' frames must be consecutive draws');
  for (const key of ['canvas', 'buffer', 'pixelRatio', 'stageProps', 'scissor', 'shadowOpacity', 'poseTime']) {
    check(JSON.stringify(before[key]) === JSON.stringify(after[key]),
      label + ' changed ' + key + ': ' + JSON.stringify([before[key], after[key]]));
  }
  const compare = key => {
    const dx = after[key][0] - before[key][0];
    const dy = after[key][1] - before[key][1];
    const distance = Math.hypot(dx, dy);
    check(distance <= 1, label + ' ' + key + ' moved ' + distance + ' CSS px');
    const round = value => Number(value.toFixed(6));
    return { before: before[key].map(round), after: after[key].map(round),
      delta: [round(dx), round(dy)], distance: round(distance) };
  };
  return { frames: [before.frame, after.frame], pelvis: compare('pelvis'), headTop: compare('headTop') };
}

export async function runHandoffFrameTest({ top = -30, height = 374, clipTop, clipBottom, duration = 650 } = {}) {
  await waitFor(() => window.__flareScene?.getState().ready, 'the V5 scene');
  check(window.__flareScene.getState().character === 'flare-v5', 'Open the scene with ?actor=flare-v5');
  check(!window.__flareScene.getTrainingHub(), 'Reload the scene before repeating the test');
  const command = window.flareBridge.command;
  const oldHost = window.FlareHost;
  const messages = [];
  const frames = [];
  const renderActor = FlarePlayer.prototype.renderActor;
  let crown;
  window.FlareHost = { postMessage: raw => messages.push(JSON.parse(raw)) };
  FlarePlayer.prototype.renderActor = function (scene, camera, reuseShadow) {
    renderActor.call(this, scene, camera, reuseShadow);
    if (scene !== this.scene || this.renderer.getRenderTarget()) return;
    crown ??= findCrown(this.v5);
    frames.push(captureFrame(this, camera, crown));
  };

  try {
    const phaseTime = 3.16;
    const angleYaw = .59;
    const flight = { type: 'hub_flight', time: phaseTime, top, height, clipTop, clipBottom, duration };
    command({ type: 'viewport', top: Math.max(0, -top), bottom: 160, animate: false });
    command({ type: 'seek', time: phaseTime });
    const home = await waitFor(() => frames.find(frame => frame.phase === 'home'), 'the home pose');

    command({ ...flight, id: 1, yaw: angleYaw });
    await waitFor(() => messages.find(message => message.type === 'hub_flight_done' && message.id === 1), 'entry landing');
    command({ type: 'hub_flight', id: 0 });
    // The host acknowledges completion before the hub page sends its scene configuration.
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    check(frames.at(-1).phase === 'landed', 'The actor must stay landed while the hub page mounts');
    const hub = {
      type: 'hub_scene', phaseSource: 12, phaseTime, angleYaw, muscleId: 'deltoids',
      muscleCamera: { position: [0, 1.155, 3.4], target: [0, 1.155, 0], fov: 26, overviewHeight: 1.155 },
      viewportTop: top, viewportHeight: height, viewportClipTop: clipTop, viewportClipBottom: clipBottom,
      showMuscles: false, animate: false,
    };
    command(hub);
    const firstHubIndex = await waitFor(() => {
      const index = frames.findIndex(frame => frame.phase === 'hub');
      return index > 0 ? index : null;
    }, 'the first settled hub frame');
    const beforeEntry = frames[firstHubIndex - 1];
    const firstLanding = frames[firstHubIndex - 2];
    check(beforeEntry.phase === 'landed' && firstLanding?.phase === 'landed', 'The hub must follow two landed frames');
    checkHandoff('Entry landing hold', firstLanding, beforeEntry);
    const landed = frames[firstHubIndex];
    const entry = checkHandoff('Entry', beforeEntry, landed);
    if (clipBottom != null) {
      const clippedRows = Math.round(home.canvas[3] - clipBottom);
      check(landed.scissor?.[1] === clippedRows, 'The actual scissor must reflect the host scroll clip');
    }

    const secondHub = await waitFor(() => frames[firstHubIndex + 1], 'the second settled hub frame');
    checkHandoff('Entry second frame', frames[firstHubIndex], secondHub);

    const yaw = -.83;
    command({ type: 'hub_angle', yaw });
    const beforeReturn = frames.at(-1);
    const rotated = await waitFor(() => {
      const latest = frames.at(-1);
      return latest !== beforeReturn && latest.phase === 'hub' ? latest : null;
    }, 'the rotated hub shot');
    check(Math.hypot(rotated.headTop[0] - secondHub.headTop[0], rotated.headTop[1] - secondHub.headTop[1]) > 1,
      'The return test must exercise a changed viewing angle');

    // Return from a different training pose so a premature time change is visible.
    const returnTime = 5.25;
    command({ ...hub, phaseSource: 14, phaseTime: returnTime, angleYaw: yaw });
    await waitFor(() => frames.at(-1).poseTime === returnTime, 'the selected return pose');
    command({ ...flight, id: 2, returning: true, time: returnTime, yaw });
    const firstReturnIndex = await waitFor(() => {
      const index = frames.findIndex(frame => frame.phase === 'return');
      return index > 0 ? index : null;
    }, 'the first return frame');
    const beforeFlight = frames[firstReturnIndex - 1];
    check(beforeFlight.phase === 'hub', 'The return must follow a settled hub frame');
    const afterFlight = frames[firstReturnIndex];
    const returned = checkHandoff('Return', beforeFlight, afterFlight);
    const secondReturn = await waitFor(() => frames[firstReturnIndex + 1], 'the second return frame');
    check(secondReturn.phase === 'return', 'The next draw must still be a return frame');
    checkHandoff('Return second frame', afterFlight, secondReturn);
    await waitFor(() => messages.find(message => message.type === 'hub_flight_done' && message.id === 2), 'return landing');
    command({ type: 'hub_exit' });
    command({ type: 'hub_flight', id: 0 });
    const lastHome = await waitFor(() => {
      const latest = frames.at(-1);
      return latest !== home && latest.phase === 'home' ? latest : null;
    }, 'the home frame after return');

    check(frames.every(frame => JSON.stringify(frame.canvas) === JSON.stringify(home.canvas)),
      'Canvas origin or CSS size changed during flight');
    return { canvas: home.canvas, entryBuffer: beforeEntry.buffer, returnBuffer: beforeFlight.buffer,
      entryScissor: beforeEntry.scissor, returnScissor: beforeFlight.scissor,
      beforeHome: home.frame, afterHome: lastHome.frame, checkedDraws: frames.length,
      entry, return: returned };
  } finally {
    FlarePlayer.prototype.renderActor = renderActor;
    if (oldHost === undefined) delete window.FlareHost;
    else window.FlareHost = oldHost;
  }
}
