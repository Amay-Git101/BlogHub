import { Timestamp } from "firebase/firestore";

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string; // To link back to the user
  createdAt: Date;
  updatedAt: Date;
  excerpt?: string;
  commentCount?: number;
}

export interface BlogFormData {
  title: string;
  content: string;
  author: string;
  authorId: string;
}