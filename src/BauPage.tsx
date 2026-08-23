import { useState } from 'react'
import { ArrowLeft, Github } from 'lucide-react'
import {
  BauhausMascot,
  Button,
  ShapeLogo,
  type BauhausMascotExpression,
  type BauhausMascotPose,
} from './index'

const STORYBOOK_URL = '../storybook/'
const REPO_URL = 'https://github.com/xhu96/bauhaus-ui-library'

const expressions: { expression: BauhausMascotExpression; label: string }[] = [
  { expression: 'curious', label: 'Curious' },
  { expression: 'focused', label: 'Focused' },
  { expression: 'happy', label: 'Happy' },
  { expression: 'playful', label: 'Playful' },
  { expression: 'proud', label: 'Proud' },
  { expression: 'calm', label: 'Calm' },
]

const poses: { pose: BauhausMascotPose; label: string; description: string }[] = [
  { pose: 'standing', label: 'Standing', description: 'Ready to build.' },
  { pose: 'working', label: 'Working', description: 'Focused on the system.' },
  { pose: 'running', label: 'Running', description: 'Moving ideas forward.' },
]

export default function BauPage() {
  const [activePose, setActivePose] = useState<BauhausMascotPose>('standing')

  return (
    <div className="bau-page">
      <a className="bau-skip" href="#bau-main">
        Skip to content
      </a>

      <header className="bau-header">
        <a href="../" className="bau-wordmark" aria-label="Bauhaus UI home">
          Bauhaus UI
        </a>
        <nav aria-label="Bau navigation">
          <a href="../#components">Components</a>
          <a href={STORYBOOK_URL}>Docs</a>
          <a href="#top" aria-current="page">
            Bau
          </a>
        </nav>
        <a className="bau-back" href="../">
          <ArrowLeft aria-hidden /> Back to library
        </a>
      </header>

      <main id="bau-main">
        <section className="bau-hero" id="top">
          <div className="bau-hero-copy">
            <h1>BAU</h1>
            <h2>The Bauhaus dog</h2>
            <p>Curious. Clever. Constructive.</p>
          </div>
          <div className="bau-hero-art">
            <BauhausMascot pose="standing" label="Bau standing" />
          </div>
        </section>

        <section className="bau-anatomy" aria-labelledby="bau-anatomy-title">
          <h2 id="bau-anatomy-title">Anatomy &amp; proportions</h2>
          <div className="bau-anatomy-grid">
            <div className="bau-proportion">
              <span className="bau-measure-y">1.0u</span>
              <BauhausMascot pose="standing" />
              <span className="bau-measure-x">1.45u</span>
            </div>
            <div className="bau-anatomy-figure">
              <BauhausMascot pose="standing" label="Bau anatomy diagram" />
            </div>
            <dl className="bau-anatomy-list">
              <div>
                <dt>Head</dt>
                <dd>Red circle · 1.0u</dd>
              </div>
              <div>
                <dt>Ears</dt>
                <dd>Black semicircle · blue square</dd>
              </div>
              <div>
                <dt>Chest</dt>
                <dd>Blue quarter-circle</dd>
              </div>
              <div>
                <dt>Bridge</dt>
                <dd>Short blue rectangle</dd>
              </div>
              <div>
                <dt>Haunch</dt>
                <dd>Blue quarter-circle</dd>
              </div>
              <div>
                <dt>Legs &amp; paws</dt>
                <dd>Yellow rectangles · black semicircles</dd>
              </div>
              <div>
                <dt>Tail</dt>
                <dd>Yellow triangle</dd>
              </div>
              <div>
                <dt>Collar &amp; tag</dt>
                <dd>Black band · yellow circle</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="bau-expressions" aria-labelledby="bau-expressions-title">
          <h2 id="bau-expressions-title">Facial expressions</h2>
          <div className="bau-expression-rail">
            {expressions.map(({ expression, label }) => (
              <figure key={expression}>
                <BauhausMascot variant="portrait" expression={expression} />
                <figcaption>{label}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="bau-poses" aria-labelledby="bau-poses-title">
          <h2 id="bau-poses-title">Pose gallery</h2>
          <div className="bau-pose-grid">
            {poses.map(({ pose, label, description }) => (
              <button
                key={pose}
                type="button"
                className={activePose === pose ? 'is-active' : undefined}
                aria-pressed={activePose === pose}
                onClick={() => setActivePose(pose)}
              >
                <span>{label}</span>
                <BauhausMascot pose={pose} />
                <small>{description}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="bau-api" aria-labelledby="bau-api-title">
          <div>
            <h2 id="bau-api-title">Component API</h2>
            <code>
              {'<BauhausMascot pose="'}
              <strong>{activePose}</strong>
              {'" />'}
            </code>
          </div>
          <div className="bau-api-controls" aria-label="Pose options">
            {poses.map(({ pose, label }) => (
              <Button
                key={pose}
                color="yellow"
                variant={activePose === pose ? 'solid' : 'outline'}
                aria-pressed={activePose === pose}
                onClick={() => setActivePose(pose)}
              >
                {label}
              </Button>
            ))}
          </div>
        </section>
      </main>

      <footer className="bau-footer">
        <ShapeLogo label="Bauhaus UI" />
        <span>React component library</span>
        <a href={REPO_URL}>
          <Github aria-hidden /> GitHub
        </a>
      </footer>
    </div>
  )
}
