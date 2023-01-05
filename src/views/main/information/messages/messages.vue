<template>
  <el-card>
    <div class="card-title">
      留言管理
    </div>
    <StatusMenu :tags="tags" />

    <div class="search-control">
      <div class="left">
        <el-button type="danger" icon="DeleteFilled" plain disabled>
          批量删除
        </el-button>
        <el-button type="success" icon="CircleCheck" plain disabled>
          批量通过
        </el-button>
      </div>
      <div class="right">
        <el-input placeholder="请输入用户昵称">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-button type="primary" icon="Search">搜索</el-button>
      </div>
    </div>

    <el-table>
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="头像" align="center"></el-table-column>
      <el-table-column label="留言人" align="center"></el-table-column>
      <el-table-column label="留言内容" align="center"></el-table-column>
      <el-table-column label="IP地址" align="center"></el-table-column>
      <el-table-column label="IP来源" align="center"></el-table-column>
      <el-table-column label="状态" align="center"></el-table-column>
      <el-table-column label="留言时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center"></el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import StatusMenu from '@/components/status-menu.vue';
import type { tagMenuType } from '@/types/common'

const tags: tagMenuType[] = [
  { tagName: '全部' },
  { tagName: '正常', status: 1 },
  { tagName: '审核中', status: 2 },
]
</script>

<style lang="less" scoped>

</style>
