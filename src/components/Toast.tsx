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
import { useActiveDialog } from './dialogLayers'

export type ToastStatus = Status

export interface ToastOptions {
  title: string
  description?: string
  status?: ToastStatus
  /** Auto-dismiss delay in milliseconds. Defaults to 4000; 0 persists. Pauses on hover, focus, and a hidden page. */
  duration?: number
}

interface ToastRecord extends ToastOptions {
  id: string
}

interface ToastTimer {
  remaining: number
  started: number
  handle?: ReturnType<typeof setTimeout>
  paused: Set<string>
}

export interface ToastContextValue {
  toast: (opts: ToastOptions) => string
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const statusIconColor: Record<ToastStatus, string> = {
  info: 'bui-text-bblue-ink',
  success: 'bui-text-bblue-ink',
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
  maxToasts = 5,
  dismissLabel = 'Close',
  portalContainer,
}: {
  children: ReactNode
  position?: 'top-right' | 'bottom-right'
  /** Maximum visible notifications, default 5. Oldest are discarded, not queued. Minimum 1. */
  maxToasts?: number
  /** Translated dismiss button label. Defaults to Close for compatibility. */
  dismissLabel?: string
  /** Same-document themed host outside transformed/clipping ancestors. An open dialog's panel takes precedence. */
  portalContainer?: HTMLElement | null
}) {
  const [toasts, setToasts] = useState<ToastRecord[]>([])
  const records = useRef<ToastRecord[]>([])
  const timers = useRef(new Map<string, ToastTimer>())
  const mountedRef = useRef(false)
  const limit = Number.isFinite(maxToasts) ? Math.max(1, Math.floor(maxToasts)) : 5

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id)
    clearTimeout(timer?.handle)
    timers.current.delete(id)
    records.current = records.current.filter((t) => t.id !== id)
    setToasts([...records.current])
  }, [])

  const schedule = useCallback(
    (id: string, timer: ToastTimer) => {
      if (!mountedRef.current || timer.handle !== undefined || timer.paused.size || document.hidden) return
      timer.started = Date.now()
      timer.handle = setTimeout(() => dismiss(id), timer.remaining)
    },
    [dismiss],
  )

  const pause = useCallback(
    (id: string, reason: string, value: boolean) => {
      const timer = timers.current.get(id)
      if (!timer) return
      if (value) {
        timer.paused.add(reason)
        if (timer.handle !== undefined) {
          clearTimeout(timer.handle)
          timer.handle = undefined
          timer.remaining = Math.max(0, timer.remaining - (Date.now() - timer.started))
        }
      } else {
        timer.paused.delete(reason)
        schedule(id, timer)
      }
    },
    [schedule],
  )

  const toast = useCallback(
    (opts: ToastOptions) => {
      const id = Math.random().toString(36).slice(2)
      const duration = opts.duration ?? 4000
      records.current = [...records.current, { ...opts, id }]
      while (records.current.length > limit) dismiss(records.current[0].id)
      setToasts([...records.current])
      if (duration > 0) {
        const timer: ToastTimer = { remaining: duration, started: 0, paused: new Set() }
        timers.current.set(id, timer)
        schedule(id, timer)
      }
      return id
    },
    [dismiss, limit, schedule],
  )

  useEffect(() => {
    mountedRef.current = true
    const map = timers.current
    const visibility = () => map.forEach((_, id) => pause(id, 'page', document.hidden))
    visibility()
    document.addEventListener('visibilitychange', visibility)
    return () => {
      mountedRef.current = false
      document.removeEventListener('visibilitychange', visibility)
      map.forEach((timer) => {
        if (timer.handle !== undefined)
          timer.remaining = Math.max(0, timer.remaining - (Date.now() - timer.started))
        clearTimeout(timer.handle)
        timer.handle = undefined
      })
    }
  }, [pause])

  useEffect(() => {
    while (records.current.length > limit) dismiss(records.current[0].id)
  }, [limit, dismiss])

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport
        toasts={toasts}
        position={position}
        onDismiss={dismiss}
        onPause={pause}
        dismissLabel={dismissLabel}
        portalContainer={portalContainer}
      />
    </ToastContext.Provider>
  )
}

function ToastViewport({
  toasts,
  position,
  onDismiss,
  onPause,
  dismissLabel,
  portalContainer,
}: {
  toasts: ToastRecord[]
  position: 'top-right' | 'bottom-right'
  onDismiss: (id: string) => void
  onPause: (id: string, reason: string, value: boolean) => void
  dismissLabel: string
  portalContainer?: HTMLElement | null
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const active = useActiveDialog()
  if (!mounted) return null

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      onFocus={(event) => {
        // Firefox can leave a partly visible focused control clipped. Scroll
        // this viewport only, without moving the surrounding dialog or page.
        const viewport = event.currentTarget
        const bounds = viewport.getBoundingClientRect()
        const control = (event.target as HTMLElement).getBoundingClientRect()
        if (control.top < bounds.top) viewport.scrollTop -= Math.ceil(bounds.top - control.top)
        else if (control.bottom > bounds.bottom)
          viewport.scrollTop += Math.ceil(control.bottom - bounds.bottom)
      }}
      // Keep every notification reachable on short/dynamic viewports. The
      // bottom position leaves room above the stack for the dialog header.
      style={{ maxHeight: 'calc(100dvh - 6rem)', overflowY: 'auto', overscrollBehavior: 'contain' }}
      className={cn(
        'bui-reset',
        'bui-pointer-events-none bui-fixed bui-left-4 bui-right-4 bui-z-[60] bui-flex bui-w-auto bui-flex-col bui-gap-3 sm:bui-left-auto sm:bui-w-full sm:bui-max-w-sm',
        position === 'top-right' ? 'bui-top-4' : 'bui-bottom-4',
      )}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} onPause={onPause} dismissLabel={dismissLabel} />
      ))}
    </div>,
    active ?? portalContainer ?? document.body,
  )
}

function ToastItem({
  toast,
  onDismiss,
  onPause,
  dismissLabel,
}: {
  toast: ToastRecord
  onDismiss: (id: string) => void
  onPause: (id: string, reason: string, value: boolean) => void
  dismissLabel: string
}) {
  const status = toast.status ?? 'info'
  const Icon = statusIcons[status]
  useEffect(
    () => () => {
      onPause(toast.id, 'hover', false)
      onPause(toast.id, 'focus', false)
    },
    [onPause, toast.id],
  )
  return (
    <div
      onMouseEnter={() => onPause(toast.id, 'hover', true)}
      onMouseLeave={() => onPause(toast.id, 'hover', false)}
      onFocus={() => onPause(toast.id, 'focus', true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          onPause(toast.id, 'focus', false)
      }}
      className={cn(
        'bui-reset',
        'bui-pointer-events-auto bui-flex bui-shrink-0 bui-items-start bui-gap-3 bui-border-3 bui-border-ink bui-bg-surface bui-p-4 bui-shadow-hard bui-animate-slide-in-right',
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
        aria-label={dismissLabel}
        className="bui-reset bui-press -bui-me-1 -bui-mt-1 bui-inline-flex bui-h-11 bui-w-11 bui-shrink-0 bui-items-center bui-justify-center bui-border-3 bui-border-ink bui-bg-surface bui-text-ink hover:bui-bg-ink hover:bui-text-paper"
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
