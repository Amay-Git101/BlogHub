export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  createdAt: Date;
  postsCount: number;
}

export interface UserFormData {
  name: string;
  email: string;
  bio?: string;
}