import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // <-- This line was missing
import { useAuth } from "@/contexts/AuthContext";
import { Comment } from "@/types/comment";
import CommentItem from "./CommentItem";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy } from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "@/components/ui/use-toast";

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection = ({ postId }: CommentsSectionProps) => {
  const { currentUser, userProfile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "comments"), 
      where("postId", "==", postId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData: Comment[] = [];
      querySnapshot.forEach((doc) => {
        commentsData.push({ id: doc.id, ...doc.data() } as Comment);
      });
      setComments(commentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser || !userProfile) return;

    try {
      await addDoc(collection(db, "comments"), {
        postId,
        authorId: currentUser.uid,
        authorName: userProfile.name,
        authorAvatar: currentUser.photoURL,
        content: newComment,
        createdAt: serverTimestamp(),
      });
      setNewComment("");
      toast({ title: "Success", description: "Your comment has been posted." });
    } catch (error) {
      console.error("Error adding comment: ", error);
      toast({ title: "Error", description: "Failed to post comment.", variant: "destructive" });
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Comments ({comments.length})</h3>
      <Separator />

      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="my-6">
          <div className="flex items-start space-x-4">
            <Avatar>
              <AvatarImage src={currentUser.photoURL || undefined} />
              <AvatarFallback>
                {userProfile?.name?.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full"
                rows={3}
              />
              <Button type="submit" disabled={!newComment.trim()}>
                Post Comment
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="my-6 text-center text-muted-foreground">
          <p>Please log in to post a comment.</p>
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <p>Loading comments...</p>
        ) : comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={comment.id}>
              <CommentItem comment={comment} />
              {index < comments.length - 1 && <Separator />}
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-muted-foreground">
            Be the first to comment.
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;