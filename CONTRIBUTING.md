# Contributing to Bauhaus UI

Thanks for your interest in improving Bauhaus UI! This guide covers the basics.

## Getting started

```bash
git clone https://github.com/xhu96/bauhaus-ui-library.git
cd bauhaus-ui-library
nvm use        # Node 24 (see .nvmrc)
npm install
npm run dev    # showcase at http://localhost:5173
npm run storybook
```

## Before opening a pull request

Run these checks in order; building the library first provides the artifact used by hydration tests:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run typecheck:browser
npm run build:lib
npm test
npm run api:check
npm run test:pages
npm run build
npm run build-storybook
npm run test:catalog
npx playwright install chromium firefox webkit
npm run test:showcase
npm audit
npm audit --omit=dev
```

`npm run format` applies Prettier across the codebase.

Also run `npm run package:smoke -- --retain` to build installed tarball consumers. Copy the printed
`RETAINED_FIXTURES` path into `CONSUMER_FIXTURES=/absolute/printed/path npm run test:browser`.
CI runs these package checks on React 18/19 and checks the consumer Node matrix separately.
See [release verification](docs/release-verification.md) for the complete scope and evidence.
Intentional public API additions require `npm run api:update` and a review of the generated report.

## Conventions

- **Components** live in `src/components/<Name>.tsx`, are exported from `src/index.ts`, and ship a
  matching `<Name>.stories.tsx`. Follow the shared API shape: `color` (`red` / `blue` / `yellow` /
  `ink`), `size` (`sm` / `md` / `lg`), and `variant` where it applies.
- **Theming**: never hardcode surface/ink colors. Use the variable-backed `paper` / `surface` /
  `ink` Tailwind tokens so components flip under `.dark`. See the design notes in the README.
- **Accessibility** is part of every component: roles, ARIA attributes, keyboard support and visible
  focus. The `@storybook/addon-a11y` panel and the Vitest suite help catch regressions.
- **Commits** follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`,
  `docs:`, `chore:`, `style:`, `test:`).

## Reporting issues

Use the issue templates. Include a minimal reproduction, the version, and the browser where relevant.

By contributing you agree that your contributions are licensed under the project's [MIT License](LICENSE).
