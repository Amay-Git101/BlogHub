import { useState } from "react";
import { BlogPost, BlogFormData } from "@/types/blog";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import BlogHeader from "@/components/BlogHeader";
import BlogList from "@/components/BlogList";
import BlogForm from "@/components/BlogForm";
import BlogView from "@/components/BlogView";
import {
  AlertDialog,
  AlertDialogAction, 
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ViewMode = 'home' | 'create' | 'edit' | 'view';

const Index = () => {
  const { posts, createPost, updatePost, deletePost } = useBlogPosts();
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const handleCreatePost = () => {
    setSelectedPost(null);
    setCurrentView('create');
  };

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setCurrentView('edit');
  };

  const handleViewPost = (post: BlogPost) => {
    setSelectedPost(post);
    setCurrentView('view');
  };

  const handleSavePost = (data: BlogFormData) => {
    if (currentView === 'edit' && selectedPost) {
      updatePost(selectedPost.id, data);
    } else {
      createPost(data);
    }
    setCurrentView('home');
    setSelectedPost(null);
  };

  const handleDeletePost = (id: string) => {
    setPostToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      deletePost(postToDelete);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
      
      // If we're viewing the post being deleted, go back to home
      if (currentView === 'view' && selectedPost?.id === postToDelete) {
        setCurrentView('home');
        setSelectedPost(null);
      }
    }
  };

  const handleViewHome = () => {
    setCurrentView('home');
    setSelectedPost(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader
        onCreatePost={handleCreatePost}
        onViewHome={handleViewHome}
        currentView={currentView}
      />
      
      <main className="container mx-auto px-4 py-8">
        {currentView === 'home' && (
          <BlogList
            posts={posts}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
            onView={handleViewPost}
          />
        )}

        {(currentView === 'create' || currentView === 'edit') && (
          <BlogForm
            post={selectedPost}
            onSave={handleSavePost}
            onCancel={handleViewHome}
            isEditing={currentView === 'edit'}
          />
        )}

        {currentView === 'view' && selectedPost && (
          <BlogView
            post={selectedPost}
            onBack={handleViewHome}
            onEdit={() => handleEditPost(selectedPost)}
            onDelete={() => handleDeletePost(selectedPost.id)}
          />
        )}
      </main>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
