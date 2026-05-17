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
              <div class="form-group">
                <label>URL de Imagen</label>
                <input v-model="formProduct.image" type="text" placeholder="/coffee-table.png o URL externa">
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
import { 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Plus, 
  X, 
  LogOut, 
  LayoutDashboard,
  ShoppingBag
} from 'lucide-vue-next'

import { useProducts } from '@/composables/useProducts'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

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

const openCreateModal = () => {
  isEditMode.value = false
  featuresText.value = ''
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
  background: #0a0a0c;
  color: #fff;
  font-family: 'Inter', sans-serif;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: #111114;
  border-right: 1px solid #222;
  padding: 2rem 1.2rem;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -1px;
  margin-bottom: 3rem;
  padding-left: 0.8rem;
}

.xtrim { color: #fff; }
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
  color: #888;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s ease;
  border: none;
  background: transparent;
  width: 100%;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
}

.nav-item:hover {
  background: #1a1a1e;
  color: #fff;
}

.nav-item.active {
  background: #ff3e0020;
  color: #ff3e00;
  font-weight: 600;
}

.nav-spacer {
  flex-grow: 1;
}

.sidebar-footer {
  padding-top: 1.5rem;
  border-top: 1px solid #222;
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
  background: #1a1a1e;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
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
  background: #111114;
  border-radius: 20px;
  border: 1px solid #222;
  padding: 2rem;
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
  color: #555;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  border-bottom: 1px solid #222;
}

.lead-row {
  border-bottom: 1px solid #1a1a1e;
  transition: background 0.2s;
}

.lead-row:hover {
  background: rgba(255, 255, 255, 0.02);
}

.leads-table td {
  padding: 1.4rem 1rem;
}

.product-thumb-container {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background: #1e1e24;
  border: 1px solid #222;
}

.product-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lead-name {
  display: block;
  font-weight: 600;
  color: #fff;
}

.category-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #222;
  color: #ff3e00;
}

.price-value {
  font-weight: 700;
  color: #fff;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.8rem;
  color: #888;
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
  border: 1px solid #333;
  color: #888;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn.edit:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.action-btn.delete:hover {
  background: #ff4d4d20;
  color: #ff4d4d;
  border-color: #ff4d4d40;
}

.loading-state, .empty-state {
  padding: 4rem;
  text-align: center;
  color: #666;
  font-size: 0.95rem;
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
  background: #111114;
  border: 1px solid #222;
  border-radius: 28px;
  padding: 3rem;
  max-width: 420px;
  width: 90%;
  text-align: center;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
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
  background: #1a1a1e;
  color: #888;
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
  color: #555;
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
  color: #555;
  text-transform: uppercase;
  font-weight: 800;
  margin-bottom: 0.6rem;
}

.form-group input, 
.form-group select, 
.form-group textarea {
  width: 100%;
  background: #0a0a0c;
  border: 1px solid #222;
  color: #fff;
  padding: 1rem;
  border-radius: 12px;
  transition: 0.3s;
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
</style>
