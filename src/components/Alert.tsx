import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Status = 'info' | 'success' | 'warning' | 'danger'

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  status?: Status
  title?: string
  /** Override the default status icon. */
  icon?: ReactNode
  /** When provided, renders a dismiss (X) button. */
  onClose?: () => void
}

/** Adaptive color tint (alpha over the surface) so it works in light and dark. */
const statusTint: Record<Status, string> = {
  info: 'bg-bblue/10',
  success: 'bg-bblue/10',
  warning: 'bg-byellow/15',
  danger: 'bg-bred/10',
}

const statusIconColor: Record<Status, string> = {
  info: 'text-bblue',
  success: 'text-bblue',
  warning: 'text-byellow-dark',
  danger: 'text-bred',
}

const statusIcon: Record<Status, ReactNode> = {
  info: <Info className="h-5 w-5" aria-hidden />,
  success: <CheckCircle2 className="h-5 w-5" aria-hidden />,
  warning: <AlertTriangle className="h-5 w-5" aria-hidden />,
  danger: <XCircle className="h-5 w-5" aria-hidden />,
}

/**
 * Inline feedback banner with a semantic status color, full thick ink border,
 * an adaptive tinted background, a colored status icon and an optional dismiss.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { status = 'info', title, icon, onClose, className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="alert"
      className={cn('flex items-start gap-3 border-3 border-ink p-4', statusTint[status], className)}
      {...props}
    >
      <span className={cn('mt-0.5 shrink-0', statusIconColor[status])}>{icon ?? statusIcon[status]}</span>
      <div className="min-w-0 flex-1">
        {title && <p className="font-display font-bold leading-tight text-ink">{title}</p>}
        {children && <div className={cn('text-sm text-ink-soft', title && 'mt-1')}>{children}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onClose}
          className="press -mr-1 -mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center border-3 border-ink bg-surface text-ink hover:bg-ink hover:text-paper"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  )
})
