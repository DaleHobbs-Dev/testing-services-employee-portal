export const EMPLOYEE_ROLES = [
  "admin",
  "proctor",
  "scheduler",
  "frontdesk",
  "checkin",
  "technician",
  "clerk",
  "unassigned",
];

export const ROLE_API_VALUES = {
  admin: "ADMIN",
  proctor: "PROCTOR",
  scheduler: "SCHEDULER",
  frontdesk: "FRONTDESK",
  checkin: "CHECKIN",
  technician: "TECHNICIAN",
  clerk: "CLERK",
  unassigned: "UNASSIGNED",
};

export const normalizeRole = (role) =>
  typeof role === "string" ? role.toLowerCase() : "";

export const toApiRole = (role) => ROLE_API_VALUES[normalizeRole(role)] || role;

export const getEmployeeRoles = (employee) => {
  if (!employee) return [];
  const roles = Array.isArray(employee.roles)
    ? employee.roles
    : employee.role
      ? [employee.role]
      : [];

  return roles.map(normalizeRole).filter(Boolean);
};

export const employeeHasRole = (employee, allowedRoles) => {
  const allowed = (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles])
    .map(normalizeRole)
    .filter(Boolean);

  return getEmployeeRoles(employee).some((role) => allowed.includes(role));
};

export const formatRole = (role) =>
  role
    ? normalizeRole(role).charAt(0).toUpperCase() + normalizeRole(role).slice(1)
    : "";
