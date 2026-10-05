import { cn } from './utils'
import { solidColor, solidHover, type BauhausColor, type Size } from './types'

const sizes: Record<Size, string> = {
  sm: 'bui-h-9 bui-px-3 bui-text-sm bui-gap-1.5',
  md: 'bui-h-11 bui-px-5 bui-text-base bui-gap-2',
  lg: 'bui-h-14 bui-px-7 bui-text-lg bui-gap-2.5',
}
const outlineColor: Record<BauhausColor, string> = {
  red: 'bui-text-bred-ink hover:bui-bg-bred-dark hover:bui-text-white',
  blue: 'bui-text-bblue-ink hover:bui-bg-bblue hover:bui-text-white',
  yellow: 'bui-text-byellow-ink hover:bui-bg-byellow hover:bui-text-coal',
  ink: 'bui-text-ink hover:bui-bg-ink hover:bui-text-paper',
}
const ghostColor: Record<BauhausColor, string> = {
  red: 'bui-text-bred-ink hover:bui-bg-bred/10',
  blue: 'bui-text-bblue-ink hover:bui-bg-bblue/10',
  yellow: 'bui-text-byellow-ink hover:bui-bg-byellow/20',
  ink: 'bui-text-ink hover:bui-bg-ink/10',
}

const intentStyles = {
  primary:
    'bui-bg-[rgb(var(--bui-action-primary-fill))] bui-text-[rgb(var(--bui-action-primary-foreground))] hover:bui-bg-[rgb(var(--bui-action-primary-hover))] bui-press-hard',
  secondary:
    'bui-bg-transparent bui-text-[rgb(var(--bui-action-secondary-foreground))] hover:bui-bg-[rgb(var(--bui-action-secondary-hover))] hover:bui-text-[rgb(var(--bui-action-secondary-hover-foreground))]',
  destructive:
    'bui-bg-[rgb(var(--bui-action-destructive-fill))] bui-text-[rgb(var(--bui-action-destructive-foreground))] hover:bui-bg-[rgb(var(--bui-action-destructive-hover))] bui-press-hard',
}

/** Internal visual contract shared by real buttons and site navigation anchors. */
export function actionStyles({
  variant = 'solid',
  color = 'ink',
  size = 'md',
  intent,
}: {
  variant?: 'solid' | 'outline' | 'ghost'
  color?: BauhausColor
  size?: Size
  intent?: 'primary' | 'secondary' | 'destructive'
} = {}) {
  return cn(
    'bui-reset bui-press bui-inline-flex bui-items-center bui-justify-center bui-border-3 bui-border-ink bui-font-display bui-font-semibold bui-uppercase bui-tracking-wide bui-no-underline',
    'disabled:bui-cursor-not-allowed disabled:bui-opacity-50 disabled:bui-shadow-none',
    sizes[size],
    intent
      ? intentStyles[intent]
      : cn(
          variant === 'solid' && cn(solidColor[color], solidHover[color], 'bui-press-hard'),
          variant === 'outline' && cn('bui-bg-transparent bui-press-hard', outlineColor[color]),
          variant === 'ghost' && cn('bui-border-transparent bui-bg-transparent', ghostColor[color]),
        ),
  )
}
