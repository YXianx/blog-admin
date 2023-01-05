export interface IMenuLeaf {
  id: number;
  name: string;
  icon: string;
  orderNum: number;
  path: string;
  component?: any;
  hidden: boolean;
  children: any[];
  createTime?: any;
}

export interface IMenuModel {
  id?: number,
  component: string,
  icon: string,
  isHidden: boolean,
  name: string,
  parentId?: number,
  path: string,
  orderNum: number
}
