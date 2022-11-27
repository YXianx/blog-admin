interface categoryItem {
  categoryName?: string
  createTime?: string
  id?: number
  updateTime?: string
}
interface tagItem {
  tagName?: string
  createTime?: string
  id?: number
  updateTime?: string
}
interface ISelectOption {
  category: categoryItem[],
  tags: tagItem[]
}
interface IArticleItem {
  categoryName: string,
  cover: string,
  createTime: string,
  id: number,
  isTop: number,
  readCount: number,
  tagNames: string,
  title: string
}

export type {
  categoryItem,
  tagItem,
  ISelectOption,
  IArticleItem
}
