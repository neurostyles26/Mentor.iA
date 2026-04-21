import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('../views/Landing.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    alias: '/auth'
  },
  {
    path: '/dashboard',
    component: () => import('../components/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: 'create',
        name: 'AIGenerator',
        component: () => import('../views/AIGenerator.vue')
      },
      {
        path: 'new-course',
        name: 'CreateCourse',
        component: () => import('../views/CreateCourse.vue')
      },
      {
        path: 'editor/:id?',
        name: 'ClassEditor',
        component: () => import('../views/ClassEditor.vue')
      },
      {
        path: 'agenda',
        name: 'Agenda',
        component: () => import('../views/Agenda.vue')
      },
      {
        path: 'history',
        name: 'ChatHistory',
        component: () => import('../views/History.vue')
      },
      {
        path: 'clipboard',
        name: 'Clipboard',
        component: () => import('../views/Clipboard.vue')
      }
    ]
  },
  {
    path: '/app',
    name: 'MainApp',
    component: () => import('../views/MainApp.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Wait if auth is not ready yet
  if (!authStore.isAuthReady) {
    // Initial wait for Supabase to resolve the session
    await authStore.initAuth()
  }

  const isAuthenticated = !!authStore.user

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if ((to.path === '/login' || to.path === '/auth') && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
