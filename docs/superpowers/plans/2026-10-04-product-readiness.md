# Product readiness implementation plan

**Goal:** Implement the library review recommendations authorized on 4 October 2026, preserving the existing Bauhaus visual language and consumer compatibility.

**Architecture:** Keep component changes additive. A preview-only Settings example composes public components and injects asynchronous load/save adapters; it is not exported in the package. Scoped density and semantic actions are optional. Existing uncommitted work remains in place.

**Constraints:** React 18/19 and Node >=20 consumer support; no new production dependencies; default component behavior stays compatible; no publication or deployment as part of this task.

- [x] Avatar failure/recovery, optional retained Tabs/Accordion panels and focused regression tests.
- [x] Responsive Navbar, correctly associated Tooltip descriptions and accessible copyable stories.
- [x] Optional Button intents, scoped compact/comfortable density and semantic action tokens.
- [x] Complete Settings flow: asynchronous load/save, validation, retry, unsaved edits, discard confirmation, searchable members and empty states.
- [x] Expose Settings through the showcase and Storybook; document component contracts and contributor verification.
- [x] Build fresh package/API/site/Storybook; run unit, packed consumer and Chromium/Firefox/WebKit tests.
- [x] Review responsive rendering and interactions, record actual verification scope and remaining manual checks.

**Review focus:** Pending requests must not overwrite edits or update an unmounted page. Hidden retained panels must not remain focusable. Compact density must support nested comfortable scopes. Failed image URLs must recover on a new source. Navigation must remain readable at 320px and with long translated labels.

**Final follow-up verification:** 311 source tests, 96 packed consumer browser tests and 33 built
showcase/story tests pass. Package/SSR/TypeScript/Next builds and the API contract pass. Both production
and full development audits are clean after the Tailwind 4 compiler migration. The Settings Bauhaus
redesign, mascot body refinement and restored animated home geometry are implemented. See
`docs/release-verification.md` for actual scope and outstanding manual checks. No publication was performed.
