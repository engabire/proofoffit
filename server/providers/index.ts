/**
 * Provider Factory with Circuit Breaker Integration
 *
 * Creates and configures job providers with safety wrappers,
 * circuit breakers, and rate limiting based on environment configuration.
 */

import assert from "node:assert";
import { SeedProvider } from "./seed";
import { SafeProvider } from "./safe";
import type { JobProvider } from "../../domain/jobs";

export function getJobProvider(): JobProvider {
    const providerType = process.env.JOBS_PROVIDER ?? "seed";

    // Validate provider type
    assert(
        ["seed", "google", "greenhouse"].includes(providerType),
        `Invalid JOBS_PROVIDER=${providerType}. Must be one of: seed, google, greenhouse`,
    );

    // Create the base provider
    let baseProvider: JobProvider;

    switch (providerType) {
        case "seed":
            baseProvider = new SeedProvider();
            break;
        // case "google":
        //   baseProvider = new GoogleProvider();
        //   break;
        // case "greenhouse":
        //   baseProvider = new GreenhouseProvider();
        //   break;
        default:
            throw new Error(`Provider ${providerType} not implemented yet`);
    }

    // Wrap with SafeProvider for circuit breaker and rate limiting
    const safeProvider = new SafeProvider(baseProvider, {
        qpsCap: Number(process.env.JOBS_PROVIDER_MAX_QPS ?? 10),
        circuitFailures: 5,
        windowMs: 60_000, // 1 minute
        retryAttempts: 3,
        retryDelayMs: 1000,
        fallbackEnabled: true,
    });

    return safeProvider;
}

// Export individual providers for testing
export { SeedProvider } from "./seed";
export { SafeProvider } from "./safe";

// Provider health check
export function getProviderHealth(): {
    provider: string;
    health: ReturnType<SafeProvider["getHealth"]>;
} {
    const provider = getJobProvider();

    if (provider instanceof SafeProvider) {
        return {
            provider: process.env.JOBS_PROVIDER ?? "seed",
            health: provider.getHealth(),
        };
    }

    // For non-SafeProvider instances, return basic health
    return {
        provider: process.env.JOBS_PROVIDER ?? "seed",
        health: {
            state: "healthy",
            failures: 0,
            circuitState: "closed",
            lastRequestTime: Date.now(),
            requestCount: 0,
        },
    };
}
