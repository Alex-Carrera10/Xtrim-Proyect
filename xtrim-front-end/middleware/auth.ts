export default defineNuxtRouteMiddleware((to) => {
  // Solo aplicamos la protección a rutas que empiecen con /admin
  if (to.path.startsWith('/admin')) {
    const auth = useCookie('auth_token')
    
    // Si no existe la cookie de sesión, redirigimos al login
    if (!auth.value) {
      return navigateTo('/login')
    }
  }
})
