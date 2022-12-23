<template>
  <div class="article-list">
    <el-card>
      <div class="card-title">
        文章列表
      </div>
      <StatusMenu :tags="tags" @change-status="handleStatusChange" />
      <div class="search-control">
        <div class="left">
          <el-select style="width: 100%" placeholder="请选择文章类型" v-model="formModel.type">
            <el-option value="" label="默认">默认</el-option>
            <template #prefix>
              <el-icon><MessageBox /></el-icon>
            </template>
            <el-option label="原创" :value="1">原创</el-option>
            <el-option label="转载" :value="2">转载</el-option>
            <el-option label="翻译" :value="3">翻译</el-option>
          </el-select>

          <el-select style="width: 100%" placeholder="请选择分类" v-model="formModel.categoryId">
            <template #prefix>
              <el-icon><Menu /></el-icon>
            </template>
            <el-option value="" label="默认">默认</el-option>
            <el-option v-for="option in selectOptions.category" :key="option" :value="option.id" :label="option.categoryName">
              {{ option.categoryName }}
            </el-option>
          </el-select>

          <el-select style="width: 100%" placeholder="请选择标签" v-model="formModel.tagId">
            <template #prefix>
              <el-icon><CollectionTag /></el-icon>
            </template>
            <el-option value="" label="默认">默认</el-option>
            <el-option v-for="option in selectOptions.tags" :value="option.id" :label="option.tagName">
              {{ option.tagName }}
            </el-option>
          </el-select>

          <el-input style="width: 100%" placeholder="输入文章名" v-model="formModel.keyword">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="right">
          <el-button type="default" :icon="Refresh" @click="resetClick(formRef)">
            重置
          </el-button>
          <el-button type="primary" :icon="Search" @click="submitClick">
            搜索
          </el-button>
        </div>
      </div>

      <!-- <div class="search-control">
        <el-form ref="formRef" :model="formModel">
          <el-row :gutter="15">
            <el-col :span="5">
              <el-form-item prop="type">
                <el-select style="width: 100%" placeholder="请选择文章类型" v-model="formModel.type">
                  <el-option value="" label="默认">默认</el-option>
                  <template #prefix>
                    <el-icon><MessageBox /></el-icon>
                  </template>
                  <el-option label="原创" :value="1">原创</el-option>
                  <el-option label="转载" :value="2">转载</el-option>
                  <el-option label="翻译" :value="3">翻译</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item prop="categoryId">
                <el-select style="width: 100%" placeholder="请选择分类" v-model="formModel.categoryId">
                  <template #prefix>
                    <el-icon><Menu /></el-icon>
                  </template>
                  <el-option value="" label="默认">默认</el-option>
                  <el-option v-for="option in selectOptions.category" :key="option" :value="option.id" :label="option.categoryName">
                    {{ option.categoryName }}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item prop="tagId">
                <el-select style="width: 100%" placeholder="请选择标签" v-model="formModel.tagId">
                  <template #prefix>
                    <el-icon><CollectionTag /></el-icon>
                  </template>
                  <el-option value="" label="默认">默认</el-option>
                  <el-option v-for="option in selectOptions.tags" :value="option.id" :label="option.tagName">
                    {{ option.tagName }}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item prop="keyword">
                <el-input style="width: 100%" placeholder="输入文章名" v-model="formModel.keyword">
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button type="default" :icon="Refresh" @click="resetClick(formRef)">
                重置
              </el-button>
              <el-button type="primary" :icon="Search" @click="submitClick">
                搜索
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div> -->
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
        <el-table :data="articleList" :header-cell-style="{ 'text-align': 'center' }" :header-row-style="{ 'text-align': 'center'}">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="cover" label="文章封面" width="160">
            <template #default="scope">
              <img :src="scope.row.cover" class="table-cover" alt="">
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题"  align="center" width="110"></el-table-column>
          <el-table-column prop="categoryName" label="分类"  align="center"></el-table-column>
          <el-table-column prop="tagNames" label="标签" width="160">
            <template #default="scope">
              <div class="table-tags">
                <template v-for="tag in stringToArray(scope.row.tagNames, ',')">
                  <el-tag>
                    {{ tag }}
                  </el-tag>
                </template>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="readCount" label="浏览量" align="center"></el-table-column>
          <el-table-column prop="like" label="点赞数" align="center"></el-table-column>
          <el-table-column prop="type" label="类型">
            <template #default="scope">
              <div class="table-type">
                <el-tag :type="typeIdMapType(scope.row.type)!.type">{{ typeIdMapType(scope.row.type)!.name }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="发表时间"  align="center" width="110"></el-table-column>
          <el-table-column prop="isTop" label="置顶">
            <template #default="scope">
              <div class="table-switch">
                <el-switch
                  @change="handleSwitchChange($event)(scope.row.id)"
                  v-model="scope.row.isTop"
                  :active-value="1"
                  :inactive-value="0">
                </el-switch>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template #default="scope">
              <div class="manage">
                <el-button type="primary" size="small" @click="editClick(scope.row.id)">编辑</el-button>
                <el-popconfirm title="是否删除该篇文章?" @confirm="deleteClick(scope.row.id)">
                  <template #reference>
                    <el-button type="danger" size="small">删除</el-button>
                  </template>
                </el-popconfirm>
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
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Search, DeleteFilled, Download, MostlyCloudy, Refresh } from '@element-plus/icons-vue'
import StatusMenu  from '@/components/status-menu.vue'
import { yxRequest } from '@/service';
import { queryArticleList } from '@/service/common/article'

import type { ISelectOption, IArticleItem } from './types'
import type { tagMenuType } from '@/types/common'
import { FormInstance } from 'element-plus';
import showMsg from '@/utils/message/message';
import router from '@/router';

const formRef = ref<FormInstance>()
const currentPage = ref(1)
const pageSize = ref(5)
const totalData = ref(0)
const tags: tagMenuType[] = [
  { tagName: '全部'},
  { tagName: '公开', status: 1 },
  { tagName: '私密', status: 2 },
  { tagName: '草稿箱', status: 3 },
  { tagName: '回收站', status: 4 },
]
const articleList = ref<IArticleItem[]>([])
const selectOptions = reactive<ISelectOption>({
  category: [],
  tags: []
})
const formModel = reactive({
  type: "",
  categoryId: "",
  tagId: "",
  keyword: ''
})

// 状态标签点击事件
const handleStatusChange = async (status: number) => {
  const listPage = await yxRequest.get({
    url: '/admin/articles/listPage',
    params: {
      status: status
    }
  })
  articleList.value = listPage.data.records
}

const handleSizeChange = async (size: number) => {
  pageSize.value = size
  refreshPage()
}
const handleCurrentChange = async (page: number) => {
  currentPage.value = page
  refreshPage()
}


/**
 * 字符串转为数组
 */
const stringToArray = computed(() => {
  return (str: string, split: string = ',') => {
    // 只有单个标签时直接返回单元素数组
    if (str.indexOf(split) === -1) {
      return [str]
    }
    if (typeof str === 'string')
    return str.split(split)
  }
})

const typeIdMapType = computed(() => {
  return (id: number) => {
    switch(id) {
      case 1:
        return {
          name: '原创',
          type: 'danger'
        }
        break
      case 2:
        return {
          name: '转载',
          type: 'success'
        }
        break
      case 3:
        return {
          name: '翻译',
          type: 'warning'
        }
        break
      default:
        return {
          name: '未知',
          type: 'info'
        }
    }
  }
})

/**
 * switch change
 */
const handleSwitchChange = (status: boolean) => {
  return (id: number) => {
    yxRequest.post({
      url: '/admin/articles/update/status',
      data: {
        id: id,
        status
      }
    }).then((result) => {
      if (result.code === 2001) {
        if (status) {
          showMsg('success', '🔝 置顶成功')
        } else {
          showMsg('success', '已取消置顶')
        }
      }
    })
  }
}

/**
 * 编辑
 */
const editClick = (id: number) => {
  router.push(`/main/articles/${id}`)
}

/**
 * 删除
 */
const deleteClick = (id: number) => {
  yxRequest.delete({
    url: '/admin/articles/delete',
    data: [id]
  }).then((result) => {
    if (result.code === 2001) {
      showMsg('success', '删除成功')
    }
  })
  resetArticleList()
}

/**
 * 重置
 */
const resetClick = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl?.resetFields()
  resetArticleList(true)
}

/**
 * 搜索
 */
const submitClick = () => {
  refreshPage(true)
}

/**
 * 重置
 */
const resetArticleList = (isShowMsg: boolean = false, msg: string = '重置成功') => {
  setTimeout(() => {
    queryArticleList().then((result) => {
      articleList.value = result.data.records
      if (isShowMsg)
      showMsg('success', msg)
    })
  }, 300)
}

/**
 * 重新渲染列表
 */
const refreshPage = (isShowMsg: boolean = false) => {
  yxRequest.get({
    url: '/admin/articles/listPage',
    params: {
      ...formModel,
      current: currentPage.value,
      size: pageSize.value
    }
  }).then((result) => {
    articleList.value = result.data.records
    currentPage.value = result.data.current
    totalData.value = result.data.total
    if (isShowMsg) showMsg('success', '查询成功')
  })
}

/**
 * 页面初始化
 */
const init = async () => {
  // 1、请求分类下拉项
  const categoryResult = await yxRequest.get({
    url: '/admin/category/listPage',
    params: {
      current: 1,
      size: 100
    }
  })
  selectOptions.category = categoryResult.data.records

  // 2、请求标签下拉项
  const tagsResult = await yxRequest.get({
    url: '/admin/tags/listPage',
    params: {
      current: 1,
      size: 100
    }
  })
  selectOptions.tags = tagsResult.data.records

  // 3、请求文章列表
  const listPage = await queryArticleList(currentPage.value, pageSize.value)
  currentPage.value = listPage.data.current
  pageSize.value = listPage.data.size
  totalData.value = listPage.data.total
  articleList.value = listPage.data.records
}
init()
</script>

<style lang="less" scoped>
.article-list {
  width: 100%;
  height: 100%;

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
