import { IResult, commentQueryType } from "@/types/common";
import { yxRequest } from "..";

export function queryCommentList(query: commentQueryType) {
  return yxRequest.get<IResult>({
    url: '/admin/comments/listPage',
    params: {
      ...query
    }
  })
}
