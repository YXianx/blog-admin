import { yxRequest } from "..";
import type { ICategoriesData } from '@/views/main/article/categories/types'

/**
 * 根据ID查询分类详情
 * @param id 分类ID
 */
export function queryCategoryById(id: number) {
  return yxRequest.get({
    url: `/admin/category/detail/${id}`
  })
}

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
 * 查询分类项列表
 * @param current 当前页
 * @param size 数据条目
 * @param keyword 关键词
 * @returns
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
