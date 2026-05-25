<script setup>
import { ShoppingCart, Search, Menu, X, User } from 'lucide-vue-next'
const { cartCount } = useCart()
const isScrolled = ref(false)
const isMenuOpen = ref(false)
const isCartOpen = ref(false)

if (process.client) {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 50
  })
}

const navLinks = [
  { name: 'Furniture', href: '/' },
  { name: 'Custom Pieces', href: '#' },
  { name: 'Materials', href: '/materiales' },
  { name: 'Workshops', href: '#' },
  { name: 'About', href: '#' }
]
</script>

<template>
  <nav :class="['nav', { 'scrolled': isScrolled }, 'glass']">
    <div class="container nav-container">
      <NuxtLink href="/" class="logo">
        MUEBLERÍA <span class="light-text">EL DORADO</span>
      </NuxtLink>

      <div :class="['links', { 'active': isMenuOpen }]">
        <NuxtLink v-for="link in navLinks" :key="link.name" :href="link.href" @click="isMenuOpen = false">
          {{ link.name }}
        </NuxtLink>
      </div>

      <div class="actions">
        <button class="icon-btn" title="Buscar"><Search :size="20" /></button>
        <button class="icon-btn" @click="isCartOpen = true" title="Ver Carrito">
          <ShoppingCart :size="20" />
          <span class="badge" v-if="cartCount > 0">{{ cartCount }}</span>
        </button>
        <NuxtLink href="/admin" class="icon-btn" title="Panel Administrativo">
          <User :size="20" />
        </NuxtLink>
        <button class="menu-btn" @click="isMenuOpen = !isMenuOpen">
          <component :is="isMenuOpen ? X : Menu" :size="22" />
        </button>
      </div>
    </div>
    
    <CartDrawer :is-open="isCartOpen" @close="isCartOpen = false" />
  </nav>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  align-items: center;
  z-index: 1000;
  background: rgba(249, 246, 240, 0.8);
  border-bottom: 1px solid rgba(77, 59, 46, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.scrolled {
  height: 70px;
  background: rgba(249, 246, 240, 0.96);
  border-bottom: 1px solid rgba(77, 59, 46, 0.15);
  box-shadow: 0 4px 20px rgba(77, 59, 46, 0.05);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo {
  font-family: 'Noto Serif', serif;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--primary);
  display: flex;
  gap: 0.3rem;
  white-space: nowrap;
}

.logo .light-text {
  font-weight: 300;
  opacity: 0.9;
}

.links {
  display: flex;
  gap: 2.5rem;
}

.links a {
  font-family: 'Work Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--foreground);
  opacity: 0.75;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.3rem 0;
}

.links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background-color: var(--primary);
  transition: width 0.3s ease;
}

.links a:hover {
  opacity: 1;
  color: var(--primary);
}

.links a:hover::after {
  width: 100%;
}

/* Enlace activo de ejemplo para "Furniture" */
.links a[href="/"] {
  opacity: 1;
  color: var(--primary);
  font-weight: 600;
}
.links a[href="/"]::after {
  width: 100%;
}

.actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.icon-btn {
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  opacity: 0.8;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  padding: 0.2rem;
}

.icon-btn:hover {
  opacity: 1;
  transform: translateY(-2px);
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: var(--secondary);
  color: #fff;
  font-size: 0.65rem;
  padding: 1px 5px;
  border-radius: 10px;
  font-weight: bold;
}

.menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
}

@media (max-width: 768px) {
  .links {
    position: fixed;
    top: 80px;
    left: -100%;
    width: 100%;
    height: calc(100vh - 80px);
    background: var(--background);
    flex-direction: column;
    align-items: center;
    padding-top: 4rem;
    gap: 3rem;
    transition: left 0.3s ease;
    border-top: 1px solid rgba(77, 59, 46, 0.1);
  }

  .links.active {
    left: 0;
  }

  .menu-btn {
    display: block;
  }
}
</style>
