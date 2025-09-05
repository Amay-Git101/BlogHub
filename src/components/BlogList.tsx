import { BlogPost } from "@/types/blog";
import BlogCard from "./BlogCard";

interface BlogListProps {
  posts: BlogPost[];
  onView: (post: BlogPost) => void;
}

const BlogList = ({ posts, onView }: BlogListProps) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-medium text-foreground mb-2">No posts yet</h3>
          <p className="text-muted-foreground mb-6">
            Get started by creating your first blog post.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard
          key={post.id}
          post={post}
          onView={onView}
        />
      ))}
    </div>
  );
};

export default BlogList;