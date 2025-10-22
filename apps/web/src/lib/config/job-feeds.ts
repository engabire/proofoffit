/**
 * Job Feed Configuration
 *
 * This module handles environment-specific configuration for job feeds,
 * including external feed settings, timeouts, failure thresholds, and cooldowns.
 */

export interface JobFeedConfig {
    // External job feed settings
    enableExternalJobFeeds: boolean;
    enableSupabaseJobSearch: boolean;

    // Timeout and failure handling
    jobFeedTimeoutMs: number;
    jobFeedFailureThreshold: number;
    jobFeedCooldownMs: number;

    // Rate limiting
    maxRequestsPerMinute: number;
    maxRequestsPerHour: number;

    // Retry configuration
    maxRetries: number;
    retryDelayMs: number;

    // Feature flags
    enableRealTimeFeeds: boolean;
    enableMockData: boolean;
    enableAnalytics: boolean;

    // External service configurations
    externalServices: {
        usajobs: {
            enabled: boolean;
            apiKey?: string;
            baseUrl: string;
            timeout: number;
        };
        indeed: {
            enabled: boolean;
            apiKey?: string;
            baseUrl: string;
            timeout: number;
        };
        linkedin: {
            enabled: boolean;
            apiKey?: string;
            baseUrl: string;
            timeout: number;
        };
    };
}

/**
 * Get job feed configuration based on environment
 */
export function getJobFeedConfig(): JobFeedConfig {
    const isDevelopment = process.env.NODE_ENV === "development";
    const isProduction = process.env.NODE_ENV === "production";
    const isTest = process.env.NODE_ENV === "test";

    // Base configuration
    const baseConfig: JobFeedConfig = {
        // External job feed settings
        enableExternalJobFeeds:
            process.env.ENABLE_EXTERNAL_JOB_FEEDS === "true",
        enableSupabaseJobSearch:
            process.env.ENABLE_SUPABASE_JOB_SEARCH === "true",

        // Timeout and failure handling
        jobFeedTimeoutMs: parseInt(process.env.JOB_FEED_TIMEOUT_MS || "30000"), // 30 seconds default
        jobFeedFailureThreshold: parseInt(
            process.env.JOB_FEED_FAILURE_THRESHOLD || "3",
        ),
        jobFeedCooldownMs: parseInt(
            process.env.JOB_FEED_COOLDOWN_MS || "300000",
        ), // 5 minutes default

        // Rate limiting
        maxRequestsPerMinute: parseInt(
            process.env.JOB_FEED_MAX_REQUESTS_PER_MINUTE || "60",
        ),
        maxRequestsPerHour: parseInt(
            process.env.JOB_FEED_MAX_REQUESTS_PER_HOUR || "1000",
        ),

        // Retry configuration
        maxRetries: parseInt(process.env.JOB_FEED_MAX_RETRIES || "3"),
        retryDelayMs: parseInt(process.env.JOB_FEED_RETRY_DELAY_MS || "1000"),

        // Feature flags
        enableRealTimeFeeds: process.env.ENABLE_REAL_TIME_FEEDS === "true",
        enableMockData: process.env.ENABLE_MOCK_DATA === "true",
        enableAnalytics: process.env.ENABLE_ANALYTICS === "true",

        // External service configurations
        externalServices: {
            usajobs: {
                enabled: process.env.USAJOBS_ENABLED === "true",
                apiKey: process.env.USAJOBS_API_KEY,
                baseUrl: process.env.USAJOBS_BASE_URL ||
                    "https://data.usajobs.gov/api/search",
                timeout: parseInt(process.env.USAJOBS_TIMEOUT_MS || "10000"),
            },
            indeed: {
                enabled: process.env.INDEED_ENABLED === "true",
                apiKey: process.env.INDEED_API_KEY,
                baseUrl: process.env.INDEED_BASE_URL ||
                    "https://api.indeed.com/ads/apisearch",
                timeout: parseInt(process.env.INDEED_TIMEOUT_MS || "10000"),
            },
            linkedin: {
                enabled: process.env.LINKEDIN_ENABLED === "true",
                apiKey: process.env.LINKEDIN_API_KEY,
                baseUrl: process.env.LINKEDIN_BASE_URL ||
                    "https://api.linkedin.com/v2/jobSearch",
                timeout: parseInt(process.env.LINKEDIN_TIMEOUT_MS || "10000"),
            },
        },
    };

    // Environment-specific overrides
    if (isDevelopment) {
        return {
            ...baseConfig,
            enableMockData: true,
            enableRealTimeFeeds: false,
            jobFeedTimeoutMs: 5000, // Shorter timeout for development
            jobFeedFailureThreshold: 1, // Lower threshold for development
        };
    }

    if (isTest) {
        return {
            ...baseConfig,
            enableExternalJobFeeds: false,
            enableMockData: true,
            enableRealTimeFeeds: false,
            jobFeedTimeoutMs: 1000, // Very short timeout for tests
            jobFeedFailureThreshold: 1,
        };
    }

    if (isProduction) {
        return {
            ...baseConfig,
            enableMockData: false,
            enableRealTimeFeeds: true,
            enableAnalytics: true,
            // Production should have stricter settings
            jobFeedTimeoutMs: Math.max(baseConfig.jobFeedTimeoutMs, 30000), // At least 30 seconds
            jobFeedFailureThreshold: Math.max(
                baseConfig.jobFeedFailureThreshold,
                3,
            ),
            jobFeedCooldownMs: Math.max(baseConfig.jobFeedCooldownMs, 300000), // At least 5 minutes
        };
    }

    return baseConfig;
}

/**
 * Validate job feed configuration
 */
export function validateJobFeedConfig(config: JobFeedConfig): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
} {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate required settings
    if (config.jobFeedTimeoutMs < 1000) {
        errors.push("Job feed timeout must be at least 1000ms");
    }

    if (config.jobFeedFailureThreshold < 1) {
        errors.push("Job feed failure threshold must be at least 1");
    }

    if (config.jobFeedCooldownMs < 60000) {
        warnings.push(
            "Job feed cooldown is less than 1 minute, which may be too aggressive",
        );
    }

    if (config.maxRequestsPerMinute > 100) {
        warnings.push(
            "High request rate may trigger rate limiting from external services",
        );
    }

    // Validate external service configurations
    if (config.enableExternalJobFeeds) {
        const enabledServices = Object.entries(config.externalServices)
            .filter(([_, service]) => service.enabled);

        if (enabledServices.length === 0) {
            errors.push(
                "External job feeds are enabled but no services are configured",
            );
        }

        enabledServices.forEach(([serviceName, service]) => {
            if (!service.apiKey && process.env.NODE_ENV === "production") {
                errors.push(`${serviceName} is enabled but API key is missing`);
            }

            if (service.timeout < 1000) {
                warnings.push(
                    `${serviceName} timeout is very short (${service.timeout}ms)`,
                );
            }
        });
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}

/**
 * Get configuration summary for logging
 */
export function getConfigSummary(config: JobFeedConfig): Record<string, any> {
    return {
        environment: process.env.NODE_ENV,
        externalFeedsEnabled: config.enableExternalJobFeeds,
        supabaseSearchEnabled: config.enableSupabaseJobSearch,
        realTimeFeedsEnabled: config.enableRealTimeFeeds,
        mockDataEnabled: config.enableMockData,
        analyticsEnabled: config.enableAnalytics,
        timeoutMs: config.jobFeedTimeoutMs,
        failureThreshold: config.jobFeedFailureThreshold,
        cooldownMs: config.jobFeedCooldownMs,
        enabledServices: Object.entries(config.externalServices)
            .filter(([_, service]) => service.enabled)
            .map(([name, _]) => name),
    };
}

// Export the configuration instance
export const jobFeedConfig = getJobFeedConfig();

