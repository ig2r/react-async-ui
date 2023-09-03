# react-async-ui

[![npm](https://img.shields.io/npm/v/react-async-ui)](https://www.npmjs.com/package/react-async-ui)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-async-ui)
![License](https://img.shields.io/github/license/ig2r/react-async-ui)

This package provides state management primitives to build modal user interactions that you can `await`, `resolve` and `reject` using a familiar, `Promise`-based API.

### Design goals

- Provide lightweight building blocks to express modal UI _behavior_ in a way that meshes well with `async`/`await` workflows
- Work with all common React UI component libraries and styling solutions
- Provide first-class TypeScript support and documentation

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

- `state`: Indicates whether the modal is currently open. When open, this object contains a `props` property that holds the parameter value (if any) and `resolve`/`reject` callbacks to complete the modal interaction &mdash; potentially returning a result to the caller &mdash; and close the modal.
- `showModal`: A callback to open the modal and optionally pass along a parameter value. It returns a `Promise` object, so you can `await` it to obtain the result of the modal interaction when the modal component calls `state.props.{resolve|reject}`:

  ```ts
  const result = await showModal(42)
  ```

## Example

Let's build a simple greeter dialog that takes a single string argument (i.e., the name of the person to greet) and can be dismissed through "OK" and "Cancel" buttons:

```tsx
import { useAsyncModalState } from 'react-async-ui'

function App() {
  // Declare state for a modal interaction that takes a string
  // argument and completes with either 'ok' or 'cancel'
  const [state, showModal] = useAsyncModalState<string, 'ok' | 'cancel'>()

  const sayHello = async () => {
    const result = await showModal('world')

    if (result === 'ok') {
      // TODO: Handle "ok" result
    }
  }

  return (
    <>
      <button onClick={sayHello}>
        Say hello!
      </button>

      {/* Only render dialog when state says it's open */}
      {state.isOpen && <GreeterDialog {...state.props} />}
    </>
  )
}
```

The corresponding dialog component then uses `state.props` to access the passed value and return a result through `showModal`:

```tsx
import { AsyncModalProps } from 'react-async-ui'

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
