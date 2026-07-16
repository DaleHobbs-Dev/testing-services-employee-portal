export const normalizeEmployeeList = (response) => {
  if (Array.isArray(response)) return response;
  return response?.employees || response?.items || [];
};

export const normalizeEmployee = (response) => response?.employee || response;

export const getEmployeeDisplayName = (employee) => {
  if (!employee) return "Employee";

  if (employee.name) return employee.name;

  const fullName = [employee.firstName, employee.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || employee.email || "Employee";
};

export const getEmployeeInitials = (employee) => {
  const name = getEmployeeDisplayName(employee);
  const parts = name.trim().split(/\s+/);

  return (
    parts
      .map((part) => part[0]?.toUpperCase())
      .filter(Boolean)
      .join("")
      .slice(0, 2) || "?"
  );
};

export const normalizeEmployeeStatus = (status) =>
  typeof status === "string" ? status.toLowerCase() : "";

export const formatEmployeeStatus = (status) => {
  const normalized = normalizeEmployeeStatus(status);
  return normalized
    ? normalized.charAt(0).toUpperCase() + normalized.slice(1)
    : "Unknown";
};
