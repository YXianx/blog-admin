<template>
  <el-card>
    <div class="card-title">
      操作日志
    </div>

    <div class="search-control">
      <div class="left">
      </div>
      <div class="right">
        <el-input placeholder="请输入模块名或描述" v-model="keyword">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-button type="primary" icon="Search" @click="searchClick">搜索</el-button>
      </div>
    </div>

    <el-table :data="operationList">
      <!-- <el-table-column type="selection" align="center"></el-table-column> -->
      <el-table-column label="系统模块" prop="optModule" width="120" align="center"></el-table-column>
      <el-table-column label="操作类型" prop="optType" width="80" align="center">
        <template #default="scope">
          <el-tag round size="large" :type="methodTextMapType(scope.row.optType)">{{ scope.row.optType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作描述" prop="optDesc" width="180" align="center"></el-table-column>
      <el-table-column label="请求方式" prop="requestMethod" align="center">
        <template #default="scope">
          <div style="margin: 5px 0;">
            <el-tag :type="methodMapType(scope.row.requestMethod)" size="large">{{ scope.row.requestMethod }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作人员" prop="nickname" align="center"></el-table-column>
      <el-table-column label="登录IP" prop="ipAddress" width="130" align="center"></el-table-column>
      <el-table-column label="登录地址" prop="ipSource" width="210" align="center">
        <template #default="scope">
          {{ formatIpAdress(scope.row.ipSource) }}
        </template>
      </el-table-column>
      <el-table-column label="操作日期" prop="createTime" width="180" align="center">
        <!-- <template #default="scope">
          <div style="display: flex; align-items: center; justify-content: center;">
            <el-icon style="margin: 0px 5px;"><Clock /></el-icon>
          </div>
        </template> -->
        <!-- {{ scope.row.createTime }} -->
      </el-table-column>
      <el-table-column label="操作" width="80" align="center">
        <template #default="scope">
          <el-button type="primary" icon="View" size="small" link @click="reviewClick(scope.row)">查看</el-button>
          <!-- <el-popconfirm title="是否删除所选的日志?" @confirm="clearClick(scope.row.id)">
            <template #reference>
              <el-button type="danger" icon="Delete" size="small" link>删除</el-button>
            </template>
          </el-popconfirm> -->
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

    <el-dialog width="60%" v-model="detailVisible">
      <template #header>
        <div style="display: flex; align-items: center;">
          <el-icon style="margin-right: 5px; font-size: 20px;"><View /></el-icon>
          <span>详细信息</span>
        </div>
      </template>
      <el-form>
        <div class="form">
          <el-row>
            <el-col :span="8">
              <el-form-item label="操作模块">
              {{ detailModel.optModule }}
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="请求地址">
                {{ detailModel.optUrl }}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="请求方式">
                {{ detailModel.requestMethod }}
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="操作方法">
                {{ detailModel.optMethod }}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="请求参数">
                {{ detailModel.requestParam }}
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="操作人员">
                {{ detailModel.nickname }}
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="返回数据">
            <div id="responseView">
            </div>
            <div style="background: #787878; color: #fff;">
              {{ detailModel.responseData }}
            </div>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
// TODO:删除日志的功能暂无
import { ref, reactive, nextTick } from 'vue'
import { View } from '@element-plus/icons-vue'
import { queryOperationList } from '@/service/common/log'
import { methodMapType, methodTextMapType } from '@/utils/global/method-map-type'
import useJsonToDom from '@/hook/useJsonToDom'
import type { IOperationItem, IOperationDetail } from './types'

const operationList = ref<IOperationItem[]>()
const currentPage = ref<number>(1)
const pageSize = ref<number>(10)
const totalData = ref<number>(0)
const keyword = ref<string>()
const detailVisible = ref<boolean>(false)
const detailModel = reactive({
  optModule: '',
  optUrl: '',
  requestMethod: '',
  optMethod: '',
  requestParam: '',
  responseData: '',
  nickname: ''
})

const searchClick = () => {
  currentPage.value = 1 // 从第一页起搜索
  refreshPage()
}

/**
 * 查看
 * @param operation 日志信息
 */
const reviewClick = (operation: IOperationDetail) => {
  detailVisible.value = true
  detailModel.nickname = operation.nickname
  detailModel.optMethod = operation.optMethod
  detailModel.optModule = operation.optModule
  detailModel.optUrl = operation.optUrl
  detailModel.requestMethod = operation.requestMethod
  detailModel.requestParam = operation.requestParam
  detailModel.responseData = operation.responseData

  nextTick(() => {
    const responseViewEl = document.getElementById('responseView')
    console.log(responseViewEl);

    useJsonToDom(detailModel.responseData, responseViewEl!)
  })
}

/**
 * 删除
 * @param id 日志ID
 */
const clearClick = (id: number) => {

}

/**
 * 修改显示条数回调
 * @param size 显示条数
 */
const handleSizeChange = (size: number) => {
  pageSize.value = size
  refreshPage()
}

/**
 * 修改当前页回调
 * @param current 当前页
 */
const handleCurrentChange = (current: number) => {
  currentPage.value = current
  refreshPage()
}

/**
 * 登录地址格式转换 (xxx|xxx|xx| 转为 xxxxx xx)
 * @param ipSource IP登录地址
 */
const formatIpAdress = (ipSource: string) => {
  if (!ipSource) {
    return '未知'
  }
  const words = ipSource.split('|') // 中国｜联通｜广东省｜深圳市｜龙华区
  const operator = words[1]
  const source = words.slice(words.indexOf(words[2]), words.length).join('')
  return source + ' ' + operator  // 广东省深圳市龙华区 联通
}

/**
 * 动态渲染
 * @param current 当前页
 * @param size 显示条数
 * @param keyword 关键字
 */
const refreshPage = () => {
  queryOperationList(currentPage.value, pageSize.value, keyword.value)
    .then((result) => {
      operationList.value = result.data.records
      currentPage.value = result.data.current
      pageSize.value = result.data.size
      totalData.value = result.data.total
    })
}
refreshPage()
</script>

<style lang="less" scoped>
.form {
  padding: 10px 20px;
}
</style>
