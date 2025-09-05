import { Timestamp } from "firebase/firestore";

export interface Bookmark {
  id: string; // Will be postId for simplicity
  userId: string;
  postId: string;
  createdAt: Timestamp;
  postTitle: string;
  postAuthor: string;
}