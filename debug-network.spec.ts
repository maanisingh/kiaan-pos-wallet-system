import { test } from '@playwright/test';

test('Debug network requests', async ({ page }) => {
  const failedRequests: any[] = [];
  const allRequests: any[] = [];

  page.on('request', request => {
    if (request.url().includes('api')) {
      allRequests.push({
        url: request.url(),
        method: request.method()
      });
    }
  });

  page.on('response', response => {
    if (response.url().includes('api')) {
      console.log(`📡 API Response: ${response.status()} ${response.url()}`);
    }
  });

  page.on('requestfailed', request => {
    if (request.url().includes('api')) {
      failedRequests.push({
        url: request.url(),
        error: request.failure()?.errorText
      });
    }
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console Error:', msg.text());
    }
  });

  await page.goto('https://kiaan.alexandratechlab.com/admin/', {
    waitUntil: 'networkidle'
  });

  await page.waitForTimeout(5000);

  console.log('\n📊 All API Requests:', allRequests.length);
  allRequests.forEach(req => console.log(`  ${req.method} ${req.url}`));

  console.log('\n❌ Failed API Requests:', failedRequests.length);
  failedRequests.forEach(req => console.log(`  ${req.url}: ${req.error}`));

  // Check if we can manually call the API
  const apiResponse = await page.evaluate(async () => {
    try {
      const res = await fetch('https://kiaan.alexandratechlab.com/api/health');
      const data = await res.json();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  console.log('\n🧪 Manual API Test:', JSON.stringify(apiResponse, null, 2));
});
