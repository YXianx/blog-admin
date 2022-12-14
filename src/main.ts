import { createApp } from 'vue'
import 'normalize.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/index'
import { userStore } from '@/store/user'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

const app = createApp(App)
app.use(createPinia())

// 刷新时重新加载用户登录信息
const user = userStore()
user.setupUserLogin()

app.use(router)
app.use(mavonEditor)
app.use(ElementPlus, {
  locale: zhCn,
})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
