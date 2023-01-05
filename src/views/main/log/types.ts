/**
 * 日志项数据接口
 */
export interface IOperationItem {
  createTime: string,
  exceptionDetail: string,
  id: number,
  ipAddress: string,
  ipSource: string,
  nickname: string,
  optDesc: string,
  optMethod: string,
  optModule: string,
  optType: string,
  optUrl: string,
  requestMethod: string,
  requestParam: string,
  responseData: string,
  type: number,
  userId: number,
}

/**
 * 日志详情接口
 */
export interface IOperationDetail {
  optModule: string,
  optUrl: string,
  requestMethod: string,
  optMethod: string,
  requestParam: string,
  responseData: string,
  nickname: string
}
