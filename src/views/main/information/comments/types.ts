export interface ICommentItem {
  id: number;
  replayId?: any;
  avatar: string;
  nickName: string;
  replyName?: string;
  articleTitle: string;
  createTime: string;
  isDelete?: boolean;
  isReview?: boolean
  type: number;
}
