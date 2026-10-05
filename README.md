<p align="center">
  <img src="https://raw.githubusercontent.com/xhu96/bauhaus-ui-library/main/assets/banner.svg" alt="Bauhaus UI: geometric React components" width="100%" />
</p>

# Bauhaus UI

A bold, geometric React component library inspired by the **Bauhaus** movement: primary
colors, hard edges, thick black borders, and a relentless grid. 30 components, fully typed,
accessible, themeable, with a built-in dark mode.

> Form follows function.

<p>
  <a href="https://www.npmjs.com/package/bauhaus-ui-library"><img src="https://img.shields.io/npm/v/bauhaus-ui-library?color=E63329&labelColor=1C1C1C" alt="npm version" /></a>
  <a href="https://github.com/xhu96/bauhaus-ui-library/actions/workflows/ci.yml"><img src="https://github.com/xhu96/bauhaus-ui-library/actions/workflows/ci.yml/badge.svg" alt="CI status" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/bauhaus-ui-library?color=21409A&labelColor=1C1C1C" alt="MIT license" /></a>
  <a href="https://xhu96.github.io/bauhaus-ui-library/"><img src="https://img.shields.io/badge/demo-live-F4C20D?labelColor=1C1C1C" alt="Live demo" /></a>
</p>

Built with **React + TypeScript + Tailwind CSS + Vite + Storybook**.

**[Published 0.1.1 demo](https://xhu96.github.io/bauhaus-ui-library/)** · **[Published 0.1.1 Storybook](https://xhu96.github.io/bauhaus-ui-library/storybook/)**

Development branch: **[Dev source](https://github.com/xhu96/bauhaus-ui-library/tree/Dev)**.
**0.2.0dev2 is unpublished; npm currently installs 0.1.1.** The local package version is `0.2.0-dev.2`.
This README describes the development preview; new APIs such as Bau and native Switch form behavior
require the local installation below. No 0.2.0 release tag or publication is implied.

---

## Features

- **30 components** spanning signature geometric primitives, forms, feedback, navigation and overlays.
- **Bauhaus design system.** A disciplined palette (red `#E63329`, blue `#21409A`, yellow `#F4C20D`, ink `#1C1C1C`), geometric sans-serif type (Space Grotesk + Archivo), sharp corners and hard offset shadows.
- **Signature artwork.** `GeometricPattern` generates deterministic motif grids, while `BauhausMascot` shares one canonical geometric head across three code-native React SVG poses and six expressions.
- **Dark mode** built in. Flip a single `.dark` class on `<html>`; surfaces and ink invert while the primary triad stays vivid.
- **Keyboard and semantic support.** Native controls, visible focus and dialog focus management;
  automated tests do not certify every browser or screen reader combination.
- **Themeable.** Every surface token is a CSS variable; primaries are Tailwind colors.
- **Flexible distribution.** Tree-shakeable ESM, CJS, and an optional UMD browser build, with
  bundled type declarations.

## Installation

```bash
npm install bauhaus-ui-library@0.1.1
```

Consumer compatibility remains aligned with v0.1.1: React 18 or 19 and Node.js 20+ for
package-manager and SSR workflows. Storybook and its Node.js requirements are development-only;
Storybook is not installed in applications that consume the library.

### Install this unpublished preview locally

From a checkout of the `Dev` branch, using Node 20.19+ or 22.12+ for the build tools
(Node 24 is used in CI):

```bash
npm ci
npm pack
# In your consumer app, use the actual absolute path to the generated tarball:
npm install /absolute/path/to/bauhaus-ui-library-0.2.0-dev.2.tgz
```

`npm pack` builds the local package; it does not publish it. This preview remains unpublished.
Run `npm run storybook` for the tested `Examples/Onboarding` installation and native-form demos.
The [example source](src/examples/Onboarding.tsx) has [focused interaction tests](src/examples/Onboarding.test.tsx).
See [compatibility, RHF and local-theme portal examples](docs/compatibility.md) for verified support
and limits, and [release verification](docs/release-verification.md) for the executed browser scope.

Import the stylesheet once at your app root:

```tsx
import 'bauhaus-ui-library/styles.css'
```

The bundled `styles.css` is self-contained (it includes the design tokens and every utility the
components use), so Tailwind is **not required** in your app. It does not ship Tailwind Preflight or
generic utility selectors: library-owned utilities and interaction helpers use the `bui-` prefix,
so importing the stylesheet does not restyle the rest of your application. If you do use Tailwind
and want to author your own `bred` / `bblue` markup, copy the token definitions from the Theming
section below.

Fonts are optional. Without a network font load, Archivo falls back to Helvetica Neue/Arial,
Space Grotesk to Archivo/Arial, and Space Mono to the system monospace. You can self-host licensed
font files with your own `@font-face` declarations and override `--bui-font-sans`,
`--bui-font-display`, and `--bui-font-mono`. The library CSS makes no font-network requests.
The demo opts into Google Fonts; consumers can instead load them in their own `index.html`:

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
        <GeometricPattern rows={2} cols={6} style={{ height: 96 }} />
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

`FormField` generates and connects the control ID, label, hint and error descriptions, and
propagates native `required` semantics to compatible controls:

```tsx
<FormField label="Email" hint="We will never share it." required>
  <Input type="email" />
</FormField>
```

Tabs and accordions support controlled and uncontrolled state. Consumer event handlers run before
internal behavior and can call `event.preventDefault()` to cancel a state change.
Use `Tabs orientation="vertical"` for a sidebar: its tablist exposes the matching orientation and
uses Up/Down arrows. The default horizontal mode uses Left/Right; both support Home/End.

### Product actions, density and retained panels (local preview)

Use semantic intent when an action's role matters more than its decorative color:

```tsx
<Button intent="primary">Save changes</Button>
<Button intent="secondary">Cancel</Button>
<Button intent="destructive">Delete project</Button>
```

`intent` takes precedence over `color` and `variant`; omitting it preserves the existing visual API.
Secondary actions use an outline without the primary action's hard shadow. Custom themes may override
the `--bui-action-primary-*`, `--bui-action-secondary-*` and `--bui-action-destructive-*` RGB tokens.

Wrap a region in `data-bui-density="compact"` for 32/36/44px `sm`/`md`/`lg` Button, Input and Select
heights. A nested `data-bui-density="comfortable"` restores 36/44/56px. Textarea density changes
padding without overriding rows or minimum height. Unscoped controls retain their existing sizes.

`TabsContent` and `AccordionContent` accept `keepMounted` to preserve form drafts and local state
while inactive panels stay hidden. The default still unmounts inactive content. Retained effects keep
running; lift state instead when you need to suspend expensive content.

The [Settings example source](src/examples/SettingsExample.tsx) composes Profile, Notifications and
Team views with async load/save, retry, inline validation, unsaved changes, discard confirmation and
search/empty states. Run `npm run dev` and open `/examples/settings/`, or open `Examples/Settings`
in Storybook. The standalone example persists versioned data in browser storage; inject real
`loadSettings(signal)` and `saveSettings(snapshot, signal)` adapters in your application.
This example is preview-only and is not a new package export.

## Components

| Group                  | Components                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------ |
| **Signature**          | `Shape`, `ShapeLogo`, `GeometricPattern`, `BauhausMascot`                                        |
| **Core**               | `Button`, `Card` (+ `CardHeader`/`CardTitle`/`CardDescription`/`CardBody`/`CardFooter`)          |
| **Form**               | `FormField`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`/`RadioGroup`, `Switch`, `Slider` |
| **Display & feedback** | `Badge`, `Tag`, `Avatar`, `Alert`, `Progress`, `Spinner`, `Divider`, `Tooltip`                   |
| **Navigation**         | `Tabs`, `Accordion`, `Navbar`, `Pagination`, `Breadcrumb`                                        |
| **Overlay**            | `Modal`, `Drawer`, `Toast` (`ToastProvider` + `useToast`)                                        |

## Dark mode

Use an explicit theme scope to support nested light and dark sections. The legacy `.dark`
class is still supported. The showcase resolves its saved `bauhaus-theme` preference before
paint, falling back to the system preference when storage is unavailable:

```js
document.documentElement.dataset.buiTheme = 'dark' // or 'light'
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

Consumer support remains React/ReactDOM `^18.0.0 || ^19.0.0`, Node `>=20`, and ESM/CJS/UMD.
Storybook 10 is development tooling. React 19 does not provide upstream UMD files;
use ESM or supply your own compatible React/ReactDOM globals for the library's UMD build.

### Migrating from 0.1.1

`Switch` now renders and forwards its ref to a native input: update a button ref to
`useRef<HTMLInputElement>`. `Progress` refs and DOM props now target its actual
`role="progressbar"` element, not the outer label/layout wrapper. Avoid private DOM assumptions.
Native uncontrolled reset restores defaults; controlled values still require a state reset.
See [migration notes](CHANGELOG.md#migration-notes) and [overlay constraints](docs/compatibility.md#next-app-router-and-portals).

### Development commands

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
npm run api:check   # verify the checked-in public API contract
npm run api:update  # intentionally update the API contract report
npm run package:smoke # test the packed artifact as ESM, CJS, SSR and TypeScript
npm run build-storybook
npm run test:showcase # built Settings and selected stories on Chromium/Firefox/WebKit
```

## Design background

This library is a working translation of Bauhaus principles into UI: _form follows function_,
the grid as the silent organizer, the primary triad, and the canonical shape→color mapping
(circle→blue, square→red, triangle→yellow).

## Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) and the
[Code of Conduct](CODE_OF_CONDUCT.md); release notes live in [CHANGELOG.md](CHANGELOG.md).

## License

MIT — see [LICENSE](LICENSE).
