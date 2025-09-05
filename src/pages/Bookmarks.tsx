import { useNavigate } from "react-router-dom";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookmarkX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Bookmarks = () => {
  const navigate = useNavigate();
  const { bookmarks, loading, toggleBookmark } = useBookmarks();

  // We need a dummy post object for the toggle function
  const createDummyPost = (bookmark: any) => ({
    id: bookmark.postId,
    title: bookmark.postTitle,
    author: bookmark.postAuthor,
    content: '',
    authorId: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Blog</span>
            </Button>
            <h1 className="text-2xl font-bold text-foreground">My Bookmarks</h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        ) : bookmarks.length > 0 ? (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <Card key={bookmark.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3
                      className="font-semibold hover:underline cursor-pointer"
                      onClick={() => navigate(`/post/${bookmark.postId}`)} // Note: We will need to create this route later
                    >
                      {bookmark.postTitle}
                    </h3>
                    <p className="text-sm text-muted-foreground">by {bookmark.postAuthor}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleBookmark(createDummyPost(bookmark))}
                    aria-label="Remove bookmark"
                  >
                    <BookmarkX className="h-5 w-5 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-foreground mb-2">No Bookmarks Yet</h3>
            <p className="text-muted-foreground">
              You can bookmark posts from the home page or a post's page.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Bookmarks;