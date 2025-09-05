import { useState, useEffect, useCallback } from "react";
import { BlogPost, BlogFormData } from "@/types/blog";
import { useToast } from "@/components/ui/use-toast";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  where,
  Timestamp
} from "firebase/firestore";
import { db } from "@/firebase";

export const useBlogPosts = (authorId?: string) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    let q;
    if (authorId) {
      // Query for a specific author's posts
      q = query(
        collection(db, "posts"),
        where("authorId", "==", authorId),
        orderBy("createdAt", "desc")
      );
    } else {
      // Query for all posts
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
      await addDoc(collection(db, "posts"), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast({ title: "Success", description: "Blog post created successfully!" });
    } catch (error) {
      console.error("Error creating post: ", error);
      toast({ title: "Error", description: "Failed to create post.", variant: "destructive" });
    }
  }, [toast]);

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
      await deleteDoc(doc(db, "posts", id));
      toast({ title: "Success", description: "Blog post deleted successfully!" });
    } catch (error) {
      console.error("Error deleting post: ", error);
      toast({ title: "Error", description: "Failed to delete post.", variant: "destructive" });
    }
  }, [toast]);

  return {
    posts,
    loading,
    createPost,
    updatePost,
    deletePost,
  };
};