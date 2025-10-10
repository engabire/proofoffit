'use client'

import { useState, useCallback, useEffect } from 'react'
import { z } from 'zod'

interface ValidationError {
  field: string
  message: string
}

interface UseFormValidationOptions<T> {
  schema: z.ZodObject<any>
  initialValues: T
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

export function useFormValidation<T extends Record<string, any>>({
  schema,
  initialValues,
  validateOnChange = true,
  validateOnBlur = true
}: UseFormValidationOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isValid, setIsValid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validate a single field
  const validateField = useCallback((fieldName: keyof T, value: any) => {
    try {
      // Create a partial schema for just this field
      const fieldSchema = schema.pick({ [fieldName]: true } as any)
      fieldSchema.parse({ [fieldName]: value })
      return null
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0]?.message || 'Invalid value'
      }
      return 'Invalid value'
    }
  }, [schema])

  // Validate all fields
  const validateAll = useCallback(() => {
    try {
      schema.parse(values)
      setErrors({})
      setIsValid(true)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.issues.forEach((err) => {
          const fieldName = err.path[0] as string
          newErrors[fieldName] = err.message
        })
        setErrors(newErrors)
        setIsValid(false)
        return false
      }
      setIsValid(false)
      return false
    }
  }, [schema, values])

  // Update field value
  const setValue = useCallback((fieldName: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [fieldName]: value }))
    
    if (validateOnChange) {
      const error = validateField(fieldName, value)
      setErrors(prev => {
        if (error) {
          return { ...prev, [fieldName]: error }
        } else {
          const { [fieldName]: _, ...rest } = prev
          return rest
        }
      })
    }
  }, [validateField, validateOnChange])

  // Handle field blur
  const handleBlur = useCallback((fieldName: keyof T) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }))
    
    if (validateOnBlur) {
      const error = validateField(fieldName, values[fieldName])
      setErrors(prev => {
        if (error) {
          return { ...prev, [fieldName]: error }
        } else {
          const { [fieldName]: _, ...rest } = prev
          return rest
        }
      })
    }
  }, [validateField, validateOnBlur, values])

  // Handle form submission
  const handleSubmit = useCallback(async (
    onSubmit: (values: T) => Promise<void> | void
  ) => {
    setIsSubmitting(true)
    
    try {
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true
        return acc
      }, {} as Record<string, boolean>)
      setTouched(allTouched)
      
      // Validate all fields
      const isValid = validateAll()
      
      if (!isValid) {
        return false
      }
      
      // Submit the form
      await onSubmit(values)
      return true
    } catch (error) {
      console.error('Form submission error:', error)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validateAll])

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsValid(false)
    setIsSubmitting(false)
  }, [initialValues])

  // Get field props for input components
  const getFieldProps = useCallback((fieldName: keyof T) => ({
    value: values[fieldName] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValue(fieldName, e.target.value)
    },
    onBlur: () => handleBlur(fieldName),
    error: touched[fieldName] ? errors[fieldName as string] : undefined,
    hasError: touched[fieldName] && !!errors[fieldName as string]
  }), [values, errors, touched, setValue, handleBlur])

  // Update validation state when values change
  useEffect(() => {
    if (validateOnChange) {
      validateAll()
    }
  }, [values, validateOnChange, validateAll])

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    setValue,
    handleBlur,
    handleSubmit,
    reset,
    getFieldProps,
    validateField,
    validateAll
  }
}

// Common validation schemas
export const commonSchemas = {
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional().refine(
    (val) => !val || /^\+?[\d\s\-\(\)]+$/.test(val),
    'Enter a valid phone number'
  ),
  url: z.string().optional().refine(
    (val) => !val || /^https?:\/\/.+/.test(val),
    'Enter a valid URL starting with http:// or https://'
  ),
  required: (message = 'This field is required') => z.string().min(1, message),
  optional: z.string().optional(),
  number: z.string().optional().refine(
    (val) => !val || !isNaN(Number(val)),
    'Enter a valid number'
  )
}

// Form validation utilities
export const formUtils = {
  // Check if form has any errors
  hasErrors: (errors: Record<string, string>) => Object.keys(errors).length > 0,
  
  // Get first error message
  getFirstError: (errors: Record<string, string>) => {
    const firstKey = Object.keys(errors)[0]
    return firstKey ? errors[firstKey] : null
  },
  
  // Check if field has been touched and has error
  shouldShowError: (touched: Record<string, boolean>, errors: Record<string, string>, fieldName: string) => {
    return touched[fieldName] && !!errors[fieldName]
  },
  
  // Get error message for field
  getFieldError: (touched: Record<string, boolean>, errors: Record<string, string>, fieldName: string) => {
    return touched[fieldName] ? errors[fieldName] : undefined
  }
}
