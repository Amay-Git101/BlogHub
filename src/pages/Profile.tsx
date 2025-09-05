import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit, Mail, Calendar, BookOpen } from "lucide-react";
import { User, UserFormData } from "@/types/user";
import { useNavigate } from "react-router-dom";

// Mock user data - replace with real user data when auth is integrated
const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  bio: "Passionate blogger and web developer. Love sharing insights about technology, programming, and life experiences.",
  avatar: "",
  createdAt: new Date("2024-01-01"),
  postsCount: 3
};

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: user.name,
    email: user.email,
    bio: user.bio || ""
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser(prev => ({
      ...prev,
      ...formData
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      bio: user.bio || ""
    });
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
                <h1 className="text-2xl font-bold text-foreground">Edit Profile</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Edit Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <div className="flex space-x-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
              <h1 className="text-2xl font-bold text-foreground">Profile</h1>
            </div>
            <Button onClick={handleEdit} size="sm" className="flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Edit Profile</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Info Card */}
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-lg font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <div className="flex items-center justify-center space-x-1 text-muted-foreground mt-1">
                    <Mail className="h-3 w-3" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </div>

                <Separator />

                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Posts</span>
                    </div>
                    <Badge variant="secondary">{user.postsCount}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Joined</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {user.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio and Activity */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {user.bio || "No bio available yet."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-2 border-primary pl-4">
                    <p className="text-sm text-muted-foreground">Published a new post</p>
                    <p className="font-medium">Getting Started with React and TypeScript</p>
                    <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                  </div>
                  <div className="border-l-2 border-muted pl-4">
                    <p className="text-sm text-muted-foreground">Updated post</p>
                    <p className="font-medium">Building Responsive UIs with Tailwind CSS</p>
                    <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                  </div>
                  <div className="border-l-2 border-muted pl-4">
                    <p className="text-sm text-muted-foreground">Published a new post</p>
                    <p className="font-medium">Understanding Modern JavaScript Features</p>
                    <p className="text-xs text-muted-foreground mt-1">2 weeks ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;