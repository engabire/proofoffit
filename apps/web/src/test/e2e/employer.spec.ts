import { test, expect } from '@playwright/test'

test.describe('Employer Features', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.goto('/employer/intake')
    
    // Mock the auth state
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-token',
        user: {
          id: 'user-1',
          email: 'employer@example.com',
        }
      }))
    })
  })

  test('should display job intake page', async ({ page }) => {
    await page.goto('/employer/intake')
    
    await expect(page.getByRole('heading', { name: /create job intake/i })).toBeVisible()
    await expect(page.getByText(/define your hiring requirements/i)).toBeVisible()
  })

  test('should show job details form', async ({ page }) => {
    await page.goto('/employer/intake')
    
    await expect(page.getByText(/job details/i)).toBeVisible()
    await expect(page.getByLabel(/job title/i)).toBeVisible()
    await expect(page.getByLabel(/company/i)).toBeVisible()
    await expect(page.getByLabel(/location/i)).toBeVisible()
    await expect(page.getByLabel(/work type/i)).toBeVisible()
  })

  test('should show requirements section', async ({ page }) => {
    await page.goto('/employer/intake')
    
    await expect(page.getByText(/requirements/i)).toBeVisible()
    await expect(page.getByText(/must have requirements/i)).toBeVisible()
    await expect(page.getByText(/preferred requirements/i)).toBeVisible()
  })

  test('should show constraints section', async ({ page }) => {
    await page.goto('/employer/intake')
    
    await expect(page.getByText(/constraints/i)).toBeVisible()
    await expect(page.getByLabel(/work authorization/i)).toBeVisible()
    await expect(page.getByLabel(/security clearance/i)).toBeVisible()
  })

  test('should allow adding must-have requirements', async ({ page }) => {
    await page.goto('/employer/intake')
    
    const input = page.getByPlaceholder(/e.g., 5\+ years react experience/i)
    const addButton = page.getByRole('button', { name: /add/i }).first()
    
    await input.fill('5+ years React experience')
    await addButton.click()
    
    // Should show the added requirement
    await expect(page.getByText('5+ years React experience')).toBeVisible()
  })

  test('should allow adding preferred requirements', async ({ page }) => {
    await page.goto('/employer/intake')
    
    const input = page.getByPlaceholder(/e.g., healthcare domain experience/i)
    const addButton = page.getByRole('button', { name: /add/i }).nth(1)
    
    await input.fill('Healthcare domain experience')
    await addButton.click()
    
    // Should show the added requirement
    await expect(page.getByText('Healthcare domain experience')).toBeVisible()
  })

  test('should fill and submit job intake form', async ({ page }) => {
    await page.goto('/employer/intake')
    
    // Fill job details
    await page.getByLabel(/job title/i).fill('Senior Frontend Developer')
    await page.getByLabel(/company/i).fill('TechCorp Inc.')
    await page.getByLabel(/location/i).fill('San Francisco, CA')
    await page.getByLabel(/work type/i).selectOption('hybrid')
    
    // Fill description
    await page.getByLabel(/job description/i).fill('We are looking for a senior frontend developer with 5+ years of React experience and strong TypeScript skills.')
    
    // Add requirements
    const mustHaveInput = page.getByPlaceholder(/e.g., 5\+ years react experience/i)
    await mustHaveInput.fill('5+ years React experience')
    await page.getByRole('button', { name: /add/i }).first().click()
    
    // Submit form
    await page.getByRole('button', { name: /create job intake/i }).click()
    
    // Should show loading state
    await expect(page.getByText(/creating/i)).toBeVisible()
  })

  test('should navigate to slates page', async ({ page }) => {
    await page.goto('/employer/intake')
    
    await page.getByRole('link', { name: /candidate slates/i }).click()
    await expect(page).toHaveURL('/employer/slates')
    await expect(page.getByRole('heading', { name: /candidate slates/i })).toBeVisible()
  })

  test('should display slates page', async ({ page }) => {
    await page.goto('/employer/slates')
    
    await expect(page.getByRole('heading', { name: /candidate slates/i })).toBeVisible()
    await expect(page.getByText(/ai-generated candidate recommendations/i)).toBeVisible()
  })

  test('should show slate cards', async ({ page }) => {
    await page.goto('/employer/slates')
    
    // Should show slate cards with candidate information
    await expect(page.getByText(/top candidates/i)).toBeVisible()
    await expect(page.getByText(/\d+%/)).toBeVisible() // Fit scores
    await expect(page.getByText(/why this match/i)).toBeVisible()
  })

  test('should show slate actions', async ({ page }) => {
    await page.goto('/employer/slates')
    
    await expect(page.getByRole('button', { name: /view full slate/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /download report/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /audit trail/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /schedule interviews/i })).toBeVisible()
  })

  test('should have working navigation', async ({ page }) => {
    await page.goto('/employer/intake')
    
    // Test sidebar navigation
    await page.getByRole('link', { name: /job intake/i }).click()
    await expect(page).toHaveURL('/employer/intake')
    
    await page.getByRole('link', { name: /candidate slates/i }).click()
    await expect(page).toHaveURL('/employer/slates')
    
    await page.getByRole('link', { name: /analytics/i }).click()
    await expect(page).toHaveURL('/employer/analytics')
  })

  test('should show sign out button', async ({ page }) => {
    await page.goto('/employer/intake')
    
    await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible()
  })
})