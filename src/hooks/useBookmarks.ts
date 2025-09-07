import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Bookmark } from '@/types/bookmark';
import { BlogPost } from '@/types/blog';
import { useToast } from '@/components/ui/use-toast';

export const useBookmarks = () => {
  const { currentUser } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
    }, (error) => {
      console.error("Error fetching bookmarks: ", error);
      toast({ title: "Error", description: "Could not fetch bookmarks.", variant: "destructive" });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, toast]);

  const toggleBookmark = useCallback(async (post: BlogPost) => {
    if (!currentUser) {
      toast({ title: "Authentication Error", description: "You must be logged in to bookmark posts.", variant: "destructive" });
      return;
    }

    const isBookmarked = bookmarkedPostIds.has(post.id);

    if (isBookmarked) {
      try {
        const bookmarkToRemove = bookmarks.find(b => b.postId === post.id);
        if (bookmarkToRemove) {
          await deleteDoc(doc(db, "bookmarks", bookmarkToRemove.id));
          toast({ description: "Bookmark removed." });
        }
      } catch (error) {
        console.error("Error removing bookmark: ", error);
        toast({ title: "Error", description: "Could not remove bookmark.", variant: "destructive" });
      }
    } else {
      try {
        await addDoc(collection(db, "bookmarks"), {
          userId: currentUser.uid,
          postId: post.id,
          postTitle: post.title,
          postAuthor: post.author,
          postContent: post.content,
          postExcerpt: post.excerpt || post.content.substring(0, 150),
          createdAt: serverTimestamp(),
        });
        toast({ description: "Post bookmarked!" });
      } catch (error) {
        console.error("Error adding bookmark: ", error);
        toast({ title: "Error", description: "Could not add bookmark.", variant: "destructive" });
      }
    }
  }, [currentUser, bookmarkedPostIds, bookmarks, toast]);

  return { bookmarks, bookmarkedPostIds, toggleBookmark, loading };
};