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
  background: rgba(77, 59, 46, 0.4); /* Overlay con tono café */
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
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: -10px 0 40px rgba(77, 59, 46, 0.08);
  background: #F9F6F0; /* Fondo crema orgánico */
  border-left: 1px solid rgba(77, 59, 46, 0.15);
  color: var(--foreground);
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

.drawer-header h3 {
  font-family: 'Noto Serif', serif;
  color: var(--primary);
  font-size: 1.4rem;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  opacity: 0.7;
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
  opacity: 0.6;
  font-family: 'Work Sans', sans-serif;
  color: var(--primary);
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  padding: 1.2rem;
  border-radius: 4px; /* Más anguloso minimalista */
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFFFFF; /* Blanco puro para contraste */
  border: 1px solid rgba(77, 59, 46, 0.1);
  box-shadow: 0 2px 8px rgba(77, 59, 46, 0.03);
}

.item-info h4 {
  font-family: 'Noto Serif', serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.3rem;
}

.item-price {
  color: var(--accent);
  font-family: 'Work Sans', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
}

.remove-btn {
  background: none;
  border: none;
  color: #ff4d4d;
  cursor: pointer;
  opacity: 0.7;
  transition: 0.3s;
  padding: 0.2rem;
}

.remove-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.drawer-footer {
  padding-top: 2rem;
  border-top: 1px solid rgba(77, 59, 46, 0.15);
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-family: 'Noto Serif', serif;
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--primary);
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
  padding-top: 0.5rem;
}

.back-btn {
  background: none;
  border: none;
  color: var(--secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Work Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 1.5rem;
  padding: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: 0.2s;
}

.back-btn:hover { color: var(--primary); }

.checkout-form h3 { 
  font-family: 'Noto Serif', serif; 
  color: var(--primary); 
  font-size: 1.3rem; 
  margin-bottom: 0.5rem; 
}

.subtitle { 
  color: #666; 
  font-family: 'Work Sans', sans-serif; 
  font-size: 0.85rem; 
  margin-bottom: 2rem; 
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Work Sans', sans-serif;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 0.6rem;
}

.input-group input, .input-group select {
  width: 100%;
  background: #FFFFFF;
  border: 1px solid rgba(77, 59, 46, 0.25);
  border-radius: 4px; /* Anguloso sutil */
  padding: 0.9rem;
  color: var(--foreground);
  font-family: 'Work Sans', sans-serif;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.input-group input:focus, .input-group select:focus {
  border-color: var(--primary);
  outline: none;
  background: #FFFFFF;
  box-shadow: 0 0 8px rgba(77, 59, 46, 0.1);
}

.input-group select option {
  background: #F9F6F0;
  color: var(--foreground);
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
  border-radius: 4px;
  font-family: 'Work Sans', sans-serif;
  font-size: 0.85rem;
  text-align: center;
  font-weight: 600;
}

.success { 
  background: rgba(194, 153, 107, 0.15); 
  color: var(--primary); 
  border: 1px solid var(--secondary); 
}

.error { 
  background: rgba(255, 0, 0, 0.05); 
  color: #d32f2f; 
  border: 1px solid rgba(255, 0, 0, 0.15); 
}

@media (max-width: 480px) {
  .drawer {
    width: 100%;
    right: -100%;
  }
}
</style>
