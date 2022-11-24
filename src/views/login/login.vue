<template>
  <div class="login">
    <div class="login-card">
      <div class="card-title">管理员登录</div>
      <el-form ref="loginRef" :model="formModel" :rules="rules">
        <el-form-item prop="userName">
          <el-input
            v-model="formModel.userName"
            size="large"
            :prefix-icon="User"
            placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            type="password"
            show-password
            size="large"
            :prefix-icon="Lock"
            placeholder="密码"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="submitClick(loginRef)"
            style="width: 100%; margin: 20px 0;" size="large">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
// import
import { ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import router from '@/router/index'

import { yxRequest } from '@/service';
import showMsg from '@/utils/message/message'
import { userStore } from '@/store/user'
import { mapMenuToRoutes } from '@/utils/global/map-menus'

import type { FormInstance, FormRules } from 'element-plus'
import type { IResult, IMenuResult, Iaccount } from './types'

// code
const loginRef = ref<FormInstance>()
const formModel = ref<Iaccount>({
  userName: 'test',
  password: '123'
})
const rules = ref<FormRules>({
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { pattern: /[a-zA-Z0-9]{4,}$/, message: '用户名非字母或数字，又或长度不足4位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})

const submitClick = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, failds) => {
    if (valid) {
      accountLogin(formModel.value)
    } else {
      showMsg('warning', '请填写完整账号密码')
    }
  })
}

// TODO:刷新路由，路由全丢失not-found
// 登录逻辑
const accountLogin = async (account: Iaccount) => {
  // 1、账号登录
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
    // TODO:pinia state不能添加类型注解导致报错
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
</script>

<style scoped lang="less">
.login {
  width: 100%;
  height: 100%;
  position: relative;
  background: url(http://qn.xianx.top/image/home_banner.webp)center center /cover no-repeat;
  .card-title {
    font-size: 18px;
    font-weight: 700;
    color: #333;
    margin: 20px 10px;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      left: -10px;
      width: 4px;
      height: 100%;
      background-color: #409eff;
    }
  }
  .login-card {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    padding: 170px 60px 180px;
    box-sizing: border-box;
    width: 480px;
    background-color: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(25px);
    height: 100%;
  }
}
</style>
