<template>
  <div class="categories">
    <el-card :style="{height: pageSize > 10 ? 'auto' : '100%'}">
      <div class="card-title">
        分类管理
      </div>
      <div class="tool-bar">
        <div class="control">
          <el-button type="primary" :icon="Plus" @click="addClick">
            新增
          </el-button>
          <el-button type="danger" :icon="DeleteFilled" disabled>
            批量删除
          </el-button>
        </div>
        <div class="search">
          <el-input placeholder="请输入分类名" v-model="searchName">
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
          <el-button :icon="Refresh" @click="resetClick">重置</el-button>
          <el-button type="primary" :icon="Search" @click="searchClick">搜索</el-button>
        </div>
      </div>
      <el-table :data="categoryList" border>
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="categoryName" label="分类名" align="center"></el-table-column>
        <el-table-column prop="articleNum" label="文章数" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="140">
          <template #default="scope">
            <div class="control-btn">
              <el-button type="primary" size="small" @click="editClick(scope.row.id)">编辑</el-button>
              <el-button type="danger" size="small">删除</el-button>
            </div>
          </template>
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
      <el-dialog
        v-model="dialogVisible"
        :title="mode === 'insert' ? '新增分类' : '编辑分类'"
        width="30%"
      >
        <el-form>
          <div class="category-form">
            <el-form-item label="分类名">
              <el-input v-model="categoryName"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="control-btns">
          <el-button size="large" @click="cancelClick">取消</el-button>
          <el-button type="primary" size="large" @click="saveClick">{{ mode === 'insert' ? '确定' : '编辑' }}</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Plus, DeleteFilled, Search, Refresh } from '@element-plus/icons-vue';
import { ref } from 'vue';

import { queryCategoryPageList, insertCategory, queryCategoryById, updateCategory } from '@/service/common/article'
import type { ICategoryItem } from './types'
import showMsg from '@/utils/message/message';

const currentPage = ref(1) // 当前页
const pageSize = ref(5) // 单页显示条数
const totalData = ref(0) // 总条数
const categoryList = ref<ICategoryItem[]>([])
const dialogVisible = ref(true)
const mode = ref('insert')
const row = ref<ICategoryItem>()
const searchName = ref('')
const categoryName = ref('')

/**
 * 更改显示条目数回调
 * @param size 显示条目数
 */
const handleSizeChange = async (size: number) => {
  const categoryResult = await queryCategoryPageList(currentPage.value, size)
  categoryList.value = categoryResult.data.records
  pageSize.value = size
}
/**
 * 更改页码回调
 * @param page 当前选择的页码
 */
const handleCurrentChange = async (page: number) => {
  const categoryResult = await queryCategoryPageList(page, pageSize.value)
  categoryList.value = categoryResult.data.records
  currentPage.value = page
}
/**
 * 重置按钮
 */
const resetClick = () => {
  searchName.value = ''
  searchClick()
}
/**
 * 查询按钮
 */
const searchClick = () => {
  queryCategoryPageList(currentPage.value, pageSize.value, searchName.value != '' ? searchName.value : '')
    .then((result) => {
      if (result.code === 2001) {
        const { current, size, total, records } = result.data
        categoryList.value = records
        currentPage.value = current
        totalData.value = total
        pageSize.value = size
        showMsg('success', '查询成功')
      }
    })
}
/**
 * 增加按钮
 */
const addClick = () => {
  mode.value = 'insert'
  dialogVisible.value = true
}
/**
 * 取消按钮
 */
const cancelClick = () => {
  dialogVisible.value = false
}
/**
 * 确定按钮
 */
const saveClick = async (id: number) => {
  if(!categoryName.value) {
    showMsg('warning', '分类名为空')
    return
  }
  if (mode.value === 'insert') {
    const insertResult = await insertCategory(categoryName.value)
    if (insertResult.code === 2001) {
      dialogVisible.value = false
      categoryName.value = ''
      showMsg('success', '新增成功')
    } else {
      showMsg('error', '新增出现问题...')
    }
  } else {
    if (row.value) {
      const updateResult = await updateCategory(row.value.id, categoryName.value)
      if (updateResult.code === 2001) {
        refreshPage()
        dialogVisible.value = false
        categoryName.value = ''
        showMsg('success', '编辑成功')
      } else {
        showMsg('error', '新增出现问题...')
      }
    }
  }
}
/**
 * 编辑按钮
 */
const editClick = async (id: number) => {
  mode.value = 'edit'
  dialogVisible.value = true
  const detailResult = await queryCategoryById(id)
  row.value = detailResult.data
  categoryName.value = detailResult.data.categoryName
}
/**
 * 页面初始化
 */
const refreshPage = async () => {
  // 1、请求分类项列表
  const categoryResult = await queryCategoryPageList(currentPage.value, pageSize.value)
  const { current, size, total } = categoryResult.data
  currentPage.value = current
  totalData.value = total
  pageSize.value = size

  categoryList.value = categoryResult.data.records
}
refreshPage()
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
  .category-form {
    padding: 10px 20px;
  }
}
</style>
