// Renders the #showcase walkthrough to a 1080×1080, 30 fps MP4.
// Time is fully controlled: Playwright's fake clock drives timers, requestAnimationFrame and performance.now,
// and every CSS animation/transition is paused and seeked to the frame time before each screenshot.
// So the output is frame-exact no matter how fast the machine is.
//   npm i playwright && node video/render.js [path/to/chrome] [frames-dir] [out.mp4]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');

const FPS = 30, SIZE = 1080, SCALE = 2, MAX_SECONDS = 40;
const root = path.resolve(__dirname, '..');
const framesDir = process.argv[3] || path.join(__dirname, 'frames');
const out = process.argv[4] || path.join(__dirname, 'spf-watch-showcase.mp4');

(async () => {
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.argv[2], args: ['--headless=new'] });
  const ctx = await browser.newContext({ viewport: { width: SIZE, height: SIZE }, deviceScaleFactor: SCALE });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.error('page error:', e.message));

  // Pause the fake clock before the page loads, so nothing depends on how fast this machine is
  await page.clock.install({ time: new Date('2026-07-01T10:00:00Z') });
  await page.clock.pauseAt(new Date('2026-07-01T10:00:01Z'));
  await page.goto('file://' + path.join(root, 'index.html') + '#showcase-rec');
  await page.evaluate(() => document.fonts.ready);
  await page.clock.runFor(1000);   // let the page settle on the fake clock

  await page.evaluate(() => { window.startShowcase(); });
  for (let f = 0; f < FPS * MAX_SECONDS; f++) {
    await page.clock.runFor(1000 / FPS);
    const done = await page.evaluate(step => {
      // Seek every CSS animation/transition to "now" on the fake clock
      const now = performance.now();
      for (const a of document.getAnimations()) {
        if (a.__start === undefined) a.__start = now - step;
        a.pause();
        a.currentTime = Math.max(0, now - a.__start);
      }
      return window.showcaseDone === true;
    }, 1000 / FPS);
    await page.screenshot({ path: path.join(framesDir, `f${String(f).padStart(4, '0')}.png`) });
    if (f % 60 === 0) console.log(`frame ${f}`);
    if (done) { console.log(`${f + 1} frames`); break; }
  }
  await browser.close();

  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(framesDir, 'f%04d.png'),
    '-vf', `scale=${SIZE}:${SIZE}:flags=lanczos,format=yuv420p`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '16',
    '-movflags', '+faststart', out], { stdio: 'inherit' });
  fs.rmSync(framesDir, { recursive: true, force: true });
  console.log('wrote', out);
})();
