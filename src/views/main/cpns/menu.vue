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
    <template v-for="(menu, index) in user.userMenus" :key="menu.name">
      <template v-if="!menu.children.length">
        <router-link :to="menu.path" custom v-slot="props">
          <el-menu-item :index="index + 1 + ''" @click="props.navigate">
            <el-icon>
              <component :is="menu.icon"></component>
            </el-icon>
            <template #title>
              {{ menu.name }}
            </template>
          </el-menu-item>
        </router-link>
      </template>
      <template v-else>
        <el-sub-menu :index="(index + 1) + ''">
          <template #title>
            <el-icon>
              <component :is="menu.icon"></component>
            </el-icon>
            <span>{{ menu.name }}</span>
          </template>
          <template  v-if="menu.children" v-for="(children, cIndex) in menu.children">
            <router-link :to="children.path" custom  v-slot="props">
              <el-menu-item :index="(index + 1) + '-' + (cIndex + 1)" @click="props.navigate">
                <template #title>
                  <el-icon>
                    <component :is="children.icon"></component>
                  </el-icon>
                  <span>{{ children.name }}</span>
                </template>
              </el-menu-item>
            </router-link>
          </template>
        </el-sub-menu>
      </template>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { userStore } from '@/store/user'

const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  }
})

const user = userStore()
</script>

<style scoped lang="less">
// reset
.el-menu-item {
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
