import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

import chinaMapData from '@/assets/json/china.json'

type themeType = 'light' | 'dark'
type RendererType = 'svg' | 'canvas'

// 注册地图
echarts.registerMap('china', chinaMapData)
const useEcharts = (el: HTMLElement, options: EChartsOption ,theme: themeType = 'light', renderer: RendererType = 'svg') => {
  const echartsInstance = echarts.init(el, theme, {
    renderer
  })

  echartsInstance.setOption(options)
}

export default useEcharts
