import { fetchJson, postJson, putJson } from "./apiSettings.js";

const normalizeLocationList = (response) => {
    if (Array.isArray(response)) return response;
    return response?.locations || response?.items || [];
};

const normalizeLocation = (response) => response?.location || response;

export async function getAllLocations() {
    return fetchJson("/locations", { cache: "no-store" }).then(normalizeLocationList);
}

export async function getLocationById(locationId) {
    return fetchJson(`/locations/${locationId}`, { cache: "no-store" }).then(normalizeLocation);
}

export async function createLocation(locationData) {
    return postJson("/locations", locationData);
}

export async function updateLocation(locationId, locationData) {
    return putJson(`/locations/${locationId}`, locationData);
}
