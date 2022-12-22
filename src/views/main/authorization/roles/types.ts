export interface IRoleItem {
    createTime: string,
    updateTime: string,
    id: 1,
    roleName: "管理员",
    label: "Admin",
    enable: false,
    resourceIds: number[],
    menuIds: number[]
}

export interface Tree {
    id: number
    label: string
    children?: Tree[]
}

export interface IRoleModel {
    name: string,
    label: string,
    menuIdList: number[],
    resourceIdList: number[]
}
