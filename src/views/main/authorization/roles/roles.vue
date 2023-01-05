<template>
  <div class="roles">
    <el-card style="height: 100%;">
      <div class="card-title">
        角色管理
      </div>
      <div class="search-control">
        <div class="left">
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
        </div>
        <div class="right">
          <el-input placeholder="请输入角色名" v-model="searchName" @keyup.enter.native="searchClick">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" icon="Search" @click="searchClick">搜索</el-button>
        </div>
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
            <el-button type="primary" icon="Menu" size="small" link @click="openMenuModel(scope.row)">菜单权限</el-button>
            <el-button type="primary" icon="MessageBox" size="small" link @click="openResourceModel(scope.row)">资源权限</el-button>
            <el-popconfirm title="是否删除所勾选的分类项?" @confirm="removeRowClick(scope.row)">
              <template #reference>
                <el-button type="danger" icon="DeleteFilled" size="small" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 菜单权限对话框 -->
      <el-dialog v-model="menuVisible" width="30%" :title="mode === 'insert' ? '新增角色' : '编辑角色'" @close="cancelMenuClick(formRef!)">
        <el-form :model="roleModel" ref="formRef" labelWidth="80px" style="padding: 0px 20px">
          <el-form-item label="角色名" prop="name">
            <el-input v-model="roleModel.name"></el-input>
          </el-form-item>
          <el-form-item label="权限标签" prop="label">
            <el-input v-model="roleModel.label"></el-input>
          </el-form-item>
          <el-form-item label="菜单权限">
            <el-tree
              ref="menuTreeRef"
              :data="menuTree"
              show-checkbox
              node-key="id"
              highlight-current
              :props="defaultProps"
              :default-checked-keys="roleModel.menuIdList"
              @check-change="handleCheckNode('menu')"
            />
          </el-form-item>
        </el-form>
        <div class="control-btns">
          <el-button size="large" @click="cancelMenuClick(formRef!)">取消</el-button>
          <el-button type="primary" size="large" @click="menuSave">{{ mode === 'insert' ? '确定' : '编辑' }}</el-button>
        </div>
      </el-dialog>

      <!-- 资源权限对话框 -->
      <el-dialog v-model="resourceVisible" width="30%" title="修改资源权限" @close="cancelResourceClick(formRef!)">
        <el-form :model="roleModel" ref="formRef" labelWidth="80px" style="padding: 0px 20px">
          <el-form-item label="角色名" prop="name">
            <el-input v-model="roleModel.name"></el-input>
          </el-form-item>
          <el-form-item label="权限标签" prop="label">
            <el-input v-model="roleModel.label"></el-input>
          </el-form-item>
          <el-form-item label="资源权限">
            <el-tree
              ref="resourceTreeRef"
              :data="resourceTree"
              show-checkbox
              node-key="id"
              highlight-current
              :props="defaultProps"
              :default-checked-keys="roleModel.resourceIdList"
              @check-change="handleCheckNode('resource')"
            />
          </el-form-item>
        </el-form>
        <div class="control-btns">
          <el-button size="large" @click="cancelResourceClick(formRef!)">取消</el-button>
          <el-button type="primary" size="large" @click="resourceSave">确定</el-button>
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
// TODO:BUG:重新分配菜单权限后，禁用项自动取消禁用
import { ref, reactive, nextTick } from 'vue'
import type { IRoleItem, Tree, IRoleModel, TreeModel } from './types'
import type { FormInstance } from 'element-plus'
import {
  queryRoleList,
  queryMenuTree,
  queryResourceTree,
  insertRole,
  deleteRole,
  updateStatus,
  updateMenu,
  updateResource
} from '@/service/common/authorization'
import showMsg from '@/utils/message/message';

const roleList = ref<IRoleItem[]>()
const mode = ref('insert')
const menuVisible = ref(false)
const resourceVisible = ref(false)
const formRef = ref<FormInstance>()
const searchName = ref("")
const currentPage = ref(1)
const pageSize = ref(10)
const totalData = ref(0)
const selectionItems = ref<IRoleItem[]>()
const menuTreeRef = ref()
const resourceTreeRef = ref()
const menuTree = ref<Tree[]>()
const resourceTree = ref<Tree[]>()
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
  menuVisible.value = true
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
const openMenuModel = (roleItem: IRoleItem) => {
  mode.value = 'update'
  menuVisible.value = true

  nextTick(() => {  // 将赋值操作放在对话框DOM加载完毕过后，解决resetFields重置不为空的问题
    currentRole.value = roleItem
    roleModel.label = roleItem.label
    roleModel.name = roleItem.roleName
    roleModel.menuIdList = roleItem.menuIds
  })
}

/**
 * 打开菜单权限对话框
 * @param roleItem 当前角色
 */
 const openResourceModel = (roleItem: IRoleItem) => {
  resourceVisible.value = true

  nextTick(() => {  // 将赋值操作放在对话框DOM加载完毕过后，解决resetFields重置不为空的问题
    currentRole.value = roleItem
    roleModel.label = roleItem.label
    roleModel.name = roleItem.roleName
    roleModel.resourceIdList = roleItem.resourceIds
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
 * @param tree 树节点
 */
const handleCheckNode = (tree: TreeModel) => {
  let treeRef = tree === 'menu' ? menuTreeRef.value : resourceTreeRef.value
  const ids = treeRef.getCheckedNodes().map((item: any) => {
    return item.id
  })
  if (tree === 'menu')
    roleModel.menuIdList = ids
  else
    roleModel.resourceIdList = ids
}

/**
 * 重置树的勾选
 * @param tree 树类型
 */
const resetTree = (tree: TreeModel) => {
  if (tree === 'menu') {
    for (const id of roleModel.menuIdList) {
      menuTreeRef.value.setChecked(id, false, false)
    }
  } else {
    for (const id of roleModel.resourceIdList) {
      resourceTreeRef.value.setChecked(id, false, false)
    }
  }
}

/**
 * 取消
 */
const cancelMenuClick = (formEl: FormInstance) => {
  // 1、重置表单
  if(formEl) {
    formEl.resetFields()
  }
  // 2、重置菜单树
  resetTree('menu')
  // 3、关闭dialog
  menuVisible.value = false
}
const cancelResourceClick = (formEl: FormInstance) => {
  // 1、重置表单
  if(formEl) {
    formEl.resetFields()
  }
  // 2、重置菜单树
  resetTree('resource')
  // 3、关闭dialog
  resourceVisible.value = false
}

/**
 * 添加角色、编辑角色菜单权限
 */
const menuSave = async (roleItem: IRoleItem) => {
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
      requestResult = await updateMenu(currentRole.value.id, roleModel.menuIdList, roleModel.name,roleModel.label)
  }
  if (requestResult!.code === 2001) {
    menuVisible.value = false
    resetTree('menu')
    refreshPage()
    showMsg(
      'success',
      mode.value === 'insert' ? '新增成功' : '编辑成功',
      1500
    )
  }
}

/**
 * 编辑资源权限
 */
const resourceSave = async (roleItem: IRoleItem) => {
  if (!roleModel.name || !roleModel.label) {
    showMsg('warning', '请将信息填写完整')
    return
  }
  if (currentRole.value) {
    const resResult = await updateResource(currentRole.value.id, roleModel.resourceIdList, roleModel.name, roleModel.label)
    if (resResult.code === 2001) {
      resourceVisible.value = false
      resetTree('resource')
      refreshPage()
      showMsg('success', '修改成功')
    }
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
  // 2、请求菜单树
  queryMenuTree()
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
      menuTree.value = tempTree
    })
  // 3、请求资源树
  queryResourceTree()
    .then((result) => {
      let tempTree: Tree[] = []
      // 2-1、格式转换成Tree
      for(const res of result.data) {
        const parent: Tree = {
          id: res.id,
          label: res.resourceName,
          children: []
        }
        if (res.children) {
          for (const children of res.children) {
            const node: Tree = {
              id: children.id,
              label: children.resourceName,
              children: []
            }
            parent.children?.push(node)
          }
        }
        tempTree.push(parent)
      }
      resourceTree.value = tempTree
    })
}

init()
</script>

<style scoped lang="less">
  .roles {
    width: 100%;
    height: 100%;
  }
</style>
