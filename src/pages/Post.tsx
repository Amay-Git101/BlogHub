import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { BlogPost } from "@/types/blog";
import BlogView from "@/components/BlogView";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { Skeleton } from "@/components/ui/skeleton";

const Post = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { deletePost } = useBlogPosts();

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setPost({
          id: docSnap.id,
          ...data,
          createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
        } as BlogPost);
      } else {
        setPost(null);
      }
      setLoading(false);
    };

    fetchPost();
  }, [postId]);

  const handleDelete = async () => {
    if (post) {
      await deletePost(post.id);
      navigate("/feed");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 glass-card p-6">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <div className="pt-8 space-y-4">
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!post) {
    return <div className="text-center py-10 glass-card">Post not found.</div>;
  }

  return (
    <BlogView
      post={post}
      onBack={() => navigate(-1)}
      onEdit={() => navigate(`/edit/${post.id}`)}
      onDelete={handleDelete}
    />
  );
};

export default Post;