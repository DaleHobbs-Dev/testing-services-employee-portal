import { fetchJson, putJson, postJson } from "./apiSettings";

export const getAllEmployeeCertifications = async () => {
    return fetchJson("/employeeCertifications");
};

export const getEmployeeCertificationsByEmployeeId = async (employeeId) => {
    const all = await fetchJson("/employeeCertifications");
    return all.filter(ec => ec.employeeId === Number(employeeId) && ec.active !== false);
    // ✅ Only return active certifications by default
};

export const updateEmployeeCertification = async (id, data) => {
    return putJson(`/employeeCertifications/${id}`, data);
};

export const createEmployeeCertification = async (data) => {
    return postJson("/employeeCertifications", {
        ...data,
        active: true,  // ✅ Always create as active
    });
};