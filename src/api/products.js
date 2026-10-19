import { preconnect } from 'react-dom'

const PRODUCTS_ENDPOINT = 'https://dummyjson.com/products'

const MINIMUM_LOAD_TIME_MS = 5000

preconnect(new URL(PRODUCTS_ENDPOINT).origin)

const productsPromise = Promise.all([
  fetch(PRODUCTS_ENDPOINT),
  new Promise((resolve) => setTimeout(resolve, MINIMUM_LOAD_TIME_MS)),
]).then(([response]) => {
  if (!response.ok) {
    throw new Error(`We couldn't reach the store (status ${response.status}).`)
  }
  return response.json()
}).then((data) => {
  if (!Array.isArray(data?.products)) {
    throw new Error('The store returned an unexpected product list.')
  }
  console.info(`[products] Loaded ${data.products.length} products.`)
  return data.products
})

export function findProductById(products, id) {
  return products.find((product) => String(product.id) === String(id))
}

export { PRODUCTS_ENDPOINT }

export default productsPromise