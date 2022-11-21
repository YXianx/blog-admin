<template>
  <div class="sys">
    <div class="cards">
      <el-row :gutter="25">
        <el-col :span="6">
          <el-card style="background: linear-gradient(to right, #5466F2, #B672F7)">
            <div class="card-info">
              <div class="header">
                <div class="mask">
                  <el-icon><Histogram /></el-icon>
                </div>
                <div class="title">访问量</div>
              </div>
              <div class="data">
                <div class="num">
                  3750
                  <span class="unit">次</span>
                </div>
              </div>
              <div class="data-change">
                <div class="yesterday-add">
                  <span>昨日访问量: 28</span>
                  <el-icon style="color: #7CD5EF"><CaretTop /></el-icon>
                </div>
                <div class="percent-add">
                  <span>增长: 6%</span>
                  <el-icon style="color: #CA3032"><CaretTop /></el-icon>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card style="background: linear-gradient(to right, #589FEF, #6973F4)">
            <div class="card-info">
              <div class="header">
                <div class="mask">
                  <el-icon style="color: #6898E8"><UserFilled /></el-icon>
                </div>
                <div class="title">用户量</div>
              </div>
              <div class="data">
                <div class="num">
                  1234
                  <span class="unit">位</span>
                </div>
              </div>
              <div class="data-change">
                <div class="yesterday-add">
                  <span>本周新增用户: 14</span>
                  <el-icon style="color: #7CD5EF"><CaretTop /></el-icon>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card style="background: linear-gradient(to right, #D26876, #E29465)">
            <div class="card-info">
              <div class="header">
                <div class="mask">
                  <el-icon style="color: #C67176"><Document /></el-icon>
                </div>
                <div class="title">文章数</div>
              </div>
              <div class="data">
                <div class="num">
                  24
                  <span class="unit">篇</span>
                </div>
              </div>
              <div class="data-change">
                <div class="yesterday-add">
                  <span>本月发布文章: 14</span>
                  <el-icon style="color: #7CD5EF"><CaretTop /></el-icon>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card style="background: linear-gradient(to right, #6EC997, #A3D86F)">
            <div class="card-info">
              <div class="header">
                <div class="mask">
                  <el-icon style="color: #88C897"><Comment /></el-icon>
                </div>
                <div class="title">留言量</div>
              </div>
              <div class="data">
                <div class="num">
                  140
                  <span class="unit">条</span>
                </div>
              </div>
              <div class="data-change">
                <div class="yesterday-add">
                  <span>新增留言: 28</span>
                  <el-icon style="color: #7CD5EF"><CaretTop /></el-icon>
                </div>
                <div class="percent-add">
                  <span>待审核: 8</span>
                  <el-icon style="color: #CA3032"><CaretTop /></el-icon>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-card style="margin: 20px 0">
      <div class="card-title">一周访问量</div>
      <div ref="visitsEChartRef" style="width: 100%; height: 350px"></div>
    </el-card>

    <el-card style="margin: 20px 0">
        <div class="card-title">文章贡献统计</div>
        <div>
        <CalendarHeatmap
          :style="{
            fontSize: '8px',
            width: '100%'
          }"
          :round="2"
          :values="mapValues"
          :end-date="new Date()"
        />
      </div>
    </el-card>

    <el-row style="margin: 20px 0">
      <el-col :span="16" style="padding-right: 10px">
        <el-card>
          <div class="card-title">文章浏览量排行</div>
          <div ref="articleVisitsEChartRef"  style="width: 100%; height: 350px"></div>
        </el-card>
      </el-col>
      <el-col :span="8" style="padding-left: 10px">
        <el-card>
          <div class="card-title">文章分类统计</div>
          <div ref="articleCategoryEChartRef"  style="width: 100%; height: 350px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin: 20px 0">
      <el-col :span="16" style="padding-right: 10px">
        <el-card>
          <div class="card-title">用户地域分布</div>
          <div class="user-type">
            <el-radio-group v-model="userType">
              <el-radio label="user">用户</el-radio>
              <el-radio label="visitor">游客</el-radio>
            </el-radio-group>
          </div>
          <div ref="mapEChartRef"  style="width: 100%; height: 350px"></div>
        </el-card>
      </el-col>
      <el-col :span="8" style="padding-left: 10px">
        <el-card>
          <div class="card-title">热门标签</div>
          <div class="tag-cloud">
            <TagCloud />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { EChartsOption } from 'echarts'
import useEcharts from '../../../hook/useEcharts'
import { CalendarHeatmap } from 'vue3-calendar-heatmap'
import { convertData } from '@/utils/map/convert-map-data'

import TagCloud from '@/components/tag-cloud.vue'

// 1、一周访问量图表
const visitsEChartRef = ref<HTMLElement>()
const visitsOption: EChartsOption = {
  grid: {
    top: "40px",
    left: "40px",
    right: "0px",
    bottom: "20px"
  },
  legend: {
    data: ['访问量']
  },
  // 鼠标选中数据标签显示
  tooltip: {
    // 触发方式，竖线方式触发
    trigger: 'axis',
    // 触发类型 xy轴线显示
    axisPointer: {
      type: 'cross'
    }
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '访问量',
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true
    }
  ]
}

// 2、文章浏览排行图表
const articleVisitsEChartRef = ref<HTMLElement>()
const articleVisitsOption: EChartsOption = {
  grid: {
    top: '50px',
    left: '30px',
    right: '10px',
    bottom: '20px'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['浏览量']
  },
  xAxis: {
    type: 'category',
    data: ['博客简介', 'Vue初体验', 'React和Vue的优劣', '深拷贝与浅拷贝', '手写防抖和节流', 'Naive UI初体验']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '浏览量',
      data: [120, 200, 150, 80, 70, 110],
      type: 'bar',

      barWidth: '15%',
      itemStyle: {
        color: '#8A95F2',
        borderRadius: [50, 50, 0, 0]
      },
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)',
        borderRadius: [50, 50, 0, 0]
      },
      showBackground: true,
      realtimeSort: true
    }
  ]
}

// 3、文章分类
const articleCategoryEChartRef = ref<HTMLElement>()
const articleCategoryOption: EChartsOption = {
  grid: {
    bottom: '100px'
  },
  legend: {
    top: 'bottom'
  },
  tooltip: {},
  series: [
    {
      name: 'Nightingale Chart',
      type: 'pie',
      radius: '60%',
      center: ['50%', '50%'],
      roseType: 'area',
      itemStyle: {
        borderRadius: 8
      },
      data: [
        { value: 40, name: 'vue' },
        { value: 28, name: '技术分享' },
        { value: 26, name: '个人感悟' },
        { value: 22, name: '日常碎碎念' },
        { value: 18, name: '多事之秋' }
      ]
    }
  ]
};

// 4、地图
const userType = ref<string>('user')
const mapEChartRef = ref<HTMLElement>()
const data = [{
        name: "海门",
        value: 9
    },
    {
        name: "鄂尔多斯",
        value: 12
    },
    {
        name: "招远",
        value: 12
    },
    {
        name: "舟山",
        value: 12
    },
    {
        name: "齐齐哈尔",
        value: 14
    },
    {
        name: "盐城",
        value: 15
    },
    {
        name: "赤峰",
        value: 16
    },
    {
        name: "青岛",
        value: 18
    },
    {
        name: "乳山",
        value: 18
    },
    {
        name: "金昌",
        value: 19
    },
    {
        name: "泉州",
        value: 21
    },
    {
        name: "莱西",
        value: 21
    },
    {
        name: "日照",
        value: 21
    },
    {
        name: "胶南",
        value: 22
    },
    {
        name: "南通",
        value: 23
    },
    {
        name: "拉萨",
        value: 24
    },
    {
        name: "云浮",
        value: 24
    },
    {
        name: "梅州",
        value: 25
    },
    {
        name: "文登",
        value: 25
    },
    {
        name: "上海",
        value: 25
    },
    {
        name: "攀枝花",
        value: 25
    },
    {
        name: "威海",
        value: 25
    },
    {
        name: "承德",
        value: 25
    },
    {
        name: "厦门",
        value: 26
    },
    {
        name: "汕尾",
        value: 26
    },
    {
        name: "潮州",
        value: 26
    },
    {
        name: "丹东",
        value: 27
    },
    {
        name: "太仓",
        value: 27
    },
    {
        name: "曲靖",
        value: 27
    },
    {
        name: "烟台",
        value: 28
    },
    {
        name: "福州",
        value: 29
    },
    {
        name: "瓦房店",
        value: 30
    },
    {
        name: "即墨",
        value: 30
    },
    {
        name: "抚顺",
        value: 31
    },
    {
        name: "玉溪",
        value: 31
    },
    {
        name: "张家口",
        value: 31
    },
    {
        name: "阳泉",
        value: 31
    },
    {
        name: "莱州",
        value: 32
    },
    {
        name: "湖州",
        value: 32
    },
    {
        name: "汕头",
        value: 32
    },
    {
        name: "昆山",
        value: 33
    },
    {
        name: "宁波",
        value: 33
    },
    {
        name: "湛江",
        value: 33
    },
    {
        name: "揭阳",
        value: 34
    },
    {
        name: "荣成",
        value: 34
    },
    {
        name: "连云港",
        value: 35
    },
    {
        name: "葫芦岛",
        value: 35
    },
    {
        name: "常熟",
        value: 36
    },
    {
        name: "东莞",
        value: 36
    },
    {
        name: "河源",
        value: 36
    },
    {
        name: "淮安",
        value: 36
    },
    {
        name: "泰州",
        value: 36
    },
    {
        name: "南宁",
        value: 37
    },
    {
        name: "营口",
        value: 37
    },
    {
        name: "惠州",
        value: 37
    },
    {
        name: "江阴",
        value: 37
    },
    {
        name: "蓬莱",
        value: 37
    },
    {
        name: "韶关",
        value: 38
    },
    {
        name: "嘉峪关",
        value: 38
    },
    {
        name: "广州",
        value: 38
    },
    {
        name: "延安",
        value: 38
    },
    {
        name: "太原",
        value: 39
    },
    {
        name: "清远",
        value: 39
    },
    {
        name: "中山",
        value: 39
    },
    {
        name: "昆明",
        value: 39
    },
    {
        name: "寿光",
        value: 40
    },
    {
        name: "盘锦",
        value: 40
    },
    {
        name: "长治",
        value: 41
    },
    {
        name: "深圳",
        value: 41
    },
    {
        name: "珠海",
        value: 42
    },
    {
        name: "宿迁",
        value: 43
    },
    {
        name: "咸阳",
        value: 43
    },
    {
        name: "铜川",
        value: 44
    },
    {
        name: "平度",
        value: 44
    },
    {
        name: "佛山",
        value: 44
    },
    {
        name: "海口",
        value: 44
    },
    {
        name: "江门",
        value: 45
    },
    {
        name: "章丘",
        value: 45
    },
    {
        name: "肇庆",
        value: 46
    },
    {
        name: "大连",
        value: 47
    },
    {
        name: "临汾",
        value: 47
    },
    {
        name: "吴江",
        value: 47
    },
    {
        name: "石嘴山",
        value: 49
    },
    {
        name: "沈阳",
        value: 50
    },
    {
        name: "苏州",
        value: 50
    },
    {
        name: "茂名",
        value: 50
    },
    {
        name: "嘉兴",
        value: 51
    },
    {
        name: "长春",
        value: 51
    },
    {
        name: "胶州",
        value: 52
    },
    {
        name: "银川",
        value: 52
    },
    {
        name: "张家港",
        value: 52
    },
    {
        name: "三门峡",
        value: 53
    },
    {
        name: "锦州",
        value: 54
    },
    {
        name: "南昌",
        value: 54
    },
    {
        name: "柳州",
        value: 54
    },
    {
        name: "三亚",
        value: 54
    },
    {
        name: "自贡",
        value: 56
    },
    {
        name: "吉林",
        value: 56
    },
    {
        name: "阳江",
        value: 57
    },
    {
        name: "泸州",
        value: 57
    },
    {
        name: "西宁",
        value: 57
    },
    {
        name: "宜宾",
        value: 58
    },
    {
        name: "呼和浩特",
        value: 58
    },
    {
        name: "成都",
        value: 58
    },
    {
        name: "大同",
        value: 58
    },
    {
        name: "镇江",
        value: 59
    },
    {
        name: "桂林",
        value: 59
    },
    {
        name: "张家界",
        value: 59
    },
    {
        name: "宜兴",
        value: 59
    },
    {
        name: "北海",
        value: 60
    },
    {
        name: "西安",
        value: 61
    },
    {
        name: "金坛",
        value: 62
    },
    {
        name: "东营",
        value: 62
    },
    {
        name: "牡丹江",
        value: 63
    },
    {
        name: "遵义",
        value: 63
    },
    {
        name: "绍兴",
        value: 63
    },
    {
        name: "扬州",
        value: 64
    },
    {
        name: "常州",
        value: 64
    },
    {
        name: "潍坊",
        value: 65
    },
    {
        name: "重庆",
        value: 66
    },
    {
        name: "台州",
        value: 67
    },
    {
        name: "南京",
        value: 67
    },
    {
        name: "滨州",
        value: 70
    },
    {
        name: "贵阳",
        value: 71
    },
    {
        name: "无锡",
        value: 71
    },
    {
        name: "本溪",
        value: 71
    },
    {
        name: "克拉玛依",
        value: 72
    },
    {
        name: "渭南",
        value: 72
    },
    {
        name: "马鞍山",
        value: 72
    },
    {
        name: "宝鸡",
        value: 72
    },
    {
        name: "焦作",
        value: 75
    },
    {
        name: "句容",
        value: 75
    },
    {
        name: "北京",
        value: 79
    },
    {
        name: "徐州",
        value: 79
    },
    {
        name: "衡水",
        value: 80
    },
    {
        name: "包头",
        value: 80
    },
    {
        name: "绵阳",
        value: 80
    },
    {
        name: "乌鲁木齐",
        value: 84
    },
    {
        name: "枣庄",
        value: 84
    },
    {
        name: "杭州",
        value: 84
    },
    {
        name: "淄博",
        value: 85
    },
    {
        name: "鞍山",
        value: 86
    },
    {
        name: "溧阳",
        value: 86
    },
    {
        name: "库尔勒",
        value: 86
    },
    {
        name: "安阳",
        value: 90
    },
    {
        name: "开封",
        value: 90
    },
    {
        name: "济南",
        value: 92
    },
    {
        name: "德阳",
        value: 93
    },
    {
        name: "温州",
        value: 95
    },
    {
        name: "九江",
        value: 96
    },
    {
        name: "邯郸",
        value: 98
    },
    {
        name: "临安",
        value: 99
    },
    {
        name: "兰州",
        value: 99
    },
    {
        name: "沧州",
        value: 100
    },
    {
        name: "临沂",
        value: 103
    },
    {
        name: "南充",
        value: 104
    },
    {
        name: "天津",
        value: 105
    },
    {
        name: "富阳",
        value: 106
    },
    {
        name: "泰安",
        value: 112
    },
    {
        name: "诸暨",
        value: 112
    },
    {
        name: "郑州",
        value: 113
    },
    {
        name: "哈尔滨",
        value: 114
    },
    {
        name: "聊城",
        value: 116
    },
    {
        name: "芜湖",
        value: 117
    },
    {
        name: "唐山",
        value: 119
    },
    {
        name: "平顶山",
        value: 119
    },
    {
        name: "邢台",
        value: 119
    },
    {
        name: "德州",
        value: 120
    },
    {
        name: "济宁",
        value: 120
    },
    {
        name: "荆州",
        value: 127
    },
    {
        name: "宜昌",
        value: 130
    },
    {
        name: "义乌",
        value: 132
    },
    {
        name: "丽水",
        value: 133
    },
    {
        name: "洛阳",
        value: 134
    },
    {
        name: "秦皇岛",
        value: 136
    },
    {
        name: "株洲",
        value: 143
    },
    {
        name: "石家庄",
        value: 147
    },
    {
        name: "莱芜",
        value: 148
    },
    {
        name: "常德",
        value: 152
    },
    {
        name: "保定",
        value: 153
    },
    {
        name: "湘潭",
        value: 154
    },
    {
        name: "金华",
        value: 157
    },
    {
        name: "岳阳",
        value: 169
    },
    {
        name: "长沙",
        value: 175
    },
    {
        name: "衢州",
        value: 177
    },
    {
        name: "廊坊",
        value: 193
    },
    {
        name: "菏泽",
        value: 194
    },
    {
        name: "合肥",
        value: 229
    },
    {
        name: "武汉",
        value: 273
    },
    {
        name: "大庆",
        value: 279
    }
]
const mapOption: EChartsOption = {
    backgroundColor: '#fff',
    tooltip: {
      trigger: 'item',
      formatter: function (params: any) {
        return params.name + ' : ' + params.value[2]
      }
    },
    visualMap: {
      min: 0,
      max: 200,
      left: 20,
      bottom: 20,
      calculable: true,
      text: ['高', '低'],
      inRange: {
        color: ['rgb(70, 240, 252)', 'rgb(250, 220, 46)', 'rgb(245, 38, 186)']
      },
      textStyle: {
        color: '#fff'
      }
    },
    // geo 地理编码
    geo: {
      map: 'china',
      roam: 'scale',
      emphasis: {
        areaColor: '#f4cccc',
        borderColor: 'rgb(9, 54, 95)',
        itemStyle: {
          areaColor: '#f4cccc'
        }
      }
    },
    series: [
      // 绘制展示数据
      {
        name: '销量',
        type: 'scatter',
        coordinateSystem: 'geo',  // 坐标系统 相对于geo
        data: convertData(data),
        symbolSize: 12,
        emphasis: {
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          }
        }
      },
      // 绘制地图数据
      {
        type: 'map',
        map: 'china',
        geoIndex: 0,
        aspectScale: 0.75,
        tooltip: {
          show: false
        }
      }
    ]
  }

// 贡献图
const mapValues = [
  { date: '2022-10-02', count: 6 },
  { date: '2022-11-02', count: 1 },
  { date: '2022-11-03', count: 4 },
  { date: '2022-11-04', count: 4 },
  { date: '2022-10-03', count: 5 },
  { date: '2022-7-03', count: 2 },
  { date: '2022-6-03', count: 5 },
  { date: '2022-5-03', count: 1 },
  { date: '2022-5-13', count: 5 },
]

onMounted(() => {
  // 防止获取不到DOM放在onMounted周期中执行，！担保一定有值
  useEcharts(visitsEChartRef.value!, visitsOption)
  useEcharts(articleVisitsEChartRef.value!, articleVisitsOption)
  useEcharts(articleCategoryEChartRef.value!,articleCategoryOption)
  useEcharts(mapEChartRef.value!,mapOption)
})

window.sessionStorage.setItem('myInfo', JSON.stringify({
  name: 'coder',
  age: 17
}))
</script>

<style scoped lang="less">
// common
.card-title {
  font-size: 15px;
  font-weight: 700;
  color: #333;
}
// common end

// home
.sys {
  width: 100%;
  // cards
  .cards {
    .card-info {
      // display: flex;
      // justify-content: space-between;
      .header {
        display: flex;
        align-items: center;
        .mask {
          width: 20px;
          height: 20px;
          background-color: #fff;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          i {
            width: 15px;
            height: 15px;
            color: #6067EA;
          }
        }
        .title {
          margin: 0 5px;
          color: #fff;
          font-size: 14px;
        }
      }
      .data {
        width: 100%;
        display: flex;
        justify-content: center;
        margin: 25px 0px 35px 0px;
        .num {
          color: #fff;
          font-weight: 700;
          font-size: 28px;
          letter-spacing: 0.05em;
          .unit {
            font-size: 10px;
          }
        }
      }
      .data-change {
        display: flex;
        justify-content: space-between;
        .yesterday-add, .percent-add {
          display: flex;
          align-items: center;
          color: #fff;
          font-size: 14px;
          i {
            font-size: 20px;
            margin: 0 6px;
          }
        }
      }
    }
  }
  // cards end

  // week-visit
  .week-visit {
    width: 100%;
    margin: 20px 0;
    .title {
      font-size: 13px;
      color: #202a34;
      font-weight: 700;
    }
  }
  // week-visit end

  // heat-map
  .heat-map {
    margin: 20px 0;
  }
  // heat-map end

  // map
  .user-type {
    display: flex;
    justify-content: center;
  }
  // map end

  // tag-cloud
  .tag-cloud {
    width: 100%;
    height: 350px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  // tag-cloud end
}
</style>
