
export interface DBMaterial {
  id?: string
  name: string
  type: string
  description: string
  image?: string
  createdAt?: string
  updatedAt?: string
}

export const useMaterials = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiUrl
  const { getAuthHeaders } = useAuth()
  const materials = useState<DBMaterial[]>('materials', () => [])
  const loading = useState<boolean>('materials_loading', () => false)
  const error = useState<string | null>('materials_error', () => null)

  const fetchMaterials = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<DBMaterial[]>(`${apiBase}/materials`)
      materials.value = data
    } catch (err: any) {
      console.error('Error fetching materials:', err)
      error.value = err.message || 'Error loading materials'
    } finally {
      loading.value = false
    }
  }

  const createMaterial = async (materialData: DBMaterial) => {
    loading.value = true
    try {
      const newMaterial = await $fetch<DBMaterial>(`${apiBase}/materials`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: materialData,
      })
      materials.value.unshift(newMaterial)
      return newMaterial
    } catch (err: any) {
      console.error('Error creating material:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateMaterial = async (id: string, materialData: Partial<DBMaterial>) => {
    loading.value = true
    try {
      const updated = await $fetch<DBMaterial>(`${apiBase}/materials/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: materialData,
      })
      const index = materials.value.findIndex(m => m.id === id)
      if (index !== -1) {
        materials.value[index] = updated
      }
      return updated
    } catch (err: any) {
      console.error('Error updating material:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteMaterial = async (id: string) => {
    loading.value = true
    try {
      await $fetch(`${apiBase}/materials/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      materials.value = materials.value.filter(m => m.id !== id)
      return true
    } catch (err: any) {
      console.error('Error deleting material:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    materials,
    loading,
    error,
    fetchMaterials,
    createMaterial,
    updateMaterial,
    deleteMaterial,
  }
}
