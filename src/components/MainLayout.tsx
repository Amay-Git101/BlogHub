import BlogHeader from "@/components/BlogHeader";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayout = ({ children, className }: MainLayoutProps) => {
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground aurora-bg">
      <BlogHeader />
      <main className={cn("container mx-auto px-4 pt-8 md:pt-24 pb-24", className)}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;