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
  background: var(--background);
  min-height: 100vh;
  color: var(--foreground);
}

/* Hero */
.hero {
  min-height: 44vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8rem 2rem 4rem;
  border-bottom: 1px solid var(--border);
}

.hero-label {
  display: inline-block;
  font-size: 0.72rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 1.5rem;
  font-weight: 600;
  border: 1px solid var(--border);
  padding: 0.35rem 1rem;
  border-radius: 999px;
}

.hero h1 {
  font-size: clamp(2.2rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -1.5px;
  margin-bottom: 1.5rem;
  color: var(--primary);
}

.accent { color: var(--secondary); }

.hero-sub {
  font-size: 1rem;
  color: #6b6b6b;
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.75;
}

/* Catalog */
.catalog-section {
  padding: 4rem 2rem 6rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Filtros */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 3rem;
}

.filter-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: #6b6b6b;
  padding: 0.45rem 1.2rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Work Sans', sans-serif;
}

.filter-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.filter-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--background);
  font-weight: 600;
}

/* Grid */
.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.75rem;
}

.material-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.material-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px var(--primary-glow);
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
  transform: scale(1.04);
}

.type-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  border: 1px solid var(--glass-border);
  color: var(--primary);
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.6rem;
}

.card-desc {
  font-size: 0.88rem;
  color: #6b6b6b;
  line-height: 1.65;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  color: #6b6b6b;
  font-size: 1rem;
}
</style>
