import React, { createContext, useContext, useEffect, useState } from "react";

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
}

interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: boolean) => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  reducedMotion: false,
  highContrast: false,
  largeText: false,
  screenReader: false,
  keyboardNavigation: false,
  focusVisible: true,
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(
  null,
);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider",
    );
  }
  return context;
}

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export function AccessibilityProvider(
  { children }: AccessibilityProviderProps,
) {
  const [settings, setSettings] = useState<AccessibilitySettings>(
    defaultSettings,
  );

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedSettings = localStorage.getItem("accessibility-settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.warn("Failed to parse accessibility settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem("accessibility-settings", JSON.stringify(settings));
  }, [settings]);

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;

    // Reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty("--animation-duration", "0.01ms");
      root.style.setProperty("--animation-iteration-count", "1");
      root.classList.add("reduce-motion");
      root.setAttribute("data-reduced-motion", "true");
    } else {
      root.style.removeProperty("--animation-duration");
      root.style.removeProperty("--animation-iteration-count");
      root.classList.remove("reduce-motion");
      if (root.getAttribute("data-reduced-motion") === "true") {
        root.removeAttribute("data-reduced-motion");
      }
    }

    // High contrast
    if (settings.highContrast) {
      root.classList.add("high-contrast");
      root.setAttribute("data-theme", "high-contrast");
    } else {
      root.classList.remove("high-contrast");
      if (root.getAttribute("data-theme") === "high-contrast") {
        root.removeAttribute("data-theme");
      }
    }

    // Large text
    if (settings.largeText) {
      root.style.fontSize = "1.125rem";
      root.classList.add("large-text");
      root.setAttribute("data-large-text", "true");
    } else {
      root.style.fontSize = "";
      root.classList.remove("large-text");
      if (root.getAttribute("data-large-text") === "true") {
        root.removeAttribute("data-large-text");
      }
    }

    // Screen reader optimizations
    if (settings.screenReader) {
      root.classList.add("screen-reader-optimized");
      root.setAttribute("data-screen-reader", "true");
    } else {
      root.classList.remove("screen-reader-optimized");
      if (root.getAttribute("data-screen-reader") === "true") {
        root.removeAttribute("data-screen-reader");
      }
    }

    // Keyboard navigation
    if (settings.keyboardNavigation) {
      root.classList.add("keyboard-navigation");
      root.setAttribute("data-keyboard-navigation", "true");
    } else {
      root.classList.remove("keyboard-navigation");
      if (root.getAttribute("data-keyboard-navigation") === "true") {
        root.removeAttribute("data-keyboard-navigation");
      }
    }

    // Focus visible
    if (settings.focusVisible) {
      root.classList.add("focus-visible");
      root.setAttribute("data-focus-visible", "true");
    } else {
      root.classList.remove("focus-visible");
      if (root.getAttribute("data-focus-visible") === "true") {
        root.removeAttribute("data-focus-visible");
      }
    }
  }, [settings]);

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const value: AccessibilityContextValue = {
    settings,
    updateSetting,
    resetSettings,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// Accessibility settings panel component
export function AccessibilityPanel() {
  const { settings, updateSetting, resetSettings } = useAccessibility();

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Accessibility Settings
        </h3>
        <button
          onClick={resetSettings}
          className="text-sm text-sky-600 dark:text-sky-400 hover:underline"
        >
          Reset to defaults
        </button>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.reducedMotion}
            onChange={(e) => updateSetting("reducedMotion", e.target.checked)}
            className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            Reduce motion and animations
          </span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.highContrast}
            onChange={(e) => updateSetting("highContrast", e.target.checked)}
            className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            High contrast mode
          </span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.largeText}
            onChange={(e) => updateSetting("largeText", e.target.checked)}
            className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            Large text size
          </span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.screenReader}
            onChange={(e) => updateSetting("screenReader", e.target.checked)}
            className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            Screen reader optimizations
          </span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.keyboardNavigation}
            onChange={(e) =>
              updateSetting("keyboardNavigation", e.target.checked)}
            className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            Enhanced keyboard navigation
          </span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.focusVisible}
            onChange={(e) => updateSetting("focusVisible", e.target.checked)}
            className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            Show focus indicators
          </span>
        </label>
      </div>

      <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          These settings are saved locally and will persist across sessions.
        </p>
      </div>
    </div>
  );
}
