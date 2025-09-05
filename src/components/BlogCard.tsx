import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Edit, Trash2 } from "lucide-react";
import { BlogPost } from "@/types/blog";

interface BlogCardProps {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  onView: (post: BlogPost) => void;
}

const BlogCard = ({ post, onEdit, onDelete, onView }: BlogCardProps) => {
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

  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <h3 
            className="text-xl font-semibold line-clamp-2 cursor-pointer hover:text-primary transition-colors"
            onClick={() => onView(post)}
          >
            {post.title}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-muted-foreground line-clamp-3">
          {post.excerpt || truncateContent(post.content)}
        </p>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(post)}
        >
          Read More
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(post)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(post.id)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;