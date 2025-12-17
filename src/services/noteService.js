import { fetchJson, postJson } from "./apiSettings";

export const getAllNotes = async () => {
    return fetchJson("/notes");
};

export const getNoteByExamScheduleId = async (examScheduleId) => {
    return fetchJson(`/notes/${examScheduleId}`);
};

export const createNote = async (noteData) => {
    return postJson("/notes", noteData);
};

export const getNotesByScheduleId = async (scheduleId) => {
    const all = await fetchJson("/notes");
    return all.filter(note => note.examScheduleId === Number(scheduleId));
};