import { fetchJson, postJson, putJson } from "./apiSettings";

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
    return postJson("/employees", employeeData);
};

export const updateEmployee = async (employeeId, employeeData) => {
    return putJson(`/employees/${employeeId}`, employeeData);
};