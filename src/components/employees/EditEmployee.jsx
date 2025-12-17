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
  getEmployeeCertificationsByEmployeeId,
  getEmployeePermissionsByEmployeeId,
  updateEmployeeCertification,
  updateEmployeePermission,
  createEmployeeCertification,
  createEmployeePermission,
} from "@/services";

export default function EditEmployee() {
  const { employeeId } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [employees, setEmployees] = useState([]); // for employeeCode uniqueness check
  const [certifications, setCertifications] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [employeeCertifications, setEmployeeCertifications] = useState([]);
  const [employeePermissions, setEmployeePermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -------------------------------
  // Load employee data on mount
  // -------------------------------
  useEffect(() => {
    Promise.all([
      getEmployeeById(employeeId),
      getAllEmployees(),
      getAllCertifications(),
      getAllPermissions(),
      getEmployeeCertificationsByEmployeeId(employeeId),
      getEmployeePermissionsByEmployeeId(employeeId),
    ])
      .then(([emp, allEmp, certs, perms, empCerts, empPerms]) => {
        setEmployee(emp);
        setEmployees(allEmp);
        setCertifications(certs);
        setPermissions(perms);
        setEmployeeCertifications(empCerts);
        setEmployeePermissions(empPerms);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load employee data.");
        setLoading(false);
      });
  }, [employeeId]);

  // -------------------------------
  // Submit updated employee data
  // -------------------------------
  const handleSubmit = async (formData) => {
    try {
      const { certificationIds, permissionIds, ...employeeData } = formData;

      await updateEmployee(employeeId, employeeData);

      // Handle certifications
      const currentCertIds = employeeCertifications.map(
        (ec) => ec.certificationId
      );

      // Soft delete removed certifications (mark as inactive)
      const certsToDelete = employeeCertifications.filter(
        (ec) => !certificationIds.includes(ec.certificationId)
      );
      for (const ec of certsToDelete) {
        await updateEmployeeCertification(ec.id, { active: false });
      }

      // Reactivate or add certifications
      const certsToAdd = certificationIds.filter(
        (id) => !currentCertIds.includes(id)
      );

      for (const certId of certsToAdd) {
        // Check if this cert was previously added (but soft-deleted)
        const existingCert = employeeCertifications.find(
          (ec) => ec.certificationId === certId && ec.active === false
        );

        if (existingCert) {
          // ✅ Reactivate existing cert (preserves dates!)
          await updateEmployeeCertification(existingCert.id, { active: true });
        } else {
          // ✅ Create new cert
          await createEmployeeCertification({
            employeeId: Number(employeeId),
            certificationId: certId,
            dateObtained: new Date().toISOString().split("T")[0], // Today's date
            expirationDate: null, // Or calculate based on cert type
            active: true,
          });
        }
      }

      // Handle permissions - delete old ones, add new ones
      const currentPermIds = employeePermissions.map((ep) => ep.permissionId);

      // soft delete removed permissions (mark as inactive)
      const permsToDelete = employeePermissions.filter(
        (ep) => !permissionIds.includes(ep.permissionId)
      );
      for (const ep of permsToDelete) {
        await updateEmployeePermission(ep.id, { active: false });
      }

      // Reactivate or add permissions
      const permsToAdd = permissionIds.filter(
        (id) => !currentPermIds.includes(id)
      );

      for (const permId of permsToAdd) {
        // Check if this perm was previously added (but soft-deleted)
        const existingPerm = employeePermissions.find(
          (ep) => ep.permissionId === permId && ep.active === false
        );

        if (existingPerm) {
          // ✅ Reactivate existing perm (preserves dates!)
          await updateEmployeePermission(existingPerm.id, { active: true });
        } else {
          // ✅ Create new perm
          await createEmployeePermission({
            employeeId: Number(employeeId),
            permissionId: permId,
            dateGranted: new Date().toISOString().split("T")[0], // Today's date
            active: true,
          });
        }
      }

      navigate("/employee-list");
    } catch (err) {
      console.error(err);
      setError("Failed to update employee. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/employee-list");
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <Container>
      <Section className="max-w-4xl mx-auto">
        <PageHeader
          title="Edit Employee"
          description="Update role, certifications, permissions, or contact details."
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
            employee={employee}
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
