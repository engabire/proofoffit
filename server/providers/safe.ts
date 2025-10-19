/**
 * SafeProvider - Circuit Breaker and Rate Limiting Wrapper
 *
 * Implements the Circuit Breaker pattern and rate limiting for job providers
 * to ensure system resilience and prevent cascading failures.
 */

import assert from "node:assert";
import type { Job, JobProvider, JobQuery } from "../../domain/jobs";

export interface SafeProviderConfig {
    qpsCap: number; // Queries per second cap
    circuitFailures: number; // Number of failures before circuit opens
    windowMs: number; // Time window for failure counting
    retryAttempts?: number; // Number of retry attempts
    retryDelayMs?: number; // Delay between retries
    fallbackEnabled?: boolean; // Enable fallback responses
}

export class SafeProvider implements JobProvider {
    private failures = 0;
    private lastFailureTime = 0;
    private lastRequestTime = 0;
    private requestCount = 0;
    private windowStart = Date.now();
    private circuitState: "closed" | "open" | "half-open" = "closed";
    private readonly config: Required<SafeProviderConfig>;

    constructor(
        private inner: JobProvider,
        config: SafeProviderConfig,
    ) {
        this.config = {
            retryAttempts: 3,
            retryDelayMs: 1000,
            fallbackEnabled: true,
            ...config,
        };
    }

    private isAllowed(): boolean {
        const now = Date.now();

        // Reset window if needed
        if (now - this.windowStart > this.config.windowMs) {
            this.failures = 0;
            this.windowStart = now;
        }

        // Check circuit breaker state
        if (this.circuitState === "open") {
            // Try to transition to half-open after recovery timeout
            if (now - this.lastFailureTime > this.config.windowMs) {
                this.circuitState = "half-open";
                return true;
            }
            return false;
        }

        // Check rate limiting
        if (now - this.windowStart < 1000) { // Within 1 second window
            if (this.requestCount >= this.config.qpsCap) {
                return false;
            }
        } else {
            // Reset rate limiting window
            this.requestCount = 0;
            this.windowStart = now;
        }

        return true;
    }

    private async withRetry<T>(
        operation: () => Promise<T>,
        operationName: string,
    ): Promise<T> {
        let lastError: Error;

        for (let attempt = 0; attempt <= this.config.retryAttempts; attempt++) {
            try {
                const result = await operation();

                // Reset failure count on success
                if (this.circuitState === "half-open") {
                    this.circuitState = "closed";
                    this.failures = 0;
                }

                return result;
            } catch (error) {
                lastError = error as Error;

                // Don't retry on certain error types
                if (this.isNonRetryableError(error)) {
                    throw error;
                }

                // Increment failure count
                this.failures++;
                this.lastFailureTime = Date.now();

                // Check if circuit should open
                if (this.failures >= this.config.circuitFailures) {
                    this.circuitState = "open";
                }

                // If this is the last attempt, throw the error
                if (attempt === this.config.retryAttempts) {
                    break;
                }

                // Wait before retrying
                await this.delay(
                    this.config.retryDelayMs * Math.pow(2, attempt),
                );
            }
        }

        throw new Error(
            `${operationName} failed after ${
                this.config.retryAttempts + 1
            } attempts: ${lastError!.message}`,
        );
    }

    private isNonRetryableError(error: unknown): boolean {
        if (error instanceof Error) {
            // Don't retry on authentication or authorization errors
            return error.message.includes("401") ||
                error.message.includes("403") ||
                error.message.includes("unauthorized") ||
                error.message.includes("forbidden");
        }
        return false;
    }

    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private createFallbackResponse(
        query: JobQuery,
    ): { jobs: Job[]; nextPage?: number } {
        if (!this.config.fallbackEnabled) {
            throw new Error("Provider unavailable and fallback disabled");
        }

        // Return empty results as fallback
        return {
            jobs: [],
            nextPage: undefined,
        };
    }

    async searchJobs(
        query: JobQuery,
    ): Promise<{ jobs: Job[]; nextPage?: number }> {
        if (!this.isAllowed()) {
            throw new Error("Circuit breaker is open - provider unavailable");
        }

        this.requestCount++;
        this.lastRequestTime = Date.now();

        try {
            return await this.withRetry(
                () => this.inner.searchJobs(query),
                "searchJobs",
            );
        } catch (error) {
            // If all retries failed, try fallback
            if (this.config.fallbackEnabled) {
                console.warn(
                    "Provider failed, using fallback response:",
                    error,
                );
                return this.createFallbackResponse(query);
            }
            throw error;
        }
    }

    async getJob(id: string): Promise<Job | null> {
        if (!this.isAllowed()) {
            throw new Error("Circuit breaker is open - provider unavailable");
        }

        this.requestCount++;
        this.lastRequestTime = Date.now();

        try {
            return await this.withRetry(
                () => this.inner.getJob(id),
                "getJob",
            );
        } catch (error) {
            // For getJob, we can return null as fallback
            if (this.config.fallbackEnabled) {
                console.warn(
                    "Provider failed for getJob, returning null:",
                    error,
                );
                return null;
            }
            throw error;
        }
    }

    // Health check method
    getHealth(): {
        state: "healthy" | "degraded" | "unhealthy";
        failures: number;
        circuitState: string;
        lastRequestTime: number;
        requestCount: number;
    } {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        const timeSinceLastFailure = now - this.lastFailureTime;

        let state: "healthy" | "degraded" | "unhealthy";

        if (this.circuitState === "open") {
            state = "unhealthy";
        } else if (this.failures > 0 || timeSinceLastRequest > 30000) {
            state = "degraded";
        } else {
            state = "healthy";
        }

        return {
            state,
            failures: this.failures,
            circuitState: this.circuitState,
            lastRequestTime: this.lastRequestTime,
            requestCount: this.requestCount,
        };
    }

    // Reset circuit breaker (for testing or manual intervention)
    reset(): void {
        this.failures = 0;
        this.lastFailureTime = 0;
        this.circuitState = "closed";
        this.requestCount = 0;
        this.windowStart = Date.now();
    }
}
