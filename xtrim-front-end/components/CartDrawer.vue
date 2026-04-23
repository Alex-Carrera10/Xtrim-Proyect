<script setup>
import { X, Trash2, Send, ChevronLeft, User, Mail, Phone, MapPin } from 'lucide-vue-next'
const { cart, removeFromCart, cartTotal, clearCart } = useCart()

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

// Estados del flujo
const step = ref('cart') // 'cart' | 'form'
const isSubmitting = ref(false)
const orderStatus = ref(null) // 'success' | 'error'

// Formulario reactivo
const form = reactive({
  name: '',
  email: '',
  phone: '',
  province: ''
})

const provinces = [
  'Guayas', 'Pichincha', 'Azuay', 'Manabí', 'El Oro', 'Tungurahua', 'Los Ríos', 'Otros'
]

const isFormValid = computed(() => {
  return form.name.length > 2 && 
         form.email.includes('@') && 
         form.phone.length >= 9 && 
         form.province !== ''
})

const goToForm = () => {
  if (cart.value.length > 0) step.value = 'form'
}

const goBack = () => {
  step.value = 'cart'
}

const handleCheckout = async () => {
  if (!isFormValid.value) return
  
  isSubmitting.value = true
  orderStatus.value = null
  
  const leadData = {
    name: form.name,
    email: form.email,
    phone: form.phone,
    province: form.province,
    description: `Pedido de eCommerce: ${cart.value.map(p => p.title).join(', ')}. Total: $${cartTotal.value}`,
    status: "Nuevo",
    valor_estimado: parseFloat(cartTotal.value)
  }

  try {
    const response = await fetch('http://localhost:3000/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    })
    
    if (response.ok) {
      orderStatus.value = 'success'
      setTimeout(() => {
        clearCart()
        emit('close')
        orderStatus.value = null
        step.value = 'cart'
        // Limpiar form
        form.name = ''; form.email = ''; form.phone = ''; form.province = ''
      }, 3000)
    } else {
      orderStatus.value = 'error'
    }
  } catch (error) {
    console.error('Error al enviar el pedido:', error)
    orderStatus.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div :class="['drawer-overlay', { 'active': isOpen }]" @click="emit('close')"></div>
    <div :class="['drawer', { 'active': isOpen }]">
      <div class="drawer-header">
        <h3>Tu Carrito</h3>
        <button class="close-btn" @click="emit('close')"><X :size="24" /></button>
      </div>

      <div class="drawer-content">
        <!-- VISTA 1: CARRITO -->
        <div v-if="step === 'cart'" class="fade-in">
          <div v-if="cart.length === 0" class="empty-state">
            <p>Tu carrito está vacío.</p>
          </div>
          
          <div v-else class="cart-items">
            <div v-for="item in cart" :key="item.cartId" class="cart-item">
              <div class="item-info">
                <h4>{{ item.title }}</h4>
                <span class="item-price">${{ item.price }}</span>
              </div>
              <button class="remove-btn" @click="removeFromCart(item.cartId)">
                <Trash2 :size="18" />
              </button>
            </div>
          </div>
        </div>

      <!-- VISTA 2: FORMULARIO -->
      <div v-if="step === 'form'" class="checkout-form fade-in">
        <button class="back-btn" @click="goBack">
          <ChevronLeft :size="18" /> Volver al carrito
        </button>
        
        <h3>Tus Datos</h3>
        <p class="subtitle">Completa la información para procesar tu pedido.</p>

        <div class="input-group">
          <label><User :size="14" /> Nombre Completo</label>
          <input v-model="form.name" type="text" placeholder="Ej: Juan Pérez">
        </div>

        <div class="input-group">
          <label><Mail :size="14" /> Correo Electrónico</label>
          <input v-model="form.email" type="email" placeholder="juan@example.com">
        </div>

        <div class="input-group">
          <label><Phone :size="14" /> Teléfono / WhatsApp</label>
          <input v-model="form.phone" type="tel" placeholder="099 999 9999">
        </div>

        <div class="input-group">
          <label><MapPin :size="14" /> Provincia</label>
          <select v-model="form.province">
            <option value="" disabled>Selecciona una provincia</option>
            <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- FOOTER DINÁMICO -->
    <div v-if="cart.length > 0" class="drawer-footer">
      <div class="total-row">
        <span>Total Mensual:</span>
        <span class="total-amount">${{ cartTotal }}</span>
      </div>
      
      <!-- Botón Paso 1 -->
      <button 
        v-if="step === 'cart'"
        class="button-premium checkout-btn"
        @click="goToForm"
      >
        Continuar al Pago
      </button>

      <!-- Botón Paso 2 -->
      <button 
        v-if="step === 'form'"
        :disabled="isSubmitting || !isFormValid" 
        class="button-premium checkout-btn"
        @click="handleCheckout"
      >
        <span v-if="!isSubmitting">Confirmar y Enviar <Send :size="18" /></span>
        <span v-else>Procesando Lead...</span>
      </button>
      
      <div v-if="orderStatus === 'success'" class="msg success">
        ¡Venta registrada! Te contactaremos pronto.
      </div>
      <div v-if="orderStatus === 'error'" class="msg error">
        Error al conectar con el CRM. Intenta de nuevo.
      </div>
    </div>
  </div>
</template>

<style scoped>
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1500;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
}

.drawer-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

.drawer {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  z-index: 1501;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: -15px 0 50px rgba(0, 0, 0, 0.8);
  background: #0f0f12; /* Fondo sólido y profundo */
  border-left: 1px solid rgba(255, 255, 255, 0.08);
}

.drawer.active {
  right: 0;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  opacity: 0.6;
  transition: 0.3s;
}

.close-btn:hover {
  opacity: 1;
  transform: rotate(90deg);
}

.drawer-content {
  flex-grow: 1;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  margin-top: 4rem;
  opacity: 0.5;
}

.cart-item {
  padding: 1.2rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  background: #1a1a1f; /* Fondo sólido para los items */
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.item-info h4 {
  font-size: 1rem;
  margin-bottom: 0.3rem;
}

.item-price {
  color: var(--primary);
  font-weight: 600;
}

.remove-btn {
  background: none;
  border: none;
  color: #ff4d4d;
  cursor: pointer;
  opacity: 0.6;
  transition: 0.3s;
}

.remove-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.drawer-footer {
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.total-amount {
  color: var(--primary);
}

.checkout-btn {
  width: 100%;
  padding: 1.2rem;
  font-size: 1.1rem;
}

.checkout-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  filter: grayscale(1);
}

/* Form Styles */
.checkout-form {
  padding-top: 1rem;
}

.back-btn {
  background: none;
  border: none;
  color: #888;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  padding: 0;
}

.back-btn:hover { color: #fff; }

.checkout-form h3 { margin-bottom: 0.5rem; }
.subtitle { color: #888; font-size: 0.9rem; margin-bottom: 2rem; }

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #aaa;
  margin-bottom: 0.5rem;
}

.input-group input, .input-group select {
  width: 100%;
  background: #08080a; /* Más oscuro que el fondo para contraste */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.9rem;
  color: #fff;
  font-family: inherit;
  transition: 0.3s;
}

.input-group input:focus, .input-group select:focus {
  border-color: var(--primary);
  outline: none;
  background: #000;
  box-shadow: 0 0 15px rgba(0, 112, 243, 0.1);
}

.input-group select option {
  background: #111;
  color: #fff;
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.msg {
  margin-top: 1rem;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
}

.success { background: rgba(0, 255, 0, 0.1); color: #00ff00; border: 1px solid rgba(0, 255, 0, 0.2); }
.error { background: rgba(255, 0, 0, 0.1); color: #ff0000; border: 1px solid rgba(255, 0, 0, 0.2); }

@media (max-width: 480px) {
  .drawer {
    width: 100%;
    right: -100%;
  }
}
</style>
