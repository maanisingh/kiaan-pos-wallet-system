const { chromium } = require('playwright');

async function quickVerify() {
  console.log('\n🚀 Quick Verification Test\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const baseUrl = 'https://pos-production-bae1.up.railway.app';
  let allPassed = true;

  try {
    // Test 1: Landing page loads
    console.log('✓ Testing landing page...');
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    const landingTitle = await page.textContent('h1');
    console.log(`  Found: "${landingTitle}"`);

    // Test 2: Dashboard loads
    console.log('\n✓ Testing dashboard page...');
    await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
    const dashboardHeading = await page.textContent('h1');
    console.log(`  Found: "${dashboardHeading}"`);

    // Test 3: Click Customers in sidebar
    console.log('\n✓ Testing Customers navigation...');
    await page.click('text=Customers');
    await page.waitForTimeout(2000);
    const customersHeading = await page.textContent('h1');
    console.log(`  Found: "${customersHeading}"`);
    if (!customersHeading.includes('Customer')) {
      console.log('  ⚠️  Warning: Expected "Customer" in heading');
      allPassed = false;
    }

    // Test 4: Click Cards in sidebar
    console.log('\n✓ Testing Cards navigation...');
    await page.click('text=Cards');
    await page.waitForTimeout(2000);
    const cardsHeading = await page.textContent('h1');
    console.log(`  Found: "${cardsHeading}"`);
    if (!cardsHeading.includes('Card')) {
      console.log('  ⚠️  Warning: Expected "Card" in heading');
      allPassed = false;
    }

    // Test 5: Check if sidebar has all navigation items
    console.log('\n✓ Checking sidebar navigation items...');
    const navItems = await page.$$eval('nav a', links => links.map(l => l.textContent));
    console.log(`  Found ${navItems.length} navigation items:`);
    const expectedItems = ['Dashboard', 'Cards', 'Customers', 'Transactions', 'Merchants', 'Terminals', 'Reports', 'Analytics'];
    expectedItems.forEach(item => {
      if (navItems.includes(item)) {
        console.log(`    ✅ ${item}`);
      } else {
        console.log(`    ❌ Missing: ${item}`);
        allPassed = false;
      }
    });

    // Test 6: Check LogOut button exists
    console.log('\n✓ Checking LogOut button...');
    const logoutButton = await page.$('text=Logout');
    if (logoutButton) {
      console.log('  ✅ LogOut button found');
    } else {
      console.log('  ❌ LogOut button not found');
      allPassed = false;
    }

    // Take final screenshot
    await page.screenshot({ path: '/root/final-verification.png', fullPage: true });
    console.log('\n📸 Screenshot saved to: /root/final-verification.png');

  } catch (error) {
    console.error('\n❌ Error during verification:', error.message);
    allPassed = false;
  } finally {
    await browser.close();
  }

  console.log('\n' + '='.repeat(60));
  if (allPassed) {
    console.log('✅ ALL TESTS PASSED - Deployment is ready for client demo!');
  } else {
    console.log('⚠️  Some issues found - review output above');
  }
  console.log('='.repeat(60) + '\n');

  return allPassed;
}

quickVerify().then(passed => {
  process.exit(passed ? 0 : 1);
}).catch(error => {
  console.error('Verification failed:', error);
  process.exit(1);
});
