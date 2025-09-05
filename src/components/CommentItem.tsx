import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Comment } from "@/types/comment";
import { formatDistanceToNow } from "date-fns";

interface CommentItemProps {
  comment: Comment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <div className="flex items-start space-x-4 py-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src={comment.authorAvatar || undefined} />
        <AvatarFallback>{getInitials(comment.authorName)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-semibold">{comment.authorName}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true })}
          </p>
        </div>
        <p className="mt-1 text-sm text-foreground/90 whitespace-pre-wrap">
          {comment.content}
        </p>
      </div>
    </div>
  );
};

export default CommentItem;