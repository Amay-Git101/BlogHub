import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Bookmarks from "./pages/Bookmarks";
import PublicProfile from "./pages/PublicProfile";
import CreatePost from "./pages/CreatePost"; // <-- Import CreatePost
import Post from "./pages/Post"; // <-- Import Post
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectIfAuth from "./components/RedirectIfAuth";
import ProfileCompletionRoute from "./components/ProfileCompletionRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<ProfileCompletionRoute><Index /></ProfileCompletionRoute>} />
            <Route path="/auth" element={<RedirectIfAuth><Auth /></RedirectIfAuth>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/profile/:userId" element={<ProtectedRoute><PublicProfile /></ProtectedRoute>} />
            <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
            <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} /> {/* <-- New Route */}
            <Route path="/post/:postId" element={<ProtectedRoute><Post /></ProtectedRoute>} /> {/* <-- New Route */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;