export interface IRoleItem {
    createTime: "2022-12-05 21:32:10",
    updateTime: "2022-12-05 21:32:10",
    id: 1,
    roleName: "管理员",
    label: "Admin",
    enable: false
}

export interface Tree {
    id: number
    label: string
    children?: Tree[]
}

export interface IRoleModel {
    name: string,
    label: string,
    menuIdList: number[]
}
