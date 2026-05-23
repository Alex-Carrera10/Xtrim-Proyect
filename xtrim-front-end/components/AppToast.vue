<template>
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div v-for="toast in toasts" :key="toast.id" class="toast-item" :class="toast.type">
        <div class="toast-icon">
          <ShoppingBag v-if="toast.type === 'sale'" :size="18" />
          <Info v-else :size="18" />
        </div>
        <div class="toast-body">
          <div class="toast-title">{{ toast.title }}</div>
          <div class="toast-message">{{ toast.message }}</div>
        </div>
        <button @click="removeToast(toast.id)" class="close-btn"><X :size="14" /></button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ShoppingBag, Info, X } from 'lucide-vue-next';
import { useToasts } from '@/composables/useToasts';

const { toasts, removeToast } = useToasts();
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  z-index: 9999;
  pointer-events: none;
}

.toast-item {
  background: var(--crm-modal-bg);
  border: 1px solid var(--crm-border);
  border-radius: 16px;
  padding: 1rem 1.2rem;
  min-width: 300px;
  max-width: 400px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  pointer-events: auto;
}

.toast-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sale {
  border-left: 4px solid #00ff88;
}

.sale .toast-icon {
  background: rgba(0, 255, 136, 0.1);
  color: #00ff88;
}

.toast-title {
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 0.1rem;
}

.toast-message {
  font-size: 0.8rem;
  color: var(--crm-text-muted);
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--crm-text-muted);
  cursor: pointer;
  padding: 4px;
}

/* Animation */
.toast-enter-active, .toast-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
