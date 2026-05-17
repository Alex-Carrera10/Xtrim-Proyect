<script setup>
import { onMounted, computed } from 'vue'
import { useProducts } from '@/composables/useProducts'

const { products, loading, fetchProducts } = useProducts()

const fallbackCollections = [
  {
    title: "Living Room Collection",
    price: "450.00",
    category: "Curation",
    features: [
      "Solid walnut wood coffee table",
      "Minimalist architectural joint detail",
      "Hand-rubbed natural oil finish",
      "Sustainable sourced lumber"
    ],
    image: "/coffee-table.png"
  },
  {
    title: "Executive Office Collection",
    price: "1200.00",
    category: "Masterpieces",
    features: [
      "Massive solid oak wooden desk",
      "Integrated discrete cable organizer",
      "Bespoke leather desk-pad lining",
      "10-generation durability guarantee"
    ],
    image: "/office-desk.png"
  },
  {
    title: "Floating Bedroom Collection",
    price: "950.00",
    category: "Sanctuary",
    features: [
      "Rich wild-cherry platform bed frame",
      "Seamless floating invisible legs",
      "Integrated double nightstands",
      "Organic low-VOC protective wax"
    ],
    image: "/bed-frame.png"
  }
]

const displayCollections = computed(() => {
  return products.value.length > 0 ? products.value : fallbackCollections
})

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="home-page">
    <HeroSection />
    
    <section class="catalog-section">
      <div class="container">
        <div class="header">
          <span class="overline">Curation</span>
          <h2 class="title">Featured Collections</h2>
        </div>
        
        <div class="grid">
          <ProductCard v-for="(item, index) in displayCollections" :key="index" v-bind="item" />
        </div>
      </div>
    </section>

    <!-- Craftsman Process Section -->
    <TheWorkshop />
  </div>
</template>

<style scoped>
.home-page {
  background: var(--background);
}

.catalog-section {
  padding: 120px 0;
  background: var(--background);
  position: relative;
  z-index: 2;
}

.header {
  text-align: center;
  margin-bottom: 5rem;
}

.overline {
  color: var(--secondary);
  font-family: 'Work Sans', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.75rem;
  margin-bottom: 0.8rem;
  display: block;
}

.title {
  font-family: 'Noto Serif', serif;
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--primary);
  max-width: 700px;
  margin: 0 auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 3rem;
}

@media (max-width: 768px) {
  .title {
    font-size: 2.2rem;
  }
  
  .catalog-section {
    padding: 80px 0;
  }
}
</style>
