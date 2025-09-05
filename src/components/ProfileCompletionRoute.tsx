import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileCompletionRouteProps {
  children: JSX.Element;
}

const ProfileCompletionRoute = ({ children }: ProfileCompletionRouteProps) => {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/auth" />;
  }

  if (!userProfile?.profileComplete) {
    return <Navigate to="/profile" />;
  }

  return children;
};

export default ProfileCompletionRoute;