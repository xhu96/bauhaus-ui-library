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
        'border-3 border-ink',
        surface === 'white' ? 'bg-surface' : 'bg-paper',
        shadow && 'shadow-hard',
        className,
      )}
      style={{ ...(accent ? { borderTop: `10px solid ${hex[accent]}` } : null), ...style }}
      {...props}
    >
      {children}
    </div>
  )
})

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border-b-3 border-ink p-5', className)} {...props} />
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-display text-xl font-bold tracking-tight text-ink', className)} {...props} />
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('mt-1 text-sm text-ink-muted', className)} {...props} />
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5', className)} {...props} />
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center gap-3 border-t-3 border-ink p-5', className)} {...props} />
}
