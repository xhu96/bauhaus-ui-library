import { useMemo, useState } from 'react'
import {
  Accessibility,
  ArrowRight,
  Code2,
  Copy,
  Github,
  Menu,
  Moon,
  PackageCheck,
  Search,
  ShieldCheck,
  Sun,
  SwatchBook,
  X,
  Zap,
} from 'lucide-react'
import {
  Alert,
  BauhausMascot,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  Shape,
  ShapeLogo,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ToastProvider,
  useToast,
} from './index'
import { copyText } from './lib/clipboard'

const PACKAGE_NAME = 'bauhaus-ui-library'
const VERSION = '0.2.0dev'
const INSTALL_COMMAND = `npm install ${PACKAGE_NAME}`
const REPO_URL = 'https://github.com/xhu96/bauhaus-ui-library'
const NPM_URL = 'https://www.npmjs.com/package/bauhaus-ui-library'
const STORYBOOK_URL = './storybook/'
const CHANGELOG_URL = `${REPO_URL}/blob/0.2.0dev/CHANGELOG.md`
const DEV_BRANCH_URL = `${REPO_URL}/tree/0.2.0dev`

const componentNames = ['Button', 'Input', 'Switch', 'Modal', 'Tabs', 'Alert']

const values = [
  {
    icon: Accessibility,
    title: 'Accessible by default',
    copy: 'Keyboard navigation, visible focus, semantic markup, and predictable focus management.',
  },
  {
    icon: Code2,
    title: 'TypeScript first',
    copy: 'Typed props, strong autocomplete, safe composition, and an editor-friendly API.',
  },
  {
    icon: SwatchBook,
    title: 'Themeable at scale',
    copy: 'A compact set of design tokens for color, typography, spacing, and dark mode.',
  },
  {
    icon: Zap,
    title: 'Production-minded',
    copy: 'Tree-shakeable modules, sensible defaults, and a small, deliberate public surface.',
  },
]

const trustSignals = [
  { icon: ShieldCheck, title: 'MIT licensed', copy: 'Open source and community friendly.' },
  { icon: Accessibility, title: 'Accessible', copy: 'WCAG-aware interaction patterns.' },
  { icon: Code2, title: 'TypeScript', copy: 'Typed APIs and editor support.' },
  { icon: PackageCheck, title: 'ESM + CJS', copy: 'Modern modules with require support.' },
  { icon: SwatchBook, title: 'Design tokens', copy: 'A consistent visual system.' },
]

const appCode = `import { Button } from '${PACKAGE_NAME}'
import '${PACKAGE_NAME}/styles.css'

export function App() {
  return (
    <Button color="blue">
      Build with Bauhaus
    </Button>
  )
}`

function SectionHeading({ eyebrow, title, copy }: { eyebrow?: string; title: string; copy: string }) {
  return (
    <div className="landing-section-heading">
      {eyebrow && <p className="landing-eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  )
}

function LandingPage() {
  const { toast } = useToast()
  const [dark, setDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
  )
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [switchOn, setSwitchOn] = useState(true)
  const [tab, setTab] = useState('overview')
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredComponents = useMemo(
    () => componentNames.filter((name) => name.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  )

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('bauhaus-theme', next ? 'dark' : 'light')
    } catch {
      // Theme persistence is optional.
    }
  }

  const copySnippet = async (text: string, label: string) => {
    try {
      await copyText(text)
      toast({ title: `${label} copied`, description: text.split('\n')[0], status: 'success' })
    } catch {
      toast({ title: 'Copy failed', description: 'Select the text and copy it manually.', status: 'danger' })
    }
  }

  return (
    <div className="landing-shell">
      <a className="landing-skip" href="#main-content">
        Skip to content
      </a>

      <header className="landing-header">
        <a href="#top" className="landing-brand" aria-label="Bauhaus UI home">
          <span className="landing-brand-word">bauhaus</span>
          <span>React library</span>
        </a>

        <nav className={`landing-nav ${mobileMenuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          <a href="#components" onClick={() => setMobileMenuOpen(false)}>
            Components
          </a>
          <a href={STORYBOOK_URL} target="_blank" rel="noreferrer">
            Docs
          </a>
          <a href="#tokens" onClick={() => setMobileMenuOpen(false)}>
            Theming
          </a>
          <a href="#install" onClick={() => setMobileMenuOpen(false)}>
            Resources
          </a>
          <a href="./bau/">Bau</a>
          <a href={CHANGELOG_URL} target="_blank" rel="noreferrer">
            Changelog
          </a>
        </nav>

        <div className="landing-header-actions">
          <button
            type="button"
            className="landing-icon-button landing-search-button"
            aria-label="Search components"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
          >
            <Search aria-hidden />
            <span>Search</span>
          </button>
          <a
            className="landing-icon-button"
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <Github aria-hidden />
          </a>
          <button
            type="button"
            className="landing-theme-button"
            aria-label={dark ? 'Use light theme' : 'Use dark theme'}
            aria-pressed={dark}
            onClick={toggleTheme}
          >
            <span aria-hidden>{dark ? <Moon /> : <Sun />}</span>
          </button>
          <a className="landing-primary-link" href="#install">
            Get started
          </a>
          <button
            type="button"
            className="landing-mobile-menu"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X aria-hidden /> : <Menu aria-hidden />}
          </button>
        </div>
      </header>

      {searchOpen && (
        <div className="landing-search-panel">
          <label htmlFor="component-search">Search the component preview</label>
          <div>
            <Input
              id="component-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try “Button” or “Tabs”"
              autoFocus
              leftIcon={<Search aria-hidden />}
            />
            <a href="#components" onClick={() => setSearchOpen(false)}>
              View results
            </a>
          </div>
        </div>
      )}

      <main id="main-content">
        <section id="top" className="landing-hero">
          <div className="landing-hero-copy">
            <a className="landing-version" href={DEV_BRANCH_URL} target="_blank" rel="noreferrer">
              <span>v{VERSION}</span>
            </a>
            <h1>
              React components
              <br />
              built with <em>intention.</em>
            </h1>
            <p className="landing-hero-lede">
              Bauhaus UI is an accessible, TypeScript-first component library with a visual system that scales
              from prototype to production.
            </p>
            <div className="landing-hero-actions">
              <a className="landing-primary-link landing-primary-link-lg" href="#install">
                Get started <ArrowRight aria-hidden />
              </a>
              <a className="landing-secondary-link" href="#components">
                Browse components
              </a>
            </div>
            <div className="landing-install-command">
              <code>$ {INSTALL_COMMAND}</code>
              <button type="button" onClick={() => copySnippet(INSTALL_COMMAND, 'Install command')}>
                <Copy aria-hidden /> Copy
              </button>
            </div>
            <p className="landing-compatibility">
              <span>React 18 / 19</span>
              <span>Next.js</span>
              <span>Vite</span>
              <span>TypeScript</span>
            </p>
          </div>

          <figure className="landing-hero-art">
            <BauhausMascot pose="standing" direction="left" scene width="760" height="520" />
          </figure>
        </section>

        <section className="landing-trust" aria-label="Library qualities">
          {trustSignals.map(({ icon: Icon, title, copy }) => (
            <article key={title}>
              <span className="landing-trust-icon" aria-hidden>
                <Icon />
              </span>
              <div>
                <h2>{title}</h2>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="landing-section landing-why">
          <SectionHeading
            eyebrow="Why Bauhaus UI"
            title="Why developers choose Bauhaus UI."
            copy="The confidence of a strong visual language, without giving up familiar React ergonomics."
          />
          <div className="landing-value-grid">
            {values.map(({ icon: Icon, title, copy }, index) => (
              <article key={title}>
                <span className={`landing-value-symbol symbol-${index + 1}`} aria-hidden>
                  <Icon />
                </span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="components" className="landing-section landing-components">
          <div className="landing-components-intro">
            <SectionHeading
              eyebrow="30 components"
              title="Beautiful components. Built to work."
              copy="Thoughtful defaults, meaningful states, and accessible interactions straight out of the box."
            />
            <a href={STORYBOOK_URL} target="_blank" rel="noreferrer">
              Explore all components <ArrowRight aria-hidden />
            </a>
            {query && (
              <p className="landing-results" aria-live="polite">
                {filteredComponents.length} preview{filteredComponents.length === 1 ? '' : 's'} match “{query}
                ”
              </p>
            )}
          </div>

          <div className="landing-component-grid">
            {(!query || filteredComponents.includes('Button')) && (
              <article className="landing-component-card">
                <h3>Button</h3>
                <Button color="blue" fullWidth className="landing-demo-button">
                  Primary
                </Button>
                <Button variant="outline" color="ink" fullWidth className="landing-demo-button">
                  Secondary
                </Button>
                <Button disabled fullWidth className="landing-demo-button">
                  Disabled
                </Button>
              </article>
            )}

            {(!query || filteredComponents.includes('Input')) && (
              <article className="landing-component-card">
                <h3>Input</h3>
                <Input
                  id="landing-input-default"
                  inputSize="sm"
                  placeholder="Default"
                  aria-label="Default input example"
                />
                <Input
                  id="landing-input-focused"
                  inputSize="sm"
                  defaultValue="Focused"
                  aria-label="Focused input example"
                  className="is-demo-focused"
                />
                <Input
                  id="landing-input-error"
                  inputSize="sm"
                  defaultValue="Error"
                  error
                  aria-label="Error input example"
                />
              </article>
            )}

            {(!query || filteredComponents.includes('Switch')) && (
              <article className="landing-component-card">
                <h3>Switch</h3>
                <div className="landing-switch-row">
                  <span>Enabled</span>
                  <Switch checked={switchOn} onCheckedChange={setSwitchOn} size="sm" aria-label="Enabled" />
                </div>
                <div className="landing-switch-row">
                  <span>Checked</span>
                  <Switch defaultChecked size="sm" aria-label="Checked" />
                </div>
                <div className="landing-switch-row">
                  <span>Disabled</span>
                  <Switch disabled size="sm" aria-label="Disabled" />
                </div>
              </article>
            )}

            {(!query || filteredComponents.includes('Modal')) && (
              <article className="landing-component-card">
                <h3>Dialog</h3>
                <div className="landing-dialog-preview">
                  <strong>Confirm changes?</strong>
                  <span>This action cannot be undone.</span>
                  <div>
                    <button type="button">Cancel</button>
                    <button type="button" onClick={() => setDialogOpen(true)}>
                      Confirm
                    </button>
                  </div>
                </div>
              </article>
            )}

            {(!query || filteredComponents.includes('Tabs')) && (
              <article className="landing-component-card">
                <h3>Tabs</h3>
                <Tabs value={tab} onValueChange={setTab}>
                  <TabsList className="landing-demo-tabs">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview">
                    Accessible tab components with smooth interactions.
                  </TabsContent>
                  <TabsContent value="details">
                    Compound parts keep content and triggers connected.
                  </TabsContent>
                  <TabsContent value="settings">Controlled and uncontrolled modes are supported.</TabsContent>
                </Tabs>
              </article>
            )}

            {(!query || filteredComponents.includes('Alert')) && (
              <article className="landing-component-card">
                <h3>Alert</h3>
                <Alert status="success" className="landing-demo-alert">
                  Success message
                </Alert>
                <Alert status="warning" className="landing-demo-alert">
                  Warning message
                </Alert>
                <Alert status="danger" className="landing-demo-alert">
                  Error message
                </Alert>
              </article>
            )}

            {query && filteredComponents.length === 0 && (
              <div className="landing-empty-state">
                <Search aria-hidden />
                <h3>No preview matches “{query}”</h3>
                <p>Try Button, Input, Switch, Modal, Tabs, or Alert.</p>
                <button type="button" onClick={() => setQuery('')}>
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>

        <section id="tokens" className="landing-section landing-tokens">
          <SectionHeading
            eyebrow="Design system"
            title="A design system that stays in style."
            copy="Built on timeless principles. Adaptable to any brand."
          />
          <div className="landing-token-grid">
            <article>
              <h3>Colors</h3>
              <div className="landing-swatches" aria-label="Bauhaus color palette">
                {['#21409A', '#E63329', '#F4C20D', '#1C1C1C', '#F3EFE6', '#FFFFFF'].map((color) => (
                  <span key={color} style={{ backgroundColor: color }} title={color} />
                ))}
              </div>
            </article>
            <article>
              <h3>Typography</h3>
              <strong className="landing-type-sample">Aa</strong>
              <span>Space Grotesk</span>
            </article>
            <article>
              <h3>Geometry</h3>
              <div className="landing-shapes">
                <Shape kind="circle" color="blue" size={42} />
                <Shape kind="square" color="red" size={42} />
                <Shape kind="triangle" color="yellow" size={42} />
              </div>
              <span>Sharp, modular, expressive</span>
            </article>
            <article>
              <h3>Spacing</h3>
              <div className="landing-spacing-scale">
                {[4, 8, 16, 24, 32].map((space) => (
                  <span key={space} style={{ width: space, height: space }} title={`${space}px`} />
                ))}
              </div>
              <span>4 · 8 · 16 · 24 · 32</span>
            </article>
            <article>
              <h3>Themes</h3>
              <button type="button" onClick={() => !dark && toggleTheme()}>
                Light <Sun aria-hidden />
              </button>
              <button type="button" className="is-dark" onClick={() => dark && toggleTheme()}>
                Dark <Moon aria-hidden />
              </button>
            </article>
          </div>
        </section>

        <section id="install" className="landing-install-section">
          <div className="landing-install-copy">
            <p className="landing-eyebrow">Start building</p>
            <h2>From install to interface in minutes.</h2>
            <p>Everything you need to create accessible, expressive interfaces—fast.</p>
            <ol>
              <li>
                <span>1</span>
                <div>
                  <strong>Install</strong>
                  <code>{INSTALL_COMMAND}</code>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <strong>Import</strong>
                  <code>
                    import {'{ Button }'} from '{PACKAGE_NAME}'
                  </code>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <strong>Build</strong>
                  <p>Ship accessible UI with confidence.</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="landing-code-window">
            <div className="landing-code-toolbar">
              <span className="landing-window-controls" aria-hidden>
                <i />
                <i />
                <i />
              </span>
              <strong>App.tsx</strong>
              <button type="button" onClick={() => copySnippet(appCode, 'Code')}>
                <Copy aria-hidden /> Copy
              </button>
            </div>
            <pre>
              <code>{appCode}</code>
            </pre>
          </div>

          <BauhausMascot className="landing-install-mascot" pose="working" scene width="520" height="520" />
        </section>

        <section className="landing-final-cta">
          <div>
            <p className="landing-eyebrow">Version {VERSION}</p>
            <h2>Build something timeless.</h2>
            <p>Build beautiful, accessible interfaces with Bauhaus UI.</p>
            <div>
              <a className="landing-cta-light" href="#install">
                Get started <ArrowRight aria-hidden />
              </a>
              <a className="landing-cta-outline" href={REPO_URL} target="_blank" rel="noreferrer">
                <Github aria-hidden /> View on GitHub
              </a>
            </div>
          </div>
          <BauhausMascot pose="running" scene width="760" height="340" />
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-grid">
          <div>
            <ShapeLogo label="Bauhaus UI" className="landing-footer-logo" />
            <p>An accessible, TypeScript-first React component library inspired by Bauhaus principles.</p>
          </div>
          <div>
            <h2>Product</h2>
            <a href="#components">Components</a>
            <a href="#tokens">Theming</a>
            <a href="./bau/">Bau mascot</a>
            <a href={CHANGELOG_URL}>Changelog</a>
            <a href={NPM_URL}>npm package</a>
          </div>
          <div>
            <h2>Resources</h2>
            <a href={STORYBOOK_URL}>Documentation</a>
            <a href="#install">Installation</a>
            <a href={REPO_URL}>Examples</a>
            <a href={`${REPO_URL}/issues`}>Issues</a>
          </div>
          <div>
            <h2>Community</h2>
            <a href={REPO_URL}>GitHub</a>
            <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`}>Contributing</a>
            <a href={`${REPO_URL}/blob/main/CODE_OF_CONDUCT.md`}>Code of conduct</a>
          </div>
        </div>

        <div className="landing-footer-bottom">
          <span>© 2026 Bauhaus UI</span>
          <span>MIT licensed</span>
          <a href={REPO_URL} aria-label="Bauhaus UI on GitHub">
            <Github aria-hidden />
          </a>
        </div>
      </footer>

      <Modal open={dialogOpen} onClose={() => setDialogOpen(false)} title="Confirm changes">
        <ModalBody>
          <p className="landing-modal-copy">
            This demo uses the real Bauhaus UI modal, including focus management.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            color="blue"
            onClick={() => {
              setDialogOpen(false)
              toast({ title: 'Changes confirmed', status: 'success' })
            }}
          >
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider position="bottom-right">
      <LandingPage />
    </ToastProvider>
  )
}
