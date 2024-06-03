import { createRouter, createWebHistory } from 'vue-router'
import Admin from '@/views/Admin.vue'
import LoginView from '@/views/LoginView.vue'
import ProgramView from '@/views/Program/ProgramView.vue'
import CategoryView from '@/views/Category/CategoryView.vue'
import UserView from '@/views/User/UserView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
    }
  ]
})

export default router
