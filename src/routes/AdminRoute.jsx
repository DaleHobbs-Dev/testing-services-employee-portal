import { Navigate, Outlet } from "react-router-dom";

// Functional component to protect admin routes
export default function AdminRoute({ currentEmployee }) {
  // Wait for user data to load
  if (currentEmployee === null || currentEmployee === undefined) {
    return <div>Loading...</div>;
  }
  // Redirect non-admin users to home page
  if (!currentEmployee || currentEmployee.role !== "admin") {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
}
