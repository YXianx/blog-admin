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

export function delComment(ids: number[]) {
  return yxRequest.delete<IResult>({
    url: '/admin/comments/delete',
    data: ids
  })
}
