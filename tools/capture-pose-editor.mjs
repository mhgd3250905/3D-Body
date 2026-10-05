import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const require=createRequire(import.meta.url);
const {chromium}=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
const output=fileURLToPath(new URL('../output/playwright/pose-editor-ready.png',import.meta.url));
await fs.mkdir(path.dirname(output),{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
try {
  const page=await browser.newPage({viewport:{width:1440,height:1050},deviceScaleFactor:1});
  await page.goto(process.argv[2]||'http://127.0.0.1:8810/');
  await page.waitForFunction(()=>document.documentElement.dataset.ready==='true');
  await page.locator('[data-preset="flare-right-high-v"]').click();
  await page.locator('#pose-handle-select').selectOption('leftAnkle');
  await page.locator('#pose-fit').click();
  await page.screenshot({path:output,fullPage:true});
  await page.locator('#pose-technique > summary').click();
  await page.screenshot({path:path.join(path.dirname(output),'pose-editor-technique.png'),fullPage:true});
  await page.locator('#canvas-focus').click();
  await page.waitForTimeout(100);
  await page.screenshot({path:path.join(path.dirname(output),'pose-editor-full-canvas.png'),fullPage:true});
  console.log(output);
} finally { await browser.close(); }
