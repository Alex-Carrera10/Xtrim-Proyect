<script setup>
// No extra logic needed for the hero section yet
</script>

<template>
  <section class="hero">
    <div class="background-glow"></div>
    <div class="container hero-container">
      <div class="content">
        <span class="badge">Nueva Generación Fiber</span>
        <h1 class="title">
          Experimenta la <span class="gradient-text">Velocidad</span> Real
        </h1>
        <p class="description">
          Conéctate al futuro con la red de fibra óptica más estable del país. 
          Smart living, sin interrupciones.
        </p>
        <div class="cta">
          <button class="button-premium">Contratar Ahora</button>
          <button class="secondary-btn">Ver Planes</button>
        </div>
      </div>
      
      <div class="visual">
        <div class="image-placeholder">
          <div class="inner-glow"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 120px 0 60px;
}

.background-glow {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 60%;
  height: 80%;
  background: radial-gradient(circle, var(--secondary), transparent 70%);
  opacity: 0.15;
  filter: blur(100px);
  z-index: -1;
}

.hero-container {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 4rem;
  align-items: center;
}

.badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 50px;
  background: rgba(0, 242, 255, 0.1);
  border: 1px solid rgba(0, 242, 255, 0.2);
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.title {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.description {
  font-size: 1.15rem;
  opacity: 0.7;
  max-width: 500px;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.cta {
  display: flex;
  gap: 1.5rem;
}

.secondary-btn {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.4);
}

.image-placeholder {
  width: 100%;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.inner-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  background: radial-gradient(circle, var(--primary), transparent 60%);
  opacity: 0.1;
  filter: blur(50px);
}

@media (max-width: 968px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .description {
    margin: 0 auto 2.5rem;
  }
  
  .cta {
    justify-content: center;
  }
  
  .title {
    font-size: 3rem;
  }
}
</style>
