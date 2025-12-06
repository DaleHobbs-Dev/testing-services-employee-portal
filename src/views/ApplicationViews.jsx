import { Routes, Route, Outlet } from "react-router-dom";
import { useCurrentUser } from "../context/CurrentUserContext.js";
import DesignSystem from "../pages/DesignSystem.jsx";
import AdminRoute from "../routes/AdminRoute.jsx";
import AdminDashboard from "../components/dashboard/AdminDashboard.jsx";
import EmployeeDashboard from "../components/dashboard/EmployeeDashboard.jsx";
import { Layout } from "@/components/layout/Layout";

export default function ApplicationViews() {
  const { currentUser } = useCurrentUser();

  if (currentUser === null) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Routes>
        {/* Admin protected routes */}
        <Route
          path="admin-dashboard"
          element={<AdminRoute currentEmployee={currentUser} />}
        >
          <Route index element={<AdminDashboard />} />
        </Route>

        {/* Regular employee routes */}
        <Route index element={<EmployeeDashboard />} />
        <Route path="design-system" element={<DesignSystem />} />

        {/* Add more routes here as needed */}
      </Routes>
    </Layout>
  );
}
