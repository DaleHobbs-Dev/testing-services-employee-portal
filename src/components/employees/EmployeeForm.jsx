import { useState, useMemo } from "react";
import {
  Button,
  Input,
  FormField,
  Select,
  Textarea,
  Section,
} from "@/components/ui";

export default function EmployeeForm({
  employee = null, // if editing, employee object will be passed in
  onSubmit, // function to call with final form data
  onCancel, // navigate back or close modal
  certifications = [], // array from /certifications endpoint
  permissions = [], // array from /permissions endpoint
  allEmployees = [], // optional: to validate unique employeeCode
}) {
  // ------------------------------------------
  // 1. Form State (controlled inputs)
  // ------------------------------------------
  const [formData, setFormData] = useState({
    name: employee?.name || "",
    email: employee?.email || "",
    role: employee?.role || "",
    status: employee?.status || "active",
    phone: employee?.phone || "",
    notes: employee?.notes || "",
    employeeCode: employee?.employeeCode || "",
    certificationIds: employee?.certificationIds || [],
    permissionIds: employee?.permissionIds || [],
  });

  // ------------------------------------------
  // 2. Handle simple input changes
  // ------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ------------------------------------------
  // 3. Handle checkbox groups
  // ------------------------------------------
  const toggleIdInList = (listName, id) => {
    setFormData((prev) => {
      const list = prev[listName];
      const updated = list.includes(id)
        ? list.filter((x) => x !== id)
        : [...list, id];

      return { ...prev, [listName]: updated };
    });
  };

  // ------------------------------------------
  // 4. Validate employee code uniqueness
  // ------------------------------------------
  const codeError = useMemo(() => {
    if (!formData.employeeCode) {
      return "";
    }

    const duplicate = allEmployees.find(
      (e) => e.employeeCode === formData.employeeCode && e.id !== employee?.id
    );

    return duplicate ? "This employee code is already in use." : "";
  }, [formData.employeeCode, allEmployees, employee?.id]);

  // ------------------------------------------
  // 5. Handle Submit
  // ------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (codeError) return;

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-xl mx-auto">
      {/* ============================ */}
      {/* Basic Information */}
      {/* ============================ */}
      <Section>
        <h2 className="text-xl font-semibold mb-4 text-purple-700">
          Basic Information
        </h2>

        <FormField label="Name">
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormField>

        <FormField label="Email">
          <Input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            required
          />
        </FormField>

        <FormField label="Phone">
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            type="tel"
          />
        </FormField>

        <FormField label="Role">
          <Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select role…</option>
            <option value="admin">Admin</option>
            <option value="proctor">Proctor</option>
            <option value="scheduler">Scheduler</option>
            <option value="frontdesk">Front Desk</option>
            <option value="checkin">Check-in</option>
            <option value="technician">Technician</option>
            <option value="clerk">Clerk</option>
          </Select>
        </FormField>

        <FormField label="Status">
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="restricted">Restricted</option>
          </Select>
        </FormField>
      </Section>

      {/* ============================ */}
      {/* Employee Code */}
      {/* ============================ */}
      <Section>
        <FormField label="Employee Code">
          <Input
            name="employeeCode"
            value={formData.employeeCode}
            onChange={handleChange}
            required
            className={codeError ? "border-danger-500" : ""}
          />
          {codeError && (
            <p className="text-red-600 text-sm mt-1">{codeError}</p>
          )}
        </FormField>
      </Section>

      {/* ============================ */}
      {/* Certifications (checkbox list) */}
      {/* ============================ */}
      <Section>
        <h2 className="text-xl font-semibold mb-3 text-purple-700">
          Certifications
        </h2>

        <div className="space-y-2">
          {certifications.map((cert) => (
            <label
              key={cert.id}
              className="flex gap-2 items-center cursor-pointer"
            >
              <input
                type="checkbox"
                checked={formData.certificationIds.includes(cert.id)}
                onChange={() => toggleIdInList("certificationIds", cert.id)}
              />
              <span>{cert.label}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* ============================ */}
      {/* Permissions */}
      {/* ============================ */}
      <Section>
        <h2 className="text-xl font-semibold mb-3 text-purple-700">
          Permissions
        </h2>

        <div className="space-y-2">
          {permissions.map((perm) => (
            <label
              key={perm.id}
              className="flex gap-2 items-center cursor-pointer"
            >
              <input
                type="checkbox"
                checked={formData.permissionIds.includes(perm.id)}
                onChange={() => toggleIdInList("permissionIds", perm.id)}
              />
              <span>{perm.label}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* ============================ */}
      {/* Notes */}
      {/* ============================ */}
      <Section>
        <FormField label="Notes">
          <Textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Internal notes about this employee..."
          />
        </FormField>
      </Section>

      {/* ============================ */}
      {/* Buttons */}
      {/* ============================ */}
      <div className="flex justify-between mt-8">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="focus-ring"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          disabled={!!codeError}
          className="focus-ring"
        >
          Save Employee
        </Button>
      </div>
    </form>
  );
}
