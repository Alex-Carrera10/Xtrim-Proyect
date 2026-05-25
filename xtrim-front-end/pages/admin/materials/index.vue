<template>
  <div class="admin-dashboard">
    <!-- Modal Eliminar -->
    <Transition name="fade">
      <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-icon">
            <Trash2 :size="32" />
          </div>
          <h3>¿Eliminar Material?</h3>
          <p>Esta acción es permanente y quitará este material del catálogo público inmediatamente.</p>
          <div class="modal-actions">
            <button class="modal-btn cancel" @click="showDeleteModal = false">Cancelar</button>
            <button class="modal-btn confirm" @click="confirmDelete" :disabled="isDeleting">
              {{ isDeleting ? 'Eliminando...' : 'Sí, eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal Crear / Editar -->
    <Transition name="fade">
      <div v-if="showFormModal" class="modal-overlay" @click="showFormModal = false">
        <div class="modal-content create-modal" @click.stop>
          <div class="modal-header">
            <h3>{{ isEditMode ? 'Editar Material' : 'Registrar Nuevo Material' }}</h3>
            <button @click="showFormModal = false" class="close-btn"><X :size="20" /></button>
          </div>

          <form @submit.prevent="handleSubmitMaterial" class="create-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Nombre del Material</label>
                <input v-model="formMaterial.name" type="text" required placeholder="Ej: Nogal Negro">
              </div>
              <div class="form-group">
                <label>Tipo</label>
                <select v-model="formMaterial.type" required>
                  <option value="" disabled selected>Seleccionar...</option>
                  <option value="Madera">Madera</option>
                  <option value="Metal">Metal</option>
                  <option value="Tela">Tela</option>
                  <option value="Cuero">Cuero</option>
                  <option value="Piedra">Piedra</option>
                  <option value="Vidrio">Vidrio</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div class="form-group full-width">
                <label>Descripción</label>
                <textarea v-model="formMaterial.description" rows="3" required placeholder="Ej: Madera de nogal americano de alta densidad, ideal para mesas y escritorios de lujo."></textarea>
              </div>
              <div class="form-group full-width">
                <label>Imagen del Material</label>
                <div class="image-tabs">
                  <button type="button" class="tab-btn" :class="{ active: imageInputMethod === 'file' }" @click="imageInputMethod = 'file'">
                    <Upload :size="14" /> Subir desde mi Compu
                  </button>
                  <button type="button" class="tab-btn" :class="{ active: imageInputMethod === 'url' }" @click="imageInputMethod = 'url'">
                    <Link :size="14" /> URL Externa
                  </button>
                </div>

                <div v-if="imageInputMethod === 'file'" class="upload-container">
                  <input ref="fileInputRef" type="file" accept="image/*" class="hidden-file-input" @change="handleFileChange" />
                  <div v-if="!imagePreview" class="upload-dropzone" @click="triggerFileInput">
                    <Upload class="upload-icon" :size="24" />
                    <span class="upload-text">Haz clic para buscar o arrastra una imagen aquí</span>
                    <span class="upload-subtext">Formatos: PNG, JPG, WEBP</span>
                  </div>
                  <div v-else class="upload-preview-box">
                    <img :src="imagePreview" alt="Previsualización" class="upload-preview-img" />
                    <div class="preview-actions">
                      <button type="button" class="action-btn delete-img-btn" @click="removeUploadedImage">Quitar Imagen</button>
                    </div>
                  </div>
                </div>

                <div v-else class="url-input-container">
                  <input v-model="formMaterial.image" type="text" placeholder="Ej: https://mis-imagenes.com/nogal.png" />
                  <div v-if="formMaterial.image" class="url-preview-box mt-2">
                    <span class="preview-title">Vista previa:</span>
                    <img :src="formMaterial.image" alt="URL Preview" class="upload-preview-img small" />
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-actions mt-4">
              <button type="button" class="modal-btn cancel" @click="showFormModal = false">Cancelar</button>
              <button type="submit" class="modal-btn confirm" :disabled="formLoading">
                {{ formLoading ? 'Guardando...' : 'Guardar Material' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <AdminSidebar />

    <main class="content">
      <header class="top-bar">
        <h1>Gestión de Materiales</h1>
        <div class="user-profile">
          <span class="status-dot"></span>
          Catalog Editor
        </div>
      </header>

      <section class="leads-section">
        <div class="section-header">
          <h2>Materiales Disponibles</h2>
          <button class="add-lead-btn" @click="openCreateModal">
            <Plus :size="18" />
            Nuevo Material
          </button>
        </div>

        <div v-if="loading" class="loading-state">Cargando materiales...</div>

        <div v-else-if="materials.length === 0" class="empty-state">
          No hay materiales registrados. Crea uno nuevo para empezar.
        </div>

        <div v-else class="table-container">
          <table class="leads-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="material in materials" :key="material.id" class="lead-row">
                <td style="width: 80px;">
                  <div class="product-thumb-container">
                    <img :src="material.image || '/coffee-table.png'" alt="Thumb" class="product-thumb" />
                  </div>
                </td>
                <td>
                  <span class="lead-name">{{ material.name }}</span>
                </td>
                <td>
                  <span class="category-badge">{{ material.type }}</span>
                </td>
                <td>
                  <span class="description-text">{{ material.description }}</span>
                </td>
                <td>
                  <div class="table-actions">
                    <button class="action-btn edit" @click="openEditModal(material)" title="Editar">
                      <Edit2 :size="16" />
                    </button>
                    <button class="action-btn delete" @click="openDeleteModal(material.id)" title="Eliminar">
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
import { Edit2, Trash2, Plus, X, Upload, Link } from 'lucide-vue-next'
import { useMaterials } from '@/composables/useMaterials'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const { materials, loading, fetchMaterials, createMaterial, updateMaterial, deleteMaterial } = useMaterials()

const showDeleteModal = ref(false)
const materialToDelete = ref(null)
const isDeleting = ref(false)

const showFormModal = ref(false)
const isEditMode = ref(false)
const formLoading = ref(false)

const formMaterial = reactive({
  id: '',
  name: '',
  type: '',
  description: '',
  image: '',
})

const imageInputMethod = ref('file')
const imagePreview = ref('')
const fileInputRef = ref(null)

const triggerFileInput = () => fileInputRef.value?.click()

const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    alert('Por favor selecciona un archivo de imagen válido')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    const base64 = e.target?.result
    if (typeof base64 === 'string') {
      formMaterial.image = base64
      imagePreview.value = base64
    }
  }
  reader.readAsDataURL(file)
}

const removeUploadedImage = () => {
  formMaterial.image = ''
  imagePreview.value = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
}

const openCreateModal = () => {
  isEditMode.value = false
  imageInputMethod.value = 'file'
  imagePreview.value = ''
  Object.assign(formMaterial, { id: '', name: '', type: '', description: '', image: '' })
  showFormModal.value = true
}

const openEditModal = (material) => {
  isEditMode.value = true
  if (material.image?.startsWith('data:image/')) {
    imageInputMethod.value = 'file'
    imagePreview.value = material.image
  } else {
    imageInputMethod.value = material.image ? 'url' : 'file'
    imagePreview.value = ''
  }
  Object.assign(formMaterial, {
    id: material.id,
    name: material.name,
    type: material.type,
    description: material.description,
    image: material.image || '',
  })
  showFormModal.value = true
}

const handleSubmitMaterial = async () => {
  formLoading.value = true
  try {
    if (isEditMode.value) {
      await updateMaterial(formMaterial.id, {
        name: formMaterial.name,
        type: formMaterial.type,
        description: formMaterial.description,
        image: formMaterial.image || null,
      })
    } else {
      await createMaterial({
        name: formMaterial.name,
        type: formMaterial.type,
        description: formMaterial.description,
        image: formMaterial.image || null,
      })
    }
    showFormModal.value = false
  } catch {
    alert('Error al guardar el material')
  } finally {
    formLoading.value = false
  }
}

const openDeleteModal = (id) => {
  materialToDelete.value = id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!materialToDelete.value) return
  isDeleting.value = true
  try {
    await deleteMaterial(materialToDelete.value)
    showDeleteModal.value = false
  } catch {
    alert('Error al eliminar el material')
  } finally {
    isDeleting.value = false
    materialToDelete.value = null
  }
}

onMounted(() => {
  fetchMaterials()
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

.table-container { overflow-x: auto; }

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

.lead-row:hover { background: var(--crm-nav-hover); }

.leads-table td { padding: 1.4rem 1rem; }

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

.description-text {
  font-size: 0.85rem;
  color: var(--crm-text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 300px;
  transition: color 0.5s ease;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
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

/* Modales */
.modal-overlay {
  position: fixed;
  inset: 0;
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
}

.modal-btn.confirm {
  background: #ff3e00;
  color: #fff;
}

.modal-btn.confirm:hover { background: #ff5500; }

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

.create-modal { max-width: 650px !important; }

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

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #ff3e00;
  box-shadow: 0 0 0 3px rgba(255, 62, 0, 0.1);
  outline: none;
}

.full-width { grid-column: span 2; }
.mt-4 { margin-top: 2.5rem; }
.mt-2 { margin-top: 0.5rem; }

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

.tab-btn:hover { color: var(--crm-text); }

.tab-btn.active {
  background: var(--crm-border);
  color: #ff3e00;
}

.hidden-file-input { display: none; }

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

.upload-icon { color: var(--crm-text-muted); }
.upload-dropzone:hover .upload-icon { color: #ff3e00; }

.upload-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--crm-text);
  display: block;
}

.upload-subtext {
  font-size: 0.7rem;
  color: var(--crm-text-muted);
  display: block;
}

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
}

.upload-preview-img.small {
  width: 70px;
  height: 70px;
  margin-top: 0.5rem;
}

.preview-actions { display: flex; flex-direction: column; gap: 0.5rem; }

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

.delete-img-btn:hover { background: #ff4d4d; color: #fff; }

.preview-title {
  display: block;
  font-size: 0.75rem;
  color: var(--crm-text-muted);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-active .modal-content { animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }

@keyframes pop {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
