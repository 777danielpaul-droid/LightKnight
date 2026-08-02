const { launch } = require('puppeteer');

(async () => {
  const browser = await launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1280,720',
      '--autoplay-policy=no-user-gesture-required', '--mute-audio']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  page.on('console', msg => {
    const text = msg.text();
    if (!text.includes('[vite]') && !text.includes('%c') && !text.includes('buffer')) {
      console.log('  ', text.substring(0, 120));
    }
  });
  page.on('pageerror', err => console.log('  ERROR:', err.message));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3000));
  
  // Test: Keyboard-Event direkt auf document + logge alle Events
  console.log('=== Registriere globalen keydown Listener ===');
  await page.evaluate(() => {
    window.__debug_keys = [];
    document.addEventListener('keydown', (e) => {
      window.__debug_keys.push({ code: e.code, key: e.key, target: e.target.tagName });
      console.log('DOC keydown:', e.code, e.key);
    }, true); // capture phase
    
    window.addEventListener('keydown', (e) => {
      console.log('WIN keydown:', e.code, e.key);
    }, true);
  });
  
  console.log('=== Sende Shift via window ===');
  await page.keyboard.down('Shift');
  await new Promise(r => setTimeout(r, 300));
  await page.keyboard.up('Shift');
  
  console.log('=== Sende J via window ===');
  await page.keyboard.down('j');
  await new Promise(r => setTimeout(r, 300));
  await page.keyboard.up('j');
  
  await new Promise(r => setTimeout(r, 300));
  
  // Lese alle gefangenen Events
  const keys = await page.evaluate(() => window.__debug_keys);
  console.log('Captured Events:', JSON.stringify(keys));
  
  console.log('=== Abgeschlossen ===');
  await browser.close();
})().catch(console.error);
