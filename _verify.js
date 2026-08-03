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
  
  // Capture ALL console output
  page.on('console', msg => {
    console.log('PAGE:', msg.text().substring(0, 200));
  });
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  
  await page.click('canvas');
  await new Promise(r => setTimeout(r, 300));
  
  // Test: move right, then attack
  console.log('\\n=== Pressing D (move right) ===');
  await page.keyboard.down('d');
  await new Promise(r => setTimeout(r, 800));
  await page.keyboard.up('d');
  await new Promise(r => setTimeout(r, 200));
  
  console.log('\\n=== Pressing J (attack) ===');
  await page.keyboard.down('j');
  await new Promise(r => setTimeout(r, 500));
  await page.keyboard.up('j');
  await new Promise(r => setTimeout(r, 500));
  
  console.log('\\n=== Done ===');
  await browser.close();
})().catch(console.error);
