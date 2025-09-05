import { useState, useCallback } from "react";
import { BlogPost, BlogFormData } from "@/types/blog";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with React and TypeScript",
    content: "React and TypeScript make a powerful combination for building robust web applications. In this post, we'll explore the fundamentals of setting up a React project with TypeScript, understanding the benefits it brings to your development workflow.\n\nTypeScript adds static type checking to JavaScript, which helps catch errors early in the development process. When combined with React, it provides better IntelliSense, refactoring support, and overall developer experience.\n\nLet's dive into the key concepts and best practices for using React with TypeScript.",
    author: "John Doe",
    createdAt: new Date("2024-01-15T10:30:00"),
    updatedAt: new Date("2024-01-15T10:30:00"),
    excerpt: "Learn how to combine React and TypeScript for better development experience."
  },
  {
    id: "2", 
    title: "Building Responsive UIs with Tailwind CSS",
    content: "Tailwind CSS has revolutionized the way we approach styling in modern web development. Its utility-first approach allows developers to rapidly build responsive and beautiful user interfaces without writing custom CSS.\n\nIn this comprehensive guide, we'll cover:\n- Setting up Tailwind CSS in your project\n- Understanding the utility-first methodology\n- Creating responsive designs with breakpoint prefixes\n- Customizing your design system\n- Best practices for maintainable code\n\nBy the end of this post, you'll have a solid understanding of how to leverage Tailwind CSS to build professional-looking applications.",
    author: "Jane Smith",
    createdAt: new Date("2024-01-12T14:20:00"),
    updatedAt: new Date("2024-01-13T09:15:00"),
    excerpt: "Master the art of building responsive UIs with Tailwind CSS utility classes."
  },
  {
    id: "3",
    title: "Understanding Modern JavaScript Features",
    content: "JavaScript has evolved significantly over the years, with ES6+ introducing many powerful features that make code more readable, maintainable, and efficient.\n\nKey features we'll explore:\n- Arrow functions and their benefits\n- Destructuring assignment for cleaner code\n- Template literals for better string handling\n- Async/await for handling asynchronous operations\n- Modules for better code organization\n\nThese features are essential for any modern JavaScript developer and form the foundation of frameworks like React, Vue, and Angular.",
    author: "Mike Johnson",
    createdAt: new Date("2024-01-10T16:45:00"),
    updatedAt: new Date("2024-01-10T16:45:00"),
    excerpt: "Explore the latest JavaScript features that every developer should know."
  }
];

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>(mockPosts);
  const { toast } = useToast();

  const createPost = useCallback((data: BlogFormData) => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setPosts(prev => [newPost, ...prev]);
    
    toast({
      title: "Success",
      description: "Blog post created successfully!",
    });

    return newPost;
  }, [toast]);

  const updatePost = useCallback((id: string, data: BlogFormData) => {
    setPosts(prev => prev.map(post => 
      post.id === id 
        ? { ...post, ...data, updatedAt: new Date() }
        : post
    ));

    toast({
      title: "Success", 
      description: "Blog post updated successfully!",
    });
  }, [toast]);

  const deletePost = useCallback((id: string) => {
    setPosts(prev => prev.filter(post => post.id !== id));
    
    toast({
      title: "Success",
      description: "Blog post deleted successfully!",
    });
  }, [toast]);

  const getPostById = useCallback((id: string) => {
    return posts.find(post => post.id === id);
  }, [posts]);

  return {
    posts,
    createPost,
    updatePost,
    deletePost,
    getPostById,
  };
};