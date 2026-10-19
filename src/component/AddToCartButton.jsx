import { useCart } from '../context/CartContext'

export default function AddToCartButton({ product, ref }) {
  const { addToCart, optimisticCart } = useCart()
  const isPending = optimisticCart.some(
    (item) => item.id === product.id && item.pending,
  )

  return (
    <button
      type="button"
      className="add-to-cart-btn"
      ref={ref}
      onClick={() => addToCart(product)}
      disabled={isPending}
    >
      {isPending ? 'Adding…' : 'Add to Cart'}
    </button>
  )
}
