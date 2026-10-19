import { Link } from 'react-router-dom'
import AddToCartButton from './AddToCartButton'
import './Product.css'

export default function Product({ product }) {
  return (
    <article className="product-card">
      <Link className="product-card__image-wrap" to={`/products/${product.id}`}>
        <img
          className="product-card__image"
          src={product.thumbnail}
          alt={product.title}
        />
      </Link>
      <div className="product-card__details">
        <p className="product-card__category">{product.category}</p>
        <h2>
          <Link className="product-card__title-link" to={`/products/${product.id}`}>
            {product.title}
          </Link>
        </h2>
        <p className="product-card__description">{product.description}</p>
        <p className="product-card__price">${product.price.toFixed(2)}</p>
        <AddToCartButton product={product} />
      </div>
    </article>
  )
}