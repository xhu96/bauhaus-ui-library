# Tailwind build compatibility

Bauhaus compiles its stylesheet with Tailwind CSS 4.3.3. Consumers import the
published `bauhaus-ui-library/styles.css`; they do not need Tailwind, PostCSS, or
our build adapter. The public `bui-` class spelling remains unchanged.

## Why the build changed

Tailwind 3 depended on `braces` through its JavaScript source-scanning dependency
chain. The reviewed [braces advisory GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
affects every published version through 3.0.3 and lists no patched release. The
Tailwind 4 migration removes that dependency chain rather than excluding it from
the audit. `npm audit` and `npm audit --omit=dev` remain release checks.

## Supported browsers

The stylesheet requires **Safari 16.4+, Chrome 111+, and Firefox 128+**, following
[Tailwind 4's documented browser requirements](https://tailwindcss.com/docs/upgrade-guide#browser-requirements).
The adapter flattens CSS nesting, but preserves modern features such as
`color-mix()`. Flattening does not establish support for older browsers. Current
Chromium, Firefox, and WebKit consumer tests exercise behavior; they do not prove
compatibility with every historical version at this minimum floor.

## Adapter contract

`scripts/tailwind-compat.mjs` is a local PostCSS plugin used by Vite, Storybook,
and emitted-CSS tests. It calls Tailwind's public compiler and Oxide source
scanner, using the existing configuration for Bauhaus theme values. It translates
legacy candidates to a private `buitw:` compiler prefix and restores their
original class selectors afterward. Variant ordering, negative utilities,
arbitrary values and prefixed arbitrary properties remain supported. Existing
unprefixed arbitrary properties, such as Navbar's `[overflow-wrap:anywhere]`,
are also retained. Unprefixed ordinary utilities are excluded.

The adapter deliberately preserves several Tailwind 3 meanings: token-based
`rounded-none`, the invisible focus outline provided by `outline-none`, and the
old small blur/shadow sizes. If two public names resolve to one compiler
candidate, both selectors are emitted. Translate, scale and rotation utilities
keep the existing composed `transform` cascade so they continue to interact with
our transform-based animations as before.

No Tailwind Preflight is imported. Generated `@property` registrations and their
global fallback initialization are removed. Initial values are declared only on
`.bui-reset` and its `::before`/`::after` pseudo-elements, which prevents importing
the stylesheet from resetting host utility variables. Each owned reset element
receives its own defaults rather than inheriting host transform state. Native
layers are flattened to preserve the existing order between our scoped reset,
utilities, component CSS and focus/reduced-motion rules. Lightning CSS flattens
nesting; browser requirements still apply.

The scanner reports file dependencies and directory globs to PostCSS, so changing
a component or adding a source file invalidates Vite/Storybook's CSS build. Parsed
nodes preserve their source filename for Vite asset resolution. Components must
continue to express complete utility strings in scanned source; runtime class
construction is not discovered automatically.

## Maintenance and verification

Keep `tailwindcss` and `@tailwindcss/oxide` at the same exact version. Review the
adapter when upgrading either package; do not replace it with Tailwind 4's
PostCSS plugin without checking the public class and CSS isolation contracts.
Tailwind configuration options ignored by v4, including `corePlugins`, do not
provide isolation: omitting Preflight and scoping defaults in this adapter do.

Run the focused emitted-CSS tests before rebuilding the package:

```sh
npx vitest run src/styles/tailwind-compat.test.tsx src/styles/accessibility.test.tsx src/components/NativeControls.styles.test.tsx src/components/Overlay.package.test.tsx src/components/Button.test.tsx
npm run build:lib
```

The focused tests cover public prefixes, arbitrary properties, alias collisions,
transform defaults/composition, native peer state and focus, action colors,
reduced motion, source dependencies, and absence of host resets. The release's
packed consumer browser suite remains necessary for actual layout, focus,
hover/active states, token overrides and CSS isolation across engines.
