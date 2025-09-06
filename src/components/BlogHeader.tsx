import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Plus, Home, LogOut, User as UserIcon, LogIn, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { ThemeToggle } from "./ThemeToggle";

const BlogHeader = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth");
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-auto -translate-x-1/2 animate-slide-in-up md:top-4 md:bottom-auto">
      <nav className="flex items-center gap-2 rounded-full border bg-background/80 p-2 shadow-lg backdrop-blur-sm">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate('/')}>
          <Home className="h-5 w-5" />
          <span className="sr-only">Home</span>
        </Button>

        {currentUser && (
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate('/create')}>
            <Plus className="h-5 w-5" />
            <span className="sr-only">New Post</span>
          </Button>
        )}

        {currentUser && (
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate('/bookmarks')}>
            <Bookmark className="h-5 w-5" />
            <span className="sr-only">Bookmarks</span>
          </Button>
        )}

        <ThemeToggle />

        {currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || "User"} />
                  <AvatarFallback>{getInitials(currentUser.displayName)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="center" side="top" sideOffset={10}>
               <DropdownMenuItem onClick={() => navigate('/profile')}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate('/auth')}>
            <LogIn className="h-5 w-5" />
            <span className="sr-only">Login</span>
          </Button>
        )}
      </nav>
    </div>
  );
};

export default BlogHeader;
