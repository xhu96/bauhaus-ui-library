# Changelog

All notable changes to this project are documented in this file. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] — 0.2.0dev2

The local package version is `0.2.0-dev.2` on the `Dev` branch. This development preview is unpublished;
npm currently installs 0.1.1 (`npm install bauhaus-ui-library@0.1.1`).

### Added

- Restored the original home geometric board and strip in an eight-second sequence with the mascot,
  stable pause/manual-switch controls and reduced-motion behavior.
- Optional semantic Button `intent` and nested compact/comfortable density scopes.
- `keepMounted` on TabsContent and AccordionContent to preserve hidden form drafts.
- Vertical Tabs orientation with matching ARIA, layout and Up/Down keyboard navigation.
- A complete preview-only Settings example with asynchronous persistence adapters, error recovery,
  validation, discard confirmation and member search; reachable from the showcase and Storybook.
- Built showcase and selected story browser regressions on Chromium, Firefox and WebKit.

- Rebuilt the GitHub Pages showcase as a responsive product landing page with live component
  previews, component search, theme switching, copyable install/code snippets and original Bauhaus
  mascot artwork.
- Added `BauhausMascot`, a code-native React SVG component whose standing, working and running
  poses reuse the same head and character geometry.
- Added broader component and accessibility regression coverage across the public component set.
- Added a checked-in API Extractor contract and a packed-package consumer smoke test covering ESM,
  CJS, SSR, stylesheet exports and type declarations.

### Changed

- Renamed the development branch from `0.2.0dev` to `Dev` and advanced the package to
  `0.2.0-dev.2`, displayed as `0.2.0dev2` in the UI.
- Standardized the home and Bau artwork on one canonical geometric mascot across three poses
  and six facial expressions.
- Migrated the CSS compiler to Tailwind 4.3.3, removing the vulnerable Tailwind 3 source-scanning
  dependency chain while preserving existing `bui-` class names and scoped CSS resets.
- Redesigned the Settings example with primary geometric forms, strong typographic hierarchy,
  numbered navigation, thick rules and responsive light/dark layouts.
- Added explicit ESM and CJS package builds and rebuilt the optional UMD target so direct browser
  consumers only need the standard React and ReactDOM globals.
- Preserved consumer Node `>=20` and React/ReactDOM `^18.0.0 || ^19.0.0` support.
  Build tools require Node 20.19+ or 22.12+; CI builds on Node 24. Tool requirements
  are separate from consumer package-manager and SSR support.
- Build the publishable library during `prepack`, covering both `npm pack` and `npm publish`.
- Reworked `Spinner` into a single three-quarter Bauhaus ring with square-cut ends, and use the same
  visual spinner for `Button` loading states for a consistent loading language.
- Namespaced all distributed Tailwind utilities and interaction helpers with `bui-`; the package
  stylesheet no longer exports generic selectors into consumer applications.
- Added controlled operation to `Accordion`, matching the existing controlled/uncontrolled `Tabs`
  state model.
- Updated the development toolchain to Vite 6, Vitest 4.1.11 and Storybook 10, replacing removed
  Storybook packages with their supported core and addon entry points.

### Fixed

- Avatar image failures now fall back to initials and recover when the source changes.
- Navbar branding and translated links wrap without overlapping at narrow widths.
- Shared Tooltip descriptions follow the focused control and preserve consumer descriptions.
- Copyable titleless/custom-header dialog and hidden-label stories now supply accessible names.
- Modal and Drawer own every Tab/Shift+Tab step so platform keyboard preferences cannot break the focus trap.
- Focused notification controls scroll fully into view in Firefox on short screens.
- Compact Textarea padding now wins utility stylesheet ordering while preserving minimum height.
- Settings preserves save feedback while viewing Team and restores focus after discard or clearing search.

- Loading buttons now embed the shared spinner decoratively so the button keeps its original
  accessible name instead of announcing a second loading label.
- Hardened form semantics, keyboard behavior, accessible naming and focus handling across component
  demos and overlay interactions.
- `FormField` now generates the control ID, wires labels automatically, keeps hint and error text
  available together, and propagates native `required` semantics to compatible controls.
- Tabs now support Home/End navigation and skip disabled triggers; Tabs and Accordion compose
  consumer event handlers without overriding internal behavior and honor `event.preventDefault()`.
- Landing theme controls select their named theme, search covers all 30 documented component
  families on desktop and mobile, and example actions open real dialogs or show feedback.

### Migration notes

- Compiled CSS now targets Safari 16.4+, Chrome 111+ and Firefox 128+; consumers still import the
  same stylesheet without installing Tailwind. See [compiler compatibility](docs/tailwind-build.md).
- `Switch` now forwards its ref to a native `HTMLInputElement`, replacing the old button target.
  Update `useRef<HTMLButtonElement>` to `useRef<HTMLInputElement>` and avoid private DOM selectors.
  Checkbox/Radio remain native input refs. Uncontrolled form reset restores defaults;
  controlled fields require the caller to reset their state.
- `Progress` forwards its ref, attributes, handlers and styles to the actual `role="progressbar"`
  element, rather than its surrounding label/layout wrapper. Select or wrap a separate layout
  element when needed; do not rely on the old private DOM structure.
- Theme scopes support `data-bui-theme="light|dark"` and legacy `.dark`. Overlays accept
  optional `portalContainer`; assign a real container after mounting and keep it outside
  transformed/clipping ancestors. See [compatibility and examples](docs/compatibility.md).
- These are pre-1.0 development changes, not a published release or a blanket accessibility certification.

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

[Unreleased]: https://github.com/xhu96/bauhaus-ui-library/compare/v0.1.1...Dev
[0.1.1]: https://github.com/xhu96/bauhaus-ui-library/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/xhu96/bauhaus-ui-library/releases/tag/v0.1.0
