<template>
  <div class="main">
    <el-container style="height: 100%">
      <el-aside :width="isCollapse ? '64px' : '202px'" style="background: #091627" class="main-aside">
        <Menu :isCollapse="isCollapse" />
      </el-aside>
      <el-container>
        <el-header>
          <Header @change-collapse="handleCollapse" />
        </el-header>
        <el-main>
          <Container />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Menu from './cpns/menu.vue'
import Header from './cpns/header.vue'
import Container from './cpns/container.vue'
import { userStore } from '@/store/user'

const isCollapse = ref(false)

const handleCollapse = (result: boolean) => {
  isCollapse.value = result
}

// 重新加载用户缓存到pinia
const user = userStore()
user.setupUserLogin()
</script>

<style scoped lang="less">
// reset
.el-menu {
  border: none;
}
.el-header {
  padding: 0 !important;
}
// reset end

.main {
  width: 100%;
  height: 100%;

  .main-aside {
    transition: width 0.2s linear;
    -webkit-transition: width 0.15s;
    -moz-transition: width 0.15s;
    -webkit-transition: width 0.15s;
    -o-transition: width 0.15s;
  }
}
</style>
