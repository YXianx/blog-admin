import type { AxiosRequestConfig, AxiosResponse } from 'axios'
interface YXRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptor?: YXRequestInterceptor<T>
}

interface YXRequestInterceptor<T = AxiosResponse> {
  reqInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  reqInterceptorCache?: (err: any) => any
  resInterceptor?: (res: T) => T
  resInterceptorCache?: (err: any) => any
}

export type {
  YXRequestConfig,
  YXRequestInterceptor
}
