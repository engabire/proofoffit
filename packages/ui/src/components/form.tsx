import React, { createContext, useContext, useId } from 'react'
import { cn } from '@/lib/utils'
import { Label } from './label'
import { Input } from './input'
import { Textarea } from './textarea'
import { Button } from './button'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface FormContextValue {
  errors: Record<string, string>
  touched: Record<string, boolean>
  values: Record<string, any>
  setFieldValue: (name: string, value: any) => void
  setFieldTouched: (name: string, touched: boolean) => void
  setFieldError: (name: string, error: string) => void
  validateField: (name: string) => void
  validateForm: () => boolean
}

const FormContext = createContext<FormContextValue | null>(null)

function useFormContext() {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('Form components must be used within a Form')
  }
  return context
}

interface FormProps {
  children: React.ReactNode
  initialValues?: Record<string, any>
  onSubmit?: (values: Record<string, any>) => void | Promise<void>
  validationSchema?: Record<string, (value: any) => string | undefined>
  className?: string
}

export function Form({ 
  children, 
  initialValues = {}, 
  onSubmit, 
  validationSchema = {},
  className 
}: FormProps) {
  const [values, setValues] = React.useState(initialValues)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [touched, setTouched] = React.useState<Record<string, boolean>>({})

  const setFieldValue = React.useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }, [errors])

  const setFieldTouched = React.useCallback((name: string, touched: boolean) => {
    setTouched(prev => ({ ...prev, [name]: touched }))
  }, [])

  const setFieldError = React.useCallback((name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [])

  const validateField = React.useCallback((name: string) => {
    const validator = validationSchema[name]
    if (validator) {
      const error = validator(values[name])
      setFieldError(name, error || '')
    }
  }, [values, validationSchema, setFieldError])

  const validateForm = React.useCallback(() => {
    let isValid = true
    const newErrors: Record<string, string> = {}

    Object.keys(validationSchema).forEach(name => {
      const validator = validationSchema[name]
      if (validator) {
        const error = validator(values[name])
        if (error) {
          newErrors[name] = error
          isValid = false
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }, [values, validationSchema])

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm() && onSubmit) {
      try {
        await onSubmit(values)
      } catch (error) {
        console.error('Form submission error:', error)
      }
    }
  }, [validateForm, onSubmit, values])

  const contextValue: FormContextValue = {
    errors,
    touched,
    values,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    validateField,
    validateForm
  }

  return (
    <FormContext.Provider value={contextValue}>
      <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
        {children}
      </form>
    </FormContext.Provider>
  )
}

interface FormFieldProps {
  name: string
  label?: string
  required?: boolean
  children: (props: {
    value: any
    onChange: (value: any) => void
    onBlur: () => void
    error: string
    touched: boolean
    hasError: boolean
  }) => React.ReactNode
  className?: string
}

export function FormField({ 
  name, 
  label, 
  required, 
  children, 
  className 
}: FormFieldProps) {
  const { values, errors, touched, setFieldValue, setFieldTouched, validateField } = useFormContext()
  const id = useId()

  const value = values[name]
  const error = errors[name] || ''
  const isTouched = touched[name] || false
  const hasError = isTouched && !!error

  const handleChange = (newValue: any) => {
    setFieldValue(name, newValue)
  }

  const handleBlur = () => {
    setFieldTouched(name, true)
    validateField(name)
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id} className={cn(hasError && 'text-red-600 dark:text-red-400')}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {children({
        value,
        onChange: handleChange,
        onBlur: handleBlur,
        error,
        touched: isTouched,
        hasError
      })}
      {hasError && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'onBlur'> {
  name: string
  label?: string
  required?: boolean
  className?: string
}

export function FormInput({ 
  name, 
  label, 
  required, 
  className,
  ...props 
}: FormInputProps) {
  return (
    <FormField name={name} label={label} required={required}>
      {({ value, onChange, onBlur, hasError }) => (
        <Input
          id={name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={cn(hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500', className)}
          {...props}
        />
      )}
    </FormField>
  )
}

interface FormTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'onBlur'> {
  name: string
  label?: string
  required?: boolean
  className?: string
}

export function FormTextarea({ 
  name, 
  label, 
  required, 
  className,
  ...props 
}: FormTextareaProps) {
  return (
    <FormField name={name} label={label} required={required}>
      {({ value, onChange, onBlur, hasError }) => (
        <Textarea
          id={name}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={cn(hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500', className)}
          {...props}
        />
      )}
    </FormField>
  )
}

interface FormSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  loading?: boolean
  className?: string
}

export function FormSubmitButton({ 
  children, 
  loading = false, 
  className,
  disabled,
  ...props 
}: FormSubmitButtonProps) {
  const { errors, validateForm } = useFormContext()
  const hasErrors = Object.values(errors).some(error => !!error)

  return (
    <Button
      type="submit"
      disabled={disabled || loading || hasErrors}
      className={cn('w-full', className)}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Submitting...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  )
}

// Common validation functions
export const validators = {
  required: (message = 'This field is required') => (value: any) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return message
    }
    return undefined
  },

  email: (message = 'Please enter a valid email address') => (value: string) => {
    if (!value) return undefined
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return message
    }
    return undefined
  },

  minLength: (min: number, message?: string) => (value: string) => {
    if (!value) return undefined
    if (value.length < min) {
      return message || `Must be at least ${min} characters long`
    }
    return undefined
  },

  maxLength: (max: number, message?: string) => (value: string) => {
    if (!value) return undefined
    if (value.length > max) {
      return message || `Must be no more than ${max} characters long`
    }
    return undefined
  },

  pattern: (regex: RegExp, message: string) => (value: string) => {
    if (!value) return undefined
    if (!regex.test(value)) {
      return message
    }
    return undefined
  },

  url: (message = 'Please enter a valid URL') => (value: string) => {
    if (!value) return undefined
    try {
      new URL(value)
      return undefined
    } catch {
      return message
    }
  }
}
