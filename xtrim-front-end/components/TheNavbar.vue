<script setup>
import { ShoppingCart, Search, Menu, X, Lock } from 'lucide-vue-next'
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
  { name: 'Inicio', href: '/' },
  { name: 'Planes', href: '/planes' },
  { name: 'Dispositivos', href: '/dispositivos' },
  { name: 'Soporte', href: '/soporte' }
]
</script>

<template>
  <nav :class="['nav', { 'scrolled': isScrolled }, 'glass']">
    <div class="container nav-container">
      <NuxtLink href="/" class="logo">
        XTRIM<span class="gradient-text">E-COMMERCE</span>
      </NuxtLink>

      <div :class="['links', { 'active': isMenuOpen }]">
        <NuxtLink v-for="link in navLinks" :key="link.name" :href="link.href" @click="isMenuOpen = false">
          {{ link.name }}
        </NuxtLink>
      </div>

      <div class="actions">
        <button class="icon-btn"><Search :size="22" /></button>
        <button class="icon-btn" @click="isCartOpen = true">
          <ShoppingCart :size="22" />
          <span class="badge" v-if="cartCount > 0">{{ cartCount }}</span>
        </button>
        <button class="menu-btn" @click="isMenuOpen = !isMenuOpen">
          <component :is="isMenuOpen ? X : Menu" :size="24" />
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
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.scrolled {
  height: 70px;
  background: rgba(10, 10, 10, 0.85);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -1px;
}

.links {
  display: flex;
  gap: 2.5rem;
}

.links a {
  font-size: 0.95rem;
  font-weight: 500;
  opacity: 0.8;
  transition: all 0.3s ease;
  position: relative;
}

.links a:hover {
  opacity: 1;
  color: var(--primary);
}

.actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.icon-btn {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  opacity: 0.8;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
}

.icon-btn:hover {
  opacity: 1;
  transform: translateY(-2px);
  color: var(--primary);
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--secondary);
  color: #fff;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: bold;
}

.menu-btn {
  display: none;
  background: none;
  border: none;
  color: #fff;
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
  }

  .links.active {
    left: 0;
  }

  .menu-btn {
    display: block;
  }
}
</style>
