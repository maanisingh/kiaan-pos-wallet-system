const { chromium } = require('playwright');

async function detailedCheck() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log('\n🔍 Detailed Page Structure Check\n');

    // Go to Customers page directly
    console.log('Testing /dashboard/customers:');
    await page.goto('https://pos-production-bae1.up.railway.app/dashboard/customers', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    await page.waitForTimeout(3000);

    // Get all h1 elements
    const allH1s = await page.$$eval('h1', elements =>
      elements.map(el => ({
        text: el.textContent,
        className: el.className
      }))
    );
    console.log('  All h1 elements found:', JSON.stringify(allH1s, null, 2));

    // Check for "Customer Management" text anywhere on page
    const hasCustomerText = await page.evaluate(() => {
      return document.body.innerText.includes('Customer Management');
    });
    console.log('  Contains "Customer Management":', hasCustomerText);

    // Check for customer cards/data
    const hasCustomerCards = await page.$$('text=John Mugisha');
    console.log('  Found sample customer "John Mugisha":', hasCustomerCards.length > 0);

    // Take screenshot of customers page
    await page.screenshot({
      path: '/root/customers-page.png',
      fullPage: true
    });
    console.log('  📸 Screenshot: /root/customers-page.png');

    // Now check Cards page
    console.log('\nTesting /dashboard/cards:');
    await page.goto('https://pos-production-bae1.up.railway.app/dashboard/cards', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    await page.waitForTimeout(3000);

    const hasCardText = await page.evaluate(() => {
      return document.body.innerText.includes('Card Management');
    });
    console.log('  Contains "Card Management":', hasCardText);

    // Check for card data
    const hasCardData = await page.$$('text=CARD-001-KMP');
    console.log('  Found sample card "CARD-001-KMP":', hasCardData.length > 0);

    await page.screenshot({
      path: '/root/cards-page.png',
      fullPage: true
    });
    console.log('  📸 Screenshot: /root/cards-page.png');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

detailedCheck();
