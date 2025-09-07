import { useNavigate } from "react-router-dom";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookmarkX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Bookmarks = () => {
  const navigate = useNavigate();
  const { bookmarks, loading, toggleBookmark } = useBookmarks();

  const createDummyPost = (bookmark: any) => ({
    id: bookmark.postId,
    title: bookmark.postTitle,
    author: bookmark.postAuthor,
    content: bookmark.postContent,
    excerpt: bookmark.postExcerpt,
    authorId: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-shadow-glow">My Bookmarks</h1>
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      ) : bookmarks.length > 0 ? (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <Card 
              key={bookmark.id} 
              className="glass-card cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-primary/20"
              onClick={() => navigate(`/post/${bookmark.postId}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-primary">{bookmark.postTitle}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">by {bookmark.postAuthor}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation when un-bookmarking
                      toggleBookmark(createDummyPost(bookmark));
                    }}
                    aria-label="Remove bookmark"
                  >
                    <BookmarkX className="h-5 w-5 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">
                  {bookmark.postExcerpt || bookmark.postContent}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 glass-card">
          <h3 className="text-lg font-medium text-foreground mb-2">No Bookmarks Yet</h3>
          <p className="text-muted-foreground">
            You can bookmark posts from the blog feed or a post's page.
          </p>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;