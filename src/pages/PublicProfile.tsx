import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { User } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";
import { useFollows } from "@/hooks/useFollows";
import { useBlogPosts } from "@/hooks/useBlogPosts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, Calendar, BookOpen, UserPlus, UserCheck } from "lucide-react";
import BlogList from "@/components/BlogList";
import BlogForm from "@/components/BlogForm"; // We might need this later
import BlogView from "@/components/BlogView"; // We might need this later
import { BlogPost, BlogFormData } from "@/types/blog";
import { Skeleton } from "@/components/ui/skeleton";


const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const { posts, loading: loadingPosts, deletePost } = useBlogPosts(userId);
  const { followers, following, isFollowing, toggleFollow } = useFollows(userId);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      setLoadingProfile(true);
      const userDocRef = doc(db, "users", userId);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const createdAtDate = (data.createdAt as any)?.toDate() || new Date();
        setProfile({ ...data, createdAt: createdAtDate } as User);
      }
      setLoadingProfile(false);
    };
    fetchProfile();
  }, [userId]);

  const getInitials = (name?: string | null) => {
    if (!name) return "";
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  if (loadingProfile || !profile) {
    return <div>Loading profile...</div>; // Replace with a skeleton loader
  }
  
  const isOwnProfile = currentUser?.uid === profile.id;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <h1 className="text-2xl font-bold text-foreground">{profile.name}'s Profile</h1>
            </div>
            {!isOwnProfile && (
              <Button onClick={toggleFollow} size="sm" variant={isFollowing ? "outline" : "default"}>
                {isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="md:col-span-1">
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
                <div className="w-full text-center flex justify-around">
                  <div className="text-center">
                    <p className="font-bold text-lg">{posts.length}</p>
                    <p className="text-xs text-muted-foreground">Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg">{followers.length}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg">{following.length}</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="md:col-span-2">
            <Card>
              <CardHeader><CardTitle>About {profile.name}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{profile.bio || "No bio available yet."}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-4">Posts by {profile.name}</h3>
        {loadingPosts ? (
          <p>Loading posts...</p>
        ) : (
          <BlogList posts={posts} onEdit={() => {}} onDelete={() => {}} onView={() => {}} />
        )}
      </main>
    </div>
  );
};

export default PublicProfile;