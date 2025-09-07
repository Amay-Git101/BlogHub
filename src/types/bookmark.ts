import { Timestamp } from "firebase/firestore";

export interface Bookmark {
  id: string;
  userId: string;
  postId: string;
  createdAt: Timestamp;
  postTitle: string;
  postAuthor: string;
  postContent: string;
  postExcerpt?: string;
}