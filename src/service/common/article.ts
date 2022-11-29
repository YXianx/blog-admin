import { yxRequest } from "..";

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
