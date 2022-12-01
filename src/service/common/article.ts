import { yxRequest } from "..";
import type { ICategoriesData } from '@/views/main/article/categories/types'
import { IResult } from "@/types/common";

/**
 *                Tag
 */
/**
 * 新增用户自定义标签
 * @param tagName 标签名
 */
export function insertUserTags(tagName: string) {
  return yxRequest.post({
    url: '/admin/tags/insert',
    data: {
      tagName
    }
  })
}

/**
 *                 Category
 */

/**
 * 根据ID查询分类详情
 * @param id 分类ID
 */
export function queryCategoryById(id: number) {
  return yxRequest.get<IResult>({
    url: `/admin/category/detail/${id}`
  })
}
/**
 * 查询分类项列表
 * @param current 当前页
 * @param size 数据条目
 * @param keyword 关键词
 */
export function queryCategoryPageList(current: number, size: number, keyword?: string) {
  return yxRequest.get<ICategoriesData>({
    url: '/admin/category/listPage',
    params: {
      current,
      keyword,
      size
    }
  })
}

/**
 * 新增分类
 * @param categoryName 分类名
 */
export function insertCategory(categoryName: string) {
  return yxRequest.post<IResult>({
    url: '/admin/category/insert',
    data: {
      categoryName
    }
  })
}

/**
 * 修改分类
 * @param id 分类ID
 * @param categoryName 分类名
 */
export function updateCategory(id: number, categoryName: string) {
  return yxRequest.post<IResult>({
    url: '/admin/category/update',
    data: {
      id,
      categoryName
    }
  })
}

/**
 * 批量删除
 * @param ids ID列表
 */
export function delCategory(ids: number[]) {
  return yxRequest.delete<IResult>({
    url: '/admin/category/delete',
    data: ids
  })
}
