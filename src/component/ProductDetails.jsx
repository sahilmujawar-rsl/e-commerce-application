import { use, useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { preload } from 'react-dom'
import productsPromise, { findProductById } from '../api/products'
import CartBadge from './CartBadge'
import AddToCartButton from './AddToCartButton'
import './ProductDetails.css'

export default function ProductDetails() {
  const products = use(productsPromise)
  const { id } = useParams()
  const product = findProductById(products, id)

  const [buttonSize, setButtonSize] = useState({ width: 0, height: 0 })

  const addToCartRef = useCallback((node) => {
    if (!node) return

    node.focus()
    console.info('[refs] Focused the product details Add to Cart button.')

    if (typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width)
      const height = Math.round(entry.contentRect.height)

      setButtonSize((current) =>
        current.width === width && current.height === height
          ? current
          : { width, height },
      )
    })

    observer.observe(node)
    console.info('[refs] ResizeObserver attached to Add to Cart button.')

    return () => {
      observer.disconnect()
      console.info('[refs] ResizeObserver disconnected from Add to Cart button.')
    }
  }, [])

  if (!product) {
    return (
      <main className="product-details">
        <title>Product not found | E-commerce Store</title>
        <meta
          name="description"
          content="The requested product could not be found."
        />
        <p className="products-page__empty">We couldn’t find that product.</p>
        <Link className="product-details__back" to="/products">
          Back to products
        </Link>
      </main>
    )
  }

  preload(product.images[0], { as: 'image' })

  return (
    <main className="product-details">
      <title>{product.title} | E-commerce Store</title>
      <meta name="description" content={product.description} />

      <CartBadge />

      <section className="product-details__card" aria-labelledby="product-title">
        <div className="product-details__image-wrap">
          <img
            className="product-details__image"
            src={product.images[0]}
            alt={product.title}
          />
        </div>

        <div className="product-details__info">
          <p className="product-details__category">{product.category}</p>
          <h1 className="product-details__title" id="product-title">
            {product.title}
          </h1>
          <p className="product-details__price">${product.price.toFixed(2)}</p>
          <p className="product-details__description">{product.description}</p>

          <AddToCartButton product={product} ref={addToCartRef} />

          <Link className="product-details__back" to="/products">
            ← Back to products
          </Link>
        </div>
      </section>

      <p className="measured-panel__hint" aria-live="polite">
        Add to Cart button · measured {buttonSize.width} × {buttonSize.height}px
      </p>
    </main>
  )
}