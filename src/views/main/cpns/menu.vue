<template>
  <el-menu
    background-color="#051628"
    text-color="#C1C4CB"
    active-text-color="#fff"
    active-background-color="red"
    :collapse="isCollapse"
    :collapse-transition = "false"
  >
    <div class="header-icon">
      <img src="/vite.svg" alt="" srcset="">
    </div>
    <el-sub-menu index="1">
      <template #title>
        <el-icon><Document/></el-icon>
        <span>文章管理</span>
      </template>
      <el-menu-item index="1-1">item1</el-menu-item>
      <el-menu-item index="1-2">item2</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>
        <el-icon><Paperclip/></el-icon>
        <span>消息管理</span>
      </template>
      <el-menu-item index="2-1">item1</el-menu-item>
      <el-menu-item index="2-2">item2</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <el-icon><CreditCard/></el-icon>
        <span>权限管理</span>
      </template>
      <el-menu-item index="3-1">item1</el-menu-item>
      <el-menu-item index="3-2">item2</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
import { Document, Paperclip, CreditCard } from '@element-plus/icons-vue'

const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang="less">
// reset
.el-menu-item {
  background-color: #102132;
  &:hover {
    background-color: #2A5FB6;
  }
}
.el-menu-item.is-active {
    background-color: #2A5FB6;
}
// reset end
.header-icon {
  display: flex;
  align-items: center;
  // justify-content: space-between;
  position: relative;
  height: 60px;
  padding: 0 10px;
  img {
    position: absolute;
    left: 0;
    right: 0;
    display: block;
    width: 100%;
    height: 30px;
  }
  span {
    white-space: nowrap;
    margin-right: 20px;
  }
}
</style>
