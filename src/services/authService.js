import { fetchJson, patchJson, postJson } from "./apiSettings";

const normalizeAuthResponse = (response) => {
  const employee =
    response?.employee || response?.user || response?.currentUser || response;

  return {
    employee,
    token: response?.token || response?.accessToken || response?.jwt || null,
  };
};

export const login = async (credentials) => {
  return normalizeAuthResponse(await postJson("/auth/login", credentials));
};

export const register = async (employeeData) => {
  return postJson("/auth/register", employeeData);
};

export const changePassword = async (passwordData) => {
  return patchJson("/auth/password", passwordData);
};

export const getCurrentEmployee = async () => {
  return fetchJson("/auth/me", { cache: "no-store" });
};

export const logout = async () => {
  return postJson("/auth/logout", {});
};
