<template>
  <div class="admin-dashboard">
    <!-- Modal de Confirmación Personalizado -->
    <Transition name="fade">
      <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-icon">
            <Trash2 :size="32" />
          </div>
          <h3>¿Eliminar Prospecto?</h3>
          <p>Esta acción es permanente y borrará todo el historial de actividades asociado a este lead.</p>
          <div class="modal-actions">
            <button class="modal-btn cancel" @click="showDeleteModal = false">Cancelar</button>
            <button class="modal-btn confirm" @click="confirmDelete" :disabled="isDeleting">
              {{ isDeleting ? 'Eliminando...' : 'Sí, eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de Creación de Lead -->
    <Transition name="fade">
      <div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
        <div class="modal-content create-modal" @click.stop>
          <div class="modal-header">
            <h3>Registrar Nuevo Lead</h3>
            <button @click="showCreateModal = false" class="close-btn"><X :size="20" /></button>
          </div>
          
          <form @submit.prevent="handleCreateLead" class="create-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Nombre Completo</label>
                <input v-model="newLead.name" type="text" required placeholder="Ej: Juan Pérez">
              </div>
              <div class="form-group">
                <label>Teléfono</label>
                <input v-model="newLead.phone" type="text" required placeholder="09xxxxxxx">
              </div>
              <div class="form-group">
                <label>Email</label>
                <input v-model="newLead.email" type="email" placeholder="correo@ejemplo.com">
              </div>
              <div class="form-group">
                <label>Provincia</label>
                <select v-model="newLead.province" required>
                  <option value="" disabled selected>Seleccionar...</option>
                  <option value="Pichincha">Pichincha</option>
                  <option value="Guayas">Guayas</option>
                  <option value="Azuay">Azuay</option>
                  <option value="Manabí">Manabí</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div class="form-group">
                <label>Valor Estimado ($)</label>
                <input v-model="newLead.valor_estimado" type="number" step="0.01" required placeholder="0.00">
              </div>
              <div class="form-group full-width">
                <label>Descripción del Pedido / Notas</label>
                <textarea v-model="newLead.description" placeholder="Detalles de lo que busca el cliente..."></textarea>
              </div>
            </div>

            <div class="modal-actions mt-4">
              <button type="button" class="modal-btn cancel" @click="showCreateModal = false">Cancelar</button>
              <button type="submit" class="modal-btn confirm" :disabled="isCreatingLead">
                {{ isCreatingLead ? 'Guardando...' : 'Crear Lead' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <AdminSidebar />

    <main class="content">
      <header class="top-bar">
        <h1>Dashboard General</h1>
        <div class="header-actions">
          <AdminNotificationCenter />
          <div class="user-profile">
            <span class="status-dot"></span>
            Admin Mode
          </div>
        </div>
      </header>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Ventas Estimadas</div>
          <div class="stat-value">${{ stats.revenue.toLocaleString() }}</div>
          <div class="stat-change positive">+12% vs mes anterior</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Leads Totales</div>
          <div class="stat-value">{{ leads.length }}</div>
          <div class="stat-change positive">+5 hoy</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Leads Nuevos</div>
          <div class="stat-value">{{ stats.newLeads }}</div>
          <div class="stat-change positive">Por gestionar</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Tasa de Cierre</div>
          <div class="stat-value">{{ conversionRate }}%</div>
          <div class="stat-change">Meta: 20%</div>
        </div>
      </div>

      <!-- Leads Table -->
      <section class="leads-section">
        <div class="section-header">
          <h2>Prospectos Recientes</h2>
          <div class="header-tools">
            <div class="filters">
              <button class="filter-btn active">Todos</button>
              <button class="filter-btn">Nuevos</button>
              <button class="filter-btn">En Gestión</button>
            </div>
            <button class="add-lead-btn" @click="showCreateModal = true">
              <Plus :size="18" />
              Nuevo Lead
            </button>
          </div>
        </div>

        <div class="table-container">
          <table class="leads-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Provincia</th>
                <th>Valor</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="lead in leads" :key="lead.id" class="lead-row" @click="viewLead(lead.id)">
                <td>
                  <div class="lead-info">
                    <span class="lead-name">{{ lead.name }}</span>
                    <span class="lead-email">{{ lead.email || 'No email' }}</span>
                  </div>
                </td>
                <td>
                  <span :class="['status-badge', lead.status.toLowerCase().replace(' ', '-')]">
                    {{ lead.status }}
                  </span>
                </td>
                <td>{{ lead.province }}</td>
                <td>${{ lead.valor_estimado }}</td>
                <td>{{ formatDate(lead.createdAt) }}</td>
                <td>
                  <div class="table-actions">
                    <button class="action-btn view" @click.stop="viewLead(lead.id)" title="Ver Detalle">
                      Ver
                    </button>
                    <button class="action-btn edit" @click.stop="editLead(lead.id)" title="Editar Datos">
                      <Edit2 :size="16" />
                    </button>
                    <button class="action-btn delete" @click.stop="deleteLead(lead.id)" title="Eliminar">
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
  Plus, 
  X
} from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const isDark = inject('isDark')

const config = useRuntimeConfig();
const { getAuthHeaders } = useAuth();

const leads = ref([]);
const stats = reactive({
  revenue: 0,
  newLeads: 0,
});

const showDeleteModal = ref(false)
const leadToDelete = ref(null)
const isDeleting = ref(false)

const showCreateModal = ref(false)
const isCreatingLead = ref(false)
const newLead = reactive({
  name: '',
  email: '',
  phone: '',
  province: '',
  valor_estimado: 0,
  description: '',
  status: 'Nuevo'
})

const conversionRate = computed(() => {
  if (leads.value.length === 0) return 0;
  const won = leads.value.filter(l => l.status === 'Ganado').length;
  return ((won / leads.value.length) * 100).toFixed(1);
});

const fetchLeads = async () => {
  try {
    const response = await $fetch(`${config.public.apiUrl}/leads`, {
      headers: getAuthHeaders(),
    });
    leads.value = response;

    const kpiResponse = await $fetch(`${config.public.apiUrl}/leads/kpi`, {
      headers: getAuthHeaders(),
    });
    stats.revenue = kpiResponse.totalSales || 0;
    stats.newLeads = kpiResponse.newLeadsCount || 0;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const deleteLead = (id) => {
  leadToDelete.value = id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!leadToDelete.value) return
  
  isDeleting.value = true
  try {
    await $fetch(`${config.public.apiUrl}/leads/${leadToDelete.value}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    leads.value = leads.value.filter(l => l.id !== leadToDelete.value)
    showDeleteModal.value = false
  } catch (error) {
    alert('Error al eliminar el lead')
  } finally {
    isDeleting.value = false
    leadToDelete.value = null
  }
}

const handleCreateLead = async () => {
  isCreatingLead.value = true
  try {
    const response = await $fetch(`${config.public.apiUrl}/leads`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: newLead,
    })
    
    // Add to list and close
    leads.value.unshift(response)
    showCreateModal.value = false
    
    // Reset form
    Object.assign(newLead, {
      name: '', email: '', phone: '', province: '', 
      valor_estimado: 0, description: '', status: 'Nuevo'
    })
    
    // Refresh Stats
    fetchLeads()
  } catch (error) {
    alert('Error al crear el lead')
  } finally {
    isCreatingLead.value = false
  }
}



const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-EC', { day: '2-digit', month: 'short' });
};

const viewLead = (id) => {
  navigateTo(`/admin/leads/${id}`);
};

const editLead = (id) => {
  navigateTo(`/admin/leads/${id}?edit=true`);
};

onMounted(() => {
  fetchLeads();
});
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
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
  background: #00ff88;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ff8880;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: var(--crm-card-bg);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid var(--crm-border);
  transition: all 0.5s ease;
}

.stat-label {
  color: var(--crm-text-muted);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  transition: color 0.5s ease;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-change {
  font-size: 0.8rem;
  color: #888;
}

.stat-change.positive {
  color: #00ff88;
}

/* Leads Table */
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

.header-tools {
  display: flex;
  align-items: center;
  gap: 1.5rem;
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

.filters {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  background: var(--crm-nav-hover);
  border: 1px solid var(--crm-border);
  color: var(--crm-text-muted);
  padding: 0.5rem 1.2rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.filter-btn.active {
  background: var(--crm-border);
  color: var(--crm-text);
  border-color: var(--crm-border);
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
  cursor: pointer;
  transition: background 0.3s, border-color 0.5s ease;
}

.lead-row:hover {
  background: var(--crm-nav-hover);
}

.leads-table td {
  padding: 1.4rem 1rem;
}

.lead-name {
  display: block;
  font-weight: 600;
  color: var(--crm-text);
  margin-bottom: 0.2rem;
  transition: color 0.5s ease;
}

.lead-email {
  display: block;
  font-size: 0.8rem;
  color: var(--crm-text-muted);
  transition: color 0.5s ease;
}

.status-badge {
  padding: 0.4rem 0.9rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-badge.nuevo { background: #ff3e0020; color: #ff3e00; }
.status-badge.en-gestión { background: #0070f320; color: #0070f3; }
.status-badge.ganado { background: #00ff8820; color: #00ff88; }
.status-badge.perdido { background: #ff005520; color: #ff0055; }
.status-badge.contactado { background: #7928ca20; color: #7928ca; }

.action-btn {
  background: transparent;
  border: 1px solid var(--crm-border);
  color: var(--crm-text-muted);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn.view:hover {
  background: var(--crm-text);
  color: var(--crm-bg);
  border-color: var(--crm-text);
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
}

/* Form Styles */
.create-modal {
  max-width: 650px !important;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--crm-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 77, 77, 0.1);
  color: #ff4d4d;
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

.form-group input:focus {
  border-color: #ff3e00;
  box-shadow: 0 0 0 3px rgba(255, 62, 0, 0.1);
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
