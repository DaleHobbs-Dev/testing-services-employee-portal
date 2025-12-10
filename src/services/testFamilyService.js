import { fetchJson, postJson, putJson } from "./apiSettings";

export const getAllTestFamilies = async () => {
    return fetchJson("/testFamilies");
};

export const getTestFamilyById = async (familyId) => {
    return fetchJson(`/testFamilies/${familyId}`);
};

export const createTestFamily = async (testFamilyData) => {
    return postJson("/testFamilies", testFamilyData);
}

export const updateTestFamily = async (familyId, updatedTestFamilyData) => {
    return putJson(`/testFamilies/${familyId}`, updatedTestFamilyData);
}