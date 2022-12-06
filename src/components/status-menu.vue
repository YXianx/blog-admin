<template>
  <div class="tag-status">
    <span>状态</span>
    <template v-for="(tag, index) in tags" :key="tag.status">
      <span
        :class="currentIndex === index ? 'active' : ''"
        @click="handleTagClick(index, tag.status)"
      >{{ tag.tagName }}</span>
    </template>
    <span></span>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, PropType, ref } from 'vue'
import type { tagMenuType } from '@/types/common'
const emit = defineEmits(['changeStatus'])
const props = defineProps({
  tags: {
    type: Array as PropType<tagMenuType[]>
  }
})

const currentIndex = ref(0)
const handleTagClick = (index: number, status?: number) => {
  currentIndex.value = index
  emit('changeStatus', status)
}
</script>

<style lang="less" scoped>
// tag-status
.tag-status {
  display: flex;
  align-items: center;
  margin: 24px 0;
  span {
    color: #666;
    margin-right: 20px;
    font-size: 14px;
    cursor: pointer;
    transition: all .2s;
    &:nth-child(1) {
      padding: 1px 6px;
      font-size: 14px;
      color: #5A9CF8;
      border: 1.5px solid #8bb1e6;
      border-radius: 4px;
      cursor:auto;
    }
    &:hover {
      color: #5A9CF8;
    }
  }
  .active {
    color: #5A9CF8;
  }
}
// tag-status end
</style>
