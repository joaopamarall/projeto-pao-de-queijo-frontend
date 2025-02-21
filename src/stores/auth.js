import { useAuthStore } from 'path-to-auth-store-module';

export const authGuard = (to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth/login')
    return
  }

  if (to.meta.roles && !to.meta.roles.includes(authStore.role)) {
    next('/unauthorized')
    return
  }

  next()
}
