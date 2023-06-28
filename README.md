# react-async-ui

This package provides state management primitives to build modal user interactions that you can `await`, `resolve` and `reject` using a familiar, `Promise`-based API.

Its main design goal is to provide very lightweight and flexible building blocks to express modal UI *behavior* in a way that meshes well with `async`/`await` workflows, while keeping you 100% free in your choice of component library and styling solution.

## `useAsyncModalState` hook

At the core of *react-async-ui* is the `useAsyncModalState` hook, which returns an array with exactly two elements:

```ts
const [state, showModal] = useAsyncModalState<TValue, TResult>()
```

### `state`

Represents the current state of the user's interation with the modal. The following properties will be available on the `state` object:

* `isOpen`: indicates whether the modal is currently active
* `props`: only set if `isOpen` is `true`, otherwise `null`
  * `props.value`: optional input value passed to `showModal` (see below)
  * `props.resolve(result)`: callback to complete the async interaction with a return value of `result`
  * `props.reject(reason)`: callback to make the async interaction fail and throw the provided `reason` object

### `showModal(value)`

Call this to kick off the async interaction. Accepts an optional input `value` that will be available to modal UI through `state.props`.

Returns an awaitable `Promise` that will yield a result when `state.props.resolve` is called (typically from an UI event handler, e.g., a button click handler), or throw an error object when `state.props.reject` is called.

## Usage example

Here is how you might use `useAsyncModalState` to ask the user for confirmation before deleting an item.

First, declare a `YesNoPrompt` component that takes `value`, `resolve` and potentially `reject` props. You are free in your choice of UI framework to implement the dialog.

```tsx
import { AsyncModalProps, useAsyncModalState } from 'react-async-ui'

function YesNoPrompt({ value, resolve }: AsyncModalProps<string, boolean>) {
  return (
    <dialog open>
      <p>Message: {value}</p>
      <button onClick={() => resolve(true)}>
        Yes
      </button>
      <button onClick={() => resolve(false)}>
        No
      </button>
    </dialog>
  )
}
```

Then, invoke the `showModal` callback to bring up the confirmation dialog and await the returned `Promise` to suspend until the user makes their choice.

```tsx
function App() {
  const [state, showModal] = useAsyncModalState<string, boolean>()

  const confirmDeletion = async () => {
    const result = await showModal('You sure?')
    if (result) {
      // ... User clicked 'Yes' ...
    }
  }

  return (
    <>
      <button onClick={confirmDeletion} disabled={state.isOpen}>
        Delete
      </button>

      {state.isOpen && <YesNoPrompt {...state.props} />}
    </>
  )
}
```

## `useAsyncModal` hook

In addition to `useAsyncModalState`, this package provides a convenience `useAsyncModal` hook that wraps `useAsyncModalState` and accepts a render function that will be called to render modal UI when `showModal` is called:

```tsx
const [modal, showModal] = useAsyncModal<TValue, TResult>(
  props => <YesNoPrompt {...props} />)
```

The returned `modal` element will be a `React.ReactNode` instance that is `null` when the modal is closed, and the result of the given render function when the modal is open.