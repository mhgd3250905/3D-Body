// Reproducible, offline model photography. Source meshes, panels and runtime
// are read only. Generates the 17 groupId.webp images and their provenance.
// node app/tools/render-muscle-thumbnails.mjs --playwright-root E:/DevCaches/npm/_npx/9833c18b2d85bc59/node_modules/playwright --browser E:/DevCaches/playwright/chromium-1140/chrome-win/chrome.exe
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2), value = (flag, fallback) => args.includes(flag) ? args[args.indexOf(flag) + 1] : fallback;
const toonV1 = args.includes('--toon-v1');
const compareToon = args.includes('--toon-review');
const defaultOutput = toonV1 ? 'muscle-toon-v1' : compareToon ? 'muscle-toon-sample' : '2026-10-11-muscle-thumbnails-metallic';
const output = path.resolve(value('--output', path.join(root, 'output/playwright', defaultOutput)));
const assets = path.join(root, 'app/assets/muscles');
const preview = args.includes('--preview'), requestedGroups = value('--groups', null)?.split(',');
const projectRoot = value('--project-output', root);
const evidenceRoot = path.resolve(projectRoot, 'output/playwright');
if (!output.startsWith(root + path.sep) && !((compareToon || toonV1) && output.startsWith(evidenceRoot + path.sep))) {
  throw new Error('Output must remain inside the working tree or the project Playwright output directory.');
}
fs.mkdirSync(output, { recursive: true });
if (!compareToon && !toonV1) fs.mkdirSync(assets, { recursive: true });
const source = path.join(root, 'app/scene/public/anatomy/mannequin-reference.meshopt.glb.gz');
const compressed = fs.readFileSync(source), decoded = gunzipSync(compressed);
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const relative = file => path.relative(root, file).replaceAll('\\', '/');
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
  if (pathname === '/model.glb') { res.setHeader('Content-Type', 'model/gltf-binary'); res.end(decoded); return; }
  let base, suffix;
  if (pathname.startsWith('/three/')) { base = path.join(root, 'app/scene/node_modules/three'); suffix = pathname.slice(7); }
  else if (pathname.startsWith('/scene/')) { base = path.join(root, 'app/scene'); suffix = pathname.slice(7); }
  else { res.writeHead(404).end(); return; }
  const file = path.resolve(base, suffix);
  if (!file.startsWith(base + path.sep)) { res.writeHead(403).end(); return; }
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404).end(); return; }
  res.setHeader('Content-Type', file.endsWith('.html') ? 'text/html' : 'text/javascript'); fs.createReadStream(file).pipe(res);
});
const playwrightRoot = value('--playwright-root', process.env.FLARE_PLAYWRIGHT_ROOT);
const { chromium } = playwrightRoot ? await import(pathToFileURL(path.join(playwrightRoot, 'index.mjs')).href) : await import('playwright');
await new Promise(resolve => server.listen(Number(value('--port', 8997)), '127.0.0.1', resolve));
let browser;
try {
  const browserArgs = compareToon || toonV1
    ? ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader']
    : ['--use-angle=gl', '--ignore-gpu-blocklist'];
  browser = await chromium.launch({ headless: true, executablePath: value('--browser', process.env.FLARE_CHROMIUM_BINARY), args: browserArgs });
  const page = await browser.newPage({ viewport: { width: 512, height: 512 } }), errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error' && !message.text().includes('404')) errors.push(message.text()); });
  const sceneUrl = 'http://127.0.0.1:' + server.address().port + '/scene/tools/muscle-thumbnails.html';
  await page.goto(sceneUrl + (toonV1 ? '?toon-v1' : compareToon ? '?toon-review' : ''));
  const info = await page.evaluate(async () => { window.photo = await window.musclePhotography; return { ...window.photo.info, groups: window.photo.groups }; });
  if (toonV1) {
    if (requestedGroups) throw new Error('A muscle-toon-v1 render covers both complete 17-group sets.');
    const phasePath = 'app/assets/data/phase-muscles.json';
    const phases = JSON.parse(fs.readFileSync(path.join(root, phasePath), 'utf8'));
    const palette = await page.evaluate(() => window.photo.palette);
    if (phases.groups.length !== 17 || Object.keys(palette).length !== 17 ||
        !phases.groups.every(({ groupId, colour }) => palette[groupId] === colour)) {
      throw new Error('Photography palette does not match the 17 App group colours');
    }
    const maskSources = [relative(source), phasePath, 'app/scene/src/legacy/muscle-map.js',
      'app/scene/src/legacy/flare-muscle-groups.js', 'app/scene/src/muscle-material.js',
      'app/scene/src/mannequin-toon.js', 'app/scene/tools/muscle-thumbnails.js', 'app/scene/tools/muscle-toon-preview.js'];
    const sourceHashes = maskSources.map(file => ({ file, sha256: hash(fs.readFileSync(path.join(root, file))) }));
    const masks = [], updates = [], manifests = [];
    for (const set of ['muscles', 'plan_resume_muscles']) {
      const folder = path.join(root, 'app/assets', set);
      const previous = JSON.parse(fs.readFileSync(path.join(folder, 'manifest.json'), 'utf8'));
      if (previous.images.length !== 17 || !info.groups.every(groupId => previous.images.some(image => image.groupId === groupId))) {
        throw new Error('Published thumbnail camera inventory is incomplete: ' + set);
      }
      const images = [];
      for (const { groupId, camera, crop: existingCrop, width, height } of previous.images) {
        const { webp, mask, crop, ...properties } = await page.evaluate(
          entry => window.photo.captureToon(entry), { groupId, camera, width, height, crop: existingCrop },
        );
        if (JSON.stringify(camera.position) !== JSON.stringify(properties.camera.position) ||
            JSON.stringify(camera.target) !== JSON.stringify(properties.camera.target) ||
            properties.colour !== palette[groupId] || crop.width !== width || crop.height !== height) {
          throw new Error('Thumbnail camera, colour or crop drift: ' + set + '/' + groupId);
        }
        const bytes = Buffer.from(webp, 'base64'), target = path.join(folder, groupId + '.webp');
        images.push({ groupId, file: relative(target), width, height, bytes: bytes.length, sha256: hash(bytes), crop, ...properties });
        masks.push({ set, groupId, camera, crop, ...mask });
        updates.push({ target, bytes });
        console.log('Captured ' + set + '/' + groupId + ': ' + bytes.length + ' bytes');
      }
      manifests.push({ target: path.join(folder, 'manifest.json'), set, data: {
        ...previous,
        revision: 'muscle-toon-v1', createdDate: '2026-11-18',
        renderer: {
          threeRevision: info.threeRevision, renderWidth: info.renderWidth, renderHeight: info.renderHeight,
          material: 'Shared matte cel shading with lighter shadows and screen-space ink',
          background: 'transparent', alpha: true, meshCount: info.meshCount, vertices: info.vertices,
        },
        method: 'Original mannequin, orthographic cameras, functional partition, group colors and deep hatch. Transparent WebP from a 1024px render, preserving each published crop and output dimensions.',
        images, sourceHashes, errors,
      } });
    }
    const samples = [];
    for (const id of ['01-chest', '04-rotator-cuff']) {
      const { png, ...metadata } = await page.evaluate(id => window.photo.compare(id), id);
      const bytes = Buffer.from(png, 'base64'), file = id + '.png';
      samples.push({ file, bytes: bytes.length, sha256: hash(bytes), ...metadata });
      fs.writeFileSync(path.join(output, file), bytes);
    }
    if (errors.length) throw new Error('Photography page errors: ' + errors.join(' | '));
    for (const { target, bytes } of updates) {
      if (preview) {
        const copy = path.join(output, path.basename(path.dirname(target)));
        fs.mkdirSync(copy, { recursive: true });
        fs.writeFileSync(path.join(copy, path.basename(target)), bytes);
      } else {
        fs.writeFileSync(target, bytes);
      }
    }
    for (const { target, set, data } of manifests) {
      if (!preview) fs.writeFileSync(target, JSON.stringify(data, null, 2) + '\n');
      fs.writeFileSync(path.join(output, set + '-manifest.json'), JSON.stringify(data, null, 2) + '\n');
    }
    const totalPixels = [...masks, ...samples.map(({ mask }) => mask)].reduce((sum, mask) => sum + mask.pixels, 0);
    const report = { revision: 'muscle-toon-v1', totalPixels, palette, masks, samples, sourceHashes,
      method: 'Matching uninked scene passes at 1024². Diagnostic RGBA channels are raw panel IDs, selected coverage, deep-hatch coverage and source silhouette, before cosmetic ink or WebP encoding.',
    };
    fs.writeFileSync(path.join(output, 'thumbnail-mask-report.json'), JSON.stringify(report, null, 2) + '\n');
    await page.evaluate(() => window.photo.dispose());
    console.log('Verified ' + masks.length + ' thumbnail cameras and ' + samples.length + ' comparisons, ' + totalPixels + ' pixels with zero mask differences');
  } else if (compareToon) {
    const phasePath = 'app/assets/data/phase-muscles.json';
    const phases = JSON.parse(fs.readFileSync(path.join(root, phasePath), 'utf8'));
    const palette = await page.evaluate(() => window.photo.palette);
    if (phases.groups.length !== 17 || Object.keys(palette).length !== 17 ||
        !phases.groups.every(({ groupId, colour }) => palette[groupId] === colour)) {
      throw new Error('Photography palette does not match the 17 App group colours');
    }
    const samples = [];
    for (const id of await page.evaluate(() => window.photo.reviews)) {
      const { png, ...metadata } = await page.evaluate(id => window.photo.compare(id), id);
      if (errors.length) throw new Error('Photography page errors: ' + errors.join(' | '));
      const bytes = Buffer.from(png, 'base64');
      const file = id + '.png';
      fs.writeFileSync(path.join(output, file), bytes);
      samples.push({ file, bytes: bytes.length, sha256: hash(bytes), ...metadata });
      console.log('Captured ' + file + ', ' + bytes.length + ' bytes');
    }
    const masks = [];
    for (const groupId of info.groups) {
      const audit = await page.evaluate(groupId => window.photo.audit(groupId), groupId);
      if (!audit.groups[groupId]) throw new Error('No coverage for ' + groupId);
      masks.push(audit);
    }
    if (!masks.find(mask => mask.groupId === 'rotator-cuff').hatchPixels ||
        !masks.find(mask => mask.groupId === 'hip-flexors').hatchPixels) {
      throw new Error('A deep region is missing its hatch');
    }
    if (errors.length) throw new Error('Photography page errors: ' + errors.join(' | '));
    const maskSources = [relative(source), phasePath, 'app/scene/src/legacy/muscle-map.js',
      'app/scene/src/legacy/flare-muscle-groups.js', 'app/scene/src/muscle-material.js', 'app/scene/src/v5/toon-r6.js'];
    const report = {
      renderer: info, palette, samples, masks,
      sourceHashes: Object.fromEntries(maskSources.map(file => [file, hash(fs.readFileSync(path.join(root, file)))])),
      method: 'Shared mesh, orthographic camera, upstream mask evaluation, selection coverage and deep hatch. RGB/A diagnostic channels are raw panel ID, selection coverage, deep hatch coverage, and silhouette respectively. No MSAA, both modes read at matching resolutions.',
    };
    fs.writeFileSync(path.join(output, 'mask-report.json'), JSON.stringify(report, null, 2) + '\n');
    await page.evaluate(() => window.photo.dispose());
    console.log('Verified ' + masks.length + ' groups and ' + samples.length + ' pairs with zero mask differences');
  } else {
  const images = [];
  const capturedGroups = requestedGroups ?? info.groups;
  for (const groupId of capturedGroups) {
    const { webp, png, ...metadata } = await page.evaluate(groupId => window.photo.capture(groupId), groupId);
    const bytes = Buffer.from(webp, 'base64'), image = path.join(preview ? output : assets, groupId + '.webp');
    fs.writeFileSync(image, bytes); fs.writeFileSync(path.join(output, groupId + '-1024.png'), Buffer.from(png, 'base64'));
    images.push({ groupId, file: relative(image), width: 512, height: 512, bytes: bytes.length, sha256: hash(bytes), ...metadata });
    console.log('Captured ' + groupId + ': ' + bytes.length + ' bytes');
  }
  fs.writeFileSync(path.join(output, 'muscle-contact-sheet.png'), Buffer.from(await page.evaluate(preview => window.photo.contactSheet(preview ? { cell: 384, columns: 3 } : undefined), preview), 'base64'));
  if (errors.length) throw new Error('Photography page errors: ' + errors.join(' | '));
  const manifest = { revision: 'muscle-photography-v3-titanium', createdDate: '2026-10-11', source: relative(source), sourceSha256: hash(compressed), decodedGlbSha256: hash(decoded), groups: capturedGroups, renderer: info, images, license: 'CC0-1.0', attribution: 'Human Base Meshes v1.4.1, Blender Studio and community contributors; GEO-body_male_realistic, existing project mannequin derivative.', method: 'Offline Three.js photography of the existing mature mesh with unchanged shader region definitions, one group at a time; transparent 1024px render downsampled to 512px WebP. Photography alone adds physical studio reflections and fine roughness brushing to the titanium body; source-colour regions have a less metallic enamel finish.', limits: 'Colours show functional teaching locations. Deep structures use the existing hatched proxy. These are not independent internal muscle geometry, EMG, or exact anatomy/Snow registration.', sourceHashes: ['app/scene/src/legacy/muscle-map.js', 'app/scene/src/legacy/flare-muscle-groups.js', 'app/scene/src/muscle-material.js', 'app/scene/tools/muscle-thumbnails.js'].map(file => ({ file, sha256: hash(fs.readFileSync(path.join(root, file))) })), errors };
  if (!preview) fs.writeFileSync(path.join(assets, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  fs.writeFileSync(path.join(output, 'render-report.json'), JSON.stringify(manifest, null, 2) + '\n');
  await page.evaluate(() => window.photo.dispose());
  console.log(capturedGroups.length + (preview ? ' preview photographs' : ' thumbnails') + ' and contact sheet ready: ' + output);
  }
} finally {
  await browser?.close(); await new Promise(resolve => server.close(resolve));
}
