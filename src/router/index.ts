import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/login.vue')
  },
  {
    name: 'main',
    path: '/main',
    component: () => import('@/views/main/main.vue'),
    children: [
      {
        name: 'sys',
        path: '/main/sys',
        component: () => import('@/views/main/sys/sys.vue')
      }
      // ,
      // {
      //   name: 'menus',
      //   path: '/main/menus',
      //   component: () => import('@/views/main/authorization/menus/menus.vue')
      // },
      // {
      //   name: 'roles',
      //   path: '/main/roles',
      //   component: () => import('@/views/main/authorization/roles/roles.vue')
      // }
    ]
  }
]

const router = createRouter({
  routes,
  history: createWebHistory()
})

export default router
