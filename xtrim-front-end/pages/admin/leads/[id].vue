<template>
  <div class="lead-management-page">
    <aside class="sidebar">
      <div class="logo">
        <span class="xtrim">XTRIM</span><span class="crm">CRM</span>
      </div>
      <nav>
        <NuxtLink to="/admin" class="nav-item">
          <LayoutDashboard :size="18" /> Dashboard
        </NuxtLink>
        <NuxtLink to="/" class="nav-item">
          <Globe :size="18" /> Ver Sitio
        </NuxtLink>
        <div class="nav-divider"></div>
        <button @click="handleLogout" class="nav-item logout-btn">
          <LogOut :size="18" /> Cerrar Sesión
        </button>
      </nav>
    </aside>

    <main class="content" v-if="lead">
      <header class="top-bar">
        <div class="breadcrumb">
          <NuxtLink to="/admin">Dashboard</NuxtLink> 
          <ChevronRight :size="14" /> 
          <span>Gestión de Lead</span>
        </div>
        <div class="header-actions">
          <button @click="isEditing = !isEditing" class="icon-btn edit-btn" :title="isEditing ? 'Cancelar' : 'Editar Info'">
            <Edit2 v-if="!isEditing" :size="20" />
            <X v-else :size="20" />
          </button>
          <button @click="handleDelete" class="icon-btn delete-btn" title="Eliminar Lead">
            <Trash2 :size="20" />
          </button>
        </div>
      </header>

      <div class="management-grid">
        <!-- LEFT: CUSTOMER PROFILE -->
        <section class="profile-card">
          <div class="profile-header">
            <div class="avatar">{{ lead.name.charAt(0) }}</div>
            <div class="header-info">
              <h1>{{ lead.name }}</h1>
              <span :class="['status-badge', lead.status.toLowerCase().replace(' ', '-')]">
                {{ lead.status }}
              </span>
            </div>
          </div>

          <div class="contact-actions">
            <a :href="`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`" target="_blank" class="action-btn whatsapp">
              <MessageCircle :size="18" /> WhatsApp
            </a>
            <a :href="`tel:${lead.phone}`" class="action-btn phone">
              <Phone :size="18" /> Llamar
            </a>
          </div>

          <div class="info-list">
            <div class="info-group">
              <label>Nombre</label>
              <input v-if="isEditing" v-model="editForm.name" type="text" class="edit-input">
              <div v-else class="value">{{ lead.name }}</div>
            </div>
            <div class="info-group">
              <label>Email</label>
              <input v-if="isEditing" v-model="editForm.email" type="email" class="edit-input">
              <div v-else class="value">{{ lead.email || 'No proporcionado' }}</div>
            </div>
            <div class="info-group">
              <label>Teléfono</label>
              <input v-if="isEditing" v-model="editForm.phone" type="text" class="edit-input">
              <div v-else class="value">{{ lead.phone }}</div>
            </div>
            <div class="info-group">
              <label>Provincia</label>
              <input v-if="isEditing" v-model="editForm.province" type="text" class="edit-input">
              <div v-else class="value">{{ lead.province }}</div>
            </div>
            <div class="info-group">
              <label>Valor Estimado</label>
              <input v-if="isEditing" v-model="editForm.valor_estimado" type="number" class="edit-input">
              <div v-else class="value price">${{ lead.valor_estimado.toLocaleString() }}</div>
            </div>
            <div class="info-group">
              <label>Descripción</label>
              <textarea v-if="isEditing" v-model="editForm.description" class="edit-textarea"></textarea>
              <div v-else class="value description">{{ lead.description }}</div>
            </div>
            
            <button v-if="isEditing" @click="saveChanges" class="save-changes-btn" :disabled="isSavingChanges">
              {{ isSavingChanges ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </section>

        <!-- RIGHT: PIPELINE & TIMELINE -->
        <div class="workflow-column">
          <!-- Status Tracker -->
          <section class="pipeline-card">
            <h3>Estado del Pipeline</h3>
            <div class="pipeline-steps">
              <div 
                v-for="step in pipelineSteps" 
                :key="step"
                :class="['step', { 'active': lead.status === step, 'completed': isStepCompleted(step) }]"
                @click="updateStatus(step)"
              >
                <div class="step-dot"></div>
                <span class="step-label">{{ step }}</span>
              </div>
            </div>
          </section>

          <!-- Timeline -->
          <section class="timeline-card">
            <div class="timeline-header">
              <h3>Historial de Actividad</h3>
              <div class="activity-selector">
                <select v-model="activityType">
                  <option value="Nota">Nota</option>
                  <option value="Llamada">Llamada</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Reunión">Reunión</option>
                </select>
              </div>
            </div>

            <div class="note-input">
              <textarea v-model="newNote" placeholder="Escribe una actualización sobre este prospecto..."></textarea>
              <button @click="saveActivity" :disabled="!newNote || isSaving" class="save-btn">
                <span v-if="!isSaving">Registrar Actividad</span>
                <span v-else>Guardando...</span>
              </button>
            </div>

            <div class="timeline-feed">
              <div v-if="activities.length === 0" class="empty-state">
                No hay actividades registradas aún.
              </div>
              <div v-for="activity in activities" :key="activity.id" class="timeline-item">
                <div class="timeline-icon">
                  <component :is="getActivityIcon(activity.type)" :size="14" />
                </div>
                <div class="timeline-content">
                  <div class="timeline-meta">
                    <span class="type">{{ activity.type }}</span>
                    <span class="date">{{ formatDateTime(activity.createdAt) }}</span>
                  </div>
                  <p>{{ activity.content }}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { 
  LayoutDashboard, Globe, LogOut, ChevronRight, MessageCircle, 
  Phone, MessageSquare, Calendar, PhoneCall, Mail, User, Edit2, Trash2, X
} from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const route = useRoute()
const leadId = route.params.id
const config = useRuntimeConfig()

const lead = ref(null)
const activities = ref([])
const newNote = ref('')
const activityType = ref('Nota')
const isSaving = ref(false)
const isEditing = ref(false)
const isSavingChanges = ref(false)

const editForm = reactive({
  name: '',
  email: '',
  phone: '',
  province: '',
  valor_estimado: 0,
  description: ''
})

const pipelineSteps = ['Nuevo', 'Contactado', 'En gestión', 'Ganado', 'Perdido']

const fetchLeadData = async () => {
  try {
    const [leadData, historyData] = await Promise.all([
      $fetch(`${config.public.apiUrl}/leads/${leadId}`),
      $fetch(`${config.public.apiUrl}/leads/${leadId}/activities`)
    ])
    lead.value = leadData
    activities.value = historyData
    
    // Initialize edit form
    Object.assign(editForm, {
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      province: leadData.province,
      valor_estimado: leadData.valor_estimado,
      description: leadData.description
    })
  } catch (error) {
    console.error('Error fetching lead data:', error)
  }
}

const saveChanges = async () => {
  isSavingChanges.value = true
  try {
    const updatedLead = await $fetch(`${config.public.apiUrl}/leads/${leadId}`, {
      method: 'PUT',
      body: editForm
    })
    lead.value = updatedLead
    isEditing.value = false
    await saveActivity('Información del contacto actualizada', 'Nota')
  } catch (error) {
    console.error('Error saving changes:', error)
    alert('Error al guardar los cambios')
  } finally {
    isSavingChanges.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('¿Estás seguro de que quieres eliminar este lead de forma permanente? Esta acción no se puede deshacer.')) return
  
  try {
    await $fetch(`${config.public.apiUrl}/leads/${leadId}`, {
      method: 'DELETE'
    })
    navigateTo('/admin')
  } catch (error) {
    console.error('Error deleting lead:', error)
    alert('Error al eliminar el lead')
  }
}

const updateStatus = async (newStatus) => {
  if (lead.value.status === newStatus) return
  
  try {
    await $fetch(`${config.public.apiUrl}/leads/${leadId}/status`, {
      method: 'PATCH',
      body: { status: newStatus }
    })
    
    // Auto-log status change
    await saveActivity(`El estado cambió a: ${newStatus}`, 'Nota')
    
    lead.value.status = newStatus
  } catch (error) {
    console.error('Error updating status:', error)
  }
}

const saveActivity = async (contentInput = null, typeInput = null) => {
  const content = typeof contentInput === 'string' ? contentInput : newNote.value
  const type = typeof typeInput === 'string' ? typeInput : activityType.value

  if (!content) return
  
  isSaving.value = true
  try {
    await $fetch(`${config.public.apiUrl}/leads/${leadId}/activities`, {
      method: 'POST',
      body: { content, type }
    })
    newNote.value = ''
    await fetchLeadData() // Refresh
  } catch (error) {
    console.error('Error saving activity:', error)
  } finally {
    isSaving.value = false
  }
}

const isStepCompleted = (step) => {
  const currentIndex = pipelineSteps.indexOf(lead.value.status)
  const stepIndex = pipelineSteps.indexOf(step)
  return stepIndex < currentIndex && lead.value.status !== 'Perdido'
}

const getActivityIcon = (type) => {
  const map = {
    'Nota': MessageSquare,
    'Llamada': PhoneCall,
    'WhatsApp': MessageCircle,
    'Reunión': Calendar,
    'Email': Mail
  }
  return map[type] || MessageSquare
}

const formatDateTime = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('es-EC', { 
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
  })
}

const handleLogout = () => {
  const auth = useCookie('auth_token')
  auth.value = null
  navigateTo('/login')
}

onMounted(() => {
  fetchLeadData()
  
  // Si venimos con el parámetro ?edit=true, activamos el modo edición de inmediato
  if (route.query.edit === 'true') {
    isEditing.value = true
  }
})
</script>

<style scoped>
.lead-management-page {
  display: flex;
  min-height: 100vh;
  background: #0a0a0c;
  color: #fff;
  font-family: 'Inter', sans-serif;
}

/* Sidebar Re-styling */
.sidebar {
  width: 260px;
  background: #111114;
  border-right: 1px solid #222;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 3rem;
}

.xtrim { color: #fff; }
.crm { color: #ff3e00; }

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1rem;
  color: #888;
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: 0.2s;
  background: transparent;
  border: none;
  width: 100%;
  cursor: pointer;
}

.nav-item:hover { background: #1a1a1e; color: #fff; }
.nav-divider { flex-grow: 1; }
.logout-btn { color: #ff4d4d; }
.logout-btn:hover { background: rgba(255, 0, 0, 0.1); color: #ff4d4d; }

/* Main Content */
.content {
  flex: 1;
  padding: 2rem 3rem;
  overflow-y: auto;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #555;
  font-size: 0.9rem;
}

.breadcrumb a { color: #888; text-decoration: none; }
.breadcrumb span { color: #fff; font-weight: 600; }


/* Management Grid */
.management-grid {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 2rem;
}

/* Profile Card */
.profile-card {
  background: #111114;
  border-radius: 20px;
  border: 1px solid #222;
  padding: 2rem;
  height: fit-content;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.avatar {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #ff3e00, #ff8800);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 800;
  color: #fff;
}

.header-info h1 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
}

.status-badge {
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-badge.nuevo { background: #ff3e0020; color: #ff3e00; }
.status-badge.contactado { background: #7928ca20; color: #7928ca; }
.status-badge.en-gestión { background: #0070f320; color: #0070f3; }
.status-badge.ganado { background: #00ff8820; color: #00ff88; }
.status-badge.perdido { background: #ff005520; color: #ff0055; }

.contact-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: 0.3s;
}

.whatsapp { background: #25d36620; color: #25d366; border: 1px solid #25d36640; }
.whatsapp:hover { background: #25d366; color: #000; }
.phone { background: #0070f320; color: #0070f3; border: 1px solid #0070f340; }
.phone:hover { background: #0070f3; color: #fff; }

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-group label {
  display: block;
  font-size: 0.7rem;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.4rem;
}

.info-group .value {
  font-size: 0.95rem;
  color: #ddd;
}

.price {
  font-size: 1.4rem !important;
  color: #00ff88 !important;
  font-weight: 700;
}

.description {
  background: rgba(255, 255, 255, 0.03);
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem !important;
  line-height: 1.5;
}

.edit-input, .edit-textarea {
  width: 100%;
  background: #000;
  border: 1px solid #333;
  color: #fff;
  padding: 0.6rem;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.9rem;
}

.edit-textarea { height: 100px; resize: none; }

.save-changes-btn {
  width: 100%;
  padding: 0.8rem;
  background: #ff3e00;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 1rem;
}

.save-changes-btn:hover { background: #ff5500; }

/* Workflow Column */
.workflow-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Pipeline Tracker */
.pipeline-card {
  background: #111114;
  border-radius: 20px;
  border: 1px solid #222;
  padding: 1.5rem;
}

.pipeline-card h3 { font-size: 1rem; margin-bottom: 1.5rem; color: #888; }

.pipeline-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.pipeline-steps::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  height: 2px;
  background: #222;
  z-index: 0;
}

.step {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
}

.step-dot {
  width: 20px;
  height: 20px;
  background: #0a0a0c;
  border: 3px solid #333;
  border-radius: 50%;
  transition: 0.3s;
}

.step-label {
  font-size: 0.75rem;
  color: #555;
  font-weight: 600;
  transition: 0.3s;
}

.step.active .step-dot { border-color: #ff3e00; background: #ff3e00; box-shadow: 0 0 15px #ff3e0060; }
.step.active .step-label { color: #fff; }

.step.completed .step-dot { border-color: #00ff88; background: #00ff88; }
.step.completed .step-label { color: #00ff88; }

/* Timeline Card */
.timeline-card {
  background: #111114;
  border-radius: 20px;
  border: 1px solid #222;
  padding: 2rem;
  flex: 1;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.timeline-header h3 { font-size: 1.1rem; }

.activity-selector select {
  background: #1a1a1e;
  border: 1px solid #333;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.8rem;
}

.note-input textarea {
  width: 100%;
  height: 80px;
  background: #0a0a0c;
  border: 1px solid #333;
  border-radius: 12px;
  color: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
  resize: none;
  font-family: inherit;
}

.save-btn {
  width: 100%;
  padding: 0.8rem;
  background: #fff;
  color: #000;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}

.save-btn:hover { background: #ddd; }
.save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.timeline-feed {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.timeline-item {
  display: flex;
  gap: 1rem;
}

.timeline-icon {
  width: 32px;
  height: 32px;
  background: #1a1a1e;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff3e00;
  flex-shrink: 0;
}

.timeline-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3rem;
}

.timeline-meta .type { font-size: 0.8rem; font-weight: 700; color: #555; text-transform: uppercase; }
.timeline-meta .date { font-size: 0.75rem; color: #444; }

.timeline-content p {
  color: #aaa;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #333;
}
</style>
