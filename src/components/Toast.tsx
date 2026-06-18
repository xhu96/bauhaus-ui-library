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

interface ToastContextValue {
  toast: (opts: ToastOptions) => string
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const statusIconColor: Record<ToastStatus, string> = {
  info: 'text-bblue',
  success: 'text-bblue',
  warning: 'text-byellow-ink',
  danger: 'text-bred-ink',
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
        'pointer-events-none fixed left-4 right-4 z-[60] flex w-auto flex-col gap-3 sm:left-auto sm:w-full sm:max-w-sm',
        position === 'top-right' ? 'top-4' : 'bottom-4',
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
        'pointer-events-auto flex items-start gap-3 border-3 border-ink bg-surface p-4 shadow-hard animate-slide-in-right',
      )}
    >
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', statusIconColor[status])} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="font-display font-bold tracking-tight text-ink">{toast.title}</p>
        {toast.description && <p className="mt-1 text-sm text-ink-muted">{toast.description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Close"
        className="press -mr-1 -mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center border-3 border-ink bg-surface text-ink hover:bg-ink hover:text-paper"
      >
        <X className="h-3.5 w-3.5" aria-hidden />
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
