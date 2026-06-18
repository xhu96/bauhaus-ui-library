<p align="center">
  <img src="https://raw.githubusercontent.com/xhu96/bauhaus-ui-library/main/assets/banner.svg" alt="Bauhaus UI: geometric React components" width="100%" />
</p>

# Bauhaus UI

A bold, geometric React component library inspired by the **Bauhaus** movement: primary
colors, hard edges, thick black borders, and a relentless grid. 29 components, fully typed,
accessible, themeable, with a built-in dark mode.

> Form follows function.

<p>
  <a href="https://www.npmjs.com/package/bauhaus-ui-library"><img src="https://img.shields.io/npm/v/bauhaus-ui-library?color=E63329&labelColor=1C1C1C" alt="npm version" /></a>
  <a href="https://github.com/xhu96/bauhaus-ui-library/actions/workflows/ci.yml"><img src="https://github.com/xhu96/bauhaus-ui-library/actions/workflows/ci.yml/badge.svg" alt="CI status" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/bauhaus-ui-library?color=21409A&labelColor=1C1C1C" alt="MIT license" /></a>
  <a href="https://xhu96.github.io/bauhaus-ui-library/"><img src="https://img.shields.io/badge/demo-live-F4C20D?labelColor=1C1C1C" alt="Live demo" /></a>
</p>

Built with **React + TypeScript + Tailwind CSS + Vite + Storybook**.

**[Live demo](https://xhu96.github.io/bauhaus-ui-library/)** · **[Storybook](https://xhu96.github.io/bauhaus-ui-library/storybook/)**

---

## Features

- **29 components** across forms, feedback, navigation, overlays, plus signature geometric primitives.
- **Bauhaus design system.** A disciplined palette (red `#E63329`, blue `#21409A`, yellow `#F4C20D`, ink `#1C1C1C`), geometric sans-serif type (Space Grotesk + Archivo), sharp corners and hard offset shadows.
- **Signature generator.** `GeometricPattern` tessellates deterministic Bauhaus motif grids for heroes and backdrops.
- **Dark mode** built in. Flip a single `.dark` class on `<html>`; surfaces and ink invert while the primary triad stays vivid.
- **Accessible.** Roles, ARIA attributes and keyboard support throughout (tabs, accordion, modal, toast).
- **Themeable.** Every surface token is a CSS variable; primaries are Tailwind colors.
- **Tree-shakeable** ESM + UMD builds with bundled type declarations.

## Installation

```bash
npm install bauhaus-ui-library
```

Import the stylesheet once at your app root:

```tsx
import 'bauhaus-ui-library/styles.css'
```

The bundled `styles.css` is self-contained (it includes the design tokens and every utility the
components use), so Tailwind is **not required** in your app. If you do use Tailwind and want to
author your own `bred` / `bblue` markup, copy the token definitions from the Theming section below.

Load the fonts (e.g. in your `index.html`):

```html
<link
  href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
  rel="stylesheet"
/>
```

## Usage

```tsx
import { Button, Card, CardBody, GeometricPattern, useToast, ToastProvider } from 'bauhaus-ui-library'

function App() {
  return (
    <ToastProvider>
      <Card accent="red">
        <GeometricPattern rows={2} cols={6} className="h-24" />
        <CardBody>
          <Button color="red" rightIcon={<span>→</span>}>
            Get started
          </Button>
        </CardBody>
      </Card>
    </ToastProvider>
  )
}
```

Every component shares a small, predictable API:

- `color`: `'red' | 'blue' | 'yellow' | 'ink'`
- `size`: `'sm' | 'md' | 'lg'`
- `variant` where it makes sense: `'solid' | 'outline' | 'ghost'`

## Components

| Group                  | Components                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| **Signature**          | `Shape`, `ShapeLogo`, `GeometricPattern`                                                         |
| **Core**               | `Button`, `Card` (+ `CardHeader`/`CardTitle`/`CardDescription`/`CardBody`/`CardFooter`)          |
| **Form**               | `FormField`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`/`RadioGroup`, `Switch`, `Slider` |
| **Display & feedback** | `Badge`, `Tag`, `Avatar`, `Alert`, `Progress`, `Spinner`, `Divider`, `Tooltip`                   |
| **Navigation**         | `Tabs`, `Accordion`, `Navbar`, `Pagination`, `Breadcrumb`                                        |
| **Overlay**            | `Modal`, `Drawer`, `Toast` (`ToastProvider` + `useToast`)                                        |

## Dark mode

Add the `dark` class to your root element (the showcase ships a toggle that also
respects `prefers-color-scheme` and persists the choice):

```js
document.documentElement.classList.toggle('dark')
```

Surfaces (`paper`, `surface`) and `ink` flip; the red / blue / yellow triad stays vivid in
both themes.

## Theming

Surface and ink tokens are space-separated RGB channels (so Tailwind alpha like `bg-ink/10`
works). Override them in your own CSS (these are the same variables `styles.css` already ships):

```css
:root {
  --bui-paper: 250 247 240; /* page background */
  --bui-surface: 255 255 255; /* cards & controls */
  --bui-ink: 28 28 28; /* text, borders, shadows */
}
.dark {
  --bui-paper: 22 20 18;
  --bui-surface: 38 35 31;
  --bui-ink: 243 239 230;
}
```

For reference, the Tailwind color names the components use are `bred`, `bblue`, `byellow` (each
with `-dark` / `-light` / `-ink` steps), plus `paper`, `surface`, `ink`, and the fixed
`coal` / `chalk` neutrals — all backed by the CSS variables above.

## Development

```bash
npm install         # install dependencies
npm run dev         # run the showcase site (Vite)
npm run storybook   # component explorer
npm run lint        # ESLint
npm run format      # Prettier (write)
npm run typecheck   # tsc --noEmit
npm test            # Vitest (npm run test:watch to watch)
npm run build       # build the showcase
npm run build:lib   # build the publishable library (dist/)
npm run build-storybook
```

## Design background

This library is a working translation of Bauhaus principles into UI: _form follows function_,
the grid as the silent organizer, the primary triad, and the canonical shape→color mapping
(circle→blue, square→red, triangle→yellow). It fills a gap: while neo-brutalism has several
React libraries, no installable Bauhaus component system existed.

## Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) and the
[Code of Conduct](CODE_OF_CONDUCT.md); release notes live in [CHANGELOG.md](CHANGELOG.md).

## License

MIT — see [LICENSE](LICENSE).
