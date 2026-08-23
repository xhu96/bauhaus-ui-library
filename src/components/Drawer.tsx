import { useEffect, useRef, useState, type ReactNode } from 'react'
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
  const [mounted, setMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])
  useDialogBehavior(mounted && open, panelRef, onClose)

  if (!open || !mounted) return null

  return createPortal(
    <div
      className="bui-reset bui-fixed bui-inset-0 bui-z-50 bui-bg-ink/40 bui-animate-fade-in"
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
          'bui-reset',
          'bui-absolute bui-top-0 bui-flex bui-h-full bui-flex-col bui-bg-paper bui-outline-none',
          side === 'right'
            ? 'bui-right-0 bui-border-l-3 bui-border-ink bui-animate-slide-in-right'
            : 'bui-left-0 bui-border-r-3 bui-border-ink bui-animate-slide-in-left',
        )}
      >
        <div className="bui-reset bui-flex bui-items-center bui-justify-between bui-gap-3 bui-border-b-3 bui-border-ink bui-p-5">
          {title ? (
            <h2 className="bui-reset bui-m-0 bui-font-display bui-text-xl bui-font-bold bui-tracking-tight bui-text-ink">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="bui-reset bui-press bui-inline-flex bui-h-11 bui-w-11 bui-shrink-0 bui-items-center bui-justify-center bui-border-3 bui-border-ink bui-bg-surface bui-text-ink hover:bui-bg-ink hover:bui-text-paper"
          >
            <X className="bui-reset bui-h-4 bui-w-4" aria-hidden />
          </button>
        </div>
        <div className="bui-reset bui-flex-1 bui-overflow-y-auto bui-p-5">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
