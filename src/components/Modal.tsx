import { useEffect, useId, useRef, useState, type HTMLAttributes, type ReactNode } from 'react'
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
  /** Translated close button label. Defaults to Close. */
  closeLabel?: string
  /** Same-document themed portal host. Keep it outside transformed or clipping ancestors. */
  portalContainer?: HTMLElement | null
  /** Controls the panel max-width. */
  size?: Size
  /** Close when the backdrop is clicked. Defaults to true. */
  closeOnBackdrop?: boolean
  children?: ReactNode
}

const sizes: Record<Size, string> = {
  sm: 'bui-max-w-sm',
  md: 'bui-max-w-lg',
  lg: 'bui-max-w-2xl',
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
  closeLabel = 'Close',
  portalContainer,
  size = 'md',
  closeOnBackdrop = true,
  children,
}: ModalProps) {
  const [mounted, setMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => setMounted(true), [])
  useDialogBehavior(mounted && open, panelRef, onClose, portalContainer)
  useEffect(() => {
    if (import.meta.env.DEV && open && !title?.trim() && !ariaLabel?.trim())
      console.warn('Modal requires a title or aria-label for an accessible name.')
  }, [open, title, ariaLabel])

  if (!open || !mounted) return null

  return createPortal(
    <div
      className="bui-reset bui-fixed bui-inset-0 bui-z-50 bui-flex bui-items-center bui-justify-center bui-bg-ink/40 bui-p-4 bui-animate-fade-in"
      onMouseDown={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={ariaLabel}
        tabIndex={-1}
        style={{ maxHeight: 'calc(100dvh - 2rem)' }}
        className={cn(
          'bui-reset',
          'bui-relative bui-w-full bui-overflow-y-auto bui-border-3 bui-border-ink bui-bg-surface bui-text-ink bui-shadow-hard-lg bui-outline-none bui-animate-fade-in',
          sizes[size],
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="bui-reset bui-press bui-sticky bui-top-2 bui-z-10 bui-ms-auto bui-me-2 bui-mt-2 bui-flex bui-h-11 bui-w-11 bui-shrink-0 bui-items-center bui-justify-center bui-border-3 bui-border-ink bui-bg-surface bui-text-ink hover:bui-bg-ink hover:bui-text-paper"
        >
          <X className="bui-reset bui-h-4 bui-w-4" aria-hidden />
        </button>
        {title && (
          <ModalHeader>
            <h2
              id={titleId}
              className="bui-reset bui-m-0 bui-font-display bui-text-xl bui-font-bold bui-tracking-tight bui-text-ink"
            >
              {title}
            </h2>
          </ModalHeader>
        )}
        {children}
      </div>
    </div>,
    portalContainer ?? document.body,
  )
}

/** Bordered header section for a Modal. */
export function ModalHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bui-reset', 'bui-border-b-3 bui-border-ink bui-p-5 bui-pe-14', className)}
      {...props}
    />
  )
}

/** Padded body section for a Modal. */
export function ModalBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('bui-reset', 'bui-p-5', className)} {...props} />
}

/** Bordered footer section for a Modal, typically holding actions. */
export function ModalFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bui-reset',
        'bui-flex bui-items-center bui-justify-end bui-gap-3 bui-border-t-3 bui-border-ink bui-p-5',
        className,
      )}
      {...props}
    />
  )
}
