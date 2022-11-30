interface IArticleModel {
  status: number,
  categoryId: number,
  content: string,
  cover: string,
  id: number,
  isTop: boolean,
  tagIds: number[],
  title: string,
  type: number
}
interface ICategoryItem {
  categoryName: string,
  createTime: string,
  id: number,
  updateTime: string
}
interface ITagItem {
  tagName: string,
  createTime?: string,
  id: number,
  updateTime?: string
}

export type {
  IArticleModel,
  ICategoryItem,
  ITagItem
}
