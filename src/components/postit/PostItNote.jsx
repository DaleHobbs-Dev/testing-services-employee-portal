import "./PostItNote.css";
import { useState, useEffect, useMemo } from "react";
import { getAllEmployees } from "../../services/employeeService";

export const PostItNote = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getAllEmployees().then((data) => setEmployees(data));
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
    const nonAdminEmployees = employees.filter((emp) => emp.role !== "admin");

    const randomAdmin =
      adminEmployees.length > 0
        ? // eslint-disable-next-line react-hooks/purity
          adminEmployees[Math.floor(Math.random() * adminEmployees.length)]
        : null;

    const randomNonAdmin =
      nonAdminEmployees.length > 0
        ? nonAdminEmployees[
            // eslint-disable-next-line react-hooks/purity
            Math.floor(Math.random() * nonAdminEmployees.length)
          ]
        : null;

    return {
      adminEmail: randomAdmin?.email || "No admin found",
      nonAdminEmail: randomNonAdmin?.email || "No employee found",
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
          <strong>Employee:</strong>
          <br />
          {nonAdminEmail}
        </p>
      </div>
      <div className="foldedCorner"></div>
    </div>
  );
};
