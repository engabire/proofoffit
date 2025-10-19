/**
 * Enhanced Rate Limiting with CSV & URL Sanitization
 *
 * Implements comprehensive rate limiting with input sanitization,
 * CSV upload protection, and URL validation for security.
 */

import { NextRequest, NextResponse } from "next/server";
import {
    checkRateLimit,
    getRateLimitKey,
    RateLimitError,
} from "../../apps/web/src/lib/rate-limit";

export interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    keyGenerator?: (req: NextRequest) => string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
    message?: string;
}

export interface SanitizationConfig {
    enableCSVSanitization: boolean;
    enableURLSanitization: boolean;
    enableInputValidation: boolean;
    maxFileSize: number;
    allowedFileTypes: string[];
    blockedPatterns: RegExp[];
}

export class EnhancedRateLimit {
    private readonly config: RateLimitConfig;
    private readonly sanitizationConfig: SanitizationConfig;

    constructor(
        config: RateLimitConfig,
        sanitizationConfig?: Partial<SanitizationConfig>,
    ) {
        this.config = {
            message: "Too many requests, please try again later.",
            ...config,
        };

        this.sanitizationConfig = {
            enableCSVSanitization: true,
            enableURLSanitization: true,
            enableInputValidation: true,
            maxFileSize: 10 * 1024 * 1024, // 10MB
            allowedFileTypes: [".csv", ".txt", ".json"],
            blockedPatterns: [
                /^=/, // Excel formula injection
                /^\+/, // Excel formula injection
                /^-/, // Excel formula injection
                /^@/, // Excel formula injection
                /javascript:/i, // JavaScript injection
                /data:text\/html/i, // HTML injection
                /vbscript:/i, // VBScript injection
                /onload=/i, // Event handler injection
                /onerror=/i, // Event handler injection
                /<script/i, // Script tag injection
                /<\/script>/i, // Script tag injection
            ],
            ...sanitizationConfig,
        };
    }

    /**
     * Main middleware function that combines rate limiting and sanitization
     */
    async middleware(request: NextRequest): Promise<NextResponse | null> {
        try {
            // Step 1: Rate limiting check
            const rateLimitResult = await this.checkRateLimit(request);
            if (rateLimitResult) {
                return rateLimitResult;
            }

            // Step 2: Input sanitization
            const sanitizationResult = await this.sanitizeInput(request);
            if (sanitizationResult) {
                return sanitizationResult;
            }

            // Step 3: Add rate limit headers to response
            return this.addRateLimitHeaders(request);
        } catch (error) {
            console.error("Rate limit middleware error:", error);
            return NextResponse.json(
                { error: "Internal server error" },
                { status: 500 },
            );
        }
    }

    private async checkRateLimit(
        request: NextRequest,
    ): Promise<NextResponse | null> {
        try {
            const key = this.config.keyGenerator
                ? this.config.keyGenerator(request)
                : getRateLimitKey(request);

            await checkRateLimit(key, {
                windowMs: this.config.windowMs,
                maxRequests: this.config.maxRequests,
            });

            return null; // Rate limit check passed
        } catch (error) {
            if (error instanceof RateLimitError) {
                return NextResponse.json(
                    {
                        error: "Rate limit exceeded",
                        message: this.config.message,
                        retryAfter: Math.ceil(error.retryAfter / 1000),
                    },
                    {
                        status: 429,
                        headers: {
                            "Retry-After": Math.ceil(error.retryAfter / 1000)
                                .toString(),
                            "X-RateLimit-Limit": this.config.maxRequests
                                .toString(),
                            "X-RateLimit-Remaining": "0",
                            "X-RateLimit-Reset": new Date(
                                Date.now() + error.retryAfter,
                            ).toISOString(),
                        },
                    },
                );
            }
            throw error;
        }
    }

    private async sanitizeInput(
        request: NextRequest,
    ): Promise<NextResponse | null> {
        // Check for file uploads
        if (request.method === "POST" && this.isFileUpload(request)) {
            const fileSanitizationResult = await this.sanitizeFileUpload(
                request,
            );
            if (fileSanitizationResult) {
                return fileSanitizationResult;
            }
        }

        // Check for URL parameters
        if (this.sanitizationConfig.enableURLSanitization) {
            const urlSanitizationResult = await this.sanitizeURL(request);
            if (urlSanitizationResult) {
                return urlSanitizationResult;
            }
        }

        // Check for form data
        if (this.sanitizationConfig.enableInputValidation) {
            const formSanitizationResult = await this.sanitizeFormData(request);
            if (formSanitizationResult) {
                return formSanitizationResult;
            }
        }

        return null; // Sanitization passed
    }

    private isFileUpload(request: NextRequest): boolean {
        const contentType = request.headers.get("content-type") || "";
        return contentType.includes("multipart/form-data") ||
            contentType.includes("application/octet-stream");
    }

    private async sanitizeFileUpload(
        request: NextRequest,
    ): Promise<NextResponse | null> {
        try {
            const formData = await request.formData();

            for (const [key, value] of formData.entries()) {
                if (value instanceof File) {
                    // Check file size
                    if (value.size > this.sanitizationConfig.maxFileSize) {
                        return NextResponse.json(
                            {
                                error: "File too large",
                                maxSize: this.sanitizationConfig.maxFileSize,
                            },
                            { status: 413 },
                        );
                    }

                    // Check file type
                    const fileExtension = this.getFileExtension(value.name);
                    if (
                        !this.sanitizationConfig.allowedFileTypes.includes(
                            fileExtension,
                        )
                    ) {
                        return NextResponse.json(
                            {
                                error: "File type not allowed",
                                allowedTypes:
                                    this.sanitizationConfig.allowedFileTypes,
                            },
                            { status: 400 },
                        );
                    }

                    // Sanitize CSV content
                    if (
                        this.sanitizationConfig.enableCSVSanitization &&
                        fileExtension === ".csv"
                    ) {
                        const sanitizationResult = await this
                            .sanitizeCSVContent(value);
                        if (sanitizationResult) {
                            return sanitizationResult;
                        }
                    }
                }
            }

            return null; // File sanitization passed
        } catch (error) {
            return NextResponse.json(
                { error: "File processing error" },
                { status: 400 },
            );
        }
    }

    private async sanitizeCSVContent(file: File): Promise<NextResponse | null> {
        try {
            const content = await file.text();
            const lines = content.split("\n");

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];

                // Check for blocked patterns
                for (const pattern of this.sanitizationConfig.blockedPatterns) {
                    if (pattern.test(line)) {
                        return NextResponse.json(
                            {
                                error: "Malicious content detected",
                                message:
                                    "CSV contains potentially harmful content",
                                line: i + 1,
                                pattern: pattern.toString(),
                            },
                            { status: 400 },
                        );
                    }
                }

                // Sanitize the line
                const sanitizedLine = this.sanitizeCSVLine(line);
                if (sanitizedLine !== line) {
                    lines[i] = sanitizedLine;
                }
            }

            return null; // CSV sanitization passed
        } catch (error) {
            return NextResponse.json(
                { error: "CSV processing error" },
                { status: 400 },
            );
        }
    }

    private sanitizeCSVLine(line: string): string {
        // Remove potentially dangerous characters and patterns
        return line
            .replace(/^[=+\-@]/, "") // Remove formula injection prefixes
            .replace(/javascript:/gi, "") // Remove JavaScript URLs
            .replace(/vbscript:/gi, "") // Remove VBScript URLs
            .replace(/data:text\/html/gi, "") // Remove HTML data URLs
            .replace(/<script[^>]*>.*?<\/script>/gi, "") // Remove script tags
            .replace(/on\w+\s*=/gi, "") // Remove event handlers
            .trim();
    }

    private async sanitizeURL(
        request: NextRequest,
    ): Promise<NextResponse | null> {
        const url = request.nextUrl;

        // Check for dangerous URL patterns
        const dangerousPatterns = [
            /javascript:/i,
            /data:text\/html/i,
            /vbscript:/i,
            /file:\/\//i,
            /ftp:\/\//i,
            /localhost/i,
            /127\.0\.0\.1/i,
            /169\.254\./i, // Link-local addresses
            /0\.0\.0\.0/i,
        ];

        const fullUrl = url.toString();
        for (const pattern of dangerousPatterns) {
            if (pattern.test(fullUrl)) {
                return NextResponse.json(
                    {
                        error: "Invalid URL",
                        message: "URL contains potentially dangerous content",
                    },
                    { status: 400 },
                );
            }
        }

        // Validate URL parameters
        for (const [key, value] of url.searchParams.entries()) {
            const sanitizationResult = this.sanitizeParameter(key, value);
            if (sanitizationResult) {
                return sanitizationResult;
            }
        }

        return null; // URL sanitization passed
    }

    private async sanitizeFormData(
        request: NextRequest,
    ): Promise<NextResponse | null> {
        try {
            // Check Content-Type
            const contentType = request.headers.get("content-type") || "";

            if (contentType.includes("application/json")) {
                const body = await request.json();
                const sanitizationResult = this.sanitizeObject(body);
                if (sanitizationResult) {
                    return sanitizationResult;
                }
            } else if (
                contentType.includes("application/x-www-form-urlencoded")
            ) {
                const formData = await request.formData();
                for (const [key, value] of formData.entries()) {
                    if (typeof value === "string") {
                        const sanitizationResult = this.sanitizeParameter(
                            key,
                            value,
                        );
                        if (sanitizationResult) {
                            return sanitizationResult;
                        }
                    }
                }
            }

            return null; // Form data sanitization passed
        } catch (error) {
            return NextResponse.json(
                { error: "Form data processing error" },
                { status: 400 },
            );
        }
    }

    private sanitizeObject(obj: any): NextResponse | null {
        if (typeof obj === "string") {
            return this.sanitizeParameter("value", obj);
        }

        if (Array.isArray(obj)) {
            for (const item of obj) {
                const result = this.sanitizeObject(item);
                if (result) return result;
            }
        }

        if (obj && typeof obj === "object") {
            for (const [key, value] of Object.entries(obj)) {
                const result = this.sanitizeParameter(key, String(value));
                if (result) return result;
            }
        }

        return null;
    }

    private sanitizeParameter(key: string, value: string): NextResponse | null {
        // Check for blocked patterns
        for (const pattern of this.sanitizationConfig.blockedPatterns) {
            if (pattern.test(value)) {
                return NextResponse.json(
                    {
                        error: "Invalid input",
                        message: "Input contains potentially harmful content",
                        field: key,
                        pattern: pattern.toString(),
                    },
                    { status: 400 },
                );
            }
        }

        // Check for SQL injection patterns
        const sqlPatterns = [
            /('|(\\')|(;)|(\\)|(\|))/i,
            /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
        ];

        for (const pattern of sqlPatterns) {
            if (pattern.test(value)) {
                return NextResponse.json(
                    {
                        error: "Invalid input",
                        message:
                            "Input contains potentially harmful SQL content",
                        field: key,
                    },
                    { status: 400 },
                );
            }
        }

        return null; // Parameter sanitization passed
    }

    private getFileExtension(filename: string): string {
        const lastDot = filename.lastIndexOf(".");
        return lastDot !== -1 ? filename.substring(lastDot).toLowerCase() : "";
    }

    private addRateLimitHeaders(request: NextRequest): NextResponse | null {
        // This would be handled by the actual response in a real implementation
        // For now, we just return null to continue processing
        return null;
    }
}

// Predefined rate limit configurations
export const RATE_LIMIT_CONFIGS = {
    API_GENERAL: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 100,
        message: "API rate limit exceeded",
    },
    FILE_UPLOAD: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 10,
        message: "File upload rate limit exceeded",
    },
    JOB_SEARCH: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 20,
        message: "Job search rate limit exceeded",
    },
    AUTH_ATTEMPTS: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 5,
        message: "Authentication rate limit exceeded",
    },
    ADMIN_ACTIONS: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 30,
        message: "Admin action rate limit exceeded",
    },
};

// Middleware factory functions
export function createRateLimitMiddleware(
    config: RateLimitConfig,
    sanitizationConfig?: Partial<SanitizationConfig>,
) {
    const middleware = new EnhancedRateLimit(config, sanitizationConfig);
    return middleware.middleware.bind(middleware);
}

export function createFileUploadRateLimit() {
    return createRateLimitMiddleware(
        RATE_LIMIT_CONFIGS.FILE_UPLOAD,
        {
            enableCSVSanitization: true,
            enableURLSanitization: true,
            enableInputValidation: true,
            maxFileSize: 5 * 1024 * 1024, // 5MB for uploads
            allowedFileTypes: [".csv", ".txt", ".json", ".xlsx"],
            blockedPatterns: [
                /^=/,
                /^\+/,
                /^-/,
                /^@/,
                /javascript:/i,
                /data:text\/html/i,
                /vbscript:/i,
                /onload=/i,
                /onerror=/i,
                /<script/i,
                /<\/script>/i,
            ],
        },
    );
}

export function createJobSearchRateLimit() {
    return createRateLimitMiddleware(
        RATE_LIMIT_CONFIGS.JOB_SEARCH,
        {
            enableCSVSanitization: false,
            enableURLSanitization: true,
            enableInputValidation: true,
        },
    );
}

export function createAuthRateLimit() {
    return createRateLimitMiddleware(
        RATE_LIMIT_CONFIGS.AUTH_ATTEMPTS,
        {
            enableCSVSanitization: false,
            enableURLSanitization: true,
            enableInputValidation: true,
        },
    );
}

// Utility functions for manual sanitization
export function sanitizeCSVContent(content: string): string {
    const lines = content.split("\n");
    return lines
        .map((line) =>
            line
                .replace(/^[=+\-@]/, "")
                .replace(/javascript:/gi, "")
                .replace(/vbscript:/gi, "")
                .replace(/data:text\/html/gi, "")
                .replace(/<script[^>]*>.*?<\/script>/gi, "")
                .replace(/on\w+\s*=/gi, "")
                .trim()
        )
        .join("\n");
}

export function validateURL(url: string): { valid: boolean; reason?: string } {
    try {
        const parsedUrl = new URL(url);

        // Check protocol
        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            return { valid: false, reason: "Invalid protocol" };
        }

        // Check for dangerous patterns
        const dangerousPatterns = [
            /javascript:/i,
            /data:text\/html/i,
            /vbscript:/i,
            /file:\/\//i,
            /localhost/i,
            /127\.0\.0\.1/i,
            /169\.254\./i,
        ];

        for (const pattern of dangerousPatterns) {
            if (pattern.test(url)) {
                return {
                    valid: false,
                    reason: "Dangerous URL pattern detected",
                };
            }
        }

        return { valid: true };
    } catch {
        return { valid: false, reason: "Invalid URL format" };
    }
}
