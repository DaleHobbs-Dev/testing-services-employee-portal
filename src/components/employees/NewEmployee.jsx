import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Section,
  PageHeader,
  Alert,
  Spinner,
} from "@/components/ui";

import EmployeeForm from "./EmployeeForm";
import {
  getAllEmployees,
  getAllCertifications,
  getAllPermissions,
  createEmployee,
  createEmployeeSchedule,
} from "@/services";

export default function NewEmployee() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------------------------
  // Load data on mount
  // ---------------------------
  useEffect(() => {
    Promise.all([
      getAllEmployees(),
      getAllCertifications(),
      getAllPermissions(),
    ])
      .then(([emp, certs, perms]) => {
        setEmployees(emp);
        setCertifications(certs);
        setPermissions(perms);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load employee data.");
        setLoading(false);
      });
  }, []);

  // ---------------------------
  // Submit handler
  // ---------------------------
  const handleSubmit = async (formData) => {
    try {
      const newEmployee = await createEmployee(formData);

      await createEmployeeSchedule({
        employeeId: newEmployee.id,
        workDays: [],
        startTime: "",
        endTime: "",
      });

      navigate("/employee-list");
    } catch (error) {
      setError("Failed to create employee. Please try again.");
      console.error("Error creating employee:", error);
    }
  };

  // ---------------------------
  // Cancel handler
  // ---------------------------
  const handleCancel = () => {
    navigate("/employee-list");
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <Container>
      <Section className="max-w-4xl mx-auto">
        <PageHeader
          title="Add New Employee"
          description="Create a new staff member with role, permissions, and certification details."
          center
        />

        {error && (
          <Alert variant="danger" className="mb-6">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <EmployeeForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            certifications={certifications}
            permissions={permissions}
            allEmployees={employees}
          />
        )}
      </Section>
    </Container>
  );
}
