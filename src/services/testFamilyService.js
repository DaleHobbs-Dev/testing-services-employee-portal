import { fetchJson } from "./apiSettings";

export const getAllTestFamilies = async () => {
    return fetchJson("/testFamilies");
};

export const getTestFamilyById = async (familyId) => {
    return fetchJson(`/testFamilies/${familyId}`);
};