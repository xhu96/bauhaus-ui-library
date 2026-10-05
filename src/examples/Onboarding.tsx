import { useState } from 'react'
import { Button, Checkbox, FormField, Input, Switch } from '../index'

export function InstallationExample() {
  const [message, setMessage] = useState('Ready')
  return (
    <div>
      <Button color="blue" onClick={() => setMessage('Button works')}>
        Build with Bauhaus
      </Button>
      <p role="status">{message}</p>
    </div>
  )
}

/** Preview-only native form behavior; install a locally packed 0.2.0-dev.2 build. */
export function NativeFormExample() {
  const [message, setMessage] = useState('Ready')
  return (
    <form
      className="bui-flex bui-max-w-md bui-flex-col bui-gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        setMessage(
          `${data.get('name')}: consent ${data.get('consent') || 'off'}; notifications ${data.get('notifications') || 'off'}`,
        )
      }}
      onReset={() => setMessage('Ready')}
    >
      <FormField label="Name" required>
        <Input name="name" />
      </FormField>
      <Checkbox label="Consent" name="consent" required />
      <FormField label="Notifications">
        <Switch name="notifications" defaultChecked />
      </FormField>
      <div className="bui-flex bui-gap-4">
        <Button type="submit" color="blue">
          Submit
        </Button>
        <Button type="reset" variant="outline">
          Reset
        </Button>
      </div>
      <output role="status">{message}</output>
    </form>
  )
}
