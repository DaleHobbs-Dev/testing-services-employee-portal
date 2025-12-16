import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "../context/CurrentUserContext.js";

export default function Authorized({ children }) {
  const { currentUser, isLoading } = useCurrentUser();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>; // Or use your Spinner component
  }

  // If no user after loading completes, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
