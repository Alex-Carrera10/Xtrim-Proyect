<template>
  <div class="login-page" :class="{ 'light-mode': !isDark }">
    <div class="login-container glass">


      <div class="login-header">
        <div class="logo">El Dorado<span class="crm">CRM</span></div>
        <h1>Acceso Administrativo</h1>
        <p>Ingresa tus credenciales para gestionar leads.</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label>Usuario</label>
          <div class="input-wrapper">
            <User :size="18" class="icon" />
            <input v-model="credentials.username" type="text" placeholder="Tu usuario" required>
          </div>
        </div>

        <div class="input-group">
          <label>Contraseña</label>
          <div class="input-wrapper">
            <Lock :size="18" class="icon" />
            <input v-model="credentials.password" type="password" placeholder="••••••••" required>
          </div>
        </div>

        <div v-if="error" class="error-msg">
          {{ error }}
        </div>

        <button type="submit" :disabled="isLoading" class="login-btn">
          <span v-if="!isLoading">Entrar al Panel</span>
          <span v-else>Verificando...</span>
        </button>
      </form>
      
      <NuxtLink to="/" class="back-link">← Volver al sitio público</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { User, Lock } from 'lucide-vue-next'

definePageMeta({
  layout: false
})

const credentials = reactive({
  username: '',
  password: ''
})

const isLoading = ref(false)
const error = ref(null)

const themeCookie = useCookie('theme_preference', { default: () => 'dark' })
const isDark = ref(themeCookie.value === 'dark')

watch(isDark, (newVal) => {
  themeCookie.value = newVal ? 'dark' : 'light'
})

const { login } = useAuth()

const handleLogin = async () => {
  isLoading.value = true
  error.value = null

  try {
    await login(credentials.username, credentials.password)
    navigateTo('/admin')
  } catch {
    error.value = 'Credenciales incorrectas'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  /* Variables locales para Modo Nocturno (Por defecto) */
  --bg-gradient: radial-gradient(circle at center, #1a1a2e 0%, #0a0a0c 100%);
  --card-bg: rgba(255, 255, 255, 0.02);
  --card-border: rgba(255, 255, 255, 0.1);
  --text-color: #ffffff;
  --text-muted: #888888;
  --input-bg: #000000;
  --input-text: #ffffff;
  --input-border: #222222;
  --input-icon: #555555;
  --back-link-color: #555555;
  --back-link-hover: #888888;
  --logo-text: #ffffff;
  --toggle-hover-bg: rgba(255, 255, 255, 0.05);

  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-gradient);
  color: var(--text-color);
  font-family: 'Inter', sans-serif;
  transition: background 0.5s ease, color 0.5s ease;
}

.login-page.light-mode {
  /* Variables locales para Modo Claro */
  --bg-gradient: radial-gradient(circle at center, #f5efe6 0%, #e6dfd3 100%);
  --card-bg: rgba(255, 255, 255, 0.85);
  --card-border: rgba(77, 59, 46, 0.15);
  --text-color: #262626;
  --text-muted: #666666;
  --input-bg: #ffffff;
  --input-text: #262626;
  --input-border: rgba(77, 59, 46, 0.2);
  --input-icon: #8b7355;
  --back-link-color: #8b7355;
  --back-link-hover: #4a3b2e;
  --logo-text: #4D3B2E;
  --toggle-hover-bg: rgba(0, 0, 0, 0.05);
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 3rem;
  border-radius: 24px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  text-align: center;
  position: relative;
  transition: all 0.5s ease;
}



.login-header {
  margin-bottom: 2.5rem;
}

.logo {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: var(--logo-text);
  transition: color 0.5s ease;
}

.crm { color: #ff3e00; }

h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
p { color: var(--text-muted); font-size: 0.9rem; transition: color 0.5s ease; }

.login-form {
  text-align: left;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
  font-weight: 500;
  transition: color 0.5s ease;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.icon {
  position: absolute;
  left: 1rem;
  color: var(--input-icon);
  transition: color 0.5s ease;
}

.input-wrapper input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 3rem;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 12px;
  color: var(--input-text);
  font-family: inherit;
  transition: all 0.3s;
}

.input-wrapper input:focus {
  border-color: #ff3e00;
  outline: none;
  background: var(--input-bg);
}

.error-msg {
  background: rgba(255, 0, 0, 0.1);
  color: #ff4d4d;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 0, 0, 0.2);
}

.login-btn {
  width: 100%;
  padding: 1rem;
  background: #ff3e00;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.login-btn:hover {
  background: #ff5500;
  transform: translateY(-2px);
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.back-link {
  display: inline-block;
  margin-top: 2rem;
  color: var(--back-link-color);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.back-link:hover { color: var(--back-link-hover); }
</style>
