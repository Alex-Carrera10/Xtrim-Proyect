<script setup>
if (process.client) {
  window.addEventListener('keydown', (e) => {
    // Atajo: Shift + A
    if (e.shiftKey && e.key === 'A') {
      navigateTo('/admin')
    }
  })
}
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
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
