import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { LogOut, User as UserIcon, Feather, Zap, Sparkles } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState, MouseEvent, useMemo } from "react";
import { cn } from "@/lib/utils";
import BlogCard from "@/components/BlogCard";

const Landing = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { posts } = useBlogPosts();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    setMousePosition({ x: clientX, y: clientY });
  };

  const transformCard = useMemo(() => {
    if (typeof window === "undefined") return {};
    const x = (mousePosition.x - window.innerWidth / 2) / (window.innerWidth / 2);
    const y = (mousePosition.y - window.innerHeight / 2) / (window.innerHeight / 2);
    return {
      transform: `perspective(1000px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`
    };
  }, [mousePosition]);

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };
  
  const handleStartCreating = () => {
    navigate(currentUser ? "/feed" : "/auth");
  };

  return (
    <div className="bg-background text-foreground aurora-bg">
      <div
        className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        <header className="absolute top-0 z-20 w-full container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <span className="font-bold text-xl cursor-pointer" onClick={() => navigate(currentUser ? "/feed" : "/")}>BlogHub</span>
            <div className="flex items-center gap-2 sm:gap-4">
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
                    <DropdownMenuItem onClick={() => signOut(auth)}>
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

        <main 
          className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 w-full"
          style={{ perspective: "1000px" }}
        >
          <div
            className="bg-background/30 backdrop-blur-lg p-8 sm:p-12 rounded-2xl border border-white/10 shadow-2xl transition-transform duration-300 ease-out"
            style={transformCard}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-shadow-glow animate-fade-in-up">
              A space for your story.
            </h1>
            <p className="max-w-2xl text-lg text-foreground/80 mb-8 animate-fade-in-up animation-delay-300">
              A minimalist, modern, and fast platform to bring your ideas to life. No clutter, just pure creation.
            </p>
            <Button size="lg" onClick={handleStartCreating} className="animate-fade-in-up animation-delay-600">
              Start Creating &rarr;
            </Button>
          </div>
        </main>
      </div>

      {/* Features Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">Why BlogHub?</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-shadow-glow">
              Everything you need to write
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              We focus on the essentials, providing a clean and powerful platform for your ideas to shine.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col glass-card p-6">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <Zap className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  Blazing Fast
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">Our platform is built for speed. Your readers will enjoy a seamless, fast-loading experience on any device.</p>
                </dd>
              </div>
              <div className="flex flex-col glass-card p-6">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <Feather className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  Minimalist Design
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">A beautiful, clutter-free interface that puts your content front and center, making writing a pleasure.</p>
                </dd>
              </div>
              <div className="flex flex-col glass-card p-6">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <Sparkles className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  Modern Experience
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">Engage your audience with a futuristic look and feel, interactive elements, and a memorable design.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-center text-shadow-glow">
            Latest Posts
          </h2>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <BlogCard 
                key={post.id}
                post={post}
                onView={() => navigate(currentUser ? `/post/${post.id}` : '/auth')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} BlogHub. All rights reserved.</p>
        </div>
      </footer>
      
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0; 
        }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-600 { animation-delay: 0.6s; }
      `}</style>
    </div>
  );
};

export default Landing;