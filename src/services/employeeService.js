import { fetchJson } from "./apiSettings";

export const getAllEmployees = async () => {
    return fetchJson("/employees");
};

export const getEmployeeByEmail = async (email) => {
    return fetchJson(`/employees?email=${encodeURIComponent(email)}`);
};

export const getEmployeeByEmployeeId = async (employeeId) => {
    return fetchJson(`/employees/${employeeId}`);
};