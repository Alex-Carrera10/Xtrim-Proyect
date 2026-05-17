<template>
  <div class="login-page">
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
import { User, Lock } from 'lucide-vue-next'

const credentials = reactive({
  username: '',
  password: ''
})

const isLoading = ref(false)
const error = ref(null)

const handleLogin = async () => {
  isLoading.value = true
  error.value = null

  // MOCK LOGIN: En un caso real, esto llamaría a tu API de Backend
  // Por ahora usaremos admin / admin123 como ejemplo
  setTimeout(() => {
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      const auth = useCookie('auth_token')
      auth.value = 'dummy-token-123' // En un caso real, esto vendría del JWT del backend
      
      navigateTo('/admin')
    } else {
      error.value = 'Credenciales incorrectas. Intenta con admin / admin123'
    }
    isLoading.value = false
  }, 1000)
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, #1a1a2e 0%, #0a0a0c 100%);
  color: #fff;
  font-family: 'Inter', sans-serif;
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 3rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.login-header {
  margin-bottom: 2.5rem;
}

.logo {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.crm { color: #ff3e00; }

h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
p { color: #888; font-size: 0.9rem; }

.login-form {
  text-align: left;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  font-size: 0.8rem;
  color: #aaa;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.icon {
  position: absolute;
  left: 1rem;
  color: #555;
}

.input-wrapper input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 3rem;
  background: #000;
  border: 1px solid #222;
  border-radius: 12px;
  color: #fff;
  font-family: inherit;
  transition: all 0.3s;
}

.input-wrapper input:focus {
  border-color: #ff3e00;
  outline: none;
  background: #050505;
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
  color: #555;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.back-link:hover { color: #888; }
</style>
