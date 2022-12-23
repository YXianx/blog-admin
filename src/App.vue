<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="less">
// reset 第三方组件样式修改
// 1、Calendar Heatmap
.vch__legend {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    div {
      margin: 0 10px;
    }
}

// 2、el-upload
.el-upload-dragger {
  padding: 10px !important;
}
// reset end

// common
.card-title {
  font-size: 17px;
  font-weight: 700;
  color: #333;
  position: relative;
  margin: 0px 10px 10px 10px;

  &::before {
    content: '';
    position: absolute;
    left: -10px;
    width: 4px;
    height: 100%;
    background-color: #409eff;
  }
}
.pagination-container { // 页码
  margin: 20px 0;
  float: right;
}
.control-btns { // 对话框按钮
  display: flex;
  justify-content: flex-end;
}
.search-control { // 搜索栏目
  display: flex;
  justify-content: space-between;
  margin: 24px 0px 20px 0px;
  .left {
    display: flex;
    .el-select, .el-input {
      margin-right: 10px;
    }
  }
  .right {
    display: flex;
    button {
      margin-left: 10px;
    }
  }
}
// common end

.app {
  width: 100%;
  height: 100vh;
  background-color: #f7f9fb;
}
</style>
