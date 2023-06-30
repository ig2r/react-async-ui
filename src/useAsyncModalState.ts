import { useCallback, useState } from 'react'
import { type AsyncModalState } from './AsyncModalState'

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
