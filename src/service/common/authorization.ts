import { yxRequest } from "..";
import type { IResult } from '@/types/common'

/**
 * 角色列表
 * @param current 当前页
 * @param size 显示条数
 * @param keyword 关键词
 */
export function queryRoleList(current: number = 1, size: number = 5, keyword?: string) {
    return yxRequest.get<IResult>({
        url: '/admin/roles/listPage',
        params: {
            current,
            size,
            keyword
        }
    })
}

/**
 * 获取菜单树
 */
export function queryMenuTree() {
  return yxRequest.get<IResult>({
      url: '/admin/menus/treeList'
  })
}

/**
 * 获取资源树
 */
export function queryResourceTree() {
  return yxRequest.get<IResult>({
    url: '/admin/resources/treeList'
  })
}

/**
 * 添加角色
 * @param name 角色名
 * @param label 权限标签
 * @param ids 菜单ID
 */
export function insertRole(name: string, label: string, ids: number[]) {
    return yxRequest.post<IResult>({
        url: '/admin/roles/insert',
        data: {
            name,
            label,
            ids
        }
    })
}

/**
 * 批量删除
 * @param ids ID集合
 */
export function deleteRole(ids: number[]){
    return yxRequest.delete<IResult>({
        url: '/admin/roles/delete',
        data: ids
    })
}

/**
 * 更改角色状态
 * @param id 角色ID
 * @param status 状态
 * @returns
 */
export function updateStatus(id: number, status: boolean) {
    return yxRequest.post<IResult>({
        url: '/admin/roles/update/status',
        data: {
            id,
            status
        }
    })
}

/**
 * 更新角色菜单树
 * @param id 角色ID
 * @param ids 菜单ID集合
 * @param name 角色名
 * @param label 权限标签
 * @returns
 */
export function updateMenu(id: number, ids: number[], name: string, label: string) {
    return yxRequest.post<IResult>({
        url: '/admin/roles/alloc/menu',
        data: {
            id,
            ids,
            name,
            label
        }
    })
}

/**
 * 更新角色资源树
 * @param id 角色ID
 * @param ids 菜单ID集合
 * @param name 角色名
 * @param label 权限标签
 * @returns
 */
export function updateResource(id: number, ids: number[], name: string, label: string) {
  return yxRequest.post<IResult>({
    url: '/admin/roles/alloc/resource',
    data: {
      id,
      ids,
      name,
      label
    }
  })
}
