import { fetchJson, putJson, postJson } from "./apiSettings";

export const getAllEmployeeSchedules = async () => {
    return fetchJson("/employeeSchedules");
};

export const updateEmployeeSchedule = async (scheduleId, scheduleData) => {
    return putJson(`/employeeSchedules/${scheduleId}`, scheduleData);
};

export const createEmployeeSchedule = async (scheduleData) => {
    return postJson("/employeeSchedules", scheduleData);
};