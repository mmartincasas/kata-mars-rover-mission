import { createRouter, createWebHistory } from 'vue-router'
import RoverView from '@/views/RoverView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: RoverView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router