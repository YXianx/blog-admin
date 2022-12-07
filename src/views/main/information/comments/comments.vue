<template>
  <div>
    <el-card>
      <div class="card-title">评论管理</div>
      <StatusMenu :tags="tags" @change-status="handleStatusChange" />
      <div class="search-control">
        <el-form>
          <el-row>
            <el-col :span="14">
              <el-popconfirm title="是否删除所勾选的分类项?" @confirm="selectionRemoveClick">
                <template #reference>
                  <el-button type="danger" plain icon="DeleteFilled">
                    批量删除
                  </el-button>
                </template>
              </el-popconfirm>
              <el-button type="success" icon="CircleCheck" plain @click="approveClick">
                批量通过
              </el-button>
            </el-col>
            <el-col :span="10">
              <el-row :gutter="15">
                <el-col :span="10">
                  <el-select placeholder="请选择来源" v-model="commentModel.type">
                    <template #prefix>
                      <el-icon><Compass /></el-icon>
                    </template>
                    <el-option label="默认" value="">默认</el-option>
                    <el-option label="文章" :value="0">文章</el-option>
                    <el-option label="友链" :value="1">友链</el-option>
                  </el-select>
                </el-col>
                <el-col :span="10">
                  <el-input placeholder="请输入用户昵称" v-model="commentModel.nickName">
                    <template #prefix>
                      <el-icon><Search /></el-icon>
                    </template>
                  </el-input>
                </el-col>
                <el-col :span="4">
                  <el-button type="primary" icon="Search" @click="searchClick">搜索</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table :data="commentList" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" ></el-table-column>
        <el-table-column prop="avatar" label="头像" align="center">
          <template #default="socpe">
            <img :src="socpe.row.avatar" alt="" style="width: 50px; height: 50px">
          </template>
        </el-table-column>
        <el-table-column prop="articleTitle" label="文章标题" width="180" align="center"></el-table-column>
        <el-table-column prop="nickName" label="评论者" align="center"></el-table-column>
        <el-table-column prop="replyName" label="回复者" align="center"></el-table-column>
        <el-table-column prop="content" label="评论内容" width="200" align="center"></el-table-column>
        <el-table-column prop="createTime" label="评论时间" width="110" align="center"></el-table-column>
        <el-table-column prop="createTime" label="状态" align="center">
          <template #default="scope">
            <el-tag :type="reviewMapState(scope.row)?.type">{{ reviewMapState(scope.row)?.msg }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="来源" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.type ? 'warning' : ''">{{ scope.row.type ? '友链' : '文章' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <div class="control-btn">
              <el-popconfirm title="是否删除该评论?" @confirm="removeClick(scope.row.id)">
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
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import StatusMenu from '@/components/status-menu.vue';
import type { tagMenuType } from '@/types/common'
import type { ICommentItem } from './types'
import { queryCommentList, delComment, reviewComment } from '@/service/common/information'
import showMsg from '@/utils/message/message';

const currentPage = ref(1) // 当前页
const pageSize = ref(5) // 单页显示条数
const totalData = ref(0) // 总条数
const selectionItems = ref<ICommentItem[]>()
const reviewState = ref<string | number>('')
const commentModel = reactive({
  type: "",
  nickName: ""
})
const tags: tagMenuType[] = [
  { tagName: '全部' },
  { tagName: '正常', status: 1 },
  { tagName: '审核中', status: 0 },
]
const commentList = ref<ICommentItem[]>()

/**
 * 审核状态更改
 * @param isReview 审核状态
 */
const handleStatusChange = (isReview: number) => {
  reviewState.value = isReview
  refreshPage(1, 100, isReview)
}

/**
 * review参数转为state
 */
const reviewMapState = computed(() => {
  return (row: ICommentItem) => {
    if (!row.isReview) {
      return {
        type: 'info',
        msg: '审核中'
      }
    } else {
      if (!row.isDelete) {
        return {
          type: 'success',
          msg: '正常'
        }
      }
    }
  }
})

/**
 * 条数改变回调
 * @param size 显示条数
 */
const handleSizeChange = (size: number) => {
  pageSize.value = size
  refreshPage(currentPage.value, size, reviewState.value)
}
/**
 * 页码改变回调
 * @param page 当前页
 */
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  refreshPage(page, pageSize.value, reviewState.value)
}
/**
 * 勾选回调
 * @param ids ID集合
 */
const handleSelectionChange = (ids: ICommentItem[]) => {
  selectionItems.value = ids
}

/**
 * 搜索
 */
const searchClick = () => {
  queryCommentList({
    current: 1,
    size: 100,
    type: commentModel.type,
    keyword: commentModel.nickName
  }).then((result) => {
    commentList.value = result.data.records
    if (result.code === 2001) {
      showMsg('success', '查询成功')
    }
  })
}

/**
 * 删除评论
 * @param id 评论ID
 */
const removeClick = (id: number) => {
  delComment([id])
    .then((result) => {
      if (result.code === 2001) {
        refreshPage()
        showMsg('success', '批量删除成功')
      }
  })
}

/**
 * 批量删除
 */
const selectionRemoveClick = () => {
  if(!selectionItems.value?.length) {
    showMsg('warning', '删除失败，暂未勾选分类项')
    return
  }
  const ids: number[] = (selectionItems.value as Array<ICommentItem>).map((item: ICommentItem) => item.id)
  delComment(ids)
    .then((result) => {
      if (result.code === 2001) {
        refreshPage()
        showMsg('success', '批量删除成功')
      }
    })
}

/**
 * 批量通过
 */
const approveClick = () => {
  if(!selectionItems.value?.length) {
    showMsg('warning', '删除失败，暂未勾选评论项')
    return
  }
  const ids: number[] = (selectionItems.value as Array<ICommentItem>).map((item: ICommentItem) => item.id)
  reviewComment(ids)
    .then((result) => {
      if (result.code === 2001) {
        refreshPage(currentPage.value, pageSize.value, 0) // 重新渲染当前未审核页面
        showMsg('success', '批量通过成功')
      }
    })
}

/**
 * 列表数据刷新
 * @param current 当前页
 * @param size 查询条数
 * @param isReview 是否审核通过
 */
const refreshPage = (current: number = currentPage.value, size: number = pageSize.value, isReview: number | string = '') => {
  queryCommentList({
    current,
    size,
    isReview
  }).then((result) => {
    commentList.value = result.data.records
    totalData.value = result.data.total
  })
}

refreshPage()
</script>

<style scoped lang="less">
.search-control {
  margin: 24px 0px 20px 0px;
}
.control-btn {
  display: flex;
  justify-content: center;
}
</style>
