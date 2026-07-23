import { normalizeEmployeeStatus } from "@/utils/employeeUtils";

export const isActiveEmployee = (employee) => {
  if (typeof employee?.active === "boolean") {
    return employee.active;
  }

  return normalizeEmployeeStatus(employee?.status) === "active";
};

export const filterActiveEmployees = (employees = []) =>
  employees.filter(isActiveEmployee);

export const filterActiveTestFamilies = (testFamilies = []) =>
  testFamilies.filter((testFamily) => testFamily?.active === true);
