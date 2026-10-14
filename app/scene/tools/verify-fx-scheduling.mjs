import assert from 'node:assert/strict';
import fs from 'node:fs';
import { gunzipSync } from 'node:zlib';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { FlarePlayer } from '../src/player.js';
import { createBakedMotion } from '../src/baked-motion.js';
import { createFlareFx } from '../src/fx.js';

// Exercise the actual player tick/render hooks and FX using the shipped rigs.
// A reduced-motion detail view has neither hotspot movement nor a camera glide
// to keep drawing. Its FX fade must schedule and then finish its own frames.
const rig = JSON.parse(fs.readFileSync(new URL('../public/coach/coach-v41-rig.json', import.meta.url), 'utf8'));
const savedPerformance = globalThis.performance, savedMatchMedia = globalThis.matchMedia;
let now = 0;
globalThis.performance = { now: () => now };
globalThis.matchMedia = () => ({ matches: true });

try {
  for (const asset of ['flare-coach-v41-animated.meshopt.glb.gz', 'flare-coach-v41-training-human-collarfix-20261013.glb.gz']) {
    const bytes = gunzipSync(fs.readFileSync(new URL('../public/coach/' + asset, import.meta.url)));
    const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)
      .parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
    const player = Object.create(FlarePlayer.prototype);
    let renders = 0, detail = false, renderedFxVisible = null;
    Object.assign(player, {
      scene: new THREE.Scene(), coach: gltf.scene, motion: createBakedMotion(gltf, rig),
      camera: new THREE.PerspectiveCamera(32, 1, 0.02, 40), baseFov: 32,
      container: { clientWidth: 390, clientHeight: 844 },
      controls: { target: new THREE.Vector3(0, 0.5, 0), enableDamping: true, update() {} },
      time: 0, period: 9, speed: 1, loopRange: null, playing: true, dirty: true,
      running: true, last: now, viewInset: 0, viewInsetTarget: 0, framingMode: 'main',
      renderer: { domElement: { height: 844 }, render() { renders++; renderedFxVisible = fx.root.visible; } },
      callbacks: {},
    });
    player.scene.add(player.coach); player.camera.position.set(0, 2, 4);
    const fx = createFlareFx(player);
    player.callbacks.onBeforeRender = () => fx.update(performance.now(), !detail);
    const frames = count => { for (let i = 0; i < count; i++) { now += 1000 / 60; player.tick(now); } };

    frames(180);
    assert.equal(fx.level, 1, asset + ': FX appears during playback');
    const pausedTime = player.time;
    detail = true; player.playing = false; player.framingMode = 'detail';
    player.glideTo(new THREE.Vector3(0, 1, 4), new THREE.Vector3(0, 0.5, 0));
    assert.equal(player.glide, null, 'reduced motion enters detail without a glide');
    frames(90);
    assert.equal(player.time, pausedTime, 'entering detail preserves the paused animation frame');
    assert.equal(fx.level, 0, asset + ': detail FX fade completes without another animation requesting frames');
    assert.equal(renderedFxVisible, false, 'the final hidden FX state is rendered');
    assert.equal(player.dirty, false, 'the fade releases its render request');
    const settledRenders = renders;
    frames(90);
    assert.equal(renders, settledRenders, 'settled detail stops rendering');
    fx.dispose(); player.motion.dispose();
    console.log(asset + ': playback, reduced-motion detail fade and idle rendering passed.');
  }
} finally {
  globalThis.performance = savedPerformance;
  if (savedMatchMedia === undefined) delete globalThis.matchMedia;
  else globalThis.matchMedia = savedMatchMedia;
}
