import { defineStore } from 'pinia'
import router from '@/router/index'
import { mapMenuToRoutes } from '@/utils/global/map-menus'
import { yxRequest } from '@/service'
import showMsg from '@/utils/message/message'

// type
import type { IUserMenu, Iaccount, IResult, IMenuResult } from '@/views/login/types'
interface IUserState {
  userMenus: IUserMenu[]
}
// type end

// user store
export const userStore = defineStore('user', {
  state: (): IUserState => {
    return {
      userMenus: []
    }
  },
  actions: {
    /**
     * 重新加载用户登录信息
     */
    setupUserLogin() {
      // 1、加载缓存中的用户权限菜单
      const userMenus = JSON.parse(window.localStorage.getItem('userMenus')!)
      if (userMenus) {
        this.userMenus = userMenus
      }

      // 2、重新渲染用户权限路由
      const routes = mapMenuToRoutes(userMenus)
      if (Array.isArray(routes)) {
        for (const route of routes) {
          router.addRoute('main', route)
        }
      }
    },

    /**
     * 用户登录 - action
     * @param account 用户登录信息
     * @returns
     */
    async accountLogin(account: Iaccount) {
      // 1、账号登录请求
      const loginResult = await yxRequest.post<IResult>({
        url: '/login',
        data: {
          username: account.userName,
          password: account.password
        }
      })
      if (loginResult.code === 2001 && loginResult.data === '登录成功') {
        showMsg('success', '管理员登录成功')
      } else { return }

      // 2、获取用户权限菜单
      const menuResult = await yxRequest.get<IMenuResult>({
        url: '/admin/menus/user'
      })
      if (menuResult.code === 2001 && menuResult.message === '操作成功') {
        const userMenu = menuResult.data
        // 2-1、存入pinia
        const user = userStore()
        user.userMenus = userMenu
        // 2-2、存入localstorage
        window.localStorage.setItem('userMenus', JSON.stringify(userMenu))
      } else {
        return
      }

      // 3、比对用户权限菜单
      const routes = mapMenuToRoutes(menuResult.data)

      // 4、动态渲染路由
      if (Array.isArray(routes)) {
        for (const route of routes) {
          router.addRoute('main', route)
        }
      }

      // 5、跳转页面
      router.push('/main/sys')
    }
  }
})
// user store end
