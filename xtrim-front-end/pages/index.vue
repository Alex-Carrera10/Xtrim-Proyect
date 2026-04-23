<script setup>
const plans = [
  {
    title: "Plan Esencial",
    price: "24.99",
    category: "Fibra Óptica",
    features: ["300 Mbps Simétricos", "Router Wi-Fi 6", "Soporte 24/7", "Instalación Gratis"],
  },
  {
    title: "Plan Gamer",
    price: "39.99",
    category: "Ultravelocidad",
    features: ["600 Mbps Simétricos", "Baja Latencia", "Router Mesh Incluido", "IP Fija Opcional"],
  },
  {
    title: "Plan Pro Max",
    price: "59.99",
    category: "Empresarial",
    features: ["1 Gbps (1000 Mbps)", "Ancho de banda garantizado", "Soporte Premium", "Xtrim TV Incluido"],
  },
];
</script>

<template>
  <div class="home-page">
    <HeroSection />
    
    <section class="catalog-section">
      <div class="container">
        <div class="header">
          <span class="overline">Nuestros Servicios</span>
          <h2 class="title">Elige el plan ideal para <span class="gradient-text">Tu Estilo de Vida</span></h2>
        </div>
        
        <div class="grid">
          <ProductCard v-for="(plan, index) in plans" :key="index" v-bind="plan" />
        </div>
      </div>
    </section>

    <!-- Background Orbs -->
    <div class="glow glow-1"></div>
    <div class="glow glow-2"></div>
  </div>
</template>

<style scoped>
.home-page {
  position: relative;
}

.catalog-section {
  padding: 100px 0;
  position: relative;
  z-index: 1;
}

.header {
  text-align: center;
  margin-bottom: 5rem;
}

.overline {
  color: var(--primary);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  display: block;
}

.title {
  font-size: 2.8rem;
  font-weight: 800;
  max-width: 700px;
  margin: 0 auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
}

.glow {
  position: absolute;
  filter: blur(100px);
  pointer-events: none;
  z-index: 0;
}

.glow-1 {
  top: 40%;
  left: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, var(--primary-glow), transparent 70%);
  opacity: 0.1;
}

.glow-2 {
  bottom: 10%;
  right: -5%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, var(--secondary), transparent 70%);
  opacity: 0.08;
}

@media (max-width: 768px) {
  .title {
    font-size: 2.2rem;
  }
  
  .catalog-section {
    padding: 60px 0;
  }
}
</style>
