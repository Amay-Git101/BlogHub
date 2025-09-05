export interface User {
  id: string;
  name: string | null;
  email: string | null;
  bio?: string;
  avatar?: string;
  createdAt: Date;
  postsCount: number;
  profileComplete: boolean;
  followersCount?: number;
  followingCount?: number;
}

export interface UserFormData {
  name: string;
  email: string;
  bio?: string;
}