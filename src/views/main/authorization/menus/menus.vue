<template>
  <el-card style="height: 100%;">
    <div class="card-title">
      菜单管理
    </div>
    <div class="search-control">
      <div class="left">
        <el-button icon="Plus" type="primary" @click="addClick">新增菜单</el-button>
      </div>
      <div class="right">
        <el-input placeholder="请输入菜单名">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-button icon="Search" type="primary">搜索</el-button>
      </div>
    </div>
    <el-table
      :data="menuTree"
      row-key="id"
      :tree-props="{ children: 'children' }"
      @cell-click="handleTableCellClick">
      <el-table-column label="菜单名称" prop="name"></el-table-column>
      <el-table-column label="图标" prop="icon" align="center">
        <template #default="scope">
          <el-icon>
            <component :is="scope.row.icon"></component>
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="orderNum" align="center">
        <template #default="scope">
          <el-tag>{{ scope.row.orderNum }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="访问路径" prop="path">
        <template #default="scope" >
          <span v-if="scope.row.path">
            {{ scope.row.path }}
          </span>
          <span v-else>
            ...
          </span>
        </template>
      </el-table-column>
      <el-table-column label="组件路径" prop="component">
        <template #default="scope" >
          <span v-if="scope.row.component">
            {{ scope.row.component }}
          </span>
          <span v-else>
            ...
          </span>
        </template>
      </el-table-column>
      <el-table-column label="隐藏" prop="hidden" align="center">
        <template #default="scope">
          <el-switch v-model="scope.row.hidden"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
      <el-table-column label="操作" prop="setting" width="190" align="center">
        <template #default="scope">
          <el-button v-if="scope.row.path === ''" type="primary" icon="Plus" size="small" link @click="insertModel(scope.row)">新增</el-button>
          <el-button type="primary" icon="EditPen" size="small" link @click="editMenuModel(scope.row)">修改</el-button>
          <el-popconfirm title="是否删除所勾选的分类项?" @confirm="clearMenuModel(scope.row.id)">
            <template #reference>
              <el-button type="danger" icon="DeleteFilled" size="small" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="menuVisible" title="新增菜单" width="30%">
      <el-form :model="menuModel" ref="formRef" style="padding: 0px 20px">
        <el-form-item label="菜单类型">
          <el-radio-group v-model="isCatalog">
            <!-- 目录没有组件位置 -->
            <el-radio :label="true">目录</el-radio>
            <!-- 一级菜单包含组件位置 -->
            <el-radio :label="false">一级菜单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menuModel.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="menuModel.icon"></el-input>
        </el-form-item>
        <el-form-item label="访问路径" prop="path">
          <el-input v-model="menuModel.path"></el-input>
        </el-form-item>
        <el-form-item label="组件路径" v-if="!isCatalog" prop="component">
          <el-input v-model="menuModel.component"></el-input>
        </el-form-item>
        <el-form-item label="显示排序" prop="orderNum">
          <el-input-number v-model="menuModel.orderNum"></el-input-number>
        </el-form-item>
        <el-form-item label="显示状态" prop="isHidden">
          <el-radio-group v-model="menuModel.isHidden">
            <el-radio :label="true">显示</el-radio>
            <el-radio :label="false">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="control-btns">
          <el-button size="large" @click="cancelMenuDialog(formRef!)">取消</el-button>
          <el-button type="primary" size="large" @click="menuSave">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { queryMenuTree } from '@/service/common/authorization'
import showMsg from '@/utils/message/message';
import { insertMenus } from '@/service/common/authorization'
import type { FormInstance } from 'element-plus'
import type { IMenuLeaf, IMenuModel } from './types'

const menuTree = ref<IMenuLeaf[]>()
const menuVisible = ref(true)
const expandIconEls = ref<HTMLElement[]>()
const isCatalog = ref(true)
const formRef = ref<FormInstance>()
const menuModel = reactive<IMenuModel>({
  component:"...",
  icon:"",
  isHidden:true,
  name:"",
  parentId:0,
  path:"",
  orderNum:1
})

/**
 * 表格行点击回调
 * @param row 当前行数据
 * @param column 列名数据
 * @param event 其他事件
 */
 const handleTableCellClick = (row: IMenuLeaf, column: any, event: any) => {
  if (column.property === 'setting' || row.children.length <= 0) return
  // 首次点击获取所有展开按钮Dom
  if (!expandIconEls.value)
    expandIconEls.value = (document.querySelectorAll('.el-table__expand-icon') as unknown) as HTMLElement[]

  const rowNum = menuTree.value?.filter((item: IMenuLeaf) => {
    if (item.children.length > 0)
      return item
  }).indexOf(row) as number

  expandIconEls.value[rowNum].click() // 点击当前行的展开按钮
}

const addClick = () => {
  menuVisible.value = true
}

const insertModel = (menu: IMenuLeaf) => {

}
const editMenuModel = (r: any) => {

}
const clearMenuModel = (r: any) => {

}

const menuSave = () => {
  if (menuModel.orderNum <= 0) {
    showMsg('warning', '显示排序必须大于0')
    return
  }

  if (isCatalog.value) {
    if (!menuModel.name || !menuModel.icon || !menuModel.path) {
      showMsg('warning', '信息未填写完整')
      return
    }
  } else {
    if (!menuModel.name || !menuModel.icon || !menuModel.path || !menuModel.component) {
      showMsg('warning', '信息未填写完整')
      return
    }
  }
  insertMenus(menuModel)
    .then((result) => {
      if (result.code === 2001) {
        showMsg('success', '新增成功')
        refreshPage()
        cancelMenuDialog(formRef.value!)
      }
    })
}

const cancelMenuDialog = (formEl: FormInstance) => {
  if (formEl) {
    formEl.resetFields()
  }
  menuVisible.value = false
}

const refreshPage = (keyword?: string, isShowMsg: boolean = false) => {
  queryMenuTree(keyword)
    .then((result) => {
      menuTree.value = result.data
    })
}
refreshPage()
</script>

<style scoped>

</style>
