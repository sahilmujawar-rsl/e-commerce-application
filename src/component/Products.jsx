import { use } from 'react'
import { preload } from 'react-dom'
import productsPromise from '../api/products'
import './Products.css'
import Product from './Product'
import CartBadge from './CartBadge'

export default function Products() {
  const products = use(productsPromise)

  if (products.length > 0) {
    preload(products[0].thumbnail, { as: 'image' })
  }

  return (
    <>
      <title>Products | E-commerce Store</title>
      <meta
        name="description"
        content="Browse our curated collection of products and find something you’ll love."
      />
      <main className="products-page">
        <header className="products-page__intro">
          <h1>Discover our products</h1>
        </header>
        <CartBadge />
        {products.length === 0 ? (
          <p className="products-page__empty">No products are available right now.</p>
        ) : (
          <div className="products-page__grid">
            {products.map((product) => <Product key={product.id} product={product} />)}
          </div>
        )}
      </main>
    </>
  )
}