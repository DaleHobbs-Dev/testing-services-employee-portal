import { Routes, Route, Outlet } from "react-router-dom";
import { useCurrentUser } from "../context/CurrentUserContext.js";
import DesignSystem from "../pages/DesignSystem.jsx";
import AccessDenied from "../components/deniedaccess/AccessDenied.jsx";

export default function ApplicationViews() {
  const { currentUser } = useCurrentUser();

  if (currentUser === null) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Outlet />
          </>
        }
      >
        <Route path="/" element={<DesignSystem />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        {/* Add more routes here as needed */}
      </Route>
    </Routes>
  );
}
