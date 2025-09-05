export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  excerpt?: string;
}

export interface BlogFormData {
  title: string;
  content: string;
  author: string;
}