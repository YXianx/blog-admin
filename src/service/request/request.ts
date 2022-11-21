import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { YXRequestConfig, YXRequestInterceptor } from './type'

import showMsg from '@/utils/message/message'
import { ElMessage } from 'element-plus'

class YXRequest {
  instance: AxiosInstance
  interceptor?: YXRequestInterceptor

  constructor(config: YXRequestConfig) {
    this.instance = axios.create(config)
    this.interceptor = config.interceptor

    // 实例拦截
    this.instance.interceptors.request.use(
      this.interceptor?.reqInterceptor,
      this.interceptor?.reqInterceptorCache
    )
    this.instance.interceptors.response.use(
      this.interceptor?.resInterceptor,
      this.interceptor?.resInterceptorCache
    )

    // 全局默认拦截
    this.instance.interceptors.request.use(
      (config) => {
        return config
      },
      (cache) => {
        return cache
      }
    )
    this.instance.interceptors.response.use(
      (res) => {
        return res.data
      },
      (err) => {
        showMsg('error', '请求失败，请联系网站管理员')
        return err
      }
    )
  }

  request<T = any>(config: YXRequestConfig<T>): Promise<T> {
    return new Promise((resolve) => {
      this.instance.request<any, T>(config)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        resolve(err)
      })
    })
  }

  get<T = any>(config: YXRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'GET' })
  }

  post<T = any>(config: YXRequestConfig<T>): Promise<T> {
    return this.request<T>({ ...config, method: 'POST' })
  }
}

export default YXRequest
