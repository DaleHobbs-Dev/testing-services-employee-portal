import { fetchJson, postJson, putJson } from "./apiSettings";

export const getAllTestVariants = async () => {
    return fetchJson("/testVariants");
};

export const getTestVariantById = async (variantId) => {
    return fetchJson(`/testVariants/${variantId}`);
};

export const getTestVariantsExpandedByFamilyId = async () => {
    return fetchJson("/testVariants?expand=family");
}

export const getTestVariantsByFamilyId = async (familyId) => {
    return fetchJson(`/testVariants?familyId=${familyId}`);
};

export const createTestVariant = async (testVariant) => {
    return postJson("/testVariants", testVariant);
}

export const updateTestVariant = async (variantId, testVariant) => {
    return putJson(`/testVariants/${variantId}`, testVariant);
}