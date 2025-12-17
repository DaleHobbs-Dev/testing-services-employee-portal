import { fetchJson } from "./apiSettings";

export const getAllCertifications = async () => {
    return fetchJson("/certifications");
};
