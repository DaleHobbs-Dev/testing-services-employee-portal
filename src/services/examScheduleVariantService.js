import { fetchJson, postJson, putJson, deleteJson } from "./apiSettings";

export const getExamScheduleVariantsByScheduleId = async (scheduleId) => {
    const all = await fetchJson("/examScheduleVariants");
    return all.filter(esv => esv.examScheduleId === Number(scheduleId));
};

export const createExamScheduleVariant = async (data) => {
    return postJson("/examScheduleVariants", {
        ...data,
        status: data.status || "scheduled",
        actualStartTime: data.actualStartTime || null,
        actualEndTime: data.actualEndTime || null,
        score: data.score || null,
        notes: data.notes || "",
    });
};

export const getAllExamScheduleVariants = async () => {
    return fetchJson("/examScheduleVariants");
};

export const updateExamScheduleVariant = async (id, data) => {
    return putJson(`/examScheduleVariants/${id}`, data);
};

export const deleteExamScheduleVariant = async (id) => {
    return deleteJson(`/examScheduleVariants/${id}`);
};