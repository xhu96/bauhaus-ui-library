import { useState, type ReactNode } from 'react'
import {
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Github,
  Heart,
  Mail,
  Moon,
  Search,
  Star,
  Sun,
  Trash2,
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Divider,
  Drawer,
  FormField,
  GeometricPattern,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarLink,
  Pagination,
  Progress,
  Radio,
  RadioGroup,
  Select,
  Shape,
  ShapeLogo,
  Slider,
  Spinner,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tag,
  Textarea,
  ToastProvider,
  Tooltip,
  useToast,
  type BauhausColor,
} from './index'
import { type ShapeKind } from './components/Shape'
import { copyText } from './lib/clipboard'

const accentBg: Record<BauhausColor, string> = {
  red: 'bg-bred',
  blue: 'bg-bblue',
  yellow: 'bg-byellow',
  ink: 'bg-ink',
}

const REPO_URL = 'https://github.com/xhu96/bauhaus-ui-library'
const STORYBOOK_URL = 'https://xhu96.github.io/bauhaus-ui-library/storybook/'
const INSTALL_COMMAND = 'npm install bauhaus-ui-library'

const PALETTE: { name: string; hex: string; color: BauhausColor }[] = [
  { name: 'Red', hex: '#E63329', color: 'red' },
  { name: 'Blue', hex: '#21409A', color: 'blue' },
  { name: 'Yellow', hex: '#F4C20D', color: 'yellow' },
  { name: 'Ink', hex: '#1C1C1C', color: 'ink' },
]

const SHAPE_KINDS: ShapeKind[] = ['circle', 'square', 'triangle', 'semicircle', 'quarter', 'ring', 'diamond', 'cross', 'arc']

function Section({
  shape,
  color,
  title,
  children,
}: {
  shape: ShapeKind
  color: BauhausColor
  title: string
  children: ReactNode
}) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="mb-10 flex items-center gap-4">
        <Shape kind={shape} color={color} size={34} />
        <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-ink">{title}</h2>
        <span className={`ml-1 hidden h-1 flex-1 sm:block ${accentBg[color]}`} />
      </div>
      {children}
    </section>
  )
}

function Tile({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-3 border-ink bg-surface p-5">
      <span className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">{label}</span>
      <div className="flex flex-1 flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

function Showcase() {
  const { toast } = useToast()
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerSide, setDrawerSide] = useState<'left' | 'right'>('right')
  const [radioValue, setRadioValue] = useState('square')
  const [sliderValue, setSliderValue] = useState(60)
  const [tab, setTab] = useState('overview')
  const [page, setPage] = useState(3)
  const [notify, setNotify] = useState(true)
  const [dark, setDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
  )

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('bauhaus-theme', next ? 'dark' : 'light')
    } catch {
      /* ignore */
    }
  }

  const openRepo = () => window.open(REPO_URL, '_blank', 'noopener,noreferrer')
  const goToComponents = () => document.getElementById('foundations')?.scrollIntoView({ behavior: 'smooth' })
  const copyInstallCommand = async () => {
    try {
      await copyText(INSTALL_COMMAND)
      toast({ title: 'Install command copied', description: INSTALL_COMMAND, status: 'success' })
    } catch {
      toast({ title: 'Copy failed', description: 'Select the command and copy it manually.', status: 'danger' })
    }
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* ── Navbar ───────────────────────────────────────────── */}
      <Navbar sticky className="gap-2 px-4 sm:gap-6 sm:px-5">
        <NavbarBrand className="shrink-0">
          <ShapeLogo label="Bauhaus UI" className="[&>span:last-child]:hidden sm:[&>span:last-child]:inline" />
        </NavbarBrand>
        <NavbarContent justify="center" className="hidden lg:flex">
          <NavbarLink href="#foundations">Components</NavbarLink>
          <NavbarLink href="#overlays">Overlays</NavbarLink>
          <NavbarLink href="#footer">About</NavbarLink>
        </NavbarContent>
        <NavbarContent justify="end" className="shrink-0 gap-1 sm:gap-5">
          <Button
            size="sm"
            color="ink"
            variant="ghost"
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            size="sm"
            color="ink"
            variant="outline"
            className="hidden sm:inline-flex"
            leftIcon={<Github className="h-4 w-4" />}
            onClick={openRepo}
          >
            GitHub
          </Button>
          <Button
            size="sm"
            color="red"
            className="whitespace-nowrap"
            rightIcon={<ArrowRight className="h-4 w-4" />}
            onClick={goToComponents}
          >
            Get started
          </Button>
        </NavbarContent>
      </Navbar>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="mx-auto w-full max-w-6xl px-6 pb-8 pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Badge color="red" className="mb-6">
              v0.1 · 29 components
            </Badge>
            <h1 className="font-display text-6xl font-bold uppercase leading-[0.95] tracking-tight text-ink sm:text-7xl">
              Build
              <br />
              <span className="text-bred">bold.</span> Think
              <br />
              in <span className="text-bblue">shapes.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-ink-soft">
              A geometric React component library inspired by the Bauhaus movement. Primary colors, hard edges, and a
              relentless grid.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" color="red" rightIcon={<ArrowRight className="h-5 w-5" />} onClick={goToComponents}>
                Get started
              </Button>
              <Button size="lg" variant="outline" color="ink" leftIcon={<Github className="h-5 w-5" />} onClick={openRepo}>
                View source
              </Button>
            </div>
            <div className="mt-5 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-stretch">
              <div className="flex min-w-0 flex-1 items-center border-3 border-ink bg-surface">
                <code className="min-w-0 flex-1 overflow-x-auto px-4 py-3 font-mono text-sm text-ink">
                  {INSTALL_COMMAND}
                </code>
                <button
                  type="button"
                  onClick={copyInstallCommand}
                  aria-label="Copy install command"
                  className="press inline-flex h-11 w-11 shrink-0 items-center justify-center border-l-3 border-ink text-ink hover:bg-ink hover:text-paper"
                >
                  <Copy className="h-4 w-4" aria-hidden />
                </button>
              </div>
              <a
                href={STORYBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="press press-hard inline-flex h-11 items-center justify-center gap-2 border-3 border-ink bg-surface px-4 font-display text-sm font-semibold uppercase tracking-wide text-ink"
              >
                Storybook
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
          <div className="border-3 border-ink shadow-hard-lg">
            <GeometricPattern rows={4} cols={5} seed={11} />
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-6 pb-8">
        <div className="border-3 border-ink">
          <GeometricPattern rows={1} cols={14} seed={29} bordered />
        </div>
      </div>

      {/* ── 01 Foundations ──────────────────────────────────── */}
      <div id="foundations">
        <Section shape="circle" color="blue" title="Foundations">
          <div className="grid gap-6 md:grid-cols-2">
            <Tile label="Palette">
              {PALETTE.map((p) => (
                <div key={p.name} className="flex flex-col items-center gap-2">
                  <span className="h-16 w-16 border-3 border-ink" style={{ background: p.hex }} />
                  <span className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">{p.name}</span>
                </div>
              ))}
            </Tile>
            <Tile label="Shape primitives">
              {SHAPE_KINDS.map((kind, i) => (
                <Shape key={kind} kind={kind} color={PALETTE[i % PALETTE.length].color} size={44} />
              ))}
            </Tile>
          </div>
          <div className="mt-6 border-3 border-ink bg-surface p-6">
            <p className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">Type scale · Space Grotesk + Archivo</p>
            <p className="mt-3 font-display text-5xl font-bold uppercase tracking-tight text-ink">Form follows function</p>
            <p className="mt-2 text-base text-ink-soft">
              The grid is the silent organizer. Everything snaps to it; nothing floats.
            </p>
          </div>
        </Section>
      </div>

      {/* ── 02 Buttons ──────────────────────────────────────── */}
      <Section shape="square" color="red" title="Buttons">
        <div className="grid gap-6 md:grid-cols-3">
          <Tile label="Solid">
            <Button color="red">Red</Button>
            <Button color="blue">Blue</Button>
            <Button color="yellow">Yellow</Button>
            <Button color="ink">Ink</Button>
          </Tile>
          <Tile label="Outline">
            <Button variant="outline" color="red">
              Red
            </Button>
            <Button variant="outline" color="blue">
              Blue
            </Button>
            <Button variant="outline" color="ink">
              Ink
            </Button>
          </Tile>
          <Tile label="Ghost & states">
            <Button variant="ghost" color="blue">
              Ghost
            </Button>
            <Button isLoading color="ink">
              Loading
            </Button>
            <Button disabled>Disabled</Button>
          </Tile>
          <Tile label="Sizes">
            <Button size="sm" color="blue">
              Small
            </Button>
            <Button size="md" color="blue">
              Medium
            </Button>
            <Button size="lg" color="blue">
              Large
            </Button>
          </Tile>
          <Tile label="With icons">
            <Button color="red" leftIcon={<Heart className="h-4 w-4" />}>
              Like
            </Button>
            <Button color="ink" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Next
            </Button>
          </Tile>
          <Tile label="Full width">
            <Button fullWidth color="yellow">
              Block button
            </Button>
          </Tile>
        </div>
      </Section>

      {/* ── 03 Forms ────────────────────────────────────────── */}
      <Section shape="triangle" color="yellow" title="Forms">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sign up</CardTitle>
              <CardDescription>Text inputs, selects and validation states.</CardDescription>
            </CardHeader>
            <CardBody className="space-y-5">
              <FormField label="Email" htmlFor="email" hint="We'll never share it.">
                <Input id="email" type="email" placeholder="you@studio.com" leftIcon={<Mail className="h-4 w-4" />} />
              </FormField>
              <FormField label="Search" htmlFor="q">
                <Input id="q" placeholder="Find components" leftIcon={<Search className="h-4 w-4" />} />
              </FormField>
              <FormField label="Role" htmlFor="role">
                <Select
                  id="role"
                  options={[
                    { label: 'Designer', value: 'designer' },
                    { label: 'Developer', value: 'developer' },
                    { label: 'Both', value: 'both' },
                  ]}
                />
              </FormField>
              <FormField label="Password" htmlFor="pw" error="Must be at least 8 characters.">
                <Input id="pw" type="password" defaultValue="123" error />
              </FormField>
            </CardBody>
          </Card>
          <Card accent="blue">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Selection controls.</CardDescription>
            </CardHeader>
            <CardBody className="space-y-6">
              <FormField label="Message" htmlFor="msg">
                <Textarea id="msg" rows={3} placeholder="Tell us about your project…" />
              </FormField>
              <div className="flex flex-col gap-2">
                <p className="font-display text-xs font-semibold uppercase tracking-wide text-ink">Interests</p>
                <Checkbox label="Components" defaultChecked color="red" />
                <Checkbox label="Templates" color="blue" />
                <Checkbox label="Newsletter" defaultChecked color="ink" />
              </div>
              <div className="space-y-2">
                <p className="font-display text-xs font-semibold uppercase tracking-wide text-ink">Favorite shape</p>
                <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                  <Radio value="square" label="Square" color="red" />
                  <Radio value="circle" label="Circle" color="blue" />
                  <Radio value="triangle" label="Triangle" color="yellow" />
                </RadioGroup>
              </div>
              <Divider />
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-soft">Email notifications</span>
                <Switch checked={notify} onCheckedChange={setNotify} color="blue" aria-label="Notifications" />
              </div>
              <FormField label={`Opacity · ${sliderValue}%`} htmlFor="opacity">
                <Slider
                  id="opacity"
                  min={0}
                  max={100}
                  value={sliderValue}
                  color="red"
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                />
              </FormField>
            </CardBody>
          </Card>
        </div>
      </Section>

      {/* ── 04 Feedback ─────────────────────────────────────── */}
      <Section shape="semicircle" color="red" title="Feedback">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <Alert status="info" title="Heads up">
              The grid is the silent organizer of every layout.
            </Alert>
            <Alert status="success" title="Saved">
              Your composition has been stored.
            </Alert>
            <Alert status="warning" title="Careful">
              Too many colors break the Bauhaus discipline.
            </Alert>
            <Alert status="danger" title="Error" onClose={() => toast({ title: 'Dismissed', status: 'info' })}>
              Something went sideways.
            </Alert>
          </div>
          <div className="space-y-6">
            <Tile label="Progress">
              <div className="w-full space-y-4">
                <Progress value={35} color="red" showLabel />
                <Progress value={70} color="blue" showLabel />
                <Progress indeterminate color="yellow" />
              </div>
            </Tile>
            <Tile label="Badges, tags & spinner">
              <Badge color="red">New</Badge>
              <Badge variant="outline" color="blue">
                Beta
              </Badge>
              <Tag color="ink" dot>
                React
              </Tag>
              <Tag color="blue" onRemove={() => toast({ title: 'Removed tag', status: 'info' })}>
                Tailwind
              </Tag>
              <Spinner color="ink" />
            </Tile>
          </div>
        </div>
      </Section>

      {/* ── 05 Data display ─────────────────────────────────── */}
      <Section shape="diamond" color="blue" title="Data display">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Tile label="Avatars">
            <Avatar name="Walter Gropius" color="red" />
            <Avatar name="Anni Albers" color="blue" shape="circle" />
            <Avatar name="Paul Klee" color="yellow" />
            <Avatar name="László Moholy" color="ink" shape="circle" />
          </Tile>
          <Tile label="Tooltip">
            <Tooltip content="Top tooltip" side="top">
              <Button variant="outline" size="sm">
                Hover top
              </Button>
            </Tooltip>
            <Tooltip content="Right tooltip" side="right">
              <Button variant="outline" size="sm">
                Hover right
              </Button>
            </Tooltip>
          </Tile>
          <Card accent="red" className="md:col-span-2 lg:col-span-1">
            <CardBody>
              <div className="mb-3 flex items-center gap-3">
                <Avatar name="Studio Bauhaus" color="blue" />
                <div>
                  <p className="font-display font-bold text-ink">Studio Bauhaus</p>
                  <p className="text-xs text-ink-muted">Dessau, 1925</p>
                </div>
              </div>
              <p className="text-sm text-ink-soft">A card with an accent bar, hard shadow and thick border.</p>
            </CardBody>
            <CardFooter>
              <Button size="sm" color="ink" leftIcon={<Star className="h-4 w-4" />}>
                Follow
              </Button>
              <Button size="sm" variant="ghost" color="red" leftIcon={<Trash2 className="h-4 w-4" />}>
                Remove
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Section>

      {/* ── 06 Navigation ───────────────────────────────────── */}
      <Section shape="quarter" color="yellow" title="Navigation">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardBody>
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList>
                  <TabsTrigger value="overview" color="red">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="install" color="red">
                    Install
                  </TabsTrigger>
                  <TabsTrigger value="theme" color="red">
                    Theme
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <p className="pt-4 text-sm text-ink-soft">29 components, one geometric language.</p>
                </TabsContent>
                <TabsContent value="install">
                  <p className="pt-4 font-mono text-sm text-ink">npm install bauhaus-ui</p>
                </TabsContent>
                <TabsContent value="theme">
                  <p className="pt-4 text-sm text-ink-soft">Override the CSS variables or extend the Tailwind preset.</p>
                </TabsContent>
              </Tabs>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Accordion type="single" defaultValue="a">
                <AccordionItem value="a">
                  <AccordionTrigger>What is Bauhaus UI?</AccordionTrigger>
                  <AccordionContent>A bold, geometric React component library.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="b">
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>Yes. Roles, aria attributes and keyboard support throughout.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="c">
                  <AccordionTrigger>Can I theme it?</AccordionTrigger>
                  <AccordionContent>Every token is a CSS variable and a Tailwind color.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardBody>
          </Card>
        </div>
        <div className="mt-6 flex flex-col items-center gap-6 border-3 border-ink bg-surface p-6">
          <Breadcrumb>
            <BreadcrumbItem href="#">Home</BreadcrumbItem>
            <BreadcrumbItem href="#">Components</BreadcrumbItem>
            <BreadcrumbItem current>Navigation</BreadcrumbItem>
          </Breadcrumb>
          <Pagination page={page} count={10} onPageChange={setPage} color="blue" />
        </div>
      </Section>

      {/* ── 07 Overlays ─────────────────────────────────────── */}
      <div id="overlays">
        <Section shape="ring" color="ink" title="Overlays">
          <Tile label="Open something">
            <Button color="red" onClick={() => setModalOpen(true)}>
              Open modal
            </Button>
            <Button
              color="blue"
              onClick={() => {
                setDrawerSide('right')
                setDrawerOpen(true)
              }}
            >
              Drawer (right)
            </Button>
            <Button
              variant="outline"
              color="ink"
              onClick={() => {
                setDrawerSide('left')
                setDrawerOpen(true)
              }}
            >
              Drawer (left)
            </Button>
            <Button
              color="yellow"
              onClick={() => toast({ title: 'Composition saved', description: 'Snapped to the grid.', status: 'success' })}
            >
              Success toast
            </Button>
            <Button
              variant="outline"
              color="red"
              onClick={() => toast({ title: 'Upload failed', description: 'Try a smaller file.', status: 'danger' })}
            >
              Error toast
            </Button>
          </Tile>
        </Section>
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer id="footer" className="border-t-3 border-ink bg-ink text-paper">
        <div className="mx-auto w-full max-w-6xl px-6 py-14">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Shape kind="square" color="yellow" size={22} />
              <Shape kind="circle" color="red" size={22} />
              <Shape kind="triangle" color="blue" size={22} />
            </span>
            <span className="font-display text-lg font-bold uppercase tracking-tight">Bauhaus UI</span>
          </div>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-paper-dark">
            A bold, geometric React component library inspired by the Bauhaus movement: 29 accessible
            components, built-in light and dark theming, and a relentless grid. Built with TypeScript and Tailwind.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-display text-sm font-semibold uppercase tracking-wide">
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="hover:text-byellow">
              GitHub
            </a>
            <a
              href={STORYBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-byellow"
            >
              Storybook
            </a>
            <a href="#foundations" className="hover:text-byellow">
              Components
            </a>
          </div>
          <div className="mt-8 flex flex-col gap-3 border-t border-paper/25 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-xs text-paper-dark">
              <Check className="h-4 w-4 shrink-0" /> MIT licensed · Built with React, TypeScript & Tailwind
            </p>
            <p className="font-display text-sm font-semibold tracking-wide text-paper">© 2026 Xhulio Lavdari</p>
          </div>
        </div>
      </footer>

      {/* ── Overlay instances ──────────────────────────────── */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Join the studio" size="md">
        <ModalBody>
          <FormField label="Name" htmlFor="m-name">
            <Input id="m-name" placeholder="Your name" />
          </FormField>
          <p className="mt-4 text-sm text-ink-soft">A focus-trapped, scroll-locked, ESC-dismissable dialog.</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" color="ink" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={() => {
              setModalOpen(false)
              toast({ title: 'Welcome aboard', status: 'success' })
            }}
          >
            Join
          </Button>
        </ModalFooter>
      </Modal>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} side={drawerSide} title="Filters">
        <div className="flex flex-col gap-4">
          <Checkbox label="Show solids" defaultChecked color="red" />
          <Checkbox label="Show outlines" defaultChecked color="blue" />
          <Checkbox label="Show ghosts" color="ink" />
          <Divider label="Colors" />
          <div className="flex gap-2">
            {PALETTE.map((p) => (
              <span key={p.name} className="h-8 w-8 border-3 border-ink" style={{ background: p.hex }} />
            ))}
          </div>
          <Button fullWidth color="ink" onClick={() => setDrawerOpen(false)}>
            Apply
          </Button>
        </div>
      </Drawer>
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider position="bottom-right">
      <Showcase />
    </ToastProvider>
  )
}
