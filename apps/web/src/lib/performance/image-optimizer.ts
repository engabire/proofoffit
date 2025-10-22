/**
 * Image Optimization Manager
 * Handles image optimization, lazy loading, and responsive images
 */

export interface ImageOptimizationConfig {
    quality: number; // 0-100
    format: "webp" | "avif" | "jpeg" | "png";
    lazy: boolean;
    placeholder: boolean;
    responsive: boolean;
    sizes: string[];
}

export interface OptimizedImage {
    src: string;
    srcSet?: string;
    sizes?: string;
    alt: string;
    width?: number;
    height?: number;
    placeholder?: string;
    loading?: "lazy" | "eager";
}

export interface ImageMetrics {
    originalSize: number;
    optimizedSize: number;
    compressionRatio: number;
    loadTime: number;
    format: string;
}

class ImageOptimizer {
    private config: ImageOptimizationConfig;
    private metrics: Map<string, ImageMetrics> = new Map();
    private intersectionObserver?: IntersectionObserver;

    constructor(config: Partial<ImageOptimizationConfig> = {}) {
        this.config = {
            quality: 85,
            format: "webp",
            lazy: true,
            placeholder: true,
            responsive: true,
            sizes: ["320w", "640w", "1024w", "1280w", "1920w"],
            ...config,
        };

        this.initializeIntersectionObserver();
    }

    /**
     * Optimize image URL for different formats and sizes
     */
    public optimizeImage(
        src: string,
        alt: string,
        width?: number,
        height?: number,
        options: Partial<ImageOptimizationConfig> = {},
    ): OptimizedImage {
        const config = { ...this.config, ...options };
        const optimizedSrc = this.generateOptimizedUrl(src, config);

        const result: OptimizedImage = {
            src: optimizedSrc,
            alt,
            width,
            height,
            loading: config.lazy ? "lazy" : "eager",
        };

        // Generate responsive srcSet if enabled
        if (config.responsive && config.sizes.length > 1) {
            result.srcSet = this.generateSrcSet(src, config);
            result.sizes = this.generateSizes(config.sizes);
        }

        // Generate placeholder if enabled
        if (config.placeholder) {
            result.placeholder = this.generatePlaceholder(width, height);
        }

        return result;
    }

    /**
     * Generate optimized URL for image
     */
    private generateOptimizedUrl(
        src: string,
        config: ImageOptimizationConfig,
    ): string {
        // In a real implementation, this would use an image optimization service
        // like Cloudinary, ImageKit, or Next.js Image Optimization

        const url = new URL(src);

        // Add optimization parameters
        url.searchParams.set("q", config.quality.toString());
        url.searchParams.set("f", config.format);

        if (config.quality < 100) {
            url.searchParams.set("auto", "compress");
        }

        return url.toString();
    }

    /**
     * Generate srcSet for responsive images
     */
    private generateSrcSet(
        src: string,
        config: ImageOptimizationConfig,
    ): string {
        return config.sizes
            .map((size) => {
                const width = size.replace("w", "");
                const optimizedSrc = this.generateOptimizedUrl(src, config);
                const url = new URL(optimizedSrc);
                url.searchParams.set("w", width);
                const finalSrc = url.toString();
                return `${finalSrc} ${size}`;
            })
            .join(", ");
    }

    /**
     * Generate sizes attribute for responsive images
     */
    private generateSizes(sizes: string[]): string {
        const breakpoints = [
            "(max-width: 320px)",
            "(max-width: 640px)",
            "(max-width: 1024px)",
            "(max-width: 1280px)",
        ];

        return breakpoints
            .map((breakpoint, index) => {
                const size = sizes[index] || sizes[sizes.length - 1];
                return `${breakpoint} ${size}`;
            })
            .join(", ") + `, ${sizes[sizes.length - 1]}`;
    }

    /**
     * Generate placeholder for image
     */
    private generatePlaceholder(width?: number, height?: number): string {
        if (!width || !height) {
            return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+";
        }

        // Generate a simple SVG placeholder
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f3f4f6"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="system-ui, sans-serif" font-size="14">
                    Loading...
                </text>
            </svg>
        `;

        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    /**
     * Initialize intersection observer for lazy loading
     */
    private initializeIntersectionObserver(): void {
        if (typeof window === "undefined" || !this.config.lazy) return;

        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target as HTMLImageElement;
                        this.loadImage(img);
                        this.intersectionObserver?.unobserve(img);
                    }
                });
            },
            {
                rootMargin: "50px",
                threshold: 0.1,
            },
        );
    }

    /**
     * Load image and track metrics
     */
    private loadImage(img: HTMLImageElement): void {
        const startTime = performance.now();
        const originalSrc = img.dataset.originalSrc || img.src;

        img.onload = () => {
            const loadTime = performance.now() - startTime;
            this.trackImageMetrics(originalSrc, loadTime);
        };

        img.onerror = () => {
            console.warn(`Failed to load image: ${originalSrc}`);
        };

        // Set the actual src to trigger loading
        if (img.dataset.originalSrc) {
            img.src = img.dataset.originalSrc;
            delete img.dataset.originalSrc;
        }
    }

    /**
     * Track image loading metrics
     */
    private trackImageMetrics(src: string, loadTime: number): void {
        // In a real implementation, you would get actual file sizes
        const mockOriginalSize = Math.random() * 1000000; // 0-1MB
        const mockOptimizedSize = mockOriginalSize * 0.3; // 70% compression

        const metrics: ImageMetrics = {
            originalSize: mockOriginalSize,
            optimizedSize: mockOptimizedSize,
            compressionRatio: mockOptimizedSize / mockOriginalSize,
            loadTime,
            format: this.config.format,
        };

        this.metrics.set(src, metrics);
    }

    /**
     * Get image metrics
     */
    public getImageMetrics(src: string): ImageMetrics | undefined {
        return this.metrics.get(src);
    }

    /**
     * Get all image metrics
     */
    public getAllMetrics(): Map<string, ImageMetrics> {
        return new Map(this.metrics);
    }

    /**
     * Get performance summary
     */
    public getPerformanceSummary(): {
        totalImages: number;
        averageLoadTime: number;
        averageCompressionRatio: number;
        totalSavings: number;
    } {
        const metrics = Array.from(this.metrics.values());

        if (metrics.length === 0) {
            return {
                totalImages: 0,
                averageLoadTime: 0,
                averageCompressionRatio: 0,
                totalSavings: 0,
            };
        }

        const totalImages = metrics.length;
        const averageLoadTime =
            metrics.reduce((sum, m) => sum + m.loadTime, 0) / totalImages;
        const averageCompressionRatio =
            metrics.reduce((sum, m) => sum + m.compressionRatio, 0) /
            totalImages;
        const totalSavings = metrics.reduce(
            (sum, m) => sum + (m.originalSize - m.optimizedSize),
            0,
        );

        return {
            totalImages,
            averageLoadTime,
            averageCompressionRatio,
            totalSavings,
        };
    }

    /**
     * Preload critical images
     */
    public preloadImages(urls: string[]): void {
        urls.forEach((url) => {
            const link = document.createElement("link");
            link.rel = "preload";
            link.as = "image";
            link.href = this.generateOptimizedUrl(url, this.config);
            document.head.appendChild(link);
        });
    }

    /**
     * Create lazy-loaded image element
     */
    public createLazyImage(
        src: string,
        alt: string,
        width?: number,
        height?: number,
    ): HTMLImageElement {
        const img = document.createElement("img");
        const optimized = this.optimizeImage(src, alt, width, height);

        img.alt = optimized.alt;
        img.width = optimized.width || 0;
        img.height = optimized.height || 0;
        img.loading = "lazy";
        img.dataset.originalSrc = optimized.src;

        // Set placeholder
        if (optimized.placeholder) {
            img.src = optimized.placeholder;
        }

        // Set srcSet if available
        if (optimized.srcSet) {
            img.srcset = optimized.srcSet;
            if (optimized.sizes) {
                img.sizes = optimized.sizes;
            }
        }

        // Observe for lazy loading
        if (this.intersectionObserver) {
            this.intersectionObserver.observe(img);
        }

        return img;
    }

    /**
     * Update configuration
     */
    public updateConfig(newConfig: Partial<ImageOptimizationConfig>): void {
        this.config = { ...this.config, ...newConfig };

        if (newConfig.lazy !== undefined) {
            this.initializeIntersectionObserver();
        }
    }

    /**
     * Cleanup resources
     */
    public cleanup(): void {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        this.metrics.clear();
    }
}

// Global image optimizer instance
export const imageOptimizer = new ImageOptimizer();

// React hook for image optimization
export function useImageOptimization() {
    return {
        optimizeImage: imageOptimizer.optimizeImage.bind(imageOptimizer),
        getMetrics: imageOptimizer.getImageMetrics.bind(imageOptimizer),
        getSummary: imageOptimizer.getPerformanceSummary.bind(imageOptimizer),
        preloadImages: imageOptimizer.preloadImages.bind(imageOptimizer),
    };
}

// Utility functions
export const imageUtils = {
    /**
     * Check if image format is supported
     */
    isFormatSupported(format: string): boolean {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return false;

        switch (format) {
            case "webp":
                return canvas.toDataURL("image/webp").indexOf(
                    "data:image/webp",
                ) === 0;
            case "avif":
                return canvas.toDataURL("image/avif").indexOf(
                    "data:image/avif",
                ) === 0;
            default:
                return true;
        }
    },

    /**
     * Get optimal image format based on browser support
     */
    getOptimalFormat(): "webp" | "avif" | "jpeg" {
        if (this.isFormatSupported("avif")) return "avif";
        if (this.isFormatSupported("webp")) return "webp";
        return "jpeg";
    },

    /**
     * Calculate image dimensions for responsive design
     */
    calculateResponsiveDimensions(
        originalWidth: number,
        originalHeight: number,
        maxWidth: number,
    ): { width: number; height: number } {
        const ratio = originalHeight / originalWidth;
        const width = Math.min(originalWidth, maxWidth);
        const height = Math.round(width * ratio);

        return { width, height };
    },

    /**
     * Generate blurhash placeholder
     */
    generateBlurhash(width: number, height: number): string {
        // This would integrate with a blurhash library
        // For now, return a simple base64 placeholder
        return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+";
    },
};
