# Local verification and safe Pages preparation

No publication or deployment is performed by these local scripts. The development branch is `Dev`, the local package version is `0.2.0-dev.2` (valid npm SemVer), and the site is labelled `0.2.0dev2`. Published npm instructions explicitly use `0.1.1` until a separate publication occurs.

## Reproduce the gates

```sh
npm ci
npm run format:check
npm run lint
npm run typecheck
npm run typecheck:browser
npm run build:lib
npm test
npm run api:check
npm run package:smoke -- --retain
npm audit
npm audit --omit=dev
npm run build
npm run build-storybook
npm run test:catalog
npm run test:pages
npx playwright install chromium firefox webkit
npm run test:showcase
```

Library artifacts stay in `dist`, the landing site in `dist-site`, and Storybook in `storybook-static`. `npm pack` runs `prepack` to rebuild the library. `package:smoke` intentionally packs existing artifacts with scripts disabled so it can test exactly the verified build; run `build:lib` first. Its allowlist rejects missing formats and extra package/site/declaration artifacts. `preview` uses the site's Vite configuration and therefore serves `dist-site`.

Build the library before running the unit suite: the hydration regression intentionally imports the real package entry. Run `test:catalog` after Storybook; this required gate fails if the generated index or any documented entry is missing. An ordinary source-only unit run may skip the catalog check when the index does not exist, so it does not replace this post-build gate.

Smoke installs fresh tarballs into temporary React18/19 consumers, compiles both ESM and CJS consumers with TS5.5/5.9, renders all three formats, builds hydration pages, and builds a Next16 App Router Server Component importing Button directly. `--runtime-only` omits browser/Next fixture construction for consumer Node matrix checks. `--skip-next`, `--types-only` and `--next-only` are focused diagnostic switches; those are not substitutes for the complete gate.

`--retain` prints `RETAINED_FIXTURES=/absolute/temp/path`. `--serve` also keeps the fixture and serves it; to resume later:

```sh
node scripts/serve-consumers.mjs /absolute/temp/path
# http://127.0.0.1:4192/react18/ and /react19/
# Each also has cjs.html and umd.html.
```

The fixtures expose native required form submission/reset, RHF registration/Controller/reset, a real hydrated button, long local dark Modal/Drawer with nesting, notifications, Tooltip Escape, and visible results from an accessibility scan button. They install RHF/axe only as fixture dependencies. Product contracts additionally cover retained panels, semantic actions, inherited density, responsive Navbar and failed Avatar images. The 22 September checks used the in-app browser; the 4 October verification also executes the standard Playwright runners.

CI uses the same retained fixtures:

```sh
CONSUMER_FIXTURES=/absolute/temp/path npm run test:browser
```

`test:showcase` serves the built site and Storybook on port 4191, then checks Settings interactions,
320/390/1280 layouts, translated/unbroken Navbar labels, density and named dialog/recovery stories.
The consumer server uses port 4192 because Firefox reserves port 4190. Accessibility scans wait for
finite animations to settle; the Storybook scan waits for an already-running addon scan to finish.
Standalone native-control keyboard tests use Safari's Option+Tab on macOS; dialogs own every Tab step.
Focus-restoration tests open dialogs from a focused trigger with Enter. Safari mouse clicks do not
focus native buttons; restoring the previous focused element is distinct from tracking a mouse launcher.

`verify.yml` is called by pushes to `main` and `Dev`, PRs, and the manual Pages preparation workflow. It gates on format, lint, types, unit tests, library build, API, smoke/Next, browser checks, audits, assembly tests, site and Storybook builds. Storybook builds once for the development build, not once per consumer combination. Browser test code covers Chromium, Firefox and WebKit; only actual run evidence establishes a passing engine.

## One Pages assembly path

The frozen old site and old Storybook always come from **`073de432fc4a66a4425d018eed95776e75a5cc7e`**. Development site/docs come from the triggering immutable `github.sha`, never a floating branch checkout. A clean CI artifact must pass the shared gates first.

```sh
node scripts/assemble-pages.mjs \
  --legacy /absolute/frozen-checkout \
  --dev /absolute/development-checkout \
  --sha FULL_40_CHARACTER_DEVELOPMENT_COMMIT \
  --output /absolute/new-pages-output
```

For an uncommitted local proof, add `--dirty`; the manifest then explicitly records that the built development content differs from its base commit. Do not represent a dirty local build as an immutable release.

The output layout is:

```text
/                         frozen 0.1.1 landing site
/storybook/               frozen 0.1.1 Storybook
/0.2.0dev/                 verified development landing site
/0.2.0dev/storybook/       verified development Storybook
/provenance.json          both source SHAs, dirty flag, file SHA256 inventory
```

The historical `/0.2.0dev/` preview prefix is retained for compatibility with existing URLs.
It identifies the publishing location, rather than the current branch or package version;
the development manifest label is `0.2.0dev2`. Renaming the branch to `Dev` and versioning the
package as `0.2.0-dev.2` does not migrate these public routes. The root site and `/storybook/`
continue to contain the frozen 0.1.1 builds.

The script validates inputs and rejects symlinks/overlap before replacing an output. It stages the new tree and retains a previous valid assembly beside it. Failed validation preserves the existing output. Local assembly tests check both sites/docs, exact frozen SHA, hashes, dirty provenance, preservation and rejection of floating refs.

`deploy.yml` is preparation-only by default (`workflow_dispatch`, `publish: false`). A separately authorized dispatch with `publish: true` can upload the complete verified artifact to Pages. **Remote main's legacy deployment must be disabled or replaced in a separately authorized change before the two-site guarantee is active.** Editing this development branch cannot change the workflow already on remote main; that workflow may otherwise overwrite the entire Pages site. No remote main, Pages settings or GitHub workflow was changed during local preparation.

## Retention and rollback

Each prepared assembly is saved as `pages-assembly-SHA-RUN_ID` for 90 days, and contains its provenance manifest. Do not delete the last valid artifact when a new verification or assembly fails. Archive a known-good artifact outside GitHub before its retention expires if longer recovery is required.

Rollback requires separate publication authorization: retrieve the exact retained assembly, verify its manifest hashes, and redeploy that artifact as a whole. If it has expired, check out the recorded immutable dev SHA plus the fixed legacy SHA, use their lockfiles and documented Node toolchain, rebuild/verify, and prepare a new assembly. Never reconstruct a rollback from floating `main` or `Dev`, including the historical `0.2.0dev` branch. Browser engines, registry retention and external tool availability can change; preserved bytes are the preferred rollback source.

Dependency maintenance uses compatible patches rather than forced major upgrades: [Vitest mocker advisory](https://github.com/vitest-dev/vitest/security/advisories/GHSA-82fw-gwwq-j7x9), [Vitest4 requirements](https://v4.vitest.dev/guide/), and [js-yaml advisory](https://github.com/nodeca/js-yaml/security/advisories/GHSA-2883-xcg3-v3hh). The implementation uses Vitest4.1.11, fast-uri3.1.8 and js-yaml4.3.2, preserving Storybook10 and Vite6.

## Local result — 22 September 2026

The reviewed working tree remains uncommitted on `0.2.0dev`, based on `6ee274ba93407c599f1bb7619a37764c27550119`. These are local results, not a published release or a successful remote CI run.

- The final independent review confirmed all five consolidated findings addressed, with no new breakage: clean-CI build order, required documentation discovery, RTL Switch containment, Node 26 test storage, and precise expected-provider diagnostics.
- Full suite: **48 files, 260 tests passed, zero skipped**, separately on Node 24.14.0 and the unchanged default Node 26.7.0.
- Formatting, lint, source/browser-test type checks, library/site/Storybook builds, API report, required catalog, and Pages assembly tests passed. Both full and production dependency audits reported zero vulnerabilities. Git whitespace checks passed.
- Fresh installed tarballs passed React 18.3.1 and 19.2.4 ESM/CJS/UMD rendering and SSR, TypeScript 5.5/5.9 import/require checks, and a Next 16.3.5 Server Component build. Consumer runtime probes also passed on exact Node 20.0.0 and Node 26.7.0. Consumer engines/peers and package formats were not narrowed.
- The in-app browser verified all six React-major/format hydration pages, with successful interactions and no recoverable hydration errors. Packed Switches remained contained for every size and both states in inherited RTL, LTR, and nested LTR; native form direction remained inherited. The fresh React 18 UMD page accessibility scan reported zero violations and zero incomplete checks.
- Earlier task-scoped browser checks covered native/RHF forms, nested dark overlays, focus restoration, short-screen toast access, landing/Bau/docs navigation, and 320/390/1280 layouts. These do not certify every browser, device, or assistive technology.

**Still pending:** the exact generation-4 image and approval for Bau's body refinement; execution of the authored Chromium/Firefox/WebKit CI suite; manual assistive-technology/forced-colors/OS reduced-motion checks; separately authorized remote Pages activation. Bau's direction/mirroring was repaired and tested, but its body was not redesigned without the reference. Storybook still reports large documentation chunks; Node 26 also reports an upstream build deprecation warning. These warnings were not suppressed.

No commit, push, tag, PR, npm publication, deployment, or public Issue was created during this work.

## Local result — 4 October 2026

The UI/UX review recommendations are implemented in the existing uncommitted development tree:
semantic Button intents, inherited density, retained panels, vertical Tabs, failed-image recovery,
responsive navigation and accessible stories. The preview-only Settings composition includes
asynchronous adapters, validation, retry, unsaved-change confirmation, persistent save feedback and
search/empty states. Default public behavior remains compatible; the additive API report is updated.

- Final source suite: **49 files, 301 tests passed**, zero skipped, on the local Node 26.7.0 runtime.
- Formatting, lint, source/browser types, ESM/CJS/UMD library builds, API contract, site/Storybook builds
  and Pages assembly tests passed.
- Fresh tarballs passed React 18.3.1 and 19.2.4 rendering, SSR/hydration fixture builds, TypeScript
  5.5/5.9 ESM/CJS imports, exported CSS and a Next 16.3.5 Server Component production build.
  Final retained fixtures: `/var/folders/c7/kh7tw4jj2hddmk4m630btl3h0000gn/T/bauhaus-ui-smoke-432TQU`.
- Responsive rendering was reviewed in the in-app browser at desktop and 390px. Browser regressions
  found and repaired compact Textarea specificity, Safari dialog traversal and partially clipped
  focused notification controls in Firefox.
- Final packed-consumer runner: **96/96 passed** (32 per engine) on Chromium, Firefox and WebKit,
  including React 18/19 and every ESM/CJS/UMD hydration page. Intentional hydration mismatches remain
  rejected by the success gate; native/RHF forms, retained controls, density, overlays and notifications pass.
- Final built showcase/Storybook runner: **24/24 passed** (8 per engine) on Chromium, Firefox and
  WebKit. Selected WCAG scans report zero violations; Settings preserves saved feedback while viewing Team.
  Required built catalog discovery passed. These executions supersede the pending browser-run item
  in the 22 September record, without certifying untested devices or assistive technologies.

**Initial audit result (superseded by the refinement below):** production dependencies reported **zero vulnerabilities**.
Compatible patches upgraded `brace-expansion` to 1.1.21/5.0.12 and removed its advisory. The full
development audit still reports **five high affected packages** (`braces`, `chokidar`, `fast-glob`,
`micromatch`, `tailwindcss`) caused by the unpatched
[braces advisory GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).
The registry currently offers no patched braces release. Npm's forced Tailwind 4 migration is a
breaking build-system change and was not applied. The existing full-audit CI gate is preserved and
will fail until this dependency chain is resolved; passing UI tests does not establish release approval.

Manual screen-reader/assistive-technology, forced-colors and OS-preference checks remain outstanding.
The automated reduced-motion and selected WCAG scans cover only their tested scenarios. Storybook's
large documentation chunks and the upstream Node 26 deprecation warning remain visible. This work
has not been published or deployed.

## Local result — 4 October 2026, Bauhaus refinement

The follow-up removes the development audit blocker with Tailwind/Oxide 4.3.3 and a scoped
compiler adapter. Both `npm audit` and `npm audit --omit=dev` report zero vulnerabilities;
`braces` is absent from the installed dependency tree. The strict CI audit gates remain intact.
The adapter preserves existing public utility names, native peer/focus selectors, transforms,
colored shadows and source watching. See [compiler compatibility](tailwind-build.md) for the
Safari 16.4+, Chrome 111+ and Firefox 128+ CSS floor and maintenance contract.

Settings now follows a primary-color Bauhaus composition with large typography, numbered tabs,
strong rules and a hard-shadow form panel. The home restores the authored 5×4 geometric board and
1×14 strip: mascot and grid alternate every eight seconds with a 450ms fade, stable pause/manual
controls, hidden-page suspension and reduced-motion defaults. The standing, seated and running
mascot bodies now use continuous silhouettes, articulated legs and attached paws; the canonical
head, component API and accessible/decorative semantics are preserved.

- Final full source suite: **50 files, 311 tests passed**, zero skipped.
- Formatting, lint, source/browser types, ESM/CJS/UMD builds, API report, site/Storybook builds,
  required catalog discovery and Pages assembly tests passed.
- Fresh packed consumers passed React 18.3.1/19.2.4 rendering and SSR, TypeScript 5.5/5.9
  import/require checks, exported CSS and a Next 16.3.5 Server Component production build.
  Retained fixtures: `/var/folders/c7/kh7tw4jj2hddmk4m630btl3h0000gn/T/bauhaus-ui-smoke-95eOpt`.
- Packed consumer suite: **96/96 passed**, 32 per engine on Chromium, Firefox and WebKit,
  using the newly built retained fixtures and every React 18/19 ESM/CJS/UMD entry.
- Built showcase suite: **33/33 passed**, 11 per engine on Chromium, Firefox and WebKit,
  including the new hero cycle/pause/reduced-motion/layout checks and all Settings flows.
- In-app browser visual checks covered both home phases, the new mascot, Settings light/dark
  and 320/390px layouts. Native-size 1496px reference layout was inspected; the final captured
  Settings proof uses the current 897px background-tab viewport. The full comparison ledger
  is in [Bauhaus refinement](design/2026-10-04-bauhaus-refinement.md).

These local results supersede the earlier audit and mascot blockers. Manual assistive-technology,
forced-colors and real-device checks remain outside this automated scope. Storybook still reports
large documentation chunks and Node 26's upstream module-registration deprecation. No publication,
deployment or remote repository changes were performed.
