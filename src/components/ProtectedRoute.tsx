import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/auth" />;
  }

  return children;
};

export default ProtectedRoute;