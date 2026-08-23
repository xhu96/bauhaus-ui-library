import {
  createContext,
  useContext,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'
import { solidColor, type BauhausColor } from '@/lib/types'
import { composeEventHandlers } from '@/lib/composeEventHandlers'

interface TabsContextValue {
  value: string
  setValue: (v: string) => void
  baseId: string
  register: (value: string, el: HTMLButtonElement | null) => void
  focusAdjacent: (current: string, dir: 1 | -1) => void
  focusEdge: (edge: 'first' | 'last') => void
  isFirst: (value: string) => boolean
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

  const [firstKey, setFirstKey] = useState<string | null>(null)

  const register = (key: string, el: HTMLButtonElement | null) => {
    if (el) {
      triggers.current.set(key, el)
      if (!order.current.includes(key)) {
        order.current.push(key)
        if (order.current.length === 1) {
          setFirstKey(key)
          // Auto-select the first tab in uncontrolled mode when no defaultValue
          if (!isControlled && uncontrolled === '') {
            setUncontrolled(key)
          }
        }
      }
    } else {
      triggers.current.delete(key)
      order.current = order.current.filter((k) => k !== key)
      if (firstKey === key) {
        setFirstKey(order.current[0] ?? null)
      }
    }
  }

  const isFirst = (val: string) => firstKey === val || order.current[0] === val

  const focusAdjacent = (current: string, dir: 1 | -1) => {
    const keys = order.current.filter((key) => !triggers.current.get(key)?.disabled)
    const idx = keys.indexOf(current)
    if (idx === -1) return
    const nextKey = keys[(idx + dir + keys.length) % keys.length]
    const el = triggers.current.get(nextKey)
    if (el) {
      el.focus()
      setValue(nextKey)
    }
  }

  const focusEdge = (edge: 'first' | 'last') => {
    const keys = order.current.filter((key) => !triggers.current.get(key)?.disabled)
    const nextKey = edge === 'first' ? keys[0] : keys[keys.length - 1]
    const el = nextKey ? triggers.current.get(nextKey) : undefined
    if (el && nextKey) {
      el.focus()
      setValue(nextKey)
    }
  }

  return (
    <TabsContext.Provider value={{ value, setValue, baseId, register, focusAdjacent, focusEdge, isFirst }}>
      <div className={cn('bui-reset', 'bui-flex bui-flex-col bui-gap-4', className)} {...props}>
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
      className={cn(
        'bui-reset',
        'bui-flex bui-flex-wrap bui-items-end bui-gap-2 bui-border-b-3 bui-border-ink',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface TabsTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
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
  onClick,
  onKeyDown,
  ...props
}: TabsTriggerProps) {
  const {
    value: active,
    setValue,
    baseId,
    register,
    focusAdjacent,
    focusEdge,
    isFirst,
  } = useTabsContext('TabsTrigger')
  const selected = active === value

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      focusAdjacent(value, 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      focusAdjacent(value, -1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      focusEdge('first')
    } else if (e.key === 'End') {
      e.preventDefault()
      focusEdge('last')
    }
  }

  return (
    <button
      {...props}
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={selected || (!active && isFirst(value)) ? 0 : -1}
      ref={(el) => register(value, el)}
      onClick={composeEventHandlers(onClick, () => setValue(value))}
      onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      className={cn(
        'bui-reset',
        'bui-press -bui-mb-[3px] bui-inline-flex bui-items-center bui-gap-2 bui-border-3 bui-px-4 bui-py-2 bui-font-display bui-text-sm bui-font-semibold bui-uppercase bui-tracking-wide',
        selected
          ? cn('bui-border-ink', solidColor[color])
          : 'bui-border-transparent bui-bg-transparent bui-text-ink-muted hover:bui-text-ink',
        className,
      )}
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
      {...props}
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      className={cn('bui-reset', 'bui-animate-fade-in', className)}
    >
      {children}
    </div>
  )
}
