import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SettingsPage } from './examples/SettingsPage'
import './styles/demo.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsPage />
  </StrictMode>,
)
