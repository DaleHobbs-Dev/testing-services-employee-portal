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

export const deleteTestFamily = async (familyId) => {
    // Get the current family data first
    const family = await fetchJson(`/testFamilies/${familyId}`);

    // Update with active: false while preserving all other fields
    return putJson(`/testFamilies/${familyId}`, {
        ...family,
        active: false,
    });
};

export const deleteTestFamilyWithVariants = async (familyId) => {
    // Get the family
    const family = await fetchJson(`/testFamilies/${familyId}`);

    // Mark family as inactive
    await putJson(`/testFamilies/${familyId}`, {
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