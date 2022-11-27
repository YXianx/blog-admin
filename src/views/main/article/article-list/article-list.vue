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
        <el-form ref="formRef" :model="formModel">
          <el-row :gutter="15">
            <el-col :span="5">
              <el-form-item prop="type">
                <el-select style="width: 100%" placeholder="请选择文章类型" v-model="formModel.type">
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
                <el-tag type="danger">{{ scope.row.type }}</el-tag>
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
                <el-button type="primary" size="small">编辑</el-button>
                <el-popconfirm title="是否删除该篇文章?" @confirm="deleteClick(scope.row.id)">
                  <template #reference>
                    <el-button type="danger" size="small">删除</el-button>
                  </template>
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Search, DeleteFilled, Download, MostlyCloudy, Refresh } from '@element-plus/icons-vue'
import { yxRequest } from '@/service';

import type { ISelectOption, IArticleItem } from './types'
import { FormInstance } from 'element-plus';
import showMsg from '@/utils/message/message';

const formRef = ref<FormInstance>()
const tags = [
  { state: '状态', val: 'all' },
  { state: '全部', val: 'all' },
  { state: '公开', val: 'public' },
  { state: '私密', val: 'private' },
  { state: '草稿箱', val: 'draft' },
  { state: '回收站', val: 'other' },
]
const currentIndex = ref(1)
const articleList = ref<IArticleItem[]>([])
const selectOptions = reactive<ISelectOption>({
  category: [],
  tags: []
})
const formModel = reactive({
  type: 1,
  categoryId: 1,
  tagId: 1,
  keyword: ''
})

// 状态标签点击事件
const handleTagClick = async (index: number) => {
  currentIndex.value = index
  if (index != 1) {
    const listPage = await yxRequest.get({
      url: '/admin/articles/listPage',
      params: {
        status: index - 1
      }
    })
    articleList.value = listPage.data.records
  } else {
    const listPage = await yxRequest.get({
      url: '/admin/articles/listPage',
    })
    articleList.value = listPage.data.records
  }
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
  const listPage = await yxRequest.get({
    url: '/admin/articles/listPage',
  })
  articleList.value = listPage.data.records
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
  yxRequest.get({
    url: '/admin/articles/listPage',
    params: {
      ...formModel,
      current: 1,
      size: 100
    }
  }).then((result) => {
    articleList.value = result.data.records
  })
}

const resetArticleList = (isShowMsg: boolean = false, msg: string = '重制成功') => {
  setTimeout(() => {
    yxRequest.get({
      url: '/admin/articles/listPage',
    }).then((result) => {
      articleList.value = result.data.records
      if (isShowMsg)
        showMsg('success', msg)
    })
  }, 500)
}

init()
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
