<script setup>
// Eliminado el atajo global de teclado Shift+A para evitar redirecciones al escribir nombres con A mayúscula.
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AppToast />
  </div>
</template>

<style>
/* Global transitions or styles can also go here if not in main.css */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
