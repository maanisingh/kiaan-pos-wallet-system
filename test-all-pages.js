const { chromium } = require('playwright');

async function testAllPages() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = {
    passed: [],
    failed: [],
    errors: []
  };

  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console Error:', msg.text());
      results.errors.push({
        type: 'console',
        message: msg.text()
      });
    }
  });

  // Listen for page errors
  page.on('pageerror', error => {
    console.log('❌ Page Error:', error.message);
    results.errors.push({
      type: 'page',
      message: error.message,
      stack: error.stack
    });
  });

  const baseUrl = 'https://pos-production-bae1.up.railway.app';

  const pages = [
    { name: 'Landing Page', url: '/' },
    { name: 'Dashboard', url: '/dashboard' },
    { name: 'Customers', url: '/dashboard/customers' },
    { name: 'Cards', url: '/dashboard/cards' },
    { name: 'Transactions', url: '/dashboard/transactions' },
    { name: 'Merchants', url: '/dashboard/merchants' },
    { name: 'Terminals', url: '/dashboard/terminals' },
    { name: 'Reports', url: '/dashboard/reports' },
    { name: 'Analytics', url: '/dashboard/analytics' },
  ];

  console.log('\n🧪 Testing all pages...\n');

  for (const pageInfo of pages) {
    const fullUrl = `${baseUrl}${pageInfo.url}`;
    console.log(`\n📄 Testing: ${pageInfo.name} (${pageInfo.url})`);

    const pageErrors = [];
    const startTime = Date.now();

    try {
      // Navigate to page
      const response = await page.goto(fullUrl, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      const loadTime = Date.now() - startTime;

      // Check response status
      if (!response.ok()) {
        const error = `HTTP ${response.status()}: ${response.statusText()}`;
        console.log(`   ❌ ${error}`);
        pageErrors.push(error);
      }

      // Wait a bit for any dynamic content
      await page.waitForTimeout(2000);

      // Check for React errors
      const hasReactError = await page.evaluate(() => {
        const body = document.body.innerText;
        return body.includes('Error') ||
               body.includes('Failed to compile') ||
               body.includes('Unexpected') ||
               body.includes('undefined is not');
      });

      if (hasReactError) {
        const errorText = await page.evaluate(() => {
          return document.body.innerText.substring(0, 500);
        });
        console.log(`   ❌ React Error detected`);
        pageErrors.push(`React Error: ${errorText}`);
      }

      // Take screenshot
      await page.screenshot({
        path: `/root/test_${pageInfo.name.replace(/\s+/g, '_').toLowerCase()}.png`,
        fullPage: true
      });

      // Check if page has expected content
      const hasContent = await page.evaluate(() => {
        return document.body.innerText.length > 100;
      });

      if (!hasContent) {
        console.log(`   ⚠️  Page seems empty`);
        pageErrors.push('Page has very little content');
      }

      if (pageErrors.length === 0 && response.ok()) {
        console.log(`   ✅ Loaded successfully (${loadTime}ms)`);
        results.passed.push({
          name: pageInfo.name,
          url: pageInfo.url,
          loadTime
        });
      } else {
        results.failed.push({
          name: pageInfo.name,
          url: pageInfo.url,
          errors: pageErrors
        });
      }

    } catch (error) {
      console.log(`   ❌ Failed to load: ${error.message}`);
      results.failed.push({
        name: pageInfo.name,
        url: pageInfo.url,
        errors: [error.message]
      });
    }
  }

  await browser.close();

  // Print summary
  console.log('\n\n📊 Test Summary\n');
  console.log('═'.repeat(60));
  console.log(`✅ Passed: ${results.passed.length}/${pages.length}`);
  console.log(`❌ Failed: ${results.failed.length}/${pages.length}`);
  console.log(`🐛 Total Errors: ${results.errors.length}`);
  console.log('═'.repeat(60));

  if (results.passed.length > 0) {
    console.log('\n✅ Passed Pages:');
    results.passed.forEach(p => {
      console.log(`   - ${p.name} (${p.loadTime}ms)`);
    });
  }

  if (results.failed.length > 0) {
    console.log('\n❌ Failed Pages:');
    results.failed.forEach(p => {
      console.log(`\n   ${p.name} (${p.url})`);
      p.errors.forEach(err => {
        console.log(`      - ${err}`);
      });
    });
  }

  if (results.errors.length > 0) {
    console.log('\n🐛 JavaScript Errors:');
    results.errors.forEach((err, i) => {
      console.log(`\n   Error ${i + 1} (${err.type}):`);
      console.log(`   ${err.message}`);
      if (err.stack) {
        console.log(`   Stack: ${err.stack.substring(0, 200)}...`);
      }
    });
  }

  // Save results to file
  const fs = require('fs');
  fs.writeFileSync(
    '/root/test-results.json',
    JSON.stringify(results, null, 2)
  );
  console.log('\n📁 Full results saved to: /root/test-results.json');

  return results;
}

testAllPages().then(results => {
  const exitCode = results.failed.length > 0 ? 1 : 0;
  process.exit(exitCode);
}).catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});
