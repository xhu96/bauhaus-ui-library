# Changelog

All notable changes to this project are documented in this file. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - Unreleased

### Added

- Rebuilt the GitHub Pages showcase as a responsive product landing page with live component
  previews, component search, theme switching, copyable install/code snippets and original Bauhaus
  mascot artwork.
- Added `BauhausMascot`, a code-native React SVG component whose standing, working and running
  poses reuse the same head and character geometry.
- Added broader component and accessibility regression coverage across the public component set.
- Added a checked-in API Extractor contract and a packed-package consumer smoke test covering ESM,
  CJS, SSR, stylesheet exports and type declarations.

### Changed

- Added explicit ESM and CJS package builds and rebuilt the optional UMD target so direct browser
  consumers only need the standard React and ReactDOM globals.
- Raised the supported Node.js development/SSR baseline to Node 22 and narrowed the React peer
  contract to React 18.2 or React 19.
- Build the publishable library during `prepack`, covering both `npm pack` and `npm publish`.
- Reworked `Spinner` into a single three-quarter Bauhaus ring with square-cut ends, and use the same
  visual spinner for `Button` loading states for a consistent loading language.
- Namespaced all distributed Tailwind utilities and interaction helpers with `bui-`; the package
  stylesheet no longer exports generic selectors into consumer applications.
- Added controlled operation to `Accordion`, matching the existing controlled/uncontrolled `Tabs`
  state model.
- Updated the development toolchain to Vite 6, Vitest 3 and Storybook 10, replacing removed
  Storybook packages with their supported core and addon entry points.

### Fixed

- Loading buttons now embed the shared spinner decoratively so the button keeps its original
  accessible name instead of announcing a second loading label.
- Hardened form semantics, keyboard behavior, accessible naming and focus handling across component
  demos and overlay interactions.
- `FormField` now generates the control ID, wires labels automatically, keeps hint and error text
  available together, and propagates native `required` semantics to compatible controls.
- Tabs now support Home/End navigation and skip disabled triggers; Tabs and Accordion compose
  consumer event handlers without overriding internal behavior and honor `event.preventDefault()`.

## [0.1.1] - 2026-06-18

### Added

- Exported `Status` type (`'info' | 'success' | 'warning' | 'danger'`), shared by `Alert` and `Toast`.

### Changed

- Bundle the published type declarations into a single `dist/index.d.ts` (previously 32 per-file
  declarations), exposing only the intended public API surface.

### Fixed

- Demo site & docs: complete the four-shape logo mark by adding the yellow cross in the README
  banner, the footer and the Storybook intro, and add a favicon. (No change to the exported
  `ShapeLogo`, which already renders the full mark.)

## [0.1.0] - 2026-06-15

### Added

- Initial release: 29 accessible React + TypeScript components — geometric primitives
  (`Shape`, `ShapeLogo`, `GeometricPattern`), forms, feedback, navigation and overlays.
- Built-in light and dark theming driven by a single `.dark` class.
- Storybook with stories for every component, plus Introduction and Design-tokens pages and a
  dark-mode toolbar toggle.
- ESM + UMD builds with bundled type declarations and a self-contained `styles.css`.

[Unreleased]: https://github.com/xhu96/bauhaus-ui-library/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/xhu96/bauhaus-ui-library/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/xhu96/bauhaus-ui-library/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/xhu96/bauhaus-ui-library/releases/tag/v0.1.0
