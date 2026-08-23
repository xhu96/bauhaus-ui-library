import type { SyntheticEvent } from 'react'

type EventHandler<E extends SyntheticEvent> = (event: E) => void

/** Run consumer behavior first and preserve their ability to cancel internals. */
export function composeEventHandlers<E extends SyntheticEvent>(
  consumerHandler: EventHandler<E> | undefined,
  internalHandler: EventHandler<E>,
): EventHandler<E> {
  return (event) => {
    consumerHandler?.(event)
    if (!event.defaultPrevented) internalHandler(event)
  }
}
