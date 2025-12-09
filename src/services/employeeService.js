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

export const getAllActiveEmployees = async () => {
    return fetchJson("/employees?status=active");
};

export const getAllInactiveEmployees = async () => {
    return fetchJson("/employees?status=inactive");
};

export const getEmployeeSchedules = async (employeeId) => {
    return fetchJson(`/employeeSchedules/${employeeId}`);
}