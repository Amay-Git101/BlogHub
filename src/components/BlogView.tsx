import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Edit, Trash2, Bookmark } from "lucide-react";
import { BlogPost } from "@/types/blog";
import CommentsSection from "./CommentsSection";
import { useBookmarks } from "@/hooks/useBookmarks";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

// This interface was missing
interface BlogViewProps {
  post: BlogPost;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const BlogView = ({ post, onBack, onEdit, onDelete }: BlogViewProps) => {
  const { bookmarkedPostIds, toggleBookmark } = useBookmarks();
  const isBookmarked = bookmarkedPostIds.has(post.id);
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 hover:gap-3 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Posts
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold leading-tight text-shadow-glow">
                {post.title}
              </h1>
              
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleBookmark(post)}
                  className="h-9 w-9"
                >
                  <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current text-primary")} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
                  className="flex items-center gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                   <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <Link to={`/profile/${post.authorId}`} className="font-medium hover:underline">
                  {post.author}
                </Link>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Published {formatDate(post.createdAt)}</span>
              </div>
              
              {post.updatedAt.getTime() !== post.createdAt.getTime() && (
                <Badge variant="secondary" className="text-xs">
                  Updated {formatDate(post.updatedAt)}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed">
              {post.content}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-6 pt-0 border-t">
          <CommentsSection postId={post.id} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlogView;