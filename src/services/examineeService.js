import { fetchJson, postJson } from "./apiSettings";

export const getAllExaminees = async () => {
    return fetchJson("/examinees");
};

export const getExamineeByEmail = async (email) => {
    return fetchJson(`/examinees/email/${email}`);
};

export const createExaminee = async (examineeData) => {
    return postJson("/examinees", examineeData);
};