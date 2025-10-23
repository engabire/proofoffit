/**
 * Authentication Utilities
 *
 * Provides shared utilities for authentication-related functionality
 * to reduce code duplication across components and API routes.
 */

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { env, isSupabaseConfigured } from "@/lib/env";

export interface UserProfile {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    role: "candidate" | "employer" | "admin";
    userType: "seeker" | "employer";
    preferences?: Record<string, any>;
    metadata?: Record<string, any>;
}

export interface AuthSession {
    user: UserProfile;
    session: any;
    isAuthenticated: boolean;
    isLoading: boolean;
    error?: string;
}

/**
 * Gets Supabase client for server-side operations
 */
export function getServerSupabaseClient() {
    if (!isSupabaseConfigured()) {
        throw new Error("Supabase not configured");
    }
    return createRouteHandlerClient({ cookies });
}

/**
 * Gets Supabase client for client-side operations
 */
export function getClientSupabaseClient() {
    if (!isSupabaseConfigured()) {
        throw new Error("Supabase not configured");
    }
    return createClientComponentClient();
}

/**
 * Validates user authentication status
 */
export async function validateAuth(): Promise<{
    isAuthenticated: boolean;
    user?: UserProfile;
    session?: any;
    error?: string;
}> {
    if (!isSupabaseConfigured()) {
        return {
            isAuthenticated: false,
            error: "Authentication service not configured",
        };
    }

    try {
        const supabase = getServerSupabaseClient();
        const [{ data: sessionData }, { data: userData }] = await Promise.all([
            supabase.auth.getSession(),
            supabase.auth.getUser(),
        ]);

        const session = sessionData.session;
        const user = userData.user;

        if (!session || !user) {
            return {
                isAuthenticated: false,
                error: "No active session found",
            };
        }

        // Transform user data to our UserProfile interface
        const userProfile: UserProfile = {
            id: user.id,
            email: user.email || "",
            name: user.user_metadata?.name || user.user_metadata?.full_name,
            avatar: user.user_metadata?.avatar_url,
            role: user.user_metadata?.role || "candidate",
            userType: user.user_metadata?.user_type || "seeker",
            preferences: user.user_metadata?.preferences || {},
            metadata: user.user_metadata || {},
        };

        return {
            isAuthenticated: true,
            user: userProfile,
            session,
        };
    } catch (error) {
        console.error("Auth validation error:", error);
        return {
            isAuthenticated: false,
            error: "Authentication validation failed",
        };
    }
}

/**
 * Validates user role and permissions
 */
export function validateUserRole(
    user: UserProfile,
    requiredRole?: "candidate" | "employer" | "admin",
    requiredUserType?: "seeker" | "employer",
): { isValid: boolean; error?: string } {
    if (requiredRole && user.role !== requiredRole) {
        return {
            isValid: false,
            error: `Access denied. Required role: ${requiredRole}`,
        };
    }

    if (requiredUserType && user.userType !== requiredUserType) {
        return {
            isValid: false,
            error: `Access denied. Required user type: ${requiredUserType}`,
        };
    }

    return { isValid: true };
}

/**
 * Gets user profile from database
 */
export async function getUserProfile(userId: string): Promise<{
    profile?: any;
    error?: string;
}> {
    if (!isSupabaseConfigured()) {
        return { error: "Database not configured" };
    }

    try {
        const supabase = getServerSupabaseClient();
        const { data, error } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) {
            return { error: "Failed to fetch user profile" };
        }

        return { profile: data };
    } catch (error) {
        console.error("Get user profile error:", error);
        return { error: "Database error" };
    }
}

/**
 * Updates user profile in database
 */
export async function updateUserProfile(
    userId: string,
    updates: Partial<any>,
): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
        return { success: false, error: "Database not configured" };
    }

    try {
        const supabase = getServerSupabaseClient();
        const { error } = await supabase
            .from("user_profiles")
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq("id", userId);

        if (error) {
            return { success: false, error: "Failed to update user profile" };
        }

        return { success: true };
    } catch (error) {
        console.error("Update user profile error:", error);
        return { success: false, error: "Database error" };
    }
}

/**
 * Creates user profile in database
 */
export async function createUserProfile(
    userId: string,
    profileData: Partial<any>,
): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
        return { success: false, error: "Database not configured" };
    }

    try {
        const supabase = getServerSupabaseClient();
        const { error } = await supabase
            .from("user_profiles")
            .insert({
                id: userId,
                ...profileData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });

        if (error) {
            return { success: false, error: "Failed to create user profile" };
        }

        return { success: true };
    } catch (error) {
        console.error("Create user profile error:", error);
        return { success: false, error: "Database error" };
    }
}

/**
 * Signs out user
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
        return {
            success: false,
            error: "Authentication service not configured",
        };
    }

    try {
        const supabase = getServerSupabaseClient();
        const { error } = await supabase.auth.signOut();

        if (error) {
            return { success: false, error: "Failed to sign out" };
        }

        return { success: true };
    } catch (error) {
        console.error("Sign out error:", error);
        return { success: false, error: "Sign out failed" };
    }
}

/**
 * Signs in user with email and password
 */
export async function signInWithPassword(
    email: string,
    password: string,
): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    if (!isSupabaseConfigured()) {
        return {
            success: false,
            error: "Authentication service not configured",
        };
    }

    try {
        const supabase = getServerSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        if (!data.user) {
            return { success: false, error: "No user data returned" };
        }

        const userProfile: UserProfile = {
            id: data.user.id,
            email: data.user.email || "",
            name: data.user.user_metadata?.name ||
                data.user.user_metadata?.full_name,
            avatar: data.user.user_metadata?.avatar_url,
            role: data.user.user_metadata?.role || "candidate",
            userType: data.user.user_metadata?.user_type || "seeker",
            preferences: data.user.user_metadata?.preferences || {},
            metadata: data.user.user_metadata || {},
        };

        return { success: true, user: userProfile };
    } catch (error) {
        console.error("Sign in error:", error);
        return { success: false, error: "Sign in failed" };
    }
}

/**
 * Signs up user with email and password
 */
export async function signUpWithPassword(
    email: string,
    password: string,
    userType: "seeker" | "employer" = "seeker",
    additionalData?: Record<string, any>,
): Promise<{ success: boolean; error?: string; user?: UserProfile }> {
    if (!isSupabaseConfigured()) {
        return {
            success: false,
            error: "Authentication service not configured",
        };
    }

    try {
        const supabase = getServerSupabaseClient();
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    user_type: userType,
                    role: userType === "employer" ? "employer" : "candidate",
                    ...additionalData,
                },
            },
        });

        if (error) {
            return { success: false, error: error.message };
        }

        if (!data.user) {
            return { success: false, error: "No user data returned" };
        }

        const userProfile: UserProfile = {
            id: data.user.id,
            email: data.user.email || "",
            name: data.user.user_metadata?.name ||
                data.user.user_metadata?.full_name,
            avatar: data.user.user_metadata?.avatar_url,
            role: data.user.user_metadata?.role || "candidate",
            userType: data.user.user_metadata?.user_type || "seeker",
            preferences: data.user.user_metadata?.preferences || {},
            metadata: data.user.user_metadata || {},
        };

        return { success: true, user: userProfile };
    } catch (error) {
        console.error("Sign up error:", error);
        return { success: false, error: "Sign up failed" };
    }
}

/**
 * Sends magic link for passwordless authentication
 */
export async function sendMagicLink(
    email: string,
    redirectTo?: string,
): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
        return {
            success: false,
            error: "Authentication service not configured",
        };
    }

    try {
        const supabase = getServerSupabaseClient();
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: redirectTo ||
                    `${env.nextAuth.url}/auth/callback`,
            },
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error("Magic link error:", error);
        return { success: false, error: "Failed to send magic link" };
    }
}

/**
 * Resets user password
 */
export async function resetPassword(
    email: string,
    redirectTo?: string,
): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
        return {
            success: false,
            error: "Authentication service not configured",
        };
    }

    try {
        const supabase = getServerSupabaseClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectTo || `${env.nextAuth.url}/auth/reset-password`,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error("Reset password error:", error);
        return { success: false, error: "Failed to send reset email" };
    }
}

/**
 * Updates user password
 */
export async function updatePassword(
    newPassword: string,
): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured()) {
        return {
            success: false,
            error: "Authentication service not configured",
        };
    }

    try {
        const supabase = getServerSupabaseClient();
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error("Update password error:", error);
        return { success: false, error: "Failed to update password" };
    }
}

/**
 * Validates password strength
 */
export function validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
} {
    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length >= 8) {
        score += 1;
    } else {
        feedback.push("Password must be at least 8 characters long");
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
        score += 1;
    } else {
        feedback.push("Password must contain at least one uppercase letter");
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
        score += 1;
    } else {
        feedback.push("Password must contain at least one lowercase letter");
    }

    // Number check
    if (/[0-9]/.test(password)) {
        score += 1;
    } else {
        feedback.push("Password must contain at least one number");
    }

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
        score += 1;
    } else {
        feedback.push("Password must contain at least one special character");
    }

    // Length bonus
    if (password.length >= 12) {
        score += 1;
    }

    return {
        isValid: score >= 4,
        score,
        feedback,
    };
}

/**
 * Generates secure random password
 */
export function generateSecurePassword(length: number = 12): string {
    const charset =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";

    // Ensure at least one character from each category
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    password += "0123456789"[Math.floor(Math.random() * 10)];
    password += "!@#$%^&*"[Math.floor(Math.random() * 8)];

    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password
    return password.split("").sort(() => Math.random() - 0.5).join("");
}
