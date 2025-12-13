import "./PostItNote.css";
import { useState, useEffect, useMemo } from "react";
import { getAllActiveEmployees } from "../../services/employeeService";

export const PostItNote = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getAllActiveEmployees().then((data) => setEmployees(data));
  }, []);

  // Calculate random emails directly when component mounts or employees load
  const { adminEmail, nonAdminEmail } = useMemo(() => {
    if (employees.length === 0) {
      return {
        adminEmail: "No admin found",
        nonAdminEmail: "No employee found",
      };
    }

    const adminEmployees = employees.filter((emp) => emp.role === "admin");
    const proctorEmployees = employees.filter((emp) => emp.role === "proctor");

    const randomAdmin =
      adminEmployees.length > 0
        ? // eslint-disable-next-line react-hooks/purity
          adminEmployees[Math.floor(Math.random() * adminEmployees.length)]
        : null;

    const randomNonAdmin =
      proctorEmployees.length > 0
        ? proctorEmployees[
            // eslint-disable-next-line react-hooks/purity
            Math.floor(Math.random() * proctorEmployees.length)
          ]
        : null;

    return {
      adminEmail: randomAdmin?.email || "No admin found",
      nonAdminEmail: randomNonAdmin?.email || "No proctors found",
    };
  }, [employees]);

  return (
    <div className="postItContainer">
      <div className="postIt">
        <p className="message">
          <strong>Test Accounts:</strong>
          <br />
          <br />
          <strong>Admin:</strong>
          <br />
          {adminEmail}
          <br />
          <br />
          <strong>Proctor:</strong>
          <br />
          {nonAdminEmail}
        </p>
      </div>
      <div className="foldedCorner"></div>
    </div>
  );
};
