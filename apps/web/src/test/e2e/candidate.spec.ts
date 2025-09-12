import { test, expect } from '@playwright/test'

test.describe('Candidate Features', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.goto('/candidate/profile')
    
    // Mock the auth state
    await page.evaluate(() => {
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-token',
        user: {
          id: 'user-1',
          email: 'candidate@example.com',
        }
      }))
    })
  })

  test('should display candidate profile page', async ({ page }) => {
    await page.goto('/candidate/profile')
    
    await expect(page.getByRole('heading', { name: /my profile/i })).toBeVisible()
    await expect(page.getByText(/manage your professional information/i)).toBeVisible()
  })

  test('should show profile overview section', async ({ page }) => {
    await page.goto('/candidate/profile')
    
    await expect(page.getByText(/profile overview/i)).toBeVisible()
    await expect(page.getByText(/work preferences/i)).toBeVisible()
    await expect(page.getByText(/preferred locations/i)).toBeVisible()
  })

  test('should show evidence bullets section', async ({ page }) => {
    await page.goto('/candidate/profile')
    
    await expect(page.getByText(/evidence bullets/i)).toBeVisible()
    await expect(page.getByText(/your professional achievements/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /add bullet/i })).toBeVisible()
  })

  test('should show credentials section', async ({ page }) => {
    await page.goto('/candidate/profile')
    
    await expect(page.getByText(/credentials/i)).toBeVisible()
    await expect(page.getByText(/your certifications/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /add credential/i })).toBeVisible()
  })

  test('should show contact preferences section', async ({ page }) => {
    await page.goto('/candidate/profile')
    
    await expect(page.getByText(/contact preferences/i)).toBeVisible()
    await expect(page.getByText(/how employers can reach you/i)).toBeVisible()
  })

  test('should navigate to job matches', async ({ page }) => {
    await page.goto('/candidate/profile')
    
    await page.getByRole('link', { name: /job matches/i }).click()
    await expect(page).toHaveURL('/candidate/matches')
    await expect(page.getByRole('heading', { name: /job matches/i })).toBeVisible()
  })

  test('should navigate to applications', async ({ page }) => {
    await page.goto('/candidate/profile')
    
    await page.getByRole('link', { name: /applications/i }).click()
    await expect(page).toHaveURL('/candidate/applications')
    await expect(page.getByRole('heading', { name: /my applications/i })).toBeVisible()
  })

  test('should display job matches page', async ({ page }) => {
    await page.goto('/candidate/matches')
    
    await expect(page.getByRole('heading', { name: /job matches/i })).toBeVisible()
    await expect(page.getByText(/ai-powered job recommendations/i)).toBeVisible()
  })

  test('should show job match cards', async ({ page }) => {
    await page.goto('/candidate/matches')
    
    // Should show match cards with fit scores
    await expect(page.getByText(/\d+%/)).toBeVisible()
    await expect(page.getByText(/why this match/i)).toBeVisible()
    await expect(page.getByText(/strengths/i)).toBeVisible()
  })

  test('should display applications page', async ({ page }) => {
    await page.goto('/candidate/applications')
    
    await expect(page.getByRole('heading', { name: /my applications/i })).toBeVisible()
    await expect(page.getByText(/track your job applications/i)).toBeVisible()
  })

  test('should show application status badges', async ({ page }) => {
    await page.goto('/candidate/applications')
    
    // Should show status badges
    await expect(page.getByText(/submitted/i)).toBeVisible()
    await expect(page.getByText(/interview/i)).toBeVisible()
  })

  test('should have working navigation', async ({ page }) => {
    await page.goto('/candidate/profile')
    
    // Test sidebar navigation
    await page.getByRole('link', { name: /profile/i }).click()
    await expect(page).toHaveURL('/candidate/profile')
    
    await page.getByRole('link', { name: /job matches/i }).click()
    await expect(page).toHaveURL('/candidate/matches')
    
    await page.getByRole('link', { name: /applications/i }).click()
    await expect(page).toHaveURL('/candidate/applications')
  })

  test('should show sign out button', async ({ page }) => {
    await page.goto('/candidate/profile')
    
    await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible()
  })
})