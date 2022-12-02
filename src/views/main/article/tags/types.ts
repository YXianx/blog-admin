import type { IResult } from '@/types/common'

interface ITagItem {
  id: number
  tagName: string
  createTime: string
  updateTime: string
}
interface ITagsData {
  records: ITagItem[]
  total: number,
  size: number,
  pages: number,
  current: number,
  orders: any[],
  optimizeCountSql: boolean,
  hitCount: boolean,
  countId: number,
  maxLimit: number,
  searchCount: boolean,
}

type ITagData = IResult<ITagsData>

export type {
  ITagData,
  ITagItem
}
