import { yxRequest } from "..";
import type { IResult } from '@/types/common'
import type { IMenuModel } from '@/views/main/authorization/menus/types'

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
export function queryMenuTree(keyword?: string) {
  return yxRequest.get<IResult>({
      url: '/admin/menus/treeList',
      params: {
        keyword
      }
  })
}

/**
 * 获取资源树
 */
export function queryResourceTree<T = IResult>(keyword?: string) {
  return yxRequest.get<T>({
    url: '/admin/resources/treeList',
    params: {
      keyword
    }
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

/**
 * 更新匿名访问状态
 * @param id 资源项ID
 * @param status 匿名状态
 */
export function updateAnonState(id: number, status: boolean) {
  return yxRequest.post<IResult>({
    url: '/admin/resources/update/status',
    data: {
      id,
      status
    }
  })
}

/**
 * 新增资源
 * @param parentId 父模块ID
 * @param url 请求路径
 * @param requestMethod 请求类型
 * @param name 模块名称
 */
export function insertResourceModule(parentId: number, name: string, requestMethod?: string, url?: string) {
  return yxRequest.post<IResult>({
    url: '/admin/resources/insert',
    data: {
      parentId,
      url,
      requestMethod,
      name
    }
  })
}

/**
 * 修改资源
 * @param id 资源ID
 * @param name 资源名称
 * @param requestMethod 请求方式
 * @param url 请求地址
 */
export function updateResourceModel(id: number, name: string, requestMethod?: string, url?: string) {
  return yxRequest.post<IResult>({
    url: '/admin/resources/update',
    data: {
      id,
      name,
      requestMethod,
      url
    }
  })
}

/**
 * 删除资源
 * @param id 资源ID
 */
export function deleteResourceModel(id: number) {
  return yxRequest.delete<IResult>({
    url: '/admin/resources/delete',
    headers: { // 修改请求头，否则后端会报 Required request body is missing 没有主体的错误
      "Content-Type": "application/json"
    },
    data: id
  })
}

/**
 * 增加菜单
 * @param menuModel 菜单信息
 */
export function insertMenus(menuModel: IMenuModel) {
  return yxRequest.post<IResult>({
    url: '/admin/menus/insert',
    data: menuModel
  })
}

/**
 * 更新菜单
 * @param menuModel 菜单信息
 */
export function updateMenus(menuModel: IMenuModel) {
  return yxRequest.post<IResult>({
    url: '/admin/menus/update',
    data: menuModel
  })
}

/**
 * 更新隐藏状态
 * @param id 菜单ID
 * @param status 隐藏状态
 */
export function updateHiddenStatus(id: number, status: boolean) {
  return yxRequest.post<IResult>({
    url: '/admin/menus/update/status',
    data: {
      id,
      status
    }
  })
}

/**
 * 删除菜单
 * @param id 菜单ID
 */
export function deleteMenus(id: number) {
  return yxRequest.delete({
    url: '/admin/menus/delete',
    headers: {
      'Content-Type': 'application/json'
    },
    data: id
  })
}
