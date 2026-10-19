import { startTransition, useOptimistic, useRef, useState } from 'react'
import CartContext from './CartContext'

function sendCartRequest(type, product) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (type === 'add' && product.id % 5 === 0) {
        reject(new Error(`The store rejected "${product.title}".`))
        return
      }
      resolve()
    }, type === 'add' ? 1200 : 500)
  })
}

function cartReducer(currentCart, action) {
  if (action.type === 'add') {
    return [...currentCart, action.item]
  }

  return currentCart.filter((item) => item.lineId !== action.lineId)
}

export default function CartProvider({ children }) {
  const nextLineId = useRef(0)
  const [cart, setCart] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [optimisticCart, updateOptimisticCart] = useOptimistic(cart, cartReducer)

  function addToCart(product) {
    const item = { ...product, lineId: nextLineId.current++, pending: true }
    updateCart({ type: 'add', item }, item)
  }

  function removeFromCart(lineId) {
    const item = cart.find((cartItem) => cartItem.lineId === lineId)
    if (item) updateCart({ type: 'remove', lineId }, item)
  }

  function updateCart(action, item) {
    setFeedback(null)
    console.info(`[cart] ${action.type} product.`, { productId: item.id })
    startTransition(async () => {
      updateOptimisticCart(action)

      await sendCartRequest(action.type, item).then(
        () => {
          const committedAction = action.type === 'add'
            ? { ...action, item: { ...item, pending: false } }
            : action
          setCart((currentCart) => cartReducer(currentCart, committedAction))
          setFeedback({
            type: 'success',
            message: `${item.title} ${action.type === 'add' ? 'added to' : 'removed from'} cart.`,
          })
          console.info(`[cart] Product ${action.type} completed.`, {
            productId: item.id,
          })
        },
        (error) => {
          console.error(`Could not ${action.type} product in cart.`, {
            productId: item.id,
            error,
          })
          setFeedback({
            type: 'error',
            message: error.message || 'Could not update the cart. Try again.',
          })
        },
      )
    })
  }

  return (
    <CartContext
      value={{
        cart,
        optimisticCart,
        cartCount: optimisticCart.length,
        feedback,
        addToCart,
        removeFromCart,
      }}>
      {children}
    </CartContext>
  )
}