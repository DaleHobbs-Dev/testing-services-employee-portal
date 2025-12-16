import { fetchJson, postJson, putJson } from "./apiSettings";
import { getTestVariantsByFamilyId } from "./testVariantService.js";

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

export const deleteTestFamily = async (familyId) => {
    await putJson(`/testFamilies/${familyId}`, { active: false });

    const variants = await getTestVariantsByFamilyId(familyId);
    await Promise.all(
        variants.map(v => putJson(`/testVariants/${v.id}`, { active: false }))
    );
};