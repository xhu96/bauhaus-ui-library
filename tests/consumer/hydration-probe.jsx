import React from 'react'
import { hydrateRoot } from 'react-dom/client'

export function startHydrationProbe(Button, document) {
  const recoverableErrors = []
  let clicked = false
  function updateEvidence() {
    document.getElementById('hydration-errors').textContent = JSON.stringify(recoverableErrors)
    document.getElementById('hydration-status').textContent = recoverableErrors.length
      ? `Hydration ${clicked ? 'click failed' : 'failed'}: ${recoverableErrors.length} recoverable error(s)`
      : clicked
        ? 'Hydration click passed'
        : 'SSR content ready'
  }
  updateEvidence()
  return hydrateRoot(
    document.getElementById('hydrated'),
    <Button
      onClick={() => {
        clicked = true
        updateEvidence()
      }}
    >
      Hydrated button
    </Button>,
    {
      onRecoverableError(error) {
        recoverableErrors.push(String(error.message ?? error))
        updateEvidence()
      },
    },
  )
}
