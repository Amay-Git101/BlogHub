import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle, Home, LogOut, User as UserIcon, LogIn, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";

interface BlogHeaderProps {
  onCreatePost: () => void;
  onViewHome: () => void;
  currentView: 'home' | 'create' | 'edit' | 'view';
}

const BlogHeader = ({ onCreatePost, onViewHome, currentView }: BlogHeaderProps) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-foreground cursor-pointer" onClick={() => navigate('/')}>
              BlogHub
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {currentView !== 'home' && (
              <Button
                variant="outline"
                size="sm"
                onClick={onViewHome}
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            )}
            
            {currentView === 'home' && currentUser && (
              <Button
                onClick={onCreatePost}
                size="sm"
                className="flex items-center space-x-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">New Post</span>
              </Button>
            )}
            
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || "User"} />
                      <AvatarFallback>{getInitials(currentUser.displayName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{currentUser.displayName || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/bookmarks')}>
                    <Bookmark className="mr-2 h-4 w-4" />
                    <span>My Bookmarks</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('/auth')} size="sm">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default BlogHeader;