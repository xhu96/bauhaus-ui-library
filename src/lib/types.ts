/** The Bauhaus palette names used across components. */
export type BauhausColor = 'red' | 'blue' | 'yellow' | 'ink'

export type Size = 'sm' | 'md' | 'lg'

/** Semantic status used by feedback components (Alert, Toast). */
export type Status = 'info' | 'success' | 'warning' | 'danger'

/** Maps a BauhausColor to its solid Tailwind background + the text color that sits on it.
 *  `coal`/`paper` are used (not white/ink) so text stays legible in dark mode. */
export const solidColor: Record<BauhausColor, string> = {
  red: 'bui-bg-bred-dark bui-text-white',
  blue: 'bui-bg-bblue bui-text-white',
  yellow: 'bui-bg-byellow bui-text-coal',
  ink: 'bui-bg-ink bui-text-paper',
}

/** Hover background for solid variants. */
export const solidHover: Record<BauhausColor, string> = {
  red: 'hover:bui-bg-bred-dark',
  blue: 'hover:bui-bg-bblue-dark',
  yellow: 'hover:bui-bg-byellow-dark',
  ink: 'hover:bui-bg-ink-soft',
}

/** Foreground/accent text color per palette name. */
export const textColor: Record<BauhausColor, string> = {
  red: 'bui-text-bred-ink',
  blue: 'bui-text-bblue-ink',
  yellow: 'bui-text-byellow-ink',
  ink: 'bui-text-ink',
}

/** Raw hex values, for SVG fills and inline styles. */
export const hex: Record<BauhausColor, string> = {
  red: '#E63329',
  blue: '#21409A',
  yellow: '#F4C20D',
  ink: '#1C1C1C',
}
