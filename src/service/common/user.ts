import { IResult } from "@/types/common";
import { yxRequest } from "..";

/**
 * 用户列表
 * @param current 当前页
 * @param size 显示条数
 * @param keyword 关键字
 * @param type 登录类型
 * @returns
 */
export function queryUserList(current?: number, size?: number, keyword?: string, type?: number) {
  return yxRequest.get<IResult>({
    url: '/admin/user/listPage',
    params: {
      current,
      size,
      keyword,
      type
    }
  })
}

/**
 * 用户编辑
 * @param id 用户ID
 * @param nickName 用户昵称
 * @param roleIds 用户角色
 * @returns
 */
export function updateUserData(id: number, nickName: string, roleIds: number[]) {
  return yxRequest.post<IResult>({
    url: '/admin/user/update',
    data: {
      id,
      nickName,
      roleIds
    }
  })
}

/**
 * 用户状态切换
 * @param id 用户ID
 * @param status 禁用状态
 * @returns
 */
export function  updateUserStatus(id: number, status: boolean) {
  return yxRequest.post<IResult>({
    url: '/admin/user/update/status',
    data: {
      id,
      status
    }
  })
}
