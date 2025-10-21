'use client'

import React, { useState } from 'react'
import { useAccessibility } from './accessibility-provider'
import { Settings, Eye, Type, Volume2, Keyboard, Focus } from 'lucide-react'

interface AccessibilityToggleProps {
  variant?: 'button' | 'panel' | 'floating'
  className?: string
}

export function AccessibilityToggle({ 
  variant = 'floating', 
  className = '' 
}: AccessibilityToggleProps) {
  const { settings, updateSetting } = useAccessibility()
  const [isOpen, setIsOpen] = useState(false)

  const toggleHighContrast = () => {
    updateSetting('highContrast', !settings.highContrast)
  }

  const toggleReducedMotion = () => {
    updateSetting('reducedMotion', !settings.reducedMotion)
  }

  const toggleLargeText = () => {
    updateSetting('largeText', !settings.largeText)
  }

  const toggleScreenReader = () => {
    updateSetting('screenReader', !settings.screenReader)
  }

  const toggleKeyboardNav = () => {
    updateSetting('keyboardNavigation', !settings.keyboardNavigation)
  }

  const toggleFocusVisible = () => {
    updateSetting('focusVisible', !settings.focusVisible)
  }

  if (variant === 'button') {
    return (
      <button
        onClick={toggleHighContrast}
        className={`px-4 py-2 rounded-md border-2 transition-all duration-200 ${
          settings.highContrast
            ? 'bg-yellow-400 text-black border-yellow-600'
            : 'bg-blue-600 text-white border-blue-800 hover:bg-blue-700'
        } ${className}`}
        aria-label={settings.highContrast ? 'Disable high contrast' : 'Enable high contrast'}
      >
        <Eye className="w-4 h-4 inline mr-2" />
        {settings.highContrast ? 'High Contrast ON' : 'High Contrast OFF'}
      </button>
    )
  }

  if (variant === 'panel') {
    return (
      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 ${className}`}>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Accessibility Settings
        </h3>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={toggleHighContrast}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <Eye className="w-4 h-4 text-slate-600" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              High contrast mode
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={toggleReducedMotion}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <Settings className="w-4 h-4 text-slate-600" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Reduce motion
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.largeText}
              onChange={toggleLargeText}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <Type className="w-4 h-4 text-slate-600" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Large text
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.screenReader}
              onChange={toggleScreenReader}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <Volume2 className="w-4 h-4 text-slate-600" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Screen reader optimized
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.keyboardNavigation}
              onChange={toggleKeyboardNav}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <Keyboard className="w-4 h-4 text-slate-600" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Enhanced keyboard navigation
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.focusVisible}
              onChange={toggleFocusVisible}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <Focus className="w-4 h-4 text-slate-600" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Show focus indicators
            </span>
          </label>
        </div>
      </div>
    )
  }

  // Floating variant (default)
  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${
          settings.highContrast
            ? 'bg-yellow-400 text-black border-2 border-yellow-600'
            : 'bg-blue-600 text-white border-2 border-blue-800 hover:bg-blue-700'
        }`}
        aria-label="Accessibility settings"
        aria-expanded={isOpen}
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Accessibility
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              aria-label="Close settings"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={toggleHighContrast}
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <Eye className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                High contrast mode
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={toggleReducedMotion}
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <Settings className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Reduce motion
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.largeText}
                onChange={toggleLargeText}
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <Type className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Large text
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.screenReader}
                onChange={toggleScreenReader}
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <Volume2 className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Screen reader optimized
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.keyboardNavigation}
                onChange={toggleKeyboardNav}
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <Keyboard className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Enhanced keyboard navigation
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.focusVisible}
                onChange={toggleFocusVisible}
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <Focus className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Show focus indicators
              </span>
            </label>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Settings are saved locally and persist across sessions.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
