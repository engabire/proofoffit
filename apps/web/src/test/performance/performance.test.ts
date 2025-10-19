/**
 * Performance Tests for ProofOfFit
 * Tests Core Web Vitals, load times, and performance metrics
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getPerformanceMonitor, measureAsync, measureSync } from '@/lib/performance/performance-monitor';

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(),
  getEntriesByName: vi.fn(),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn(),
};

const mockPerformanceObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn(),
}));

// Mock window.performance
Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true,
});

// Mock PerformanceObserver
Object.defineProperty(window, 'PerformanceObserver', {
  value: mockPerformanceObserver,
  writable: true,
});

// Mock navigator
Object.defineProperty(navigator, 'onLine', {
  value: true,
  writable: true,
});

describe('Performance Monitoring Tests', () => {
  let performanceMonitor: ReturnType<typeof getPerformanceMonitor>;

  beforeEach(() => {
    vi.clearAllMocks();
    performanceMonitor = getPerformanceMonitor();
  });

  afterEach(() => {
    performanceMonitor.destroy();
  });

  describe('Core Web Vitals', () => {
    it('should track Largest Contentful Paint (LCP)', () => {
      const mockEntries = [
        { startTime: 1200, element: 'img' },
        { startTime: 1500, element: 'div' },
      ];

      mockPerformanceObserver.mockImplementation((callback) => {
        // Simulate LCP entry
        setTimeout(() => {
          callback({ getEntries: () => mockEntries });
        }, 100);
        return {
          observe: vi.fn(),
          disconnect: vi.fn(),
          takeRecords: vi.fn(),
        };
      });

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.lcp).toBe(1500);
    });

    it('should track First Input Delay (FID)', () => {
      const mockEntries = [
        { startTime: 1000, processingStart: 1050 },
      ];

      mockPerformanceObserver.mockImplementation((callback) => {
        setTimeout(() => {
          callback({ getEntries: () => mockEntries });
        }, 100);
        return {
          observe: vi.fn(),
          disconnect: vi.fn(),
          takeRecords: vi.fn(),
        };
      });

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.fid).toBe(50);
    });

    it('should track Cumulative Layout Shift (CLS)', () => {
      const mockEntries = [
        { value: 0.1, hadRecentInput: false },
        { value: 0.05, hadRecentInput: false },
      ];

      mockPerformanceObserver.mockImplementation((callback) => {
        setTimeout(() => {
          callback({ getEntries: () => mockEntries });
        }, 100);
        return {
          observe: vi.fn(),
          disconnect: vi.fn(),
          takeRecords: vi.fn(),
        };
      });

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.cls).toBe(0.15);
    });

    it('should track First Contentful Paint (FCP)', () => {
      const mockEntries = [
        { name: 'first-contentful-paint', startTime: 800 },
      ];

      mockPerformanceObserver.mockImplementation((callback) => {
        setTimeout(() => {
          callback({ getEntries: () => mockEntries });
        }, 100);
        return {
          observe: vi.fn(),
          disconnect: vi.fn(),
          takeRecords: vi.fn(),
        };
      });

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.fcp).toBe(800);
    });
  });

  describe('Performance Scoring', () => {
    it('should calculate good performance score', () => {
      const metrics = {
        lcp: 2000, // Good
        fid: 50,   // Good
        cls: 0.05, // Good
        pageLoadTime: 2500, // Good
      };

      // Mock the metrics
      Object.assign(performanceMonitor, { metrics });

      const score = performanceMonitor.calculateScore();
      expect(score).toBeGreaterThanOrEqual(90);
    });

    it('should calculate poor performance score', () => {
      const metrics = {
        lcp: 5000, // Poor
        fid: 400,  // Poor
        cls: 0.3,  // Poor
        pageLoadTime: 6000, // Poor
      };

      // Mock the metrics
      Object.assign(performanceMonitor, { metrics });

      const score = performanceMonitor.calculateScore();
      expect(score).toBeLessThan(50);
    });

    it('should handle missing metrics gracefully', () => {
      const metrics = {};

      // Mock the metrics
      Object.assign(performanceMonitor, { metrics });

      const score = performanceMonitor.calculateScore();
      expect(score).toBe(100); // Should default to perfect score
    });
  });

  describe('Performance Recommendations', () => {
    it('should generate LCP recommendations', () => {
      const metrics = {
        lcp: 3000, // Needs improvement
      };

      // Mock the metrics
      Object.assign(performanceMonitor, { metrics });

      const recommendations = performanceMonitor.generateRecommendations();
      expect(recommendations).toContain(
        expect.stringContaining('Largest Contentful Paint')
      );
    });

    it('should generate FID recommendations', () => {
      const metrics = {
        fid: 200, // Needs improvement
      };

      // Mock the metrics
      Object.assign(performanceMonitor, { metrics });

      const recommendations = performanceMonitor.generateRecommendations();
      expect(recommendations).toContain(
        expect.stringContaining('First Input Delay')
      );
    });

    it('should generate CLS recommendations', () => {
      const metrics = {
        cls: 0.2, // Needs improvement
      };

      // Mock the metrics
      Object.assign(performanceMonitor, { metrics });

      const recommendations = performanceMonitor.generateRecommendations();
      expect(recommendations).toContain(
        expect.stringContaining('Cumulative Layout Shift')
      );
    });

    it('should generate page load time recommendations', () => {
      const metrics = {
        pageLoadTime: 4000, // Needs improvement
      };

      // Mock the metrics
      Object.assign(performanceMonitor, { metrics });

      const recommendations = performanceMonitor.generateRecommendations();
      expect(recommendations).toContain(
        expect.stringContaining('page load time')
      );
    });

    it('should generate memory usage recommendations', () => {
      const metrics = {
        memoryUsage: 0.9, // High memory usage
      };

      // Mock the metrics
      Object.assign(performanceMonitor, { metrics });

      const recommendations = performanceMonitor.generateRecommendations();
      expect(recommendations).toContain(
        expect.stringContaining('memory usage')
      );
    });

    it('should generate bundle size recommendations', () => {
      const metrics = {
        bundleSize: 3.5, // Large bundle
      };

      // Mock the metrics
      Object.assign(performanceMonitor, { metrics });

      const recommendations = performanceMonitor.generateRecommendations();
      expect(recommendations).toContain(
        expect.stringContaining('bundle size')
      );
    });
  });

  describe('Performance Report Generation', () => {
    it('should generate comprehensive performance report', () => {
      const metrics = {
        lcp: 2000,
        fid: 50,
        cls: 0.05,
        pageLoadTime: 2500,
        memoryUsage: 0.6,
      };

      // Mock the metrics
      Object.assign(performanceMonitor, { metrics });

      const report = performanceMonitor.generateReport();

      expect(report).toHaveProperty('timestamp');
      expect(report).toHaveProperty('url');
      expect(report).toHaveProperty('userAgent');
      expect(report).toHaveProperty('metrics');
      expect(report).toHaveProperty('score');
      expect(report).toHaveProperty('recommendations');

      expect(report.metrics).toEqual(metrics);
      expect(report.score).toBeGreaterThan(0);
      expect(Array.isArray(report.recommendations)).toBe(true);
    });

    it('should include current URL in report', () => {
      // Mock window.location
      Object.defineProperty(window, 'location', {
        value: {
          href: 'https://proofoffit.com/dashboard',
        },
        writable: true,
      });

      const report = performanceMonitor.generateReport();
      expect(report.url).toBe('https://proofoffit.com/dashboard');
    });

    it('should include user agent in report', () => {
      const report = performanceMonitor.generateReport();
      expect(report.userAgent).toBe(navigator.userAgent);
    });
  });

  describe('Performance Measurement Utilities', () => {
    it('should measure async operations', async () => {
      const mockAsyncOperation = vi.fn().mockResolvedValue('result');

      const result = await measureAsync('test-async', mockAsyncOperation);

      expect(result).toBe('result');
      expect(mockPerformance.mark).toHaveBeenCalledWith('test-async-start');
      expect(mockPerformance.mark).toHaveBeenCalledWith('test-async-end');
      expect(mockPerformance.measure).toHaveBeenCalledWith(
        'test-async',
        'test-async-start',
        'test-async-end'
      );
    });

    it('should measure sync operations', () => {
      const mockSyncOperation = vi.fn().mockReturnValue('result');

      const result = measureSync('test-sync', mockSyncOperation);

      expect(result).toBe('result');
      expect(mockPerformance.mark).toHaveBeenCalledWith('test-sync-start');
      expect(mockPerformance.mark).toHaveBeenCalledWith('test-sync-end');
      expect(mockPerformance.measure).toHaveBeenCalledWith(
        'test-sync',
        'test-sync-start',
        'test-sync-end'
      );
    });

    it('should handle errors in async measurements', async () => {
      const mockAsyncOperation = vi.fn().mockRejectedValue(new Error('Test error'));

      await expect(measureAsync('test-error', mockAsyncOperation)).rejects.toThrow('Test error');

      expect(mockPerformance.mark).toHaveBeenCalledWith('test-error-start');
      expect(mockPerformance.mark).toHaveBeenCalledWith('test-error-end');
    });

    it('should handle errors in sync measurements', () => {
      const mockSyncOperation = vi.fn().mockImplementation(() => {
        throw new Error('Test error');
      });

      expect(() => measureSync('test-error', mockSyncOperation)).toThrow('Test error');

      expect(mockPerformance.mark).toHaveBeenCalledWith('test-error-start');
      expect(mockPerformance.mark).toHaveBeenCalledWith('test-error-end');
    });
  });

  describe('Performance Thresholds', () => {
    it('should identify good LCP performance', () => {
      const metrics = { lcp: 2000 };
      Object.assign(performanceMonitor, { metrics });

      const score = performanceMonitor.calculateScore();
      expect(score).toBeGreaterThan(80);
    });

    it('should identify poor LCP performance', () => {
      const metrics = { lcp: 5000 };
      Object.assign(performanceMonitor, { metrics });

      const score = performanceMonitor.calculateScore();
      expect(score).toBeLessThan(70);
    });

    it('should identify good FID performance', () => {
      const metrics = { fid: 50 };
      Object.assign(performanceMonitor, { metrics });

      const score = performanceMonitor.calculateScore();
      expect(score).toBeGreaterThan(80);
    });

    it('should identify poor FID performance', () => {
      const metrics = { fid: 400 };
      Object.assign(performanceMonitor, { metrics });

      const score = performanceMonitor.calculateScore();
      expect(score).toBeLessThan(75);
    });

    it('should identify good CLS performance', () => {
      const metrics = { cls: 0.05 };
      Object.assign(performanceMonitor, { metrics });

      const score = performanceMonitor.calculateScore();
      expect(score).toBeGreaterThan(80);
    });

    it('should identify poor CLS performance', () => {
      const metrics = { cls: 0.3 };
      Object.assign(performanceMonitor, { metrics });

      const score = performanceMonitor.calculateScore();
      expect(score).toBeLessThan(75);
    });
  });

  describe('Memory Monitoring', () => {
    it('should track memory usage when available', () => {
      // Mock performance.memory
      Object.defineProperty(mockPerformance, 'memory', {
        value: {
          usedJSHeapSize: 50 * 1024 * 1024, // 50MB
          totalJSHeapSize: 100 * 1024 * 1024, // 100MB
        },
        writable: true,
      });

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.memoryUsage).toBe(0.5);
    });

    it('should handle missing memory API gracefully', () => {
      // Remove memory property
      delete (mockPerformance as any).memory;

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.memoryUsage).toBeUndefined();
    });
  });

  describe('Network Monitoring', () => {
    it('should track network information when available', () => {
      // Mock navigator.connection
      Object.defineProperty(navigator, 'connection', {
        value: {
          rtt: 100,
          downlink: 10,
        },
        writable: true,
      });

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.networkLatency).toBe(100);
      expect(metrics.bandwidth).toBe(10);
    });

    it('should handle missing connection API gracefully', () => {
      // Remove connection property
      delete (navigator as any).connection;

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.networkLatency).toBeUndefined();
      expect(metrics.bandwidth).toBeUndefined();
    });
  });
});
