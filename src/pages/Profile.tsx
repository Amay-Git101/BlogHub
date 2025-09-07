import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Edit, Mail, AlertTriangle } from "lucide-react";
import { UserFormData } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { updateProfile } from "firebase/auth";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const { currentUser, userProfile, refetchUserProfile, loading: authLoading } = useAuth();
  
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

    try {
      await updateProfile(currentUser, { displayName: formData.name });

      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(userDocRef, { 
        ...userProfile,
        name: formData.name, 
        bio: formData.bio,
        profileComplete: true 
      }, { merge: true });

      refetchUserProfile();
      setIsEditing(false);
      toast({ title: "Success", description: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    }
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
  
  if (authLoading || !userProfile || !currentUser) {
    return (
        <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center space-x-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
            <Skeleton className="h-48 w-full" />
        </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6 text-shadow-glow">
          {userProfile.profileComplete ? "Edit Profile" : "Complete Your Profile"}
        </h1>
        {!userProfile.profileComplete && (
          <Alert variant="default" className="mb-6 bg-card/50 border-border/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please complete your profile to continue to the blog.
            </AlertDescription>
          </Alert>
        )}
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={formData.email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Tell us about yourself..." />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                {userProfile.profileComplete && <Button variant="outline" onClick={handleCancel}>Cancel</Button>}
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-shadow-glow">Profile</h1>
        <Button onClick={() => setIsEditing(true)} size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 glass-card">
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
              <div className="w-full text-center">
                <p className="font-bold text-lg">{userProfile.postsCount}</p>
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="md:col-span-2 space-y-6">
          <Card className="glass-card">
            <CardHeader><CardTitle>About</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {userProfile.bio || "No bio available yet."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;