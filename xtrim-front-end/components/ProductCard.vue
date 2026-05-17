<script setup>
import { Plus } from 'lucide-vue-next'
const { addToCart } = useCart()

const props = defineProps({
  title: String,
  price: String,
  category: String,
  features: Array,
  image: String
})

const handleAdd = () => {
  addToCart(props)
}
</script>

<template>
  <div class="card">
    <div class="image-wrapper">
      <img :src="image || '/coffee-table.png'" :alt="title" class="product-image" />
    </div>
    
    <div class="card-body">
      <div class="category">{{ category }}</div>
      <h3 class="title">{{ title }}</h3>
      
      <ul class="features">
        <li v-for="(feature, index) in features" :key="index">
          {{ feature }}
        </li>
      </ul>
      
      <div class="card-footer">
        <div class="price">
          <span class="currency">$</span>
          <span class="amount">{{ price }}</span>
        </div>
        
        <button class="add-btn" @click="handleAdd" title="Añadir al Carrito">
          <Plus :size="14" /> Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: #FFFFFF;
  border-radius: 4px; /* Anguloso minimalista premium */
  border: 1px solid rgba(77, 59, 46, 0.12);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  transition: all 0.4s ease;
  box-shadow: 0 4px 20px rgba(77, 59, 46, 0.03);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(77, 59, 46, 0.08);
  border-color: var(--secondary);
}

.image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1.15;
  overflow: hidden;
  background: #F9F6F0;
  border-bottom: 1px solid rgba(77, 59, 46, 0.08);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

.card:hover .product-image {
  transform: scale(1.05);
}

.card-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.category {
  font-family: 'Work Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--secondary);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 0.5rem;
}

.title {
  font-family: 'Noto Serif', serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.8rem;
}

.features {
  list-style: none;
  margin-bottom: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.features li {
  font-family: 'Work Sans', sans-serif;
  font-size: 0.85rem;
  color: var(--foreground);
  opacity: 0.7;
  line-height: 1.4;
  position: relative;
  padding-left: 0.8rem;
}

.features li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--secondary);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(77, 59, 46, 0.08);
}

.price {
  display: flex;
  align-items: baseline;
  color: var(--primary);
}

.currency {
  font-family: 'Work Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
}

.amount {
  font-family: 'Work Sans', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
}

.add-btn {
  background: none;
  border: 1px solid var(--primary);
  color: var(--primary);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-family: 'Work Sans', sans-serif;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: var(--primary);
  color: #F9F6F0;
}
</style>
