/**
 * End-to-End Tests for Authentication Flow
 * Tests the complete user journey from landing page to authenticated dashboard
 */

import { expect, test } from "@playwright/test";

test.describe("Authentication Flow", () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the application
        await page.goto("/");
    });

    test.describe("Sign In Flow", () => {
        test("should navigate to sign in page", async ({ page }) => {
            // Click on sign in button
            await page.click("text=Sign In");

            // Verify we're on the sign in page
            await expect(page).toHaveURL(/.*\/auth\/signin/);
            await expect(page.locator("h1")).toContainText("Sign In");
        });

        test("should display sign in form with all required fields", async ({ page }) => {
            await page.goto("/auth/signin");

            // Check for email input
            await expect(page.locator('input[type="email"]')).toBeVisible();

            // Check for password input
            await expect(page.locator('input[type="password"]')).toBeVisible();

            // Check for sign in button
            await expect(page.locator('button[type="submit"]')).toBeVisible();

            // Check for OAuth buttons
            await expect(page.locator("text=Google")).toBeVisible();
            await expect(page.locator("text=GitHub")).toBeVisible();
            await expect(page.locator("text=Microsoft")).toBeVisible();
        });

        test("should validate email format", async ({ page }) => {
            await page.goto("/auth/signin");

            // Enter invalid email
            await page.fill('input[type="email"]', "invalid-email");
            await page.fill('input[type="password"]', "password123");
            await page.click('button[type="submit"]');

            // Check for validation error
            await expect(page.locator("text=valid email")).toBeVisible();
        });

        test("should handle invalid credentials", async ({ page }) => {
            await page.goto("/auth/signin");

            // Enter invalid credentials
            await page.fill('input[type="email"]', "test@example.com");
            await page.fill('input[type="password"]', "wrongpassword");
            await page.click('button[type="submit"]');

            // Check for error message
            await expect(page.locator("text=Invalid login credentials"))
                .toBeVisible();
        });

        test("should show password visibility toggle", async ({ page }) => {
            await page.goto("/auth/signin");

            const passwordInput = page.locator('input[type="password"]');
            const toggleButton = page.locator('button[aria-label*="password"]');

            // Initially password should be hidden
            await expect(passwordInput).toHaveAttribute("type", "password");

            // Click toggle button
            await toggleButton.click();

            // Password should be visible
            await expect(passwordInput).toHaveAttribute("type", "text");

            // Click toggle again
            await toggleButton.click();

            // Password should be hidden again
            await expect(passwordInput).toHaveAttribute("type", "password");
        });
    });

    test.describe("Sign Up Flow", () => {
        test("should navigate to sign up page", async ({ page }) => {
            // Click on sign up button
            await page.click("text=Sign Up");

            // Verify we're on the sign up page
            await expect(page).toHaveURL(/.*\/auth\/signup/);
            await expect(page.locator("h1")).toContainText("Sign Up");
        });

        test("should display sign up form with all required fields", async ({ page }) => {
            await page.goto("/auth/signup");

            // Check for email input
            await expect(page.locator('input[type="email"]')).toBeVisible();

            // Check for password input
            await expect(page.locator('input[type="password"]')).toBeVisible();

            // Check for confirm password input
            await expect(page.locator('input[placeholder*="Confirm"]'))
                .toBeVisible();

            // Check for audience selection
            await expect(page.locator("text=Job Seeker")).toBeVisible();
            await expect(page.locator("text=Employer")).toBeVisible();

            // Check for terms checkbox
            await expect(page.locator('input[type="checkbox"]')).toBeVisible();

            // Check for sign up button
            await expect(page.locator('button[type="submit"]')).toBeVisible();
        });

        test("should validate password confirmation", async ({ page }) => {
            await page.goto("/auth/signup");

            // Enter mismatched passwords
            await page.fill('input[type="email"]', "test@example.com");
            await page.fill('input[type="password"]', "password123");
            await page.fill(
                'input[placeholder*="Confirm"]',
                "differentpassword",
            );
            await page.click('button[type="submit"]');

            // Check for validation error
            await expect(page.locator("text=Passwords do not match"))
                .toBeVisible();
        });

        test("should require terms acceptance", async ({ page }) => {
            await page.goto("/auth/signup");

            // Fill form without accepting terms
            await page.fill('input[type="email"]', "test@example.com");
            await page.fill('input[type="password"]', "password123");
            await page.fill('input[placeholder*="Confirm"]', "password123");
            await page.click('button[type="submit"]');

            // Check for validation error
            await expect(page.locator("text=accept the Terms")).toBeVisible();
        });

        test("should allow audience selection", async ({ page }) => {
            await page.goto("/auth/signup");

            // Check default selection
            await expect(page.locator("text=Job Seeker").locator(".."))
                .toHaveClass(/data-state="active"/);

            // Click on Employer tab
            await page.click("text=Employer");

            // Check that Employer is now selected
            await expect(page.locator("text=Employer").locator(".."))
                .toHaveClass(/data-state="active"/);
        });
    });

    test.describe("OAuth Authentication", () => {
        test("should initiate Google OAuth flow", async ({ page }) => {
            await page.goto("/auth/signin");

            // Mock the OAuth redirect
            await page.route("**/auth/v1/authorize*", (route) => {
                route.fulfill({
                    status: 302,
                    headers: {
                        "Location":
                            "/auth/callback?code=test-code&state=test-state",
                    },
                });
            });

            // Click Google sign in button
            await page.click("text=Google");

            // Should redirect to OAuth provider
            await expect(page).toHaveURL(
                /.*\/auth\/v1\/authorize.*provider=google/,
            );
        });

        test("should initiate GitHub OAuth flow", async ({ page }) => {
            await page.goto("/auth/signin");

            // Mock the OAuth redirect
            await page.route("**/auth/v1/authorize*", (route) => {
                route.fulfill({
                    status: 302,
                    headers: {
                        "Location":
                            "/auth/callback?code=test-code&state=test-state",
                    },
                });
            });

            // Click GitHub sign in button
            await page.click("text=GitHub");

            // Should redirect to OAuth provider
            await expect(page).toHaveURL(
                /.*\/auth\/v1\/authorize.*provider=github/,
            );
        });

        test("should initiate Microsoft OAuth flow", async ({ page }) => {
            await page.goto("/auth/signin");

            // Mock the OAuth redirect
            await page.route("**/auth/v1/authorize*", (route) => {
                route.fulfill({
                    status: 302,
                    headers: {
                        "Location":
                            "/auth/callback?code=test-code&state=test-state",
                    },
                });
            });

            // Click Microsoft sign in button
            await page.click("text=Microsoft");

            // Should redirect to OAuth provider
            await expect(page).toHaveURL(
                /.*\/auth\/v1\/authorize.*provider=azure/,
            );
        });
    });

    test.describe("Magic Link Authentication", () => {
        test("should send magic link", async ({ page }) => {
            await page.goto("/auth/signin");

            // Mock the magic link API
            await page.route("**/auth/v1/otp", (route) => {
                route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify({ message: "Magic link sent" }),
                });
            });

            // Enter email
            await page.fill('input[type="email"]', "test@example.com");

            // Click magic link button (if available)
            const magicLinkButton = page.locator("text=Send Magic Link");
            if (await magicLinkButton.isVisible()) {
                await magicLinkButton.click();

                // Check for success message
                await expect(page.locator("text=Magic link sent"))
                    .toBeVisible();
            }
        });
    });

    test.describe("Authentication Callback", () => {
        test("should handle successful OAuth callback", async ({ page }) => {
            // Mock successful authentication
            await page.route("**/auth/v1/token", (route) => {
                route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify({
                        access_token: "test-access-token",
                        refresh_token: "test-refresh-token",
                        user: {
                            id: "test-user-id",
                            email: "test@example.com",
                        },
                    }),
                });
            });

            // Navigate to callback URL
            await page.goto("/auth/callback?code=test-code&state=test-state");

            // Should show loading state
            await expect(page.locator("text=Authenticating")).toBeVisible();

            // Should redirect to dashboard after successful auth
            await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
        });

        test("should handle OAuth callback errors", async ({ page }) => {
            // Mock authentication error
            await page.route("**/auth/v1/token", (route) => {
                route.fulfill({
                    status: 400,
                    contentType: "application/json",
                    body: JSON.stringify({
                        error: "invalid_request",
                        error_description: "Invalid authorization code",
                    }),
                });
            });

            // Navigate to callback URL with error
            await page.goto(
                "/auth/callback?error=access_denied&error_description=User%20denied%20access",
            );

            // Should show error message
            await expect(page.locator("text=Authentication Failed"))
                .toBeVisible();
            await expect(page.locator("text=User denied access")).toBeVisible();

            // Should redirect to sign in page after delay
            await expect(page).toHaveURL(/.*\/auth\/signin/, {
                timeout: 10000,
            });
        });
    });

    test.describe("Session Management", () => {
        test("should maintain session across page refreshes", async ({ page }) => {
            // Mock authenticated user
            await page.route("**/auth/v1/user", (route) => {
                route.fulfill({
                    status: 200,
                    contentType: "application/json",
                    body: JSON.stringify({
                        id: "test-user-id",
                        email: "test@example.com",
                    }),
                });
            });

            // Set authentication token in localStorage
            await page.evaluate(() => {
                localStorage.setItem(
                    "supabase.auth.token",
                    JSON.stringify({
                        access_token: "test-token",
                        refresh_token: "test-refresh-token",
                    }),
                );
            });

            // Navigate to dashboard
            await page.goto("/dashboard");

            // Should show dashboard content
            await expect(page.locator("text=Dashboard")).toBeVisible();

            // Refresh page
            await page.reload();

            // Should still show dashboard (session maintained)
            await expect(page.locator("text=Dashboard")).toBeVisible();
        });

        test("should handle session expiration", async ({ page }) => {
            // Mock expired session
            await page.route("**/auth/v1/user", (route) => {
                route.fulfill({
                    status: 401,
                    contentType: "application/json",
                    body: JSON.stringify({
                        error: "invalid_token",
                        error_description: "Token expired",
                    }),
                });
            });

            // Set expired token
            await page.evaluate(() => {
                localStorage.setItem(
                    "supabase.auth.token",
                    JSON.stringify({
                        access_token: "expired-token",
                        refresh_token: "expired-refresh-token",
                    }),
                );
            });

            // Navigate to protected page
            await page.goto("/dashboard");

            // Should redirect to sign in page
            await expect(page).toHaveURL(/.*\/auth\/signin/);
        });
    });

    test.describe("Navigation and UX", () => {
        test("should navigate between sign in and sign up pages", async ({ page }) => {
            await page.goto("/auth/signin");

            // Click link to sign up
            await page.click("text=Sign Up");

            // Should be on sign up page
            await expect(page).toHaveURL(/.*\/auth\/signup/);

            // Click link to sign in
            await page.click("text=Sign In");

            // Should be on sign in page
            await expect(page).toHaveURL(/.*\/auth\/signin/);
        });

        test("should show loading states during authentication", async ({ page }) => {
            await page.goto("/auth/signin");

            // Mock slow authentication
            await page.route("**/auth/v1/token", (route) => {
                setTimeout(() => {
                    route.fulfill({
                        status: 200,
                        contentType: "application/json",
                        body: JSON.stringify({
                            access_token: "test-token",
                            user: {
                                id: "test-user",
                                email: "test@example.com",
                            },
                        }),
                    });
                }, 2000);
            });

            // Fill form and submit
            await page.fill('input[type="email"]', "test@example.com");
            await page.fill('input[type="password"]', "password123");
            await page.click('button[type="submit"]');

            // Should show loading state
            await expect(page.locator("text=Processing")).toBeVisible();

            // Button should be disabled
            await expect(page.locator('button[type="submit"]')).toBeDisabled();
        });

        test("should handle network errors gracefully", async ({ page }) => {
            await page.goto("/auth/signin");

            // Mock network error
            await page.route("**/auth/v1/token", (route) => {
                route.abort("Failed");
            });

            // Fill form and submit
            await page.fill('input[type="email"]', "test@example.com");
            await page.fill('input[type="password"]', "password123");
            await page.click('button[type="submit"]');

            // Should show error message
            await expect(page.locator("text=Network error")).toBeVisible();
        });
    });

    test.describe("Accessibility", () => {
        test("should have proper ARIA labels", async ({ page }) => {
            await page.goto("/auth/signin");

            // Check for proper form labels
            await expect(page.locator('input[type="email"]')).toHaveAttribute(
                "aria-label",
            );
            await expect(page.locator('input[type="password"]'))
                .toHaveAttribute("aria-label");

            // Check for proper button labels
            await expect(page.locator('button[type="submit"]')).toHaveAttribute(
                "aria-label",
            );
        });

        test("should support keyboard navigation", async ({ page }) => {
            await page.goto("/auth/signin");

            // Tab through form elements
            await page.keyboard.press("Tab");
            await expect(page.locator('input[type="email"]')).toBeFocused();

            await page.keyboard.press("Tab");
            await expect(page.locator('input[type="password"]')).toBeFocused();

            await page.keyboard.press("Tab");
            await expect(page.locator('button[type="submit"]')).toBeFocused();
        });

        test("should have proper focus management", async ({ page }) => {
            await page.goto("/auth/signin");

            // Check initial focus
            await expect(page.locator('input[type="email"]')).toBeFocused();

            // Fill form and submit
            await page.fill('input[type="email"]', "test@example.com");
            await page.fill('input[type="password"]', "password123");
            await page.click('button[type="submit"]');

            // Focus should remain on form after error
            await expect(page.locator('input[type="email"]')).toBeFocused();
        });
    });

    test.describe("Mobile Responsiveness", () => {
        test("should work on mobile devices", async ({ page }) => {
            // Set mobile viewport
            await page.setViewportSize({ width: 375, height: 667 });

            await page.goto("/auth/signin");

            // Check that form is visible and usable
            await expect(page.locator('input[type="email"]')).toBeVisible();
            await expect(page.locator('input[type="password"]')).toBeVisible();
            await expect(page.locator('button[type="submit"]')).toBeVisible();

            // Check that OAuth buttons are accessible
            await expect(page.locator("text=Google")).toBeVisible();
            await expect(page.locator("text=GitHub")).toBeVisible();
        });

        test("should handle touch interactions", async ({ page }) => {
            // Set mobile viewport
            await page.setViewportSize({ width: 375, height: 667 });

            await page.goto("/auth/signin");

            // Test touch interactions
            await page.tap('input[type="email"]');
            await page.fill('input[type="email"]', "test@example.com");

            await page.tap('input[type="password"]');
            await page.fill('input[type="password"]', "password123");

            await page.tap('button[type="submit"]');

            // Should handle touch interactions properly
            await expect(page.locator('input[type="email"]')).toHaveValue(
                "test@example.com",
            );
            await expect(page.locator('input[type="password"]')).toHaveValue(
                "password123",
            );
        });
    });
});
