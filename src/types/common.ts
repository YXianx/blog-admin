/**
 * 请求响应数据基础格式
 */
interface IResult<T = any> {
  flag: boolean,
  code: number,
  message: string,
  data: T
}

/**
 * status-menu.vue 标签项类型
 */
type tagMenuType = { tagName: string, status?: number }


/**
 * 评论查询接口
 */
type commentQueryType = {
  current: number,
  isReview?: number | string,
  keyword?: string,
  type?: number | string,
  size: number
}

export type {
  IResult,
  tagMenuType,
  commentQueryType
}
