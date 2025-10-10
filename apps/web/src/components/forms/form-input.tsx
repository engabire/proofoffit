'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
  onChange?: (value: string) => void
  containerClassName?: string
  labelClassName?: string
  inputClassName?: string
  errorClassName?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  onChange,
  containerClassName,
  labelClassName,
  inputClassName,
  errorClassName,
  className,
  type = 'text',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  
  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type

  const hasError = !!error
  const hasLeftIcon = !!leftIcon
  const hasRightIcon = !!rightIcon || showPasswordToggle

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
    props.onChange?.(e)
  }

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label 
          htmlFor={props.id}
          className={cn(
            'block text-sm font-medium text-gray-700',
            hasError && 'text-red-700',
            labelClassName
          )}
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {hasLeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className={cn(
              'h-5 w-5',
              hasError ? 'text-red-400' : 'text-gray-400',
              isFocused && !hasError && 'text-blue-500'
            )}>
              {leftIcon}
            </div>
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          className={cn(
            'block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6',
            hasLeftIcon && 'pl-10',
            hasRightIcon && 'pr-10',
            hasError && 'ring-red-300 focus:ring-red-600',
            isFocused && !hasError && 'ring-blue-300',
            props.disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed',
            inputClassName,
            className
          )}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          onChange={handleChange}
          {...props}
        />
        
        {hasRightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {showPasswordToggle ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  'h-5 w-5 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600',
                  hasError && 'text-red-400 hover:text-red-600 focus:text-red-600'
                )}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            ) : (
              <div className={cn(
                'h-5 w-5',
                hasError ? 'text-red-400' : 'text-gray-400',
                isFocused && !hasError && 'text-blue-500'
              )}>
                {rightIcon}
              </div>
            )}
          </div>
        )}
      </div>
      
      {hasError && (
        <div className={cn('flex items-center space-x-1', errorClassName)}>
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      {helperText && !hasError && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
})

FormInput.displayName = 'FormInput'

// Form Textarea Component
interface FormTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string
  error?: string
  helperText?: string
  onChange?: (value: string) => void
  containerClassName?: string
  labelClassName?: string
  textareaClassName?: string
  errorClassName?: string
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(({
  label,
  error,
  helperText,
  onChange,
  containerClassName,
  labelClassName,
  textareaClassName,
  errorClassName,
  className,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = React.useState(false)
  
  const hasError = !!error

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value)
    props.onChange?.(e)
  }

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label 
          htmlFor={props.id}
          className={cn(
            'block text-sm font-medium text-gray-700',
            hasError && 'text-red-700',
            labelClassName
          )}
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        className={cn(
          'block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6',
          hasError && 'ring-red-300 focus:ring-red-600',
          isFocused && !hasError && 'ring-blue-300',
          props.disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed',
          textareaClassName,
          className
        )}
        onFocus={(e) => {
          setIsFocused(true)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setIsFocused(false)
          props.onBlur?.(e)
        }}
        onChange={handleChange}
        {...props}
      />
      
      {hasError && (
        <div className={cn('flex items-center space-x-1', errorClassName)}>
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      {helperText && !hasError && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
})

FormTextarea.displayName = 'FormTextarea'

// Form Select Component
interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string
  error?: string
  helperText?: string
  options: Array<{ value: string; label: string; disabled?: boolean }>
  placeholder?: string
  onChange?: (value: string) => void
  containerClassName?: string
  labelClassName?: string
  selectClassName?: string
  errorClassName?: string
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(({
  label,
  error,
  helperText,
  options,
  placeholder,
  onChange,
  containerClassName,
  labelClassName,
  selectClassName,
  errorClassName,
  className,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = React.useState(false)
  
  const hasError = !!error

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value)
    props.onChange?.(e)
  }

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <label 
          htmlFor={props.id}
          className={cn(
            'block text-sm font-medium text-gray-700',
            hasError && 'text-red-700',
            labelClassName
          )}
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        ref={ref}
        className={cn(
          'block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6',
          hasError && 'ring-red-300 focus:ring-red-600',
          isFocused && !hasError && 'ring-blue-300',
          props.disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed',
          selectClassName,
          className
        )}
        onFocus={(e) => {
          setIsFocused(true)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setIsFocused(false)
          props.onBlur?.(e)
        }}
        onChange={handleChange}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {hasError && (
        <div className={cn('flex items-center space-x-1', errorClassName)}>
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      {helperText && !hasError && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
})

FormSelect.displayName = 'FormSelect'
