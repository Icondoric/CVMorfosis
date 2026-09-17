import { createRouter, createWebHistory } from 'vue-router'

// Single-page editor — no sub-routes needed
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [],
})

export default router

