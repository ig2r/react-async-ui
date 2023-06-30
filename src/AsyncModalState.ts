import { type AsyncModalProps } from './AsyncModalProps'

/**
 * Interaction state for a modal UI element as managed by `useAsyncModalState`.
 * Indicates whether the modal is currently open and contains invocation arguments
 * and callbacks to resolve/reject the interaction.
 */
export type AsyncModalState<TValue, TResult> =
  | { isOpen: true; props: AsyncModalProps<TValue, TResult> }
  | { isOpen: false; props: null }
