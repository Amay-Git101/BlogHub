import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogPost, BlogFormData } from "@/types/blog";
import { Save, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Define what the form itself will output
type BlogFormValues = Omit<BlogFormData, "author" | "authorId">;

interface BlogFormProps {
  post?: BlogPost | null;
  onSave: (data: BlogFormValues) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const BlogForm = ({ post, onSave, onCancel, isEditing = false }: BlogFormProps) => {
  const [formData, setFormData] = useState<BlogFormValues>({
    title: "",
    content: "",
  });
  const { userProfile } = useAuth();

  const [errors, setErrors] = useState<Partial<BlogFormValues>>({});

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
      });
    }
  }, [post]);

  const validateForm = (): boolean => {
    const newErrors: Partial<BlogFormValues> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: keyof BlogFormValues, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{isEditing ? "Edit Post" : "Create New Post"}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter your blog post title..."
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Author</Label>
            <Input
              id="author"
              value={userProfile?.name || "Loading..."}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Write your blog post content here..."
              className={`min-h-[300px] ${errors.content ? "border-destructive" : ""}`}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {isEditing ? "Update Post" : "Create Post"}
            </Button>
            
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BlogForm;