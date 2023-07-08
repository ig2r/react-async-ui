import { act, renderHook } from '@testing-library/react'
import { assert, expect, test } from 'vitest'
import { useAsyncModalState } from './useAsyncModalState'

test('Modal is initially closed', () => {
  const { result } = renderHook(() => {
    const [state, showModal] = useAsyncModalState()
    return { state, showModal }
  })

  expect(result.current.state.isOpen).toBe(false)
})

test('showModal opens the modal', () => {
  const { result } = renderHook(() => {
    const [state, showModal] = useAsyncModalState()
    return { state, showModal }
  })

  act(() => {
    result.current.showModal()
  })

  expect(result.current.state.isOpen).toBe(true)
})

test('showModal makes its argument available through state', () => {
  const { result } = renderHook(() => {
    const [state, showModal] = useAsyncModalState<number, void>()
    return { state, showModal }
  })

  act(() => {
    result.current.showModal(42)
  })

  expect(result.current.state.props?.value).toBe(42)
})

test('resolve closes its associated modal', async () => {
  const { result } = renderHook(() => {
    const [state, showModal] = useAsyncModalState()
    return { state, showModal }
  })

  let promise: Promise<void>
  act(() => {
    promise = result.current.showModal()
  })

  const props = result.current.state.props
  assert(props !== null)

  await act(() => {
    props.resolve()
    return promise
  })

  expect(result.current.state.isOpen).toBe(false)
})
