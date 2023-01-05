import { IResult } from "@/types/common";
import { yxRequest } from "..";

/**
 * 查询操作日志分页
 * @param current 当前页
 * @param size 显示条数
 * @param keyword 关键词
 * @returns
 */
export function queryOperationList(current: number = 1, size: number = 5, keyword?: string) {
  return yxRequest.get<IResult>({
    url: '/admin/operation/listPage',
    params: {
      current,
      size,
      keyword
    }
  })
}
