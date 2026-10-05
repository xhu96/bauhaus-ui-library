import { WorkingArtwork } from '../components/mascot/BauArtwork'

/** A seated companion for the installation section, with a transparent backdrop. */
export function InstallDog({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 520 520"
      width="520"
      height="520"
      className={className}
      aria-hidden="true"
      focusable="false"
      data-bui-mascot="install-study"
    >
      <WorkingArtwork expression="happy" />
    </svg>
  )
}
