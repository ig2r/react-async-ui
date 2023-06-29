import { useCallback, useState } from 'react'

/**
 * Provides invocation arguments and callbacks to resolve/reject the interaction
 * to a modal UI element.
 */
export interface AsyncModalProps<TValue, TResult> {
  value: TValue
  resolve: (result: TResult | PromiseLike<TResult>) => void
  reject: (reason?: any) => void
}

/**
 * Interaction state for a modal UI element as managed by `useAsyncModalState`.
 * Indicates whether the modal is currently open and contains invocation arguments
 * and callbacks to resolve/reject the interaction.
 */
export type AsyncModalState<TValue, TResult> =
  | { isOpen: true; props: AsyncModalProps<TValue, TResult> }
  | { isOpen: false; props: null }

/**
 * Manages the state of a modal UI element that can be invoked asynchronously
 * using the returned `showModal` callback.
 *
 * @remarks
 * The `TValue` and `TResult` type parameters indicate the type of the argument to
 * `showModal` and the type of its return value, respectively. Both default to `void`,
 * i.e., a modal that takes no arguments and returns no value upon completion.
 *
 * @returns Array with `state` and `showModal` elements
 */
export function useAsyncModalState<TValue = void, TResult = void>(): [
  state: AsyncModalState<TValue, TResult>,
  showModal: (value: TValue) => Promise<TResult>,
] {
  const closedState: AsyncModalState<TValue, TResult> = { isOpen: false, props: null }
  const [state, setState] = useState<AsyncModalState<TValue, TResult>>(closedState)

  const showModal = useCallback((value: TValue) => {
    const promise = new Promise<TResult>((resolve, reject) =>
      setState({
        isOpen: true,
        props: { value, resolve, reject },
      })
    )

    return promise.finally(() => setState(closedState))
  }, [])

  return [state, showModal]
}
