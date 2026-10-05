import { useState } from 'react'
import { ArrowLeft, Github } from 'lucide-react'
import {
  BauhausMascot,
  Button,
  ShapeLogo,
  type BauhausMascotExpression,
  type BauhausMascotPose,
} from './index'
import { actionStyles } from './lib/actionStyles'

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

const poses: {
  pose: BauhausMascotPose
  expression: BauhausMascotExpression
  label: string
  description: string
}[] = [
  { pose: 'standing', expression: 'happy', label: 'Standing', description: 'Ready to build.' },
  { pose: 'working', expression: 'happy', label: 'Working', description: 'Building alongside you.' },
  { pose: 'running', expression: 'focused', label: 'Running', description: 'Moving ideas forward.' },
]

export default function BauPage() {
  const [activePose, setActivePose] = useState<BauhausMascotPose>('standing')
  const activeExpression = poses.find(({ pose }) => pose === activePose)!.expression

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
        <a className={`${actionStyles({ size: 'sm' })} bau-back`} href="../">
          <ArrowLeft aria-hidden /> Back to library
        </a>
      </header>

      <main id="bau-main">
        <p className="bau-release-note">
          0.2.0dev2 is unpublished. npm currently installs 0.1.1, which does not include Bau.{' '}
          <a href={`${STORYBOOK_URL}?path=/docs/introduction--docs`}>Install the local preview</a>
        </p>
        <section className="bau-hero" id="top">
          <div className="bau-hero-copy">
            <h1>BAU</h1>
            <h2>The Bauhaus dog</h2>
            <p>Curious. Clever. Constructive.</p>
          </div>
          <div className="bau-hero-art">
            <BauhausMascot pose="standing" expression="happy" direction="left" label="Bau standing" />
          </div>
        </section>

        <section className="bau-anatomy" aria-labelledby="bau-anatomy-title">
          <h2 id="bau-anatomy-title">Geometric anatomy</h2>
          <div className="bau-anatomy-grid">
            <div className="bau-proportion">
              <BauhausMascot variant="portrait" expression="happy" />
              <span className="bau-proportion-caption">One shared head</span>
            </div>
            <div className="bau-anatomy-figure">
              <BauhausMascot pose="standing" expression="happy" label="Bau anatomy diagram" />
            </div>
            <dl className="bau-anatomy-list">
              <div>
                <dt>Head</dt>
                <dd>Red circle · yellow quarter-disc</dd>
              </div>
              <div>
                <dt>Ears</dt>
                <dd>Black block · blue quarter-disc</dd>
              </div>
              <div>
                <dt>Shoulder</dt>
                <dd>Red half-disc · yellow and blue quarters</dd>
              </div>
              <div>
                <dt>Torso</dt>
                <dd>Blue rectangle · black diagonal wedge</dd>
              </div>
              <div>
                <dt>Haunch</dt>
                <dd>Split circle · angular overlaps</dd>
              </div>
              <div>
                <dt>Legs &amp; paws</dt>
                <dd>Yellow segments · black feet</dd>
              </div>
              <div>
                <dt>Tail</dt>
                <dd>Yellow quarter-ring · black tip</dd>
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
                <BauhausMascot variant="portrait" expression={expression} label={`Bau — ${label}`} />
                <figcaption>{label}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="bau-poses" aria-labelledby="bau-poses-title">
          <h2 id="bau-poses-title">Pose gallery</h2>
          <div className="bau-pose-grid">
            {poses.map(({ pose, expression, label, description }) => (
              <button
                key={pose}
                type="button"
                className={activePose === pose ? 'is-active' : undefined}
                data-pose={pose}
                aria-pressed={activePose === pose}
                onClick={() => setActivePose(pose)}
              >
                <span>{label}</span>
                <span className="bau-pose-art">
                  <BauhausMascot pose={pose} expression={expression} scene={pose !== 'standing'} />
                </span>
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
              {'" expression="'}
              <strong>{activeExpression}</strong>
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
