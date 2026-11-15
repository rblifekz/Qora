import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'path';
const times = process.argv.slice(2).map(Number);
const out = 'out/stills';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.tsx')});
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browser = await openBrowser('chrome', {browserExecutable, chromiumOptions: {}});
const composition = await selectComposition({serveUrl, id: process.env.COMP || 'Dengi', puppeteerInstance: browser, browserExecutable});
for (const t of times) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(t * 30));
  await renderStill({composition, serveUrl, frame, output: `${out}/f${String(frame).padStart(4, '0')}.png`, puppeteerInstance: browser, browserExecutable, scale: 0.5});
  console.log('ok', t);
}
await browser.close({silent: true});
