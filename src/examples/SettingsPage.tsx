import { useState } from 'react'
import { Button } from '../components/Button'
import { Navbar, NavbarBrand, NavbarContent, NavbarLink } from '../components/Navbar'
import { SettingsExample } from './SettingsExample'
import { applySiteTheme, readSiteTheme } from '../site/theme'

export function SettingsPage() {
  const [theme, setTheme] = useState(readSiteTheme)
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable')
  return (
    <div className="settings-page" data-bui-density={density}>
      <Navbar className="settings-navbar" aria-label="Example navigation">
        <NavbarBrand>
          <span className="settings-brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          Bauhaus Studio
        </NavbarBrand>
        <NavbarContent className="settings-nav-controls">
          <NavbarLink href="../../">Library home</NavbarLink>
          <Button
            variant="ghost"
            size="sm"
            aria-pressed={density === 'compact'}
            onClick={() => setDensity((value) => (value === 'compact' ? 'comfortable' : 'compact'))}
          >
            Compact layout
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-pressed={theme === 'dark'}
            onClick={() => {
              const next = theme === 'dark' ? 'light' : 'dark'
              setTheme(next)
              applySiteTheme(next)
            }}
          >
            Dark theme
          </Button>
        </NavbarContent>
      </Navbar>
      <main className="settings-main">
        <SettingsExample />
      </main>
    </div>
  )
}
