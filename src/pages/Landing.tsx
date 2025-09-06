import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { ThemeToggle } from "../components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { LogOut, User as UserIcon } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Landing = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    // The component will re-render automatically due to auth state change
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };
  
  const handleStartCreating = () => {
    // If logged in, the root route will show the feed. If not, it shows auth.
    navigate(currentUser ? "/" : "/auth");
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <span className="font-bold text-xl cursor-pointer" onClick={() => navigate('/')}>BlogHub</span>
          <div className="flex items-center gap-2 sm:gap-4">
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
                <DropdownMenuContent className="w-56" align="end">
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
              <Button onClick={() => navigate("/auth")}>Login</Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 -mt-16">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 animate-fade-in-up">
          A space for your story.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground mb-8 animate-fade-in-up animation-delay-300">
          A minimalist, modern, and fast platform to bring your ideas to life. No clutter, just pure creation.
        </p>
        <Button size="lg" onClick={handleStartCreating} className="animate-fade-in-up animation-delay-600">
          Start Creating &rarr;
        </Button>
      </main>
      
      {/* Simple keyframes for entry animation */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0; 
        }
        .animation-delay-300 {
          animation-delay: 0.2s;
        }
        .animation-delay-600 {
            animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
};

export default Landing;

