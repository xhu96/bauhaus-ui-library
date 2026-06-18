# Contributing to Bauhaus UI

Thanks for your interest in improving Bauhaus UI! This guide covers the basics.

## Getting started

```bash
git clone https://github.com/xhu96/bauhaus-ui-library.git
cd bauhaus-ui-library
nvm use        # Node 20 (see .nvmrc)
npm install
npm run dev    # showcase at http://localhost:5173
npm run storybook
```

## Before opening a pull request

Run the full local gate (the same checks CI runs):

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm test            # Vitest
npm run build:lib   # library build + type declarations
```

`npm run format` applies Prettier across the codebase.

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
