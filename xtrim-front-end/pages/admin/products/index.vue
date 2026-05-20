<template>
  <div class="admin-dashboard">
    <!-- Modal de Confirmación de Eliminación -->
    <Transition name="fade">
      <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-icon">
            <Trash2 :size="32" />
          </div>
          <h3>¿Eliminar Mueble?</h3>
          <p>Esta acción es permanente y quitará este mueble del catálogo público del eCommerce inmediatamente.</p>
          <div class="modal-actions">
            <button class="modal-btn cancel" @click="showDeleteModal = false">Cancelar</button>
            <button class="modal-btn confirm" @click="confirmDelete" :disabled="isDeleting">
              {{ isDeleting ? 'Eliminando...' : 'Sí, eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de Creación / Edición de Producto -->
    <Transition name="fade">
      <div v-if="showFormModal" class="modal-overlay" @click="showFormModal = false">
        <div class="modal-content create-modal" @click.stop>
          <div class="modal-header">
            <h3>{{ isEditMode ? 'Editar Mueble' : 'Registrar Nuevo Mueble' }}</h3>
            <button @click="showFormModal = false" class="close-btn"><X :size="20" /></button>
          </div>
          
          <form @submit.prevent="handleSubmitProduct" class="create-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Nombre del Mueble</label>
                <input v-model="formProduct.title" type="text" required placeholder="Ej: Mesa de Centro Walnut">
              </div>
              <div class="form-group">
                <label>Categoría</label>
                <select v-model="formProduct.category" required>
                  <option value="" disabled selected>Seleccionar...</option>
                  <option value="Curation">Curation (Sala)</option>
                  <option value="Masterpieces">Masterpieces (Estudio)</option>
                  <option value="Sanctuary">Sanctuary (Dormitorio)</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div class="form-group">
                <label>Precio de Venta ($)</label>
                <input v-model="formProduct.price" type="number" step="0.01" required placeholder="0.00">
              </div>
              <div class="form-group full-width">
                <label>Imagen del Mueble</label>
                <div class="image-tabs">
                  <button 
                    type="button" 
                    class="tab-btn" 
                    :class="{ active: imageInputMethod === 'file' }"
                    @click="imageInputMethod = 'file'"
                  >
                    <Upload :size="14" /> Subir desde mi Compu
                  </button>
                  <button 
                    type="button" 
                    class="tab-btn" 
                    :class="{ active: imageInputMethod === 'url' }"
                    @click="imageInputMethod = 'url'"
                  >
                    <Link :size="14" /> URL Externa
                  </button>
                </div>

                <div v-if="imageInputMethod === 'file'" class="upload-container">
                  <input 
                    ref="fileInputRef" 
                    type="file" 
                    accept="image/*" 
                    class="hidden-file-input"
                    @change="handleFileChange" 
                  />

                  <div 
                    v-if="!imagePreview" 
                    class="upload-dropzone" 
                    @click="triggerFileInput"
                  >
                    <Upload class="upload-icon" :size="24" />
                    <span class="upload-text">Haz clic para buscar o arrastra una imagen aquí</span>
                    <span class="upload-subtext">Formatos recomendados: PNG, JPG, WEBP</span>
                  </div>

                  <div v-else class="upload-preview-box">
                    <img :src="imagePreview" alt="Previsualización" class="upload-preview-img" />
                    <div class="preview-actions">
                      <button type="button" class="action-btn delete-img-btn" @click="removeUploadedImage">
                        Quitar Imagen
                      </button>
                    </div>
                  </div>
                </div>

                <div v-else class="url-input-container">
                  <input 
                    v-model="formProduct.image" 
                    type="text" 
                    placeholder="Ej: https://mis-imagenes.com/mesa.png o /coffee-table.png"
                  />
                  <div v-if="formProduct.image" class="url-preview-box mt-2">
                    <span class="preview-title">Vista previa de la URL externa:</span>
                    <img :src="formProduct.image" alt="URL Preview" class="upload-preview-img small" />
                  </div>
                </div>
              </div>
              <div class="form-group full-width">
                <label>Características / Detalles (Una por línea)</label>
                <textarea 
                  v-model="featuresText" 
                  rows="4" 
                  placeholder="Ej:&#10;Madera de nogal macizo de alta calidad&#10;Juntas artesanales invisibles&#10;Acabado frotado a mano"
                  required
                ></textarea>
              </div>
            </div>

            <div class="modal-actions mt-4">
              <button type="button" class="modal-btn cancel" @click="showFormModal = false">Cancelar</button>
              <button type="submit" class="modal-btn confirm" :disabled="formLoading">
                {{ formLoading ? 'Guardando...' : 'Guardar Mueble' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <aside class="sidebar">
      <div class="logo">
        <span class="xtrim">DORADO</span><span class="crm">CRM</span>
      </div>
      <nav class="main-nav">
        <NuxtLink to="/admin" class="nav-item">
          <LayoutDashboard :size="18" />
          Leads Dashboard
        </NuxtLink>
        <NuxtLink to="/admin/products" class="nav-item active">
          <ShoppingBag :size="18" />
          Catalog Products
        </NuxtLink>
        <NuxtLink to="/" class="nav-item">
          <ExternalLink :size="18" />
          View Site
        </NuxtLink>
      </nav>
      
      <div class="nav-spacer"></div>

      <div class="sidebar-footer">
        <button @click="isDark = !isDark" class="nav-item theme-toggle-btn" type="button" :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'">
          <Sun v-if="isDark" :size="18" />
          <Moon v-else :size="18" />
          {{ isDark ? 'Modo Claro' : 'Modo Oscuro' }}
        </button>
        <button @click="handleLogout" class="nav-item logout-btn">
          <LogOut :size="18" />
          Cerrar Sesión
        </button>
      </div>
    </aside>

    <main class="content">
      <header class="top-bar">
        <h1>Gestión de Catálogo</h1>
        <div class="user-profile">
          <span class="status-dot"></span>
          Catalog Editor
        </div>
      </header>

      <!-- Products Grid/Table -->
      <section class="leads-section">
        <div class="section-header">
          <h2>Muebles Disponibles</h2>
          <button class="add-lead-btn" @click="openCreateModal">
            <Plus :size="18" />
            Nuevo Mueble
          </button>
        </div>

        <div v-if="loading" class="loading-state">
          Cargando catálogo de muebles...
        </div>

        <div v-else-if="products.length === 0" class="empty-state">
          No hay muebles registrados en la base de datos de tu CRM. Crea uno nuevo para empezar a nutrir el catálogo.
        </div>

        <div v-else class="table-container">
          <table class="leads-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre del Mueble</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Detalles / Características</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id" class="lead-row">
                <td style="width: 80px;">
                  <div class="product-thumb-container">
                    <img :src="product.image || '/coffee-table.png'" alt="Thumb" class="product-thumb" />
                  </div>
                </td>
                <td>
                  <div class="lead-info">
                    <span class="lead-name">{{ product.title }}</span>
                  </div>
                </td>
                <td>
                  <span class="category-badge">{{ product.category }}</span>
                </td>
                <td>
                  <span class="price-value">${{ Number(product.price).toFixed(2) }}</span>
                </td>
                <td>
                  <ul class="features-list">
                    <li v-for="(feat, idx) in product.features.slice(0, 2)" :key="idx">{{ feat }}</li>
                    <li v-if="product.features.length > 2" class="more-features">+{{ product.features.length - 2 }} más</li>
                  </ul>
                </td>
                <td>
                  <div class="table-actions">
                    <button class="action-btn edit" @click="openEditModal(product)" title="Editar Mueble">
                      <Edit2 :size="16" />
                    </button>
                    <button class="action-btn delete" @click="openDeleteModal(product.id)" title="Eliminar">
                      <Trash2 :size="16" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import { 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Plus, 
  X, 
  LogOut, 
  LayoutDashboard,
  ShoppingBag,
  Upload,
  Link,
  Sun,
  Moon
} from 'lucide-vue-next'

import { useProducts } from '@/composables/useProducts'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const isDark = inject('isDark')

const { products, loading, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts()

// Modales y estados
const showDeleteModal = ref(false)
const productToDelete = ref(null)
const isDeleting = ref(false)

const showFormModal = ref(false)
const isEditMode = ref(false)
const formLoading = ref(false)

const formProduct = reactive({
  id: '',
  title: '',
  price: 0,
  category: '',
  image: '',
  features: []
})

const featuresText = ref('')

const imageInputMethod = ref('file')
const imagePreview = ref('')
const fileInputRef = ref(null)

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Por favor selecciona un archivo de imagen válido')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const base64String = e.target?.result
    if (typeof base64String === 'string') {
      formProduct.image = base64String
      imagePreview.value = base64String
    }
  }
  reader.readAsDataURL(file)
}

const removeUploadedImage = () => {
  formProduct.image = ''
  imagePreview.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const openCreateModal = () => {
  isEditMode.value = false
  featuresText.value = ''
  imageInputMethod.value = 'file'
  imagePreview.value = ''
  Object.assign(formProduct, {
    id: '',
    title: '',
    price: 0,
    category: '',
    image: '',
    features: []
  })
  showFormModal.value = true
}

const openEditModal = (product) => {
  isEditMode.value = true
  featuresText.value = product.features.join('\n')
  
  if (product.image && product.image.startsWith('data:image/')) {
    imageInputMethod.value = 'file'
    imagePreview.value = product.image
  } else {
    imageInputMethod.value = product.image ? 'url' : 'file'
    imagePreview.value = ''
  }

  Object.assign(formProduct, {
    id: product.id,
    title: product.title,
    price: Number(product.price),
    category: product.category,
    image: product.image || '',
    features: [...product.features]
  })
  showFormModal.value = true
}

const handleSubmitProduct = async () => {
  formLoading.value = true
  
  // Procesar características
  formProduct.features = featuresText.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    
  try {
    if (isEditMode.value) {
      await updateProduct(formProduct.id, {
        title: formProduct.title,
        price: formProduct.price,
        category: formProduct.category,
        image: formProduct.image || null,
        features: formProduct.features
      })
    } else {
      await createProduct({
        title: formProduct.title,
        price: formProduct.price,
        category: formProduct.category,
        image: formProduct.image || null,
        features: formProduct.features
      })
    }
    showFormModal.value = false
  } catch (error) {
    alert('Error al guardar el producto')
  } finally {
    formLoading.value = false
  }
}

const openDeleteModal = (id) => {
  productToDelete.value = id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!productToDelete.value) return
  isDeleting.value = true
  try {
    await deleteProduct(productToDelete.value)
    showDeleteModal.value = false
  } catch (error) {
    alert('Error al eliminar el mueble')
  } finally {
    isDeleting.value = false
    productToDelete.value = null
  }
}

const handleLogout = () => {
  const auth = useCookie('auth_token')
  auth.value = null
  navigateTo('/login')
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background: var(--crm-bg);
  color: var(--crm-text);
  font-family: 'Inter', sans-serif;
  transition: background 0.5s ease, color 0.5s ease;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: var(--crm-sidebar-bg);
  border-right: 1px solid var(--crm-border);
  padding: 2rem 1.2rem;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background 0.5s ease, border-color 0.5s ease;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 3rem;
  padding-left: 0.8rem;
}

.xtrim { color: var(--crm-text); transition: color 0.5s ease; }
.crm { color: #ff3e00; }

.main-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1rem;
  color: var(--crm-text-muted);
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: none;
  background: transparent;
  width: 100%;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
}

.nav-item:hover {
  background: var(--crm-nav-hover);
  color: var(--crm-text);
}

.nav-item.active {
  background: var(--crm-nav-active-bg);
  color: #ff3e00;
  font-weight: 600;
}

.nav-spacer {
  flex-grow: 1;
}

.sidebar-footer {
  padding-top: 1.5rem;
  border-top: 1px solid var(--crm-border);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: border-color 0.5s ease;
}

.logout-btn {
  color: #ff4d4d;
}

.logout-btn:hover {
  background: rgba(255, 77, 77, 0.1);
  color: #ff3333;
}

/* Content Area */
.content {
  flex: 1;
  padding: 2rem 3rem;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

.top-bar h1 {
  font-size: 1.8rem;
  font-weight: 700;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--crm-nav-hover);
  color: var(--crm-text);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: background 0.5s ease, color 0.5s ease;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #ff3e00;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 62, 0, 0.5);
}

/* Products Table */
.leads-section {
  background: var(--crm-panel-bg);
  border-radius: 20px;
  border: 1px solid var(--crm-border);
  padding: 2rem;
  transition: all 0.5s ease;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.add-lead-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #ff3e00;
  color: #fff;
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(255, 62, 0, 0.3);
}

.add-lead-btn:hover {
  background: #ff5500;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 62, 0, 0.4);
}

.table-container {
  overflow-x: auto;
}

.leads-table {
  width: 100%;
  border-collapse: collapse;
}

.leads-table th {
  text-align: left;
  padding: 1rem;
  color: var(--crm-table-header);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  border-bottom: 1px solid var(--crm-border);
  transition: all 0.5s ease;
}

.lead-row {
  border-bottom: 1px solid var(--crm-table-row-border);
  transition: background 0.3s, border-color 0.5s ease;
}

.lead-row:hover {
  background: var(--crm-nav-hover);
}

.leads-table td {
  padding: 1.4rem 1rem;
}

.product-thumb-container {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--crm-input-bg);
  border: 1px solid var(--crm-border);
  transition: all 0.5s ease;
}

.product-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lead-name {
  display: block;
  font-weight: 600;
  color: var(--crm-text);
  transition: color 0.5s ease;
}

.category-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--crm-nav-hover);
  border: 1px solid var(--crm-border);
  color: #ff3e00;
  transition: all 0.5s ease;
}

.price-value {
  font-weight: 700;
  color: var(--crm-text);
  transition: color 0.5s ease;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.8rem;
  color: var(--crm-text-muted);
  transition: color 0.5s ease;
}

.features-list li {
  margin-bottom: 0.1rem;
}

.more-features {
  color: #ff3e00;
  font-weight: 600;
}

.action-btn {
  background: transparent;
  border: 1px solid var(--crm-border);
  color: var(--crm-text-muted);
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn.edit:hover {
  background: var(--crm-border);
  color: var(--crm-text);
}

.action-btn.delete:hover {
  background: #ff4d4d20;
  color: #ff4d4d;
  border-color: #ff4d4d40;
}

.loading-state, .empty-state {
  padding: 4rem;
  text-align: center;
  color: var(--crm-text-muted);
  font-size: 0.95rem;
  transition: color 0.5s ease;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--crm-modal-bg);
  border: 1px solid var(--crm-modal-border);
  border-radius: 28px;
  padding: 3rem;
  max-width: 420px;
  width: 90%;
  text-align: center;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35);
  color: var(--crm-text);
  transition: all 0.5s ease;
}

.modal-icon {
  width: 72px;
  height: 72px;
  background: rgba(255, 77, 77, 0.1);
  color: #ff4d4d;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

.modal-btn {
  padding: 1rem;
  border-radius: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  border: none;
}

.modal-btn.cancel {
  background: var(--crm-nav-hover);
  color: var(--crm-text-muted);
  transition: all 0.3s;
}

.modal-btn.confirm {
  background: #ff3e00;
  color: #fff;
}

.modal-btn.confirm:hover {
  background: #ff5500;
}

.close-btn {
  background: none;
  border: none;
  color: var(--crm-text-muted);
  cursor: pointer;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  text-align: left;
}

/* Form Styles */
.create-modal {
  max-width: 650px !important;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  text-align: left;
}

.form-group label {
  display: block;
  font-size: 0.7rem;
  color: var(--crm-text-muted);
  text-transform: uppercase;
  font-weight: 800;
  margin-bottom: 0.6rem;
  transition: color 0.5s ease;
}

.form-group input, 
.form-group select, 
.form-group textarea {
  width: 100%;
  background: var(--crm-input-bg);
  border: 1px solid var(--crm-input-border);
  color: var(--crm-input-text);
  padding: 1rem;
  border-radius: 12px;
  transition: background 0.5s ease, border-color 0.3s, color 0.5s ease;
}

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: #ff3e00;
  box-shadow: 0 0 0 3px rgba(255, 62, 0, 0.1);
  outline: none;
}

.full-width { grid-column: span 2; }

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-active .modal-content { animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }

@keyframes pop {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.mt-4 { margin-top: 2.5rem; }

/* Pestañas de Imagen */
.image-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  background: var(--crm-input-bg);
  padding: 0.25rem;
  border-radius: 8px;
  border: 1px solid var(--crm-input-border);
  width: max-content;
  transition: all 0.5s ease;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  border: none;
  color: var(--crm-text-muted);
  padding: 0.4rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: var(--crm-text);
}

.tab-btn.active {
  background: var(--crm-border);
  color: #ff3e00;
}

/* Área de Carga */
.hidden-file-input {
  display: none;
}

.upload-dropzone {
  border: 2px dashed var(--crm-border);
  border-radius: 14px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--crm-input-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.upload-dropzone:hover {
  border-color: #ff3e00;
  background: rgba(255, 62, 0, 0.02);
}

.upload-icon {
  color: var(--crm-text-muted);
  transition: color 0.3s ease;
}

.upload-dropzone:hover .upload-icon {
  color: #ff3e00;
}

.upload-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--crm-text);
  display: block;
  transition: color 0.5s ease;
}

.upload-subtext {
  font-size: 0.7rem;
  color: var(--crm-text-muted);
  display: block;
  transition: color 0.5s ease;
}

/* Vista Previa de Imagen */
.upload-preview-box {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  background: var(--crm-input-bg);
  border: 1px solid var(--crm-border);
  border-radius: 14px;
  width: 100%;
  transition: all 0.5s ease;
}

.upload-preview-img {
  width: 90px;
  height: 90px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid var(--crm-border);
  background: var(--crm-input-bg);
  transition: all 0.5s ease;
}

.upload-preview-img.small {
  width: 70px;
  height: 70px;
  margin-top: 0.5rem;
}

.preview-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.delete-img-btn {
  background: rgba(255, 77, 77, 0.1);
  color: #ff4d4d;
  border: 1px solid rgba(255, 77, 77, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-img-btn:hover {
  background: #ff4d4d;
  color: #fff;
}

.preview-title {
  display: block;
  font-size: 0.75rem;
  color: var(--crm-text-muted);
  transition: color 0.5s ease;
}
</style>
