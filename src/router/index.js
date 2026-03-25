import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('../views/Landing.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
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
        name: 'CreateCourse',
        component: () => import('../views/CreateCourse.vue')
      },
      {
        path: 'ai-generator',
        name: 'AIGenerator',
        component: () => import('../views/AIGenerator.vue')
      },
      {
        path: 'editor',
        name: 'ClassEditor',
        component: () => import('../views/ClassEditor.vue')
      }
    ]
  },
  {
    path: '/student',
    name: 'StudentView',
    component: () => import('../views/StudentView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Helper to wait for auth
const waitForAuth = (authStore) => {
  return new Promise((resolve) => {
    if (authStore.isAuthReady) return resolve()
    const unwatch = authStore.$subscribe((_, state) => {
      if (state.isAuthReady) {
        unwatch()
        resolve()
      }
    })
  })
}

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Wait for auth to be definitively ready
  await waitForAuth(authStore)
  
  // If route requires auth and user is not logged in
  if (to.meta.requiresAuth && !authStore.user) {
    next('/login')
  } 
  // If user is logged in and tries to go to login
  else if (to.name === 'Login' && authStore.user) {
    next('/dashboard')
  }
  else {
    next()
  }
})

export default router
