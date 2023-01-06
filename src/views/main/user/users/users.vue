<template>
  <el-card>
    <div class="card-title">
      用户列表
    </div>

    <div class="search-control">
      <div class="left"></div>
      <div class="right">
        <el-select v-model="type" placeholder="请选择登录方式" style="width: 200px;">
          <template #prefix>
            <el-icon>
              <Avatar />
            </el-icon>
          </template>
          <el-option label="QQ" :value="0">QQ</el-option>
          <el-option label="邮箱" :value="1">邮箱</el-option>
        </el-select>
        <el-input v-model="keyword" placeholder="请输入昵称" style="width: 200px;">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-button type="primary" icon="Search" @click="searchClick">搜索</el-button>
      </div>
    </div>

    <el-table :data="userList">
      <el-table-column label="头像" prop="avatar" align="center">
        <template #default="scope">
          <div class="avatar">
            <img :src="scope.row.avatar">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="昵称" prop="nickName"  align="center"></el-table-column>
      <el-table-column label="登录方式" prop="type"  align="center"></el-table-column>
      <el-table-column label="用户角色" prop="roles"  align="center">
        <template #default="scope">
          <template v-for="role in scope.row.roles">
            <el-tag style="margin: 5px 0;">{{ role.roleName }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="禁用" prop="isEnabled"  align="center">
        <template #default="scope">
          <el-switch v-model="scope.row.isEnabled" @change="handleSwitchChange($event)(scope.row.id)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="登录IP" prop="ipAddress" width="160"  align="center"></el-table-column>
      <el-table-column label="登录地址" prop="ipSource"  align="center"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"  align="center"></el-table-column>
      <el-table-column label="上次登录时间" prop="lastLoginTime"  align="center"></el-table-column>
      <el-table-column label="操作"  align="center">
        <template #default="scope">
          <el-button type="primary" icon="EditPen" size="small" link @click="editClick(scope.row)">编辑</el-button>
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

    <el-dialog title="编辑用户" v-model="userVisible" width="30%">
      <el-form ref="formRef" :model="userModel" labelWidth="60px">
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="userModel.nickName" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-checkbox-group v-model="userModel.roleIds">
              <template v-for="role in roles">
                <el-checkbox :label="role.id">{{ role.roleName }}</el-checkbox>
              </template>
            </el-checkbox-group>
        </el-form-item>
        <div class="control-btns" style="margin-top: 70px;">
          <el-button size="large" @click="updateCancelClick(formRef!)">取消</el-button>
          <el-button type="primary" size="large" @click="userInfoSave">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
// TODO:禁用操作后端暂未接口
import { ref, reactive } from 'vue'
import { FormInstance } from 'element-plus'
import { Avatar, Search } from '@element-plus/icons-vue'
import { queryUserList, updateUserData } from '@/service/common/user'
import { queryRoleList } from '@/service/common/authorization'
import type { IUserItem } from './types'
import type { IRoleItem } from '@/views/main/authorization/roles/types'
import showMsg from '@/utils/message/message'

const userList = ref<IUserItem[]>()
const roles = ref<IRoleItem[]>()
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const totalData = ref<number>(0)
const keyword = ref<string>('')
const type = ref<number>()
const userVisible = ref<boolean>(false)
const formRef = ref<FormInstance>()
const userModel = reactive({
  id: 0,
  nickName: '',
  roleIds: [0]
})
/**
 * 搜索按钮
 */
const searchClick = () => {
  currentPage.value = 1
  refreshPage(true)
}

/**
 * 编辑按钮
 * @param user 用户信息
 */
const editClick = (user: IUserItem) => {
  if (user) {
    userModel.id = user.id
    userModel.nickName = user.nickName
    const roleIds = user.roles.map((role) => {
      return role.id
    })
    userModel.roleIds = roleIds
  }
  userVisible.value = true
}

const userInfoSave = () => {
  if (userModel.id === 0 || userModel.nickName === '' || userModel.roleIds.length <= 0) {
    showMsg('warning', '用户信息未填写完整')
    return
  }
  updateUserData(userModel.id, userModel.nickName, userModel.roleIds)
    .then((result) => {
      if (result.code === 2001) {
        showMsg('success', '编辑成功')
        updateCancelClick(formRef.value!)
        refreshPage()
      }
    })
}

/**
 * 修改窗体取消按钮
 * @param formEl 表单对象
 */
const updateCancelClick = (formEl: FormInstance) => {
  if (formEl) {
    formEl.resetFields()
  }
  userVisible.value = false
}

/**
 * 显示条数回调
 * @param size 条目数
 */
const handleSizeChange = (size: number) => {
  pageSize.value = size
  refreshPage()
}
/**
 * 页码回调
 * @param current 当前页
 */
const handleCurrentChange = (current: number) => {
  currentPage.value = current
  refreshPage()
}
/**
 * 禁用按钮回调
 * @param status 禁用状态
 */
const handleSwitchChange = (status: number) => {
  return (id: number) => {
    console.log(id, status);
  }
}

/**
 * 动态渲染
 */
const refreshPage = (isShowMsg: boolean = false) => {
  queryUserList(currentPage.value, pageSize.value, keyword.value, type.value)
    .then((result) => {
      userList.value = result.data.records
      currentPage.value = result.data.current
      pageSize.value = result.data.size
      totalData.value = result.data.total

      if (result.code === 2001 && isShowMsg)
        showMsg('success', '查询成功')
    })
}

const init = () => {
  // 1、请求用户列表
  refreshPage()
  // 2、请求角色列表
  queryRoleList()
    .then((result) => {
      roles.value = result.data.records
    })
}
init()
</script>

<style lang="less" scoped>
.avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}
</style>
