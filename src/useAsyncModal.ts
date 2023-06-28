import { AsyncModalProps, useAsyncModalState } from './useAsyncModalState'

export function useAsyncModal<TValue = void, TResult = void>(
  renderModal: (props: AsyncModalProps<TValue, TResult>) => React.ReactNode,
): [
  modal: React.ReactNode,
  showModal: (value: TValue) => Promise<TResult>,
] {
  const [state, showModal] = useAsyncModalState<TValue, TResult>()
  const modal = state.isOpen ? renderModal(state.props) : null
  return [modal, showModal]
}
