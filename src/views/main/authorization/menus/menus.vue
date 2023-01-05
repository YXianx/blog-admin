<template>
  <el-card>
    <div class="card-title">
      菜单管理
    </div>
    <div class="search-control">
      <div class="left">
        <el-button icon="Plus" type="primary" @click="addClick">新增菜单</el-button>
      </div>
      <div class="right">
        <el-input placeholder="请输入菜单名" v-model="keyword">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-button icon="Search" type="primary" @click="handleSearchMenu">搜索</el-button>
      </div>
    </div>
    <el-table
      :data="menuTree"
      row-key="id"
      :tree-props="{ children: 'children' }"
      @cell-click="handleTableCellClick">
      <el-table-column label="菜单名称" prop="name"></el-table-column>
      <!-- <el-table-column label="图标" prop="icon" align="center">
        <template #default="scope">
          <div style="display: flex; align-items: center; justify-content: center; color: #0C1626;">
            <el-icon style="font-size: 20px;">
              <component :is="scope.row.icon"></component>
            </el-icon>
          </div>
        </template>
      </el-table-column> -->
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
            /
          </span>
        </template>
      </el-table-column>
      <el-table-column label="组件路径" prop="component">
        <template #default="scope" >
          <span v-if="scope.row.component">
            {{ scope.row.component }}
          </span>
          <span v-else>
            /
          </span>
        </template>
      </el-table-column>
      <el-table-column label="隐藏" prop="hidden" align="center">
        <template #default="scope">
          <el-switch v-model="scope.row.hidden" @change="handleSwitchChange($event)(scope.row.id)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
      <el-table-column label="操作" prop="setting" width="190" align="center">
        <template #default="scope">
          <!-- 当前项parentId = 0则代表为一级目录或导航，这时再显示新增按钮 -->
          <el-button v-if="findParentId(scope.row.id) === 0" type="primary" icon="Plus" size="small" link @click="insertModel(scope.row)">新增</el-button>
          <el-button type="primary" icon="EditPen" size="small" link @click="editMenuModel(scope.row)">修改</el-button>
          <el-popconfirm title="是否删除所勾选的分类项?" @confirm="clearMenuModel(scope.row.id)">
            <template #reference>
              <el-button type="danger" icon="DeleteFilled" size="small" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="menuVisible" :title="mode === 'insert' || mode === 'parent_insert' ? '新增菜单' : '修改菜单'" width="30%">
      <el-form :model="menuModel" ref="formRef" style="padding: 0px 20px">
        <!-- 新增菜单父级菜单 || 非父菜单加子菜单 -->
        <el-form-item label="菜单类型" v-if="(mode === 'insert' || menuModel.parentId != 0) && mode != 'parent_insert'">
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
          <el-popover placement="bottom-start" width="300" trigger="click" ref="popoverRef">
            <div class="icons">
              <template v-for="icon in iconsList" :key="icon.icon">
                <div class="icon-item" @click="handleIconSelect(icon)">
                  <el-icon class="icon"><component :is="icon.icon"></component></el-icon>
                  <span>{{ icon.name }}</span>
                </div>
              </template>
            </div>
            <template #reference>
              <el-input v-model="menuModel.icon">
                <template #prefix v-if="menuModel.icon !== ''">
                  <el-icon>
                    <component :is="menuModel.icon"></component>
                  </el-icon>
                </template>
              </el-input>
            </template>
          </el-popover>
        </el-form-item>
        <el-form-item label="访问路径" prop="path">
          <el-input v-model="menuModel.path"></el-input>
        </el-form-item>
        <el-form-item label="组件路径" v-if="!isCatalog || mode === 'update' || mode === 'parent_insert'" prop="component">
          <el-input v-model="menuModel.component"></el-input>
        </el-form-item>
        <el-form-item label="显示排序" prop="orderNum">
          <el-input-number v-model="menuModel.orderNum"></el-input-number>
        </el-form-item>
        <el-form-item label="显示状态" prop="isHidden">
          <el-radio-group v-model="menuModel.isHidden">
            <el-radio :label="false">显示</el-radio>
            <el-radio :label="true">隐藏</el-radio>
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
import { ref, reactive, nextTick } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { queryMenuTree } from '@/service/common/authorization'
import showMsg from '@/utils/message/message';
import { insertMenus, updateMenus, updateHiddenStatus, deleteMenus } from '@/service/common/authorization'
import type { FormInstance } from 'element-plus'
import type { IMenuLeaf, IMenuModel } from './types'

const menuTree = ref<IMenuLeaf[]>()
const keyword = ref()
const mode = ref('insert')
const menuVisible = ref(false)
const popoverRef = ref()
const expandIconEls = ref<HTMLElement[]>()
const isCatalog = ref(true)
const formRef = ref<FormInstance>()
const curMenus = ref<IMenuLeaf>()
const iconsList = ref([
  {
    icon: 'HomeFilled',
    name: 'HomeFilled'
  },
  {
    icon: 'Menu',
    name: 'Menu'
  },
  {
    icon: 'Tools',
    name: 'Tools'
  },
  {
    icon: 'UploadFilled',
    name: 'UploadFilled'
  },
  {
    icon: 'UserFilled',
    name: 'UserFilled'
  },
  {
    icon: 'Avatar',
    name: 'Avatar'
  },
  {
    icon: 'HelpFilled',
    name: 'HelpFilled'
  },
  {
    icon: 'Share',
    name: 'Share'
  },
  {
    icon: 'StarFilled',
    name: 'StarFilled'
  },
  {
    icon: 'Comment',
    name: 'Comment'
  },
  {
    icon: 'Histogram',
    name: 'Histogram'
  },
  {
    icon: 'Grid',
    name: 'Grid'
  },
  {
    icon: 'Promotion',
    name: 'Promotion'
  },
  {
    icon: 'Management',
    name: 'Management'
  },
  {
    icon: 'List',
    name: 'List'
  },
  {
    icon: 'PictureFilled',
    name: 'PictureFilled'
  },
  {
    icon: 'BellFilled',
    name: 'BellFilled'
  },
  {
    icon: 'Platform',
    name: 'Platform'
  },
  {
    icon: 'Opportunity',
    name: 'Opportunity'
  },
  {
    icon: 'SwitchFilled',
    name: 'SwitchFilled'
  }
])
const menuModel = reactive<IMenuModel>({
  component:"/",
  icon:"",
  isHidden:false,
  name:"",
  parentId:0,
  path:"/main/",
  orderNum:1
})

/**
 * 表格行点击回调
 * @param row 当前行数据
 * @param column 列名数据
 * @param event 其他事件
 */
 const handleTableCellClick = (row: IMenuLeaf, column: any, event: any) => {
  if (column.property === 'setting' || column.property === 'hidden' ||  row.children.length <= 0) return
  // 首次点击获取所有展开按钮Dom
  if (!expandIconEls.value)
    expandIconEls.value = (document.querySelectorAll('.el-table__expand-icon') as unknown) as HTMLElement[]

  const rowNum = menuTree.value?.filter((item: IMenuLeaf) => {
    if (item.children.length > 0)
      return item
  }).indexOf(row) as number

  expandIconEls.value[rowNum].click() // 点击当前行的展开按钮
}

/**
 * 搜索菜单
 */
const handleSearchMenu = () => {
  refreshPage(keyword.value, true)
}

/**
 * 选中ICON图标事件
 */
const handleIconSelect = (iconItem: { name: string, icon: string }) => {
  menuModel.icon = iconItem.icon
  popoverRef.value.hide() // 选择图标后关闭el-popover
}

/**
 * switch按钮回调
 * @param status 隐藏状态
 */
const handleSwitchChange = (status: boolean) => {
  return (id: number) => {
    updateHiddenStatus(id, status)
      .then((result) => {
        if (result.code === 2001) {
          showMsg('success', status ? '隐藏成功' : '显示成功')
          refreshPage()
        }
      })
  }
}

/**
 * 搜索栏增加按钮
 */
const addClick = () => {
  mode.value = 'insert'
  menuModel.parentId = 0
  menuVisible.value = true
}

/**
 * 操作列增加按钮
 * @param menu 菜单信息
 */
const insertModel = (menu: IMenuLeaf) => {
  // const parentId = findParentId(menu.id)
  mode.value = 'parent_insert'
  const parentId = menu.id
  menuModel.parentId = parentId
  menuVisible.value = true
}
const editMenuModel = (menu: IMenuLeaf) => {
  mode.value = 'update'
  nextTick(() => {
    const parentId = findParentId(menu.id) // 搜索父级id

    curMenus.value = menu
    menuModel.name = menu.name
    menuModel.icon = menu.icon
    menuModel.path = menu.path ? menu.path : '/'
    menuModel.component = menu.component ? menu.component : '/'
    menuModel.orderNum = menu.orderNum
    menuModel.isHidden = menu.hidden
    menuModel.parentId = parentId
  })
  menuVisible.value = true
}

/**
 * 删除菜单项
 * @param id 菜单ID
 */
const clearMenuModel = (id: number) => {
  deleteMenus(id)
    .then((result) => {
      if (result.code === 2001) {
        showMsg('success', '删除成功')
        refreshPage()
        cancelMenuDialog(formRef.value!)
      }
    })
}

/**
 * 确定新增
 */
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
  if (mode.value === 'insert') {
    console.log("insert");

    insertMenus(menuModel)
      .then((result) => {
        if (result.code === 2001) {
          showMsg('success', '新增成功')
          refreshPage()
          cancelMenuDialog(formRef.value!)
        }
      })
  } else if (mode.value === 'parent_insert') {
    console.log("parent_insert");

    const newData: IMenuModel = {
      parentId: menuModel.parentId, // 获取父级id
      name: menuModel.name,
      icon: menuModel.icon,
      path: menuModel.path,
      component: menuModel.component,
      orderNum: menuModel.orderNum,
      isHidden: menuModel.isHidden
    }
    insertMenus(newData)
      .then((result) => {
        if (result.code === 2001) {
          showMsg('success', '修改成功')
          refreshPage()
          cancelMenuDialog(formRef.value!)
        }
      })
  } else {
    const newData: IMenuModel = {
      id: curMenus.value?.id,
      parentId: menuModel.parentId,
      name: menuModel.name,
      icon: menuModel.icon,
      path: menuModel.path,
      component: menuModel.component,
      orderNum: menuModel.orderNum,
      isHidden: menuModel.isHidden
    }
    updateMenus(newData)
      .then((result) => {
        if (result.code === 2001) {
          showMsg('success', '修改成功')
          refreshPage()
          cancelMenuDialog(formRef.value!)
        }
      })
  }
}

/**
 * 关闭对话框
 * @param formEl 表单对象
 */
const cancelMenuDialog = (formEl: FormInstance) => {
  if (formEl) {
    formEl.resetFields()
  }
  menuVisible.value = false
}

/**
 * 查询菜单的ParentID
 * @param menuId 菜单ID
 */
const findParentId = (menuId: number) => {
  let parentId = -1
  let finded = false
  for (let i = 0; i < menuTree.value!?.length; i++) {
    const children = menuTree.value![i].children
    if (children.length > 0) {
      for (let j = 0; j < children.length; j++) {
        if (children[j].id === menuId) {
          parentId = menuTree.value![i].id
          finded = true
          break
        }
      }
    }
  }
  if (!finded) {
    parentId = 0
  }

  return parentId
}

/**
 * 刷新页面数据
 * @param keyword 关键词
 * @param isShowMsg 是否开启提示
 */
const refreshPage = (keyword?: string, isShowMsg: boolean = false) => {
  queryMenuTree(keyword)
    .then((result) => {
      menuTree.value = result.data
      if (isShowMsg)
        showMsg('success', '查询成功')
    })
}
refreshPage()
</script>

<style lang="less" scoped>
.icons {
  height: 275px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  overflow-y: auto;
  .icon-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border: 1px solid #DDDFE5;
    padding: 15px;
    margin: 5px;
    cursor: pointer;
    transition: all .2s;
    .icon {
      font-size: 20px;
      margin: 5px 0px;
    }
    span {
      font-size: 10px;
      white-space: nowrap;
    }
    &:hover {
      background-color: #F3F6FB;
    }
  }
}
</style>
