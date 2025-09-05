import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { BlogFormData } from "@/types/blog";
import BlogForm from "@/components/BlogForm";
import BlogHeader from "@/components/BlogHeader";

// This is the data type we get from the form
type BlogFormValues = Omit<BlogFormData, "author" | "authorId">;

const CreatePost = () => {
  const navigate = useNavigate();
  const { createPost } = useBlogPosts();
  const { currentUser, userProfile } = useAuth();

  const handleSavePost = async (data: BlogFormValues) => {
    if (!currentUser || !userProfile) return;

    // We combine the form data with the user data to create the full post object
    await createPost({
      ...data,
      author: userProfile.name || "Anonymous",
      authorId: currentUser.uid,
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader onCreatePost={() => {}} onViewHome={() => navigate("/")} currentView="create" />
      <main className="container mx-auto px-4 py-8">
        <BlogForm
          onSave={handleSavePost}
          onCancel={() => navigate("/")}
          isEditing={false}
        />
      </main>
    </div>
  );
};

export default CreatePost;