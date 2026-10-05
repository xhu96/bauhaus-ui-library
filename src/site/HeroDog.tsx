import { StandingArtwork } from '../components/mascot/BauArtwork'

/** Standing composition for the landing-page hero. */
export function HeroDog() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 760 520"
      width="760"
      height="520"
      aria-hidden="true"
      focusable="false"
      data-bui-mascot="hero-study"
    >
      <StandingArtwork expression="happy" paper="var(--landing-paper, #F3EFE6)" />
    </svg>
  )
}
