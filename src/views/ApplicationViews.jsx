import { Routes, Route, Outlet } from "react-router-dom";
import { useCurrentUser } from "../context/CurrentUserContext.js";
import DesignSystem from "../pages/DesignSystem.jsx";
import AdminRoute from "../routes/AdminRoute.jsx";
import AdminDashboard from "../components/dashboard/AdminDashboard.jsx";
import EmployeeDashboard from "../components/dashboard/EmployeeDashboard.jsx";
import { Layout } from "@/components/layout/Layout";
import NewTestingAppointment from "../components/appointments/NewTestingAppointment.jsx";
import DailyProctoringDashboard from "../components/dashboard/DailyProctoringDashboard.jsx";
import EmployeeList from "../components/employees/EmployeeList.jsx";
import ExamList from "../components/exams/ExamList.jsx";

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
          <Route
            path="new-testing-appointment"
            element={<NewTestingAppointment />}
          />
          <Route
            path="daily-proctoring-dashboard"
            element={<DailyProctoringDashboard />}
          />
          <Route path="employee-list" element={<EmployeeList />} />
          <Route path="exam-list" element={<ExamList />} />
        </Route>

        {/* Regular employee routes */}
        <Route index element={<EmployeeDashboard />} />
        <Route path="design-system" element={<DesignSystem />} />
        <Route path="employee-dashboard" element={<EmployeeDashboard />} />
        <Route
          path="new-testing-appointment"
          element={<NewTestingAppointment />}
        />
        <Route
          path="daily-proctoring-dashboard"
          element={<DailyProctoringDashboard />}
        />

        {/* Add more routes here as needed */}
      </Routes>
    </Layout>
  );
}
