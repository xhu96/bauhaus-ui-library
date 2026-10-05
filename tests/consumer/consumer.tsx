import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Checkbox,
  Switch,
} from 'bauhaus-ui-library'
export function Consumer() {
  return (
    <Accordion type="single" value="one" onValueChange={(value) => value.toUpperCase()}>
      <AccordionItem value="one">
        <AccordionTrigger>One</AccordionTrigger>
        <AccordionContent>
          <Button>Typed</Button>
          <Checkbox name="yes" required />
          <Switch name="toggle" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
