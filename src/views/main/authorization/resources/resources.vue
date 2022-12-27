<template>
  <el-card>
    <div class="card-title">
      接口管理
    </div>
    <div class="search-control">
      <div class="left">
        <el-button :icon="Plus" type="primary" @click="addClick">新增模块</el-button>
      </div>
      <div class="right">
        <el-input placeholder="请输入资源名" v-model="keyword">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-button :icon="Search" type="primary" @click="searchClick">搜索</el-button>
      </div>
    </div>
    <el-table
      :data="resourceTree"
      row-key="id"
      :tree-props="{children: 'children'}"
      @cell-click="handleTableCellClick"
    >
      <el-table-column label="资源名" prop="resourceName"></el-table-column>
      <el-table-column label="资源路径" prop="url" width="230" align="center"></el-table-column>
      <el-table-column label="请求方式" prop="requestMethod" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.url !== null" :type="methodMapType(scope.row.requestMethod)" size="large">{{ scope.row.requestMethod }}</el-tag>
          <div v-else style="height: 35px;"></div>
        </template>
      </el-table-column>
      <el-table-column label="匿名访问" prop="anon" align="center">
        <template #default="scope">
          <el-switch v-if="scope.row.url !== null" v-model="scope.row.anon" @change="handleSwitchChange($event)(scope.row.id)"></el-switch>
          <div v-else style="height: 35px;"></div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center">
        <template #default="scope">
          <div style="display: flex; align-items: center; justify-content: center;">
            <el-icon style="margin: 0px 5px;"><Clock /></el-icon>
            {{ trimDateFormat(scope.row.createTime) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="setting" width="190" align="center">
        <template #default="scope">
          <el-button v-if="scope.row.url === null" type="primary" icon="Plus" size="small" link @click="resourceClick(scope.row)">新增</el-button>
          <el-button type="primary" icon="EditPen" size="small" link @click="editResourceModel(scope.row)">修改</el-button>
          <el-popconfirm title="是否删除所勾选的分类项?" @confirm="clearResourceModel(scope.row.id)">
            <template #reference>
              <el-button type="danger" icon="DeleteFilled" size="small" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 模块新增 & 模块修改 -->
    <el-dialog
      v-model="moduleVisible"
      :title="moduleMode === 'insert' ? '新增模块' : '编辑模块'"
      width="30%"
    >
      <el-form>
        <div class="module-form">
          <el-form-item label="模块名">
            <el-input v-model="moduleName"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div class="control-btns">
        <el-button size="large" @click="moduleCancelClick">取消</el-button>
        <el-button type="primary" size="large" @click="moduleSave">{{ moduleMode === 'insert' ? '确定' : '编辑' }}</el-button>
      </div>
    </el-dialog>

    <!-- 资源新增 & 资源修改 -->
    <el-dialog
      v-model="resourceVisible"
      :title="resourceMode === 'insert' ? '新增资源' : '编辑资源'"
      width="30%"
    >
      <el-form :labelWidth="70" ref="formRef" :model="resourceModel">
        <div class="module-form">
          <el-form-item label="资源名" prop="name">
            <el-input v-model="resourceModel.name"></el-input>
          </el-form-item>
          <el-form-item label="资源路径" prop="url">
            <el-input v-model="resourceModel.url"></el-input>
          </el-form-item>
          <el-form-item label="请求方式" prop="method">
            <el-radio-group v-model="resourceModel.method">
              <el-radio label="GET">GET</el-radio>
              <el-radio label="POST">POST</el-radio>
              <el-radio label="PUT">PUT</el-radio>
              <el-radio label="DELETE">DELETE</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>
      <div class="control-btns">
        <el-button size="large" @click="resourceCancelClick(formRef)">取消</el-button>
        <el-button type="primary" size="large" @click="resourceSave">{{ resourceMode === 'insert' ? '确定' : '编辑' }}</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import type { IResourceLeaf } from './types'
import type { FormInstance } from 'element-plus'
import showMsg from '@/utils/message/message';
import {
  queryResourceTree,
  updateAnonState,
  insertResourceModule,
  updateResourceModel,
  deleteResourceModel
} from '@/service/common/authorization'

const formRef = ref()
const resourceTree = ref<IResourceLeaf[]>()
const keyword = ref<string>()
const moduleMode = ref('insert')
const resourceMode = ref('insert')
const moduleVisible = ref(false)
const resourceVisible = ref(false)
const curResource = ref<IResourceLeaf>()
const expandIconEls = ref<HTMLElement[]>()
const moduleName = ref('')
const resourceModel = reactive({
  name: '',
  url: '',
  method: ''
})

/**
 * 方法类型转为Tag Type类型
 */
const methodMapType = computed(() => {
  return (method: string) => {
    switch (method) {
      case 'GET':
        return ''
      case 'POST':
        return 'warning'
      case 'DELETE':
        return 'danger'
      case 'PUT':
        return 'success'
    }
  }
})
/**
 * 日期格式化
 */
const trimDateFormat = computed(() => {
  return (date: string) => {
    if (date)
      return date.split(' ')[0]
    else
      return '未知'
  }
})

/**
 * 表格行点击回调
 * @param row 当前行数据
 * @param column 列名数据
 * @param event 其他事件
 */
const handleTableCellClick = (row: IResourceLeaf, column: any, event: any) => {
  if (column.property === 'setting') return
  // 首次点击获取所有展开按钮Dom
  if (!expandIconEls.value)
    expandIconEls.value = (document.querySelectorAll('.el-table__expand-icon') as unknown) as HTMLElement[]
  const rowNum = resourceTree.value?.filter((item: IResourceLeaf) => {
    if (item.children.length > 0)
      return item
  }).indexOf(row) as number
  expandIconEls.value[rowNum].click() // 点击当前行的展开按钮
}

/**
 * 新增模块按钮
 */
const addClick = () => {
  moduleMode.value = 'insert'
  moduleVisible.value = true
}

/**
 * 新增资源按钮
 */
const resourceClick = (resource: IResourceLeaf) => {
  resourceMode.value = 'insert'
  resourceVisible.value = true
  curResource.value = resource // 存储当前选中模块
}

/**
 * 关闭对话框
 */
const moduleCancelClick = () => {
  moduleVisible.value = false
  moduleName.value = ''
}
const resourceCancelClick = (formEl: FormInstance) => {
  if (formEl) {
    formEl.resetFields()
  }
  resourceVisible.value = false
}

/**
 * 新增父模块 or 修改 parentId: 0
 */
const moduleSave = () => {
  if (!moduleName.value) {
    showMsg('warning', '未填写模块名')
    return
  }
  if (moduleName.value === curResource.value?.resourceName) { // 判断模块名是否有变化
    showMsg('warning', '模块名没有变化')
    return
  }

  let parentId = 0
  let name = moduleName.value

  if (moduleMode.value === 'insert') {
    insertResourceModule(parentId, name)
      .then((result) => {
        if (result.code === 2001) {
          showMsg('success', '新增成功')
          refreshPage()
          moduleCancelClick()
        }
      })
  } else {
    updateResourceModel(
      curResource.value!?.id,
      moduleName.value
    ).then((result) => {
      if (result.code === 2001) {
        showMsg('success', '修改成功')
        refreshPage()
        moduleCancelClick()
      }
    })
  }
}

/**
 * 添加子资源
 */
const resourceSave = () => {
  if (!resourceModel.name || !resourceModel.url || !resourceModel.method) {
    showMsg('warning', '信息未填写完整')
    return
  }

  if (resourceMode.value === 'insert') {
    insertResourceModule(
      curResource.value?.id!,
      resourceModel.name,
      resourceModel.method,
      resourceModel.url
    ).then((result) => {
      if (result.code === 2001) {
        showMsg('success', '添加成功')
        refreshPage()
        resourceCancelClick(formRef.value)
      }
    })
  } else {
    updateResourceModel(
      curResource.value?.id!,
      resourceModel.name,
      resourceModel.method,
      resourceModel.url
    ).then((result) => {
      if (result.code === 2001) {
        showMsg('success', '修改成功')
        refreshPage()
        resourceCancelClick(formRef.value)
      }
    })
  }
}

/**
 * 修改模块和资源
 * @param resource 当前行资源
 */
const editResourceModel = (resource: IResourceLeaf) => {
  curResource.value = resource
  // 判断当前是选中模块还是子资源
  if (resource.url === null) {
    moduleMode.value = 'update'
    moduleName.value = resource.resourceName
    moduleVisible.value = true
  } else {
    resourceMode.value = 'update'
    resourceModel.method = resource.requestMethod
    resourceModel.name = resource.resourceName
    resourceModel.url = resource.url
    resourceVisible.value = true
  }
}

// TODO:删除请求后端报错
/**
 * 删除资源
 * @param id 资源ID
 */
const clearResourceModel = (id: number) => {
  deleteResourceModel(id)
    .then((result) => {
      if (result.code === 2001) {
        showMsg('success', '删除成功')
        refreshPage()
        resourceCancelClick(formRef.value)
      }
    })
}

/**
 * 按钮状态回调
 * @param status 匿名状态
 */
const handleSwitchChange = (status: boolean) => {
  return (id: number) => {
    updateAnonState(id, status)
      .then((result) => {
        if (result.code === 2001) {
          showMsg('success', status ? '开启成功': '关闭成功')
        }
      })
  }
}

/**
 * 查询按钮点击
 */
const searchClick = () => {
  refreshPage(keyword.value, true)
}

const refreshPage = (keyword?: string, isShowMsg: boolean = false) => {
  queryResourceTree(keyword)
    .then((result) => {
      resourceTree.value = result.data
      if (result.code === 2001 && isShowMsg)
        showMsg('success', '查询成功')
    })
}
refreshPage()
</script>

<style lang="less" scoped>
.module-form {
  padding: 10px 20px;
}
</style>
