import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { solidColor, type BauhausColor, type Size } from '@/lib/types'

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  src?: string
  /** Used to derive initials when no image is available. */
  name?: string
  size?: Size | number
  shape?: 'square' | 'circle'
  color?: BauhausColor
}

const sizePx: Record<Size, number> = {
  sm: 32,
  md: 44,
  lg: 60,
}

function initials(name?: string): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * User avatar. Renders the image when `src` is set, otherwise initials
 * on a colored tile. Thick ink border, square or circle.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, name, size = 'md', shape = 'square', color = 'blue', className, style, ...props },
  ref,
) {
  const px = typeof size === 'number' ? size : sizePx[size]

  return (
    <span
      ref={ref}
      role="img"
      aria-label={name || 'avatar'}
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center overflow-hidden border-3 border-ink',
        shape === 'circle' ? 'rounded-full' : 'rounded-none',
        !src && solidColor[color],
        className,
      )}
      style={{ width: px, height: px, ...style }}
      {...props}
    >
      {src ? (
        <img src={src} alt={name || ''} className="h-full w-full object-cover" />
      ) : (
        <span
          className="font-display font-bold uppercase leading-none tracking-wide"
          style={{ fontSize: Math.round(px * 0.4) }}
          aria-hidden="true"
        >
          {initials(name)}
        </span>
      )}
    </span>
  )
})
