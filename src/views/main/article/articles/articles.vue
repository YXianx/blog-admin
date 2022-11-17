<template>
  <div class="articles">
    <el-card>
      <div class="card-title">发布文章</div>
      <div class="article-title-container">
        <el-input style="margin-right: 10px" placeholder="请输入标题"></el-input>
        <el-button type="default">保存草稿</el-button>
        <el-button type="primary">发布文章</el-button>
      </div>
      <div class="article-editor">
        <mavon-editor
        style="height: 100%;"
        v-model="articleVal"
        @change="changeEdit"
        @imgAdd="handleImgAdd"
        ></mavon-editor>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { yxRequest } from '@/service';

const articleVal = ref()
const changeEdit = (render: string) => {
  console.log(render)
}
const handleImgAdd = () => {

}
const handleInsert = () => {
  yxRequest.post({
    url: '/admin/articles/insert',
    data: {
      categoryId: 0,
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
const handleSelect = () => {
  yxRequest.get({
    url: '/articles/home/list'
  }).then(res => {
    console.log(res)
  })
}

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
</style>
