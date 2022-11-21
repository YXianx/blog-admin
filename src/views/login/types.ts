// 登录参数接口
interface Iaccount {
  userName: string,
  password: string
}

// 登录响应数据接口
interface IResult {
  flag: boolean,
  code: number,
  message: string,
  data: string
}

// 路由文件接口
interface IRouteFile {
  path?: string,
  name?: string,
  component?: () => any
  children?: IRouteFile[]
}

export type {
  Iaccount,
  IResult,
  IRouteFile
}
