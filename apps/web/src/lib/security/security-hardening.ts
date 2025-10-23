/**
 * Security Hardening Utilities
 *
 * This module provides utilities to ensure secure configuration
 * and prevent common security vulnerabilities.
 */

export class SecurityHardener {
    private static readonly CRITICAL_ENV_VARS = [
        "SUPABASE_SERVICE_ROLE_KEY",
        "STRIPE_SECRET_KEY",
        "NEXTAUTH_SECRET",
        "OPENAI_API_KEY",
        "ANTHROPIC_API_KEY",
        "RESEND_API_KEY",
        "RAPIDAPI_KEY",
        "UPSTASH_REDIS_REST_TOKEN",
        "CRON_SECRET",
        "CSRF_SECRET",
    ];

    private static readonly WARNING_ENV_VARS = [
        "USAJOBS_API_KEY",
        "GOOGLE_CLIENT_ID",
        "MICROSOFT_CLIENT_ID",
        "OKTA_CLIENT_ID",
    ];

    /**
     * Validates that all critical environment variables are set
     * and not using default/fallback values
     */
    static validateEnvironment(): {
        isValid: boolean;
        errors: string[];
        warnings: string[];
    } {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Check critical environment variables
        for (const envVar of this.CRITICAL_ENV_VARS) {
            const value = process.env[envVar];

            if (!value) {
                errors.push(
                    `Critical environment variable ${envVar} is not set`,
                );
            } else if (this.isDefaultValue(value)) {
                errors.push(
                    `Critical environment variable ${envVar} is using a default/fallback value`,
                );
            }
        }

        // Check warning environment variables
        for (const envVar of this.WARNING_ENV_VARS) {
            const value = process.env[envVar];

            if (!value) {
                warnings.push(`Environment variable ${envVar} is not set`);
            } else if (this.isDefaultValue(value)) {
                warnings.push(
                    `Environment variable ${envVar} is using a default/fallback value`,
                );
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }

    /**
     * Checks if a value appears to be a default/fallback value
     */
    private static isDefaultValue(value: string): boolean {
        const defaultPatterns = [
            /^default-/i,
            /^change-in-production/i,
            /^your-/i,
            /^sk_test_123/i,
            /^pk_test_123/i,
            /^test-/i,
            /^dev-/i,
            /^localhost/i,
            /^127\.0\.0\.1/i,
            /^http:\/\/localhost/i,
        ];

        return defaultPatterns.some((pattern) => pattern.test(value));
    }

    /**
     * Sanitizes sensitive data for logging
     */
    static sanitizeForLogging(data: any): any {
        if (typeof data !== "object" || data === null) {
            return data;
        }

        const sensitiveKeys = [
            "password",
            "token",
            "key",
            "secret",
            "auth",
            "credential",
            "apiKey",
            "accessToken",
            "refreshToken",
        ];

        const sanitized = { ...data };

        for (const key in sanitized) {
            if (
                sensitiveKeys.some((sensitive) =>
                    key.toLowerCase().includes(sensitive)
                )
            ) {
                sanitized[key] = "[REDACTED]";
            } else if (typeof sanitized[key] === "object") {
                sanitized[key] = this.sanitizeForLogging(sanitized[key]);
            }
        }

        return sanitized;
    }

    /**
     * Validates API key format
     */
    static validateApiKey(
        key: string,
        type: "stripe" | "openai" | "anthropic" | "supabase",
    ): boolean {
        const patterns = {
            stripe: /^sk_(live|test)_[a-zA-Z0-9]{24,}$/,
            openai: /^sk-[a-zA-Z0-9]{48,}$/,
            anthropic: /^sk-ant-[a-zA-Z0-9]{32,}$/,
            supabase: /^[a-zA-Z0-9]{64,}$/,
        };

        return patterns[type].test(key);
    }

    /**
     * Generates secure random strings for secrets
     */
    static generateSecureSecret(length: number = 32): string {
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";

        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return result;
    }

    /**
     * Validates URL for security
     */
    static validateUrl(url: string): boolean {
        try {
            const parsed = new URL(url);

            // Only allow HTTPS in production
            if (
                process.env.NODE_ENV === "production" &&
                parsed.protocol !== "https:"
            ) {
                return false;
            }

            // Block dangerous protocols
            const dangerousProtocols = ["javascript:", "data:", "vbscript:"];
            if (dangerousProtocols.includes(parsed.protocol)) {
                return false;
            }

            return true;
        } catch {
            return false;
        }
    }

    /**
     * Rate limiting configuration
     */
    static getRateLimitConfig(endpoint: string): {
        windowMs: number;
        max: number;
        message: string;
    } {
        const configs = {
            "/api/auth": { windowMs: 15 * 60 * 1000, max: 5 }, // 5 attempts per 15 minutes
            "/api/jobs": { windowMs: 60 * 1000, max: 30 }, // 30 requests per minute
            "/api/applications": { windowMs: 60 * 1000, max: 20 }, // 20 requests per minute
            "/api/analytics": { windowMs: 60 * 1000, max: 10 }, // 10 requests per minute
            default: { windowMs: 60 * 1000, max: 100 }, // 100 requests per minute
        };

        const config = configs[endpoint] || configs.default;

        return {
            ...config,
            message: "Too many requests, please try again later.",
        };
    }
}

/**
 * Security middleware for API routes
 */
export function withSecurityHeaders(handler: Function) {
    return async (req: any, res: any) => {
        // Add security headers
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("X-XSS-Protection", "1; mode=block");
        res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        res.setHeader(
            "Permissions-Policy",
            "camera=(), microphone=(), geolocation=()",
        );

        // Add CSP header
        res.setHeader(
            "Content-Security-Policy",
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.stripe.com https://*.supabase.co;",
        );

        return handler(req, res);
    };
}

/**
 * Input validation utilities
 */
export class InputValidator {
    /**
     * Validates email format
     */
    static validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= 254;
    }

    /**
     * Validates password strength
     */
    static validatePassword(password: string): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        if (password.length < 8) {
            errors.push("Password must be at least 8 characters long");
        }

        if (!/[A-Z]/.test(password)) {
            errors.push("Password must contain at least one uppercase letter");
        }

        if (!/[a-z]/.test(password)) {
            errors.push("Password must contain at least one lowercase letter");
        }

        if (!/[0-9]/.test(password)) {
            errors.push("Password must contain at least one number");
        }

        if (!/[^A-Za-z0-9]/.test(password)) {
            errors.push("Password must contain at least one special character");
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * Sanitizes HTML input
     */
    static sanitizeHtml(input: string): string {
        return input
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#x27;")
            .replace(/\//g, "&#x2F;");
    }

    /**
     * Validates UUID format
     */
    static validateUuid(uuid: string): boolean {
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }
}
