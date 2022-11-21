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
      <div class="search-control">
        <el-form>
          <el-row :gutter="15">
            <el-col :span="5">
              <el-select style="width: 100%" placeholder="请选择文章类型">
                <template #prefix>
                  <el-icon><MessageBox /></el-icon>
                </template>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-select style="width: 100%" placeholder="请选择分类">
                <template #prefix>
                  <el-icon><Menu /></el-icon>
                </template>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-select style="width: 100%" placeholder="请选择标签">
                <template #prefix>
                  <el-icon><CollectionTag /></el-icon>
                </template>
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-input style="width: 100%" placeholder="输入文章名">
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" :icon="Search">
                搜索
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="article-table">
        <div class="article-control">
          <el-button type="primary" :icon="MostlyCloudy" plain>
            批量导入
          </el-button>
          <el-button type="danger" :icon="DeleteFilled" plain disabled>
            批量删除
          </el-button>
          <el-button type="success" :icon="Download" plain disabled>
            批量导出
          </el-button>
        </div>
        <el-table :data="articles" :header-cell-style="{ 'text-align': 'center' }" :header-row-style="{ 'text-align': 'center'}">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="cover" label="文章封面" width="160">
            <template #default="scope">
              <img :src="scope.row.cover" class="table-cover" alt="">
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题"  align="center" width="110"></el-table-column>
          <el-table-column prop="category" label="分类"  align="center"></el-table-column>
          <el-table-column prop="tag" label="标签" width="160">
            <template #default="scope">
              <div class="table-tags">
                <template v-for="tag in scope.row.tag">
                  <el-tag>
                    {{ tag.name }}
                  </el-tag>
                </template>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="visitor" label="浏览量" align="center"></el-table-column>
          <el-table-column prop="like" label="点赞数" align="center"></el-table-column>
          <el-table-column prop="type" label="类型">
            <template #default="scope">
              <div class="table-type">
                <el-tag type="danger">{{ scope.row.type.name }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="发表时间"  align="center" width="110"></el-table-column>
          <el-table-column prop="isTop" label="置顶">
            <template #default="scope">
              <div class="table-switch">
                <el-switch v-model="scope.row.isTop"></el-switch>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <div class="manage">
              <el-button type="primary" size="small">编辑</el-button>
              <el-button type="danger" size="small">删除</el-button>
            </div>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, DeleteFilled, Download, MostlyCloudy } from '@element-plus/icons-vue'

const tags = [
  { state: '状态', val: 'all' },
  { state: '全部', val: 'all' },
  { state: '公开', val: 'public' },
  { state: '私密', val: 'private' },
  { state: '草稿箱', val: 'draft' },
  { state: '回收站', val: 'other' },
]
const articles = [
  {
    id: 1,
    cover: 'https://static.talkxj.com/articles/3dffb2fcbd541886616ab54c92570de3.jpg',
    title: '研究院的日常',
    category: '日常分享',
    tag: [
      { id: 1, name: '感悟' },
      { id: 2, name: '生活' },
    ],
    visitor: 2511,
    like: 6,
    type: { id: 1, name: '原创' },
    createTime: '2022-11-18',
    isTop: true
  },
  {
    id: 2,
    cover: 'https://static.talkxj.com/articles/3dffb2fcbd541886616ab54c92570de3.jpg',
    title: '研究院的日常',
    category: '日常分享',
    tag: [
      { id: 1, name: '感悟' },
      { id: 2, name: '生活' },
    ],
    visitor: 2511,
    like: 6,
    type: { id: 1, name: '原创' },
    createTime: '2022-11-18',
    isTop: true
  },
  {
    id: 3,
    cover: 'https://static.talkxj.com/articles/3dffb2fcbd541886616ab54c92570de3.jpg',
    title: '研究院的日常',
    category: '日常分享',
    tag: [
      { id: 1, name: '感悟' },
      { id: 2, name: '生活' },
    ],
    visitor: 2511,
    like: 6,
    type: { id: 1, name: '原创' },
    createTime: '2022-11-18',
    isTop: true
  },
  {
    id: 3,
    cover: 'https://static.talkxj.com/articles/3dffb2fcbd541886616ab54c92570de3.jpg',
    title: '研究院的日常',
    category: '日常分享',
    tag: [
      { id: 1, name: '感悟' },
      { id: 2, name: '生活' },
    ],
    visitor: 2511,
    like: 6,
    type: { id: 1, name: '原创' },
    createTime: '2022-11-18',
    isTop: true
  }
]

const currentIndex = ref(1)
const handleTagClick = (index: number) => {
  currentIndex.value = index
}
</script>

<style lang="less" scoped>
.article-list {
  width: 100%;
  height: 100%;
  // tag-status
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
  // tag-status end

  .article-table {
    .article-control {
      margin: 40px 0px 20px 0px;
    }
    .table-cover {
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
    .table-tags {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      * {
        margin: 5px;
      }
    }
    .table-type {
      display: flex;
      justify-content: center;
    }
    .table-switch {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
