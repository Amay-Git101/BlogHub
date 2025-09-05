import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Home, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BlogHeaderProps {
  onCreatePost: () => void;
  onViewHome: () => void;
  currentView: 'home' | 'create' | 'edit' | 'view';
}

const BlogHeader = ({ onCreatePost, onViewHome, currentView }: BlogHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-foreground">My Blog</h1>
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
            
            {currentView === 'home' && (
              <Button
                onClick={onCreatePost}
                size="sm"
                className="flex items-center space-x-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">New Post</span>
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-2"
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">JD</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BlogHeader;