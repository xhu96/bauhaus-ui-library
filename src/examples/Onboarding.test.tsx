import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it } from 'vitest'
import { InstallationExample, NativeFormExample } from './Onboarding'

it('runs the installation button example', async () => {
  render(<InstallationExample />)
  await userEvent.click(screen.getByRole('button', { name: 'Build with Bauhaus' }))
  expect(screen.getByRole('status')).toHaveTextContent('Button works')
})

it('submits and resets the preview native form', async () => {
  const user = userEvent.setup()
  render(<NativeFormExample />)
  await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Ada')
  await user.click(screen.getByRole('checkbox', { name: 'Consent' }))
  await user.click(screen.getByRole('button', { name: 'Submit' }))
  expect(screen.getByRole('status')).toHaveTextContent('Ada: consent on; notifications on')
  await user.click(screen.getByRole('button', { name: 'Reset' }))
  expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('')
  expect(screen.getByRole('checkbox', { name: 'Consent' })).not.toBeChecked()
  expect(screen.getByRole('switch', { name: 'Notifications' })).toBeChecked()
  expect(screen.getByRole('status')).toHaveTextContent('Ready')
})
