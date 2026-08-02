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
  
  // Capture console
  const logs = [];
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[Player]') || text.includes('[GameScene]')) {
      logs.push(text);
      console.log('  ', text);
    }
  });
  page.on('pageerror', err => console.log('  ERROR:', err.message));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  // Warte auf Initialisierung
  await new Promise(r => setTimeout(r, 800));
  console.log('=== Initialisierung komplett ===');
  
  // Fokusiere Canvas
  await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.focus();
      canvas.setAttribute('tabindex', '0');
    }
  });
  
  console.log('=== Taste A drücken (bewegen) ===');
  await page.keyboard.down('a');
  await new Promise(r => setTimeout(r, 400));
  await page.keyboard.up('a');
  
  console.log('=== Space drücken (springen) ===');
  await page.keyboard.down('Space');
  await new Promise(r => setTimeout(r, 200));
  await page.keyboard.up('Space');
  
  console.log('=== J drücken (angriff) ===');
  await page.keyboard.down('j');
  await new Promise(r => setTimeout(r, 500));
  await page.keyboard.up('j');
  
  console.log('=== Shift drücken (dash) ===');
  await page.keyboard.down('Shift');
  await new Promise(r => setTimeout(r, 300));
  await page.keyboard.up('Shift');
  
  await new Promise(r => setTimeout(r, 500));
  console.log('=== Tests abgeschlossen ===');
  console.log('Gefangene Logs:', logs.length);
  
  await page.screenshot({ path: '/Users/danielpaul/Desktop/LightKnight/screenshot_test.png' });
  console.log('Screenshot gespeichert!');
  
  await browser.close();
})().catch(console.error);
