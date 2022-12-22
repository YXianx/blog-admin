<template>
  <div class="roles">
    <el-card style="height: 100%;">
      <div class="card-title">
        角色管理
      </div>
      <div class="search-control">
        <el-form @submit.native.prevent>
          <el-row>
            <el-col :span="18">
              <el-button type="primary" icon="Plus" @click="insertClick">
                新增
              </el-button>
              <el-popconfirm title="是否删除所勾选的分类项?" @confirm="removeClick">
                <template #reference>
                  <el-button type="danger" icon="DeleteFilled">
                    批量删除
                  </el-button>
                </template>
              </el-popconfirm>
            </el-col>
            <el-col :span="6">
              <el-row :gutter="15">
                <el-col :span="16">
                  <el-input placeholder="请输入角色名" v-model="searchName" @keyup.enter.native="searchClick">
                    <template #prefix>
                      <el-icon><Search /></el-icon>
                    </template>
                  </el-input>
                </el-col>
                <el-col :span="8">
                  <el-button type="primary" icon="Search" @click="searchClick">搜索</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-table :data="roleList" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column prop="roleName" label="角色名" align="center"></el-table-column>
        <el-table-column prop="label" label="权限标签" align="center">
          <template #default="scope">
            <el-tag>
              {{ scope.row.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="enable" label="禁用" align="center">
          <template #default="scope">
            <el-switch v-model="scope.row.enable" @change="handleSwitchChange($event)(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
          <template #default="scope">
            <div style="display: flex; align-items: center; justify-content: center;">
              <el-icon style="margin: 0px 5px;"><Clock /></el-icon>
              {{ scope.row.createTime }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template #default="scope">
            <el-button type="primary" icon="Menu" size="small" link @click="setRoleClick(scope.row)">菜单权限</el-button>
            <el-button type="primary" icon="MessageBox" size="small" link>资源权限</el-button>
            <el-popconfirm title="是否删除所勾选的分类项?" @confirm="removeRowClick(scope.row)">
              <template #reference>
                <el-button type="danger" icon="DeleteFilled" size="small" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog v-model="dialogVisible" width="30%" :title="mode === 'insert' ? '新增角色' : '编辑角色'" @close="cancelClick">
        <el-form :model="roleModel" ref="formRef" labelWidth="80px" style="padding: 0px 20px">
          <el-form-item label="角色名" prop="name">
            <el-input v-model="roleModel.name"></el-input>
          </el-form-item>
          <el-form-item label="权限标签" prop="label">
            <el-input v-model="roleModel.label"></el-input>
          </el-form-item>
          <el-form-item label="菜单权限">
            <el-tree
              ref="treeRef"
              :data="treeList"
              show-checkbox
              node-key="id"
              highlight-current
              :props="defaultProps"
              :default-checked-keys="roleModel.menuIdList"
              @check-change="handleCheckNode"
            />
          </el-form-item>
        </el-form>
        <div class="control-btns">
          <el-button size="large" @click="cancelClick(formRef!)">取消</el-button>
          <el-button type="primary" size="large" @click="saveClick">{{ mode === 'insert' ? '确定' : '编辑' }}</el-button>
        </div>
      </el-dialog>

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
import { ref, reactive, nextTick } from 'vue'
import type { IRoleItem, Tree, IRoleModel } from './types'
import type { FormInstance } from 'element-plus'
import { queryRoleList, queryTreeList, insertRole, deleteRole, updateStatus, updateRole } from '@/service/common/authorization'
import showMsg from '@/utils/message/message';

const roleList = ref<IRoleItem[]>()
const mode = ref('insert')
const dialogVisible = ref(false)
const formRef = ref<FormInstance>()
const searchName = ref("")
const currentPage = ref(1)
const pageSize = ref(10)
const totalData = ref(0)
const selectionItems = ref<IRoleItem[]>()
const treeRef = ref()
const treeList = ref<Tree[]>()
const currentRole = ref<IRoleItem>()
const roleModel = reactive<IRoleModel>({
  name: '',
  label: '',
  menuIdList: [],
  resourceIdList: []
})
const defaultProps = {
  children: 'children',
  label: 'label',
}

/**
 * 条数改变回调
 * @param size 显示条数
 */
 const handleSizeChange = (size: number) => {
  pageSize.value = size
  refreshPage()
}
/**
 * 页码改变回调
 * @param page 当前页
 */
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  refreshPage()
}

/**
 * 勾选回调
 * @param item 勾选项
 */
const handleSelectionChange = (item: IRoleItem[]) => {
  selectionItems.value = item
}

/**
 * switch回调
 * @param status 状态
 */
const handleSwitchChange = (status: any) => {
  return (roleItem: IRoleItem) => {
    updateStatus(roleItem.id, status)
      .then((result) => {
        if(result.code === 2001) {
          showMsg('success', `状态: ${status ? '禁用' : '取消禁用'}`, 1000)
        }
      })
  }
}

/**
 * 新增
 */
const insertClick = () => {
  dialogVisible.value = true
}

/**
 * 批量删除
 */
const removeClick = () => {
  if (!selectionItems.value?.length) {
    showMsg('warning', '暂未勾选角色')
    return

  }
  const ids: number[] = (selectionItems.value as Array<IRoleItem>).map((item: IRoleItem) => item.id)
  deleteRole(ids)
    .then((result) => {
      if (result.code === 2001) {
        refreshPage()
        showMsg('success', '批量删除成功')
      }
    })
}

/**
 * 打开菜单权限对话框
 * @param roleItem 当前角色
 */
const setRoleClick = (roleItem: IRoleItem) => {
  mode.value = 'update'
  dialogVisible.value = true

  nextTick(() => {  // 将赋值操作放在对话框DOM加载完毕过后，解决resetFields重置不为空的问题
    currentRole.value = roleItem
    roleModel.label = roleItem.label
    roleModel.name = roleItem.roleName
    roleModel.menuIdList = roleItem.menuIds
  })
}

/**
 * 删除当前行
 * @param roleItem 角色信息
 */
const removeRowClick = (roleItem: IRoleItem) => {
  deleteRole([roleItem.id])
    .then((result) => {
      if (result.code === 2001) {
        refreshPage()
        showMsg('success', '删除成功')
      }
    })
}

/**
 * 搜索
 */
const searchClick = () => {
  refreshPage(true)
}

/**
 * 菜单树节点勾选
 */
const handleCheckNode = () => {
  const ids = treeRef.value.getCheckedNodes().map((item: any) => {
    return item.id
  })
  roleModel.menuIdList = ids
}

const resetTree = () => {
  for (const id of roleModel.menuIdList) {
    treeRef.value.setChecked(id, false, false)
  }
}

//TODO:BUG roleModel表单数据重置有问题
/**
 * 取消
 */
const cancelClick = (formEl: FormInstance) => {
  // 1、重置表单
  if(formEl) {
    formEl.resetFields()
    console.log("roleModel", roleModel);

  }
  // 2、重置菜单树
  resetTree()
  // 3、关闭dialog
  dialogVisible.value = false
}
/**
 * 确定 & 编辑
 */
const saveClick = async (roleItem: IRoleItem) => {
  if (!roleModel.name || !roleModel.label) {
    showMsg('warning', '请将信息填写完整')
    return
  }
  if (!roleModel.menuIdList.length) {
    showMsg('warning', '未分配菜单权限')
    return
  }

  let requestResult = null
  if (mode.value === 'insert') {
    requestResult = await insertRole(roleModel.name, roleModel.label, roleModel.menuIdList)
  } else {
    if (currentRole.value)
      requestResult = await updateRole(currentRole.value.id, roleModel.menuIdList, roleModel.name,roleModel.label)
  }
  if (requestResult!.code === 2001) {
    resetTree()
    refreshPage()
    dialogVisible.value = false
    showMsg(
      'success',
      mode.value === 'insert' ? '新增成功' : '编辑成功',
      1500
    )
  }
}

const refreshPage = (isShowMsg: boolean = false) => {
  queryRoleList(currentPage.value, pageSize.value, searchName.value)
    .then((result) => {
      if(result.code === 2001) {
        roleList.value = result.data.records
        totalData.value = result.data.total
        if(isShowMsg) showMsg('success', '查询成功')
      }
    })
}


/**
 * 页面初始化
 */
const init = () => {
  // 1、渲染页面数据
  refreshPage()
  // 2、提前请求角色菜单树
  queryTreeList()
    .then((result) => {
      let tempTree: Tree[] = []
      // 2-1、格式转换成Tree
      for(const menu of result.data) {
        const parent: Tree = {
          id: menu.id,
          label: menu.name,
          children: []
        }
        if (menu.children) {
          for (const children of menu.children) {
            const node: Tree = {
              id: children.id,
              label: children.name,
              children: []
            }
            parent.children?.push(node)
          }
        }
        tempTree.push(parent)
      }
      treeList.value = tempTree
    })
}

init()
</script>

<style scoped lang="less">
  .roles {
    width: 100%;
    height: 100%;
    .search-control {
      margin: 24px 0px 20px 0px;
    }
  }
</style>
