// Renders the #showcase walkthrough to a 1080×1080, 30 fps MP4.
// Frames are captured on Chromium's virtual clock, so timing is exact regardless of machine speed.
//   npm i playwright && node video/render.js [path/to/chrome]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');

const FPS = 30, SIZE = 1080, SCALE = 2;
const root = path.resolve(__dirname, '..');
const framesDir = path.join(__dirname, 'frames');
const out = path.join(__dirname, 'spf-watch-showcase.mp4');

(async () => {
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.argv[2], args: ['--headless=new'] });
  const ctx = await browser.newContext({ viewport: { width: SIZE, height: SIZE }, deviceScaleFactor: SCALE });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.error('page error:', e.message));
  await page.goto('file://' + path.join(root, 'index.html') + '#showcase-rec');
  await page.waitForTimeout(800);
  await page.evaluate(() => document.fonts.ready);

  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setVirtualTimePolicy', { policy: 'pause' });
  const advance = async ms => {
    const expired = new Promise(r => cdp.once('Emulation.virtualTimeBudgetExpired', r));
    await cdp.send('Emulation.setVirtualTimePolicy', { policy: 'advance', budget: ms });
    await expired;
  };

  await page.evaluate(() => { window.startShowcase(); });
  for (let f = 0; ; f++) {
    await advance(1000 / FPS);
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(framesDir, `f${String(f).padStart(4, '0')}.png`), Buffer.from(data, 'base64'));
    if (await page.evaluate(() => window.showcaseDone === true)) { console.log(`${f + 1} frames`); break; }
  }
  await browser.close();

  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(framesDir, 'f%04d.png'),
    '-vf', `scale=${SIZE}:${SIZE}:flags=lanczos,format=yuv420p`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '16',
    '-movflags', '+faststart', out], { stdio: 'inherit' });
  fs.rmSync(framesDir, { recursive: true, force: true });
  console.log('wrote', out);
})();
