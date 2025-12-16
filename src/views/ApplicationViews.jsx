import { Routes, Route, Outlet } from "react-router-dom";
import { useCurrentUser } from "../context/CurrentUserContext.js";
import DesignSystem from "../pages/DesignSystem.jsx";
import AdminRoute from "../routes/AdminRoute.jsx";
import { Layout } from "@/components/layout/Layout";
import NewAppointment from "../components/appointments/NewAppointment.jsx";
import ProctoringDashboard from "../components/dashboards/ProctoringDashboard.jsx";
import EmployeeList from "../components/employees/EmployeeList.jsx";
import EmployeeSchedules from "../components/schedules/EmployeeSchedules.jsx";
import ExamList from "../components/exams/ExamList.jsx";
import NewEmployee from "../components/employees/NewEmployee.jsx";
import EditEmployee from "../components/employees/EditEmployee.jsx";
import NewExam from "../components/exams/NewExam.jsx";
import EditExam from "../components/exams/EditExam.jsx";
import TestingServicesDashboard from "../components/dashboards/TestingServicesDashboard.jsx";
import AccessDenied from "../components/errors/AccessDenied.jsx";
import ExamDetails from "../components/exams/ExamDetails.jsx";

export default function ApplicationViews() {
  const { currentUser } = useCurrentUser();

  if (currentUser === null) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Routes>
        {/* employee routes */}
        <Route index element={<TestingServicesDashboard />} />
        <Route path="design-system" element={<DesignSystem />} />
        <Route path="new-appointment" element={<NewAppointment />} />
        <Route path="proctoring-dashboard" element={<ProctoringDashboard />} />
        <Route path="access-denied" element={<AccessDenied />} />
        <Route path="exam-details/:scheduleId" element={<ExamDetails />} />

        {/* admin protected routes */}
        <Route element={<AdminRoute currentEmployee={currentUser} />}>
          {/* Employee Management */}
          <Route path="employee-list" element={<EmployeeList />} />
          <Route path="employee-list/new" element={<NewEmployee />} />
          <Route
            path="employee-list/edit/:employeeId"
            element={<EditEmployee />}
          />

          {/* Employee Schedule Management */}
          <Route path="employee-schedules" element={<EmployeeSchedules />} />

          {/* Exam Management */}
          <Route path="exam-list" element={<ExamList />} />
          <Route path="exam-list/new" element={<NewExam />} />
          <Route path="exam-list/edit/:examId" element={<EditExam />} />
        </Route>
      </Routes>
    </Layout>
  );
}
