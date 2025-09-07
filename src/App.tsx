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
import { Skeleton } from "./components/ui/skeleton";
import MainLayout from "./components/MainLayout";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background aurora-bg">
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground">Loading BlogHub...</p>
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/feed" element={<ProfileCompletionRoute><MainLayout><Index /></MainLayout></ProfileCompletionRoute>} />
      <Route path="/auth" element={<RedirectIfAuth><Auth /></RedirectIfAuth>} />
      <Route path="/profile" element={<ProtectedRoute><MainLayout><Profile /></MainLayout></ProtectedRoute>} />
      <Route path="/profile/:userId" element={<ProtectedRoute><MainLayout><PublicProfile /></MainLayout></ProtectedRoute>} />
      <Route path="/bookmarks" element={<ProtectedRoute><MainLayout><Bookmarks /></MainLayout></ProtectedRoute>} />
      <Route path="/create" element={<ProtectedRoute><MainLayout><CreatePost /></MainLayout></ProtectedRoute>} />
      <Route path="/post/:postId" element={<ProtectedRoute><MainLayout><Post /></MainLayout></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;