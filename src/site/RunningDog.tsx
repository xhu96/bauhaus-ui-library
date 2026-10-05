import { RunningArtwork, RunningComposition } from '../components/mascot/BauArtwork'

/** The final landing pose uses an attentive, closed-mouth expression. */
export function RunningDog() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 760 340"
      width="760"
      height="340"
      aria-hidden="true"
      focusable="false"
      data-bui-mascot="running-study"
    >
      <RunningComposition />
      <RunningArtwork expression="neutral" backdrop="var(--landing-cta-fill, #E63329)" />
    </svg>
  )
}
