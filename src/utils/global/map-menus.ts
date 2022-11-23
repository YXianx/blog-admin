import type { IUserMenu, IRouteFile } from '@/views/login/types'
export const mapMenuToRoutes = async (userMenus: IUserMenu[]) => {
  const routes: IRouteFile[] = []
  const allRoutes: IRouteFile[] = []

  // 1、加载全部路由表
  // webpack方式: const files = require.context('../../router/main', true, /\.ts$/)
  // vite方式: import.meta.globEager 注意不能使用.glob，只有globEager导入的才是文件模块
  const files: any = import.meta.globEager('../../router/main/**/*.ts')
  Object.keys(files).forEach((key) => {
    const route: any = files[key].default
    allRoutes.push(route)
  })

  // 2、请求用户权限路由表后比对路由
  const _recurseGetRoute = (menus: IUserMenu[]) => {
    for (const menu of menus) {
      if (!menu.children) {
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
  console.log('map-routes: ', routes)
  return routes
}
