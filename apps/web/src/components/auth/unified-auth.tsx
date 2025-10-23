"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogoSymbol } from "@/components/branding/logo-symbol";
import {
    Briefcase,
    CheckCircle,
    Eye,
    EyeOff,
    Lock,
    Mail,
    User,
    Users,
} from "lucide-react";
import { logger } from "@/lib/utils/logger";
import { useAuth } from "@/hooks/use-auth";

interface UnifiedAuthProps {
    mode: "signin" | "signup";
    defaultUserType?: "hirer" | "seeker";
    redirectTo?: string;
}

export function UnifiedAuth({
    mode,
    defaultUserType = "seeker",
    redirectTo = "/dashboard",
}: UnifiedAuthProps) {
    const [userType, setUserType] = useState<"hirer" | "seeker">(
        defaultUserType,
    );
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const router = useRouter();
    const { signIn, signUp, loading: authLoading } = useAuth();

    // Password strength calculation
    const calculatePasswordStrength = (pwd: string) => {
        let strength = 0;
        if (pwd.length >= 8) strength += 1;
        if (pwd.length >= 12) strength += 1;
        if (/[a-z]/.test(pwd)) strength += 1;
        if (/[A-Z]/.test(pwd)) strength += 1;
        if (/[0-9]/.test(pwd)) strength += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
        return strength;
    };

    // Update password strength when password changes
    React.useEffect(() => {
        if (isSignup && password) {
            setPasswordStrength(calculatePasswordStrength(password));
        }
    }, [password, isSignup]);

    const isSignup = mode === "signup";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!email || !password) {
            setError("Please fill in all required fields");
            return;
        }

        if (isSignup) {
            if (!fullName) {
                setError("Please enter your full name");
                return;
            }
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }
            if (password.length < 8) {
                setError("Password must be at least 8 characters long");
                return;
            }
            if (passwordStrength < 3) {
                setError("Password is too weak. Please use a stronger password with uppercase, lowercase, numbers, and special characters.");
                return;
            }
            if (!agreedToTerms) {
                setError("Please agree to the terms and conditions");
                return;
            }
        }

        try {
            logger.info("Auth attempt:", {
                mode,
                userType,
                email,
                fullName: isSignup ? fullName : undefined,
            });

            let result;
            if (isSignup) {
                result = await signUp(email, password, {
                    user_type: userType,
                    full_name: fullName,
                });
            } else {
                result = await signIn(email, password);
            }

            if (result.success) {
                if (isSignup && result.needsConfirmation) {
                    setError("Please check your email for a confirmation link");
                } else {
                    // Redirect will be handled by the auth state change listener
                    logger.info("Authentication successful");
                }
            } else {
                setError(result.error || "Authentication failed");
            }
        } catch (error) {
            logger.error("Auth error:", error);
            setError("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex relative">
            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage:
                        "url(/images/backgrounds/login-pattern.svg)",
                    backgroundSize: "400px 400px",
                    backgroundRepeat: "repeat",
                }}
            />

            {/* Left Column - Marketing Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gray-100 p-12 flex-col justify-between relative z-10">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <LogoSymbol className="h-10 w-10" variant="default" />
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
                            ProofOfFit
                        </h1>
                    </div>
                    <div className="h-1 w-28 bg-gradient-to-r from-purple-600 to-green-600 rounded mb-8" />

                    {/* Main Headline */}
                    <h2 className="text-2xl font-semibold text-gray-800 mb-8 leading-relaxed">
                        Transform hiring from gut feelings to{" "}
                        <span className="text-purple-600 font-bold">
                            evidence-based decisions
                        </span>. Showcase verified skills, real projects, and
                        proven capabilities.
                    </h2>

                    {/* Image Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="relative w-full h-32 rounded-lg mb-3 overflow-hidden">
                                <Image
                                    src="/images/professionals/construction-worker.svg"
                                    alt="Construction worker with blueprints and safety equipment"
                                    fill
                                    sizes="(max-width: 1024px) 200px, 240px"
                                    className="object-cover"
                                />
                            </div>
                            <p className="text-sm text-gray-700 font-medium">
                                All professions, all backgrounds
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="relative w-full h-32 rounded-lg mb-3 overflow-hidden">
                                <Image
                                    src="/images/professionals/healthcare-professional.svg"
                                    alt="Healthcare professional with stethoscope and medical equipment"
                                    fill
                                    sizes="(max-width: 1024px) 200px, 240px"
                                    className="object-cover"
                                />
                            </div>
                            <p className="text-sm text-gray-700 font-medium">
                                Healthcare to tech - everyone welcome
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="relative w-full h-32 rounded-lg mb-3 overflow-hidden">
                                <Image
                                    src="/images/professionals/culinary-professional.svg"
                                    alt="Culinary professional in kitchen with chef hat and plates"
                                    fill
                                    sizes="(max-width: 1024px) 200px, 240px"
                                    className="object-cover"
                                />
                            </div>
                            <p className="text-sm text-gray-700 font-medium">
                                Blue collar, white collar, service - all valued
                            </p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="relative w-full h-32 rounded-lg mb-3 overflow-hidden">
                                <Image
                                    src="/images/professionals/technology-professional.svg"
                                    alt="Technology professional at computer with multiple monitors"
                                    fill
                                    sizes="(max-width: 1024px) 200px, 240px"
                                    className="object-cover"
                                />
                            </div>
                            <p className="text-sm text-gray-700 font-medium">
                                Evidence-based hiring for everyone
                            </p>
                        </div>
                    </div>

                    {/* Feature List */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                            <span className="text-gray-700">
                                Evidence-first hiring methodology
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                            <span className="text-gray-700">
                                Secure, verified credentials
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                                <Briefcase className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-gray-700">
                                Built for modern teams
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-sm text-gray-500">
                    © 2025 ProofOfFit. Privacy-first and ethical by default.
                </div>
            </div>

            {/* Mobile Marketing Section */}
            <div className="lg:hidden w-full p-6 relative z-10">
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <LogoSymbol className="h-8 w-8" variant="default" />
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
                            ProofOfFit
                        </h1>
                    </div>
                    <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-green-600 rounded mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Transform hiring from gut feelings to{" "}
                        <span className="text-purple-600 font-bold">
                            evidence-based decisions
                        </span>
                    </h2>
                </div>

                {/* Mobile Image Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="relative w-full h-20 rounded-lg mb-2 overflow-hidden">
                            <Image
                                src="/images/professionals/construction-worker.svg"
                                alt="Construction worker"
                                fill
                                sizes="(max-width: 640px) 140px, 180px"
                                className="object-cover"
                            />
                        </div>
                        <p className="text-xs text-gray-700 font-medium">
                            All professions
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="relative w-full h-20 rounded-lg mb-2 overflow-hidden">
                            <Image
                                src="/images/professionals/healthcare-professional.svg"
                                alt="Healthcare professional"
                                fill
                                sizes="(max-width: 640px) 140px, 180px"
                                className="object-cover"
                            />
                        </div>
                        <p className="text-xs text-gray-700 font-medium">
                            Everyone welcome
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="relative w-full h-20 rounded-lg mb-2 overflow-hidden">
                            <Image
                                src="/images/professionals/culinary-professional.svg"
                                alt="Culinary professional"
                                fill
                                sizes="(max-width: 640px) 140px, 180px"
                                className="object-cover"
                            />
                        </div>
                        <p className="text-xs text-gray-700 font-medium">
                            All valued
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="relative w-full h-20 rounded-lg mb-2 overflow-hidden">
                            <Image
                                src="/images/professionals/technology-professional.svg"
                                alt="Technology professional"
                                fill
                                sizes="(max-width: 640px) 140px, 180px"
                                className="object-cover"
                            />
                        </div>
                        <p className="text-xs text-gray-700 font-medium">
                            Evidence-based
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        {/* Title */}
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {isSignup
                                ? "Create your ProofOfFit account"
                                : "Sign in to ProofOfFit"}
                        </h1>
                        <p className="text-gray-600 mb-8">
                            {isSignup
                                ? "Join thousands of professionals finding their perfect fit."
                                : "Sign in to access your applications and portfolio."}
                        </p>

                        {/* User Type Selector */}
                        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                            <button
                                type="button"
                                onClick={() => setUserType("hirer")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                    userType === "hirer"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                <Briefcase className="h-4 w-4" />
                                Hiring team
                            </button>
                            <button
                                type="button"
                                onClick={() => setUserType("seeker")}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                    userType === "seeker"
                                        ? "bg-purple-600 text-white shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                <Users className="h-4 w-4" />
                                Job seeker
                            </button>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Auth Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Full Name Field (Signup only) */}
                            {isSignup && (
                                <div>
                                    <label
                                        htmlFor="fullName"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="fullName"
                                            type="text"
                                            value={fullName}
                                            onChange={(e) =>
                                                setFullName(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-500"
                                            placeholder="Enter your full name"
                                            required={isSignup}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email Field */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-500"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword
                                            ? "text"
                                            : "password"}
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-500"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword
                                            ? (
                                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )
                                            : (
                                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                            )}
                                    </button>
                                </div>
                                
                                {/* Password Strength Indicator (Signup only) */}
                                {isSignup && password && (
                                    <div className="mt-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${
                                                        passwordStrength <= 2
                                                            ? "bg-red-500"
                                                            : passwordStrength <= 4
                                                            ? "bg-yellow-500"
                                                            : "bg-green-500"
                                                    }`}
                                                    style={{
                                                        width: `${(passwordStrength / 6) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {passwordStrength <= 2
                                                    ? "Weak"
                                                    : passwordStrength <= 4
                                                    ? "Medium"
                                                    : "Strong"}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {password.length < 8 && "At least 8 characters"}
                                            {password.length >= 8 && !/[A-Z]/.test(password) && " • Add uppercase letter"}
                                            {password.length >= 8 && !/[a-z]/.test(password) && " • Add lowercase letter"}
                                            {password.length >= 8 && !/[0-9]/.test(password) && " • Add number"}
                                            {password.length >= 8 && !/[^A-Za-z0-9]/.test(password) && " • Add special character"}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Field (Signup only) */}
                            {isSignup && (
                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword
                                                ? "text"
                                                : "password"}
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value,
                                                )}
                                            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-500"
                                            placeholder="Confirm your password"
                                            required={isSignup}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword,
                                                )}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showConfirmPassword
                                                ? (
                                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                )
                                                : (
                                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Terms Agreement (Signup only) */}
                            {isSignup && (
                                <div className="flex items-start gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setAgreedToTerms(!agreedToTerms)}
                                        className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                            agreedToTerms
                                                ? "bg-purple-600 border-purple-600"
                                                : "border-gray-300 hover:border-purple-500"
                                        }`}
                                    >
                                        {agreedToTerms && (
                                            <CheckCircle className="h-3 w-3 text-white" />
                                        )}
                                    </button>
                                    <label className="text-sm text-gray-600">
                                        I agree to the{" "}
                                        <Link
                                            href="/terms"
                                            className="text-purple-600 hover:text-purple-700"
                                        >
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link
                                            href="/privacy"
                                            className="text-purple-600 hover:text-purple-700"
                                        >
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={authLoading ||
                                    (isSignup && !agreedToTerms)}
                                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {authLoading
                                    ? (isSignup
                                        ? "Creating account..."
                                        : "Signing in...")
                                    : (isSignup ? "Create account" : "Sign in")}
                            </button>
                        </form>

                        {/* Auth Switch Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                {isSignup
                                    ? "Already have an account?"
                                    : "Don't have an account?"}{" "}
                                <Link
                                    href={isSignup
                                        ? "/auth/signin"
                                        : "/auth/signup"}
                                    className="text-purple-600 hover:text-purple-700 font-medium"
                                >
                                    {isSignup ? "Sign in" : "Sign up"}
                                </Link>
                            </p>
                        </div>

                        {/* Info Text */}
                        <div className="mt-6 flex items-start gap-2 text-sm text-gray-500">
                            <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs">i</span>
                            </div>
                            <p>
                                {isSignup
                                    ? "Join the future of evidence-based hiring. Your data is secure and privacy-first."
                                    : "Access your applications, manage your portfolio, and showcase your proven capabilities."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
