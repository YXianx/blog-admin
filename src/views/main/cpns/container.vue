<template>
  <div class="container">
    <router-view v-slot="{ Component }">
      <transition name="route" appear mode="out-in">
        <component :is="Component"></component>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="less">
.route-enter-from,
.route-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateX(0px);
}
.route-enter-active,
.route-leave-active {
  transition:  all .4s;
}
</style>
