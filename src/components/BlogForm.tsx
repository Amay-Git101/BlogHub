import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogPost, BlogFormData } from "@/types/blog";
import { Save, X } from "lucide-react";

interface BlogFormProps {
  post?: BlogPost | null;
  onSave: (data: BlogFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const BlogForm = ({ post, onSave, onCancel, isEditing = false }: BlogFormProps) => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    content: "",
    author: "",
  });

  const [errors, setErrors] = useState<Partial<BlogFormData>>({});

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        author: post.author,
      });
    }
  }, [post]);

  const validateForm = (): boolean => {
    const newErrors: Partial<BlogFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    if (!formData.author.trim()) {
      newErrors.author = "Author is required";
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

  const handleInputChange = (field: keyof BlogFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
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
          <div className="grid gap-6 md:grid-cols-2">
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
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                placeholder="Your name..."
                className={errors.author ? "border-destructive" : ""}
              />
              {errors.author && (
                <p className="text-sm text-destructive">{errors.author}</p>
              )}
            </div>
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