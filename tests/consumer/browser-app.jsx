import React, { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { startHydrationProbe } from './hydration-probe.jsx'
import { Controller, useForm } from 'react-hook-form'
import axe from 'axe-core'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Avatar,
  Button,
  Checkbox,
  Drawer,
  FormField,
  Input,
  Modal,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarLink,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  ToastProvider,
  Tooltip,
  useToast,
} from 'bauhaus-ui-library'

function Audit() {
  const [result, setResult] = useState('Not run')
  return (
    <>
      <Button
        onClick={async () => {
          setResult('Running')
          const { violations, incomplete } = await axe.run(document, {
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
          })
          setResult(
            JSON.stringify({
              violations: violations.map(({ id, impact, nodes }) => ({
                id,
                impact,
                targets: nodes.map((n) => n.target),
              })),
              incomplete: incomplete.map((v) => v.id),
            }),
          )
        }}
      >
        Run accessibility scan
      </Button>
      <output data-testid="axe-results" style={{ display: 'block', whiteSpace: 'pre-wrap' }}>
        {result}
      </output>
    </>
  )
}

function Forms() {
  const [native, setNative] = useState('Not submitted')
  const [rhf, setRhf] = useState('Not submitted')
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: { registered: '', consent: false, controlled: false, plan: 'basic' },
  })
  return (
    <>
      <section aria-labelledby="native-title">
        <h2 id="native-title">Native form</h2>
        <form
          id="native-form"
          onSubmit={(e) => {
            e.preventDefault()
            setNative(JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))))
          }}
        >
          <FormField label="Native name" required hint="Required text">
            <Input name="name" />
          </FormField>
          <Checkbox name="consent" label="Native consent" required />
          <FormField label="Native switch">
            <Switch name="toggle" defaultChecked />
          </FormField>
          <RadioGroup aria-label="Native plan" name="plan" defaultValue="basic" required>
            <Radio value="basic" label="Basic" />
            <Radio value="pro" label="Pro" />
          </RadioGroup>
          <Button type="submit">Submit native form</Button> <Button type="reset">Reset native form</Button>
        </form>
        <output data-testid="native-result">{native}</output>
      </section>
      <section aria-labelledby="rhf-title">
        <h2 id="rhf-title">React Hook Form</h2>
        <form onSubmit={handleSubmit((values) => setRhf(JSON.stringify(values)))}>
          <FormField label="Registered name" required>
            <Input {...register('registered', { required: true })} />
          </FormField>
          <Checkbox label="Registered consent" {...register('consent')} />
          <Controller
            name="controlled"
            control={control}
            render={({ field }) => (
              <FormField label="Controlled switch">
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
          <Controller
            name="plan"
            control={control}
            render={({ field }) => (
              <RadioGroup
                aria-label="Controlled plan"
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <Radio value="basic" label="RHF Basic" />
                <Radio value="pro" label="RHF Pro" />
              </RadioGroup>
            )}
          />
          <Button type="submit">Submit RHF form</Button>{' '}
          <Button onClick={() => reset()}>Reset RHF form</Button>
        </form>
        <output data-testid="rhf-result">{rhf}</output>
      </section>
    </>
  )
}

function DirectionSwitches() {
  return (
    <section aria-labelledby="switch-direction-title">
      <h2 id="switch-direction-title">Switch direction geometry</h2>
      <p>All sizes and both states inherit the form direction; the final row overrides it to LTR.</p>
      {[false, true].map((nested) => (
        <div
          key={String(nested)}
          dir={nested ? 'ltr' : undefined}
          data-testid={nested ? 'switch-ltr' : 'switch-inherited'}
        >
          {['sm', 'md', 'lg'].map((size) => (
            <div key={size}>
              {[false, true].map((checked) => (
                <FormField
                  key={String(checked)}
                  label={`${nested ? 'Nested LTR' : 'Inherited'} ${size} ${checked ? 'on' : 'off'}`}
                >
                  <Switch size={size} defaultChecked={checked} />
                </FormField>
              ))}
            </div>
          ))}
        </div>
      ))}
    </section>
  )
}

function OverlayContent({ nested, setNested, host, drawer = false }) {
  const { toast } = useToast()
  return (
    <>
      <Button
        onClick={() =>
          toast({ title: 'Persistent notification', description: 'Inside the active dialog', duration: 0 })
        }
      >
        Add notification
      </Button>
      <Button onClick={() => toast({ title: 'Timed notification', duration: 3000 })}>
        Add timed notification
      </Button>
      <Tooltip content="Dialog descriptive tooltip" delay={0} portalContainer={host}>
        <Button>Dialog tooltip trigger</Button>
      </Tooltip>
      {!drawer && <Button onClick={() => setNested(true)}>Open nested drawer</Button>}
      <Button style={{ display: 'none' }}>Display hidden candidate</Button>
      <Button style={{ visibility: 'hidden' }}>Visibility hidden candidate</Button>
      <Button disabled>Disabled candidate</Button>
      <Button tabIndex={-1}>Negative candidate</Button>
      <Audit />
      {Array.from({ length: 24 }, (_, i) => (
        <p key={i}>
          Long dialog paragraph {i + 1}: all text and the final action must remain reachable while the page
          stays still.
        </p>
      ))}
      <Button data-testid="dialog-last">Final dialog action</Button>
      {!drawer && (
        <Drawer
          open={nested}
          onClose={() => setNested(false)}
          title="Nested drawer"
          portalContainer={host}
          closeLabel="Close nested drawer"
        >
          <OverlayContent host={host} drawer />
        </Drawer>
      )}
    </>
  )
}

function Overlays({ host, toggleDirection }) {
  const [modal, setModal] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [nested, setNested] = useState(false)
  return (
    <section aria-labelledby="overlay-title">
      <h2 id="overlay-title">Local dark overlays</h2>
      <Button onClick={toggleDirection}>Toggle direction</Button>
      <Button onClick={() => setModal(true)}>Open long modal</Button>{' '}
      <Button onClick={() => setDrawer(true)}>Open drawer</Button>
      <Tooltip content="Outside descriptive tooltip" delay={0} portalContainer={host}>
        <Button>Outside tooltip trigger</Button>
      </Tooltip>
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Long modal"
        portalContainer={host}
        closeLabel="Close long modal"
      >
        <OverlayContent nested={nested} setNested={setNested} host={host} />
      </Modal>
      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title="Standalone drawer"
        portalContainer={host}
        closeLabel="Close standalone drawer"
      >
        <OverlayContent host={host} drawer />
      </Drawer>
    </section>
  )
}

function DensityControls({ scope }) {
  return (
    <div>
      {['sm', 'md', 'lg'].map((size) => (
        <div key={size}>
          <Button data-testid={`${scope}-button-${size}`} size={size} intent="secondary">
            {scope} {size} action
          </Button>
          <FormField label={`${scope} ${size} input`}>
            <Input inputSize={size} data-testid={`${scope}-input-${size}`} />
          </FormField>
          <FormField label={`${scope} ${size} select`}>
            <Select
              selectSize={size}
              data-testid={`${scope}-select-${size}`}
              options={[{ label: 'Private', value: 'private' }]}
            />
          </FormField>
        </div>
      ))}
      <FormField label={`${scope} description`}>
        <Textarea data-testid={`${scope}-textarea`} rows={4} />
      </FormField>
    </div>
  )
}

const avatarImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"><rect width="44" height="44" fill="#21409A"/></svg>')}`

function ProductContracts() {
  const [avatarSource, setAvatarSource] = useState(avatarImage)
  return (
    <section id="product-contracts" aria-labelledby="product-contract-title">
      <h2 id="product-contract-title">Product contracts</h2>
      <Tabs defaultValue="first">
        <TabsList aria-label="Retained draft tabs">
          <TabsTrigger value="first">First retained tab</TabsTrigger>
          <TabsTrigger value="second">Second retained tab</TabsTrigger>
        </TabsList>
        <TabsContent value="first" keepMounted>
          <FormField label="Retained tab note">
            <Input name="retained-tab-note" />
          </FormField>
        </TabsContent>
        <TabsContent value="second" keepMounted>
          <Button>Second panel action</Button>
        </TabsContent>
      </Tabs>
      <Accordion defaultValue="details">
        <AccordionItem value="details">
          <AccordionTrigger>Retained details</AccordionTrigger>
          <AccordionContent keepMounted>
            <FormField label="Retained accordion note">
              <Input name="retained-accordion-note" />
            </FormField>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Button>After retained accordion</Button>
      <div>
        <Button intent="primary" variant="ghost" color="yellow">
          Semantic save
        </Button>
        <Button intent="secondary" variant="solid" color="red">
          Semantic cancel
        </Button>
        <Button intent="destructive" variant="ghost" color="blue">
          Semantic delete
        </Button>
      </div>
      <div data-bui-density="compact">
        <DensityControls scope="compact" />
        <div data-bui-density="comfortable">
          <DensityControls scope="comfortable" />
        </div>
      </div>
      <DensityControls scope="default" />
      <Navbar aria-label="Product contract navigation">
        <NavbarBrand>Bauhaus Workspace</NavbarBrand>
        <NavbarContent>
          <NavbarLink href="#product-contracts" active>
            Workspace overview
          </NavbarLink>
          <NavbarLink href="#product-contracts">Project settings</NavbarLink>
          <NavbarLink href="#product-contracts">Team members and permissions</NavbarLink>
        </NavbarContent>
      </Navbar>
      <Avatar src={avatarSource} name="Ada Lovelace" data-testid="contract-avatar" />
      <Button onClick={() => setAvatarSource('data:image/png;base64,broken')}>Break avatar image</Button>
    </section>
  )
}

function App() {
  const [host, setHost] = useState(null)
  const [direction, setDirection] = useState('ltr')
  useEffect(() => {
    document.getElementById('ready').textContent = `Ready: React ${React.version}`
  }, [])
  return (
    <main>
      <h1>Installed package consumer</h1>
      <p id="ready" role="status">
        Starting
      </p>
      <div style={{ fontFamily: 'monospace' }}>
        <h2 id="host-heading">Unowned host heading</h2>
        <button id="host-button">Unowned host button</button>
      </div>
      <div dir={direction} data-testid="form-direction">
        <p>Form direction: {direction}</p>
        <Forms />
        <DirectionSwitches />
      </div>
      <div data-bui-theme="dark" dir={direction} style={{ padding: 16, marginTop: 24 }}>
        <ToastProvider portalContainer={host} dismissLabel="Dismiss notification">
          <Overlays host={host} toggleDirection={() => setDirection(direction === 'ltr' ? 'rtl' : 'ltr')} />
        </ToastProvider>
        <div ref={setHost} id="local-portal" />
      </div>
      <ProductContracts />
      <h2>Page accessibility</h2>
      <Audit />
    </main>
  )
}

startHydrationProbe(Button, document)
createRoot(document.getElementById('app')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
