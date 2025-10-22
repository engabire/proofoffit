/**
 * Bundle Analysis and Optimization
 * Analyzes bundle size and provides optimization recommendations
 */

export interface BundleAnalysis {
    totalSize: number;
    gzippedSize: number;
    chunks: ChunkAnalysis[];
    modules: ModuleAnalysis[];
    duplicates: DuplicateAnalysis[];
    recommendations: BundleRecommendation[];
}

export interface ChunkAnalysis {
    name: string;
    size: number;
    gzippedSize: number;
    modules: number;
    dependencies: string[];
    type: "initial" | "async" | "vendor" | "common";
}

export interface ModuleAnalysis {
    name: string;
    size: number;
    gzippedSize: number;
    chunks: string[];
    dependencies: string[];
    type: "js" | "css" | "asset";
    isDuplicate: boolean;
}

export interface DuplicateAnalysis {
    module: string;
    chunks: string[];
    totalSize: number;
    wastedSize: number;
}

export interface BundleRecommendation {
    type: "critical" | "high" | "medium" | "low";
    category:
        | "size"
        | "duplicates"
        | "splitting"
        | "tree-shaking"
        | "compression";
    title: string;
    description: string;
    impact: string;
    effort: "low" | "medium" | "high";
    estimatedSavings: number;
    implementation: string[];
}

class BundleAnalyzer {
    private analysis: BundleAnalysis | null = null;
    private thresholds = {
        totalSize: 2 * 1024 * 1024, // 2MB
        gzippedSize: 500 * 1024, // 500KB
        chunkSize: 500 * 1024, // 500KB per chunk
        duplicateThreshold: 0.1, // 10% duplicate threshold
    };

    /**
     * Analyze bundle composition
     */
    public async analyzeBundle(): Promise<BundleAnalysis> {
        // In a real implementation, this would analyze actual bundle files
        // For now, we'll generate mock analysis data
        const analysis = this.generateMockAnalysis();

        this.analysis = analysis;
        return analysis;
    }

    /**
     * Generate mock analysis data for demonstration
     */
    private generateMockAnalysis(): BundleAnalysis {
        const chunks: ChunkAnalysis[] = [
            {
                name: "main",
                size: 1.2 * 1024 * 1024, // 1.2MB
                gzippedSize: 350 * 1024, // 350KB
                modules: 45,
                dependencies: ["react", "react-dom", "next"],
                type: "initial",
            },
            {
                name: "vendor",
                size: 800 * 1024, // 800KB
                gzippedSize: 200 * 1024, // 200KB
                modules: 25,
                dependencies: ["lodash", "moment", "axios"],
                type: "vendor",
            },
            {
                name: "pages/dashboard",
                size: 400 * 1024, // 400KB
                gzippedSize: 120 * 1024, // 120KB
                modules: 15,
                dependencies: ["chart.js", "date-fns"],
                type: "async",
            },
            {
                name: "pages/analytics",
                size: 600 * 1024, // 600KB
                gzippedSize: 180 * 1024, // 180KB
                modules: 20,
                dependencies: ["d3", "recharts"],
                type: "async",
            },
        ];

        const modules: ModuleAnalysis[] = [
            {
                name: "react",
                size: 150 * 1024,
                gzippedSize: 45 * 1024,
                chunks: ["main", "vendor"],
                dependencies: [],
                type: "js",
                isDuplicate: true,
            },
            {
                name: "lodash",
                size: 200 * 1024,
                gzippedSize: 60 * 1024,
                chunks: ["vendor"],
                dependencies: [],
                type: "js",
                isDuplicate: false,
            },
            {
                name: "chart.js",
                size: 300 * 1024,
                gzippedSize: 90 * 1024,
                chunks: ["pages/dashboard"],
                dependencies: [],
                type: "js",
                isDuplicate: false,
            },
            {
                name: "styles.css",
                size: 100 * 1024,
                gzippedSize: 25 * 1024,
                chunks: ["main"],
                dependencies: [],
                type: "css",
                isDuplicate: false,
            },
        ];

        const duplicates: DuplicateAnalysis[] = [
            {
                module: "react",
                chunks: ["main", "vendor"],
                totalSize: 300 * 1024,
                wastedSize: 150 * 1024,
            },
        ];

        const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
        const gzippedSize = chunks.reduce(
            (sum, chunk) => sum + chunk.gzippedSize,
            0,
        );

        const recommendations = this.generateRecommendations(
            chunks,
            modules,
            duplicates,
        );

        return {
            totalSize,
            gzippedSize,
            chunks,
            modules,
            duplicates,
            recommendations,
        };
    }

    /**
     * Generate optimization recommendations
     */
    private generateRecommendations(
        chunks: ChunkAnalysis[],
        modules: ModuleAnalysis[],
        duplicates: DuplicateAnalysis[],
    ): BundleRecommendation[] {
        const recommendations: BundleRecommendation[] = [];

        // Check total bundle size
        const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
        if (totalSize > this.thresholds.totalSize) {
            recommendations.push({
                type: "critical",
                category: "size",
                title: "Bundle Size Too Large",
                description: `Total bundle size is ${
                    this.formatBytes(totalSize)
                }, exceeding the 2MB threshold.`,
                impact: "High impact on initial load time and user experience",
                effort: "high",
                estimatedSavings: totalSize * 0.3, // 30% reduction
                implementation: [
                    "Implement code splitting for route-based chunks",
                    "Use dynamic imports for heavy components",
                    "Remove unused dependencies",
                    "Optimize images and assets",
                ],
            });
        }

        // Check for large chunks
        const largeChunks = chunks.filter((chunk) =>
            chunk.size > this.thresholds.chunkSize
        );
        if (largeChunks.length > 0) {
            recommendations.push({
                type: "high",
                category: "splitting",
                title: "Large Chunks Detected",
                description:
                    `${largeChunks.length} chunks exceed the 500KB threshold.`,
                impact: "Delays in loading specific features",
                effort: "medium",
                estimatedSavings: largeChunks.reduce(
                    (sum, chunk) => sum + chunk.size * 0.2,
                    0,
                ),
                implementation: [
                    "Split large chunks into smaller, focused chunks",
                    "Extract vendor libraries into separate chunks",
                    "Use dynamic imports for non-critical features",
                ],
            });
        }

        // Check for duplicates
        if (duplicates.length > 0) {
            const totalWasted = duplicates.reduce(
                (sum, dup) => sum + dup.wastedSize,
                0,
            );
            recommendations.push({
                type: "high",
                category: "duplicates",
                title: "Duplicate Dependencies",
                description:
                    `${duplicates.length} modules are duplicated across chunks, wasting ${
                        this.formatBytes(totalWasted)
                    }.`,
                impact: "Increased bundle size and slower loading",
                effort: "medium",
                estimatedSavings: totalWasted,
                implementation: [
                    "Configure webpack to deduplicate common dependencies",
                    "Use webpack-bundle-analyzer to identify duplicates",
                    "Move common dependencies to a shared chunk",
                ],
            });
        }

        // Check for unused dependencies
        const potentiallyUnused = modules.filter((module) =>
            module.dependencies.length === 0 && module.size > 50 * 1024
        );
        if (potentiallyUnused.length > 0) {
            recommendations.push({
                type: "medium",
                category: "tree-shaking",
                title: "Potentially Unused Dependencies",
                description:
                    `${potentiallyUnused.length} large modules have no dependencies and might be unused.`,
                impact: "Unnecessary code in bundle",
                effort: "low",
                estimatedSavings: potentiallyUnused.reduce(
                    (sum, module) => sum + module.size * 0.5,
                    0,
                ),
                implementation: [
                    "Run bundle analyzer to identify unused code",
                    "Remove unused imports and dependencies",
                    "Enable tree shaking in build configuration",
                ],
            });
        }

        // General optimization recommendations
        recommendations.push({
            type: "medium",
            category: "compression",
            title: "Enable Advanced Compression",
            description:
                "Implement Brotli compression and optimize asset delivery.",
            impact: "Reduced transfer size and faster loading",
            effort: "low",
            estimatedSavings: totalSize * 0.15, // 15% additional compression
            implementation: [
                "Enable Brotli compression on server",
                "Optimize images with WebP/AVIF formats",
                "Minify CSS and JavaScript",
                "Use CDN for static assets",
            ],
        });

        return recommendations.sort((a, b) => {
            const priority = { critical: 0, high: 1, medium: 2, low: 3 };
            return priority[a.type] - priority[b.type];
        });
    }

    /**
     * Get current analysis
     */
    public getAnalysis(): BundleAnalysis | null {
        return this.analysis;
    }

    /**
     * Get bundle size summary
     */
    public getSizeSummary(): {
        total: number;
        gzipped: number;
        savings: number;
        compressionRatio: number;
    } {
        if (!this.analysis) {
            return { total: 0, gzipped: 0, savings: 0, compressionRatio: 0 };
        }

        const { totalSize, gzippedSize } = this.analysis;
        const savings = totalSize - gzippedSize;
        const compressionRatio = gzippedSize / totalSize;

        return {
            total: totalSize,
            gzipped: gzippedSize,
            savings,
            compressionRatio,
        };
    }

    /**
     * Get chunk analysis
     */
    public getChunkAnalysis(): ChunkAnalysis[] {
        return this.analysis?.chunks || [];
    }

    /**
     * Get duplicate analysis
     */
    public getDuplicateAnalysis(): DuplicateAnalysis[] {
        return this.analysis?.duplicates || [];
    }

    /**
     * Get recommendations
     */
    public getRecommendations(): BundleRecommendation[] {
        return this.analysis?.recommendations || [];
    }

    /**
     * Calculate potential savings
     */
    public calculatePotentialSavings(): number {
        if (!this.analysis) return 0;

        return this.analysis.recommendations.reduce((total, rec) => {
            return total + rec.estimatedSavings;
        }, 0);
    }

    /**
     * Format bytes to human readable format
     */
    private formatBytes(bytes: number): string {
        if (bytes === 0) return "0 Bytes";

        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }

    /**
     * Update thresholds
     */
    public updateThresholds(
        newThresholds: Partial<typeof this.thresholds>,
    ): void {
        this.thresholds = { ...this.thresholds, ...newThresholds };
    }

    /**
     * Export analysis to JSON
     */
    public exportAnalysis(): string {
        if (!this.analysis) {
            throw new Error(
                "No analysis available. Run analyzeBundle() first.",
            );
        }

        return JSON.stringify(this.analysis, null, 2);
    }

    /**
     * Generate bundle report
     */
    public generateReport(): string {
        if (!this.analysis) {
            return "No analysis available. Run analyzeBundle() first.";
        }

        const { totalSize, gzippedSize, chunks, duplicates, recommendations } =
            this.analysis;
        const savings = totalSize - gzippedSize;
        const compressionRatio = (gzippedSize / totalSize) * 100;

        let report = `# Bundle Analysis Report\n\n`;
        report += `## Summary\n`;
        report += `- **Total Size:** ${this.formatBytes(totalSize)}\n`;
        report += `- **Gzipped Size:** ${this.formatBytes(gzippedSize)}\n`;
        report += `- **Compression Savings:** ${this.formatBytes(savings)} (${
            compressionRatio.toFixed(1)
        }%)\n`;
        report += `- **Number of Chunks:** ${chunks.length}\n`;
        report += `- **Duplicate Modules:** ${duplicates.length}\n\n`;

        report += `## Chunks\n`;
        chunks.forEach((chunk) => {
            report += `- **${chunk.name}:** ${this.formatBytes(chunk.size)} (${
                this.formatBytes(chunk.gzippedSize)
            } gzipped)\n`;
        });

        if (duplicates.length > 0) {
            report += `\n## Duplicates\n`;
            duplicates.forEach((dup) => {
                report += `- **${dup.module}:** ${
                    this.formatBytes(dup.wastedSize)
                } wasted across ${dup.chunks.length} chunks\n`;
            });
        }

        report += `\n## Recommendations\n`;
        recommendations.forEach((rec, index) => {
            report += `${
                index + 1
            }. **${rec.title}** (${rec.type.toUpperCase()})\n`;
            report += `   - Impact: ${rec.impact}\n`;
            report += `   - Estimated Savings: ${
                this.formatBytes(rec.estimatedSavings)
            }\n`;
            report += `   - Implementation:\n`;
            rec.implementation.forEach((impl) => {
                report += `     - ${impl}\n`;
            });
            report += `\n`;
        });

        return report;
    }
}

// Global bundle analyzer instance
export const bundleAnalyzer = new BundleAnalyzer();

// Utility functions
export const bundleUtils = {
    /**
     * Format bytes to human readable format
     */
    formatBytes(bytes: number): string {
        if (bytes === 0) return "0 Bytes";

        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    },

    /**
     * Calculate compression ratio
     */
    calculateCompressionRatio(original: number, compressed: number): number {
        return (compressed / original) * 100;
    },

    /**
     * Get performance score based on bundle size
     */
    getPerformanceScore(totalSize: number, gzippedSize: number): number {
        let score = 100;

        // Deduct points for large total size
        if (totalSize > 2 * 1024 * 1024) score -= 30; // 2MB+
        else if (totalSize > 1 * 1024 * 1024) score -= 15; // 1MB+

        // Deduct points for poor compression
        const compressionRatio = gzippedSize / totalSize;
        if (compressionRatio > 0.5) score -= 20; // >50% of original
        else if (compressionRatio > 0.3) score -= 10; // >30% of original

        return Math.max(0, score);
    },

    /**
     * Generate optimization checklist
     */
    generateOptimizationChecklist(): string[] {
        return [
            "Enable code splitting for routes",
            "Implement lazy loading for components",
            "Remove unused dependencies",
            "Optimize images and assets",
            "Enable tree shaking",
            "Configure webpack for optimal bundling",
            "Use dynamic imports for heavy libraries",
            "Implement service worker caching",
            "Enable compression (gzip/brotli)",
            "Use CDN for static assets",
        ];
    },
};
