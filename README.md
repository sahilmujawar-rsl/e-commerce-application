# Mini E-Commerce Store (React 19)

A product listing app with registration, product details and an add-to-cart flow, built to demonstrate React 19 features.

## Task 1

### How `use()` is implemented
`src/api/products.js` creates a single product-data Promise. The Promise is created once, outside render, so it stays stable across re-renders. The product listing and product details components pass it to `use()`, which reads the resolved value and suspends the component until the data arrives.

### How `<Suspense>` is used
The components that call `use()` are wrapped in `<Suspense>` in `App.jsx`. While the Promise is pending, the `fallback` is shown. If the Promise rejects, an error boundary around the Suspense shows an error screen with a retry button.

### How `useActionState()` is used
The registration form calls `useActionState(registerAction, initialState)`. `registerAction` receives the previous state and the `FormData`, then:
- validates name, email and password and returns field-level error messages
- waits 5 seconds with `setTimeout` to simulate an API request
- returns a success state, or an error state when the email ends in `@fail.test`

The hook returns the current state used to render errors and the success message, the form action, and a pending flag.

### How `useFormStatus()` is used
The submit button is a separate child component rendered inside the `<form>`. It calls `useFormStatus()` and reads `pending`, which disables the button and changes its label to "Submitting..." while the action runs. The form uses `<form action={...}>`; there is no `onSubmit`.

### How Context is implemented (React 19 syntax)
`UserProvider` renders `<UserContext value={...}>` directly instead of `<UserContext.Provider value={...}>`. After a successful registration, the user's name and email are stored in this context (the password is not stored). `UserDetails` reads the context and displays the registered user's information.

### Asset loading APIs
- **`preconnect()`** is called in `src/api/products.js` just before the product fetch. The API lives on a different origin (`dummyjson.com`), so opening the DNS, TCP and TLS connection early removes that setup time from the request.
- **`preload()`** is used for the first listing image and for the selected product's detail image. These are the images the user is about to see, so loading them with high priority speeds up the first visible render and avoids a blank image area.

`preinit()` and `prefetchDNS()` were not used: the app has no extra scripts or stylesheets to load, and `preconnect()` already covers DNS lookup for the one external origin.

### How Document Metadata is implemented
Each route renders its own `<title>` and `<meta name="description">` inside its component (for example, "Mini E-Commerce Store – Products" on the listing). React 19 hoists these tags into the document `<head>` automatically, so no helper library is needed.

## Task 2

### Product Details
Selecting a product opens a details view showing name, price, description and image. The data comes from the same Promise read with `use()`.

### Add to Cart with `useOptimistic()`
`CartProvider` holds the cart above the routes, so the count persists when moving between listing and details.
1. Clicking Add to Cart updates the cart count immediately through `useOptimistic()`.
2. A simulated async request runs.
3. On success, the item is committed to the real cart state and the count stays the same.
4. On failure, the optimistic update is discarded and the count returns to the actual cart state. Products with an ID divisible by 5 always fail, to demonstrate this.

Items can be viewed and removed from the cart; removals are also optimistic.

### Ref as a prop
`AddToCartButton` is a reusable component that takes `ref` as a normal prop, with no `forwardRef()`. The parent uses the ref to focus the button.

### Ref cleanup
The `ref` is a callback ref that creates a `ResizeObserver` to measure the button. It returns a cleanup function that calls `observer.disconnect()`, which React 19 runs when the element is removed or the ref changes.

### Server and Client Components
This Vite app does not run React Server Components, so this section is conceptual. Real RSC needs a framework such as Next.js.

- **Why Product Details can be a Server Component:** it only renders data (name, price, description, image). It has no state, effects or event handlers, so the fetch and markup can run on the server. This keeps the data-fetching code out of the browser bundle and sends ready HTML.
- **Why Add to Cart must be a Client Component:** it handles click events and uses `useOptimistic()`, state and refs, all of which need the browser.
- **How they work together:** the Server Component fetches the product and renders the details page, then passes the serializable product data (such as id and price) as props to the Client Component `AddToCartButton`. The cart state provider is also a Client Component, wrapped around the page.

### React Compiler
React Compiler is a build-time tool that analyzes components and automatically memoizes values and functions, so `useMemo`, `useCallback` and `React.memo` are usually not needed.

In this app, it could stop the product listing from re-rendering when only the cart count changes. Product cards depend only on product data, so the compiler can reuse their previous output when `CartProvider` state updates. It would also keep handler functions passed to `AddToCartButton` stable, without manual `useCallback`.

The compiler is not enabled in this project.