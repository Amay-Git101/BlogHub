import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface RedirectIfAuthProps {
  children: JSX.Element;
}

const RedirectIfAuth = ({ children }: RedirectIfAuthProps) => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RedirectIfAuth;