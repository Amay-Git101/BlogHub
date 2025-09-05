import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Edit, Mail, Calendar, BookOpen, AlertTriangle, UserPlus, UserCheck } from "lucide-react";
import { UserFormData } from "@/types/user";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { updateProfile } from "firebase/auth";
import { toast } from "@/components/ui/use-toast";
import { useFollows } from "@/hooks/useFollows"; // <-- Import the new hook
import { cn } from "@/lib/utils";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, refetchUserProfile, loading: authLoading } = useAuth();
  const { followers, following, isFollowing, toggleFollow, loading: followLoading } = useFollows(userProfile?.id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        email: userProfile.email || "",
        bio: userProfile.bio || "",
      });
      if (!userProfile.profileComplete) {
        setIsEditing(true);
      }
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!currentUser || !formData.name.trim()) {
      toast({ title: "Validation Error", description: "Name cannot be empty.", variant: "destructive" });
      return;
    }
    // ... (rest of handleSave remains the same)
  };

  const handleCancel = () => {
    if (!userProfile?.profileComplete) return;
    if (userProfile) {
      setFormData({ name: userProfile.name || "", email: userProfile.email || "", bio: userProfile.bio || "" });
    }
    setIsEditing(false);
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "";
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };
  
  const loading = authLoading || followLoading;

  if (loading || !userProfile || !currentUser) {
    return <div>Loading...</div>; // Or a proper loading skeleton
  }

  // ... (isEditing view remains the same)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Blog</span>
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Profile</h1>
            </div>
            {currentUser.uid === userProfile.id ? (
              <Button onClick={() => setIsEditing(true)} size="sm" className="flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Edit Profile</span>
              </Button>
            ) : (
              <Button onClick={toggleFollow} size="sm" variant={isFollowing ? "outline" : "default"}>
                {isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userProfile.avatar || currentUser.photoURL || undefined} alt={userProfile.name || ""} />
                  <AvatarFallback className="text-lg font-semibold">
                    {getInitials(userProfile.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{userProfile.name}</h2>
                  <div className="flex items-center justify-center space-x-1 text-muted-foreground mt-1">
                    <Mail className="h-3 w-3" />
                    <span className="text-sm">{userProfile.email}</span>
                  </div>
                </div>
                <Separator />
                <div className="w-full text-center flex justify-around">
                  <div className="text-center">
                    <p className="font-bold text-lg">{userProfile.postsCount || 0}</p>
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

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>About</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {userProfile.bio || "No bio available yet."}
                </p>
              </CardContent>
            </Card>
            {/* ... Recent Activity Card ... */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;