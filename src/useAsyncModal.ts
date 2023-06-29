import { AsyncModalProps, useAsyncModalState } from './useAsyncModalState'

/**
 * Encapsulates state for a modal UI element and yields a rendered React
 * element when the modal is open. The `props` parameter passed to the render
 * function includes `resolve` and `reject` callbacks that can be used to
 * conclude the interaction.
 *
 * @param renderModal - Function that renders modal UI from given `props`
 * @returns Array with `modal` and `showModal` elements
 */
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
