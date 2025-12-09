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