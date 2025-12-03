import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "../context/CurrentUserContext.js";

export default function Authorized({ children }) {
  const { currentUser } = useCurrentUser();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
