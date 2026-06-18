# Changelog

All notable changes to this project are documented in this file. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/xhu96/bauhaus-ui-library/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/xhu96/bauhaus-ui-library/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/xhu96/bauhaus-ui-library/releases/tag/v0.1.0
