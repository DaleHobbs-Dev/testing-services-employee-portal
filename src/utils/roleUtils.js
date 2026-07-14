export const getEmployeeRoles = (employee) => {
  if (!employee) return [];
  if (Array.isArray(employee.roles)) return employee.roles.filter(Boolean);
  return employee.role ? [employee.role] : [];
};

export const employeeHasRole = (employee, allowedRoles) => {
  const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return getEmployeeRoles(employee).some((role) => allowed.includes(role));
};

export const formatRole = (role) =>
  role ? role.charAt(0).toUpperCase() + role.slice(1) : "";
