import { fetchJson } from "./apiSettings";

export const getAllPermissions = async () => {
    return fetchJson("/permissions");
};