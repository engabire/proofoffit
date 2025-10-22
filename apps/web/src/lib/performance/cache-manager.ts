/**
 * Advanced Cache Manager
 * Implements multiple caching strategies for optimal performance
 */

export interface CacheConfig {
    ttl: number; // Time to live in milliseconds
    maxSize: number; // Maximum number of items
    strategy: "lru" | "fifo" | "ttl";
    persist: boolean; // Whether to persist to localStorage
}

export interface CacheEntry<T> {
    key: string;
    value: T;
    timestamp: number;
    ttl: number;
    accessCount: number;
    lastAccessed: number;
}

export interface CacheStats {
    hits: number;
    misses: number;
    size: number;
    hitRate: number;
    memoryUsage: number;
}

class CacheManager<T = any> {
    private cache: Map<string, CacheEntry<T>> = new Map();
    private config: CacheConfig;
    private stats: CacheStats = {
        hits: 0,
        misses: 0,
        size: 0,
        hitRate: 0,
        memoryUsage: 0,
    };

    constructor(config: Partial<CacheConfig> = {}) {
        this.config = {
            ttl: 5 * 60 * 1000, // 5 minutes default
            maxSize: 100, // 100 items default
            strategy: "lru",
            persist: false,
            ...config,
        };

        if (this.config.persist) {
            this.loadFromStorage();
        }

        // Cleanup expired entries every minute
        setInterval(() => this.cleanup(), 60000);
    }

    /**
     * Get value from cache
     */
    public get(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) {
            this.stats.misses++;
            this.updateHitRate();
            return null;
        }

        // Check if expired
        if (this.isExpired(entry)) {
            this.cache.delete(key);
            this.stats.misses++;
            this.updateHitRate();
            return null;
        }

        // Update access info
        entry.accessCount++;
        entry.lastAccessed = Date.now();

        this.stats.hits++;
        this.updateHitRate();

        return entry.value;
    }

    /**
     * Set value in cache
     */
    public set(key: string, value: T, ttl?: number): void {
        const now = Date.now();
        const entry: CacheEntry<T> = {
            key,
            value,
            timestamp: now,
            ttl: ttl || this.config.ttl,
            accessCount: 1,
            lastAccessed: now,
        };

        // Check if we need to evict entries
        if (this.cache.size >= this.config.maxSize) {
            this.evict();
        }

        this.cache.set(key, entry);
        this.stats.size = this.cache.size;
        this.updateMemoryUsage();

        if (this.config.persist) {
            this.saveToStorage();
        }
    }

    /**
     * Delete value from cache
     */
    public delete(key: string): boolean {
        const deleted = this.cache.delete(key);
        if (deleted) {
            this.stats.size = this.cache.size;
            this.updateMemoryUsage();

            if (this.config.persist) {
                this.saveToStorage();
            }
        }
        return deleted;
    }

    /**
     * Clear all cache entries
     */
    public clear(): void {
        this.cache.clear();
        this.stats.size = 0;
        this.stats.memoryUsage = 0;

        if (this.config.persist && typeof window !== "undefined") {
            localStorage.removeItem(`cache_${this.constructor.name}`);
        }
    }

    /**
     * Check if key exists in cache
     */
    public has(key: string): boolean {
        const entry = this.cache.get(key);
        return entry ? !this.isExpired(entry) : false;
    }

    /**
     * Get cache statistics
     */
    public getStats(): CacheStats {
        return { ...this.stats };
    }

    /**
     * Get all cache keys
     */
    public keys(): string[] {
        return Array.from(this.cache.keys());
    }

    /**
     * Get cache size
     */
    public size(): number {
        return this.cache.size;
    }

    /**
     * Check if entry is expired
     */
    private isExpired(entry: CacheEntry<T>): boolean {
        return Date.now() - entry.timestamp > entry.ttl;
    }

    /**
     * Evict entries based on strategy
     */
    private evict(): void {
        const entries = Array.from(this.cache.entries());

        switch (this.config.strategy) {
            case "lru":
                // Remove least recently used
                entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
                break;
            case "fifo":
                // Remove first in, first out
                entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
                break;
            case "ttl":
                // Remove entries closest to expiration
                entries.sort((a, b) => {
                    const aExpiry = a[1].timestamp + a[1].ttl;
                    const bExpiry = b[1].timestamp + b[1].ttl;
                    return aExpiry - bExpiry;
                });
                break;
        }

        // Remove oldest entry
        const [keyToRemove] = entries[0];
        this.cache.delete(keyToRemove);
    }

    /**
     * Cleanup expired entries
     */
    private cleanup(): void {
        const now = Date.now();
        const expiredKeys: string[] = [];

        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                expiredKeys.push(key);
            }
        }

        expiredKeys.forEach((key) => this.cache.delete(key));

        if (expiredKeys.length > 0) {
            this.stats.size = this.cache.size;
            this.updateMemoryUsage();

            if (this.config.persist) {
                this.saveToStorage();
            }
        }
    }

    /**
     * Update hit rate
     */
    private updateHitRate(): void {
        const total = this.stats.hits + this.stats.misses;
        this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
    }

    /**
     * Update memory usage estimate
     */
    private updateMemoryUsage(): void {
        let totalSize = 0;
        for (const [key, entry] of this.cache.entries()) {
            totalSize += key.length * 2; // Rough estimate for string size
            totalSize += JSON.stringify(entry.value).length * 2;
        }
        this.stats.memoryUsage = totalSize;
    }

    /**
     * Save cache to localStorage
     */
    private saveToStorage(): void {
        if (typeof window === "undefined") return;

        try {
            const data = Array.from(this.cache.entries());
            localStorage.setItem(
                `cache_${this.constructor.name}`,
                JSON.stringify(data),
            );
        } catch (error) {
            console.warn("Failed to save cache to localStorage:", error);
        }
    }

    /**
     * Load cache from localStorage
     */
    private loadFromStorage(): void {
        if (typeof window === "undefined") return;

        try {
            const data = localStorage.getItem(`cache_${this.constructor.name}`);
            if (data) {
                const entries: [string, CacheEntry<T>][] = JSON.parse(data);
                this.cache = new Map(entries);
                this.stats.size = this.cache.size;
                this.updateMemoryUsage();
            }
        } catch (error) {
            console.warn("Failed to load cache from localStorage:", error);
        }
    }
}

// Specialized cache managers for different data types
export class APICache extends CacheManager<any> {
    constructor() {
        super({
            ttl: 2 * 60 * 1000, // 2 minutes for API responses
            maxSize: 200,
            strategy: "lru",
            persist: true,
        });
    }
}

export class ImageCache extends CacheManager<string> {
    constructor() {
        super({
            ttl: 24 * 60 * 60 * 1000, // 24 hours for images
            maxSize: 50,
            strategy: "lru",
            persist: true,
        });
    }
}

export class ComponentCache extends CacheManager<React.ComponentType> {
    constructor() {
        super({
            ttl: 60 * 60 * 1000, // 1 hour for components
            maxSize: 100,
            strategy: "lru",
            persist: false,
        });
    }
}

export class UserDataCache extends CacheManager<any> {
    constructor() {
        super({
            ttl: 5 * 60 * 1000, // 5 minutes for user data
            maxSize: 50,
            strategy: "lru",
            persist: true,
        });
    }
}

// Global cache instances
export const apiCache = new APICache();
export const imageCache = new ImageCache();
export const componentCache = new ComponentCache();
export const userDataCache = new UserDataCache();

// Cache utilities
export const cacheUtils = {
    /**
     * Create a cached function
     */
    memoize<T extends (...args: any[]) => any>(
        fn: T,
        cache: CacheManager<ReturnType<T>>,
        keyGenerator?: (...args: Parameters<T>) => string,
    ): T {
        return ((...args: Parameters<T>) => {
            const key = keyGenerator
                ? keyGenerator(...args)
                : JSON.stringify(args);

            const cached = cache.get(key);
            if (cached !== null) {
                return cached;
            }

            const result = fn(...args);
            cache.set(key, result);
            return result;
        }) as T;
    },

    /**
     * Create a cached async function
     */
    memoizeAsync<T extends (...args: any[]) => Promise<any>>(
        fn: T,
        cache: CacheManager<Awaited<ReturnType<T>>>,
        keyGenerator?: (...args: Parameters<T>) => string,
    ): T {
        return (async (...args: Parameters<T>) => {
            const key = keyGenerator
                ? keyGenerator(...args)
                : JSON.stringify(args);

            const cached = cache.get(key);
            if (cached !== null) {
                return cached;
            }

            const result = await fn(...args);
            cache.set(key, result);
            return result;
        }) as T;
    },

    /**
     * Invalidate cache entries by pattern
     */
    invalidateByPattern(
        cache: CacheManager,
        pattern: RegExp,
    ): number {
        let invalidated = 0;
        const keys = cache.keys();

        for (const key of keys) {
            if (pattern.test(key)) {
                cache.delete(key);
                invalidated++;
            }
        }

        return invalidated;
    },

    /**
     * Get cache performance report
     */
    getPerformanceReport(): Record<string, CacheStats> {
        return {
            api: apiCache.getStats(),
            image: imageCache.getStats(),
            component: componentCache.getStats(),
            userData: userDataCache.getStats(),
        };
    },
};
