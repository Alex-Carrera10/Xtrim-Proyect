<template>
  <div class="notification-center">
    <button class="bell-btn" @click="isOpen = !isOpen" :class="{ 'has-unread': unreadCount > 0 }">
      <Bell :size="20" />
      <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
    </button>

    <Transition name="slide-up">
      <div v-if="isOpen" class="dropdown" v-click-outside="() => isOpen = false">
        <div class="dropdown-header">
          <h3>Notificaciones</h3>
          <button v-if="unreadCount > 0" @click="markAllAsRead" class="clear-all">Marcar todas como leídas</button>
        </div>

        <div class="notifications-list">
          <div v-if="loading && notifications.length === 0" class="empty-state">
            Cargando...
          </div>
          <div v-else-if="notifications.length === 0" class="empty-state">
            <CheckCircle :size="32" />
            <p>No tienes notificaciones pendientes</p>
          </div>
          
          <div 
            v-for="notif in notifications" 
            :key="notif.id" 
            class="notification-item"
            :class="notif.type.toLowerCase()"
          >
            <div class="notif-icon">
              <ShoppingBag v-if="notif.type === 'SALE'" :size="18" />
              <Info v-else :size="18" />
            </div>
            <div class="notif-content">
              <h4>{{ notif.title }}</h4>
              <p>{{ notif.message }}</p>
              <span class="time">{{ formatTime(notif.createdAt) }}</span>
            </div>
            <button class="mark-read-btn" @click="markAsRead(notif.id)">
              <X :size="14" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Bell, ShoppingBag, Info, CheckCircle, X } from 'lucide-vue-next';
import { useNotifications } from '@/composables/useNotifications';

const isOpen = ref(false);
const { 
  notifications, 
  unreadCount, 
  loading, 
  fetchNotifications, 
  markAsRead, 
  markAllAsRead,
  startPolling,
  stopPolling
} = useNotifications();

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
};

onMounted(() => {
  startPolling(15000); // Poll every 15 seconds
});

onUnmounted(() => {
  stopPolling();
});

// Simple click outside directive logic
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
};
</script>

<style scoped>
.notification-center {
  position: relative;
}

.bell-btn {
  background: var(--crm-nav-hover);
  border: 1px solid var(--crm-border);
  color: var(--crm-text-muted);
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.bell-btn:hover {
  background: var(--crm-border);
  color: var(--crm-text);
  transform: translateY(-1px);
}

.bell-btn.has-unread {
  color: #ff3e00;
  border-color: rgba(255, 62, 0, 0.3);
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff3e00;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid var(--crm-bg);
}

.dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 350px;
  background: var(--crm-modal-bg);
  border: 1px solid var(--crm-border);
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.3);
  z-index: 1000;
  overflow: hidden;
}

.dropdown-header {
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid var(--crm-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-header h3 {
  font-size: 1rem;
  font-weight: 700;
}

.clear-all {
  background: transparent;
  border: none;
  color: var(--crm-text-muted);
  font-size: 0.75rem;
  cursor: pointer;
  transition: color 0.2s;
}

.clear-all:hover {
  color: #ff3e00;
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.empty-state {
  padding: 3rem 1rem;
  text-align: center;
  color: var(--crm-text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-state p {
  font-size: 0.9rem;
}

.notification-item {
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid var(--crm-border);
  display: flex;
  gap: 1rem;
  position: relative;
  transition: background 0.2s;
}

.notification-item:hover {
  background: var(--crm-nav-hover);
}

.notif-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sale .notif-icon {
  background: rgba(0, 255, 136, 0.1);
  color: #00ff88;
}

.info .notif-icon {
  background: rgba(0, 112, 243, 0.1);
  color: #0070f3;
}

.notif-content h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.notif-content p {
  font-size: 0.8rem;
  color: var(--crm-text-muted);
  line-height: 1.4;
  margin-bottom: 0.4rem;
}

.time {
  font-size: 0.7rem;
  color: var(--crm-text-muted);
  opacity: 0.6;
}

.mark-read-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: var(--crm-text-muted);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.notification-item:hover .mark-read-btn {
  opacity: 1;
}

/* Animations */
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
