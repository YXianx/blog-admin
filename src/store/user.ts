import { defineStore } from 'pinia'

export const userStore = defineStore('user', {
  state: () => {
    return {
      userMenus: [
        {
          children: [
            {
              children: [
                {}
              ],
              component: "",
              createTime: "",
              hidden: true,
              icon: "",
              name: "",
              orderNum: 0,
              path: ""
            }
          ],
          component: "",
          createTime: "",
          hidden: true,
          icon: "",
          name: "",
          orderNum: 0,
          path: ""
        }
      ]
    }
  },
  actions: {
    setupUserInfo() {
      const userMenus = JSON.parse(window.localStorage.getItem('userMenus')!)
      if (userMenus) {
        this.userMenus = userMenus
      }
    }
  }
})
