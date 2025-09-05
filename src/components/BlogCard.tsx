import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, Edit, Trash2, Bookmark } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { useBookmarks } from "@/hooks/useBookmarks";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";

interface BlogCardProps {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  onView: (post: BlogPost) => void;
}

const BlogCard = ({ post, onEdit, onDelete, onView }: BlogCardProps) => {
  const { bookmarkedPostIds, toggleBookmark } = useBookmarks();
  const navigate = useNavigate();
  const isBookmarked = bookmarkedPostIds.has(post.id);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(post);
  };

  return (
    <Card 
      onClick={() => onView(post)}
      className="h-full flex flex-col hover:shadow-md transition-shadow duration-200 cursor-pointer"
    >
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold line-clamp-2 hover:text-primary transition-colors">
            {post.title}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <Link to={`/profile/${post.authorId}`} onClick={(e) => e.stopPropagation()} className="hover:underline">
                {post.author}
              </Link>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4 flex-grow">
        <p className="text-muted-foreground line-clamp-3">
          {post.excerpt || truncateContent(post.content)}
        </p>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => { e.stopPropagation(); onView(post); }}
        >
          Read More
        </Button>
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmarkClick}
            className="h-8 w-8"
          >
            <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current text-primary")} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;