# 0.2.0dev2 compatibility and consumer examples

The workspace version is `0.2.0-dev.2` on the `Dev` branch; the preview label is **0.2.0dev2**. The published npm version discussed here is **0.1.1** (`npm install bauhaus-ui-library@0.1.1`). These new APIs require a locally packed development build until a separate release is authorized.

## Supported contract and tested scope

| Area             | Contract / verification                                                                                                                                                                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React peers      | React and ReactDOM both accept `^18.0.0 \|\| ^19.0.0`; packed regression fixtures use 18.3.1 and 19.2.4.                                                                                                                                                                              |
| Consumer Node    | `>=20`, unchanged. Local packed render/SSR checks passed on exact 20.0.0, 20.19.5, 22.11.0 and 24.14.0 with both React majors. CI includes 20.0.0, 20.19.5, 22 and 24; consumer runtime evidence is separate from build-tool installation.                                            |
| Build tools      | Use Node 20.19+ or 22.12+ (Node 24 is the CI build environment). Storybook 10 and Vite 6 have requirements beyond the consumer floor. Vitest 4.1.11 retains Node 20 compatibility.                                                                                                    |
| Formats          | ESM `dist/bauhaus-ui.js`, CJS `dist/bauhaus-ui.cjs`, and real UMD `dist/bauhaus-ui.umd.cjs`; React/ReactDOM are peers, not embedded runtimes.                                                                                                                                         |
| TypeScript       | Packed ESM `.tsx` and CJS `.cts` consumers checked with 5.5.3 and 5.9.3. `exports.import.types` uses `index.d.ts`; `exports.require.types` uses the distinct `index.d.cts`. Legacy `main`, `module`, `types` remain.                                                                  |
| Server rendering | Conventional ReactDOM server rendering remains usable. Open dialogs wait for mounting. ESM/CJS bundles preserve `use client` for Next App Router's client boundary.                                                                                                                   |
| Browser scope    | Standalone fixtures load only packed package CSS and exercise hydration, native controls, RHF, overlays and axe. CI declares Chromium, Firefox and WebKit tests; see the release evidence for engines actually executed. Automated axe results do not certify screen reader behavior. |

React 19 [removed upstream UMD builds](https://react.dev/blog/2024/04/25/react-19-upgrade-guide#umd-builds-removed). Use ESM normally; consumers needing this library's UMD must supply compatible `React` and `ReactDOM` globals themselves. Our fixture creates those globals from the installed React runtime and shares that same runtime with the renderer. There is no invented React 19 CDN UMD filename. The library UMD uses `React.createElement` and does not embed React 18 JSX internals.

The separate declaration files follow [TypeScript's module-specific declaration requirement](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html). Passing a newer compiler alone would miss the TS5.5 `TS1479` regression.

## CSS and native forms

Import `bauhaus-ui-library/styles.css` once. Consumers do not need Tailwind or the demo stylesheet. Owned nodes use `bui-reset`; utilities are prefixed `bui-`; public tokens use `--bui-`. Unowned headings, buttons and page margins retain host styles.

The Tailwind 4 build requires Safari 16.4+, Chrome 111+ or Firefox 128+. The existing
`bui-` class spelling is preserved by the build adapter. See [compiler compatibility](tailwind-build.md)
for migration details and the distinction between the browser floor and executed browser tests.

```tsx
import { Button, Checkbox, FormField, Input, Radio, RadioGroup, Switch } from 'bauhaus-ui-library'
import 'bauhaus-ui-library/styles.css'

export function NativeForm() {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const values = new FormData(event.currentTarget)
        console.log(values.get('name'), values.get('consent'), values.get('plan'))
      }}
    >
      <FormField label="Name" required>
        <Input name="name" />
      </FormField>
      <Checkbox label="Consent" name="consent" required />
      <FormField label="Notifications">
        <Switch name="notifications" defaultChecked />
      </FormField>
      <RadioGroup name="plan" aria-label="Plan" defaultValue="basic" required>
        <Radio value="basic" label="Basic" />
        <Radio value="pro" label="Pro" />
      </RadioGroup>
      <Button type="submit">Submit</Button>
      <Button type="reset">Reset</Button>
    </form>
  )
}
```

Checkbox, Radio and Switch now forward refs to native **inputs**. Switch previously exposed a button: update code that assumed a button ref or private DOM. Native `name`, `value`, required validation, form association and reset now work. Uncontrolled reset restores defaults without synthesizing change callbacks. Controlled values remain caller-owned; reset the controlling state as well. `RadioGroup` owns group name/value/change; attach native per-input refs to `Radio`.

`FormField` supplies semantics to one immediate child; for nested composition provide `htmlFor` and a matching control ID. Multiple controls need individual fields or a named group. Preserve caller descriptions and labels instead of relying on private markup.

## React Hook Form (optional consumer dependency)

The library has no RHF runtime dependency. Native registration and controlled integration are both supported:

```tsx
import { Controller, useForm } from 'react-hook-form'
import { Button, Checkbox, FormField, Input, Switch } from 'bauhaus-ui-library'

export function HookForm() {
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: { name: '', consent: false, enabled: false },
  })
  return (
    <form onSubmit={handleSubmit(console.log)}>
      <FormField label="Name">
        <Input {...register('name', { required: true })} />
      </FormField>
      <Checkbox label="Consent" {...register('consent')} />
      <Controller
        name="enabled"
        control={control}
        render={({ field }) => (
          <FormField label="Enabled">
            <Switch
              ref={field.ref}
              name={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              onBlur={field.onBlur}
            />
          </FormField>
        )}
      />
      <Button type="submit">Submit</Button>
      <Button onClick={() => reset()}>Reset</Button>
    </form>
  )
}
```

## Next App Router and portals

A Server Component may import `Button` directly; the packed entry supplies its client boundary. Put event handlers and state in a consumer file beginning with `'use client'`. Import the CSS in `app/layout.tsx`. The regression fixture builds this Server Component without a hand-written wrapper:

```tsx
import { Button } from 'bauhaus-ui-library'
export default function Page() {
  return <Button>Direct client entry</Button>
}
```

Local theme portals need an actual same-document container after mounting. This ref pattern avoids `document` during SSR:

```tsx
'use client'
import { useState } from 'react'
import { Button, Modal, ToastProvider } from 'bauhaus-ui-library'

export function LocalTheme() {
  const [host, setHost] = useState<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(false)
  return (
    <section data-bui-theme="dark" dir="rtl">
      <ToastProvider portalContainer={host} dismissLabel="Dismiss notification">
        <Button onClick={() => setOpen(true)}>Open</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Details"
          portalContainer={host}
          closeLabel="Close details"
        >
          <p>Theme-aware text</p>
        </Modal>
      </ToastProvider>
      <div ref={setHost} />
    </section>
  )
}
```

Modal, Drawer, ToastProvider and Tooltip accept optional `portalContainer`. Default body portals are SSR-safe. Normal nested `data-bui-theme="light|dark"` scopes inherit tokens; legacy `.dark` remains. Place portal hosts outside transformed or clipping ancestors; cross-document iframe portals are not supported. Toast/Tooltip prefer the active dialog panel, keeping notifications inside its accessible region. Dialog panels set their semantic foreground for plain consumer text. Notifications are capped at five by default (oldest discarded), pause while hovered/focused/page-hidden, and persist with `duration: 0`. Tooltip content is descriptive and non-interactive; Escape dismisses it before its dialog.

Long notification stacks scroll within short dynamic viewports; cards retain their size and dismiss controls remain reachable. Optional translated labels include dialog `closeLabel`, Toast/Alert `dismissLabel`, Tag `removeLabel`, and Pagination `aria-label`, `previousLabel`, `nextLabel`, `getPageLabel`. Supply a dialog title or accessible label.

## Product composition in the local preview

`Button intent="primary|secondary|destructive"` is optional and authoritative over `color`/`variant`.
Primary/destructive fills keep accessible foregrounds; secondary reduces emphasis by omitting the
hard shadow. Override the semantic `--bui-action-*-fill`, `-foreground` and `-hover` RGB aliases in a
custom theme. A consumer using only the existing props retains its existing styling.

`data-bui-density="compact|comfortable"` is inherited and can be nested. It changes marked library
Button/Input/Select heights to compact 32/36/44px or comfortable 36/44/56px for sm/md/lg, and adjusts
Textarea padding. It does not resize unowned host controls or override textarea rows/min-height.

Inactive `TabsContent`/`AccordionContent` still unmount unless `keepMounted` is supplied. Retained
panels use native `hidden` plus protected display hiding; they retain drafts but their effects still
run. Consumer effects should pause work while inactive where needed. Native required fields inside
hidden panels still participate in form validation: the Settings example uses `noValidate`, validates
the snapshot and reveals/focuses the invalid Profile field before showing an error.
`Tabs orientation="vertical"` synchronizes tablist layout, ARIA and Up/Down keyboard navigation;
horizontal remains the default with Left/Right navigation and inherited RTL support. The Settings
example changes orientation at the same 760px breakpoint as its layout, preserving selection and drafts.

`src/examples/SettingsExample.tsx` and `/examples/settings/` are preview-only examples, not package
exports. Load/save adapters receive AbortSignal; changing the loader aborts the old workspace save,
and unmounting aborts pending persistence. The default adapters use versioned localStorage; a denied
write produces a recoverable error while keeping edits. Supply stable API adapters in a consumer.
Storybook includes deterministic loading, load failure, save recovery and empty-team stories.

## Motion and pre-1.0 changes

`prefers-reduced-motion: reduce` disables owned animation and reduces owned transition durations to 0.01ms; it does not modify host elements. Modal/Drawer entrances now use opacity to avoid transformed containing blocks interfering with fixed Tooltip/Toast positioning. Manual screen reader, zoom and OS-preference checks remain distinct from automated scans.

Before 1.0, minor releases may contain documented compatibility changes. Native semantics and accessibility take precedence over private DOM structure. Public prop changes, ref targets, CSS tokens and visible behavior changes must be called out and the API report updated deliberately; no stable-release promise is implied by the 0.2.0dev2 label.
