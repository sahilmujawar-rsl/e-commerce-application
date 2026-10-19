import { useState } from 'react'
import { useCart } from '../context/CartContext'
import './CartBadge.css'

export default function CartBadge() {
  const {
    cart,
    optimisticCart,
    cartCount,
    feedback,
    removeFromCart,
  } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  const isSyncing =
    optimisticCart.length !== cart.length ||
    optimisticCart.some((item) => item.pending)

  return (
    <div className="cart-badge">
      <button
        className="cart-badge__toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls="cart-items"
        onClick={() => setIsOpen((open) => !open)}
      >
        Cart (<strong>{cartCount}</strong>)
        {isSyncing && <span className="cart-badge__syncing">syncing…</span>}
      </button>
      {isOpen && (
        <section className="cart-badge__items" id="cart-items" aria-label="Cart items">
          {optimisticCart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {optimisticCart.map((item) => (
                <li className="cart-badge__item" key={item.lineId}>
                  <span>
                    {item.title} · ${item.price.toFixed(2)}
                    {item.pending && (
                      <span className="cart-badge__syncing"> adding…</span>
                    )}
                  </span>
                  <button
                    className="cart-badge__remove"
                    type="button"
                    disabled={item.pending}
                    onClick={() => removeFromCart(item.lineId)}
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
      {feedback && (
        <p
          className={`cart-badge__${feedback.type}`}
          role={feedback.type === 'error' ? 'alert' : 'status'}
        >
          {feedback.message}
        </p>
      )}
    </div>
  )
}