import type { RouteRecordRaw } from 'vue-router'
import type { IUserMenu } from '@/views/login/types'

/**
 * 动态渲染用户权限菜单
 * @param userMenus 用户权限路由
 * @returns 用户路由列表
 */
export const mapMenuToRoutes = (userMenus: any[]): RouteRecordRaw[] => {
  const routes: RouteRecordRaw[] = []
  const allRoutes: RouteRecordRaw[] = []

  // 1、加载全部路由表
  // webpack方式: const files = require.context('../../router/main', true, /\.ts$/)
  // vite方式: import.meta.globEager 注意不能使用.glob，只有globEager导入的才是文件模块
  const files: any = import.meta.globEager('../../router/main/**/*.ts')
  Object.keys(files).forEach((key) => {
    const route: any = files[key].default
    allRoutes.push(route)
  })
  // console.log(allRoutes)


  // 2、请求用户权限路由表后比对路由
  const _recurseGetRoute = (menus: IUserMenu[]) => {
    for (const menu of menus) {
      if (!menu.children.length) {
        const route: any = allRoutes.find((item) => menu.path === item.path)
        if (route) {
          routes.push(route)
        }
      } else {
        _recurseGetRoute(menu.children)
      }
    }
  }

  _recurseGetRoute(userMenus)
  return routes
}

/**
 * 当前路由匹配菜单Index
 * @param userMenus 用户权限路由
 * @param currentPath 当前路由
 * @returns 菜单项Index
 */
export function pathMapToMenu (userMenus: IUserMenu[], currentPath: string): string | undefined {
  for (let i = 0; i < userMenus.length; i++) {
    const menu = userMenus[i]
    if (menu.children.length) {
      const findMenuIndex = pathMapToMenu(menu.children, currentPath)
      if (findMenuIndex) {
        return (i + 1) + '-' + (findMenuIndex) // menu.vue 渲染的菜单项index从1开始 所以此处的i需要+1才能对应上
      }
    } else {
      if (menu.path === currentPath) {
        return (i + 1) + ''
      }
    }
  }
}
