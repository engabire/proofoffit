/**
 * Form Validation Utilities
 *
 * Provides reusable validation functions and schemas for forms
 * to reduce code duplication and ensure consistent validation.
 */

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export interface FieldValidator {
    (value: any): ValidationResult;
}

export interface FormSchema {
    [fieldName: string]: FieldValidator | FieldValidator[];
}

/**
 * Common validation functions
 */
export const validators = {
    required:
        (message: string = "This field is required"): FieldValidator =>
        (value) => {
            if (value === null || value === undefined || value === "") {
                return { isValid: false, error: message };
            }
            return { isValid: true };
        },

    email:
        (
            message: string = "Please enter a valid email address",
        ): FieldValidator =>
        (value) => {
            if (!value) return { isValid: true }; // Allow empty if not required
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return { isValid: false, error: message };
            }
            return { isValid: true };
        },

    minLength: (min: number, message?: string): FieldValidator => (value) => {
        if (!value) return { isValid: true }; // Allow empty if not required
        if (value.length < min) {
            return {
                isValid: false,
                error: message || `Must be at least ${min} characters long`,
            };
        }
        return { isValid: true };
    },

    maxLength: (max: number, message?: string): FieldValidator => (value) => {
        if (!value) return { isValid: true }; // Allow empty if not required
        if (value.length > max) {
            return {
                isValid: false,
                error: message || `Must be no more than ${max} characters long`,
            };
        }
        return { isValid: true };
    },

    min: (min: number, message?: string): FieldValidator => (value) => {
        if (value === null || value === undefined || value === "") {
            return { isValid: true };
        }
        const num = Number(value);
        if (isNaN(num) || num < min) {
            return {
                isValid: false,
                error: message || `Must be at least ${min}`,
            };
        }
        return { isValid: true };
    },

    max: (max: number, message?: string): FieldValidator => (value) => {
        if (value === null || value === undefined || value === "") {
            return { isValid: true };
        }
        const num = Number(value);
        if (isNaN(num) || num > max) {
            return {
                isValid: false,
                error: message || `Must be no more than ${max}`,
            };
        }
        return { isValid: true };
    },

    pattern: (regex: RegExp, message: string): FieldValidator => (value) => {
        if (!value) return { isValid: true }; // Allow empty if not required
        if (!regex.test(value)) {
            return { isValid: false, error: message };
        }
        return { isValid: true };
    },

    phone:
        (
            message: string = "Please enter a valid phone number",
        ): FieldValidator =>
        (value) => {
            if (!value) return { isValid: true }; // Allow empty if not required
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ""))) {
                return { isValid: false, error: message };
            }
            return { isValid: true };
        },

    url: (message: string = "Please enter a valid URL"): FieldValidator =>
    (value) => {
        if (!value) return { isValid: true }; // Allow empty if not required
        try {
            new URL(value);
            return { isValid: true };
        } catch {
            return { isValid: false, error: message };
        }
    },

    password: (message?: string): FieldValidator => (value) => {
        if (!value) return { isValid: true }; // Allow empty if not required

        const feedback: string[] = [];

        if (value.length < 8) {
            feedback.push("at least 8 characters");
        }
        if (!/[A-Z]/.test(value)) {
            feedback.push("one uppercase letter");
        }
        if (!/[a-z]/.test(value)) {
            feedback.push("one lowercase letter");
        }
        if (!/[0-9]/.test(value)) {
            feedback.push("one number");
        }
        if (!/[^A-Za-z0-9]/.test(value)) {
            feedback.push("one special character");
        }

        if (feedback.length > 0) {
            return {
                isValid: false,
                error: message ||
                    `Password must contain ${feedback.join(", ")}`,
            };
        }

        return { isValid: true };
    },

    confirmPassword:
        (passwordField: string, message?: string): FieldValidator =>
        (value, formData) => {
            if (!value) return { isValid: true }; // Allow empty if not required
            if (value !== formData?.[passwordField]) {
                return {
                    isValid: false,
                    error: message || "Passwords do not match",
                };
            }
            return { isValid: true };
        },

    oneOf: (options: any[], message?: string): FieldValidator => (value) => {
        if (!value) return { isValid: true }; // Allow empty if not required
        if (!options.includes(value)) {
            return {
                isValid: false,
                error: message || `Must be one of: ${options.join(", ")}`,
            };
        }
        return { isValid: true };
    },

    custom:
        (
            validator: (value: any, formData?: any) => ValidationResult,
        ): FieldValidator =>
        (value, formData) => {
            return validator(value, formData);
        },
};

/**
 * Common form schemas
 */
export const schemas = {
    // Authentication forms
    signIn: {
        email: [validators.required(), validators.email()],
        password: [validators.required()],
    },

    signUp: {
        email: [validators.required(), validators.email()],
        password: [validators.required(), validators.password()],
        confirmPassword: [
            validators.required(),
            validators.confirmPassword("password"),
        ],
        userType: [
            validators.required(),
            validators.oneOf(["seeker", "employer"]),
        ],
        name: [validators.required(), validators.minLength(2)],
    },

    resetPassword: {
        email: [validators.required(), validators.email()],
    },

    changePassword: {
        currentPassword: [validators.required()],
        newPassword: [validators.required(), validators.password()],
        confirmPassword: [
            validators.required(),
            validators.confirmPassword("newPassword"),
        ],
    },

    // Profile forms
    userProfile: {
        name: [
            validators.required(),
            validators.minLength(2),
            validators.maxLength(100),
        ],
        email: [validators.required(), validators.email()],
        phone: [validators.phone()],
        bio: [validators.maxLength(500)],
        location: [validators.maxLength(100)],
        website: [validators.url()],
    },

    candidateProfile: {
        name: [
            validators.required(),
            validators.minLength(2),
            validators.maxLength(100),
        ],
        email: [validators.required(), validators.email()],
        phone: [validators.phone()],
        location: [validators.maxLength(100)],
        experience: [
            validators.required(),
            validators.oneOf(["entry", "mid", "senior", "executive"]),
        ],
        skills: [validators.required()],
        resume: [validators.url()],
        portfolio: [validators.url()],
        linkedin: [validators.url()],
        github: [validators.url()],
    },

    employerProfile: {
        companyName: [
            validators.required(),
            validators.minLength(2),
            validators.maxLength(100),
        ],
        email: [validators.required(), validators.email()],
        phone: [validators.phone()],
        website: [validators.url()],
        industry: [validators.required()],
        companySize: [
            validators.required(),
            validators.oneOf([
                "startup",
                "small",
                "medium",
                "large",
                "enterprise",
            ]),
        ],
        location: [validators.maxLength(100)],
        description: [validators.maxLength(1000)],
    },

    // Job forms
    jobPosting: {
        title: [
            validators.required(),
            validators.minLength(5),
            validators.maxLength(100),
        ],
        description: [
            validators.required(),
            validators.minLength(50),
            validators.maxLength(5000),
        ],
        location: [validators.required(), validators.maxLength(100)],
        salaryMin: [validators.min(0)],
        salaryMax: [validators.min(0)],
        employmentType: [
            validators.required(),
            validators.oneOf([
                "full-time",
                "part-time",
                "contract",
                "internship",
            ]),
        ],
        experienceLevel: [
            validators.required(),
            validators.oneOf(["entry", "mid", "senior", "executive"]),
        ],
        remote: [validators.oneOf([true, false])],
        skills: [validators.required()],
        benefits: [validators.maxLength(1000)],
        applicationDeadline: [validators.required()],
    },

    // Application forms
    jobApplication: {
        coverLetter: [validators.maxLength(2000)],
        resume: [validators.required()],
        portfolio: [validators.url()],
        linkedin: [validators.url()],
        github: [validators.url()],
        availability: [validators.required()],
        salaryExpectation: [validators.min(0)],
        noticePeriod: [validators.required()],
    },

    // Contact forms
    contact: {
        name: [
            validators.required(),
            validators.minLength(2),
            validators.maxLength(100),
        ],
        email: [validators.required(), validators.email()],
        subject: [
            validators.required(),
            validators.minLength(5),
            validators.maxLength(200),
        ],
        message: [
            validators.required(),
            validators.minLength(10),
            validators.maxLength(2000),
        ],
        phone: [validators.phone()],
    },

    // Feedback forms
    feedback: {
        rating: [validators.required(), validators.min(1), validators.max(5)],
        comment: [validators.maxLength(1000)],
        category: [
            validators.required(),
            validators.oneOf(["bug", "feature", "improvement", "other"]),
        ],
    },
};

/**
 * Validates a single field
 */
export function validateField(
    value: any,
    validators: FieldValidator | FieldValidator[],
    formData?: any,
): ValidationResult {
    const validatorArray = Array.isArray(validators)
        ? validators
        : [validators];

    for (const validator of validatorArray) {
        const result = validator(value, formData);
        if (!result.isValid) {
            return result;
        }
    }

    return { isValid: true };
}

/**
 * Validates an entire form
 */
export function validateForm(
    formData: Record<string, any>,
    schema: FormSchema,
): {
    isValid: boolean;
    errors: Record<string, string>;
} {
    const errors: Record<string, string> = {};
    let isValid = true;

    for (const [fieldName, validators] of Object.entries(schema)) {
        const value = formData[fieldName];
        const result = validateField(value, validators, formData);

        if (!result.isValid) {
            errors[fieldName] = result.error || "Invalid value";
            isValid = false;
        }
    }

    return { isValid, errors };
}

/**
 * Validates form data asynchronously (for server-side validation)
 */
export async function validateFormAsync(
    formData: Record<string, any>,
    schema: FormSchema,
): Promise<{
    isValid: boolean;
    errors: Record<string, string>;
}> {
    // For now, this is the same as synchronous validation
    // In the future, this could include async validators like checking if email exists
    return validateForm(formData, schema);
}

/**
 * Sanitizes form data
 */
export function sanitizeFormData(
    formData: Record<string, any>,
): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(formData)) {
        if (typeof value === "string") {
            // Basic HTML sanitization
            sanitized[key] = value
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#x27;")
                .trim();
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
}

/**
 * Formats validation errors for display
 */
export function formatValidationErrors(
    errors: Record<string, string>,
): string[] {
    return Object.values(errors).filter(Boolean);
}

/**
 * Gets the first validation error
 */
export function getFirstValidationError(
    errors: Record<string, string>,
): string | null {
    const errorValues = Object.values(errors).filter(Boolean);
    return errorValues.length > 0 ? errorValues[0] : null;
}
