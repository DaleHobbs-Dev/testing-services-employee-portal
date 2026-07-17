import { fetchJson, postJson, putJson } from "./apiSettings";

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
    return putJson(`${TEST_FAMILIES_ENDPOINT}/${familyId}`, updatedTestFamilyData);
}

export const deleteTestFamily = async (familyId) => {
    // Get the current family data first
    const family = await getTestFamilyById(familyId);

    // Update with active: false while preserving all other fields
    return putJson(`${TEST_FAMILIES_ENDPOINT}/${familyId}`, {
        ...family,
        active: false,
    });
};

export const deleteTestFamilyWithVariants = async (familyId) => {
    // Get the family
    const family = await getTestFamilyById(familyId);

    // Mark family as inactive
    await putJson(`${TEST_FAMILIES_ENDPOINT}/${familyId}`, {
        ...family,
        active: false,
    });

    // Get all variants for this family
    const allVariants = await fetchJson("/testVariants");
    const familyVariants = allVariants.filter(v => v.familyId === familyId);

    // Mark all variants as inactive
    for (const variant of familyVariants) {
        await putJson(`/testVariants/${variant.id}`, {
            ...variant,
            active: false,
        });
    }
};
