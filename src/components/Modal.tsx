import { useRef, type HTMLAttributes, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Size } from '@/lib/types'
import { useDialogBehavior } from './useDialogBehavior'

export interface ModalProps {
  /** Whether the modal is visible. */
  open: boolean
  /** Called when the modal requests to close (ESC, backdrop, close button). */
  onClose: () => void
  /** Optional title rendered in a bordered header. */
  title?: string
  /** Accessible name used when no visible title is rendered. */
  'aria-label'?: string
  /** Controls the panel max-width. */
  size?: Size
  /** Close when the backdrop is clicked. Defaults to true. */
  closeOnBackdrop?: boolean
  children?: ReactNode
}

const sizes: Record<Size, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

/**
 * Centered modal dialog rendered in a portal with a semi-opaque ink backdrop.
 * Locks body scroll, traps initial focus on the panel, closes on ESC/backdrop.
 */
export function Modal({
  open,
  onClose,
  title,
  'aria-label': ariaLabel,
  size = 'md',
  closeOnBackdrop = true,
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useDialogBehavior(open, panelRef, onClose)

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 animate-fade-in"
      onMouseDown={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? ariaLabel}
        tabIndex={-1}
        className={cn(
          'relative w-full border-3 border-ink bg-surface shadow-hard-lg outline-none animate-pop-in',
          sizes[size],
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="press absolute right-2 top-2 inline-flex h-11 w-11 shrink-0 items-center justify-center border-3 border-ink bg-surface text-ink hover:bg-ink hover:text-paper"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
        {title && (
          <ModalHeader>
            <h2 className="font-display text-xl font-bold tracking-tight text-ink">{title}</h2>
          </ModalHeader>
        )}
        {children}
      </div>
    </div>,
    document.body,
  )
}

/** Bordered header section for a Modal. */
export function ModalHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border-b-3 border-ink p-5 pr-14', className)} {...props} />
}

/** Padded body section for a Modal. */
export function ModalBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5', className)} {...props} />
}

/** Bordered footer section for a Modal, typically holding actions. */
export function ModalFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-end gap-3 border-t-3 border-ink p-5', className)}
      {...props}
    />
  )
}
