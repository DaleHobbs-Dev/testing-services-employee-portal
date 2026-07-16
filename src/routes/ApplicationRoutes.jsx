import { Routes, Route, Navigate } from "react-router-dom";
import { useCurrentUser } from "@/context";
import {
  AccessDeniedPage,
  LoginPage,
  RegisterPage,
  EmployeeDashboardPage,
  EmployeeManagementPage,
  CalendarManagementPage,
} from "@/pages";
import { AuthorizedRoutes, RoleRoutes } from "@/routes";
import {
  Layout,
  EmployeeList,
  NewEmployee,
  EditEmployee,
  TestingServicesDashboard,
  CalendarManagementHome,
  CreateCalendar,
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

          {/* Access Denied Route */}
          <Route path="access-denied" element={<AccessDeniedPage />} />

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
              <Route path="new" element={<CreateCalendar />} />
              <Route path="edit" element={<EditCalendars />} />
              <Route path="view" element={<ViewCalendars />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
