import { fetchJson } from "./apiSettings";

export const getAllWorkstations = async () => {
    return fetchJson("/workstations");
};

export const getWorkstationById = async (workstationId) => {
    return fetchJson(`/workstations/${workstationId}`);
};