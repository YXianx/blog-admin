<template>
  <div class="article-list">
    <el-card>
      <div class="card-title">
        文章列表
      </div>
      <div class="tag-status">
        <template v-for="(tag, index) in tags" :key="tag.val">
          <span
            :class="currentIndex === index ? 'active' : ''"
            @click="index != 0 ? handleTagClick(index) : ''"
          >{{ tag.state }}</span>
        </template>
        <span></span>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tags = [
  { state: '全部', val: 'all' },
  { state: '公开', val: 'public' },
  { state: '私密', val: 'private' },
  { state: '草稿箱', val: 'draft' },
  { state: '回收站', val: 'other' },
]

const currentIndex = ref(-1)
const handleTagClick = (index: number) => {
  currentIndex.value = index
}
</script>

<style lang="less" scoped>
.article-list {
  width: 100%;
  height: 100%;
  .tag-status {
    display: flex;
    align-items: center;
    margin: 24px 0;
    span {
      margin-right: 20px;
      font-size: 14px;
      cursor: pointer;
      transition: color .2s;
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
}
</style>
