import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { BlogFormData } from "@/types/blog";
import BlogForm from "@/components/BlogForm";

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
    navigate("/feed");
  };

  return (
    <BlogForm
      onSave={handleSavePost}
      onCancel={() => navigate("/feed")}
      isEditing={false}
    />
  );
};

export default CreatePost;