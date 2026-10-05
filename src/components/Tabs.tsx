import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  orientation: 'horizontal' | 'vertical'
  setValue: (v: string) => void
  baseId: string
  register: (value: string, el: HTMLButtonElement | null) => void
  focusAdjacent: (current: string, dir: 1 | -1) => void
  focusEdge: (edge: 'first' | 'last') => void
  tabStop: string
  setTabStop: (value: string) => void
  sync: () => void
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
  /** Trigger layout and arrow-key axis. Defaults to horizontal; vertical tabs use Up/Down. */
  orientation?: 'horizontal' | 'vertical'
  onValueChange?: (value: string) => void
  children: ReactNode
}

/**
 * Compound tabs container. Shares the active value via context so triggers and
 * panels stay in sync. Uncontrolled selection falls back to the first enabled
 * trigger in DOM order when unavailable, without notifying onValueChange.
 * Controlled selection stays caller-owned; its enabled roving focus fallback
 * can differ from the selection. With no enabled triggers there is no tab stop.
 * Horizontal tabs use Left/Right (respecting RTL); vertical tabs use Up/Down.
 * Home/End select the first/last enabled trigger in either orientation.
 */
export function Tabs({
  value: controlledValue,
  defaultValue,
  orientation = 'horizontal',
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? '')
  const baseId = useId()
  const triggers = useRef(new Map<string, HTMLButtonElement>())
  const [, updateRegistry] = useState(0)
  const [tabStop, setTabStop] = useState('')
  const previousValue = useRef<string | undefined>(undefined)

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolled

  const setValue = (next: string) => {
    setTabStop(next)
    if (!isControlled) setUncontrolled(next)
    onValueChange?.(next)
  }

  const register = useCallback((key: string, el: HTMLButtonElement | null) => {
    if (triggers.current.get(key) === (el ?? undefined)) return
    if (el) triggers.current.set(key, el)
    else triggers.current.delete(key)
    updateRegistry((revision) => revision + 1)
  }, [])

  // Read committed DOM order, including keyed reordering and disabled updates.
  const enabledKeys = () =>
    [...triggers.current.entries()]
      .filter(([, el]) => !el.matches(':disabled'))
      .sort(([, a], [, b]) => (a.compareDocumentPosition(b) & 4 ? -1 : 1))
      .map(([key]) => key)

  const sync = () => {
    const keys = enabledKeys()
    const selectedEnabled = keys.includes(value)
    if (!isControlled && !selectedEnabled && value !== (keys[0] ?? '')) setUncontrolled(keys[0] ?? '')
    const nextStop =
      previousValue.current !== value && selectedEnabled
        ? value
        : keys.includes(tabStop)
          ? tabStop
          : selectedEnabled
            ? value
            : (keys[0] ?? '')
    previousValue.current = value
    if (nextStop !== tabStop) setTabStop(nextStop)
  }
  useEffect(sync)

  const focusAdjacent = (current: string, dir: 1 | -1) => {
    const keys = enabledKeys()
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
    const keys = enabledKeys()
    const nextKey = edge === 'first' ? keys[0] : keys[keys.length - 1]
    const el = nextKey ? triggers.current.get(nextKey) : undefined
    if (el && nextKey) {
      el.focus()
      setValue(nextKey)
    }
  }

  return (
    <TabsContext.Provider
      value={{
        value,
        orientation,
        setValue,
        baseId,
        register,
        focusAdjacent,
        focusEdge,
        tabStop,
        setTabStop,
        sync,
      }}
    >
      <div
        className={cn(
          'bui-reset',
          'bui-flex bui-gap-4',
          orientation === 'vertical' ? 'bui-flex-row' : 'bui-flex-col',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  )
}

/**
 * Trigger list. Inherits layout and aria-orientation from Tabs; the default is
 * a horizontal row with the Bauhaus baseline border.
 */
export function TabsList({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const orientation = useContext(TabsContext)?.orientation ?? 'horizontal'
  return (
    <div
      {...props}
      role="tablist"
      aria-orientation={orientation}
      className={cn(
        'bui-reset',
        'bui-flex bui-gap-2 bui-border-ink',
        orientation === 'vertical'
          ? 'bui-flex-col bui-items-stretch bui-border-e-3'
          : 'bui-flex-wrap bui-items-end bui-border-b-3',
        className,
      )}
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
 * inactive ones stay plain. Arrow keys along the tablist's orientation move
 * focus and activate a tab automatically.
 */
export function TabsTrigger({
  value,
  color = 'blue',
  className,
  children,
  onClick,
  onKeyDown,
  onFocus,
  ...props
}: TabsTriggerProps) {
  const {
    value: active,
    orientation,
    setValue,
    baseId,
    register,
    focusAdjacent,
    focusEdge,
    tabStop,
    setTabStop,
    sync,
  } = useTabsContext('TabsTrigger')
  const selected = active === value
  const registerRef = useCallback((el: HTMLButtonElement | null) => register(value, el), [register, value])
  useEffect(sync)

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const rtl =
      e.currentTarget.closest('[dir]')?.getAttribute('dir') === 'rtl' ||
      getComputedStyle(e.currentTarget).direction === 'rtl'
    if (orientation === 'horizontal' && e.key === 'ArrowRight') {
      e.preventDefault()
      focusAdjacent(value, rtl ? -1 : 1)
    } else if (orientation === 'horizontal' && e.key === 'ArrowLeft') {
      e.preventDefault()
      focusAdjacent(value, rtl ? 1 : -1)
    } else if (orientation === 'vertical' && e.key === 'ArrowDown') {
      e.preventDefault()
      focusAdjacent(value, 1)
    } else if (orientation === 'vertical' && e.key === 'ArrowUp') {
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
      tabIndex={!props.disabled && tabStop === value ? 0 : -1}
      ref={registerRef}
      onFocus={composeEventHandlers(onFocus, () => setTabStop(value))}
      onClick={composeEventHandlers(onClick, () => setValue(value))}
      onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
      className={cn(
        'bui-reset',
        'bui-press bui-inline-flex bui-items-center bui-gap-2 bui-border-3 bui-px-4 bui-py-2 bui-font-display bui-text-sm bui-font-semibold bui-uppercase bui-tracking-wide',
        orientation === 'vertical' ? '-bui-me-[3px]' : '-bui-mb-[3px]',
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
  /** Preserve local state while inactive. Hidden panels remain mounted; effects keep running. Defaults to false. */
  keepMounted?: boolean
  children: ReactNode
}

/**
 * Panel tied to a trigger value. Inactive panels unmount by default. Set
 * `keepMounted` to preserve inputs and local state while hiding inactive panels.
 */
export function TabsContent({
  value,
  keepMounted = false,
  className,
  children,
  hidden,
  style,
  ...props
}: TabsContentProps) {
  const { value: active, baseId } = useTabsContext('TabsContent')
  const selected = active === value
  if (!selected && !keepMounted) return null

  return (
    <div
      {...props}
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={selected ? 0 : -1}
      hidden={!selected || hidden}
      style={selected ? style : { ...style, display: 'none' }}
      className={cn('bui-reset', selected && 'bui-animate-fade-in', className)}
    >
      {children}
    </div>
  )
}
