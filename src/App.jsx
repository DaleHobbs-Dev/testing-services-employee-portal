import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ApplicationRoutes } from "@/routes";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<ApplicationRoutes />} />
    </Routes>
  );
}

export default App;
