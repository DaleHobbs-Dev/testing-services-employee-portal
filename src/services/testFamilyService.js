import { deleteJson, fetchJson, patchJson, postJson } from "./apiSettings";

const TEST_FAMILIES_ENDPOINT = "/test-families";

const normalizeTestFamilyList = (response) => {
    if (Array.isArray(response)) return response;
    return response?.testFamilies || response?.items || [];
};

const normalizeTestFamily = (response) => response?.testFamily || response;

export const getAllTestFamilies = async () => {
    return fetchJson(TEST_FAMILIES_ENDPOINT, { cache: "no-store" }).then(normalizeTestFamilyList);
};

export const getTestFamilyById = async (familyId) => {
    return fetchJson(`${TEST_FAMILIES_ENDPOINT}/${familyId}`, { cache: "no-store" }).then(normalizeTestFamily);
};

export const createTestFamily = async (testFamilyData) => {
    return postJson(TEST_FAMILIES_ENDPOINT, testFamilyData);
}

export const updateTestFamily = async (familyId, updatedTestFamilyData) => {
    return patchJson(`${TEST_FAMILIES_ENDPOINT}/${familyId}`, updatedTestFamilyData);
}

export const deleteTestFamily = async (familyId) => {
    return deleteJson(`${TEST_FAMILIES_ENDPOINT}/${familyId}`);
};

export const deleteTestFamilyWithVariants = async (familyId) => {
    return deleteTestFamily(familyId);
};
