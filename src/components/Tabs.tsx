import {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'
import { solidColor, type BauhausColor } from '@/lib/types'

interface TabsContextValue {
  value: string
  setValue: (v: string) => void
  baseId: string
  register: (value: string, el: HTMLButtonElement | null) => void
  focusAdjacent: (current: string, dir: 1 | -1) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext(part: string): TabsContextValue {
  const ctx = useContext(TabsContext)
  if (!ctx) {
    throw new Error(`<${part}> must be used inside a <Tabs> provider.`)
  }
  return ctx
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Controlled active tab value. */
  value?: string
  /** Initial active tab value when uncontrolled. */
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: ReactNode
}

/**
 * Compound tabs container. Shares the active value via context so triggers and
 * panels stay in sync. Supports controlled and uncontrolled use.
 */
export function Tabs({
  value: controlledValue,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? '')
  const baseId = useId()
  const triggers = useRef(new Map<string, HTMLButtonElement>())
  const order = useRef<string[]>([])

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolled

  const setValue = (next: string) => {
    if (!isControlled) setUncontrolled(next)
    onValueChange?.(next)
  }

  const register = (key: string, el: HTMLButtonElement | null) => {
    if (el) {
      triggers.current.set(key, el)
      if (!order.current.includes(key)) order.current.push(key)
    } else {
      triggers.current.delete(key)
      order.current = order.current.filter((k) => k !== key)
    }
  }

  const focusAdjacent = (current: string, dir: 1 | -1) => {
    const keys = order.current
    const idx = keys.indexOf(current)
    if (idx === -1) return
    const nextKey = keys[(idx + dir + keys.length) % keys.length]
    const el = triggers.current.get(nextKey)
    if (el) {
      el.focus()
      setValue(nextKey)
    }
  }

  return (
    <TabsContext.Provider value={{ value, setValue, baseId, register, focusAdjacent }}>
      <div className={cn('flex flex-col gap-4', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

/**
 * Row of tab triggers. Renders a tablist with the Bauhaus baseline border.
 */
export function TabsList({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn('flex flex-wrap items-end gap-2 border-b-3 border-ink', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface TabsTriggerProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, 'color'> {
  value: string
  color?: BauhausColor
  children: ReactNode
}

/**
 * A single tab. Active triggers fill with a solid color and a bordered tab;
 * inactive ones stay plain. Arrow keys move between triggers.
 */
export function TabsTrigger({
  value,
  color = 'blue',
  className,
  children,
  ...props
}: TabsTriggerProps) {
  const { value: active, setValue, baseId, register, focusAdjacent } = useTabsContext('TabsTrigger')
  const selected = active === value

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      focusAdjacent(value, 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      focusAdjacent(value, -1)
    }
  }

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      ref={(el) => register(value, el)}
      onClick={() => setValue(value)}
      onKeyDown={onKeyDown}
      className={cn(
        'press -mb-[3px] inline-flex items-center gap-2 border-3 px-4 py-2 font-display text-sm font-semibold uppercase tracking-wide',
        selected
          ? cn('border-ink', solidColor[color])
          : 'border-transparent bg-transparent text-ink-muted hover:text-ink',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string
  children: ReactNode
}

/**
 * Panel tied to a trigger value. Only the active panel renders.
 */
export function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const { value: active, baseId } = useTabsContext('TabsContent')
  if (active !== value) return null

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      className={cn('animate-fade-in', className)}
      {...props}
    >
      {children}
    </div>
  )
}
