import { test } from '@playwright/test';

test('Debug admin page', async ({ page }) => {
  // Collect console messages
  const messages: string[] = [];
  page.on('console', msg => {
    messages.push(`[${msg.type()}] ${msg.text()}`);
  });

  // Collect errors
  page.on('pageerror', error => {
    console.log('❌ PAGE ERROR:', error.message);
  });

  // Collect failed requests
  page.on('requestfailed', request => {
    console.log('❌ FAILED REQUEST:', request.url(), request.failure()?.errorText);
  });

  console.log('🔍 Loading admin page...');
  await page.goto('https://kiaan.alexandratechlab.com/admin/', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  await page.waitForTimeout(5000);

  // Check root content
  const rootHTML = await page.$eval('#root', el => el.innerHTML).catch(() => '');
  console.log('📄 Root content length:', rootHTML.length);
  console.log('📄 Root HTML preview:', rootHTML.substring(0, 200));

  // Print all console messages
  console.log('\n📝 Console messages:');
  messages.forEach(msg => console.log(msg));

  // Take screenshot
  await page.screenshot({ path: '/root/admin-debug.png', fullPage: true });
  console.log('📸 Screenshot saved to /root/admin-debug.png');
});
