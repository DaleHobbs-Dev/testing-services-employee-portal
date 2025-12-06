import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login.jsx";
import Authorized from "./views/Authorized.jsx";
import ApplicationViews from "./views/ApplicationViews.jsx";
import AccessDenied from "./components/deniedaccess/AccessDenied.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="*"
        element={
          <Authorized>
            <Routes>
              <Route path="/access-denied" element={<AccessDenied />} />
              <Route path="/*" element={<ApplicationViews />} />
            </Routes>
          </Authorized>
        }
      />
    </Routes>
  );
}

export default App;
