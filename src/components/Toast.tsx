import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Status } from '@/lib/types'

export type ToastStatus = Status

export interface ToastOptions {
  title: string
  description?: string
  status?: ToastStatus
  /** Auto-dismiss delay in milliseconds. Defaults to 4000. */
  duration?: number
}

interface ToastRecord extends ToastOptions {
  id: string
}

export interface ToastContextValue {
  toast: (opts: ToastOptions) => string
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const statusIconColor: Record<ToastStatus, string> = {
  info: 'bui-text-bblue',
  success: 'bui-text-bblue',
  warning: 'bui-text-byellow-ink',
  danger: 'bui-text-bred-ink',
}

const statusIcons: Record<ToastStatus, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
}

/**
 * Provides toast state and renders the toast container in a portal.
 * Wrap your app with this, then call `useToast()` to push toasts.
 */
export function ToastProvider({
  children,
  position = 'bottom-right',
}: {
  children: ReactNode
  position?: 'top-right' | 'bottom-right'
}) {
  const [toasts, setToasts] = useState<ToastRecord[]>([])
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (opts: ToastOptions) => {
      const id = Math.random().toString(36).slice(2)
      const duration = opts.duration ?? 4000
      setToasts((prev) => [...prev, { ...opts, id }])
      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration)
        timers.current.set(id, timer)
      }
      return id
    },
    [dismiss],
  )

  useEffect(() => {
    const map = timers.current
    return () => {
      map.forEach((timer) => clearTimeout(timer))
      map.clear()
    }
  }, [])

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} position={position} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

function ToastViewport({
  toasts,
  position,
  onDismiss,
}: {
  toasts: ToastRecord[]
  position: 'top-right' | 'bottom-right'
  onDismiss: (id: string) => void
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'bui-reset',
        'bui-pointer-events-none bui-fixed bui-left-4 bui-right-4 bui-z-[60] bui-flex bui-w-auto bui-flex-col bui-gap-3 sm:bui-left-auto sm:bui-w-full sm:bui-max-w-sm',
        position === 'top-right' ? 'bui-top-4' : 'bui-bottom-4',
      )}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body,
  )
}

function ToastItem({ toast, onDismiss }: { toast: ToastRecord; onDismiss: (id: string) => void }) {
  const status = toast.status ?? 'info'
  const Icon = statusIcons[status]
  return (
    <div
      className={cn(
        'bui-reset',
        'bui-pointer-events-auto bui-flex bui-items-start bui-gap-3 bui-border-3 bui-border-ink bui-bg-surface bui-p-4 bui-shadow-hard bui-animate-slide-in-right',
      )}
    >
      <Icon
        className={cn('bui-reset', 'bui-mt-0.5 bui-h-5 bui-w-5 bui-shrink-0', statusIconColor[status])}
        aria-hidden
      />
      <div className="bui-reset bui-min-w-0 bui-flex-1">
        <p className="bui-reset bui-m-0 bui-font-display bui-font-bold bui-tracking-tight bui-text-ink">
          {toast.title}
        </p>
        {toast.description && (
          <p className="bui-reset bui-m-0 bui-mt-1 bui-text-sm bui-text-ink-muted">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Close"
        className="bui-reset bui-press -bui-mr-1 -bui-mt-1 bui-inline-flex bui-h-11 bui-w-11 bui-shrink-0 bui-items-center bui-justify-center bui-border-3 bui-border-ink bui-bg-surface bui-text-ink hover:bui-bg-ink hover:bui-text-paper"
      >
        <X className="bui-reset bui-h-3.5 bui-w-3.5" aria-hidden />
      </button>
    </div>
  )
}

/** Access the toast API. Must be called within a ToastProvider. */
// eslint-disable-next-line react-refresh/only-export-components -- provider + hook are intentionally co-located
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>')
  }
  return ctx
}
