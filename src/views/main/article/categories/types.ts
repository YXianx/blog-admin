import type { IResult } from '@/types/common'

interface ICategoryItem {
  categoryName: string
  createTime: string
  id: number
  updateTime: string
}
interface ICategoryData {
  records: ICategoryItem[]
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

type ICategoriesData = IResult<ICategoryData>

export type {
  ICategoriesData,
  ICategoryItem
}
