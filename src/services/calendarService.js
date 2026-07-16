import { deleteJson, fetchJson, patchJson, postJson, putJson } from "./apiSettings";

const toQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

export const getMyCalendars = async () => {
  return fetchJson("/calendars/mine");
};

export const getAllCalendars = async (params = {}) => {
  return fetchJson(`/calendars${toQueryString(params)}`);
};

export const createCalendar = async (calendarData) => {
  return postJson("/calendars", calendarData);
};

export const getCalendarMonthView = async (calendarId, params = {}) => {
  return fetchJson(
    `/calendars/${calendarId}/month-view${toQueryString(params)}`
  );
};

export const createCalendarClosure = async (calendarId, closureData) => {
  return postJson(`/calendars/${calendarId}/closures`, closureData);
};

export const deleteCalendarClosure = async (calendarId, closureId) => {
  return deleteJson(`/calendars/${calendarId}/closures/${closureId}`);
};

export const upsertCalendarDayLabel = async (
  calendarId,
  date,
  locationId,
  labelData
) => {
  return putJson(
    `/calendars/${calendarId}/days/${date}/locations/${locationId}/label`,
    labelData
  );
};

export const deleteCalendarDayLabel = async (calendarId, date, locationId) => {
  return deleteJson(
    `/calendars/${calendarId}/days/${date}/locations/${locationId}/label`
  );
};

export const createCalendarTestFamilyBadge = async (calendarId, badgeData) => {
  return postJson(`/calendars/${calendarId}/test-family-badges`, badgeData);
};

export const deleteCalendarTestFamilyBadge = async (calendarId, badgeId) => {
  return deleteJson(`/calendars/${calendarId}/test-family-badges/${badgeId}`);
};

export const createCalendarEmployeeBadge = async (calendarId, badgeData) => {
  return postJson(`/calendars/${calendarId}/employee-badges`, badgeData);
};

export const updateCalendarEmployeeBadge = async (
  calendarId,
  badgeId,
  badgeData
) => {
  return patchJson(
    `/calendars/${calendarId}/employee-badges/${badgeId}`,
    badgeData
  );
};

export const deleteCalendarEmployeeBadge = async (calendarId, badgeId) => {
  return deleteJson(`/calendars/${calendarId}/employee-badges/${badgeId}`);
};

export const createCalendarDayNote = async (calendarId, noteData) => {
  return postJson(`/calendars/${calendarId}/day-notes`, noteData);
};

export const updateCalendarDayNote = async (calendarId, noteId, noteData) => {
  return patchJson(`/calendars/${calendarId}/day-notes/${noteId}`, noteData);
};

export const deleteCalendarDayNote = async (calendarId, noteId) => {
  return deleteJson(`/calendars/${calendarId}/day-notes/${noteId}`);
};
