<template>
  <div class="articles">
    <el-card>
      <div class="card-title">{{ mode==='create'?'发布文章':'编辑文章' }}</div>
      <div class="article-title-container">
        <el-input style="margin-right: 10px" placeholder="请输入标题" v-model="articleModel.title"></el-input>
        <el-button type="default" v-if="mode==='create'">保存草稿</el-button>
        <el-button type="primary">发布文章</el-button>
      </div>
      <div class="article-editor">
        <mavon-editor
        style="height: 100%;"
        v-model="articleModel.content"
        @change="changeEdit"
        @imgAdd="handleImgAdd"
        ></mavon-editor>
      </div>

      <el-dialog v-model="dialogVisible" title="发布文章">
        <div class="edit-container">
          <el-form>
            <el-form-item label="文章分类">
              <el-tag type="success" size="large">213</el-tag>
            </el-form-item>
            <el-form-item label="文章标签">
              <el-tag size="large">213</el-tag>
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
                action="http://182.160.0.194:8888/oss/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="置顶">
              <el-switch v-model="articleModel.isTop"></el-switch>
            </el-form-item>
            <el-form-item label="发布形式">
              <el-radio-group>
                <el-radio>公开</el-radio>
                <el-radio>私人</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { yxRequest } from '@/service';
import { useRoute } from 'vue-router'
import showMsg from '@/utils/message/message';

import type { UploadProps } from 'element-plus'

const route = useRoute()
const mode = ref("")
const dialogVisible = ref(true)
const articleId = ref(-1)
const articleModel = reactive({
  categoryId: 1,
  content: "",
  cover: "",
  id: 0,
  isTop: false,
  tagIds: [],
  title: "",
  type: 1
})

const imageUrl = ref('')
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    showMsg('error', 'Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    showMsg('error', 'Avatar picture size can not exceed 2MB!')
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
 * 发布博客
 */
const handleInsert = () => {
  yxRequest.post({
    url: '/admin/articles/insert',
    data: {
      category: 0,
      content: "first test",
      cover: "test",
      isTop: false,
      tagIds: [1, 2],
      title: "test",
      type: 0
    }
  }).then(res => {
    console.log(res)
  })
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
    articleModel.categoryId = category
    articleModel.content = content
    articleModel.cover = cover
    articleModel.id = id
    articleModel.isTop = isTop
    articleModel.tagIds = tagIds
    articleModel.title = title
    articleModel.type = type
  }
  // 发布模式
  else {
    mode.value = 'create'
  }
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
  .upload-img {
    width: 360px;
    height: 180px;
    border-radius: 6px;
  }
}
// articles end
</style>
