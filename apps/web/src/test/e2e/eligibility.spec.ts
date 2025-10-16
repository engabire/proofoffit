import { test, expect } from '@playwright/test'

test.describe('Nonprofit eligibility flow', () => {
  test('placeholder widget renders on nonprofit page', async ({ page }) => {
    await page.goto('/nonprofit')
    await expect(page.getByRole('heading', { name: 'ProofOfFit Impact Access — Verification priced for impact.' })).toBeVisible()
    await expect(page.getByText('Eligibility widget coming soon.', { exact: false })).toBeVisible()
  })
})
