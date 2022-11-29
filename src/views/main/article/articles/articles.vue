<template>
  <div class="articles">
    <el-card>
      <div class="card-title">{{ mode==='create'?'发布文章':'编辑文章' }}</div>
      <div class="article-title-container">
        <el-input style="margin-right: 10px" placeholder="请输入标题" v-model="articleModel.title"></el-input>
        <el-button type="default" v-if="mode==='create'">保存草稿</el-button>
        <el-button type="primary" @click="postClick">发布文章</el-button>
      </div>
      <div class="article-editor">
        <mavon-editor
        style="height: 100%;"
        v-model="articleModel.content"
        @change="changeEdit"
        @imgAdd="handleImgAdd"
        ></mavon-editor>
      </div>

      <el-dialog
        v-model="dialogVisible"
        :title="mode === 'create' ? '发布文章' : '编辑文章'"
        width="40%"
      >
        <div class="edit-container">
          <el-form labelWidth="70px">
            <el-form-item label="文章分类">
              <el-tag
                v-show="categoryInfo.id"
                type="success"
                size="large"
                closable
                @close="removeCategory"
              >
                {{ categoryInfo.categoryName }}
              </el-tag>
              <el-popover
                placement="bottom-start"
                :width="400"
                trigger="click"
                v-if="!categoryInfo.id"
              >
                <template #reference>
                  <el-button type="success" plain>添加分类</el-button>
                </template>
                <el-autocomplete
                  v-model="categoryInfo.categoryName"
                  style="width: 100%"
                  placeholder="输入分类名搜索   tips: 按下Enter可添加自定义分类"
                  :trigger-on-focus="false"
                  :fetch-suggestions="searchCategories"
                  @select="handleCategorySelect"
                  @keyup.enter.native="saveCategory"
                >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
                <template #default="{ item }">
                  <div>{{ item.categoryName }}</div>
                </template>
                </el-autocomplete>
                <div class="popover-container">
                  <template v-for="category in categoryList" :key="category.id">
                    <div class="category-item" @click="handleItemSelect(category)">
                      {{ category.categoryName }}
                    </div>
                  </template>
                </div>
              </el-popover>
            </el-form-item>
            <el-form-item label="文章标签">
              <template v-for="tag in tagSelectList" :key="tag.id">
                <el-tag
                  style="margin-right: 10px"
                  size="large"
                  closable
                  @close="removeTag(tag)"
                >{{ tag.tagName }}</el-tag>
              </template>
              <el-popover
                v-if="tagSelectList.length < 3"
                placement="bottom-start"
                :width="400"
                trigger="click"
              >
                <template #reference>
                  <el-button type="primary" plain>添加标签</el-button>
                </template>
                <el-autocomplete
                  style="width:100%"
                  v-model="tagName"
                  placeholder="输入标签名搜索   tips: 按下Enter可添加自定义标签"
                  :trigger-on-focus="false"
                  :fetch-suggestions="searchTags"
                  @select="handleTagsSelect"
                  @keyup.enter.native="saveTag(tagName)"
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                  <template #default="{ item }">
                    <div>{{ item.tagName }}</div>
                  </template>
                </el-autocomplete>
                <div class="popover-container">
                  <div>Tags:</div>
                  <div class="tags">
                    <template v-for="tag in tagList" :key="tag.id">
                      <el-tag :class="tagClass(tag)" @click="addTag(tag)">{{ tag.tagName }}</el-tag>
                    </template>
                  </div>
                </div>
              </el-popover>
            </el-form-item>
            <el-form-item label="文章类型">
              <el-select v-model="articleModel.type">
                <el-option label="原创" :value="1">原创</el-option>
                <el-option label="转载" :value="2">转载</el-option>
                <el-option label="翻译" :value="3">翻译</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上传封面">
              <el-upload
                class="avatar-uploader"
                action="/api/oss/upload"
                drag
                multiple
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
              <img
                v-if="articleModel.cover"
                :src="articleModel.cover"
                style="width:100%; height: 200px"
                class="avatar"
              />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="置顶">
              <el-switch v-model="articleModel.isTop"></el-switch>
            </el-form-item>
            <el-form-item label="发布形式">
              <el-radio-group v-model="articleModel.status">
                <el-radio :label="1">公开</el-radio>
                <el-radio :label="2">私密</el-radio>
              </el-radio-group>
            </el-form-item>
              <div class="control-btns">
                <el-button size="large" @click="cancelClick">取消</el-button>
                <el-button type="primary" size="large" @click="postArticleClick">发表</el-button>
              </div>
          </el-form>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// TODO:添加类型的搜索推荐框暂未实现
import { ref, reactive, computed } from 'vue'
import { yxRequest } from '@/service';
import { useRoute } from 'vue-router'
import showMsg from '@/utils/message/message';
import { queryCategoryById, insertUserTags } from '@/service/common/article'

import type { UploadProps } from 'element-plus'
import type { IArticleModel, ICategoryItem, ITagItem } from './types'

const route = useRoute()
const mode = ref("")
const dialogVisible = ref(true)
const articleId = ref(-1)
const categoryInfo = reactive({id: 0, categoryName: ''})
const tagName = ref('')
const tagSelectList = ref<ITagItem[]>([])
const categoryList = ref<ICategoryItem[]>([])
const tagList = ref<ITagItem[]>([])
const articleModel = reactive<IArticleModel>({
  status: 1,
  category: categoryInfo.id,
  content: "",
  cover: "",
  id: 0,
  isTop: false,
  tagIds: [],
  title: "",
  type: 1
})

// 上传成功事件
// 返回文件接口Response数据
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  articleModel.cover = response.data
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    showMsg('error', 'Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 1) {
    showMsg('error', '图片文件大小超过1MB!')
    return false
  }
  return true
}

const changeEdit = (render: string) => {
  console.log(render)
}

/**
 * 添加图片
 */
const handleImgAdd = () => {
}

/**
 * 添加分类
 */
const addCategory = (item: ICategoryItem) => {
  categoryInfo.categoryName = item.categoryName
  categoryInfo.id = item.id
}

/**
 * 删除分类
 */
const removeCategory = () => {
  categoryInfo.categoryName = ''
  categoryInfo.id = 0
  articleModel.category = categoryInfo.id
}

/**
 * 添加标签
 * @param item 标签项
 */
const addTag = (item: ITagItem) => {
  if (tagSelectList.value.find(((tag) => tag.tagName === item.tagName))) return
  tagSelectList.value.push(item)
  articleModel.tagIds.push(item.id)
}

/**
 * 删除标签
 * @param item 标签项
 */
const removeTag = (item: ITagItem) => {
  const index = tagSelectList.value.indexOf(item)
  tagSelectList.value.splice(index, 1)  // 选中的标签集合
  articleModel.tagIds.splice(index, 1)  // 选中标签的id集合
}

/**
 * 分类搜索框搜索事件
 * @param keyword 关键词
 * @param callback 回调函数
 */
const searchCategories = (keyword: string, callback: (arg: any) => void) => {
  yxRequest.get({
    url: '/admin/category/listPage',
    params: {
      keyword,
      current: 1,
      size: 100
    }
  }).then((result) => {
    callback(result.data.records)
  })
}

/**
 * 标签搜索框搜索事件
 * @param keyword 关键词
 * @param callback 回调函数
 */
const searchTags = (keyword: string, callback: (arg: any) => void) => {
  yxRequest.get({
    url: '/admin/tags/listPage',
    params: {
      keyword,
      current: 1,
      size: 100
    }
  }).then((result) => {
    callback(result.data.records)
  })
}

/**
 * enter添加自定义分类
 */
const saveCategory = () => {
  console.log('enter');
}
/**
 * enter添加自定义标签
 * @param tagName 标签名
 */
const saveTag = (tagName: string) => {
  if(!tagName) {
    showMsg('error', '自定义的标签名为空')
    return
  }

  const tagItem = tagList.value.find((item) => item.tagName === tagName)
  if (!tagItem) {
    // insertUserTags(tagName)
    //   .then((result) => {
    //     showMsg('success', '添加标签成功')
    //     console.log(result);
    //   })
  } else {
    const index = tagSelectList.value.indexOf(tagItem)
    if (index === -1) {
      tagSelectList.value.push(tagItem)
    } else {
      showMsg('warning', '已包含该标签')
    }
  }
}

/**
 * 搜索框搜索项选择事件
 * @param item 分类项
 */
const handleCategorySelect = (item: ICategoryItem) => {
  addCategory(item)
}
const handleTagsSelect = (item: ITagItem) => {
  addTag(item)
}

/**
 * 分类列表点击事件(非搜索的列表)
 * @param item 分类项
 */
const handleItemSelect = (item: ICategoryItem) => {
  addCategory(item)
  articleModel.category = item.id
}

const tagClass = computed(() => {
  return (item: ITagItem) => {
    const findTag = tagSelectList.value.find((tag) => tag.tagName === item.tagName)
    return findTag != null ? 'tag-item-select' : 'tag-item'
  }
})

/**
 * 确认发布博客
 */
const postArticleClick = () => {
  if (articleModel.category === 0) {
    showMsg('error', '未选择文章分类')
    return
  }
  if (articleModel.tagIds.length <= 0) {
    showMsg('error', '请至少选择一个标签')
    return
  }
  console.log(articleModel);
}

/**
 * 发布
 */
const postClick = () => {
  dialogVisible.value = true
}

/**
 * 取消发布
 */
const cancelClick = () => {
  dialogVisible.value = false
}

/**
 * 页面初始化
 */
const init = async () => {
  // 编辑模式
  if (route.params['id']) {
    articleId.value = parseInt(route.params.id as string)
    mode.value = 'update'

    // 1、请求文章详情
    const detailResult = await yxRequest.get({
      url: `/admin/articles/detail/${articleId.value}`
    })
    const { category, content, cover, id, isTop, tagIds, title, type } = detailResult.data
    console.log(detailResult.data, id);

    // 2、根据分类id查询分类详情
    const categoryDetail = await queryCategoryById(category.id)
    // 3、加载标签
    for (const tag of tagIds) {
      tagSelectList.value.push(tag)
    }

    categoryInfo.id = id
    categoryInfo.categoryName = categoryDetail.data.categoryName

    articleModel.id = id
    articleModel.category = category.id
    articleModel.content = content
    articleModel.cover = cover
    articleModel.isTop = isTop
    articleModel.title = title
    articleModel.type = type
    for (const tag of tagIds) {
      articleModel.tagIds.push(tag.id)
    }
  }
  // 发布模式
  else {
    mode.value = 'create'
  }

  // common
  // 1、请求分类列表
  yxRequest.get({
    url: '/admin/category/listPage',
    params: {
      current: 1,
      size: 100
    }
  }).then((result) => {
    categoryList.value = result.data.records
  })
  // 2、请求标签列表
  yxRequest.get({
    url: '/admin/tags/listPage',
    params: {
      current: 1,
      size: 100
    }
  }).then((result) => {
    tagList.value = result.data.records
  })
}

init()
</script>

<style lang="less" scoped>
// articles
.articles {
  width: 100%;
  height: 100%;
  .article-title-container {
    display: flex;
    margin: 20px 0 30px 0;
  }
  .article-editor {
    height: calc(100vh - 260px);
  }
}
// articles end

// dialog
.edit-container {
  padding: 0px 20px;
}
.avatar-uploader {
  width: 250px;
  // height: 180px;
  .avatar {
    display: block;
  }
}
.control-btns {
  display: flex;
  justify-content: flex-end;
}

// category
.popover-container {
  margin-top: 20px;
  height: 260px;
  overflow: auto;
  .category-item {
    padding: 0.6rem 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: .1s all;
    &:hover {
      background-color: #F2F9EB;
      color: #7EC150;
    }
  }
}
// category end

// tag
.tags {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.tag-item-select {
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: not-allowed;
  color: #ccccd8 !important;
}
.tag-item {
  margin-right: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
}
// tag end
// dialog end
</style>
