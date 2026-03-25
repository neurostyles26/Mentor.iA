import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    component: () => import('../components/DashboardLayout.vue'),
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

export default router
