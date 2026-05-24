
export interface DBProduct {
  id?: string
  title: string
  price: string | number
  category: string
  features: string[]
  image?: string
  createdAt?: string
  updatedAt?: string
}

export const useProducts = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiUrl
  const { getAuthHeaders } = useAuth()
  const products = useState<DBProduct[]>('products', () => [])
  const loading = useState<boolean>('products_loading', () => false)
  const error = useState<string | null>('products_error', () => null)

  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<DBProduct[]>(`${apiBase}/products`)
      products.value = data
    } catch (err: any) {
      console.error('Error fetching products:', err)
      error.value = err.message || 'Error loading products'
    } finally {
      loading.value = false
    }
  }

  const createProduct = async (productData: DBProduct) => {
    loading.value = true
    try {
      const newProduct = await $fetch<DBProduct>(`${apiBase}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: productData,
      })
      products.value.unshift(newProduct)
      return newProduct
    } catch (err: any) {
      console.error('Error creating product:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (id: string, productData: Partial<DBProduct>) => {
    loading.value = true
    try {
      const updated = await $fetch<DBProduct>(`${apiBase}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: productData,
      })
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = updated
      }
      return updated
    } catch (err: any) {
      console.error('Error updating product:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProduct = async (id: string) => {
    loading.value = true
    try {
      await $fetch(`${apiBase}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      products.value = products.value.filter(p => p.id !== id)
      return true
    } catch (err: any) {
      console.error('Error deleting product:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}
