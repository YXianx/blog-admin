import { yxRequest } from "..";
import type { ICategoriesData } from '@/views/main/article/categories/types'
import type { ITagData } from '@/views/main/article/tags/types'
import { IResult } from "@/types/common";

/**
 * 查询文章列表
 * @param current 当前页
 * @param size 显示条目
 * @param keyword 关键词
 */
export function queryArticleList(current?: number, size?: number, keyword?: string) {
  return yxRequest.get<ITagData>({
    url: '/admin/articles/listPage',
    params: {
      current,
      size,
      keyword
    }
  })
}

/**
 *                Tag
 */
/**
 * 新增用户自定义标签
 * @param tagName 标签名
 */
export function insertUserTags(tagName: string) {
  return yxRequest.post<IResult>({
    url: '/admin/tags/insert',
    data: {
      tagName
    }
  })
}

/**
 * 管理员自定义标签
 * @param tagName 标签名
 * @returns
 */
export function insertTags(tagName: string) {
  return yxRequest.post<IResult>({
    url: '/admin/tags/insert',
    data: {
      tagName
    }
  })
}

/**
 * 修改标签
 * @param id 标签ID
 * @param tagName 新标签名
 * @returns
 */
export function updateTags(id: number, tagName: string) {
  return yxRequest.post<IResult>({
    url: '/admin/tags/update',
    data: {
      id,
      tagName
    }
  })
}

/**
 * 删除标签集合
 * @param ids 标签ID集合
 */
export function delTags(ids: number[]) {
  return yxRequest.delete<IResult>({
    url: '/admin/tags/delete',
    data: ids
  })
}

/**
 * 查询标签列表
 * @param current 当前页
 * @param size 显示条目
 * @param keyword 关键词
 */
export function queryTagList(current?: number, size?: number, keyword?: string) {
  return yxRequest.get({
    url: '/admin/tags/listPage',
    params: {
      current,
      size,
      keyword
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
