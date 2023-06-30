/**
 * Invocation arguments and resolve/reject callbacks for a modal UI element.
 */
export interface AsyncModalProps<TValue, TResult> {
  value: TValue
  resolve: (result: TResult | PromiseLike<TResult>) => void
  reject: (reason?: any) => void
}
