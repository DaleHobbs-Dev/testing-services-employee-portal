import { fetchJson } from "./apiSettings";

export const getAllTestVariants = async () => {
    return fetchJson("/testVariants");
};

export const getTestVariantById = async (variantId) => {
    return fetchJson(`/testVariants/${variantId}`);
};

export const getTestVariantsExpandedByFamilyId = async () => {
    return fetchJson("/testVariants?expand=family");
}