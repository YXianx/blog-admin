import { defineStore } from 'pinia'
import router from '@/router/index'
import { mapMenuToRoutes } from '@/utils/global/map-menus'

// type
import type { IUserMenu } from '@/views/login/types'
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
    setupUserLogin() {
      const userMenus = JSON.parse(window.localStorage.getItem('userMenus')!)
      if (userMenus) {
        this.userMenus = userMenus
      }
    },
  }
})
// user store end
