<template>
  <div class="categories">
    <el-card style="height: 100%">
      <div class="card-title">
        分类管理
      </div>
      <div class="tool-bar">
        <div class="control">
          <el-button type="primary" :icon="Plus">
            新增
          </el-button>
          <el-button type="danger" :icon="DeleteFilled" disabled>
            批量删除
          </el-button>
        </div>
        <div class="search">
          <el-input placeholder="请输入分类名">
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
          <el-button type="primary" :icon="Search">搜索</el-button>
        </div>
      </div>
      <el-table :data="categoryList" border>
        <el-table-column prop="categoryName" label="分类名" align="center"></el-table-column>
        <el-table-column prop="articleNum" label="文章数" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="140">
          <div class="control-btn">
            <el-button type="primary" size="small">编辑</el-button>
            <el-button type="danger" size="small">删除</el-button>
          </div>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination-container"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalData">
      </el-pagination>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Plus, DeleteFilled, Search } from '@element-plus/icons-vue';
import { ref } from 'vue';

import { queryCategoryPageList } from '@/service/common/article'
import type { ICategoryItem } from './types'

const currentPage = ref(1)
const pageSize = ref(5)
const totalData = ref(0)
const categoryList = ref<ICategoryItem[]>([])

const handleSizeChange = async (size: number) => {
  const categoryResult = await queryCategoryPageList(currentPage.value, size)
  categoryList.value = categoryResult.data.records
  pageSize.value = size
}
const handleCurrentChange = async (page: number) => {
  const categoryResult = await queryCategoryPageList(page, pageSize.value)
  categoryList.value = categoryResult.data.records
  currentPage.value = page
}
const init = async () => {
  // 1、请求分类项列表
  const categoryResult = await queryCategoryPageList(currentPage.value, pageSize.value)
  const { current, size, total } = categoryResult.data
  currentPage.value = current // 当前页
  totalData.value = total // 总条数
  pageSize.value = size // 页面总页数

  categoryList.value = categoryResult.data.records
}
init()
</script>

<style lang="less" scoped>
.categories {
  width: 100%;
  height: 100%;
  .tool-bar {
    display: flex;
    justify-content: space-between;
    margin: 20px 0px;
    .search {
      display: flex;
      button {
        margin-left: 15px;
      }
    }
  }
}
</style>
