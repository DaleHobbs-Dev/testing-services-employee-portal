import { fetchJson, patchJson, putJson } from "./apiSettings";
import { register } from "./authService";
import { toApiRole } from "@/utils/roleUtils";
import { normalizeEmployee, normalizeEmployeeList } from "@/utils/employeeUtils";

export const getAllEmployees = async () => {
    return fetchJson("/employees").then(normalizeEmployeeList);
};

export const getEmployeeDirectory = async () => {
    return fetchJson("/employees/directory").then(normalizeEmployeeList);
};

export const getEmployeeByEmail = async (email) => {
    return fetchJson(`/employees?email=${encodeURIComponent(email)}`).then(
        normalizeEmployeeList
    );
};

export const getEmployeeById = async (employeeId) => {
    return fetchJson(`/employees/${employeeId}`).then(normalizeEmployee);
};

export const getAllActiveEmployees = async () => {
    return fetchJson("/employees?status=ACTIVE").then(normalizeEmployeeList);
};

export const getAllInactiveEmployees = async () => {
    return fetchJson("/employees?status=INACTIVE").then(normalizeEmployeeList);
};

export const getEmployeeSchedules = async (employeeId) => {
    return fetchJson(`/employeeSchedules/${employeeId}`);
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
