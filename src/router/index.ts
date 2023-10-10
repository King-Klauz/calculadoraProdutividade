import { createRouter, createWebHistory } from 'vue-router'
import calc from '../views/calc.vue'
import relatorio from '../views/Relatorio.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: calc
    },
    {
      path: '/about',
      name: 'about',
      component: relatorio
    } 
    
  ]
})

export default router
