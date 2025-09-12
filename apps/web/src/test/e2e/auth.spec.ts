import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display landing page', async ({ page }) => {
    await expect(page).toHaveTitle(/ProofOfFit/)
    await expect(page.getByRole('heading', { name: /AI-Powered Hiring/i })).toBeVisible()
  })

  test('should navigate to sign in page', async ({ page }) => {
    await page.getByRole('link', { name: /sign in/i }).click()
    await expect(page).toHaveURL('/auth/signin')
    await expect(page.getByRole('heading', { name: /sign in to proofoffit/i })).toBeVisible()
  })

  test('should navigate to sign up page', async ({ page }) => {
    await page.getByRole('link', { name: /get started/i }).click()
    await expect(page).toHaveURL('/auth/signup')
    await expect(page.getByRole('heading', { name: /create your proofoffit account/i })).toBeVisible()
  })

  test('should show sign in form validation', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Try to submit without email
    await page.getByRole('button', { name: /send magic link/i }).click()
    
    // Should show validation error
    await expect(page.getByText(/email is required/i)).toBeVisible()
  })

  test('should show sign up form validation', async ({ page }) => {
    await page.goto('/auth/signup')
    
    // Try to submit without email and role
    await page.getByRole('button', { name: /create account/i }).click()
    
    // Should show validation errors
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/please select a role/i)).toBeVisible()
  })

  test('should allow role selection in sign up', async ({ page }) => {
    await page.goto('/auth/signup')
    
    // Select candidate role
    await page.getByLabel(/job seeker/i).check()
    await expect(page.getByLabel(/job seeker/i)).toBeChecked()
    
    // Select employer role
    await page.getByLabel(/employer/i).check()
    await expect(page.getByLabel(/employer/i)).toBeChecked()
    await expect(page.getByLabel(/job seeker/i)).not.toBeChecked()
  })

  test('should fill and submit sign in form', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Fill email
    await page.getByLabel(/email/i).fill('test@example.com')
    
    // Submit form
    await page.getByRole('button', { name: /send magic link/i }).click()
    
    // Should show loading state
    await expect(page.getByText(/sending/i)).toBeVisible()
  })

  test('should fill and submit sign up form', async ({ page }) => {
    await page.goto('/auth/signup')
    
    // Fill email
    await page.getByLabel(/email/i).fill('test@example.com')
    
    // Select role
    await page.getByLabel(/job seeker/i).check()
    
    // Submit form
    await page.getByRole('button', { name: /create account/i }).click()
    
    // Should show loading state
    await expect(page.getByText(/creating/i)).toBeVisible()
  })
})