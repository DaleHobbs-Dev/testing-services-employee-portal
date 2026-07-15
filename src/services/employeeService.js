import { fetchJson, patchJson, putJson } from "./apiSettings";
import { register } from "./authService";
import { toApiRole } from "@/utils/roleUtils";

export const getAllEmployees = async () => {
    return fetchJson("/employees");
};

export const getEmployeeByEmail = async (email) => {
    return fetchJson(`/employees?email=${encodeURIComponent(email)}`);
};

export const getEmployeeById = async (employeeId) => {
    return fetchJson(`/employees/${employeeId}`);
};

export const getAllActiveEmployees = async () => {
    return fetchJson("/employees?status=active");
};

export const getAllInactiveEmployees = async () => {
    return fetchJson("/employees?status=inactive");
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
