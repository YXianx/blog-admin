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
    // TODO:之后换成动态路由
    children: [
      {
        name: 'sys',
        path: '/main/sys',
        component: () => import('@/views/main/sys/sys.vue')
      }
    ]
  }
]

const router = createRouter({
  routes,
  history: createWebHistory()
})

export default router
