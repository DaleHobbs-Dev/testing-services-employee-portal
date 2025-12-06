import { Navigate, Outlet } from "react-router-dom";

// Functional component to protect admin routes
export default function AdminRoute({ currentEmployee }) {
  // Wait for user data to load
  if (currentEmployee === null || currentEmployee === undefined) {
    return <div>Loading...</div>;
  }

  // Check if the current employee is an admin
  if (currentEmployee.role !== "admin") {
    // In the case they are not admin, redirect them to the access denied page
    // the replace prop prevents adding a new entry to the history stack
    return <Navigate to="/access-denied" replace />;
  }

  // If the user is an admin, render the child routes
  return <Outlet />;
}
