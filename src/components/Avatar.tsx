import { forwardRef, useRef, useState, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { solidColor, type BauhausColor, type Size } from '@/lib/types'

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  src?: string
  /** Accessible name and initials when the image is absent or fails to load. */
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
 * User avatar. Failed images fall back to named initials on a colored tile;
 * changing `src` starts a fresh attempt. Thick ink border, square or circle.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, name, size = 'md', shape = 'square', color = 'blue', className, style, ...props },
  ref,
) {
  const px = typeof size === 'number' ? size : sizePx[size]
  const imageRef = useRef<HTMLImageElement>(null)
  const [image, setImage] = useState({ src, failed: false })
  if (image.src !== src) setImage({ src, failed: false })
  const hasImage = Boolean(src) && !image.failed

  return (
    <span
      ref={ref}
      role={hasImage ? undefined : 'img'}
      aria-label={hasImage ? undefined : name || 'avatar'}
      className={cn(
        'bui-reset',
        'bui-inline-flex bui-shrink-0 bui-select-none bui-items-center bui-justify-center bui-overflow-hidden bui-border-3 bui-border-ink',
        shape === 'circle' ? 'bui-rounded-full' : 'bui-rounded-none',
        !hasImage && solidColor[color],
        className,
      )}
      style={{ width: px, height: px, ...style }}
      {...props}
    >
      {hasImage ? (
        <img
          key={src}
          ref={imageRef}
          src={src}
          alt={name || ''}
          onError={(event) => {
            if (event.currentTarget === imageRef.current) setImage({ src, failed: true })
          }}
          className="bui-reset bui-h-full bui-w-full bui-object-cover"
        />
      ) : (
        <span
          className="bui-reset bui-font-display bui-font-bold bui-uppercase bui-leading-none bui-tracking-wide"
          style={{ fontSize: Math.round(px * 0.4) }}
          aria-hidden="true"
        >
          {initials(name)}
        </span>
      )}
    </span>
  )
})
