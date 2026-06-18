import {
  createContext,
  useContext,
  useId,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  if (value === undefined) return []
  return Array.isArray(value) ? value : [value]
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** 'single' allows one open item at a time, 'multiple' allows many. */
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  children: ReactNode
}

/**
 * Compound accordion. Manages the open item set via context; collapse behavior
 * depends on `type`.
 */
export function Accordion({ type = 'single', defaultValue, className, children, ...props }: AccordionProps) {
  const [open, setOpen] = useState<string[]>(() => toArray(defaultValue))

  const isOpen = (value: string) => open.includes(value)

  const toggle = (value: string) => {
    setOpen((prev) => {
      const has = prev.includes(value)
      if (type === 'single') {
        return has ? [] : [value]
      }
      return has ? prev.filter((v) => v !== value) : [...prev, value]
    })
  }

  return (
    <AccordionContext.Provider value={{ isOpen, toggle }}>
      <div className={cn('flex flex-col border-3 border-ink', className)} {...props}>
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
      <div className={cn('border-ink [&:not(:last-child)]:border-b-3', className)} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

/**
 * Full-width clickable header. The chevron rotates when the item is open.
 * Enter/Space toggles.
 */
export function AccordionTrigger({ className, children, ...props }: HTMLAttributes<HTMLButtonElement>) {
  const { isOpen, toggle } = useAccordionContext('AccordionTrigger')
  const { value, triggerId, contentId } = useAccordionItemContext('AccordionTrigger')
  const open = isOpen(value)

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle(value)
    }
  }

  return (
    <button
      type="button"
      id={triggerId}
      aria-expanded={open}
      aria-controls={contentId}
      onClick={() => toggle(value)}
      onKeyDown={onKeyDown}
      className={cn(
        'press flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-display text-base font-semibold uppercase tracking-wide text-ink',
        open ? 'bg-byellow' : 'bg-transparent hover:bg-paper-dark',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn('h-5 w-5 shrink-0 transition-transform duration-200', open && 'rotate-180')}
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
      role="region"
      id={contentId}
      aria-labelledby={triggerId}
      className={cn('animate-fade-in border-t-3 border-ink px-4 py-3 text-ink', className)}
      {...props}
    >
      {children}
    </div>
  )
}
