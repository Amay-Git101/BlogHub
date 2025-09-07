import { useState, useEffect, useCallback } from "react";
import { BlogPost, BlogFormData } from "@/types/blog";
import { useToast } from "@/components/ui/use-toast";
import {
  collection,
  query,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
  orderBy,
  where,
  Timestamp,
  writeBatch,
  getDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext";

export const useBlogPosts = (authorId?: string) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { refetchUserProfile } = useAuth(); // Get the refetch function

  useEffect(() => {
    setLoading(true);
    let q;
    if (authorId) {
      q = query(
        collection(db, "posts"),
        where("authorId", "==", authorId),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
        } as BlogPost;
      });
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authorId]);

  const createPost = useCallback(async (data: BlogFormData) => {
    try {
      const batch = writeBatch(db);
      
      const newPostRef = doc(collection(db, "posts"));
      batch.set(newPostRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const userDocRef = doc(db, "users", data.authorId);
      batch.update(userDocRef, { postsCount: increment(1) });

      await batch.commit();
      refetchUserProfile(); // Refresh user profile to update post count
      toast({ title: "Success", description: "Blog post created successfully!" });
    } catch (error) {
      console.error("Error creating post: ", error);
      toast({ title: "Error", description: "Failed to create post.", variant: "destructive" });
    }
  }, [toast, refetchUserProfile]);

  const updatePost = useCallback(async (id: string, data: Partial<BlogFormData>) => {
    try {
      await updateDoc(doc(db, "posts", id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
      toast({ title: "Success", description: "Blog post updated successfully!" });
    } catch (error) {
      console.error("Error updating post: ", error);
      toast({ title: "Error", description: "Failed to update post.", variant: "destructive" });
    }
  }, [toast]);

  const deletePost = useCallback(async (id: string) => {
    try {
      const postDocRef = doc(db, "posts", id);
      const postSnap = await getDoc(postDocRef);

      if (!postSnap.exists()) {
        throw new Error("Post does not exist");
      }
      
      const postData = postSnap.data();
      const authorId = postData.authorId;

      const batch = writeBatch(db);
      
      batch.delete(postDocRef);

      if (authorId) {
        const userDocRef = doc(db, "users", authorId);
        batch.update(userDocRef, { postsCount: increment(-1) });
      }

      await batch.commit();
      refetchUserProfile(); // Refresh user profile to update post count
      toast({ title: "Success", description: "Blog post deleted successfully!" });
    } catch (error) {
      console.error("Error deleting post: ", error);
      toast({ title: "Error", description: "Failed to delete post.", variant: "destructive" });
    }
  }, [toast, refetchUserProfile]);

  return {
    posts,
    loading,
    createPost,
    updatePost,
    deletePost,
  };
};