import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDocs,
  writeBatch,
  increment,
} from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/contexts/AuthContext';

export const useFollows = (targetUserId?: string | null) => {
  const { currentUser } = useAuth();
  const [followers, setFollowers] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setFollowing([]);
      setIsFollowing(false);
      setLoading(false);
      return;
    }

    // Get the list of users the current user is following
    const q = query(collection(db, "follows"), where("followerId", "==", currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userFollowing = snapshot.docs.map(doc => doc.data().followingId);
      setFollowing(userFollowing);
      if (targetUserId) {
        setIsFollowing(userFollowing.includes(targetUserId));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, targetUserId]);

  useEffect(() => {
    if (!targetUserId) {
        setFollowers([]);
        return;
    }
    // Get the list of followers for the target user
    const q = query(collection(db, "follows"), where("followingId", "==", targetUserId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const targetFollowers = snapshot.docs.map(doc => doc.data().followerId);
        setFollowers(targetFollowers);
    });

    return () => unsubscribe();
  }, [targetUserId]);


  const toggleFollow = useCallback(async () => {
    if (!currentUser || !targetUserId || currentUser.uid === targetUserId) return;

    const batch = writeBatch(db);
    const followerRef = doc(db, "users", currentUser.uid);
    const followingRef = doc(db, "users", targetUserId);

    if (isFollowing) {
      // Unfollow logic
      const followQuery = query(
        collection(db, "follows"),
        where("followerId", "==", currentUser.uid),
        where("followingId", "==", targetUserId)
      );
      const querySnapshot = await getDocs(followQuery);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      batch.update(followerRef, { followingCount: increment(-1) });
      batch.update(followingRef, { followersCount: increment(-1) });
    } else {
      // Follow logic
      batch.set(doc(collection(db, "follows")), {
        followerId: currentUser.uid,
        followingId: targetUserId,
        createdAt: serverTimestamp(),
      });
      batch.update(followerRef, { followingCount: increment(1) });
      batch.update(followingRef, { followersCount: increment(1) });
    }

    await batch.commit();
  }, [currentUser, targetUserId, isFollowing]);

  return { followers, following, isFollowing, toggleFollow, loading };
};