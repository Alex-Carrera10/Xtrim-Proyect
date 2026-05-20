<script setup>
// No extra logic needed for the hero section
</script>

<template>
  <section class="hero">
    <div class="background-glow"></div>
    <div class="container hero-container">
      <div class="content">
        <span class="badge">The Artisan's Atelier</span>
        <h1 class="title">
          Heirloom Quality,<br />
          <span class="serif-bold">Handcrafted for Life.</span>
        </h1>
        <p class="description">
          Bespoke furniture that honors the natural narrative of the wood. 
          Every joint, every grain, and every finish is executed with master precision.
        </p>
        <div class="cta">
          <button class="button-premium">View Collections</button>
          <button class="secondary-btn">Commission a Piece</button>
        </div>
      </div>
      
      <div class="visual">
        <div class="image-container">
          <img src="/hero-woodworking.png" alt="Wood planing manual craftmanship" class="hero-image" />
          <div class="image-shadow"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 85vh;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 140px 0 80px;
  background: var(--background);
}

.background-glow {
  position: absolute;
  top: -10%;
  right: -5%;
  width: 50%;
  height: 70%;
  background: radial-gradient(circle, rgba(194, 153, 107, 0.12), transparent 70%);
  opacity: 0.8;
  filter: blur(80px);
  z-index: -1;
}

.hero-container {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 4rem;
  align-items: center;
  width: 100%;
}

.badge {
  display: inline-block;
  padding: 0.4rem 1.2rem;
  border-radius: 50px;
  background: rgba(77, 59, 46, 0.05);
  border: 1px solid rgba(77, 59, 46, 0.1);
  color: var(--primary);
  font-family: 'Work Sans', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 1.8rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.title {
  font-family: 'Noto Serif', serif;
  font-size: 3.6rem;
  font-weight: 400;
  line-height: 1.15;
  margin-bottom: 1.8rem;
  color: var(--primary);
}

.serif-bold {
  font-weight: 700;
}

.description {
  font-family: 'Work Sans', sans-serif;
  font-size: 1.05rem;
  color: var(--foreground);
  opacity: 0.8;
  max-width: 500px;
  line-height: 1.7;
  margin-bottom: 2.5rem;
}

.cta {
  display: flex;
  gap: 1.5rem;
}

.button-premium {
  background: #f3ece2;
  color: var(--primary);
  border: 1px solid var(--primary);
  box-shadow: 0 4px 10px rgba(77, 59, 46, 0.08);
}

.button-premium:hover {
  background: var(--primary);
  color: #f3ece2;
  border-color: var(--primary);
  box-shadow: 0 6px 15px rgba(77, 59, 46, 0.15);
}


.secondary-btn {
  background: none;
  border: 1px solid var(--primary);
  color: var(--primary);
  padding: 0.8rem 1.8rem;
  border-radius: 4px;
  font-family: 'Work Sans', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-btn:hover {
  background: rgba(77, 59, 46, 0.04);
  border-color: #3C2E24;
}

.image-container {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
}

.hero-image {
  width: 100%;
  max-width: 480px;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 20px 40px rgba(77, 59, 46, 0.08);
  border: 1px solid rgba(77, 59, 46, 0.1);
  position: relative;
  z-index: 2;
  transition: transform 0.5s ease;
}

.hero-image:hover {
  transform: scale(1.02);
}

.image-shadow {
  position: absolute;
  bottom: -15px;
  right: -15px;
  width: 100%;
  max-width: 480px;
  aspect-ratio: 1;
  background: var(--secondary);
  opacity: 0.15;
  border-radius: 4px;
  z-index: 1;
  pointer-events: none;
}

@media (max-width: 968px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 3rem;
  }
  
  .description {
    margin: 0 auto 2.5rem;
  }
  
  .cta {
    justify-content: center;
  }
  
  .title {
    font-size: 2.8rem;
  }
  
  .hero-image {
    max-width: 400px;
  }
  
  .image-shadow {
    max-width: 400px;
    bottom: -10px;
    right: -10px;
  }
}
</style>
