import { fetchJson, patchJson, putJson } from "./apiSettings";
import { register } from "./authService";
import { toApiRole } from "@/utils/roleUtils";
import { normalizeEmployee, normalizeEmployeeList } from "@/utils/employeeUtils";

export const getAllEmployees = async () => {
    return fetchJson("/employees", { cache: "no-store" }).then(normalizeEmployeeList);
};

export const getEmployeeDirectory = async () => {
    return fetchJson("/employees/directory", { cache: "no-store" }).then(normalizeEmployeeList);
};

export const getEmployeeByEmail = async (email) => {
    return fetchJson(`/employees?email=${encodeURIComponent(email)}`, { cache: "no-store" }).then(
        normalizeEmployeeList
    );
};

export const getEmployeeById = async (employeeId) => {
    return fetchJson(`/employees/${employeeId}`, { cache: "no-store" }).then(normalizeEmployee);
};

export const getAllActiveEmployees = async () => {
    return fetchJson("/employees?status=ACTIVE", { cache: "no-store" }).then(normalizeEmployeeList);
};

export const getAllInactiveEmployees = async () => {
    return fetchJson("/employees?status=INACTIVE", { cache: "no-store" }).then(normalizeEmployeeList);
};

export const getEmployeeSchedules = async (employeeId) => {
    return fetchJson(`/employeeSchedules/${employeeId}`, { cache: "no-store" });
};

export const createEmployee = async (employeeData) => {
    const { employee } = await register(employeeData);
    return employee;
};

export const updateEmployee = async (employeeId, employeeData) => {
    return putJson(`/employees/${employeeId}`, employeeData);
};

export const updateEmployeeRoles = async (employeeId, roles) => {
    return patchJson(`/employees/${employeeId}/roles`, {
        roles: roles.map(toApiRole),
    });
};
