import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import BauPage from './BauPage'
import './styles/demo.css'
import './styles/bau.css'

document.body.classList.add('bau-body')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BauPage />
  </StrictMode>,
)
