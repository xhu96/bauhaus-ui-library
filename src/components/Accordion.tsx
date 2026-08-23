import {
  createContext,
  useContext,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { composeEventHandlers } from '@/lib/composeEventHandlers'

interface AccordionContextValue {
  isOpen: (value: string) => boolean
  toggle: (value: string) => void
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

function useAccordionContext(part: string): AccordionContextValue {
  const ctx = useContext(AccordionContext)
  if (!ctx) {
    throw new Error(`<${part}> must be used inside an <Accordion> provider.`)
  }
  return ctx
}

interface AccordionItemContextValue {
  value: string
  triggerId: string
  contentId: string
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null)

function useAccordionItemContext(part: string): AccordionItemContextValue {
  const ctx = useContext(AccordionItemContext)
  if (!ctx) {
    throw new Error(`<${part}> must be used inside an <AccordionItem>.`)
  }
  return ctx
}

function toArray(value: string | string[] | undefined): string[] {
  if (value === undefined || value === '') return []
  return Array.isArray(value) ? value : [value]
}

export interface AccordionBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  children: ReactNode
}

export interface AccordionSingleProps extends AccordionBaseProps {
  type?: 'single'
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export interface AccordionMultipleProps extends AccordionBaseProps {
  type: 'multiple'
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps

/**
 * Compound accordion. Manages the open item set via context; collapse behavior
 * depends on `type`.
 */
export function Accordion(props: AccordionProps) {
  const { type = 'single', value, defaultValue, className, children, onValueChange, ...htmlProps } = props
  const [open, setOpen] = useState<string[]>(() => toArray(defaultValue))
  const isControlled = value !== undefined
  const current = isControlled ? toArray(value) : open

  const isOpen = (itemValue: string) => current.includes(itemValue)

  const toggle = (itemValue: string) => {
    const has = current.includes(itemValue)
    const next =
      type === 'single'
        ? has
          ? []
          : [itemValue]
        : has
          ? current.filter((openValue) => openValue !== itemValue)
          : [...current, itemValue]

    if (!isControlled) setOpen(next)
    if (type === 'multiple') {
      ;(onValueChange as AccordionMultipleProps['onValueChange'])?.(next)
    } else {
      ;(onValueChange as AccordionSingleProps['onValueChange'])?.(next[0] ?? '')
    }
  }

  return (
    <AccordionContext.Provider value={{ isOpen, toggle }}>
      <div
        className={cn('bui-reset', 'bui-flex bui-flex-col bui-border-3 bui-border-ink', className)}
        {...htmlProps}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string
  children: ReactNode
}

/**
 * A single collapsible row. Provides its ids and value to its trigger/content.
 */
export function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  const baseId = useId()
  const ctx: AccordionItemContextValue = {
    value,
    triggerId: `${baseId}-trigger`,
    contentId: `${baseId}-content`,
  }

  return (
    <AccordionItemContext.Provider value={ctx}>
      <div
        className={cn('bui-reset', 'bui-border-ink [&:not(:last-child)]:bui-border-b-3', className)}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

/**
 * Full-width clickable header. The chevron rotates when the item is open.
 * Enter/Space toggles.
 */
export function AccordionTrigger({
  className,
  children,
  onClick,
  onKeyDown,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { isOpen, toggle } = useAccordionContext('AccordionTrigger')
  const { value, triggerId, contentId } = useAccordionItemContext('AccordionTrigger')
  const open = isOpen(value)

  return (
    <button
      {...props}
      type="button"
      id={triggerId}
      aria-expanded={open}
      aria-controls={contentId}
      onClick={composeEventHandlers(onClick, () => toggle(value))}
      onKeyDown={onKeyDown}
      className={cn(
        'bui-reset',
        'bui-press bui-flex bui-w-full bui-items-center bui-justify-between bui-gap-3 bui-px-4 bui-py-3 bui-text-left bui-font-display bui-text-base bui-font-semibold bui-uppercase bui-tracking-wide bui-text-ink',
        open ? 'bui-bg-byellow' : 'bui-bg-transparent hover:bui-bg-paper-dark',
        className,
      )}
    >
      {children}
      <ChevronDown
        className={cn(
          'bui-reset',
          'bui-h-5 bui-w-5 bui-shrink-0 bui-transition-transform bui-duration-200',
          open && 'bui-rotate-180',
        )}
        aria-hidden
      />
    </button>
  )
}

/**
 * Region revealed when its item is open.
 */
export function AccordionContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useAccordionContext('AccordionContent')
  const { value, triggerId, contentId } = useAccordionItemContext('AccordionContent')
  if (!isOpen(value)) return null

  return (
    <div
      {...props}
      role="region"
      id={contentId}
      aria-labelledby={triggerId}
      className={cn(
        'bui-reset',
        'bui-animate-fade-in bui-border-t-3 bui-border-ink bui-px-4 bui-py-3 bui-text-ink',
        className,
      )}
    >
      {children}
    </div>
  )
}
