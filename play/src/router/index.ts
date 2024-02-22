import { createRouter as createAppRouter, createWebHistory } from 'vue-router'

export const routes = [
  {
    path: '/',
    name: '/',
    redirect: '/map'
  },
  {
    path: '/map',
    name: 'map',
    component: () => import('@/views/map.vue')
  },
  {
    path: '/drawings',
    name: 'drawings',
    component: () => import('@/views/drawings.vue')
  },
  {
    path: '/measurements',
    name: 'measurements',
    component: () => import('@/views/measurements.vue')
  },
  {
    path: '/drawing-plus',
    name: 'drawing-plus',
    component: () => import('@/views/drawing-plus.vue')
  },
  {
    path: '/material',
    name: 'material',
    component: () => import('@/views/material.vue')
  }
]

const router = createAppRouter({
  history: createWebHistory(),
  routes
})

export default router
