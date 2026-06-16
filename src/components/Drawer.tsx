import { useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDialogBehavior } from './useDialogBehavior'

export interface DrawerProps {
  /** Whether the drawer is visible. */
  open: boolean
  /** Called when the drawer requests to close (ESC, backdrop, close button). */
  onClose: () => void
  /** Which edge the drawer slides in from. Defaults to 'right'. */
  side?: 'left' | 'right'
  /** Optional title rendered in a bordered header. */
  title?: string
  /** Accessible name used when no visible title is rendered. */
  'aria-label'?: string
  /** Panel width in pixels. Defaults to 360. */
  width?: number
  children?: ReactNode
}

/**
 * Off-canvas side panel rendered in a portal with a semi-opaque ink backdrop.
 * Slides in from the chosen edge, locks body scroll, closes on ESC/backdrop.
 */
export function Drawer({
  open,
  onClose,
  side = 'right',
  title,
  'aria-label': ariaLabel,
  width = 360,
  children,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useDialogBehavior(open, panelRef, onClose)

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-ink/40 animate-fade-in"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? ariaLabel}
        tabIndex={-1}
        style={{ width, maxWidth: '100%' }}
        className={cn(
          'absolute top-0 flex h-full flex-col bg-paper outline-none',
          side === 'right'
            ? 'right-0 border-l-3 border-ink animate-slide-in-right'
            : 'left-0 border-r-3 border-ink animate-slide-in-left',
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b-3 border-ink p-5">
          {title ? (
            <h2 className="font-display text-xl font-bold tracking-tight text-ink">{title}</h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="press inline-flex h-11 w-11 shrink-0 items-center justify-center border-3 border-ink bg-surface text-ink hover:bg-ink hover:text-paper"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
