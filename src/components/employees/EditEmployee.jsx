import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Container,
  Section,
  PageHeader,
  Alert,
  Spinner,
} from "@/components/ui";

import EmployeeForm from "./EmployeeForm";
import {
  getEmployeeById,
  getAllCertifications,
  getAllPermissions,
  getAllEmployees,
  updateEmployee,
} from "@/services";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [employees, setEmployees] = useState([]); // for employeeCode uniqueness check
  const [certifications, setCertifications] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -------------------------------
  // Load employee data on mount
  // -------------------------------
  useEffect(() => {
    Promise.all([
      getEmployeeById(id),
      getAllEmployees(),
      getAllCertifications(),
      getAllPermissions(),
    ])
      .then(([emp, allEmp, certs, perms]) => {
        setEmployee(emp);
        setEmployees(allEmp);
        setCertifications(certs);
        setPermissions(perms);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load employee data.");
        setLoading(false);
      });
  }, [id]);

  // -------------------------------
  // Submit updated employee data
  // -------------------------------
  const handleSubmit = async (formData) => {
    try {
      await updateEmployee(id, formData);
      navigate("/admin-dashboard/employee-list");
    } catch (err) {
      console.error(err);
      setError("Failed to update employee. Please try again.");
    }
  };

  // -------------------------------
  // Cancel → return to list
  // -------------------------------
  const handleCancel = () => {
    navigate("/admin-dashboard/employee-list");
  };

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <Container>
      <Section className="max-w-4xl mx-auto">
        <PageHeader
          title="Edit Employee"
          description="Update role, certifications, permissions, or contact details."
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
            initialData={employee}
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
