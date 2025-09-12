import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display hero section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /AI-Powered Hiring/i })).toBeVisible()
    await expect(page.getByText(/Transparent, explainable, and bias-free/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /get started/i })).toBeVisible()
  })

  test('should display navigation', async ({ page }) => {
    await expect(page.getByRole('link', { name: /features/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /how it works/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /pricing/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible()
  })

  test('should display features section', async ({ page }) => {
    await page.getByRole('link', { name: /features/i }).click()
    
    await expect(page.getByText(/AI-Powered Matching/i)).toBeVisible()
    await expect(page.getByText(/Explainable Results/i)).toBeVisible()
    await expect(page.getByText(/Bias Monitoring/i)).toBeVisible()
    await expect(page.getByText(/Audit Trails/i)).toBeVisible()
  })

  test('should display how it works section', async ({ page }) => {
    await page.getByRole('link', { name: /how it works/i }).click()
    
    await expect(page.getByText(/How It Works/i)).toBeVisible()
    await expect(page.getByText(/Step 1/i)).toBeVisible()
    await expect(page.getByText(/Step 2/i)).toBeVisible()
    await expect(page.getByText(/Step 3/i)).toBeVisible()
  })

  test('should display pricing section', async ({ page }) => {
    await page.getByRole('link', { name: /pricing/i }).click()
    
    await expect(page.getByText(/Pricing/i)).toBeVisible()
    await expect(page.getByText(/Free/i)).toBeVisible()
    await expect(page.getByText(/Pro/i)).toBeVisible()
    await expect(page.getByText(/Team/i)).toBeVisible()
  })

  test('should show pricing tiers with features', async ({ page }) => {
    await page.getByRole('link', { name: /pricing/i }).click()
    
    // Check Free tier
    await expect(page.getByText(/Up to 10 applications per month/i)).toBeVisible()
    await expect(page.getByText(/Basic job matching/i)).toBeVisible()
    
    // Check Pro tier
    await expect(page.getByText(/Unlimited applications/i)).toBeVisible()
    await expect(page.getByText(/Advanced AI matching/i)).toBeVisible()
    
    // Check Team tier
    await expect(page.getByText(/Up to 5 team members/i)).toBeVisible()
    await expect(page.getByText(/Candidate slate generation/i)).toBeVisible()
  })

  test('should have working CTA buttons', async ({ page }) => {
    // Hero CTA
    await page.getByRole('link', { name: /get started/i }).click()
    await expect(page).toHaveURL('/auth/signup')
    
    await page.goBack()
    
    // Pricing CTA
    await page.getByRole('link', { name: /pricing/i }).click()
    await page.getByRole('button', { name: /get started/i }).first().click()
    await expect(page).toHaveURL('/auth/signup')
  })

  test('should display footer', async ({ page }) => {
    await expect(page.getByText(/ProofOfFit/i)).toBeVisible()
    await expect(page.getByText(/© 2024 ProofOfFit/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /privacy policy/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /terms of service/i })).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Should still show main content
    await expect(page.getByRole('heading', { name: /AI-Powered Hiring/i })).toBeVisible()
    
    // Navigation should be accessible
    await expect(page.getByRole('link', { name: /features/i })).toBeVisible()
  })

  test('should have proper meta tags', async ({ page }) => {
    await expect(page).toHaveTitle(/ProofOfFit/)
    
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /AI-powered hiring platform/)
  })

  test('should load without errors', async ({ page }) => {
    // Check for console errors
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Should have no console errors
    expect(errors).toHaveLength(0)
  })
})