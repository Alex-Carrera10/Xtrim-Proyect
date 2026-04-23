<script setup>
import { Plus, Check } from 'lucide-vue-next'
const { addToCart } = useCart()

const props = defineProps({
  title: String,
  price: String,
  category: String,
  features: Array
})

const handleAdd = () => {
  addToCart(props)
}
</script>

<template>
  <div class="card glass">
    <div class="category">{{ category }}</div>
    <h3 class="title">{{ title }}</h3>
    <div class="price">
      <span class="currency">$</span>
      <span class="amount">{{ price }}</span>
      <span class="period">/mes</span>
    </div>
    
    <ul class="features">
      <li v-for="(feature, index) in features" :key="index">
        <Check :size="14" class="check" /> {{ feature }}
      </li>
    </ul>
    
    <button class="add-btn" @click="handleAdd">
      <Plus :size="18" /> Añadir al Carrito
    </button>
  </div>
</template>

<style scoped>
.card {
  padding: 2rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card:hover {
  border-color: var(--primary);
  transform: translateY(-10px);
}

.category {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.8rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.price {
  margin-bottom: 2rem;
  display: flex;
  align-items: baseline;
}

.currency {
  font-size: 1.2rem;
  font-weight: 600;
  opacity: 0.7;
}

.amount {
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0.2rem;
}

.period {
  font-size: 0.9rem;
  opacity: 0.5;
}

.features {
  list-style: none;
  margin-bottom: 2.5rem;
  flex-grow: 1;
}

.features li {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.95rem;
  margin-bottom: 0.8rem;
  opacity: 0.8;
}

.check {
  color: var(--primary);
}

.add-btn {
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: var(--primary);
  color: #000;
  border-color: var(--primary);
  box-shadow: 0 10px 20px var(--primary-glow);
}
</style>
