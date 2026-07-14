import { fetchJson, postJson } from "./apiSettings";

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
  return normalizeAuthResponse(await postJson("/auth/register", employeeData));
};

export const getCurrentEmployee = async () => {
  return fetchJson("/auth/me");
};

export const logout = async () => {
  return postJson("/auth/logout", {});
};
