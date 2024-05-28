import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Admin from '@/views/Admin.vue'
import LoginView from '@/views/LoginView.vue'
import TestView from '@/views/TestView.vue'
import ProgramView from '@/views/Program/ProgramView.vue'
import CategoryView from '@/views/Category/CategoryView.vue'
import UserView from '@/views/User/UserView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      children: [
        {
          path: '/program',
          name: 'program',
          component: ProgramView,
        },
        {
          path: '/user',
          name: 'user',
          component: UserView,
        },
        {
          path: '/category',
          name: 'category',
          component: CategoryView,
        },
      ],
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
