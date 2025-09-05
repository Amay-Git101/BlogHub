import { useNavigate } from "react-router-dom";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import BlogHeader from "@/components/BlogHeader";
import BlogList from "@/components/BlogList";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogPost } from "@/types/blog";

const Index = () => {
  const { posts, loading } = useBlogPosts();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader />
      
      {/* Added pb-24 for padding-bottom to avoid overlap with floating nav */}
      <main className="container mx-auto px-4 py-8 pb-24">
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
      </main>
    </div>
  );
};

export default Index;