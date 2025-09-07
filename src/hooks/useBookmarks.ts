import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Bookmark } from '@/types/bookmark';
import { BlogPost } from '@/types/blog';

export const useBookmarks = () => {
  const { currentUser } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setBookmarks([]);
      setBookmarkedPostIds(new Set());
      setLoading(false);
      return;
    }

    const q = query(collection(db, "bookmarks"), where("userId", "==", currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userBookmarks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bookmark));
      setBookmarks(userBookmarks);
      setBookmarkedPostIds(new Set(userBookmarks.map(b => b.postId)));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const toggleBookmark = useCallback(async (post: BlogPost) => {
    if (!currentUser) return;

    const isBookmarked = bookmarkedPostIds.has(post.id);

    if (isBookmarked) {
      const bookmarkToRemove = bookmarks.find(b => b.postId === post.id);
      if (bookmarkToRemove) {
        await deleteDoc(doc(db, "bookmarks", bookmarkToRemove.id));
      }
    } else {
      await addDoc(collection(db, "bookmarks"), {
        userId: currentUser.uid,
        postId: post.id,
        postTitle: post.title,
        postAuthor: post.author,
        postContent: post.content,
        postExcerpt: post.excerpt,
        createdAt: serverTimestamp(),
      });
    }
  }, [currentUser, bookmarkedPostIds, bookmarks]);

  return { bookmarks, bookmarkedPostIds, toggleBookmark, loading };
};