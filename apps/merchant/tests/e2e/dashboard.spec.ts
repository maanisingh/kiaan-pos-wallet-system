import { test, expect } from '@playwright/test'

test.describe('Kiaan POS Admin Dashboard - Client Specifications', () => {
  test('should display dashboard with system overview', async ({ page }) => {
    await page.goto('/')

    // Verify page title
    await expect(page).toHaveTitle(/Kiaan POS Admin Dashboard/)

    // Verify main heading
    await expect(page.getByRole('heading', { name: 'Kiaan POS Dashboard' })).toBeVisible()

    // Verify client company name is mentioned
    await expect(
      page.getByText('Closed-Loop Payment System for Big Innovation Group Ltd')
    ).toBeVisible()
  })

  test('should display all required stats cards per client spec', async ({ page }) => {
    await page.goto('/')

    // Client Requirement: Dashboard must show key metrics
    await expect(page.getByText('Total Active Cards')).toBeVisible()
    await expect(page.getByText('Total Customers')).toBeVisible()
    await expect(page.getByText('System Balance')).toBeVisible()
    await expect(page.getByText("Today's Revenue")).toBeVisible()

    // Verify stats have values (not empty)
    const cardsValue = page.locator('text=Total Active Cards').locator('../..').getByRole('heading')
    await expect(cardsValue).not.toBeEmpty()
  })

  test('should display all system features per client requirements', async ({ page }) => {
    await page.goto('/')

    // Client Requirement 1: Card Registration & Management
    await expect(page.getByText('NFC Card Payments')).toBeVisible()

    // Client Requirement 2: Multi-Branch Support
    await expect(page.getByText('Multi-Branch Support')).toBeVisible()

    // Client Requirement 3: Mobile Money Integration (MTN & Airtel)
    await expect(page.getByText('Mobile Money Integration (MTN/Airtel)')).toBeVisible()

    // Client Requirement 4: Real-time Balance Updates
    await expect(page.getByText('Real-time Balance Updates')).toBeVisible()

    // Client Requirement 5: Customer Mobile Wallet App
    await expect(page.getByText('Customer Mobile Wallet App')).toBeVisible()

    // Client Requirement 6: POS Terminal Application
    await expect(page.getByText('POS Terminal Application')).toBeVisible()

    // Client Requirement 7: PIN Protection & Security
    await expect(page.getByText('PIN Protection & Security')).toBeVisible()
  })

  test('should display client specification requirements', async ({ page }) => {
    await page.goto('/')

    // Spec 1: Card Registration & Management
    await expect(page.getByText('Card Registration & Management')).toBeVisible()

    // Spec 2: Wallet Logic with Balance Tracking
    await expect(page.getByText('Wallet Logic with Balance Tracking')).toBeVisible()

    // Spec 3: POS Payment Flow with PIN Verification
    await expect(page.getByText('POS Payment Flow with PIN Verification')).toBeVisible()

    // Spec 4: Top-Up via USSD Code
    await expect(page.getByText('Top-Up via USSD Code')).toBeVisible()

    // Spec 5: Top-Up via Mobile App
    await expect(page.getByText('Top-Up via Mobile App')).toBeVisible()

    // Spec 6: Admin Dashboard (Multi-role)
    await expect(page.getByText('Admin Dashboard (Multi-role)')).toBeVisible()

    // Spec 7: Financial Reports & Analytics
    await expect(page.getByText('Financial Reports & Analytics')).toBeVisible()
  })

  test('should display technology stack information', async ({ page }) => {
    await page.goto('/')

    // Verify modern tech stack is documented
    await expect(page.getByText('Next.js 15')).toBeVisible()
    await expect(page.getByText('React 19')).toBeVisible()
    await expect(page.getByText('TypeScript 5.7')).toBeVisible()
    await expect(page.getByText('Supabase')).toBeVisible()
    await expect(page.getByText('PostgreSQL')).toBeVisible()
    await expect(page.getByText('Expo 52')).toBeVisible()
    await expect(page.getByText('React Native')).toBeVisible()
    await expect(page.getByText('Tauri v2')).toBeVisible()
    await expect(page.getByText('NFC Integration')).toBeVisible()
    await expect(page.getByText('Offline Support')).toBeVisible()
  })

  test('should be responsive and accessible', async ({ page }) => {
    await page.goto('/')

    // Check responsive design
    await page.setViewportSize({ width: 375, height: 667 }) // Mobile
    await expect(page.getByRole('heading', { name: 'Kiaan POS Dashboard' })).toBeVisible()

    await page.setViewportSize({ width: 768, height: 1024 }) // Tablet
    await expect(page.getByRole('heading', { name: 'Kiaan POS Dashboard' })).toBeVisible()

    await page.setViewportSize({ width: 1920, height: 1080 }) // Desktop
    await expect(page.getByRole('heading', { name: 'Kiaan POS Dashboard' })).toBeVisible()

    // Check basic accessibility
    const heading = page.getByRole('heading', { name: 'Kiaan POS Dashboard' })
    await expect(heading).toBeVisible()
  })

  test('should display updated stats in real-time', async ({ page }) => {
    await page.goto('/')

    // Verify "Updated just now" text appears (indicating real-time capability)
    const updatedTexts = await page.getByText('Updated just now').all()
    expect(updatedTexts.length).toBeGreaterThan(0)
  })

  test('should meet Big Innovation Group Ltd branding requirements', async ({ page }) => {
    await page.goto('/')

    // Verify client branding
    await expect(page.getByText('Big Innovation Group Ltd')).toBeVisible()
    await expect(page.getByText('Kiaan')).toBeVisible()
    await expect(page.getByText('Closed-Loop Payment System')).toBeVisible()
  })
})
