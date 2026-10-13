// Crotch smoothing for the Flare training human (2026-10-13, user feedback: "张开腿的时候裆部显得敏感").
// Mesh-only edit of Coach_Training_Shorts, the only surface between the legs (Coach_Body is cut out
// under the shorts). No bones, rest pose, animation, topology, UVs or garment colours change.
//  1. Skin weights: the pelvis -> thigh split across the crotch was a 2 cm step (95% pelvis on the
//     centre seam, ~55% thigh 2 cm to either side), so a wide straddle pinched the inner thigh and left
//     the centre seam as a ridge. Weights inside an ellipsoid around the crotch are diffused over the
//     welded mesh graph (harmonic-style), giving a wide, smooth pelvis->thigh blend.
//  2. Geometry, in bind space (reset pose == bind pose): the front centre panel is pressed back to the
//     level of the hip-side panels (no frontal bulge), then a masked Taubin pass removes sculpted
//     folds in the crotch so it reads as one smooth mannequin surface. Normals are recomputed there.
// window.__applyCrotchSmooth(opts) -> report. Idempotent per page (second call returns the report).
(function () {
  const sm = (a, b, x) => { const u = Math.min(1, Math.max(0, (x - a) / (b - a))); return u * u * (3 - 2 * u); };
  window.__applyCrotchSmooth = function (opts = {}) {
    if (window.__crotchSmoothReport) return window.__crotchSmoothReport;
    const o0 = Object.assign({ name: 'Coach_Training_Shorts', center: [0, 0.80, 0.01], radii: [0.15, 0.115, 0.19],
      weightIters: 110, weightAlpha: 0.75, taubinIters: 24, lambda: 0.5, mu: -0.53,
      front: { yLo: 0.785, yIn: 0.81, yOut: 0.90, yHi: 0.96, xHalf: 0.075, sideBand: [0.06, 0.08], crown: 0.006 } }, opts);
    const v = flareInspector.viewer, T = window.__toonT, mesh = v.coach.getObjectByName(o0.name);
    if (!mesh) throw new Error('crotch-smooth: mesh not found ' + o0.name);
    v.motion.reset(); window.__setRelax?.(0, 0); v.coach.updateMatrixWorld(true); mesh.skeleton.update();
    const g = mesh.geometry, P = g.attributes.position, N = g.attributes.normal, SI = g.attributes.skinIndex, SW = g.attributes.skinWeight, n = P.count;
    const names = mesh.skeleton.bones.map(b => b.name), bi = Object.fromEntries(names.map((nm, i) => [nm, i]));
    // bind-space -> world at the reset pose: every bone matrix is the same uniform scale+offset (dequantisation)
    const bm = mesh.skeleton.boneMatrices, ref = Array.from(bm.slice(bi.pelvis * 16, bi.pelvis * 16 + 16));
    const hipBones = ['pelvis', 'spineLower', 'spineUpper', 'torso', 'leftThigh', 'rightThigh'].map(nm => bi[nm]);
    for (const k of hipBones) for (let e = 0; e < 16; e++) if (Math.abs(bm[k * 16 + e] - bm[hipBones[0] * 16 + e]) > 1e-5) throw new Error('crotch-smooth: reset pose is not the bind pose at the hips');
    if (Math.abs(ref[0] - ref[5]) > 1e-6 || Math.abs(ref[0] - ref[10]) > 1e-6 || Math.abs(ref[1]) + Math.abs(ref[2]) + Math.abs(ref[4]) > 1e-6) throw new Error('crotch-smooth: non-uniform bind transform');
    const S = ref[0], O = [ref[12], ref[13], ref[14]];
    const W = new Float64Array(n * 3);
    for (let i = 0; i < n; i++) { W[i * 3] = P.getX(i) * S + O[0]; W[i * 3 + 1] = P.getY(i) * S + O[1]; W[i * 3 + 2] = P.getZ(i) * S + O[2]; }
    // weld: one node per distinct position (UV/normal seams share a node)
    const key = new Map(), node = new Int32Array(n), members = [];
    for (let i = 0; i < n; i++) { const k = Math.round(W[i * 3] * 1e5) + ',' + Math.round(W[i * 3 + 1] * 1e5) + ',' + Math.round(W[i * 3 + 2] * 1e5);
      let id = key.get(k); if (id === undefined) { id = members.length; key.set(k, id); members.push([]); } node[i] = id; members[id].push(i); }
    const M = members.length, X = new Float64Array(M * 3);
    for (let m = 0; m < M; m++) { const i = members[m][0]; X[m * 3] = W[i * 3]; X[m * 3 + 1] = W[i * 3 + 1]; X[m * 3 + 2] = W[i * 3 + 2]; }
    const nb = Array.from({ length: M }, () => new Set()), idx = g.index ? g.index.array : null, F = idx ? idx.length / 3 : n / 3;
    const tri = f => idx ? [idx[f * 3], idx[f * 3 + 1], idx[f * 3 + 2]] : [f * 3, f * 3 + 1, f * 3 + 2];
    for (let f = 0; f < F; f++) { const [a, b, c] = tri(f).map(i => node[i]); if (a !== b) { nb[a].add(b); nb[b].add(a); } if (b !== c) { nb[b].add(c); nb[c].add(b); } if (a !== c) { nb[a].add(c); nb[c].add(a); } }
    const NB = nb.map(s => [...s]);
    // region mask: 1 inside the crotch ellipsoid, smooth falloff to 0 at its surface
    const [cx, cy, cz] = o0.center, [rx, ry, rz] = o0.radii, mask = new Float64Array(M);
    for (let m = 0; m < M; m++) { const r = Math.hypot((X[m * 3] - cx) / rx, (X[m * 3 + 1] - cy) / ry, (X[m * 3 + 2] - cz) / rz); mask[m] = 1 - sm(0.55, 1.0, r); }
    // 1. weights: per-node dense vectors over the bones that occur in the region
    const used = new Set(); for (let m = 0; m < M; m++) if (mask[m] > 0) { const i = members[m][0]; for (let k = 0; k < 4; k++) if (SW.getComponent(i, k) > 0) used.add(SI.getComponent(i, k)); }
    for (const b of used) if (!hipBones.includes(b)) throw new Error('crotch-smooth: region weighted to ' + names[b]);
    const UB = [...used], ub = Object.fromEntries(UB.map((b, j) => [b, j])), D = UB.length;
    let w = new Float64Array(M * D), w2 = new Float64Array(M * D);
    for (let m = 0; m < M; m++) { const i = members[m][0]; for (let k = 0; k < 4; k++) { const b = SI.getComponent(i, k), x = SW.getComponent(i, k); if (x > 0 && ub[b] !== undefined) w[m * D + ub[b]] += x; } }
    const w0 = w.slice();
    for (let it = 0; it < o0.weightIters; it++) {
      for (let m = 0; m < M; m++) { const a = o0.weightAlpha * mask[m]; if (a <= 0 || !NB[m].length) { for (let j = 0; j < D; j++) w2[m * D + j] = w[m * D + j]; continue; }
        for (let j = 0; j < D; j++) { let s = 0; for (const q of NB[m]) s += w[q * D + j]; w2[m * D + j] = (1 - a) * w[m * D + j] + a * s / NB[m].length; } }
      [w, w2] = [w2, w]; }
    let wChanged = 0, wMax = 0;
    const quant = SW.normalized && SW.array instanceof Uint8Array;
    for (let m = 0; m < M; m++) { if (mask[m] <= 0) continue;
      const top = Array.from({ length: D }, (_, j) => [UB[j], w[m * D + j]]).filter(e => e[1] > 1e-4).sort((a, b) => b[1] - a[1]).slice(0, 4);
      const s = top.reduce((a, e) => a + e[1], 0); let vals = top.map(e => e[1] / s);
      if (quant) { const q = vals.map(x => Math.round(x * 255)); q[0] += 255 - q.reduce((a, x) => a + x, 0); vals = q.map(x => x / 255); }
      let d = 0; for (let j = 0; j < D; j++) d = Math.max(d, Math.abs(w[m * D + j] - w0[m * D + j])); wMax = Math.max(wMax, d); if (d > 0.01) wChanged++;
      for (const i of members[m]) for (let k = 0; k < 4; k++) { SI.setComponent(i, k, top[k] ? top[k][0] : 0); SW.setComponent(i, k, vals[k] || 0); } }
    // 2a. front panel: no frontal bulge. Reference = hip-side panel depth at the same height.
    const fr = o0.front, X0 = X.slice(), bins = new Map(), bk = y => Math.round(y / 0.01);
    for (let m = 0; m < M; m++) { const x = Math.abs(X[m * 3]), y = X[m * 3 + 1], z = X[m * 3 + 2];
      if (z > 0.03 && x >= fr.sideBand[0] && x <= fr.sideBand[1]) { const b = bk(y), e = bins.get(b) || [0, 0]; e[0] += z; e[1]++; bins.set(b, e); } }
    const side = y => { const b = bk(y); const vals = [b - 1, b, b + 1].map(k => bins.get(k)).filter(Boolean); if (!vals.length) return null; return vals.reduce((a, e) => a + e[0] / e[1], 0) / vals.length; };
    let frontMoved = 0, frontMax = 0;
    // node facing from the original normals (first member): the fly/inner panel faces -z behind the outer panel
    const nz0 = m => N.getZ(members[m][0]), DZ = new Float64Array(M), outer = [], inner = [];
    for (let m = 0; m < M; m++) { const x = X[m * 3], y = X[m * 3 + 1], z = X[m * 3 + 2]; if (z < 0.03 || y < fr.yLo || y > fr.yHi || Math.abs(x) > fr.xHalf) continue;
      if (nz0(m) < -0.3) { inner.push(m); continue; } outer.push(m);
      const zs = side(y); if (zs === null) continue; const u = Math.abs(x) / fr.xHalf, zt = zs + fr.crown * (1 - u * u);
      if (z <= zt) continue; const f = (1 - sm(0.55, 1, u)) * sm(fr.yLo, fr.yIn, y) * (1 - sm(fr.yOut, fr.yHi, y)); DZ[m] = (z - zt) * f; }
    // inner layers take the press of the nearest outer node, so layer spacing is preserved (no z-fighting)
    for (const m of inner) { let best = -1, bd = 1e9; for (const q of outer) { const d = Math.hypot(X[q * 3] - X[m * 3], X[q * 3 + 1] - X[m * 3 + 1]); if (d < bd) { bd = d; best = q; } } if (best >= 0 && bd < 0.012) DZ[m] = DZ[best]; }
    for (let m = 0; m < M; m++) if (DZ[m] > 0) { X[m * 3 + 2] -= DZ[m]; if (DZ[m] > 1e-4) frontMoved++; frontMax = Math.max(frontMax, DZ[m]); }
    // 2b. masked Taubin smoothing (shrink-free Laplacian) in the crotch
    const tmp = new Float64Array(M * 3), mk = Float64Array.from(mask, x => x * x);
    const lap = fac => { for (let m = 0; m < M; m++) { const a = fac * mk[m]; if (!a || !NB[m].length) { tmp[m * 3] = X[m * 3]; tmp[m * 3 + 1] = X[m * 3 + 1]; tmp[m * 3 + 2] = X[m * 3 + 2]; continue; }
      let sx = 0, sy = 0, sz = 0; for (const q of NB[m]) { sx += X[q * 3]; sy += X[q * 3 + 1]; sz += X[q * 3 + 2]; } const L = NB[m].length;
      tmp[m * 3] = X[m * 3] + a * (sx / L - X[m * 3]); tmp[m * 3 + 1] = X[m * 3 + 1] + a * (sy / L - X[m * 3 + 1]); tmp[m * 3 + 2] = X[m * 3 + 2] + a * (sz / L - X[m * 3 + 2]); } X.set(tmp); };
    for (let it = 0; it < o0.taubinIters; it++) { lap(o0.lambda); lap(o0.mu); }
    let moved = 0, maxMove = 0;
    for (let m = 0; m < M; m++) { const d = Math.hypot(X[m * 3] - X0[m * 3], X[m * 3 + 1] - X0[m * 3 + 1], X[m * 3 + 2] - X0[m * 3 + 2]) + Math.abs(X0[m * 3 + 2] - X0[m * 3 + 2]);
      if (d > 1e-5) moved++; maxMove = Math.max(maxMove, d); }
    // write back positions (bind space) for every member of a node; recompute normals in the region
    for (let m = 0; m < M; m++) for (const i of members[m]) P.setXYZ(i, (X[m * 3] - O[0]) / S, (X[m * 3 + 1] - O[1]) / S, (X[m * 3 + 2] - O[2]) / S);
    const acc = new Float64Array(M * 3);
    for (let f = 0; f < F; f++) { const [a, b, c] = tri(f).map(i => node[i]);
      const ux = X[b * 3] - X[a * 3], uy = X[b * 3 + 1] - X[a * 3 + 1], uz = X[b * 3 + 2] - X[a * 3 + 2], vx = X[c * 3] - X[a * 3], vy = X[c * 3 + 1] - X[a * 3 + 1], vz = X[c * 3 + 2] - X[a * 3 + 2];
      const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; for (const q of [a, b, c]) { acc[q * 3] += nx; acc[q * 3 + 1] += ny; acc[q * 3 + 2] += nz; } }
    let nChanged = 0;
    for (let m = 0; m < M; m++) { const moveW = Math.min(1, Math.hypot(X[m * 3] - X0[m * 3], X[m * 3 + 1] - X0[m * 3 + 1], X[m * 3 + 2] - X0[m * 3 + 2]) / 0.0005);
      const t = Math.max(Math.min(1, mask[m] * 2), moveW); if (t <= 0) continue; const L = Math.hypot(acc[m * 3], acc[m * 3 + 1], acc[m * 3 + 2]); if (!L) continue;
      for (const i of members[m]) { const ox = N.getX(i), oy = N.getY(i), oz = N.getZ(i); // keep the original facing (the welded node can carry flipped duplicates)
        let nx = acc[m * 3] / L, ny = acc[m * 3 + 1] / L, nz = acc[m * 3 + 2] / L; if (nx * ox + ny * oy + nz * oz < 0) { nx = -nx; ny = -ny; nz = -nz; }
        const x = ox + (nx - ox) * t, y = oy + (ny - oy) * t, z = oz + (nz - oz) * t, l = Math.hypot(x, y, z) || 1; N.setXYZ(i, x / l, y / l, z / l); }
      nChanged++; }
    for (const a of [P, N, SI, SW]) { a.needsUpdate = true; if (a.isInterleavedBufferAttribute) a.data.needsUpdate = true; }
    g.computeBoundingBox(); g.computeBoundingSphere(); mesh.computeBoundingBox?.(); mesh.computeBoundingSphere?.();
    if (window.__drill) window.__drill._mc = null; // hand-clip mesh cache holds rest positions
    if (fm) fm.restArea = null; // fold metric: re-baseline on the smoothed rest shape (same triangle set)
    window.__crotchSmoothReport = { mesh: o0.name, vertices: n, weldedNodes: M, regionNodes: mask.reduce((a, x) => a + (x > 0), 0),
      weightNodesChanged: wChanged, weightMaxDelta: +wMax.toFixed(3), bonesInRegion: UB.map(b => names[b]),
      frontNodesPressed: frontMoved, frontMaxPressMm: +(frontMax * 1000).toFixed(1), nodesMoved: moved, maxMoveMm: +(maxMove * 1000).toFixed(1), normalsUpdatedNodes: nChanged, params: o0 };
    return window.__crotchSmoothReport;
  };
  // QA metric (works with or without the smoothing applied): CPU-skins the crotch-region triangles of
  // the shorts at the current pose and counts folded triangles (face normal opposite to the skinned
  // vertex normals) and pinched ones (area < 35% of rest). Region = default ellipsoid, fixed at rest.
  let fm = null;
  window.__crotchFoldMetric = function () {
    const v = flareInspector.viewer, mesh = v.coach.getObjectByName('Coach_Training_Shorts'), g = mesh.geometry;
    const P = g.attributes.position, N = g.attributes.normal, SI = g.attributes.skinIndex, SW = g.attributes.skinWeight;
    if (!fm) { // rest frame of reference: bind space; dequant scale/offset from the pelvis bind matrix at rest is not needed (ratios only)
      const C = [0, 0.80, 0.01], R = [0.15, 0.115, 0.19], idx = g.index.array, tris = [], S = 0.1765, O = [0, 0.8057, 0.0125];
      const wp = i => [P.getX(i) * S + O[0], P.getY(i) * S + O[1], P.getZ(i) * S + O[2]];
      for (let f = 0; f < idx.length / 3; f++) { const a = idx[f * 3], b = idx[f * 3 + 1], c = idx[f * 3 + 2];
        const q = [a, b, c].map(wp).reduce((s, x) => [s[0] + x[0] / 3, s[1] + x[1] / 3, s[2] + x[2] / 3], [0, 0, 0]);
        if (Math.hypot((q[0] - C[0]) / R[0], (q[1] - C[1]) / R[1], (q[2] - C[2]) / R[2]) < 0.9) tris.push(a, b, c); }
      fm = { tris: Int32Array.from(tris), restArea: null }; }
    mesh.skeleton.update(); const bm = mesh.skeleton.boneMatrices;
    const sk = i => { let x = 0, y = 0, z = 0, nx = 0, ny = 0, nz = 0; const px = P.getX(i), py = P.getY(i), pz = P.getZ(i), qx = N.getX(i), qy = N.getY(i), qz = N.getZ(i);
      for (let k = 0; k < 4; k++) { const w = SW.getComponent(i, k); if (!w) continue; const m = SI.getComponent(i, k) * 16;
        x += w * (bm[m] * px + bm[m + 4] * py + bm[m + 8] * pz + bm[m + 12]); y += w * (bm[m + 1] * px + bm[m + 5] * py + bm[m + 9] * pz + bm[m + 13]); z += w * (bm[m + 2] * px + bm[m + 6] * py + bm[m + 10] * pz + bm[m + 14]);
        nx += w * (bm[m] * qx + bm[m + 4] * qy + bm[m + 8] * qz); ny += w * (bm[m + 1] * qx + bm[m + 5] * qy + bm[m + 9] * qz); nz += w * (bm[m + 2] * qx + bm[m + 6] * qy + bm[m + 10] * qz); }
      return [x, y, z, nx, ny, nz]; };
    const t = fm.tris, nT = t.length / 3, areas = new Float64Array(nT); let folded = 0;
    for (let f = 0; f < nT; f++) { const A = sk(t[f * 3]), B = sk(t[f * 3 + 1]), Cc = sk(t[f * 3 + 2]);
      const ux = B[0] - A[0], uy = B[1] - A[1], uz = B[2] - A[2], vx = Cc[0] - A[0], vy = Cc[1] - A[1], vz = Cc[2] - A[2];
      const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; areas[f] = Math.hypot(nx, ny, nz) / 2;
      if (nx * (A[3] + B[3] + Cc[3]) + ny * (A[4] + B[4] + Cc[4]) + nz * (A[5] + B[5] + Cc[5]) < 0) folded++; }
    if (!fm.restArea) { // first call must be at the rest pose
      fm.restArea = areas.slice(); fm.restFolded = folded; }
    let pinched = 0, minRatio = 9; for (let f = 0; f < nT; f++) { const r = areas[f] / Math.max(fm.restArea[f], 1e-14); if (r < 0.35) pinched++; minRatio = Math.min(minRatio, r); }
    return { tris: nT, folded: folded - fm.restFolded, pinched, minAreaRatio: +minRatio.toFixed(3) };
  };
})();
