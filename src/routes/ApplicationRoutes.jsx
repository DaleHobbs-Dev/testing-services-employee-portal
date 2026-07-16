import { Routes, Route, Navigate } from "react-router-dom";
import { useCurrentUser } from "@/context";
import {
  AppointmentPage,
  DesignSystemPage,
  ProctoringDashboardPage,
  AccessDeniedPage,
  LoginPage,
  RegisterPage,
  EmployeeDashboardPage,
  EmployeeManagementPage,
  EmployeeSchedulesPage,
  ExamManagementPage,
  CalendarManagementPage,
} from "@/pages";
import { AuthorizedRoutes, RoleRoutes } from "@/routes";
import {
  Layout,
  NewAppointment,
  EmployeeList,
  EmployeeSchedules,
  ExamList,
  NewEmployee,
  EditEmployee,
  NewExam,
  EditExam,
  TestingServicesDashboard,
  AppointmentDetails,
  EditAppointment,
  ProctoringDashboard,
  CalendarManagementHome,
  EditCalendars,
  ViewCalendars,
} from "@/components";

export function ApplicationRoutes() {
  const { currentUser, isLoading } = useCurrentUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<AuthorizedRoutes />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/employee-dashboard" replace />} />

          {/* employee routes */}
          {/* Main Employee Dashboard Routes */}
          <Route path="employee-dashboard" element={<EmployeeDashboardPage />}>
            <Route index element={<TestingServicesDashboard />} />
          </Route>

          {/* Appointment Routes */}

          <Route path="appointment" element={<AppointmentPage />}>
            <Route path="new" element={<NewAppointment />} />
            <Route
              path=":scheduleId/details"
              element={<AppointmentDetails />}
            />
            <Route path=":scheduleId/edit" element={<EditAppointment />} />
          </Route>

          {/* Proctoring Dashboard Routes */}
          <Route
            path="proctoring-dashboard"
            element={<ProctoringDashboardPage />}
          >
            <Route index element={<ProctoringDashboard />} />
          </Route>

          {/* Access Denied Route */}
          <Route path="access-denied" element={<AccessDeniedPage />} />

          {/* Design System Route */}
          <Route path="design-system" element={<DesignSystemPage />} />

          {/* Employee Management Routes */}
          <Route
            element={
              <RoleRoutes
                currentEmployee={currentUser}
                roles={["admin", "technician"]}
              />
            }
          >
            <Route
              path="employee-management"
              element={<EmployeeManagementPage />}
            >
              <Route index element={<EmployeeList />} />
              <Route path="list" element={<EmployeeList />} />
              <Route path="new" element={<NewEmployee />} />
              <Route path=":employeeId/edit" element={<EditEmployee />} />
            </Route>
          </Route>

          {/* Employee Schedule Management Routes */}
          <Route
            element={
              <RoleRoutes
                currentEmployee={currentUser}
                roles={["admin", "scheduler"]}
              />
            }
          >
            <Route
              path="employee-schedules"
              element={<EmployeeSchedulesPage />}
            >
              <Route index element={<EmployeeSchedules />} />
            </Route>
          </Route>

          {/* Exam Management Routes */}
          <Route
            element={
              <RoleRoutes
                currentEmployee={currentUser}
                roles={["admin", "technician"]}
              />
            }
          >
            <Route path="exam-management" element={<ExamManagementPage />}>
              <Route index element={<ExamList />} />
              <Route path="list" element={<ExamList />} />
              <Route path="new" element={<NewExam />} />
              <Route path=":examId/edit" element={<EditExam />} />
            </Route>
          </Route>

          {/* Calendar Management Routes */}
          <Route
            element={
              <RoleRoutes
                currentEmployee={currentUser}
                roles={[
                  "admin",
                  "proctor",
                  "scheduler",
                  "checkin",
                  "technician",
                  "frontdesk",
                  "clerk",
                ]}
              />
            }
          >
            <Route
              path="calendar-management"
              element={<CalendarManagementPage />}
            >
              <Route index element={<CalendarManagementHome />} />
              <Route path="edit" element={<EditCalendars />} />
              <Route path="view" element={<ViewCalendars />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
