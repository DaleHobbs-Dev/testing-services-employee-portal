import { Navigate, Outlet } from "react-router-dom";
import { employeeHasRole } from "@/utils/roleUtils";

export function RoleRoutes({ currentEmployee, roles }) {
  if (currentEmployee === null || currentEmployee === undefined) {
    return <div>Loading...</div>;
  }

  if (!employeeHasRole(currentEmployee, roles)) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
}
