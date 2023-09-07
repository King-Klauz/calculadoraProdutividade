import { createRouter, createWebHistory } from 'vue-router'
import calc from '../views/calc.vue'
import Form from '../components/Form.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: calc
    }
  ]
})

export default router
