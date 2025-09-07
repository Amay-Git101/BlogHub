import { useNavigate } from "react-router-dom";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import BlogList from "@/components/BlogList";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogPost } from "@/types/blog";

const Index = () => {
  const { posts, loading } = useBlogPosts();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {loading ? (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
           {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-72 w-full" />)}
         </div>
      ) : (
        <BlogList
          posts={posts}
          onView={(post: BlogPost) => navigate(`/post/${post.id}`)}
        />
      )}
    </div>
  );
};

export default Index;