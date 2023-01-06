export interface IUserItem {
  avatar: string,
  createTime: string,
  id: number,
  ipAddress: string,
  ipSource: string,
  isEnabled: boolean,
  lastLoginTime: string,
  nickName: string,
  roles: IUserRole[],
  type: number
}

interface IUserRole {
  createTime: string,
  enable: boolean,
  id: number,
  label: string,
  menuIds: number[] | number,
  resourceIds: number[] | number,
  roleName: string,
  updateTime: string
}
