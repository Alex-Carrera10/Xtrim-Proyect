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

    <aside class="sidebar">
      <div class="logo">
        <span class="xtrim">ARTISAN</span><span class="crm">CRM</span>
      </div>
      <nav class="main-nav">
        <NuxtLink to="/admin" class="nav-item active">
          <LayoutDashboard :size="18" />
          Leads Dashboard
        </NuxtLink>
        <NuxtLink to="/admin/products" class="nav-item">
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
        <h1>Dashboard General</h1>
        <div class="user-profile">
          <span class="status-dot"></span>
          Admin Mode
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

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const config = useRuntimeConfig();

const leads = ref([]);
const stats = reactive({
  revenue: 0,
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
    const response = await $fetch(`${config.public.apiUrl}/leads`);
    leads.value = response;
    
    // Fetch KPI
    const kpiResponse = await $fetch(`${config.public.apiUrl}/leads/kpi`);
    stats.revenue = kpiResponse.totalSales || 0;
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
      method: 'DELETE'
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
      body: newLead
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

const handleLogout = () => {
  const auth = useCookie('auth_token')
  auth.value = null
  navigateTo('/login')
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
  background: #00ff88;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ff8880;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: linear-gradient(145deg, #16161a, #1a1a1e);
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #222;
}

.stat-label {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
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
  background: #1a1a1e;
  border: 1px solid #333;
  color: #888;
  padding: 0.5rem 1.2rem;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: 0.2s;
}

.filter-btn.active {
  background: #333;
  color: #fff;
  border-color: #444;
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
  cursor: pointer;
  transition: background 0.2s;
}

.lead-row:hover {
  background: rgba(255, 255, 255, 0.02);
}

.leads-table td {
  padding: 1.4rem 1rem;
}

.lead-name {
  display: block;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.2rem;
}

.lead-email {
  display: block;
  font-size: 0.8rem;
  color: #555;
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
  border: 1px solid #333;
  color: #888;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn.view:hover {
  background: #fff;
  color: #000;
  border-color: #fff;
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
