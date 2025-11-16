import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/missions',
      name: 'missions',
      component: () => import('@/views/MissionsView.vue'),
    },
    {
      path: '/missions/:id',
      name: 'mission-details',
      component: () => import('@/views/MissionDetailsView.vue'),
    },
    {
      path: '/professionnels',
      name: 'professionals',
      component: () => import('@/views/ProfessionalsView.vue'),
    },
    {
      path: '/professionnels/:id',
      name: 'professional-details',
      component: () => import('@/views/ProfessionalDetailsView.vue'),
    },
    {
      path: '/dashboard/bakery',
      name: 'dashboard-bakery',
      component: () => import('@/views/DashboardBakeryView.vue'),
    },
    {
      path: '/dashboard/professional',
      name: 'dashboard-professional',
      component: () => import('@/views/DashboardProfessionalView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
    },
    {
      path: '/admin/bakery/:id',
      name: 'admin-bakery-details',
      component: () => import('@/views/AdminBakeryDetailsView.vue'),
    },
    {
      path: '/admin/professional/:id',
      name: 'admin-professional-details',
      component: () => import('@/views/AdminProfessionalDetailsView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/pourquoi-choukette',
      name: 'why-choukette',
      component: () => import('@/views/WhyChouketteView.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('@/views/BlogView.vue'),
    },
    {
      path: '/blog/:id',
      name: 'blog-detail',
      component: () => import('@/views/BlogDetailView.vue'),
    },
  ],
})

export default router
