import { IResult, commentQueryType } from "@/types/common";
import { yxRequest } from "..";

/**
 * 查询评论分页
 * @param query 查询条件
 */
export function queryCommentList(query: commentQueryType) {
  return yxRequest.get<IResult>({
    url: '/admin/comments/listPage',
    params: {
      ...query
    }
  })
}

/**
 * 删除评论
 * @param ids ID集合
 */
export function delComment(ids: number[]) {
  return yxRequest.delete<IResult>({
    url: '/admin/comments/delete',
    data: ids
  })
}

/**
 * 审核评论
 * @param ids ID集合
 */
export function reviewComment(ids: number[]) {
  return yxRequest.post<IResult>({
    url: '/admin/comments/review',
    data: {
      ids,
      isReview: true
    }
  })
}


