import { fetchJson, putJson, postJson } from "./apiSettings";

export const getAllEmployeePermissions = async () => {
    return fetchJson("/employeePermissions");
};

export const getEmployeePermissionsByEmployeeId = async (employeeId) => {
    const all = await fetchJson("/employeePermissions");
    return all.filter(ep => ep.employeeId === Number(employeeId) && ep.active !== false);
    // ✅ Only return active permissions by default
};

export const updateEmployeePermission = async (id, data) => {
    return putJson(`/employeePermissions/${id}`, data);
};

export const createEmployeePermission = async (data) => {
    return postJson("/employeePermissions", {
        ...data,
        active: true,  // ✅ Always create as active
    });
};