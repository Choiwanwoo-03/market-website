'use client'
import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface CartContextType {
  cartCount: number
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType>({ cartCount: 0, refreshCart: async () => {} })

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [rawCount, setRawCount] = useState(0)
  const cartCount = session ? rawCount : 0

  useEffect(() => {
    if (!session) return
    fetch('/api/cart')
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setRawCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {})
  }, [session])

  const refreshCart = useCallback(async () => {
    if (!session) return
    const res = await fetch('/api/cart')
    if (!res.ok) return
    const data = await res.json()
    setRawCount(Array.isArray(data) ? data.length : 0)
  }, [session])

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)