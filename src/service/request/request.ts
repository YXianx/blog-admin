import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { YXRequestConfig, YXRequestInterceptor } from './type'


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
