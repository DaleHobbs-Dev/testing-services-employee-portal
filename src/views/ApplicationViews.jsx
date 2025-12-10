import { Routes, Route, Outlet } from "react-router-dom";
import { useCurrentUser } from "../context/CurrentUserContext.js";
import DesignSystem from "../pages/DesignSystem.jsx";
import AdminRoute from "../routes/AdminRoute.jsx";
import AdminDashboard from "../components/dashboard/AdminDashboard.jsx";
import EmployeeDashboard from "../components/dashboard/EmployeeDashboard.jsx";
import { Layout } from "@/components/layout/Layout";
import NewAppointment from "../components/appointments/NewAppointment.jsx";
import DailyProctoringDashboard from "../components/dashboard/DailyProctoringDashboard.jsx";
import EmployeeList from "../components/employees/EmployeeList.jsx";
import ExamList from "../components/exams/ExamList.jsx";
import NewEmployee from "../components/employees/NewEmployee.jsx";
import EditEmployee from "../components/employees/EditEmployee.jsx";
import NewExam from "../components/exams/NewExam.jsx";
import EditExam from "../components/exams/EditExam.jsx";

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
          <Route path="new-testing-appointment" element={<NewAppointment />} />
          <Route
            path="daily-proctoring-dashboard"
            element={<DailyProctoringDashboard />}
          />

          {/* Employee Management Routes */}
          <Route path="employee-list" element={<EmployeeList />} />
          <Route path="employee-list/new" element={<NewEmployee />} />
          <Route
            path="employee-list/edit/:employeeId"
            element={<EditEmployee />}
          />

          {/* Exam Management Routes */}
          <Route path="exam-list" element={<ExamList />} />
          <Route path="exam-list/new" element={<NewExam />} />
          <Route path="exam-list/edit/:examId" element={<EditExam />} />
        </Route>

        {/* Regular employee routes */}
        <Route index element={<EmployeeDashboard />} />
        <Route path="design-system" element={<DesignSystem />} />
        <Route path="employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="new-appointment" element={<NewAppointment />} />
        <Route
          path="daily-proctoring-dashboard"
          element={<DailyProctoringDashboard />}
        />

        {/* Add more routes here as needed */}
      </Routes>
    </Layout>
  );
}
