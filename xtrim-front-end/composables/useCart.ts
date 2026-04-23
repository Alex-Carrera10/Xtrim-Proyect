import { computed } from 'vue'

// Exportamos la interfaz para que otros componentes puedan usarla
export interface Product {
  title: string
  price: string
  category: string
  features: string[]
  cartId?: number
}

export const useCart = () => {
  // Usamos el tipo directamente en useState para mayor claridad
  const cart = useState<Product[]>('cart', () => [])

  const addToCart = (product: Product) => {
    cart.value.push({ ...product, cartId: Date.now() })
  }

  const removeFromCart = (cartId: number) => {
    cart.value = cart.value.filter(item => item.cartId !== cartId)
  }

  const clearCart = () => {
    cart.value = []
  }

  const cartTotal = computed(() => {
    return cart.value.reduce((total: number, item: Product) => {
      const price = parseFloat(String(item.price || "0"))
      return total + price
    }, 0).toFixed(2)
  })

  const cartCount = computed(() => cart.value.length)

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount
  }
}
