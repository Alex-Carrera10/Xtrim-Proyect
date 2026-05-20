<template>
  <div class="admin-layout" :class="{ 'light-mode': !isDark }">
    <slot />
  </div>
</template>

<script setup>
import { ref, watch, provide } from 'vue'

const themeCookie = useCookie('theme_preference', { default: () => 'dark' })
const isDark = ref(themeCookie.value === 'dark')

watch(isDark, (newVal) => {
  themeCookie.value = newVal ? 'dark' : 'light'
})

provide('isDark', isDark)
</script>

<style>
.admin-layout {
  /* Variables locales para Modo Nocturno (Por defecto) */
  --crm-bg: #0a0a0c;
  --crm-sidebar-bg: #111114;
  --crm-border: #222222;
  --crm-text: #ffffff;
  --crm-text-muted: #888888;
  --crm-nav-hover: #1a1a1e;
  --crm-nav-active-bg: #ff3e0020;
  --crm-card-bg: linear-gradient(145deg, #16161a, #1a1a1e);
  --crm-panel-bg: #111114;
  --crm-table-header: #555555;
  --crm-table-row-border: #1a1a1e;
  --crm-input-bg: #0a0a0c;
  --crm-input-text: #ffffff;
  --crm-input-border: #222222;
  --crm-modal-bg: #111114;
  --crm-modal-border: #222222;
  --crm-scrollbar-thumb: #333333;

  min-height: 100vh;
}

.admin-layout.light-mode {
  /* Variables locales para Modo Claro */
  --crm-bg: #f9f6f0;            /* Hueso/Crema */
  --crm-sidebar-bg: #f3ece2;    /* Tono crema cálido */
  --crm-border: rgba(77, 59, 46, 0.15);
  --crm-text: #262626;          /* Carbón oscuro */
  --crm-text-muted: #666666;
  --crm-nav-hover: rgba(77, 59, 46, 0.05);
  --crm-nav-active-bg: #ff3e0015;
  --crm-card-bg: #ffffff;       /* Tarjetas blancas */
  --crm-panel-bg: #ffffff;      /* Sección blanca */
  --crm-table-header: #8b7355;
  --crm-table-row-border: rgba(77, 59, 46, 0.08);
  --crm-input-bg: #ffffff;
  --crm-input-text: #262626;
  --crm-input-border: rgba(77, 59, 46, 0.2);
  --crm-modal-bg: #ffffff;
  --crm-modal-border: rgba(77, 59, 46, 0.15);
  --crm-scrollbar-thumb: #cccccc;
}
</style>
