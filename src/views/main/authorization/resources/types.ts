export interface IResourceLeaf {
  id: number;
  resourceName: string;
  url: string;
  requestMethod: string;
  parentId?: any;
  anon: boolean;
  createTime: string;
  updateTime?: any;
  children: any[];
}
