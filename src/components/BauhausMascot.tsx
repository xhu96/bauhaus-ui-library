import { type SVGAttributes } from 'react'

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

const PALETTE = {
  blue: '#21409A',
  blueScene: '#0757B8',
  cream: '#F8F2E6',
  ink: '#111111',
  red: '#E63329',
  yellow: '#F4C20D',
} as const

const VIEW_BOXES: Record<BauhausMascotPose, string> = {
  standing: '0 0 760 520',
  working: '0 0 520 520',
  running: '0 0 760 340',
}

interface HeadProps {
  expression?: BauhausMascotExpression
  scale?: number
  x: number
  y: number
}

function MascotFace({ expression }: { expression: BauhausMascotExpression }) {
  if (expression === 'focused') {
    return (
      <g data-part="expression" fill="none" stroke={PALETTE.ink} strokeLinecap="round" strokeWidth="3">
        <path d="m79 62 12 4M100 66l12-4" />
        <path d="M86 71v2M105 71v2" strokeWidth="6" />
      </g>
    )
  }

  if (expression === 'happy' || expression === 'proud') {
    return (
      <g data-part="expression" fill="none" stroke={PALETTE.ink} strokeLinecap="round" strokeWidth="3">
        <path d="M78 72a8 8 0 0 1 16 0M101 72a8 8 0 0 1 16 0" />
        {expression === 'happy' && <path d="M88 91a14 14 0 0 0 22 0" />}
      </g>
    )
  }

  if (expression === 'calm') {
    return (
      <g data-part="expression" fill="none" stroke={PALETTE.ink} strokeLinecap="round" strokeWidth="3">
        <path d="M80 69a8 8 0 0 0 14 0M101 69a8 8 0 0 0 14 0" />
      </g>
    )
  }

  return (
    <g data-part="expression">
      <circle cx="91" cy="69" r="7" fill={PALETTE.ink} />
      {expression === 'playful' && (
        <path
          d="M111 105v19a10 10 0 0 1-20 0v-7"
          fill={PALETTE.red}
          stroke={PALETTE.ink}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />
      )}
    </g>
  )
}

/** One canonical head is transformed for every pose so the character cannot drift. */
function MascotHead({ expression = 'curious', scale = 1, x, y }: HeadProps) {
  return (
    <g data-part="head-unit" transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        data-part="ear-ink"
        d="M43 52V8a56 56 0 0 1 58 9L70 52Z"
        fill={PALETTE.ink}
        stroke={PALETTE.ink}
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
      <rect
        data-part="ear-blue"
        x="99"
        y="18"
        width="39"
        height="39"
        fill={PALETTE.blue}
        stroke={PALETTE.ink}
        strokeWidth="2.5"
        transform="rotate(16 118.5 37.5)"
      />
      <circle
        data-part="head"
        cx="80"
        cy="80"
        r="55"
        fill={PALETTE.red}
        stroke={PALETTE.ink}
        strokeWidth="2.5"
      />
      <path
        data-part="muzzle"
        d="M91 72h52a21 21 0 0 1 21 21v1a21 21 0 0 1-21 21H91a22 22 0 0 1 0-43Z"
        fill={PALETTE.cream}
        stroke={PALETTE.ink}
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
      <circle data-part="nose" cx="159" cy="79" r="9" fill={PALETTE.ink} />
      <MascotFace expression={expression} />
      <path data-part="collar" d="M58 133h48v14H58Z" fill={PALETTE.ink} />
      <path data-part="tag-stem" d="M82 146v11" stroke={PALETTE.ink} strokeWidth="4" />
      <circle
        data-part="tag"
        cx="82"
        cy="166"
        r="11"
        fill={PALETTE.yellow}
        stroke={PALETTE.ink}
        strokeWidth="2"
      />
    </g>
  )
}

function DotGrid({ color, x, y }: { color: string; x: number; y: number }) {
  return (
    <g aria-hidden="true" fill={color}>
      {Array.from({ length: 30 }, (_, index) => {
        const column = index % 6
        const row = Math.floor(index / 6)
        return <circle key={index} cx={x + column * 20} cy={y + row * 20} r="3.5" />
      })}
    </g>
  )
}

function StandingDog({
  direction,
  expression,
}: {
  direction: 'left' | 'right'
  expression: BauhausMascotExpression
}) {
  const transform =
    direction === 'right' ? 'translate(120 112) scale(1.3)' : 'translate(635 112) scale(-1.3 1.3)'

  return (
    <g data-part="dog-unit" transform={transform}>
      <g data-part="body-unit" stroke={PALETTE.ink} strokeLinejoin="round" strokeWidth="2.5">
        <path data-part="tail" d="M111 151 48 87l42 83Z" fill={PALETTE.yellow} />

        <rect data-part="leg-rear" x="118" y="207" width="27" height="78" fill={PALETTE.yellow} />
        <rect data-part="leg-rear" x="153" y="207" width="27" height="78" fill={PALETTE.yellow} />
        <rect data-part="leg-front" x="239" y="207" width="27" height="78" fill={PALETTE.yellow} />
        <rect data-part="leg-front" x="274" y="207" width="27" height="78" fill={PALETTE.yellow} />

        <rect data-part="body-bridge" x="155" y="139" width="110" height="78" fill={PALETTE.blue} />
        <path
          data-part="haunch"
          d="M105 128h28a66 66 0 0 1 66 66v25h-39a55 55 0 0 1-55-55Z"
          fill={PALETTE.blue}
        />
        <path
          data-part="chest"
          d="M235 128h28a62 62 0 0 1 62 62v29h-41a49 49 0 0 1-49-49Z"
          fill={PALETTE.blue}
        />

        <path d="M114 285a18 18 0 0 1 36 0Z" fill={PALETTE.ink} />
        <path d="M149 285a18 18 0 0 1 36 0Z" fill={PALETTE.ink} />
        <path d="M235 285a18 18 0 0 1 36 0Z" fill={PALETTE.ink} />
        <path d="M270 285a18 18 0 0 1 36 0Z" fill={PALETTE.ink} />
      </g>
      <MascotHead expression={expression} x={218} y={-1} />
    </g>
  )
}

function StandingMascot({
  direction,
  expression,
  scene,
}: {
  direction: 'left' | 'right'
  expression: BauhausMascotExpression
  scene: boolean
}) {
  return (
    <>
      {scene && (
        <g data-part="scene">
          <rect width="760" height="520" fill={PALETTE.cream} />
          <path d="M74 318A244 244 0 0 1 318 74v244Z" fill={PALETTE.blueScene} />
          <path d="M430 45v270M350 175h360" stroke={PALETTE.ink} strokeWidth="1.5" />
          <circle cx="448" cy="102" r="62" fill={PALETTE.red} />
          <DotGrid color={PALETTE.ink} x={565} y={58} />
          <rect x="74" y="356" width="110" height="110" fill={PALETTE.yellow} />
          <path d="M610 466a78 78 0 0 1 156 0Z" fill={PALETTE.ink} />
        </g>
      )}
      <StandingDog direction={direction} expression={expression} />
    </>
  )
}

function WorkingMascot({ expression, scene }: { expression: BauhausMascotExpression; scene: boolean }) {
  return (
    <>
      {scene && (
        <g data-part="scene">
          <rect width="520" height="520" fill={PALETTE.blueScene} />
          <DotGrid color={PALETTE.cream} x={40} y={55} />
          <path d="M38 420V188M38 420h430M350 82v248M298 178h172" stroke={PALETTE.cream} strokeWidth="1.5" />
        </g>
      )}

      <g data-part="dog-unit">
        <g data-part="body-unit" stroke={PALETTE.ink} strokeLinejoin="round" strokeWidth="2.5">
          <path data-part="tail" d="m92 362-44 59h55Z" fill={PALETTE.yellow} />
          <circle data-part="haunch" cx="142" cy="346" r="58" fill={PALETTE.blue} />
          <rect data-part="body-bridge" x="142" y="273" width="111" height="82" fill={PALETTE.blue} />
          <path
            data-part="chest"
            d="M215 247h25a56 56 0 0 1 56 56v90h-58a43 43 0 0 1-43-43v-83Z"
            fill={PALETTE.blue}
          />
          <rect data-part="leg-rear" x="126" y="365" width="29" height="55" fill={PALETTE.yellow} />
          <rect data-part="leg-front" x="246" y="363" width="29" height="57" fill={PALETTE.yellow} />
          <path d="M114 420a27 27 0 0 1 54 0Z" fill={PALETTE.ink} />
          <path d="M234 420a27 27 0 0 1 54 0Z" fill={PALETTE.ink} />
        </g>
        <rect data-part="neck" x="247" y="230" width="42" height="31" fill={PALETTE.ink} />
        <MascotHead expression={expression} scale={0.86} x={198} y={117} />
      </g>

      <g data-part="desk" fill={PALETTE.ink} stroke={PALETTE.ink} strokeLinejoin="round" strokeWidth="2.5">
        <path d="M310 289h139l-42 131H268Z" />
        <rect x="246" y="420" width="229" height="14" />
        <path d="M427 434h17l-28 78h-17Z" />
      </g>
    </>
  )
}

function RunningMascot({ expression, scene }: { expression: BauhausMascotExpression; scene: boolean }) {
  return (
    <>
      {scene && (
        <g data-part="scene">
          <rect width="760" height="340" fill={PALETTE.red} />
          <circle cx="442" cy="168" r="132" fill={PALETTE.cream} />
          <DotGrid color={PALETTE.cream} x={625} y={95} />
          <path d="M82 173h128M116 198h68M144 223h48" stroke={PALETTE.ink} strokeWidth="3" />
          <path d="M386 300a46 46 0 0 1 92 0Z" fill={PALETTE.ink} />
          <path d="M526 300a46 46 0 0 1 92 0Z" fill={PALETTE.yellow} />
        </g>
      )}

      <g data-part="dog-unit" stroke={PALETTE.ink} strokeLinejoin="round" strokeWidth="2.5">
        <path data-part="tail" d="m234 144-69-61 35 86Z" fill={PALETTE.yellow} />
        <rect data-part="body-bridge" x="239" y="123" width="226" height="82" fill={PALETTE.blue} />
        <path
          data-part="haunch"
          d="M196 113h28a67 67 0 0 1 67 67v27h-42a55 55 0 0 1-55-55Z"
          fill={PALETTE.blue}
        />
        <path
          data-part="chest"
          d="M431 112h26a61 61 0 0 1 61 61v34h-42a47 47 0 0 1-47-47Z"
          fill={PALETTE.blue}
        />

        <path data-part="leg-rear" d="m235 194 20 15-61 73-21-15Z" fill={PALETTE.yellow} />
        <path data-part="leg-rear" d="m278 199 19 17-53 68-21-17Z" fill={PALETTE.yellow} />
        <path data-part="leg-front" d="m452 195 19-14 65 82-21 17Z" fill={PALETTE.yellow} />
        <path data-part="leg-front" d="m480 188 18-12 82 64-18 20Z" fill={PALETTE.yellow} />
        <path d="m163 268 20-15 17 24-21 16Z" fill={PALETTE.ink} />
        <path d="m216 273 20-18 18 23-20 18Z" fill={PALETTE.ink} />
        <path d="m509 267 24-18 14 21-25 18Z" fill={PALETTE.ink} />
        <path d="m557 245 25-16 12 21-26 16Z" fill={PALETTE.ink} />
      </g>
      <MascotHead expression={expression} scale={0.88} x={451} y={24} />
    </>
  )
}

function MascotPortrait({ expression }: { expression: BauhausMascotExpression }) {
  return <MascotHead expression={expression} x={19} y={5} />
}

/**
 * The Bauhaus UI mascot, drawn entirely as reusable React SVG geometry.
 * Every pose shares the same head and the same modular chest, bridge, haunch, leg, paw, and tail language.
 */
export function BauhausMascot({
  pose = 'standing',
  variant = 'full',
  expression = 'curious',
  direction = 'right',
  scene = false,
  label,
  ...props
}: BauhausMascotProps) {
  const content =
    variant === 'portrait' ? (
      <MascotPortrait expression={expression} />
    ) : (
      {
        standing: <StandingMascot direction={direction} expression={expression} scene={scene} />,
        working: <WorkingMascot expression={expression} scene={scene} />,
        running: <RunningMascot expression={expression} scene={scene} />,
      }[pose]
    )

  return (
    <svg
      viewBox={variant === 'portrait' ? '0 0 210 190' : VIEW_BOXES[pose]}
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
      {content}
    </svg>
  )
}
