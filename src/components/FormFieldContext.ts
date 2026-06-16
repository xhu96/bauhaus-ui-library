import { createContext, useContext } from 'react'

interface FormFieldContextValue {
  describedBy?: string
  invalid: boolean
  required: boolean
}

export const FormFieldContext = createContext<FormFieldContextValue | null>(null)

export function useFormFieldSemantics(explicitDescribedBy?: string) {
  const context = useContext(FormFieldContext)
  const describedBy =
    [explicitDescribedBy, context?.describedBy].filter(Boolean).join(' ') || undefined

  return {
    describedBy,
    invalid: context?.invalid ?? false,
    required: context?.required ?? false,
  }
}
