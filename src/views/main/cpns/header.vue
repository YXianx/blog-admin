<template>
  <div class="header">
    <div class="left-fold" @click="collapseClick">
      <el-icon size="24">
        <Fold v-if="!isCollapse"/>
        <Expand v-else/>
      </el-icon>
    </div>
    <div class="right">
      <el-avatar :size="35" src='https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'></el-avatar>
    </div>
  </div>
</template>

<script setup lang="ts">
// 注：defineProps、defineEmits在script setup顶层写法中都可以不导入直接使用
import { ref } from 'vue'
const emits = defineEmits(['changeCollapse'])

const isCollapse = ref(false)
const collapseClick = () => {
  isCollapse.value = !isCollapse.value
  emits('changeCollapse', isCollapse.value)
}
</script>

<style scoped lang="less">
// header
.header {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);

  .left-fold {
    cursor: pointer;
  }
}
// header end
</style>
