import * as THREE from 'three';
import { loadFlareV5 } from './v5/renderer.js';

const speeds = [0.25, 0.5, 1];
let period = 1;
let renderer, stage, frameRequest, requestId;
let time = 0, speed = 0.5, yaw = 0, pointer = null;
let playing = false, visible = true, fxEnabled = true;
let last = 0, lastState = -Infinity;

function post(type, fields = {}) {
  const event = { source: 'flare-scene', type, time, period, speed, playing, ...fields };
  if (window.FlareHost?.postMessage) window.FlareHost.postMessage(JSON.stringify(event));
  else if (window.parent !== window) window.parent.postMessage(event, window.location.origin);
}

function schedule() {
  if (stage && visible && !document.hidden && !frameRequest) frameRequest = requestAnimationFrame(render);
}

function render(now) {
  frameRequest = null;
  if (!visible || document.hidden) return;
  if (playing && last) time = (time + (now - last) * .001 * speed) % period;
  last = now;
  stage.render(time / period, { fxEnabled, yaw });
  if (requestId != null) {
    post('presented', { requestId });
    requestId = null;
  }
  if (playing && now - lastState >= 100) {
    lastState = now;
    post('state');
  }
  if (playing) schedule();
}

function command(input) {
  switch (input?.type) {
    case 'play': playing = true; last = 0; break;
    case 'pause': playing = false; break;
    case 'seek':
      if (!Number.isFinite(input.time)) return;
      playing = false;
      time = Math.max(0, Math.min(input.time, period - 1 / 120));
      break;
    case 'speed': if (speeds.includes(input.value)) speed = input.value; break;
    case 'fx': fxEnabled = input.value === true; break;
    case 'visibility':
      visible = input.visible === true;
      if (!visible) playing = false;
      break;
    case 'present': requestId = input.requestId; break;
    default: return;
  }
  schedule();
  if (stage && input.type !== 'present') post('state');
}

window.flareBridge = Object.freeze({ command });
window.addEventListener('message', event => {
  if (event.source === window.parent && event.origin === window.location.origin &&
      event.data?.source === 'flare-host') command(event.data.command);
});

function resize() {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  schedule();
}

async function boot() {
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const graphics = renderer.getContext();
    if ('drawingBufferColorSpace' in graphics) graphics.drawingBufferColorSpace = 'srgb';
    const canvas = renderer.domElement;
    document.body.append(canvas);
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      playing = false;
      post('error', { errorCode: 'graphics_context_lost' });
    });
    canvas.addEventListener('pointerdown', event => {
      if (pointer) return;
      canvas.setPointerCapture(event.pointerId);
      pointer = { id: event.pointerId, x: event.clientX };
    });
    canvas.addEventListener('pointermove', event => {
      if (pointer?.id !== event.pointerId) return;
      yaw += (pointer.x - event.clientX) * .01;
      pointer.x = event.clientX;
      schedule();
    });
    canvas.addEventListener('lostpointercapture', event => {
      if (pointer?.id === event.pointerId) pointer = null;
    });
    resize();
    stage = await loadFlareV5(renderer);
    period = stage.period;
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        playing = false;
        post('state');
      } else {
        last = 0;
        schedule();
      }
    });
    window.addEventListener('pagehide', event => {
      if (event.persisted) return;
      if (frameRequest) cancelAnimationFrame(frameRequest);
      stage.dispose();
      renderer.dispose();
    });
    post('ready');
    schedule();
  } catch (error) {
    console.error(error);
    post('error', { errorCode: 'scene-load-failed' });
  }
}
void boot();
