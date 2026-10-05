/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  prefix: 'bui-',
  darkMode: 'class',
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        // Surfaces & ink are CSS-variable-backed (RGB channels) so they flip in dark mode.
        paper: {
          DEFAULT: 'rgb(var(--bui-paper) / <alpha-value>)',
          dark: 'rgb(var(--bui-paper-dark) / <alpha-value>)',
        },
        // Card / control surface (formerly literal white).
        surface: 'rgb(var(--bui-surface) / <alpha-value>)',
        focus: 'rgb(var(--bui-focus) / <alpha-value>)',
        ink: {
          DEFAULT: 'rgb(var(--bui-ink) / <alpha-value>)',
          soft: 'rgb(var(--bui-ink-soft) / <alpha-value>)',
          muted: 'rgb(var(--bui-ink-muted) / <alpha-value>)',
        },
        // Fixed neutrals that never flip — for text on colored fills.
        coal: '#1C1C1C',
        chalk: '#F3EFE6',
        // Bauhaus primaries — each with a darker (hover/active) and lighter (tint) step.
        bred: {
          DEFAULT: 'rgb(var(--bui-red) / <alpha-value>)',
          dark: 'rgb(var(--bui-red-dark) / <alpha-value>)',
          light: 'rgb(var(--bui-red-light) / <alpha-value>)',
          ink: 'rgb(var(--bui-red-ink) / <alpha-value>)',
        },
        bblue: {
          DEFAULT: 'rgb(var(--bui-blue) / <alpha-value>)',
          dark: 'rgb(var(--bui-blue-dark) / <alpha-value>)',
          light: 'rgb(var(--bui-blue-light) / <alpha-value>)',
          ink: 'rgb(var(--bui-blue-ink) / <alpha-value>)',
        },
        byellow: {
          DEFAULT: 'rgb(var(--bui-yellow) / <alpha-value>)',
          dark: 'rgb(var(--bui-yellow-dark) / <alpha-value>)',
          light: 'rgb(var(--bui-yellow-light) / <alpha-value>)',
          ink: 'rgb(var(--bui-yellow-ink) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--bui-font-sans)'],
        display: ['var(--bui-font-display)'],
        mono: ['var(--bui-font-mono)'],
      },
      borderRadius: {
        none: 'var(--bui-radius)',
        sm: 'calc(var(--bui-radius) + 2px)',
        DEFAULT: 'calc(var(--bui-radius) + 2px)',
        md: 'calc(var(--bui-radius) + 4px)',
        lg: 'calc(var(--bui-radius) + 6px)',
        full: '9999px',
      },
      borderWidth: {
        DEFAULT: '1px',
        3: 'var(--bui-border-width)',
      },
      boxShadow: {
        hard: 'var(--bui-shadow-offset) var(--bui-shadow-offset) 0 0 rgb(var(--bui-ink))',
        'hard-sm':
          'calc(var(--bui-shadow-offset) * 0.5) calc(var(--bui-shadow-offset) * 0.5) 0 0 rgb(var(--bui-ink))',
        'hard-lg':
          'calc(var(--bui-shadow-offset) * 1.5) calc(var(--bui-shadow-offset) * 1.5) 0 0 rgb(var(--bui-ink))',
        'hard-red': '4px 4px 0 0 #E63329',
        'hard-blue': '4px 4px 0 0 #21409A',
        // Fixed ink (never flips) — for framing the fixed-colour graphic blocks.
        'hard-coal': '4px 4px 0 0 #1C1C1C',
        'hard-coal-lg': '6px 6px 0 0 #1C1C1C',
      },
      transitionDuration: {
        DEFAULT: 'calc(var(--bui-motion-duration) * 1.5)',
        100: 'var(--bui-motion-duration)',
        150: 'calc(var(--bui-motion-duration) * 1.5)',
        200: 'calc(var(--bui-motion-duration) * 2)',
        300: 'calc(var(--bui-motion-duration) * 3)',
      },
      keyframes: {
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'translateY(6px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        indeterminate: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(300%)' },
        },
      },
      animation: {
        spin: 'spin calc(var(--bui-motion-duration) * 10) linear infinite',
        'spin-slow': 'spin-slow calc(var(--bui-motion-duration) * 60) linear infinite',
        'pop-in': 'pop-in calc(var(--bui-motion-duration) * 1.8) ease-out',
        'slide-in-right': 'slide-in-right calc(var(--bui-motion-duration) * 2.2) ease-out',
        'slide-in-left': 'slide-in-left calc(var(--bui-motion-duration) * 2.2) ease-out',
        'fade-in': 'fade-in calc(var(--bui-motion-duration) * 1.8) ease-out',
        marquee: 'marquee calc(var(--bui-motion-duration) * 180) linear infinite',
        indeterminate: 'indeterminate calc(var(--bui-motion-duration) * 12) ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
