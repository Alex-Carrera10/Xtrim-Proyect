<template>
  <aside class="sidebar">
    <div class="logo">
      <span class="xtrim">DORADO</span><span class="crm">CRM</span>
    </div>
    <nav class="main-nav">
      <NuxtLink to="/admin" class="nav-item" :class="{ active: isActive('/admin') }">
        <LayoutDashboard :size="18" />
        Leads Dashboard
      </NuxtLink>
      <NuxtLink to="/admin/products" class="nav-item" :class="{ active: isActive('/admin/products') }">
        <ShoppingBag :size="18" />
        Catalog Products
      </NuxtLink>
      <NuxtLink to="/admin/materials" class="nav-item" :class="{ active: isActive('/admin/materials') }">
        <Layers :size="18" />
        Materials
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
</template>

<script setup>
import { inject } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  ExternalLink,
  Sun,
  Moon,
  LogOut
} from 'lucide-vue-next'

const isDark = inject('isDark')
const route = useRoute()

const isActive = (path) => {
  if (path === '/admin') {
    return route.path === '/admin' || route.path.startsWith('/admin/leads')
  }
  return route.path.startsWith(path)
}

const handleLogout = () => {
  const auth = useCookie('auth_token')
  auth.value = null
  navigateTo('/login')
}
</script>

<style scoped>
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

/* Evitar el borde azul predeterminado (focus outline) del navegador */
.nav-item:focus {
  outline: none;
}

/* Estilo premium de foco de teclado (accesibilidad) */
.nav-item:focus-visible {
  outline: 2px solid #ff3e00;
  outline-offset: 2px;
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
</style>
