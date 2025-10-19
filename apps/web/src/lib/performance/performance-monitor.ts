/**
 * Comprehensive Performance Monitoring System
 * Tracks Core Web Vitals, custom metrics, and performance analytics
 */

import React from "react";

export interface PerformanceMetrics {
    // Core Web Vitals
    lcp?: number; // Largest Contentful Paint
    fid?: number; // First Input Delay
    cls?: number; // Cumulative Layout Shift
    fcp?: number; // First Contentful Paint
    ttfb?: number; // Time to First Byte

    // Custom Metrics
    pageLoadTime?: number;
    domContentLoaded?: number;
    resourceLoadTime?: number;
    bundleSize?: number;

    // User Experience Metrics
    timeToInteractive?: number;
    firstMeaningfulPaint?: number;
    speedIndex?: number;

    // Network Metrics
    networkLatency?: number;
    bandwidth?: number;

    // Memory Metrics
    memoryUsage?: number;
    memoryLeaks?: number;
}

export interface PerformanceReport {
    timestamp: number;
    url: string;
    userAgent: string;
    metrics: PerformanceMetrics;
    score: number;
    recommendations: string[];
}

class PerformanceMonitor {
    private metrics: Partial<PerformanceMetrics> = {};
    private observers: PerformanceObserver[] = [];
    private isInitialized = false;

    constructor() {
        if (typeof window !== "undefined") {
            this.initialize();
        }
    }

    private initialize() {
        if (this.isInitialized) return;

        this.setupWebVitals();
        this.setupCustomMetrics();
        this.setupMemoryMonitoring();
        this.setupNetworkMonitoring();

        this.isInitialized = true;
    }

    private setupWebVitals() {
        // Largest Contentful Paint (LCP)
        this.observeMetric("largest-contentful-paint", (entries) => {
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.startTime;
        });

        // First Input Delay (FID)
        this.observeMetric("first-input", (entries) => {
            const firstInput = entries[0] as any;
            this.metrics.fid = firstInput.processingStart -
                firstInput.startTime;
        });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        this.observeMetric("layout-shift", (entries) => {
            for (const entry of entries) {
                if (!(entry as any).hadRecentInput) {
                    clsValue += (entry as any).value;
                }
            }
            this.metrics.cls = clsValue;
        });

        // First Contentful Paint (FCP)
        this.observeMetric("paint", (entries) => {
            for (const entry of entries) {
                if (entry.name === "first-contentful-paint") {
                    this.metrics.fcp = entry.startTime;
                }
            }
        });
    }

    private setupCustomMetrics() {
        // Page Load Time
        window.addEventListener("load", () => {
            const navigation = performance.getEntriesByType(
                "navigation",
            )[0] as PerformanceNavigationTiming;
            this.metrics.pageLoadTime = navigation.loadEventEnd -
                navigation.fetchStart;
            this.metrics.domContentLoaded =
                navigation.domContentLoadedEventEnd - navigation.fetchStart;
            this.metrics.ttfb = navigation.responseStart -
                navigation.fetchStart;
        });

        // Resource Load Time
        this.observeMetric("resource", (entries) => {
            const totalResourceTime = entries.reduce((sum, entry) => {
                const resourceEntry = entry as any;
                return sum +
                    (resourceEntry.responseEnd - resourceEntry.startTime);
            }, 0);
            this.metrics.resourceLoadTime = totalResourceTime / entries.length;
        });

        // Time to Interactive (TTI) approximation
        this.observeMetric("longtask", (entries) => {
            const longTasks = entries.filter((entry) => entry.duration > 50);
            this.metrics.timeToInteractive = longTasks.length > 0
                ? longTasks[longTasks.length - 1].startTime +
                    longTasks[longTasks.length - 1].duration
                : this.metrics.pageLoadTime;
        });
    }

    private setupMemoryMonitoring() {
        if ("memory" in performance) {
            const memory = (performance as any).memory;
            this.metrics.memoryUsage = memory.usedJSHeapSize /
                memory.totalJSHeapSize;

            // Monitor for memory leaks
            setInterval(() => {
                const currentMemory = (performance as any).memory;
                const memoryGrowth = currentMemory.usedJSHeapSize -
                    memory.usedJSHeapSize;
                if (memoryGrowth > 10 * 1024 * 1024) { // 10MB growth
                    this.metrics.memoryLeaks = (this.metrics.memoryLeaks || 0) +
                        1;
                }
            }, 30000); // Check every 30 seconds
        }
    }

    private setupNetworkMonitoring() {
        if ("connection" in navigator) {
            const connection = (navigator as any).connection;
            this.metrics.networkLatency = connection.rtt;
            this.metrics.bandwidth = connection.downlink;
        }
    }

    private observeMetric(
        type: string,
        callback: (entries: PerformanceEntry[]) => void,
    ) {
        try {
            const observer = new PerformanceObserver((list) => {
                callback(list.getEntries());
            });
            observer.observe({ type, buffered: true });
            this.observers.push(observer);
        } catch (error) {
            console.warn(`Failed to observe ${type}:`, error);
        }
    }

    public getMetrics(): Partial<PerformanceMetrics> {
        return { ...this.metrics };
    }

    public calculateScore(): number {
        const metrics = this.metrics;
        let score = 100;

        // LCP scoring (Good: <2.5s, Needs Improvement: 2.5-4s, Poor: >4s)
        if (metrics.lcp) {
            if (metrics.lcp > 4000) score -= 30;
            else if (metrics.lcp > 2500) score -= 15;
        }

        // FID scoring (Good: <100ms, Needs Improvement: 100-300ms, Poor: >300ms)
        if (metrics.fid) {
            if (metrics.fid > 300) score -= 25;
            else if (metrics.fid > 100) score -= 10;
        }

        // CLS scoring (Good: <0.1, Needs Improvement: 0.1-0.25, Poor: >0.25)
        if (metrics.cls) {
            if (metrics.cls > 0.25) score -= 25;
            else if (metrics.cls > 0.1) score -= 10;
        }

        // Page load time scoring
        if (metrics.pageLoadTime) {
            if (metrics.pageLoadTime > 5000) score -= 20;
            else if (metrics.pageLoadTime > 3000) score -= 10;
        }

        return Math.max(0, score);
    }

    public generateRecommendations(): string[] {
        const recommendations: string[] = [];
        const metrics = this.metrics;

        if (metrics.lcp && metrics.lcp > 2500) {
            recommendations.push(
                "Optimize Largest Contentful Paint: Consider image optimization, preloading critical resources, or reducing server response time",
            );
        }

        if (metrics.fid && metrics.fid > 100) {
            recommendations.push(
                "Improve First Input Delay: Reduce JavaScript execution time, use code splitting, or defer non-critical scripts",
            );
        }

        if (metrics.cls && metrics.cls > 0.1) {
            recommendations.push(
                "Reduce Cumulative Layout Shift: Set size attributes on images, avoid inserting content above existing content",
            );
        }

        if (metrics.pageLoadTime && metrics.pageLoadTime > 3000) {
            recommendations.push(
                "Optimize page load time: Enable compression, minimize resources, use CDN, or implement caching",
            );
        }

        if (metrics.memoryUsage && metrics.memoryUsage > 0.8) {
            recommendations.push(
                "Optimize memory usage: Check for memory leaks, reduce bundle size, or implement lazy loading",
            );
        }

        if (metrics.bundleSize && metrics.bundleSize > 2) {
            recommendations.push(
                "Reduce bundle size: Implement code splitting, tree shaking, or remove unused dependencies",
            );
        }

        return recommendations;
    }

    public generateReport(): PerformanceReport {
        return {
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            metrics: this.getMetrics(),
            score: this.calculateScore(),
            recommendations: this.generateRecommendations(),
        };
    }

    public async sendReport(
        endpoint: string = "/api/performance",
    ): Promise<void> {
        try {
            const report = this.generateReport();
            await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(report),
            });
        } catch (error) {
            console.error("Failed to send performance report:", error);
        }
    }

    public destroy() {
        this.observers.forEach((observer) => observer.disconnect());
        this.observers = [];
        this.isInitialized = false;
    }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
    if (!performanceMonitor) {
        performanceMonitor = new PerformanceMonitor();
    }
    return performanceMonitor;
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
    const [metrics, setMetrics] = React.useState<Partial<PerformanceMetrics>>(
        {},
    );
    const [score, setScore] = React.useState<number>(0);
    const [recommendations, setRecommendations] = React.useState<string[]>([]);

    React.useEffect(() => {
        const monitor = getPerformanceMonitor();

        const updateMetrics = () => {
            setMetrics(monitor.getMetrics());
            setScore(monitor.calculateScore());
            setRecommendations(monitor.generateRecommendations());
        };

        // Initial update
        updateMetrics();

        // Update every 5 seconds
        const interval = setInterval(updateMetrics, 5000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return {
        metrics,
        score,
        recommendations,
        generateReport: () => getPerformanceMonitor().generateReport(),
        sendReport: (endpoint?: string) =>
            getPerformanceMonitor().sendReport(endpoint),
    };
}

// Utility functions
export function markPerformanceStart(name: string): void {
    if (typeof window !== "undefined") {
        performance.mark(`${name}-start`);
    }
}

export function markPerformanceEnd(name: string): number {
    if (typeof window !== "undefined") {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        const measure = performance.getEntriesByName(name)[0];
        return measure ? measure.duration : 0;
    }
    return 0;
}

export function measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
): Promise<T> {
    markPerformanceStart(name);
    return fn().finally(() => {
        markPerformanceEnd(name);
    });
}

export function measureSync<T>(name: string, fn: () => T): T {
    markPerformanceStart(name);
    try {
        return fn();
    } finally {
        markPerformanceEnd(name);
    }
}
