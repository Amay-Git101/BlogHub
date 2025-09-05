import { Timestamp } from "firebase/firestore";

export interface Follow {
  id: string;
  followerId: string; // The user who is doing the following
  followingId: string; // The user who is being followed
  createdAt: Timestamp;
}