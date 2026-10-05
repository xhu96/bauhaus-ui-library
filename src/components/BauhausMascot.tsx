import { type SVGAttributes } from 'react'
import {
  MascotHead,
  StandingArtwork,
  WorkingArtwork,
  RunningArtwork,
  RunningComposition,
} from './mascot/BauArtwork'

/** Available compositions for the Bauhaus UI mascot. */
export type BauhausMascotPose = 'standing' | 'working' | 'running'

/** Facial states that reuse the same canonical head geometry. */
export type BauhausMascotExpression = 'curious' | 'focused' | 'happy' | 'playful' | 'proud' | 'calm'

/** Props for the code-native Bauhaus UI mascot illustration. */
export interface BauhausMascotProps extends Omit<SVGAttributes<SVGSVGElement>, 'viewBox'> {
  /** Reuses the same character anatomy in a different composition. */
  pose?: BauhausMascotPose
  /** Selects a full-body composition or the identity-system portrait. */
  variant?: 'full' | 'portrait'
  /** Changes the expression without changing the head shape. */
  expression?: BauhausMascotExpression
  /** Controls which way the complete dog faces. */
  direction?: 'left' | 'right'
  /** Adds the matching landing-page composition behind the mascot. */
  scene?: boolean
  /** Makes the illustration accessible. Without a label it is decorative. */
  label?: string
}

const VIEW_BOXES: Record<BauhausMascotPose, string> = {
  standing: '0 0 760 520',
  working: '0 0 520 520',
  running: '0 0 760 340',
}

const pageBackground = 'var(--bui-mascot-background, rgb(var(--bui-paper, 243 239 230)))'
const cream = '#F3EFE6'

/** One geometric identity shared by full-body poses, portraits and the landing page. */
export function BauhausMascot({
  pose = 'standing',
  variant = 'full',
  expression = 'curious',
  direction = 'right',
  scene = false,
  label,
  ...props
}: BauhausMascotProps) {
  const sceneBackground =
    pose === 'working'
      ? 'rgb(var(--bui-blue, 33 64 154))'
      : pose === 'running'
        ? 'rgb(var(--bui-red, 230 51 41))'
        : pageBackground
  const background = scene ? sceneBackground : pageBackground
  const reflected = pose === 'standing' ? direction === 'right' : direction === 'left'
  const width = pose === 'working' ? 520 : 760
  const transform = reflected ? `translate(${width} 0) scale(-1 1)` : undefined
  const artwork = {
    standing: <StandingArtwork expression={expression} paper={background} />,
    working: <WorkingArtwork expression={expression} />,
    running: <RunningArtwork expression={expression} backdrop={background} />,
  }[pose]

  return (
    <svg
      viewBox={variant === 'portrait' ? '0 0 220 225' : VIEW_BOXES[pose]}
      preserveAspectRatio="xMidYMid meet"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      data-bui-mascot={variant === 'portrait' ? 'portrait' : pose}
      data-bui-expression={expression}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {variant === 'portrait' ? (
        <g
          data-part="portrait-unit"
          transform={direction === 'right' ? 'translate(220 0) scale(-1 1)' : undefined}
        >
          <g data-part="head-unit" transform="translate(-120 -65)">
            <MascotHead paper={cream} expression={expression} />
          </g>
        </g>
      ) : (
        <>
          {scene && (
            <g data-part="scene">
              <rect width={width} height={pose === 'running' ? 340 : 520} fill={sceneBackground} />
              {pose === 'running' && <RunningComposition />}
            </g>
          )}
          {pose === 'working' ? (
            <g data-part="foreground-unit" transform={transform}>
              <g data-part="dog-unit">{artwork}</g>
            </g>
          ) : (
            <g data-part="dog-unit" transform={transform}>
              {artwork}
            </g>
          )}
        </>
      )}
    </svg>
  )
}
