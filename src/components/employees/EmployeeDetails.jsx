import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Badge,
  H2,
  H3,
} from "@/components/ui";
import { Link } from "react-router-dom";

export default function EmployeeDetails({ employee, onClose, isOpen }) {
  if (!employee) return null;

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return parts
      .map((p) => p[0].toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader className="items-center mb-3 p-2 rounded-lg bg-primary-light/20 text-primary">
        <div className="flex items-center gap-4">
          {/* Initials avatar */}
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg shrink-0">
            {getInitials(employee.name)}
          </div>
          <div className="flex-1 text-center">
            <H2 className="mb-1">{employee.name}</H2>
            <p className="text-sm text-gray-600">{employee.email}</p>
          </div>
          <div className="w-12 shrink-0" /> {/* Spacer for balance */}
        </div>
      </ModalHeader>

      <ModalBody>
        {/* Status */}
        <div className="mb-4">
          <Badge
            size="xl"
            variant={employee.status === "active" ? "success" : employee.status}
          >
            {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
          </Badge>
        </div>

        {/* Role */}
        <div className="mb-6">
          <H3 underline>Role</H3>
          <Badge size="lg" variant={employee.role}>
            {employee.role.charAt(0).toUpperCase() + employee.role.slice(1)}
          </Badge>
        </div>

        {/* Phone */}
        {employee.phone && (
          <div className="mb-6">
            <H3 underline>Phone</H3>
            <p className="text-gray-800">{employee.phone}</p>
          </div>
        )}

        {/* Employee Code */}
        {employee.employeeCode && (
          <div className="mb-6">
            <H3 underline>Employee Code</H3>
            <p className="text-gray-800">{employee.employeeCode}</p>
          </div>
        )}

        {/* Certifications */}
        <div className="mb-6">
          <H3 underline>Certifications</H3>

          {employee.certifications && employee.certifications.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {employee.certifications.map((cert, i) => (
                <Badge key={i} variant="accent">
                  {cert}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No certifications listed.</p>
          )}
        </div>

        {/* Permissions */}
        <div className="mb-6">
          <H3 underline>Permissions</H3>
          {employee.permissions && employee.permissions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {employee.permissions.map((perm, i) => (
                <Badge key={i} variant="primary">
                  {perm}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No permissions assigned.</p>
          )}
        </div>

        {/* Notes */}
        <div className="mb-4">
          <H3 underline>Notes</H3>
          <p className="text-gray-800 whitespace-pre-line">
            {employee.notes || "No notes available."}
          </p>
        </div>
      </ModalBody>

      <ModalFooter className="flex justify-between">
        <Button onClick={onClose} variant="secondary" className="focus-ring">
          Close
        </Button>

        <Link to={`/admin-dashboard/employee-list/edit/${employee.id}`}>
          <Button variant="primary" className="focus-ring">
            Edit Employee
          </Button>
        </Link>
      </ModalFooter>
    </Modal>
  );
}
