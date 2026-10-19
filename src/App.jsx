import { Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ErrorBoundary from './component/ErrorBoundary'
import Fallback from './component/Fallback'
import ProductDetails from './component/ProductDetails'
import Products from './component/Products'
import Registration from './component/Registration'
import UserProvider from './context/UserProvider'
import CartProvider from './context/CartProvider'

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <UserProvider>
          <CartProvider>
            <Suspense fallback={<Fallback />}>
              <Routes>
                <Route path="/" element={<Registration />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="*" element={<Navigate to="/products" replace />} />
              </Routes>
            </Suspense>
          </CartProvider>
        </UserProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App