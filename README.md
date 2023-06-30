# react-async-ui

This package provides state management primitives to build modal user interactions that you can `await`, `resolve` and `reject` using a familiar, `Promise`-based API.

### Design goals

- Provide lightweight building blocks to express modal UI _behavior_ in a way that meshes well with `async`/`await` workflows
- Work with all common React UI component libraries and styling solutions
- Provide TypeScript support

### Installation

```sh
npm install react-async-ui
```

## Usage

The _react-async-ui_ package exports the `useAsyncModalState` hook to manage the lifecycle of a modal UI element that can be shown, `await`'ed, and can optionally accept parameters and return a result to the caller.

```ts
const [state, showModal] = useAsyncModalState<TValue, TResult>()
```

Similar to React's `setState` hook, it returns an array with exactly two elements:

- `state`: Indicates whether the modal is currently open. If it is open, this object also contains a `props` property that holds the parameter value (if any) and `resolve`/`reject` callbacks to complete the modal interaction &mdash; potentially returning a result to the caller &mdash; and close the modal.
- `showModal`: A callback to open the modal and optionally pass along a parameter value. It returns a `Promise` object, so you can `await` this to obtain the result of the modal interaction when the modal component calls `state.props.resolve`/`reject`. Its full signature is:

  ```ts
  function showModal(value: TValue): Promise<TResult>
  ```

## Example

In this example, we'll build a simple "Hello, world" dialog that the user can dismiss using "OK" or "Cancel" buttons.

First, build the dialog component. It'll take two props: `value` (whom to greet) and `resolve` (to close the dialog when the user presses a button).


```tsx
import { AsyncModalProps, useAsyncModalState } from 'react-async-ui'

function GreeterDialog({ value, resolve }: AsyncModalProps<string, 'ok' | 'cancel'>) {
  return (
    <dialog open>
      <p>Hello, {value}!</p>
      <button onClick={() => resolve('ok')}> OK </button>
      <button onClick={() => resolve('cancel')}> Cancel </button>
    </dialog>
  )
}
```

From the main component, we need to invoke the `useAsyncModalState` hook and use the resulting `state` and `showModal` elements to:

1. render our dialog when open &mdash; based on `state`
2. show our dialog when the user clicks the trigger button &mdash; using `showModal`

```tsx
function App() {
  const [state, showModal] = useAsyncModalState<string, 'ok' | 'cancel'>()

  const sayHello = async () => {
    const result = await showModal('world')

    if (result === 'ok') {
      // TODO: Handle "ok" result
    }
  }

  return (
    <>
      <button onClick={sayHello} disabled={state.isOpen}>
        Say hello!
      </button>

      {/* Conditionally show the dialog, passing in data from showModal */}
      {state.isOpen && <GreeterDialog {...state.props} />}
    </>
  )
}
```
