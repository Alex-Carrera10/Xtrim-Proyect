<script setup>
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-vue-next'
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="grid">
        <div class="brand">
          <h3>Mueblería El Dorado</h3>
          <p>Muebles de madera fina y acabados artesanales para toda la vida.</p>
          <div class="social">
            <Facebook :size="20" />
            <Twitter :size="20" />
            <Instagram :size="20" />
            <Youtube :size="20" />
          </div>
        </div>
        
        <div class="links">
          <h4>Empresa</h4>
          <NuxtLink to="#">Sobre Nosotros</NuxtLink>
          <NuxtLink to="#">Artesanos</NuxtLink>
          <NuxtLink to="#">Materiales</NuxtLink>
        </div>

        <div class="links">
          <h4>Colecciones</h4>
          <NuxtLink to="#">Dormitorio</NuxtLink>
          <NuxtLink to="#">Sala de Estar</NuxtLink>
          <NuxtLink to="#">Comedor y Oficina</NuxtLink>
        </div>

        <div class="links">
          <h4>Soporte</h4>
          <NuxtLink to="#">Cuidado de la Madera</NuxtLink>
          <NuxtLink to="#">Contacto</NuxtLink>
          <NuxtLink to="#">Preguntas Frecuentes</NuxtLink>
        </div>
      </div>
      
      <div class="bottom">
        <p>
          &copy; {{ new Date().getFullYear() }} Mueblería El Dorado. Todos los derechos reservados.
          <NuxtLink to="/admin" class="secret-link">.</NuxtLink>
        </p>
        <div class="legal">
          <NuxtLink to="#">Privacidad</NuxtLink>
          <NuxtLink to="#">Términos</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #050505;
  color: #fff;
  padding: 5rem 0 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;
}

.brand h3 {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.brand p {
  opacity: 0.6;
  line-height: 1.6;
  max-width: 250px;
  margin-bottom: 2rem;
}

.social {
  display: flex;
  gap: 1.5rem;
}

.social svg {
  opacity: 0.6;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social svg:hover {
  opacity: 1;
  color: var(--primary);
  transform: translateY(-3px);
}

.links {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.links h4 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.links a {
  font-size: 0.9rem;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.links a:hover {
  opacity: 1;
  padding-left: 5px;
  color: var(--primary);
}

.bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0.4;
  font-size: 0.85rem;
}

.secret-link {
  color: transparent;
  cursor: default;
  text-decoration: none;
  user-select: none;
}

.secret-link:hover {
  color: rgba(255, 255, 255, 0.1);
}

.legal {
  display: flex;
  gap: 2rem;
}

@media (max-width: 968px) {
  .grid {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
}

@media (max-width: 568px) {
  .grid {
    grid-template-columns: 1fr;
  }
  
  .bottom {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
}
</style>
