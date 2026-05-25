<template>
  <div class="materials-page">
    <section class="hero">
      <div class="hero-content">
        <p class="hero-label">Nuestra Materia Prima</p>
        <h1>Materiales de<br /><span class="accent">Primera Calidad</span></h1>
        <p class="hero-sub">Cada pieza que creamos nace de los mejores materiales del mundo. Conoce las maderas, metales y telas que dan vida a nuestros muebles.</p>
      </div>
    </section>

    <section class="catalog-section container">
      <!-- Filtros por tipo -->
      <div class="filters">
        <button
          v-for="filter in filters"
          :key="filter"
          class="filter-btn"
          :class="{ active: activeFilter === filter }"
          @click="activeFilter = filter"
        >
          {{ filter }}
        </button>
      </div>

      <div v-if="loading" class="loading-state">Cargando materiales...</div>

      <div v-else-if="filteredMaterials.length === 0" class="empty-state">
        No hay materiales disponibles en esta categoría.
      </div>

      <div v-else class="materials-grid">
        <article v-for="material in filteredMaterials" :key="material.id" class="material-card">
          <div class="card-image">
            <img :src="material.image || '/coffee-table.png'" :alt="material.name" />
            <span class="type-badge">{{ material.type }}</span>
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ material.name }}</h3>
            <p class="card-desc">{{ material.description }}</p>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useMaterials } from '@/composables/useMaterials'

const { materials, loading, fetchMaterials } = useMaterials()

const activeFilter = ref('Todos')

const filters = computed(() => {
  const types = [...new Set(materials.value.map(m => m.type))]
  return ['Todos', ...types]
})

const filteredMaterials = computed(() => {
  if (activeFilter.value === 'Todos') return materials.value
  return materials.value.filter(m => m.type === activeFilter.value)
})

onMounted(() => {
  fetchMaterials()
})
</script>

<style scoped>
.materials-page {
  background: #0a0a0a;
  min-height: 100vh;
  color: #f5f0ea;
}

/* Hero */
.hero {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8rem 2rem 4rem;
  background: radial-gradient(ellipse at center top, rgba(255, 62, 0, 0.08) 0%, transparent 60%);
}

.hero-label {
  font-size: 0.75rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #ff3e00;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.hero h1 {
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -2px;
  margin-bottom: 1.5rem;
  color: #f5f0ea;
}

.accent { color: #ff3e00; }

.hero-sub {
  font-size: 1.1rem;
  color: #8a8a8a;
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.7;
}

/* Catalog */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.catalog-section {
  padding: 4rem 2rem 6rem;
}

/* Filtros */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 3rem;
}

.filter-btn {
  background: transparent;
  border: 1px solid rgba(255, 240, 220, 0.15);
  color: #8a8a8a;
  padding: 0.5rem 1.2rem;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

.filter-btn:hover {
  border-color: #ff3e00;
  color: #ff3e00;
}

.filter-btn.active {
  background: #ff3e00;
  border-color: #ff3e00;
  color: #fff;
  font-weight: 600;
}

/* Grid */
.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.material-card {
  background: #111;
  border: 1px solid rgba(255, 240, 220, 0.08);
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.material-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 62, 0, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.card-image {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.material-card:hover .card-image img {
  transform: scale(1.05);
}

.type-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 62, 0, 0.4);
  color: #ff3e00;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #f5f0ea;
  margin-bottom: 0.75rem;
}

.card-desc {
  font-size: 0.9rem;
  color: #8a8a8a;
  line-height: 1.6;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  color: #8a8a8a;
  font-size: 1rem;
}
</style>
