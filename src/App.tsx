import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Bookmarks from "./pages/Bookmarks";
import PublicProfile from "./pages/PublicProfile";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectIfAuth from "./components/RedirectIfAuth";
import ProfileCompletionRoute from "./components/ProfileCompletionRoute";
import { ThemeProvider } from "./components/ThemeProvider";
import { Skeleton } from "./components/ui/skeleton";

const queryClient = new QueryClient();

// This component decides whether to show the Landing page or the Blog Feed
const Root = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground">Loading BlogHub...</p>
            <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }
  
  // If there is a user, show the main app (which checks for profile completion), otherwise show the landing page.
  return currentUser ? <ProfileCompletionRoute><Index /></ProfileCompletionRoute> : <Landing />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Root />} />
              <Route path="/auth" element={<RedirectIfAuth><Auth /></RedirectIfAuth>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/profile/:userId" element={<ProtectedRoute><PublicProfile /></ProtectedRoute>} />
              <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
              <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
              <Route path="/post/:postId" element={<ProtectedRoute><Post /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

