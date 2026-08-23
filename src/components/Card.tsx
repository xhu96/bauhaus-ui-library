import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { hex, type BauhausColor } from '@/lib/types'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Show the hard offset shadow. */
  shadow?: boolean
  /** Adds a thick colored bar along the top edge. */
  accent?: BauhausColor
  /** White surface instead of paper. */
  surface?: 'paper' | 'white'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { shadow = true, accent, surface = 'white', className, style, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'bui-reset',
        'bui-border-3 bui-border-ink',
        surface === 'white' ? 'bui-bg-surface' : 'bui-bg-paper',
        shadow && 'bui-shadow-hard',
        className,
      )}
      style={{
        ...(accent
          ? { borderTop: `10px solid ${accent === 'ink' ? 'rgb(var(--bui-ink))' : hex[accent]}` }
          : null),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
})

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('bui-reset', 'bui-border-b-3 bui-border-ink bui-p-5', className)} {...props} />
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'bui-reset',
        'bui-m-0 bui-font-display bui-text-xl bui-font-bold bui-tracking-tight bui-text-ink',
        className,
      )}
      {...props}
    />
  )
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('bui-reset', 'bui-m-0 bui-mt-1 bui-text-sm bui-text-ink-muted', className)} {...props} />
  )
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('bui-reset', 'bui-p-5', className)} {...props} />
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bui-reset',
        'bui-flex bui-items-center bui-gap-3 bui-border-t-3 bui-border-ink bui-p-5',
        className,
      )}
      {...props}
    />
  )
}
