/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
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
          DEFAULT: '#E63329',
          dark: '#B81E16',
          light: '#F5A9A3',
          ink: 'rgb(var(--bui-red-ink) / <alpha-value>)',
        },
        bblue: {
          DEFAULT: '#21409A',
          dark: '#152C70',
          light: '#9DB0E0',
        },
        byellow: {
          DEFAULT: '#F4C20D',
          dark: '#C99A00',
          light: '#FBE389',
          ink: 'rgb(var(--bui-yellow-ink) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Archivo', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['"Space Grotesk"', 'Archivo', 'Arial', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '2px',
        md: '4px',
        lg: '6px',
        full: '9999px',
      },
      borderWidth: {
        DEFAULT: '1px',
        3: '3px',
      },
      boxShadow: {
        hard: '4px 4px 0 0 rgb(var(--bui-ink))',
        'hard-sm': '2px 2px 0 0 rgb(var(--bui-ink))',
        'hard-lg': '6px 6px 0 0 rgb(var(--bui-ink))',
        'hard-red': '4px 4px 0 0 #E63329',
        'hard-blue': '4px 4px 0 0 #21409A',
        // Fixed ink (never flips) — for framing the fixed-colour graphic blocks.
        'hard-coal': '4px 4px 0 0 #1C1C1C',
        'hard-coal-lg': '6px 6px 0 0 #1C1C1C',
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
        'spin-slow': 'spin-slow 6s linear infinite',
        'pop-in': 'pop-in 0.18s ease-out',
        'slide-in-right': 'slide-in-right 0.22s ease-out',
        'slide-in-left': 'slide-in-left 0.22s ease-out',
        'fade-in': 'fade-in 0.18s ease-out',
        marquee: 'marquee 18s linear infinite',
        indeterminate: 'indeterminate 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
