import { fetchJson, postJson } from "./apiSettings";

export const getAllExamSchedules = async () => {
    return fetchJson("/examSchedules");
};

export const getExamScheduleById = async (scheduleId) => {
    return fetchJson(`/examSchedules/${scheduleId}`);
};

export const getExamSchedulesByDate = async (date) => {
    return fetchJson(`/examSchedules?date=${encodeURIComponent(date)}`);
};

export const createExamSchedule = async (examScheduleData) => {
    return postJson("/examSchedules", examScheduleData);
};