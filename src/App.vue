<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { mainStore } from './store/main'
const store = mainStore()
</script>

<style scoped lang="less">
.app {
  width: 100%;
  height: 100vh;
}
</style>
