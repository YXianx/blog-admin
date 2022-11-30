/**
 * 请求响应数据基础格式
 */
interface IResult<T = any> {
  flag: boolean,
  code: number,
  message: string,
  data: T
}

export type {
  IResult
}
