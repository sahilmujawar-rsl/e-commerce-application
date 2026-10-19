import { createContext, useContext } from 'react'

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export default CartContext