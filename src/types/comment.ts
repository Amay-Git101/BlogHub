import { Timestamp } from "firebase/firestore";

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  content: string;
  createdAt: Timestamp;
}

export interface CommentFormData {
  content: string;
}