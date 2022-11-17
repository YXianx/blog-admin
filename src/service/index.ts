import YXRequest from "./request/request"

export const yxRequest = new YXRequest({
  baseURL: '/api',
  timeout: 10000,
  interceptor: {
    reqInterceptor: (config) => {
      return config
    },
    resInterceptor: (res) => {
      return res
    }
  }
})
