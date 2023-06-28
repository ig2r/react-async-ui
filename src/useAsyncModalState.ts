import { useCallback, useState } from 'react'

export interface AsyncModalProps<TValue, TResult> {
  value: TValue
  resolve: (result: TResult | PromiseLike<TResult>) => void
  reject: (reason?: any) => void
}

export type AsyncModalState<TValue, TResult> =
  | { isOpen: true; props: AsyncModalProps<TValue, TResult> }
  | { isOpen: false; props: null }

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
