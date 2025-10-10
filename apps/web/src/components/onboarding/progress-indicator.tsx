'use client'

import React from 'react'
import { Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProgressStep {
  id: string
  title: string
  description?: string
  completed?: boolean
  current?: boolean
  disabled?: boolean
}

interface ProgressIndicatorProps {
  steps: ProgressStep[]
  orientation?: 'horizontal' | 'vertical'
  showDescriptions?: boolean
  className?: string
  stepClassName?: string
  completedClassName?: string
  currentClassName?: string
  disabledClassName?: string
}

export function ProgressIndicator({
  steps,
  orientation = 'horizontal',
  showDescriptions = false,
  className,
  stepClassName,
  completedClassName,
  currentClassName,
  disabledClassName
}: ProgressIndicatorProps) {
  const baseClasses = cn(
    'flex',
    orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col space-y-4',
    className
  )

  return (
    <div className={baseClasses}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        const isCompleted = step.completed
        const isCurrent = step.current
        const isDisabled = step.disabled

        return (
          <React.Fragment key={step.id}>
            <div className={cn(
              'flex items-center',
              orientation === 'horizontal' ? 'flex-col' : 'flex-row',
              stepClassName
            )}>
              {/* Step Circle */}
              <div className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors',
                isCompleted && 'bg-green-600 border-green-600 text-white',
                isCurrent && !isCompleted && 'bg-blue-600 border-blue-600 text-white',
                !isCurrent && !isCompleted && !isDisabled && 'border-gray-300 text-gray-500',
                isDisabled && 'border-gray-200 text-gray-300 bg-gray-50',
                completedClassName,
                isCurrent && currentClassName,
                isDisabled && disabledClassName
              )}>
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Step Content */}
              <div className={cn(
                'flex flex-col',
                orientation === 'horizontal' ? 'mt-2 text-center' : 'ml-3'
              )}>
                <span className={cn(
                  'text-sm font-medium',
                  isCompleted && 'text-green-600',
                  isCurrent && !isCompleted && 'text-blue-600',
                  !isCurrent && !isCompleted && !isDisabled && 'text-gray-900',
                  isDisabled && 'text-gray-400'
                )}>
                  {step.title}
                </span>
                {showDescriptions && step.description && (
                  <span className={cn(
                    'text-xs',
                    isCompleted && 'text-green-500',
                    isCurrent && !isCompleted && 'text-blue-500',
                    !isCurrent && !isCompleted && !isDisabled && 'text-gray-500',
                    isDisabled && 'text-gray-300'
                  )}>
                    {step.description}
                  </span>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {!isLast && (
              <div className={cn(
                'flex-1',
                orientation === 'horizontal' ? 'h-0.5 mx-4' : 'w-0.5 h-8 ml-4',
                isCompleted ? 'bg-green-600' : 'bg-gray-200'
              )} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// Circular Progress Indicator
interface CircularProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  strokeWidth?: number
  className?: string
  showPercentage?: boolean
  children?: React.ReactNode
}

export function CircularProgress({
  value,
  max = 100,
  size = 'md',
  strokeWidth = 2,
  className,
  showPercentage = false,
  children
}: CircularProgressProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const radius = size === 'sm' ? 12 : size === 'md' ? 20 : 28
  const circumference = 2 * Math.PI * radius
  const progress = (value / max) * circumference
  const offset = circumference - progress

  return (
    <div className={cn('relative inline-flex items-center justify-center', sizeClasses[size], className)}>
      <svg
        className="transform -rotate-90"
        width={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
        height={size === 'sm' ? 32 : size === 'md' ? 48 : 64}
      >
        {/* Background circle */}
        <circle
          cx={size === 'sm' ? 16 : size === 'md' ? 24 : 32}
          cy={size === 'sm' ? 16 : size === 'md' ? 24 : 32}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size === 'sm' ? 16 : size === 'md' ? 24 : 32}
          cy={size === 'sm' ? 16 : size === 'md' ? 24 : 32}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-blue-600 transition-all duration-300 ease-in-out"
          strokeLinecap="round"
        />
      </svg>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showPercentage && (
          <span className={cn('font-medium text-gray-900', textSizeClasses[size])}>
            {Math.round((value / max) * 100)}%
          </span>
        ))}
      </div>
    </div>
  )
}

// Linear Progress Bar
interface LinearProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showPercentage?: boolean
  animated?: boolean
}

export function LinearProgress({
  value,
  max = 100,
  size = 'md',
  className,
  showPercentage = false,
  animated = false
}: LinearProgressProps) {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }

  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className={cn('w-full', className)}>
      <div className={cn(
        'w-full bg-gray-200 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <div
          className={cn(
            'h-full bg-blue-600 rounded-full transition-all duration-300 ease-in-out',
            animated && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="mt-1 text-right">
          <span className="text-sm text-gray-600">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  )
}

// Step-by-step wizard component
export interface WizardStep {
  id: string
  title: string
  description?: string
  component: React.ComponentType<any>
  validation?: () => boolean | Promise<boolean>
}

interface WizardProps {
  steps: WizardStep[]
  onComplete?: (data: any) => void
  onStepChange?: (stepId: string, data: any) => void
  className?: string
  showProgress?: boolean
  allowSkip?: boolean
}

export function Wizard({
  steps,
  onComplete,
  onStepChange,
  className,
  showProgress = true,
  allowSkip = false
}: WizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0)
  const [stepData, setStepData] = React.useState<Record<string, any>>({})
  const [isValidating, setIsValidating] = React.useState(false)

  const currentStep = steps[currentStepIndex]
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  const progressSteps = steps.map((step, index) => ({
    id: step.id,
    title: step.title,
    description: step.description,
    completed: index < currentStepIndex,
    current: index === currentStepIndex
  }))

  const handleNext = async () => {
    if (currentStep.validation) {
      setIsValidating(true)
      try {
        const isValid = await currentStep.validation()
        if (!isValid) {
          setIsValidating(false)
          return
        }
      } catch (error) {
        console.error('Step validation failed:', error)
        setIsValidating(false)
        return
      }
      setIsValidating(false)
    }

    if (isLastStep) {
      onComplete?.(stepData)
    } else {
      const nextIndex = currentStepIndex + 1
      setCurrentStepIndex(nextIndex)
      onStepChange?.(steps[nextIndex].id, stepData)
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      const prevIndex = currentStepIndex - 1
      setCurrentStepIndex(prevIndex)
      onStepChange?.(steps[prevIndex].id, stepData)
    }
  }

  const handleSkip = () => {
    if (allowSkip && !isLastStep) {
      handleNext()
    }
  }

  const updateStepData = (data: any) => {
    setStepData(prev => ({
      ...prev,
      [currentStep.id]: data
    }))
  }

  const CurrentStepComponent = currentStep.component

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      {showProgress && (
        <div className="mb-8">
          <ProgressIndicator steps={progressSteps} />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentStep.title}
          </h2>
          {currentStep.description && (
            <p className="text-gray-600">{currentStep.description}</p>
          )}
        </div>

        <div className="mb-6">
          <CurrentStepComponent
            data={stepData[currentStep.id]}
            onUpdate={updateStepData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSkip={handleSkip}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            isValidating={isValidating}
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              isFirstStep
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            )}
          >
            Previous
          </button>

          <div className="flex space-x-2">
            {allowSkip && !isLastStep && (
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                Skip
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isValidating}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isValidating ? 'Validating...' : isLastStep ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
