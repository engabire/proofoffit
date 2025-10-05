// ...existing code...
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export interface ToastProps {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info'
  duration?: number
  onClose?: (id: string) => void
  className?: string
}

const variantStyles = {
  default: {
    container: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700',
    icon: 'text-slate-600 dark:text-slate-400',
    title: 'text-slate-900 dark:text-slate-100',
    description: 'text-slate-600 dark:text-slate-400'
  },
  success: {
    container: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
    icon: 'text-emerald-600 dark:text-emerald-400',
    title: 'text-emerald-900 dark:text-emerald-100',
    description: 'text-emerald-700 dark:text-emerald-300'
  },
  error: {
    container: 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-900 dark:text-red-100',
    description: 'text-red-700 dark:text-red-300'
  },
  warning: {
    container: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800',
    icon: 'text-amber-600 dark:text-amber-400',
    title: 'text-amber-900 dark:text-amber-100',
    description: 'text-amber-700 dark:text-amber-300'
  },
  info: {
    container: 'bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800',
    icon: 'text-sky-600 dark:text-sky-400',
    title: 'text-sky-900 dark:text-sky-100',
    description: 'text-sky-700 dark:text-sky-300'
  }
}

const icons = {
  default: Info,
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
}

export function Toast({ 
  id, 
  title, 
  description, 
  variant = 'default', 
  onClose, 
  className 
}: ToastProps) {
  const Icon = icons[variant]
  const styles = variantStyles[variant]

  return (
    <div
      className={cn(
        'relative flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm',
        styles.container,
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', styles.icon)} />
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={cn('text-sm font-semibold', styles.title)}>
            {title}
          </h4>
        )}
        {description && (
          <p className={cn('text-sm mt-1', styles.description)}>
            {description}
          </p>
        )}
      </div>
      {onClose && (
        <button
          onClick={() => onClose(id)}
          className={cn(
            'flex-shrink-0 rounded-md p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5',
            styles.icon
          )}
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastProps[]
  onRemove: (id: string) => void
  className?: string
}

export function ToastContainer({ toasts, onRemove, className }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full',
        className
      )}
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onRemove}
        />
      ))}
    </div>
  )
}
