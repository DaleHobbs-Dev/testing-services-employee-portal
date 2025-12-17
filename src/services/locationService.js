import { fetchJson, postJson, putJson } from "./apiSettings.js";

export async function getAllLocations() {
    return fetchJson("/locations");
}

export async function getLocationById(locationId) {
    return fetchJson(`/locations/${locationId}`);
}

export async function createLocation(locationData) {
    return postJson("/locations", locationData);
}

export async function updateLocation(locationId, locationData) {
    return putJson(`/locations/${locationId}`, locationData);
}