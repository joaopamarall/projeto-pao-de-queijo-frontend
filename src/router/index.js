// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/pages/PageLogin.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/pages/PageHome.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// // Guarda de navegação global
// router.beforeEach((to, from, next) => {
//   // Se não estiver indo para login e não estiver autenticado
//   const isAuthenticated = false // Substitua por sua lógica de autenticação

//   if (to.name !== 'Login' && !isAuthenticated) {
//     next({ name: '/Login' })
//   } else {
//     next()
//   }
// })


export default router
