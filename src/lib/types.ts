/** The Bauhaus palette names used across components. */
export type BauhausColor = 'red' | 'blue' | 'yellow' | 'ink'

export type Size = 'sm' | 'md' | 'lg'

/** Semantic status used by feedback components (Alert, Toast). */
export type Status = 'info' | 'success' | 'warning' | 'danger'

/** Maps a BauhausColor to its solid Tailwind background + the text color that sits on it.
 *  `coal`/`paper` are used (not white/ink) so text stays legible in dark mode. */
export const solidColor: Record<BauhausColor, string> = {
  red: 'bg-bred-dark text-white',
  blue: 'bg-bblue text-white',
  yellow: 'bg-byellow text-coal',
  ink: 'bg-ink text-paper',
}

/** Hover background for solid variants. */
export const solidHover: Record<BauhausColor, string> = {
  red: 'hover:bg-bred-dark',
  blue: 'hover:bg-bblue-dark',
  yellow: 'hover:bg-byellow-dark',
  ink: 'hover:bg-ink-soft',
}

/** Foreground/accent text color per palette name. */
export const textColor: Record<BauhausColor, string> = {
  red: 'text-bred-ink',
  blue: 'text-bblue',
  yellow: 'text-byellow-ink',
  ink: 'text-ink',
}

/** Raw hex values, for SVG fills and inline styles. */
export const hex: Record<BauhausColor, string> = {
  red: '#E63329',
  blue: '#21409A',
  yellow: '#F4C20D',
  ink: '#1C1C1C',
}
