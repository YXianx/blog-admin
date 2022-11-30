// 登录参数接口
interface Iaccount {
  userName: string,
  password: string
}

interface IMenuResult {
  flag: boolean,
  code: number,
  message: string,
  data: IUserMenu[]
}

// 路由文件接口
interface IRouteFile {
  path?: string,
  name?: string,
  component?: () => any
  children?: IRouteFile[]
  icon?: string
}

// 用户权限菜单接口
interface IUserMenu {
  children: IUserMenu[]
  component?: string,
  createTime?: string,
  hidden?: boolean,
  icon?: string,
  name?: string,
  orderNum?: number,
  path: string
}

export type {
  Iaccount,
  IMenuResult,
  IRouteFile,
  IUserMenu
}
