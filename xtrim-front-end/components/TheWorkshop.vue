<template>
  <section class="workshop-section">
    <div class="container workshop-container">
      <div class="content">
        <span class="overline">The Workshop</span>
        <h2 class="title">Honoring the Material</h2>
        
        <div class="steps">
          <div class="step">
            <span class="step-num">01</span>
            <div class="step-info">
              <h3>Sourcing</h3>
              <p>We hand-select every slab from sustainable forests, looking for the unique grain patterns that will define the piece.</p>
            </div>
          </div>
          
          <div class="step">
            <span class="step-num">02</span>
            <div class="step-info">
              <h3>Crafting</h3>
              <p>Using time-honored techniques like mortise and tenon joinery, we build structures meant to last for centuries.</p>
            </div>
          </div>
          
          <div class="step">
            <span class="step-num">03</span>
            <div class="step-info">
              <h3>Finishing</h3>
              <p>Our signature hand-rubbed oil finishes protect the wood while allowing the natural tactile sensation to shine through.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="visual">
        <div class="image-wrapper">
          <img src="/workshop-tools.png" alt="Woodworking workshop tools" class="workshop-image" />
          <div class="image-border"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.workshop-section {
  padding: 120px 0;
  background: #F3ECE2; /* Ligeramente más cálido que el crema del fondo para contraste */
  border-top: 1px solid rgba(77, 59, 46, 0.08);
  border-bottom: 1px solid rgba(77, 59, 46, 0.08);
  position: relative;
  z-index: 2;
}

.workshop-container {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 5rem;
  align-items: center;
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
  font-size: 2.6rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 3.5rem;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.step {
  display: flex;
  gap: 1.5rem;
}

.step-num {
  font-family: 'Noto Serif', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--secondary);
  opacity: 0.8;
  line-height: 1;
}

.step-info h3 {
  font-family: 'Noto Serif', serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.step-info p {
  font-family: 'Work Sans', sans-serif;
  font-size: 0.95rem;
  color: var(--foreground);
  opacity: 0.75;
  line-height: 1.6;
  max-width: 480px;
}

.image-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
}

.workshop-image {
  width: 100%;
  max-width: 450px;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 15px 35px rgba(77, 59, 46, 0.06);
  border: 1px solid rgba(77, 59, 46, 0.1);
  z-index: 2;
  position: relative;
  transition: transform 0.5s ease;
}

.workshop-image:hover {
  transform: scale(1.02);
}

.image-border {
  position: absolute;
  top: -15px;
  left: -15px;
  width: 100%;
  max-width: 450px;
  aspect-ratio: 1;
  border: 1px solid var(--secondary);
  opacity: 0.3;
  border-radius: 4px;
  z-index: 1;
  pointer-events: none;
}

@media (max-width: 968px) {
  .workshop-container {
    grid-template-columns: 1fr;
    gap: 4rem;
  }
  
  .title {
    margin-bottom: 2.5rem;
  }
  
  .workshop-image {
    max-width: 380px;
  }
  
  .image-border {
    max-width: 380px;
    top: -10px;
    left: -10px;
  }
}
</style>
