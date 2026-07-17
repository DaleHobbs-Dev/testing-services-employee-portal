import { useEffect, useState } from "react";
import {
  Button,
  PageHeader,
  Section,
  Container,
  Badge,
  Spinner,
  EmployeeDetails,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
} from "@/components";
import {
  getAllEmployees,
  // getAllCertifications,
  // getAllPermissions,
  // getAllEmployeeCertifications,
  // getAllEmployeePermissions,
  updateEmployeeRoles,
} from "@/services";
import { useCurrentUser } from "@/context";
import {
  EMPLOYEE_ROLES,
  employeeHasRole,
  formatRole,
  getEmployeeRoles,
} from "@/utils/roleUtils";
import {
  formatEmployeeStatus,
  getEmployeeDisplayName,
  normalizeEmployeeStatus,
} from "@/utils/employeeUtils";

export function EmployeeList() {
  const { currentUser } = useCurrentUser();
  const [employees, setEmployees] = useState([]);
  // Certifications and permissions are temporarily disabled until the backend
  // endpoints are available.
  // const [certifications, setCertifications] = useState([]);
  // const [permissions, setPermissions] = useState([]);
  // const [employeeCertifications, setEmployeeCertifications] = useState([]);
  // const [employeePermissions, setEmployeePermissions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [roleEmployee, setRoleEmployee] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingRoles, setSavingRoles] = useState(false);
  const [roleError, setRoleError] = useState("");
  const [roleSuccess, setRoleSuccess] = useState("");

  const canModifyRoles = employeeHasRole(currentUser, ["admin", "technician"]);

  useEffect(() => {
    // Fetch only employee data for now. The permissions/certifications
    // endpoints are not built yet.
    Promise.all([
      getAllEmployees(),
      // getAllCertifications(),
      // getAllPermissions(),
      // getAllEmployeeCertifications(),
      // getAllEmployeePermissions(),
    ])
      .then(([empData]) => {
        setEmployees(empData);
        // setCertifications(certData);
        // setPermissions(permData);
        // setEmployeeCertifications(empCertData);
        // setEmployeePermissions(empPermData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
  };

  const isCurrentEmployee = (employee) =>
    String(employee?.id) === String(currentUser?.id);

  const roleEmployeeRoles = getEmployeeRoles(roleEmployee);
  const roleEmployeeIsTechnician = roleEmployeeRoles.includes("technician");
  const editableRoles = EMPLOYEE_ROLES.filter(
    (role) => role !== "technician" || roleEmployeeIsTechnician
  );

  const openRoleModal = (employee) => {
    setRoleEmployee(employee);
    setSelectedRoles(getEmployeeRoles(employee));
    setRoleError("");
    setRoleSuccess("");
  };

  const closeRoleModal = () => {
    if (savingRoles) return;
    setRoleEmployee(null);
    setSelectedRoles([]);
    setRoleError("");
  };

  const toggleRole = (role) => {
    if (role === "technician") return;

    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((selectedRole) => selectedRole !== role)
        : [...prev, role]
    );
  };

  const handleSaveRoles = async () => {
    if (!roleEmployee || selectedRoles.length === 0) return;

    setSavingRoles(true);
    setRoleError("");

    try {
      const nextRoles = selectedRoles.filter((role) => role !== "technician");

      if (roleEmployeeIsTechnician) {
        nextRoles.push("technician");
      }

      const response = await updateEmployeeRoles(roleEmployee.id, nextRoles);
      const updatedEmployee = response?.employee || response || {
        ...roleEmployee,
        roles: nextRoles,
      };

      setEmployees((prev) =>
        prev.map((employee) =>
          employee.id === roleEmployee.id
            ? { ...employee, ...updatedEmployee }
            : employee
        )
      );
      setSelectedEmployee((prev) =>
        prev?.id === roleEmployee.id ? { ...prev, ...updatedEmployee } : prev
      );
      setRoleSuccess(`Updated roles for ${getEmployeeDisplayName(roleEmployee)}.`);
      setRoleEmployee(null);
      setSelectedRoles([]);
    } catch (err) {
      console.error(err);
      setRoleError(
        err?.body?.message || "Unable to update roles. Please try again."
      );
    } finally {
      setSavingRoles(false);
    }
  };

  return (
    <Container>
      <Section className="max-w-6xl mx-auto">
        <PageHeader
          title="Employee Management"
          description="View and manage all testing center employees."
          center
        />

        {roleSuccess && (
          <div className="mb-6">
            <Alert variant="success">{roleSuccess}</Alert>
          </div>
        )}

        <div className="mb-4 text-sm text-adaptive-muted">
          Select an employee row to view details.
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp) => {
                const isSelf = isCurrentEmployee(emp);

                return (
                  <TableRow
                    key={emp.id}
                    className="cursor-pointer"
                    onClick={() => handleViewDetails(emp)}
                  >
                    <TableCell className="font-medium">
                      {getEmployeeDisplayName(emp)}
                    </TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {getEmployeeRoles(emp).map((role) => (
                          <Badge key={role} size="sm" variant={role}>
                            {formatRole(role)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          normalizeEmployeeStatus(emp.status) === "active"
                            ? "success"
                            : normalizeEmployeeStatus(emp.status)
                        }
                      >
                        {formatEmployeeStatus(emp.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant={isSelf ? "secondary" : "primary"}
                        disabled={!canModifyRoles || isSelf}
                        className={
                          !canModifyRoles || isSelf
                            ? "opacity-60 cursor-not-allowed"
                            : "focus-ring"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          openRoleModal(emp);
                        }}
                      >
                        Edit Roles
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Section>

      <Modal isOpen={!!roleEmployee} onClose={closeRoleModal}>
        <ModalHeader onClose={closeRoleModal}>
          <div>
            <h2 className="text-xl font-semibold text-primary-dark">
              Modify Roles
            </h2>
            <p className="text-sm text-gray-600">
              {getEmployeeDisplayName(roleEmployee)}
            </p>
          </div>
        </ModalHeader>
        <ModalBody>
          {roleError && (
            <div className="mb-4">
              <Alert variant="error">{roleError}</Alert>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {editableRoles.map((role) => {
              const isLockedTechnicianRole = role === "technician";

              return (
                <label
                  key={role}
                  className={`flex items-center gap-2 rounded border border-adaptive bg-adaptive px-3 py-2 text-adaptive ${
                    isLockedTechnicianRole ? "opacity-70" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role)}
                    disabled={isLockedTechnicianRole}
                    onChange={() => toggleRole(role)}
                  />
                  <span>{formatRole(role)}</span>
                </label>
              );
            })}
          </div>
          {selectedRoles.length === 0 && (
            <p className="text-red-600 text-sm mt-2">
              Select at least one role.
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={closeRoleModal}
            disabled={savingRoles}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveRoles}
            disabled={savingRoles || selectedRoles.length === 0}
            className={
              savingRoles || selectedRoles.length === 0
                ? "opacity-60 cursor-not-allowed"
                : "focus-ring"
            }
          >
            {savingRoles ? "Saving..." : "Save Roles"}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Employee Details Modal */}
      <EmployeeDetails
        employee={selectedEmployee}
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </Container>
  );
}
