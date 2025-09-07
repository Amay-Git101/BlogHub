import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { User } from "@/types/user";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Mail } from "lucide-react";
import BlogList from "@/components/BlogList";
import { BlogPost } from "@/types/blog";
import { Skeleton } from "@/components/ui/skeleton";

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<User | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const { posts, loading: loadingPosts } = useBlogPosts(userId);

  useEffect(() => {
    if (!userId) return;
    setLoadingProfile(true);
    const userDocRef = doc(db, "users", userId);
    
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const createdAtDate = (data.createdAt as any)?.toDate() || new Date();
        setProfile({ ...data, createdAt: createdAtDate } as User);
      } else {
        setProfile(null);
      }
      setLoadingProfile(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const getInitials = (name?: string | null) => {
    if (!name) return "";
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  if (loadingProfile || !profile) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-shadow-glow">{profile.name}'s Profile</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="md:col-span-1 glass-card">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar} alt={profile.name || ""} />
                <AvatarFallback className="text-lg font-semibold">{getInitials(profile.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{profile.name}</h2>
                <div className="flex items-center justify-center space-x-1 text-muted-foreground mt-1">
                  <Mail className="h-3 w-3" />
                  <span className="text-sm">{profile.email}</span>
                </div>
              </div>
              <Separator />
              <div className="w-full text-center">
                <div className="text-center">
                  <p className="font-bold text-lg">{profile.postsCount}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="md:col-span-2">
          <Card className="glass-card h-full">
            <CardHeader><CardTitle>About {profile.name}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{profile.bio || "No bio available yet."}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-4 text-shadow-glow">Posts by {profile.name}</h3>
      {loadingPosts ? (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
           {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-72 w-full" />)}
         </div>
      ) : (
        <BlogList posts={posts} onView={(post: BlogPost) => navigate(`/post/${post.id}`)} />
      )}
    </div>
  );
};

export default PublicProfile;