import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Status } from '@/lib/types'

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
  info: 'bui-bg-bblue/10',
  success: 'bui-bg-bblue/10',
  warning: 'bui-bg-byellow/15',
  danger: 'bui-bg-bred/10',
}

const statusIconColor: Record<Status, string> = {
  info: 'bui-text-bblue',
  success: 'bui-text-bblue',
  warning: 'bui-text-byellow-ink',
  danger: 'bui-text-bred-ink',
}

const statusIcon: Record<Status, ReactNode> = {
  info: <Info className="bui-reset bui-h-5 bui-w-5" aria-hidden />,
  success: <CheckCircle2 className="bui-reset bui-h-5 bui-w-5" aria-hidden />,
  warning: <AlertTriangle className="bui-reset bui-h-5 bui-w-5" aria-hidden />,
  danger: <XCircle className="bui-reset bui-h-5 bui-w-5" aria-hidden />,
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
      className={cn(
        'bui-reset',
        'bui-flex bui-items-start bui-gap-3 bui-border-3 bui-border-ink bui-p-4',
        statusTint[status],
        className,
      )}
      {...props}
    >
      <span className={cn('bui-reset', 'bui-mt-0.5 bui-shrink-0', statusIconColor[status])}>
        {icon ?? statusIcon[status]}
      </span>
      <div className="bui-reset bui-min-w-0 bui-flex-1">
        {title && (
          <p className="bui-reset bui-m-0 bui-font-display bui-font-bold bui-leading-tight bui-text-ink">
            {title}
          </p>
        )}
        {children && (
          <div className={cn('bui-reset', 'bui-text-sm bui-text-ink-soft', title && 'bui-mt-1')}>
            {children}
          </div>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onClose}
          className="bui-reset bui-press -bui-mr-1 -bui-mt-1 bui-inline-flex bui-h-7 bui-w-7 bui-shrink-0 bui-items-center bui-justify-center bui-border-3 bui-border-ink bui-bg-surface bui-text-ink hover:bui-bg-ink hover:bui-text-paper"
        >
          <X className="bui-reset bui-h-4 bui-w-4" aria-hidden />
        </button>
      )}
    </div>
  )
})
