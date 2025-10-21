"use client";

import React from "react";
import { AccessibilityToggle } from "@/components/accessibility/accessibility-toggle";
import { useAccessibility } from "@/components/accessibility/accessibility-provider";

export default function AccessibilityTestPage() {
    const { settings } = useAccessibility();

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">
                        Accessibility Theme Test
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        This page demonstrates the high-contrast theme and other
                        accessibility features.
                    </p>
                </header>

                {/* Current Settings Display */}
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">
                        Current Accessibility Settings
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div
                            className={`p-3 rounded-md border-2 ${
                                settings.highContrast
                                    ? "bg-yellow-100 border-yellow-400 text-yellow-900"
                                    : "bg-slate-100 border-slate-300 text-slate-700"
                            }`}
                        >
                            <div className="font-medium">High Contrast</div>
                            <div className="text-sm">
                                {settings.highContrast ? "ON" : "OFF"}
                            </div>
                        </div>
                        <div
                            className={`p-3 rounded-md border-2 ${
                                settings.reducedMotion
                                    ? "bg-green-100 border-green-400 text-green-900"
                                    : "bg-slate-100 border-slate-300 text-slate-700"
                            }`}
                        >
                            <div className="font-medium">Reduced Motion</div>
                            <div className="text-sm">
                                {settings.reducedMotion ? "ON" : "OFF"}
                            </div>
                        </div>
                        <div
                            className={`p-3 rounded-md border-2 ${
                                settings.largeText
                                    ? "bg-blue-100 border-blue-400 text-blue-900"
                                    : "bg-slate-100 border-slate-300 text-slate-700"
                            }`}
                        >
                            <div className="font-medium">Large Text</div>
                            <div className="text-sm">
                                {settings.largeText ? "ON" : "OFF"}
                            </div>
                        </div>
                        <div
                            className={`p-3 rounded-md border-2 ${
                                settings.screenReader
                                    ? "bg-purple-100 border-purple-400 text-purple-900"
                                    : "bg-slate-100 border-slate-300 text-slate-700"
                            }`}
                        >
                            <div className="font-medium">Screen Reader</div>
                            <div className="text-sm">
                                {settings.screenReader ? "ON" : "OFF"}
                            </div>
                        </div>
                        <div
                            className={`p-3 rounded-md border-2 ${
                                settings.keyboardNavigation
                                    ? "bg-orange-100 border-orange-400 text-orange-900"
                                    : "bg-slate-100 border-slate-300 text-slate-700"
                            }`}
                        >
                            <div className="font-medium">Keyboard Nav</div>
                            <div className="text-sm">
                                {settings.keyboardNavigation ? "ON" : "OFF"}
                            </div>
                        </div>
                        <div
                            className={`p-3 rounded-md border-2 ${
                                settings.focusVisible
                                    ? "bg-pink-100 border-pink-400 text-pink-900"
                                    : "bg-slate-100 border-slate-300 text-slate-700"
                            }`}
                        >
                            <div className="font-medium">Focus Visible</div>
                            <div className="text-sm">
                                {settings.focusVisible ? "ON" : "OFF"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Theme Toggle Panel */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">
                        Accessibility Controls
                    </h2>
                    <AccessibilityToggle variant="panel" />
                </div>

                {/* Visual Examples */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Buttons */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">
                            Button Examples
                        </h3>
                        <div className="space-y-3">
                            <button className="w-full bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
                                Primary Button
                            </button>
                            <button className="w-full bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                Success Button
                            </button>
                            <button className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                                Danger Button
                            </button>
                            <button className="w-full border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500">
                                Secondary Button
                            </button>
                        </div>
                    </div>

                    {/* Form Elements */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">
                            Form Elements
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Text Input
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    placeholder="Enter text here"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Select Dropdown
                                </label>
                                <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
                                    <option>Option 1</option>
                                    <option>Option 2</option>
                                    <option>Option 3</option>
                                </select>
                            </div>
                            <div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                        Checkbox option
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Color Palette */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-semibold mb-4">
                        Color Palette
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-sky-500 text-white p-4 rounded-md text-center">
                            <div className="font-medium">Sky</div>
                            <div className="text-sm opacity-90">#0ea5e9</div>
                        </div>
                        <div className="bg-emerald-500 text-white p-4 rounded-md text-center">
                            <div className="font-medium">Emerald</div>
                            <div className="text-sm opacity-90">#10b981</div>
                        </div>
                        <div className="bg-purple-500 text-white p-4 rounded-md text-center">
                            <div className="font-medium">Purple</div>
                            <div className="text-sm opacity-90">#8b5cf6</div>
                        </div>
                        <div className="bg-orange-500 text-white p-4 rounded-md text-center">
                            <div className="font-medium">Orange</div>
                            <div className="text-sm opacity-90">#f97316</div>
                        </div>
                    </div>
                </div>

                {/* Typography */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Typography</h3>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                            Heading 1 - Large Title
                        </h1>
                        <h2 className="text-3xl font-semibold text-slate-800 dark:text-slate-200">
                            Heading 2 - Section Title
                        </h2>
                        <h3 className="text-2xl font-medium text-slate-700 dark:text-slate-300">
                            Heading 3 - Subsection
                        </h3>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            This is a large paragraph text that should be
                            clearly readable in both normal and high-contrast
                            modes.
                        </p>
                        <p className="text-base text-slate-600 dark:text-slate-400">
                            This is regular paragraph text that should maintain
                            good contrast and readability.
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">
                            This is small text that should still be readable in
                            high-contrast mode.
                        </p>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        How to Test High Contrast Mode
                    </h3>
                    <ul className="text-blue-800 dark:text-blue-200 space-y-2">
                        <li>
                            • Use the floating accessibility button in the
                            bottom-right corner
                        </li>
                        <li>
                            • Toggle &quot;High contrast mode&quot; to see the
                            visual changes
                        </li>
                        <li>
                            • Check that all text remains readable with high
                            contrast
                        </li>
                        <li>
                            • Verify that buttons and form elements are clearly
                            visible
                        </li>
                        <li>
                            • Test that the color palette maintains sufficient
                            contrast
                        </li>
                        <li>• Ensure focus indicators are visible and clear</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
