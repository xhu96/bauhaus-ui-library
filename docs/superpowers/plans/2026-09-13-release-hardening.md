# Bauhaus 0.2.0dev — release hardening implementation plan

> **For agentic workers:** use superpowers:subagent-driven-development, with one implementer at a time and task-scoped reviews. User instructions prohibit commits and external publication.

**Goal:** Address the 22 findings in the 13 September review, retain consumer compatibility, and refine Bau from the user's generation 4 reference.

**Architecture:** Keep the existing React library and static, multi-page Vite site. Repair native controls and a small shared internal overlay layer; do not add a backend, a new design framework, or a large component catalog. Compile self-contained, scoped CSS. Separate package and site artifacts. Preserve ESM/CJS/UMD and mark the package's client boundary. Keep GitHub Pages changes local until separately authorized.

**Tech Stack:** React 18/19, TypeScript, Tailwind 3 compiled CSS, Vite 6, Storybook 10, Vitest (patched compatible version), GitHub Actions/Pages.

**Spec:** `/Users/mac/.codex/visualizations/2026/09/13/bauhaus-v020dev-review/REVIEW.md`; user requested all release fixes, work in current checkout, and generation 4 as Bau's visual starting point (especially body adjustments).

## Global Constraints

- Work in `/Users/mac/Documents/antigravity/excited-fermi`, branch `0.2.0dev`. No commits, push, merge, tag, deploy, npm publication, public Issues, or changes to remote main/Pages.
- Preserve `react` and `react-dom` peers `^18.0.0 || ^19.0.0`, consumer Node `>=20`, ESM, CJS, UMD, and Storybook 10. Toolchain requirements are documented separately.
- Keep package version `0.2.0` locally, site label `0.2.0dev`, npm instructions explicitly identifying the published `0.1.1`. Do not claim a stable release or invent a published 0.2.0 tag.
- No newsletter, subscription, Discussions, Figma, tracking, backend, or large new component catalog.
- Existing public props stay usable where possible. Native semantics and accessibility take precedence over private DOM structure; document any ref/DOM change in migration guidance and regenerate the API report deliberately.
- CSS must not reset/style unowned host elements. Each owned element uses `bui-reset`; compiled utilities use `bui-` markers. Tokens use `--bui-`; explicit `data-bui-theme="light|dark"` supports nested scopes, with `.dark` retained for compatibility.
- Overlay APIs can add `portalContainer?: HTMLElement | null`; supplying a local themed container must preserve that theme without making its dialog inert. Default body portals remain SSR safe. Do not introduce a public overlay framework or rich theme provider.
- Use regression tests before production fixes, observe the relevant failure, then implement and verify. CSS tests inspect compiled artifacts and browser effects, not just source strings. Test evidence must distinguish real browser checks from jsdom limitations.
- Preserve others' edits. Implementers own only their task files, do not spawn agents, and do not commit. Reports include RED/GREEN evidence and exact commands. Reviews use uncommitted task-scoped patches because HEAD must not change.
- Bau's new appearance requires the actual generation 4 reference, not an assumption. Preserve its recognizable head, palette, and geometric identity; refine the body before deriving other poses. Do not regenerate a different mascot.

## Task 1: Native controls and state contracts

**Findings:** F02, F07, F08, F12, F14; bounded GeometricPattern hardening.

**Ownership:** `src/components/{FormField,FormFieldContext,Input,Textarea,Select,Checkbox,Radio,Switch,Tabs,Progress,GeometricPattern}.tsx` (FormFieldContext is `.ts`), their existing/new tests, and a focused internal form-reset helper under `src/lib/` if shared. Do not edit CSS/config/package files or API report yet.

- [ ] Read current implementations and tests. Add failing user-observable regressions for explicit child IDs, native required=false, label activation, both hint/error with external description, and an explicitly documented single-control composition model.
- [ ] FormField uses one consistent ID rule: explicit `htmlFor`, else the single immediate child's explicit ID, else generated ID. Preserve an explicit control ID and use context label ID for an accessible name where a wrapper obscures the control; document `htmlFor` for arbitrary nested/native composition. A direct native input/select/textarea child receives missing ID/description/required/error semantics without overwriting explicit attributes or handlers. Do not indiscriminately clone arbitrary child trees or create duplicate IDs for groups.
- [ ] Test and fix Checkbox/Radio `bui-peer` marker and emitted focus utility names. Respect disabled fieldsets, native change/blur, and ref forwarding.
- [ ] Replace Switch's button implementation with a native checkbox input styled as a switch, preserving `checked`, `defaultChecked`, `onCheckedChange`, color, size, and className. Add native name/value/form/required/onChange/onBlur/ref support; submit/reset/validation must work. Space uses native behavior, Enter remains supported without double toggling. Explicit required=false also prevents derived aria-required=true.
- [ ] Radio supports native input props and refs. RadioGroup supports native required override, controlled/uncontrolled state, and reset to defaultValue with subsequent renders staying reset. A cancelled reset must not change state; controlled state remains owned by the caller. Avoid silently notifying onValueChange as if reset were a user selection.
- [ ] Test Tabs with first/all disabled, disabling/removing/reordering the selected trigger, explicit controlled value, Home/End, RTL arrows, prevented handlers. Guarantee an enabled tab stop when any enabled trigger exists. Never silently mutate a controlled value; a valid roving focus fallback may differ from the controlled selection. Preserve ARIA ID relationships and avoid registry render loops.
- [ ] Progress places native/ARIA props on the actual progressbar, with a single semantic element, accessible name, bounded finite numeric values, and indeterminate semantics.
- [ ] GeometricPattern handles empty palette/shapes and non-finite/negative/fractional/huge dimensions with deterministic bounded output (at most 4096 cells). Preserve normal documented use and explain the cap.
- [ ] Run focused tests RED then GREEN; run typecheck and full unit suite once. Report exact changed files and any API implications for Task 4/5.

## Task 2: Self-contained CSS and honest tokens

**Findings:** F01, F13, F18, CSS portion of F19.

**Ownership:** `src/styles/{globals,tokens}.css`, `src/styles/accessibility.test.ts`, new compiled-CSS tests, `tailwind.config.js`, `src/lib/{utils,types}.ts` and tests, semantic foreground class usages in components (coordinate with completed Task 1; do not rewrite behavior).

- [ ] Add compiled CSS regressions before the fix: transform defaults on owned elements/pseudo-elements, correct peer selectors, no global reset, reduced-motion coverage of real Spinner/Switch classes, and semantic blue ink/focus contrast in light/dark.
- [ ] Initialize necessary Tailwind transform/ring/shadow defaults only under `.bui-reset` and pseudo-elements. Retain no global Preflight. Ensure transforms/filters used by existing components resolve validly without demo.css.
- [ ] Tokens declare explicit light/dark scopes so light can be nested inside dark; keep `.dark` compatibility. Do not reset host typography or color globally.
- [ ] Make primary fill and hover colors variable-backed. Add semantic `blue-ink` and focus tokens with suitable light/dark contrast, use them for foregrounds rather than recoloring intentional blue fill. Expose small effective font/border/radius/shadow/motion tokens through existing generated utilities; no theme presets/provider.
- [ ] Cover all owned animations/transitions under reduced-motion, keeping static loading status. Host animation must be unaffected.
- [ ] Build library and run compiled tests plus focused unit/type checks. Browser validation against the packed CSS follows Task 4; record that distinction.

## Task 3: Overlay, feedback, and localization behavior

**Findings:** F09, F10, F11, overlay portion of F19; Toast bounds/timers and internal-label overrides.

**Ownership:** `src/components/{Modal,Drawer,Tooltip,Toast,useDialogBehavior}.tsx` (`useDialogBehavior.ts`), overlay/tooltip/toast tests, focused internal overlay helpers, `src/components/{Alert,Tag,Navbar,Pagination}.tsx` and label tests, package files only for a justified small internal dependency.

- [ ] Add failing regressions for a long Modal, hidden/non-visible/tabIndex=-1 focus targets, nested overlays, pre-existing inert/overflow restoration, consumed Escape, focus restoration when trigger disappears, and toast accessibility/actions while a dialog is open.
- [ ] Keep one internal layer model for Modal/Drawer and toast placement. Filter actual tabbable elements reliably, preferably using the established small `tabbable` primitive if it simplifies correctness; do not build a broad headless component framework. Account for jsdom having no layout in tests without production environment-specific branches. Browser checks are required for visibility/focus.
- [ ] Modal panel fits dynamic viewport and scrolls internally; close/header/actions stay reachable. Visible title owns aria-labelledby; preserve custom accessible name; warn clearly for unnamed dialogs in development only without breaking existing types.
- [ ] `portalContainer` is optional for Modal/Drawer/ToastProvider/Tooltip as appropriate, SSR-safe, preserves local theme, and is not made inert through an ancestor. Sibling inert restoration must not overwrite pre-existing states. Body scroll locks are reference-counted. Topmost layer owns Escape/focus. Dynamic body siblings must be handled or explicitly contained.
- [ ] Toasts created during a dialog are presented within the active accessible layer (not globally exempted interactive siblings). Preserve callbacks and cleanup as dialogs close. Default max visible toasts 5; timers pause on hover, focus and page hidden; `duration: 0` persists; discarded notifications must not leave timers. Configurable maxToasts and dismiss label are small public options, with behavior documented.
- [ ] Tooltip supports Escape dismissal until next activation, focus/hover with a safe handoff to hoverable text, delays, viewport collision handling, local theme and clipping avoidance via portal. Non-interactive tooltip content only; no new Popover product.
- [ ] Expose optional label props for Close/Dismiss/Remove/menu/pagination where English was hard-coded, preserving English defaults. Use logical layout/RTL behavior in touched controls. No i18n dependency.
- [ ] Run focused RED/GREEN tests, typecheck and unit suite. Report public contract additions and exact runtime browser cases still requiring Task 4 verification.

## Task 4: Package compatibility, regression gates, and safe Pages preparation

**Findings:** F03, F04, F05, F06, F17; integrated consumer regression gate.

**Ownership:** package files, `vite*.config.ts`, `vitest.config.ts`, `scripts/`, consumer fixture/tests under `tests/`, `.github/workflows/`, `.gitignore`, `.prettierignore`, `etc/bauhaus-ui-library.api.md`, `src/index.ts`, compatibility/release docs under `docs/`.

- [ ] Add failing package smoke checks for real UMD rendering under React 18 and 19 and a Next App Router Server Component importing Button directly. Preserve all existing consumer ranges and formats.
- [ ] UMD uses JSX output referencing external React.createElement, never bundled React 18 internals; ESM/CJS keep external React/ReactDOM/jsx-runtime and a preserved `use client` directive. Verify declarations in ESM/CJS consumers and conventional SSR render/hydration cases.
- [ ] Fix the confirmed TypeScript 5.5 CommonJS TS1479 failure: publish a separate bundled `index.d.cts` with a `require`-specific `types` condition and retain ESM `index.d.ts` under `import`. Keep legacy main/module/types fallbacks. Verify both `.cts` and ESM consumers against the packed declarations with TypeScript 5.5 and 5.9; do not narrow the user base to newer compiler behavior.
- [ ] Separate landing output (`dist-site`) from package output (`dist`); prepack still builds the library. Update copy paths/preview config, dts exclusions and package fixture to prevent accidental site/declaration leakage.
- [ ] Upgrade vulnerable dev dependencies narrowly after checking primary release/advisory docs. Prefer patched Vitest 4 compatible with existing Vite 6 and Node 20 rather than unnecessarily requiring Vitest 5/Node22. No audit fix --force. Audit full/runtime graphs and retain Storybook10.
- [ ] Consumer fixtures install fresh tarballs (not source aliases), only package CSS, no Tailwind. Test React18/19 ESM/CJS/UMD render, native forms/reset, visual checked/focus/transform states, host isolation, local dark overlays, long modal/tab focus/toast, Tooltip Escape, reduced-motion, and axe significant states. Put executable browser coverage in CI; run available browser checks locally and state untested engines honestly.
- [ ] Shared verification is runnable for pushes to main and 0.2.0dev and PRs. Gate deploy on package build, API, tests and smoke. Avoid duplicating expensive Storybook builds per consumer combination.
- [ ] Prepare one Pages assembly path that always includes frozen old site + old Storybook at SHA `073de432fc4a66a4425d018eed95776e75a5cc7e`, and dev site + docs at the triggering immutable SHA. Include provenance manifest and local assembly tests. Retain last valid artifact/describe rollback by immutable source/artifact. Do not deploy. Explicitly document that remote main's legacy deploy must be disabled/replaced in a separately authorized change before the two-site guarantee is active; a local dev edit cannot fix remote main.
- [ ] Update API report intentionally after prior tasks. Document support matrix by tested scope, native form/RHF examples (no runtime RHF dependency), client entry/Next recipe, themed portals, reduced-motion and pre-1.0 compatibility policy.
- [ ] Run smoke, audit, typecheck, unit, API, library/site/Storybook builds and browser fixture checks. Store precise results, not a blanket accessibility certification.

## Task 5: Landing, discovery, and versioned onboarding

**Findings:** F15, F16, F21, F22.

**Ownership:** `src/App.tsx`, `src/BauPage.tsx`, site tests, `src/styles/{landing,bau,demo}.css`, `src/Introduction.mdx`, README/CHANGELOG, small example docs/stories, a shared ButtonLink/action-style module and tests if needed, corresponding public index/API additions.

- [ ] Add failing tests for Light/Dark choosing exactly the named theme, persistence failure fallback, full-catalog search including Checkbox, mobile equivalent discovery, real modal Cancel, and preview version messaging.
- [ ] State visibly on landing/Bau/docs that 0.2.0dev is unpublished and npm currently installs 0.1.1. Use real versioned links and no nonexistent 0.2.0 release links. Keep package local version 0.2.0; no tags or publication.
- [ ] Reuse the library's action visual contract for navigation links (anchor semantics) and actual Buttons for actions; reduce duplicate colors/focus/states. Align site/Bau palette with library tokens. Keep overall approved Bauhaus identity: primary geometric blocks, clear grid, flat fills, no unrelated redesign.
- [ ] Search a small explicit catalog of all documented components and link to real Storybook entries; verify against built index. Make it accessible on mobile without an external search service. Replace no-op preview controls with real demos or clear noninteractive examples. Point Examples to tested installation/form examples, not generic repository home.
- [ ] Correct changelog Node/React claims; document font fallback/self-host option, migration DOM/ref changes, support limitations and local preview installation instructions. No marketing promises exceeding test evidence.
- [ ] Run focused tests then build and responsive/keyboard browser checks at desktop/mobile, light/dark, navigation landing↔Bau↔docs; update API report for any intentionally added ButtonLink export.

## Task 6: Bau generation 4 refinement

**Findings:** F20 and user-requested visual improvement.

**Ownership:** `src/components/BauhausMascot.tsx`, its stories/tests, only mascot-related composition in `src/BauPage.tsx`/styles and landing scene instances, design comparison artifact under `docs/` or task visualization directory.

- [ ] Inspect the exact generation 4 image supplied/identified by the user before editing its appearance. Capture the existing standing/working/running baselines.
- [ ] Add failing pose×direction×portrait/scene tests. Mirror the entire dog appropriately in every pose without mirroring unrelated scene text/props; preserve expression and decorative/accessibility behavior.
- [ ] Make a restrained body refinement: connected neck/chest, recognizable canine ribcage/haunch, credible shoulder and hip joints, consistent limb widths/feet and ground contact. Preserve generation 4 head/ear/muzzle identity and primary palette. One canonical proportion set feeds three poses; avoid independent incompatible dog bodies or huge public geometry APIs.
- [ ] Present one improved canonical standing dog beside its baseline for visual approval before propagating visual anatomy to working/running. Technical direction fix can proceed separately while awaiting approval.
- [ ] After approval, derive the other poses and show a consistent three-pose board at equal scale. Check 320/390/1280 viewport framing, SVG title IDs, reduced motion and no clipping/overflows.
- [ ] Run mascot/site tests and relevant builds. Distinguish tested geometry/API from subjective visual approval. No image regeneration unless the user explicitly changes direction.

## Completion

- [ ] Task-scoped reviews clean, followed by one integrated review and any bounded fix wave.
- [ ] Final format/lint/type/unit/build/API/package audit/consumer checks executed on final tree. Avoid claiming unrun Safari/Firefox/screen-reader checks.
- [ ] All changes remain uncommitted in the current checkout. Report what is fixed, exact verification, remaining external Pages activation and visual approval if applicable, and every material ruling with cost if wrong.
